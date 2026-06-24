import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card } from '../../ui/Card';

interface CityCardProps {
  city: string;
  price22K: number;
  change: number;
  onClick: () => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, price22K, change, onClick }) => {
  const isPositive = change >= 0;

  return (
    <Card
      hoverable
      onClick={onClick}
      className="p-5 flex flex-col justify-between min-h-[170px] relative border border-slate-100 hover:border-amber-300 shadow-sm"
    >
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <h4 className="text-base font-bold text-navy-900 tracking-tight">{city}</h4>
        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
      </div>

      {/* Middle Price */}
      <div className="my-3">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">22K Gold</span>
        <div className="text-xl font-extrabold text-navy-900 leading-tight">
          ₹{price22K.toLocaleString('en-IN')}
        </div>
        <span className="text-[10px] text-gray-400">per gram</span>
      </div>

      {/* Bottom Change */}
      <div className="flex items-center gap-1 mt-1 text-[11px]">
        {isPositive ? (
          <span className="font-semibold text-success-green flex items-center gap-0.5">
            +{change}% <span className="text-[9px] text-slate-400">today</span>
          </span>
        ) : (
          <span className="font-semibold text-danger-red flex items-center gap-0.5">
            {change}% <span className="text-[9px] text-slate-400">today</span>
          </span>
        )}
      </div>
    </Card>
  );
};
