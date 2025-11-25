import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, title, action }) => {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-slate-900/50 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700", 
      className
    )}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          {title && <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;