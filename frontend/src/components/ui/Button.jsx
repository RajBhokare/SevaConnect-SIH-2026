import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-subtle hover:shadow-card focus:ring-brand-500 font-semibold',
    secondary: 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/60 focus:ring-slate-400 font-medium',
    coop: 'bg-coop-600 hover:bg-coop-700 text-white shadow-subtle hover:shadow-card focus:ring-coop-500 font-semibold',
    outline: 'border border-slate-300/90 bg-white hover:bg-slate-50/80 text-slate-700 hover:text-slate-900 shadow-subtle focus:ring-brand-500 font-medium',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400 font-medium',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-subtle focus:ring-rose-500 font-semibold',
    emergency: 'bg-red-600 hover:bg-red-700 text-white font-bold shadow-subtle focus:ring-red-500'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 min-h-[34px] gap-1.5',
    md: 'text-sm px-4 py-2.5 min-h-[42px] gap-2',
    lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5'
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
