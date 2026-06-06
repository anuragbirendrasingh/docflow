'use client';

import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-soft hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 focus:ring-primary-500',
  secondary: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-soft hover:shadow-hover hover:-translate-y-0.5 focus:ring-slate-500',
  ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 focus:ring-slate-500',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-soft hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 focus:ring-red-500',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base font-semibold',
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none transform-none shadow-none' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
