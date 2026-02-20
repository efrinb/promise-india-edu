import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'danger' | 'secondary' | 'outline' | 'ghost';
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
    primary: 'bg-primary hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 text-white shadow-sm hover:shadow-md',
    danger: 'bg-accent hover:bg-accent-600 dark:bg-accent-600 dark:hover:bg-accent-500 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-secondary hover:bg-secondary-600 dark:bg-secondary-600 dark:hover:bg-secondary-500 text-white shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary dark:border-primary-400 text-primary dark:text-primary-400 hover:bg-primary hover:text-white dark:hover:bg-primary-600',
    ghost: 'text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
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