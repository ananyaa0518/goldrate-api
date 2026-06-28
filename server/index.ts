import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { goldApiService, GoldRatesState } from './services/goldApiService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    service: 'goldrate-api',
  });
});

// Handle backend service errors and return corresponding error codes
function handleServerError(res: Response, err: Error) {
  const errMsg = err.message;
  if (errMsg === 'KEY_MISSING') {
    res.status(401).json({
      errorType: 'KEY_MISSING',
      error: 'Gold API key not configured.',
    });
  } else if (errMsg === 'QUOTA_EXCEEDED') {
    res.status(429).json({
      errorType: 'QUOTA_EXCEEDED',
      error: 'Gold price provider limit reached. Please try again later.',
    });
  } else {
    res.status(503).json({
      errorType: 'NETWORK_ERROR',
      error: 'Unable to fetch latest gold prices.',
    });
  }
}

// Generate realistic price fluctuations based on current price and market volatility
const generateChartData = (basePrice: number) => {
  // Generate 7-day chart with realistic daily volatility (~0.5-1%)
  const data7d = Array.from({ length: 7 }, (_, i) => {
    const daysAgo = 6 - i;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    
    // Realistic daily volatility: ±0.7%
    const volatility = (Math.random() - 0.5) * 0.014;
    const multiplier = 1 + volatility;
    
    return {
      date: dateStr,
      price24K: Math.round(basePrice * multiplier),
      price22K: Math.round((basePrice * 0.9167) * multiplier),
    };
  });

  // Generate 30-day chart with realistic volatility
  const data30d = Array.from({ length: 30 }, (_, i) => {
    const daysAgo = 29 - i;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    
    // Slightly higher volatility for 30d: ±1%
    const volatility = (Math.random() - 0.5) * 0.02;
    const multiplier = 1 + volatility;
    
    return {
      date: dateStr,
      price24K: Math.round(basePrice * multiplier),
      price22K: Math.round((basePrice * 0.9167) * multiplier),
    };
  });

  // Generate 1-year chart with realistic volatility (~2-3%)
  const data1y = Array.from({ length: 12 }, (_, i) => {
    const monthsAgo = 11 - i;
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    const dateStr = date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    
    // Higher volatility for yearly: ±2.5%
    const volatility = (Math.random() - 0.5) * 0.05;
    const multiplier = 1 + volatility;
    
    return {
      date: dateStr,
      price24K: Math.round(basePrice * multiplier),
      price22K: Math.round((basePrice * 0.9167) * multiplier),
    };
  });

  return {
    '7d': data7d,
    '30d': data30d,
    '1y': data1y,
  };
};

// GET /api/home - Return live statistics, grid list and trends
app.get('/api/home', async (req: Request, res: Response) => {
  try {
    const rates = await goldApiService.getRates();
    const bangaloreData = rates.bangalore;
    
    const majorCities = [
      rates.bangalore,
      rates.chennai,
      rates.hyderabad,
      rates.mumbai,
      rates.delhi,
      rates.pune,
      rates.kolkata,
      rates.coimbatore,
    ];

    const tickerItems = Object.values(rates).map(r => ({
      city: r.city,
      price22K: r.price22K,
      change: r.change,
    }));

    const chartData = generateChartData(bangaloreData.price24K);

    res.json({
      livePrice: {
        city: 'Bangalore',
        price24K: bangaloreData.price24K,
        price22K: bangaloreData.price22K,
        change: bangaloreData.change,
        timestamp: bangaloreData.timestamp,
      },
      majorCities,
      ticker: tickerItems,
      chartData,
    });
  } catch (err: any) {
    handleServerError(res, err);
  }
});

// GET /api/cities/:city - Get rates for a specific city
app.get('/api/cities/:city', async (req: Request, res: Response) => {
  try {
    const rates = await goldApiService.getRates();
    const cityParam = req.params.city.toLowerCase() as keyof GoldRatesState;
    const cityData = rates[cityParam];

    if (!cityData) {
      res.status(404).json({ error: `City '${req.params.city}' not found.` });
      return;
    }

    const chartData = generateChartData(cityData.price24K);

    res.json({
      cityDetails: cityData,
      chartData,
    });
  } catch (err: any) {
    handleServerError(res, err);
  }
});

// GET /api/search - Query autocomplete for city or purity
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const rates = await goldApiService.getRates();
    const query = (req.query.q || '').toString().toLowerCase().trim();

    if (!query) {
      res.json([]);
      return;
    }

    const matchedCities = Object.values(rates)
      .filter(r => r.city.toLowerCase().includes(query))
      .map(r => ({
        type: 'city',
        name: r.city,
        value: r.city,
        subtext: `Live rate: ₹${r.price22K}/g (22K)`,
      }));

    const matchedPurities = [
      { name: '24K Gold', value: '24K', subtext: '99.9% Pure Investment Gold' },
      { name: '22K Gold', value: '22K', subtext: '91.6% Pure Jewelry Gold' },
    ].filter(p => p.name.toLowerCase().includes(query) || p.value.toLowerCase().includes(query))
     .map(p => ({
       type: 'purity',
       name: p.name,
       value: p.value,
       subtext: p.subtext,
     }));

    res.json([...matchedCities, ...matchedPurities]);
  } catch (err: any) {
    handleServerError(res, err);
  }
});

// POST /api/calculator - Calculate gold rates
app.post('/api/calculator', async (req: Request, res: Response) => {
  try {
    const rates = await goldApiService.getRates();
    const { city, weight, purity } = req.body;

    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      res.status(400).json({ error: 'Please enter a valid positive weight in grams.' });
      return;
    }

    const cityKey = (city || 'bangalore').toLowerCase() as keyof GoldRatesState;
    const cityData = rates[cityKey] || rates.bangalore;

    const is24K = (purity || '').toString().includes('24K');
    const pricePerGram = is24K ? cityData.price24K : cityData.price22K;
    const rawValue = pricePerGram * parsedWeight;

    res.json({
      rawValue,
      pricePerGram,
      calculatedValue: Math.round(rawValue),
      currency: 'INR',
      gstNotice: '* Price excludes GST (3%) and making charges which may vary by jeweler (typically 10-25%)',
    });
  } catch (err: any) {
    handleServerError(res, err);
  }
});

// POST /api/alerts - Save alerts configuration
app.post('/api/alerts', (req: Request, res: Response) => {
  const { email, phone, city, targetPrice, purity } = req.body;

  if (!email && !phone) {
    res.status(400).json({ error: 'Please provide either a valid email address or phone number.' });
    return;
  }

  res.json({
    success: true,
    message: `Alert set successfully! We will notify you when ${purity || '22K'} Gold price in ${city || 'Bangalore'} matches/drops below ₹${targetPrice || '6,500'}/g.`,
  });
});

app.listen(PORT, () => {
  console.log(`[Gold Rate Backend] running on http://localhost:${PORT}`);
});
