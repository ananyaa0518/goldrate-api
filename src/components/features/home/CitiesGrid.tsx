import React from 'react';
import { CityCard } from './CityCard';
import type { GoldRateData } from '../../../services/api';
import { motion } from 'framer-motion';

interface CitiesGridProps {
  cities: GoldRateData[];
  onSelectCity: (city: string) => void;
}

export const CitiesGrid: React.FC<CitiesGridProps> = ({ cities, onSelectCity }) => {
  // Animating grid items using framer-motion stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="major-cities" className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Gold Rate Today in Major Cities
          </h2>
          <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto">
            Select your city to view detailed gold prices and market trends
          </p>
        </div>

        {/* Cities 4-Column Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {cities.map((cityData) => (
            <motion.div key={cityData.city} variants={itemVariants}>
              <CityCard
                city={cityData.city}
                price22K={cityData.price22K}
                change={cityData.change}
                onClick={() => onSelectCity(cityData.city.toLowerCase())}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
