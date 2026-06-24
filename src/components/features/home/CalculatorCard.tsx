import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { Card } from '../../ui/Card';
import { goldApi } from '../../../services/api';

interface CityOption {
  name: string;
  value: string;
}

interface CalculatorCardProps {
  initialCity?: string;
  cities: CityOption[];
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  initialCity = 'bangalore',
  cities,
}) => {
  const [city, setCity] = useState(initialCity);
  const [weight, setWeight] = useState('10');
  const [purity, setPurity] = useState('22K');
  const [calculatedValue, setCalculatedValue] = useState<number | null>(66430);
  const [ratePerGram, setRatePerGram] = useState<number | null>(6643);
  const [loading, setLoading] = useState(false);

  // Sync initialCity prop with state
  useEffect(() => {
    if (initialCity) {
      setCity(initialCity.toLowerCase());
    }
  }, [initialCity]);

  // Recalculate whenever city, weight, or purity change
  useEffect(() => {
    const performCalculation = async () => {
      const parsedWeight = parseFloat(weight);
      if (isNaN(parsedWeight) || parsedWeight <= 0) {
        setCalculatedValue(null);
        setRatePerGram(null);
        return;
      }

      setLoading(true);
      try {
        const response = await goldApi.calculate(city, parsedWeight, purity);
        setCalculatedValue(response.calculatedValue);
        setRatePerGram(response.pricePerGram);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(performCalculation, 300);
    return () => clearTimeout(delayDebounce);
  }, [city, weight, purity]);

  return (
    <section id="gold-calculator" className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Gold Value Calculator
          </h2>
          <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto">
            Calculate the current value of your gold instantly
          </p>
        </div>

        {/* Calculator Widget */}
        <div className="max-w-xl mx-auto">
          <Card className="border border-blue-100 rounded-3xl bg-white p-6 md:p-8 shadow-md shadow-blue-500/5 relative">
            
            {/* Widget Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Calculator className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-navy-900 tracking-tight">
                Gold Calculator
              </h3>
            </div>

            {/* Inputs list */}
            <div className="space-y-4">
              
              {/* City Input */}
              <div>
                <label htmlFor="calc-city" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <select
                  id="calc-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-navy-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight input */}
              <div>
                <label htmlFor="calc-weight" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Weight (grams)
                </label>
                <input
                  id="calc-weight"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight in grams"
                  className="w-full rounded-xl border border-gray-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-navy-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* Purity selector */}
              <div>
                <label htmlFor="calc-purity" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Purity
                </label>
                <select
                  id="calc-purity"
                  value={purity}
                  onChange={(e) => setPurity(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-navy-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
                >
                  <option value="22K">22K (91.67% Pure)</option>
                  <option value="24K">24K (99.99% Pure)</option>
                  <option value="18K">18K (75.00% Pure)</option>
                </select>
              </div>

            </div>

            {/* Output Display */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Today's Value</span>
              <div className="flex items-baseline gap-2 mt-1">
                {loading ? (
                  <div className="text-3xl font-extrabold text-blue-600 animate-pulse">Calculating...</div>
                ) : calculatedValue !== null ? (
                  <>
                    <div className="text-3xl font-extrabold text-blue-600 tracking-tight">
                      ₹{calculatedValue.toLocaleString('en-IN')}
                    </div>
                    {ratePerGram && (
                      <span className="text-xs text-slate-500">
                        @ ₹{ratePerGram.toLocaleString('en-IN')}/gram
                      </span>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-rose-500 font-semibold">Enter a valid weight to calculate</div>
                )}
              </div>
              
              <span className="text-[10px] text-slate-400 leading-relaxed block mt-3 font-medium">
                * Price excludes GST (3%) and making charges which may vary by jeweler (typically 10-25%)
              </span>
            </div>

          </Card>
        </div>

      </div>
    </section>
  );
};
