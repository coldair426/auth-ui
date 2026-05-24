'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm disabled:bg-gray-400',
  secondary: 'bg-white/20 text-white hover:bg-white/30 border border-white/25 backdrop-blur-md shadow-sm disabled:bg-white/10',
  ghost: 'bg-transparent text-gray-600 hover:bg-black/5 disabled:opacity-40',
};

const sizeStyles = {
  sm: 'h-9 px-4 text-[13px] gap-2',
  md: 'h-12 px-6 text-[15px] gap-2.5',
  lg: 'h-14 px-8 text-[17px] gap-3',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center rounded-2xl font-bold tracking-tight',
        'transition-all duration-300 cursor-pointer active:scale-[0.97]',
        'disabled:cursor-not-allowed disabled:scale-100',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
