import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-accent text-white hover:bg-accent/90': variant === 'primary',
            'bg-canvas-secondary text-fg hover:bg-border': variant === 'secondary',
            'border border-border bg-transparent hover:bg-canvas-secondary text-fg': variant === 'outline',
            'bg-transparent hover:bg-canvas-secondary text-fg': variant === 'ghost',
            'bg-transparent text-accent hover:underline px-0 py-0 h-auto rounded-none': variant === 'link',
            
            'h-8 px-3 text-xs': size === 'sm' && variant !== 'link',
            'h-10 px-4 py-2 text-sm': size === 'md' && variant !== 'link',
            'h-12 px-6 text-base': size === 'lg' && variant !== 'link',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
