import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input, Textarea, Select } from './Input';

describe('Input', () => {
  describe('rendering', () => {
    it('renders input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders help text when provided', () => {
      render(<Input helpText="Enter your email" />);
      expect(screen.getByText('Enter your email')).toBeInTheDocument();
    });

    it('renders error when provided', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('accepts placeholder prop', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('accepts type prop', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.type).toBe('email');
    });
  });

  describe('error state', () => {
    it('adds error styling when error prop is present', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('mts-border-danger-500');
    });

    it('sets aria-invalid when error is present', () => {
      render(<Input error="Error message" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-invalid to false when no error', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('uses normal styling when no error', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('mts-border-secondary-300');
    });

    it('error has role alert', () => {
      render(<Input error="Error message" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Error message');
    });

    it('does not show help text when error is present', () => {
      render(<Input error="Error" helpText="Help text" />);
      expect(screen.queryByText('Help text')).not.toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('disables input when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('applies disabled styling', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toHaveClass('disabled:mts-opacity-50');
    });
  });

  describe('customization', () => {
    it('accepts custom className', () => {
      render(<Input className="mts-mb-4" />);
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveClass('mts-mb-4');
    });
  });
});

describe('Textarea', () => {
  describe('rendering', () => {
    it('renders textarea element', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Textarea label="Comments" />);
      expect(screen.getByLabelText('Comments')).toBeInTheDocument();
    });

    it('accepts placeholder prop', () => {
      render(<Textarea placeholder="Enter comments" />);
      expect(screen.getByPlaceholderText('Enter comments')).toBeInTheDocument();
    });

    it('is multiline', async () => {
      const { container } = render(<Textarea />);
      const textarea = container.querySelector('textarea');
      expect(textarea?.tagName).toBe('TEXTAREA');
    });
  });

  describe('error state', () => {
    it('displays error message', () => {
      render(<Textarea error="Text too long" />);
      expect(screen.getByText('Text too long')).toBeInTheDocument();
    });

    it('sets aria-invalid when error present', () => {
      render(<Textarea error="Error" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('help text', () => {
    it('displays help text when no error', () => {
      render(<Textarea helpText="Max 500 characters" />);
      expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
    });

    it('hides help text when error present', () => {
      render(<Textarea error="Too long" helpText="Max 500 characters" />);
      expect(screen.queryByText('Max 500 characters')).not.toBeInTheDocument();
    });
  });
});

describe('Select', () => {
  describe('rendering', () => {
    it('renders select element', () => {
      render(
        <Select>
          <option>Option 1</option>
        </Select>
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(
        <Select label="Choose option">
          <option>Option 1</option>
        </Select>
      );
      expect(screen.getByLabelText('Choose option')).toBeInTheDocument();
    });

    it('renders options', () => {
      render(
        <Select>
          <option>Option 1</option>
          <option>Option 2</option>
        </Select>
      );
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('displays error message', () => {
      render(
        <Select error="Please select an option">
          <option>Option 1</option>
        </Select>
      );
      expect(screen.getByText('Please select an option')).toBeInTheDocument();
    });

    it('sets aria-invalid when error present', () => {
      render(
        <Select error="Error">
          <option>Option 1</option>
        </Select>
      );
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('disabled state', () => {
    it('disables select when disabled prop is true', () => {
      render(
        <Select disabled>
          <option>Option 1</option>
        </Select>
      );
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });
});
