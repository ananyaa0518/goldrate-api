import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Calculator, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { goldApi } from '../../services/api';
import type { SearchResult } from '../../services/api';

interface NavbarProps {
  onSelectCity: (city: string) => void;
  onSelectPurity?: (purity: string) => void;
  onOpenAlertModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCity,
  onOpenAlertModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle Search Input autocomplete
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

  // Click outside listener for autocomplete dropdown
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // Adjust for sticky navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Section: Logo */}
        <div className="flex items-center gap-6 flex-1 md:flex-none">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 shadow-md shadow-amber-500/25">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-navy-900">
              Gold<span className="text-amber-500">Rate</span>
            </span>
          </div>

          {/* Center Search Input (Desktop) */}
          <div className="relative hidden max-w-md flex-1 md:block" ref={dropdownRef}>
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search city, gold type, or purity (e.g., Bangalore, 22K, 24K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowDropdown(true)}
                className="w-[380px] lg:w-[440px] rounded-full border border-gray-200 bg-slate-50/50 py-2 pr-4 pl-9 text-xs transition-all placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/10 text-navy-900"
              />
            </div>

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 z-50 mt-1.5 w-[380px] lg:w-[440px] rounded-xl border border-gray-100 bg-white p-2 shadow-lg shadow-navy-900/5">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleResultClick(result)}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="mt-0.5 rounded bg-slate-100 p-1 text-slate-500">
                      {result.type === 'city' ? (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-navy-900">{result.name}</div>
                      <div className="text-[10px] text-gray-400">{result.subtext}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Navigation Links & CTA (Desktop) */}
        <nav className="hidden items-center gap-6 md:flex">
          <button
            onClick={() => scrollToSection('major-cities')}
            className="text-xs font-medium text-navy-700 hover:text-amber-500 cursor-pointer transition-colors"
          >
            Major Cities
          </button>
          <button
            onClick={() => scrollToSection('gold-calculator')}
            className="flex items-center gap-1.5 text-xs font-medium text-navy-700 hover:text-amber-500 cursor-pointer transition-colors"
          >
            <Calculator className="h-3.5 w-3.5 text-slate-400" />
            Calculator
          </button>
          <button
            onClick={() => scrollToSection('investment-insights')}
            className="text-xs font-medium text-navy-700 hover:text-amber-500 cursor-pointer transition-colors"
          >
            Insights
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAlertModal}
            className="gap-1.5 rounded-full py-2 px-4 text-xs font-semibold shadow-amber-500/10"
          >
            <Bell className="h-3 w-3 fill-navy-900" />
            Set Alert
          </Button>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-navy-900"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-inner md:hidden">
          <div className="flex flex-col gap-4">
            
            {/* Search Input for Mobile */}
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search city, gold type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-slate-50 py-2 pr-4 pl-9 text-xs focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/10 text-navy-900"
              />
            </div>

            <button
              onClick={() => scrollToSection('major-cities')}
              className="py-1 text-left text-xs font-medium text-navy-700 hover:text-amber-500"
            >
              Major Cities
            </button>
            <button
              onClick={() => scrollToSection('gold-calculator')}
              className="flex items-center gap-2 py-1 text-left text-xs font-medium text-navy-700 hover:text-amber-500"
            >
              <Calculator className="h-4 w-4 text-slate-400" />
              Calculator
            </button>
            <button
              onClick={() => scrollToSection('investment-insights')}
              className="py-1 text-left text-xs font-medium text-navy-700 hover:text-amber-500"
            >
              Insights
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAlertModal) onOpenAlertModal();
              }}
              className="w-full gap-2 rounded-full font-semibold shadow-amber-500/10"
            >
              <Bell className="h-3.5 w-3.5 fill-navy-900" />
              Set Alert
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
