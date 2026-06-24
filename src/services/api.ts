import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GoldRateData {
  city: string;
  price24K: number;
  price22K: number;
  change: number;
  timestamp: string;
}

export interface HomeResponse {
  livePrice: GoldRateData;
  majorCities: GoldRateData[];
  ticker: Array<{ city: string; price22K: number; change: number }>;
  chartData: {
    '7d': Array<{ date: string; price24K: number; price22K: number }>;
    '30d': Array<{ date: string; price24K: number; price22K: number }>;
    '1y': Array<{ date: string; price24K: number; price22K: number }>;
  };
}

export interface CityResponse {
  cityDetails: GoldRateData;
  chartData: {
    '7d': Array<{ date: string; price24K: number; price22K: number }>;
    '30d': Array<{ date: string; price24K: number; price22K: number }>;
    '1y': Array<{ date: string; price24K: number; price22K: number }>;
  };
}

export interface SearchResult {
  type: 'city' | 'purity';
  name: string;
  value: string;
  subtext: string;
}

export interface CalculatorResponse {
  rawValue: number;
  pricePerGram: number;
  calculatedValue: number;
  currency: string;
  gstNotice: string;
}

export interface AlertResponse {
  success: boolean;
  message: string;
}

export const goldApi = {
  getHomeData: async (): Promise<HomeResponse> => {
    const { data } = await api.get<HomeResponse>('/home');
    return data;
  },

  getCityData: async (city: string): Promise<CityResponse> => {
    const { data } = await api.get<CityResponse>(`/cities/${city}`);
    return data;
  },

  search: async (q: string): Promise<SearchResult[]> => {
    if (!q.trim()) return [];
    const { data } = await api.get<SearchResult[]>(`/search?q=${encodeURIComponent(q)}`);
    return data;
  },

  calculate: async (city: string, weight: number, purity: string): Promise<CalculatorResponse> => {
    const { data } = await api.post<CalculatorResponse>('/calculator', { city, weight, purity });
    return data;
  },

  createAlert: async (payload: {
    email?: string;
    phone?: string;
    city: string;
    targetPrice: number;
    purity: string;
  }): Promise<AlertResponse> => {
    const { data } = await api.post<AlertResponse>('/alerts', payload);
    return data;
  },
};
