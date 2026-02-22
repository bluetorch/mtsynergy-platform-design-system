import React from 'react';
import RDPicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  error?: string;
  helpText?: string;
  showTimeSelect?: boolean;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  placeholderText?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  label,
  error,
  helpText,
  showTimeSelect = false,
  minDate,
  maxDate,
  dateFormat = showTimeSelect ? 'MMM d, yyyy h:mm aa' : 'MMM d, yyyy',
  disabled,
  id,
  className,
  placeholderText = 'Select a date',
}) => {
  const inputId = id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helpTextId = `${inputId}-help`;

  const baseClasses =
    'mts-w-full mts-px-3 mts-py-2 mts-border mts-rounded-lg mts-bg-white mts-text-secondary-900 mts-placeholder-secondary-400 mts-transition-colors';

  const normalClasses = error
    ? 'mts-border-danger-500 focus:mts-ring-danger-500 focus:mts-border-danger-500'
    : 'mts-border-secondary-300 focus:mts-ring-primary-500 focus:mts-border-primary-500';

  const disabledClasses = disabled
    ? 'mts-bg-secondary-100 mts-cursor-not-allowed mts-opacity-60'
    : '';

  const inputClasses = `${baseClasses} ${normalClasses} ${disabledClasses} ${className || ''}`;

  return (
    <div className="mts-w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mts-block mts-text-sm mts-font-medium mts-text-secondary-700 mts-mb-2"
        >
          {label}
        </label>
      )}

      <RDPicker
        selected={selected}
        onChange={onChange}
        showTimeSelect={showTimeSelect}
        timeIntervals={15}
        dateFormat={dateFormat}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        placeholderText={placeholderText}
        className={inputClasses}
        wrapperClassName="mts-w-full"
        aria-invalid={String(Boolean(error))}
        aria-describedby={error ? errorId : helpText ? helpTextId : undefined}
        id={inputId}
      />

      {error && (
        <div id={errorId} className="mts-mt-1 mts-text-sm mts-text-danger-600" role="alert">
          {error}
        </div>
      )}

      {!error && helpText && (
        <div id={helpTextId} className="mts-mt-1 mts-text-sm mts-text-secondary-500">
          {helpText}
        </div>
      )}
    </div>
  );
};
