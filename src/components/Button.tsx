import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'mts-inline-flex mts-items-center mts-justify-center mts-rounded-md mts-font-medium mts-transition-colors mts-focus:mts-outline-none mts-focus:mts-ring-2 mts-focus:mts-ring-offset-2 disabled:mts-opacity-50 disabled:mts-cursor-not-allowed';

  const variants = {
    primary:
      'mts-bg-primary-500 mts-text-white hover:mts-bg-primary-600 mts-focus:mts-ring-primary-500',
    secondary:
      'mts-bg-secondary-100 mts-text-secondary-900 hover:mts-bg-secondary-200 mts-focus:mts-ring-secondary-500',
    danger:
      'mts-bg-danger-500 mts-text-white hover:mts-bg-danger-600 mts-focus:mts-ring-danger-500',
  };

  const sizes = {
    sm: 'mts-px-3 mts-py-1.5 mts-text-sm mts-gap-1.5',
    md: 'mts-px-4 mts-py-2 mts-text-base mts-gap-2',
    lg: 'mts-px-6 mts-py-3 mts-text-lg mts-gap-2.5',
  };

  const spinnerSizes = {
    sm: 'mts-w-3 mts-h-3',
    md: 'mts-w-4 mts-h-4',
    lg: 'mts-w-5 mts-h-5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className={`mts-animate-spin ${spinnerSizes[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="mts-opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="mts-opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
