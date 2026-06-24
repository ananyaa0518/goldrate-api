import React from 'react';

interface TickerItem {
  city: string;
  price22K: number;
  change: number;
}

interface TickerBarProps {
  items: TickerItem[];
  onSelectCity: (city: string) => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({ items, onSelectCity }) => {
  // Triple the list to create a seamless looping marquee effect
  const repeatedItems = [...items, ...items, ...items];

  return (
    <div className="w-full bg-amber-500 py-2.5 shadow-inner border-y border-amber-600/10 select-none overflow-hidden">
      <div className="ticker-container flex">
        <div className="ticker-content flex gap-8 items-center text-xs font-semibold text-white">
          {repeatedItems.map((item, idx) => {
            const isPositive = item.change >= 0;
            return (
              <div
                key={idx}
                onClick={() => onSelectCity(item.city.toLowerCase())}
                className="flex items-center gap-1.5 cursor-pointer hover:underline active:scale-95 transition-transform"
              >
                <span className="text-white/80">{item.city}:</span>
                <span>₹{item.price22K.toLocaleString('en-IN')}</span>
                <span className="flex items-center text-[10px]">
                  {isPositive ? (
                    <span className="text-emerald-100 font-bold">▲ {Math.abs(item.change)}%</span>
                  ) : (
                    <span className="text-rose-100 font-bold">▼ {Math.abs(item.change)}%</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
