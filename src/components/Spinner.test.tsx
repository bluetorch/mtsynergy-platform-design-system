import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  describe('rendering', () => {
    it('renders with role status', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has accessible label', () => {
      render(<Spinner />);
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('renders as SVG element', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner.tagName).toBe('svg');
    });

    it('has animation class', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toHaveClass('mts-animate-spin');
    });
  });

  describe('sizes', () => {
    it('applies medium size by default', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toHaveClass('mts-w-8', 'mts-h-8');
    });

    it('applies small size when specified', () => {
      render(<Spinner size="sm" />);
      expect(screen.getByRole('status')).toHaveClass('mts-w-4', 'mts-h-4');
    });

    it('applies large size when specified', () => {
      render(<Spinner size="lg" />);
      expect(screen.getByRole('status')).toHaveClass('mts-w-12', 'mts-h-12');
    });
  });

  describe('customization', () => {
    it('accepts custom className', () => {
      render(<Spinner className="mts-text-primary-500" />);
      expect(screen.getByRole('status')).toHaveClass('mts-text-primary-500');
    });

    it('handles undefined size gracefully', () => {
      render(<Spinner size={undefined} />);
      expect(screen.getByRole('status')).toHaveClass('mts-w-8', 'mts-h-8');
    });
  });

  describe('accessibility', () => {
    it('can be announced by screen readers', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });
  });
});
