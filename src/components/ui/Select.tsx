/**
 * ## src/components/ui/Select.tsx
 */
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: any }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-0.5">
        {label && <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-tight">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'flex h-7 w-full rounded-[2px] border border-[#999999] bg-white px-2 py-1 text-[13px] focus:outline-none focus:border-[#0054a6] focus:ring-1 focus:ring-[#0054a6] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-75 appearance-none',
              error ? 'border-red-500 focus:ring-red-500' : '',
              className
            )}
            {...props}
          >
            <option value="" disabled>Pilih...</option>
            {options.map(opt => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="text-[10px] text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
