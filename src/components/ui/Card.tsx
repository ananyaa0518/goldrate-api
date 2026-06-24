import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, ...props }) => {
  const baseClasses = 'bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden';
  
  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', borderColor: '#fef08a' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={twMerge(clsx(baseClasses, 'hover:border-amber-200 cursor-pointer transition-all duration-300'), className)}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={twMerge(clsx(baseClasses), className)} {...props}>
      {children}
    </div>
  );
};
