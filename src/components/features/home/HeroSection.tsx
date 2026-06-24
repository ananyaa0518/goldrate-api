import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../ui/Button';
import { LivePriceCard } from './LivePriceCard';
import { goldApi } from '../../../services/api';
import type { SearchResult } from '../../../services/api';

interface HeroSectionProps {
  selectedCity: string;
  price24K: number;
  price22K: number;
  change: number;
  timestamp: string;
  onSelectCity: (city: string) => void;
  onOpenAlertModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCity,
  price24K,
  price22K,
  change,
  timestamp,
  onSelectCity,
  onOpenAlertModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Autocomplete debouncing
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const results = await goldApi.search(searchQuery);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'city') {
      onSelectCity(result.value);
    }
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleCheckPriceClick = () => {
    if (searchQuery.trim().length > 1 && searchResults.length > 0) {
      handleResultClick(searchResults[0]);
    } else {
      // Fallback scroll down to cities grid
      const el = document.getElementById('major-cities');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative bg-gradient-to-b from-slate-50/70 to-white pt-10 pb-16">
      
      {/* Background radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(254,240,138,0.15),transparent_50%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Heading and Search controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              Live Gold Rate Today in India
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl">
              Check accurate gold prices by city or purity. Updated hourly with real-time market data.
            </p>

            {/* Search Input Bar (Hero-specific size) */}
            <div className="relative max-w-xl" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute top-3.5 left-4 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search city, gold type, or purity (e.g., Bangalore, 22K, 24K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length > 1 && setShowDropdown(true)}
                  className="w-full rounded-2xl border border-gray-200 bg-slate-50 py-3.5 pr-4 pl-11 text-xs transition-all placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/10 text-navy-900 shadow-sm"
                />
              </div>

              {/* AutocompleteDropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 z-50 mt-1.5 w-full rounded-2xl border border-gray-100 bg-white p-2 shadow-xl shadow-navy-900/5">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleResultClick(result)}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="mt-0.5 rounded bg-slate-100 p-1 text-slate-500">
                        {result.type === 'city' ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-navy-900">{result.name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{result.subtext}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hero CTA buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                variant="primary"
                onClick={handleCheckPriceClick}
                className="gap-2 px-6 py-3.5 rounded-xl text-xs font-bold shadow-md shadow-amber-500/10"
              >
                <Search className="h-4 w-4 text-navy-900 stroke-[2.5]" />
                Check Gold Price
              </Button>
              
              <Button
                variant="outline"
                onClick={onOpenAlertModal}
                className="gap-2 px-6 py-3.5 rounded-xl text-xs font-bold border-gray-200 text-navy-800"
              >
                Set Price Alert
              </Button>
            </div>

          </div>

          {/* Right Column: Bangalore Price details */}
          <div className="lg:col-span-5 max-w-md mx-auto w-full lg:max-w-none">
            <LivePriceCard
              city={selectedCity}
              price24K={price24K}
              price22K={price22K}
              change={change}
              timestamp={timestamp}
            />
          </div>

        </div>
      </div>
    </section>
  );
};
