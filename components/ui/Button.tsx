import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'danger' | 'secondary' | 'outline' | 'ghost' | 'navy' | 'navyOutline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gold hover:bg-gold-dark text-navy shadow-sm hover:shadow-md',
    danger: 'bg-accent hover:bg-accent-600 dark:bg-accent-600 dark:hover:bg-accent-500 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-navy hover:bg-navy-light text-white shadow-sm hover:shadow-md',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-navy',
    ghost: 'text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
    navy: 'bg-navy hover:bg-navy-light text-white shadow-sm hover:shadow-md',
    navyOutline: 'border-2 border-navy text-navy hover:bg-navy hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}