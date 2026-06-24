import React from 'react';

interface FooterProps {
  onSelectCity: (city: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCity }) => {
  const majorCities = [
    { name: 'Gold Rate in Bangalore', value: 'bangalore' },
    { name: 'Gold Rate in Chennai', value: 'chennai' },
    { name: 'Gold Rate in Hyderabad', value: 'hyderabad' },
    { name: 'Gold Rate in Mumbai', value: 'mumbai' },
  ];

  const moreCities = [
    { name: 'Gold Rate in Delhi', value: 'delhi' },
    { name: 'Gold Rate in Pune', value: 'pune' },
    { name: 'Gold Rate in Kolkata', value: 'kolkata' },
    { name: 'Gold Rate in Coimbatore', value: 'coimbatore' },
  ];

  return (
    <footer className="bg-[#0b132b] pt-16 pb-10 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 shadow-md shadow-amber-500/25">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Gold<span className="text-amber-500">Rate</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 max-w-xs">
              Your trusted source for accurate, real-time gold prices across India.
            </p>
          </div>

          {/* Column 2: Major Cities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Major Cities</h3>
            <ul className="mt-4 space-y-2 text-xs">
              {majorCities.map((city) => (
                <li key={city.value}>
                  <button
                    onClick={() => {
                      onSelectCity(city.value);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-500 text-left transition-colors cursor-pointer text-slate-400"
                  >
                    {city.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: More Cities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">More Cities</h3>
            <ul className="mt-4 space-y-2 text-xs">
              {moreCities.map((city) => (
                <li key={city.value}>
                  <button
                    onClick={() => {
                      onSelectCity(city.value);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-500 text-left transition-colors cursor-pointer text-slate-400"
                  >
                    {city.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <a href="#gold-calculator" className="hover:text-amber-500 transition-colors text-slate-400">
                  Gold Calculator
                </a>
              </li>
              <li>
                <a href="#investment-insights" className="hover:text-amber-500 transition-colors text-slate-400">
                  Investment Insights
                </a>
              </li>
              <li>
                <a href="#set-alert-section" className="hover:text-amber-500 transition-colors text-slate-400">
                  Price Alerts
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-amber-500 transition-colors text-slate-400">
                  About Us
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider Line */}
        <div className="border-t border-slate-800/80 my-8" />

        {/* Gold Purity Types Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Gold Purity Types</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-500">
            <a href="#gold-calculator" className="hover:text-slate-300 transition-colors">24K Gold Rate Today</a>
            <a href="#gold-calculator" className="hover:text-slate-300 transition-colors">22K Gold Rate Today</a>
            <a href="#gold-calculator" className="hover:text-slate-300 transition-colors">18K Gold Rate Today</a>
            <a href="#price-trends" className="hover:text-slate-300 transition-colors">Gold Rate Trends</a>
          </div>
        </div>

        {/* Copyright centered */}
        <div className="mt-12 text-center text-xs text-slate-600">
          <span>&copy; 2026 GoldRate. All rights reserved. Prices are for reference only and may vary by location.</span>
        </div>

      </div>
    </footer>
  );
};
