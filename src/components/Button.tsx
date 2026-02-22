import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const baseStyles = 'mts-inline-flex mts-items-center mts-justify-center mts-rounded-md mts-font-medium mts-transition-colors mts-focus:mts-outline-none mts-focus:mts-ring-2 mts-focus:mts-ring-offset-2';
  
  const variants = {
    primary: 'mts-bg-primary-500 mts-text-white hover:mts-bg-primary-600 mts-focus:mts-ring-primary-500',
    secondary: 'mts-bg-gray-100 mts-text-gray-900 hover:mts-bg-gray-200 mts-focus:mts-ring-gray-500',
    danger: 'mts-bg-red-600 mts-text-white hover:mts-bg-red-700 mts-focus:mts-ring-red-500',
  };

  const sizes = {
    sm: 'mts-px-3 mts-py-1.5 mts-text-sm',
    md: 'mts-px-4 mts-py-2 mts-text-base',
    lg: 'mts-px-6 mts-py-3 mts-text-lg',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
