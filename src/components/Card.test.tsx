import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies base styles', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('mts-rounded-lg', 'mts-border', 'mts-bg-white');
    });

    it('forwards HTML attributes', () => {
      render(<Card data-testid="card-test">Test</Card>);
      expect(screen.getByTestId('card-test')).toBeInTheDocument();
    });
  });

  describe('padding variants', () => {
    it('applies default medium padding', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('mts-p-4');
    });

    it('applies small padding', () => {
      const { container } = render(<Card padding="sm">Test</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('mts-p-3');
    });

    it('applies large padding', () => {
      const { container } = render(<Card padding="lg">Test</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('mts-p-6');
    });

    it('applies no padding', () => {
      render(<Card padding="none">Test</Card>);
      const card = screen.getByText('Test').parentElement;
      expect(card?.className).not.toMatch(/mts-p-\d/);
    });
  });

  describe('shadow variants', () => {
    it('applies default medium shadow', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('mts-shadow-md');
    });

    it('applies small shadow', () => {
      const { container } = render(<Card shadow="sm">Test</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('mts-shadow-sm');
    });

    it('applies large shadow', () => {
      const { container } = render(<Card shadow="lg">Test</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('mts-shadow-lg');
    });

    it('applies no shadow', () => {
      render(<Card shadow="none">Test</Card>);
      const card = screen.getByText('Test').parentElement;
      expect(card?.className).not.toMatch(/mts-shadow/);
    });
  });

  describe('customization', () => {
    it('accepts custom className', () => {
      const { container } = render(<Card className="mts-max-w-md">Test</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('mts-max-w-md');
    });
  });
});
