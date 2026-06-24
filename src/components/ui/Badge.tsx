import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children, className, ...props }) => {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide bg-amber-50 text-amber-700 border border-amber-200/50'
        ),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
