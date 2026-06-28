import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '../../ui/Card';

interface ChartPoint {
  date: string;
  price24K: number;
  price22K: number;
}

interface PriceChartProps {
  city: string;
  data: {
    '7d': ChartPoint[];
    '30d': ChartPoint[];
    '1y': ChartPoint[];
  };
}

export const PriceChart: React.FC<PriceChartProps> = ({ city, data }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '1y'>('7d');
  const [selectedPurity, setSelectedPurity] = useState<'24K' | '22K'>('24K');

  // Debug logging on component mount and data changes
  useEffect(() => {
    console.log('[PriceChart] Component mounted/updated');
    console.log('[PriceChart] Received city:', city);
    console.log('[PriceChart] Received data:', data);
    console.log('[PriceChart] Data structure:', {
      '7d': data?.['7d']?.length || 0,
      '30d': data?.['30d']?.length || 0,
      '1y': data?.['1y']?.length || 0,
    });
  }, [city, data]);

  // Log when timeframe changes
  useEffect(() => {
    console.log('[PriceChart] Selected timeframe:', timeframe);
    console.log('[PriceChart] Data for timeframe:', data?.[timeframe] || []);
  }, [timeframe, data]);

  // Log when purity changes
  useEffect(() => {
    console.log('[PriceChart] Selected gold type:', selectedPurity);
  }, [selectedPurity]);

  // Validate and get chart data
  const chartData = data?.[timeframe] || data?.['7d'] || [];
  const isDataEmpty = !chartData || chartData.length === 0;

  console.log('[PriceChart] Chart data to render:', {
    timeframe,
    isEmpty: isDataEmpty,
    length: chartData?.length,
    dataKeys: chartData?.[0] ? Object.keys(chartData[0]) : [],
  });

  // Format currency for axis values
  const formatYAxis = (tick: number) => {
    return `₹${tick.toLocaleString('en-IN')}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-md shadow-navy-900/5 text-xs text-navy-950 font-medium">
          <p className="text-slate-400 mb-1 text-[10px] uppercase font-bold tracking-wider">{payload[0].payload.date}</p>
          <p className="flex justify-between gap-4 font-semibold text-navy-900">
            <span>24K Gold:</span>
            <span>₹{payload[0].payload.price24K.toLocaleString('en-IN')}/g</span>
          </p>
          <p className="flex justify-between gap-4 mt-0.5 text-slate-600">
            <span>22K Gold:</span>
            <span>₹{payload[0].payload.price22K.toLocaleString('en-IN')}/g</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="price-trends" className="py-12 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Gold Price Trends
          </h2>
          <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto">
            Track historical price movements and make informed decisions in {city}
          </p>
        </div>

        {/* Main Chart Card */}
        <Card className="p-6 border border-slate-100 shadow-sm bg-white">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            
            {/* Timeframe Swaps */}
            <div className="flex rounded-full bg-slate-100/80 p-1 border border-slate-200/50 select-none">
              {(['7d', '30d', '1y'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-6 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    timeframe === t
                      ? 'bg-white text-navy-900 shadow-sm'
                      : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  {t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : '1 Year'}
                </button>
              ))}
            </div>

            {/* Purity toggle */}
            <div className="flex gap-2">
              {(['24K', '22K'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPurity(p)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedPurity === p
                      ? 'border-amber-400 bg-amber-50 text-amber-800'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {p} Gold
                </button>
              ))}
            </div>

          </div>

          {/* Chart Display Area or Fallback */}
          {isDataEmpty ? (
            <div className="h-[320px] w-full flex items-center justify-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Historical data unavailable
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Try again in a moment or check back later
                </p>
              </div>
            </div>
          ) : (
            <div className="h-[320px] w-full text-[10px] text-slate-400">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={formatYAxis}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9' }} />
                  <Line
                    type="monotone"
                    dataKey={selectedPurity === '24K' ? 'price24K' : 'price22K'}
                    stroke="#eab308"
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: '#eab308', strokeWidth: 1, fill: '#fff' }}
                    activeDot={{ r: 6, fill: '#eab308', stroke: '#fff', strokeWidth: 2 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

        </Card>

      </div>
    </section>
  );
};
