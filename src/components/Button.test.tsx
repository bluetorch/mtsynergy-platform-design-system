import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('renders as a button element', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('forwards additional HTML attributes', () => {
      render(
        <Button data-testid="custom-button" aria-label="Custom action">
          Test
        </Button>
      );
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('aria-label', 'Custom action');
    });

    it('merges custom className with component classes', () => {
      render(<Button className="custom-class">Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
      expect(button.className).toContain('mts-'); // still has component classes
    });
  });

  describe('variants', () => {
    it('applies primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('mts-bg-primary');
    });

    it('applies secondary variant when specified', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('mts-bg-secondary');
    });

    it('applies danger variant when specified', () => {
      render(<Button variant="danger">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('mts-bg-danger');
    });
  });

  describe('sizes', () => {
    it('applies medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('mts-px-4');
      expect(button.className).toContain('mts-py-2');
    });

    it('applies small size when specified', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('mts-px-3');
      expect(button.className).toContain('mts-py-1.5');
    });

    it('applies large size when specified', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('mts-px-6');
      expect(button.className).toContain('mts-py-3');
    });
  });

  describe('interactions', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies disabled attribute when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('loading state', () => {
    it('shows spinner when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('mts-animate-spin');
    });

    it('disables button when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not call onClick when isLoading', () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Loading
        </Button>
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('hides spinner when isLoading is false', () => {
      render(<Button isLoading={false}>Not Loading</Button>);
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      expect(spinner).not.toBeInTheDocument();
    });

    it('shows spinner with correct size for small button', () => {
      render(
        <Button size="sm" isLoading>
          Small Loading
        </Button>
      );
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      expect(spinner).toHaveClass('mts-w-3', 'mts-h-3');
    });

    it('shows spinner with correct size for medium button', () => {
      render(
        <Button size="md" isLoading>
          Medium Loading
        </Button>
      );
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      expect(spinner).toHaveClass('mts-w-4', 'mts-h-4');
    });

    it('shows spinner with correct size for large button', () => {
      render(
        <Button size="lg" isLoading>
          Large Loading
        </Button>
      );
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      expect(spinner).toHaveClass('mts-w-5', 'mts-h-5');
    });
  });

  describe('accessibility', () => {
    it('is focusable by default', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('is not focusable when disabled', () => {
      render(<Button disabled>Not focusable</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('accepts type attribute for form submission', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('spinner has aria-hidden attribute', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('edge cases', () => {
    it('handles empty children gracefully', () => {
      render(<Button>{''}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles undefined variant gracefully (uses default)', () => {
      render(<Button variant={undefined}>Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('mts-bg-primary');
    });

    it('handles undefined size gracefully (uses default)', () => {
      render(<Button size={undefined}>Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('mts-px-4');
    });

    it('handles undefined isLoading gracefully (uses default false)', () => {
      render(<Button isLoading={undefined}>Test</Button>);
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      expect(spinner).not.toBeInTheDocument();
    });

    it('respects both disabled and isLoading props', () => {
      render(
        <Button disabled isLoading>
          Test
        </Button>
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
