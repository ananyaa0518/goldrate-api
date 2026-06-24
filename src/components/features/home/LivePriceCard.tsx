import React from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../../ui/Card';

interface LivePriceCardProps {
  city: string;
  price24K: number;
  price22K: number;
  change: number;
  timestamp: string;
}

export const LivePriceCard: React.FC<LivePriceCardProps> = ({
  city,
  price24K,
  price22K,
  change,
  timestamp,
}) => {
  const isPositive = change >= 0;

  // Formatting rates in Lakhs/Thousands for India
  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN');
  };

  return (
    <Card className="border border-amber-300 rounded-3xl bg-white p-6 shadow-sm shadow-amber-500/5 relative overflow-hidden">
      
      {/* Accent Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
      
      {/* Title */}
      <h3 className="text-sm font-semibold text-navy-800 tracking-wide mb-6">
        Live Gold Price - {city}
      </h3>

      {/* 24K Gold Row */}
      <div className="mb-5">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">24K Gold</span>
            <div className="text-2xl font-extrabold text-navy-900 mt-0.5">
              ₹{formatCurrency(price24K)}
            </div>
            <span className="text-[10px] text-gray-400">per gram</span>
          </div>
          <div className="text-right">
            <div className="text-base font-bold text-navy-800">
              ₹{formatCurrency(price24K * 10)}
            </div>
            <span className="text-[10px] text-gray-400">per 10g</span>
          </div>
        </div>
      </div>

      {/* Thin Divider */}
      <div className="border-t border-slate-100 my-4" />

      {/* 22K Gold Row */}
      <div className="mb-6">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">22K Gold</span>
            <div className="text-2xl font-extrabold text-navy-900 mt-0.5">
              ₹{formatCurrency(price22K)}
            </div>
            <span className="text-[10px] text-gray-400">per gram</span>
          </div>
          <div className="text-right">
            <div className="text-base font-bold text-navy-800">
              ₹{formatCurrency(price22K * 10)}
            </div>
            <span className="text-[10px] text-gray-400">per 10g</span>
          </div>
        </div>
      </div>

      {/* Metadata Indicators */}
      <div className="flex flex-col gap-2 mt-4 text-[11px] text-slate-500">
        
        {/* Trend Indicator */}
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-success-green">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-success-green">+{change}%</span>
            </>
          ) : (
            <>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-danger-red">
                <TrendingDown className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-danger-red">{change}%</span>
            </>
          )}
          <span className="text-slate-400">vs yesterday</span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 text-slate-400 mt-1">
          <Clock className="h-3.5 w-3.5" />
          <span>Updated: {timestamp}</span>
        </div>

      </div>

    </Card>
  );
};
