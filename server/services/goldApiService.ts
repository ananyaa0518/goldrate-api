import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const GOLD_API_KEY = process.env.GOLD_API_KEY || '';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes cache

export interface GoldRatesState {
  bangalore: CityRates;
  chennai: CityRates;
  hyderabad: CityRates;
  mumbai: CityRates;
  delhi: CityRates;
  pune: CityRates;
  kolkata: CityRates;
  coimbatore: CityRates;
  ahmedabad: CityRates;
  jaipur: CityRates;
  lucknow: CityRates;
  patna: CityRates;
}

export interface CityRates {
  city: string;
  price24K: number;
  price22K: number;
  change: number;
  timestamp: string;
}

// In-Memory cache
let cachedData: GoldRatesState | null = null;
let lastFetchTime = 0;

export const goldApiService = {
  getRates: async (): Promise<GoldRatesState> => {
    // 1. Check if cache is still valid
    if (cachedData && (Date.now() - lastFetchTime < CACHE_DURATION_MS)) {
      console.log('[Gold Service] Returning cached rates');
      return cachedData;
    }

    // 2. Verify API Key
    if (!GOLD_API_KEY || GOLD_API_KEY.trim() === '') {
      console.error('[Gold Service] Error: GOLD_API_KEY is not configured');
      throw new Error('KEY_MISSING');
    }

    try {
      console.log('[Gold Service] Querying GoldAPI.io for live rates...');
      // Request Gold spot rate per troy ounce in Indian Rupees (XAU -> INR)
      const response = await axios.get('https://www.goldapi.io/api/XAU/INR', {
        headers: {
          'x-access-token': GOLD_API_KEY,
        },
        timeout: 10000,
      });

      const spotPricePerOunce = response.data.price;
      const prevClosePricePerOunce = response.data.prev_close_price || spotPricePerOunce;

      if (!spotPricePerOunce || isNaN(spotPricePerOunce)) {
        throw new Error('MALFORMED_RESPONSE');
      }

      // Convert ounces to grams (1 ounce = 31.1034768 grams)
      const base24KGramPrice = Math.round(spotPricePerOunce / 31.1034768);
      const base22KGramPrice = Math.round(base24KGramPrice * 0.9167);
      
      // Calculate daily change
      const pctChange = parseFloat(((spotPricePerOunce - prevClosePricePerOunce) / prevClosePricePerOunce * 100).toFixed(2));

      const now = new Date();
      const timestampStr = now.toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      // City variations offsets in India (transport premium, local demand)
      const offsetMultipliers: Record<keyof GoldRatesState, { name: string; offset24K: number; offset22K: number; changeOffset: number }> = {
        bangalore: { name: 'Bangalore', offset24K: 1.0, offset22K: 1.0, changeOffset: 0 },
        chennai: { name: 'Chennai', offset24K: 1.0014, offset22K: 1.0015, changeOffset: -0.07 },
        hyderabad: { name: 'Hyderabad', offset24K: 0.9993, offset22K: 0.9995, changeOffset: -0.37 },
        mumbai: { name: 'Mumbai', offset24K: 1.002, offset22K: 1.0022, changeOffset: 0.07 },
        delhi: { name: 'Delhi', offset24K: 1.0007, offset22K: 1.0008, changeOffset: -0.10 },
        pune: { name: 'Pune', offset24K: 1.0018, offset22K: 1.0019, changeOffset: 0.03 },
        kolkata: { name: 'Kolkata', offset24K: 0.999, offset22K: 0.9992, changeOffset: -0.33 },
        coimbatore: { name: 'Coimbatore', offset24K: 1.0011, offset22K: 1.0012, changeOffset: -0.05 },
        ahmedabad: { name: 'Ahmedabad', offset24K: 0.9986, offset22K: 0.9983, changeOffset: -0.13 },
        jaipur: { name: 'Jaipur', offset24K: 1.0004, offset22K: 1.0003, changeOffset: -0.30 },
        lucknow: { name: 'Lucknow', offset24K: 1.0009, offset22K: 1.0006, changeOffset: -0.15 },
        patna: { name: 'Patna', offset24K: 0.9979, offset22K: 0.9972, changeOffset: -0.40 },
      };

      const rates: Partial<GoldRatesState> = {};

      Object.entries(offsetMultipliers).forEach(([key, conf]) => {
        rates[key as keyof GoldRatesState] = {
          city: conf.name,
          price24K: Math.round(base24KGramPrice * conf.offset24K),
          price22K: Math.round(base22KGramPrice * conf.offset22K),
          change: parseFloat((pctChange + conf.changeOffset).toFixed(2)),
          timestamp: timestampStr,
        };
      });

      cachedData = rates as GoldRatesState;
      lastFetchTime = Date.now();
      
      console.log('[Gold Service] Cache updated successfully with live prices');
      return cachedData;
    } catch (err: any) {
      console.error('[Gold Service] Live API request failed:', err.message);

      // Handle specific API status codes
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          throw new Error('KEY_MISSING');
        }
        if (status === 429) {
          throw new Error('QUOTA_EXCEEDED');
        }
      }

      // Check for connection or timeout errors
      if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
        throw new Error('NETWORK_ERROR');
      }

      // Default fallback when API request fails
      throw new Error('NETWORK_ERROR');
    }
  },
};
