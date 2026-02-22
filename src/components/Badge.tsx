import React from 'react';

type BadgeStatus = 'NEW' | 'ASSIGNED' | 'RESOLVED' | 'SPAM';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: BadgeStatus;
  size?: BadgeSize;
  children: React.ReactNode;
}

const statusStyles: Record<BadgeStatus, string> = {
  NEW: 'mts-bg-info-100 mts-text-info-700 mts-border-info-200',
  ASSIGNED: 'mts-bg-warning-100 mts-text-warning-700 mts-border-warning-200',
  RESOLVED: 'mts-bg-success-100 mts-text-success-700 mts-border-success-200',
  SPAM: 'mts-bg-danger-100 mts-text-danger-700 mts-border-danger-200',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'mts-px-2 mts-py-1 mts-text-xs mts-font-medium',
  md: 'mts-px-3 mts-py-1 mts-text-sm mts-font-medium',
};

export const Badge: React.FC<BadgeProps> = ({
  status = 'NEW',
  size = 'sm',
  children,
  className,
  ...props
}) => {
  const baseStyles = 'mts-inline-flex mts-items-center mts-rounded-full mts-border';
  const statusClass = statusStyles[status];
  const sizeClass = sizeStyles[size];

  return (
    <span className={`${baseStyles} ${statusClass} ${sizeClass} ${className || ''}`} {...props}>
      {children}
    </span>
  );
};
