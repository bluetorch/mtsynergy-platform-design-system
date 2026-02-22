import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helpId = helpText ? `${inputId}-help` : undefined;

  const baseStyles =
    'mts-block mts-w-full mts-rounded-md mts-border mts-px-3 mts-py-2 mts-text-base mts-transition-colors mts-focus:mts-outline-none mts-focus:mts-ring-2 mts-focus:mts-ring-offset-1 disabled:mts-opacity-50 disabled:mts-cursor-not-allowed';

  const variantStyles = error
    ? 'mts-border-danger-500 mts-text-danger-900 mts-focus:mts-ring-danger-500'
    : 'mts-border-secondary-300 mts-text-secondary-900 mts-focus:mts-ring-primary-500';

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mts-block mts-text-sm mts-font-medium mts-text-secondary-900 mts-mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${baseStyles} ${variantStyles}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="mts-mt-1 mts-text-sm mts-text-danger-600" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={helpId} className="mts-mt-1 mts-text-sm mts-text-secondary-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helpText,
  id,
  className = '',
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helpId = helpText ? `${textareaId}-help` : undefined;

  const baseStyles =
    'mts-block mts-w-full mts-rounded-md mts-border mts-px-3 mts-py-2 mts-text-base mts-transition-colors mts-focus:mts-outline-none mts-focus:mts-ring-2 mts-focus:mts-ring-offset-1 disabled:mts-opacity-50 disabled:mts-cursor-not-allowed mts-resize-vertical';

  const variantStyles = error
    ? 'mts-border-danger-500 mts-text-danger-900 mts-focus:mts-ring-danger-500'
    : 'mts-border-secondary-300 mts-text-secondary-900 mts-focus:mts-ring-primary-500';

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={textareaId}
          className="mts-block mts-text-sm mts-font-medium mts-text-secondary-900 mts-mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`${baseStyles} ${variantStyles}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="mts-mt-1 mts-text-sm mts-text-danger-600" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={helpId} className="mts-mt-1 mts-text-sm mts-text-secondary-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helpText,
  id,
  className = '',
  children,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const helpId = helpText ? `${selectId}-help` : undefined;

  const baseStyles =
    'mts-block mts-w-full mts-rounded-md mts-border mts-px-3 mts-py-2 mts-text-base mts-transition-colors mts-focus:mts-outline-none mts-focus:mts-ring-2 mts-focus:mts-ring-offset-1 disabled:mts-opacity-50 disabled:mts-cursor-not-allowed mts-bg-white';

  const variantStyles = error
    ? 'mts-border-danger-500 mts-text-danger-900 mts-focus:mts-ring-danger-500'
    : 'mts-border-secondary-300 mts-text-secondary-900 mts-focus:mts-ring-primary-500';

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={selectId}
          className="mts-block mts-text-sm mts-font-medium mts-text-secondary-900 mts-mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`${baseStyles} ${variantStyles}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} className="mts-mt-1 mts-text-sm mts-text-danger-600" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={helpId} className="mts-mt-1 mts-text-sm mts-text-secondary-500">
          {helpText}
        </p>
      )}
    </div>
  );
};
