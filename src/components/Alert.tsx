import React from 'react';

type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  children: React.ReactNode;
}

interface IconProps {
  className?: string;
}

const SuccessIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className || 'mts-w-5 mts-h-5'} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const WarningIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className || 'mts-w-5 mts-h-5'} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const ErrorIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className || 'mts-w-5 mts-h-5'} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

const InfoIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className || 'mts-w-5 mts-h-5'} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      clipRule="evenodd"
    />
  </svg>
);

const variantStyles: Record<AlertVariant, { bg: string; text: string; icon: string }> = {
  success: {
    bg: 'mts-bg-success-50 mts-border-success-200',
    text: 'mts-text-success-800',
    icon: 'mts-text-success-600',
  },
  warning: {
    bg: 'mts-bg-warning-50 mts-border-warning-200',
    text: 'mts-text-warning-800',
    icon: 'mts-text-warning-600',
  },
  error: {
    bg: 'mts-bg-danger-50 mts-border-danger-200',
    text: 'mts-text-danger-800',
    icon: 'mts-text-danger-600',
  },
  info: {
    bg: 'mts-bg-info-50 mts-border-info-200',
    text: 'mts-text-info-800',
    icon: 'mts-text-info-600',
  },
};

const iconMap: Record<AlertVariant, React.FC<IconProps>> = {
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  dismissible = false,
  onDismiss,
  children,
  className,
  ...props
}) => {
  const styles = variantStyles[variant];
  const IconComponent = iconMap[variant];

  const baseStyles = 'mts-flex mts-items-start mts-rounded-lg mts-border mts-p-4 mts-gap-3';

  return (
    <div
      role="alert"
      className={`${baseStyles} ${styles.bg} ${styles.text} ${className || ''}`}
      {...props}
    >
      <IconComponent className={`${styles.icon} mts-flex-shrink-0 mts-mt-0.5`} />

      <div className="mts-flex-grow">{children}</div>

      {dismissible && (
        <button
          onClick={onDismiss}
          aria-label="Close alert"
          className="mts-flex-shrink-0 mts-text-current mts-opacity-70 hover:mts-opacity-100 mts-transition-opacity"
        >
          <svg className="mts-w-5 mts-h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
