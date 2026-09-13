import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({
  className,
  variant = 'default',
  children,
  icon: Icon,
  ...props
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-primary-50 text-primary-800 border-primary-200',
    brand: 'bg-primary-50 text-primary-800 border-primary-200',
    accent: 'bg-accent-50 text-accent-900 border-accent-300 font-semibold',
    success: 'bg-success-50 text-success-800 border-success-200 font-medium',
    coop: 'bg-success-50 text-success-800 border-success-200 font-medium',
    danger: 'bg-danger-50 text-danger-800 border-danger-200 font-medium',
    outline: 'bg-transparent border-slate-300 text-slate-700'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
