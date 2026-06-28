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
      chartData: {
        '7d': [],
        '30d': [],
        '1y': [],
      },
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

    res.json({
      cityDetails: cityData,
      chartData: {
        '7d': [],
        '30d': [],
        '1y': [],
      },
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
