import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = 'md',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'mts-p-3',
    md: 'mts-p-4',
    lg: 'mts-p-6',
  };

  const shadowStyles = {
    none: '',
    sm: 'mts-shadow-sm',
    md: 'mts-shadow-md',
    lg: 'mts-shadow-lg',
  };

  const baseStyles = 'mts-rounded-lg mts-border mts-border-secondary-200 mts-bg-white';

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${shadowStyles[shadow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
