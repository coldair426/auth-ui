'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'bg-white text-gray-900 hover:bg-gray-100 disabled:bg-white/50',
  secondary: 'bg-white/20 text-white hover:bg-white/30 border border-white/30 disabled:bg-white/10',
  ghost: 'bg-transparent text-white hover:bg-white/10 disabled:opacity-40',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-base gap-2',
  lg: 'h-13 px-6 text-lg gap-2.5',
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
        'inline-flex items-center justify-center rounded-xl font-medium',
        'transition-colors duration-150 cursor-pointer',
        'disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
