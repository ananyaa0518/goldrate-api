import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { motion } from 'framer-motion';

export const InsightsGrid: React.FC = () => {
  const articles = [
    {
      id: 1,
      category: 'Investment',
      readTime: '5 min read',
      title: 'Best Time to Buy Gold in 2026',
      description: 'Learn about seasonal trends and ideal buying windows for gold investment.',
    },
    {
      id: 2,
      category: 'Market Analysis',
      readTime: '7 min read',
      title: 'Gold Price Forecast: Q1 2026',
      description: 'Expert predictions and market analysis for gold prices in the coming quarter.',
    },
    {
      id: 3,
      category: 'Shopping Guide',
      readTime: '6 min read',
      title: 'Wedding Gold Shopping Guide',
      description: 'Everything you need to know about buying gold jewelry for weddings.',
    },
  ];

  return (
    <section id="investment-insights" className="py-12 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Gold Investment Insights
          </h2>
          <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto">
            Expert tips and market analysis to help you make informed decisions
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {articles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Card hoverable className="p-0 border border-slate-100 flex flex-col justify-between h-full bg-white select-none">
                
                {/* Header Graphic (Top Half) */}
                <div className="h-44 w-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/30 via-transparent to-transparent" />
                  <BookOpen className="h-16 w-16 text-white/90 stroke-[1.25]" />
                </div>

                {/* Content Panel (Bottom Half) */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Badge and reading time */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge>{article.category}</Badge>
                      <span className="text-[10px] text-gray-400 font-medium">{article.readTime}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-navy-900 line-clamp-2 tracking-tight mb-2">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {article.description}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-6 pt-4 border-t border-slate-50">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors group cursor-pointer">
                      <span>Read More</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>

              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
