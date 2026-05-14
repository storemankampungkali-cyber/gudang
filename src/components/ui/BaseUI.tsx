/**
 * ## src/components/ui/Button.tsx
 */
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className, 
  disabled, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-[#0054a6] text-white hover:bg-[#004e9a] border border-[#003d7c]',
    secondary: 'bg-[#f0f0f0] text-gray-900 border border-[#999999] hover:bg-[#e0e0e0]',
    danger: 'bg-[#cc0000] text-white border border-[#990000] hover:bg-[#bb0000]',
    outline: 'border border-[#999999] bg-white hover:bg-gray-50 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-200 text-gray-700'
  };

  const sizes = {
    sm: 'px-2 py-1 text-[11px]',
    md: 'px-3 py-1.5 text-[13px]',
    lg: 'px-4 py-2 text-[15px]'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-[2px] font-semibold transition-all active:translate-y-[1px] focus-visible:outline-none focus:border-blue-500 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="mr-2 h-3 w-3 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
};

/**
 * ## src/components/ui/Input.tsx
 */
export const Input = React.forwardRef<HTMLInputElement, { label?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-0.5">
        {label && <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-tight">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'flex h-7 w-full rounded-[2px] border border-[#999999] bg-white px-2 py-1 text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-[#0054a6] focus:ring-1 focus:ring-[#0054a6] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-75',
            error ? 'border-red-500 focus:ring-red-500' : '',
            className
          )}
          {...props}
        />
        {error && <p className="text-[10px] text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

/**
 * ## src/components/ui/Badge.tsx
 */
export const Badge = ({ children, variant = 'info' }: { children: React.ReactNode; variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' }) => {
  const styles = {
    success: 'bg-[#e6ffed] text-[#22863a] border-[#22863a]',
    danger: 'bg-[#ffeef0] text-[#cc0000] border-[#cc0000]',
    warning: 'bg-[#fff5b1] text-[#735c0f] border-[#735c0f]',
    info: 'bg-[#e1f5fe] text-[#01579b] border-[#01579b]',
    neutral: 'bg-[#f6f8fa] text-[#24292e] border-[#d1d5da]'
  };

  return (
    <span className={cn('inline-flex items-center rounded-[2px] border px-2 py-0.5 text-[10px] font-bold uppercase', styles[variant])}>
      {children}
    </span>
  );
};
