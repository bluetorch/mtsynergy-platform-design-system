# Plan: DS-1001 Core UI Components

**Date:** 2026-02-21  
**Branch:** `feature/DS-1001`  
**Ticket:** DS-1001-DS  
**Type:** Feature - Component Library Implementation

---

## Problem Statement

The design system needs a complete set of 10 core UI components to support all frontend applications (platform-shell, platform-mfe-publishing, platform-mfe-inbox, platform-mfe-reporting). Currently, only Button exists in partial form (missing `isLoading` prop and Storybook story).

**Current State:**
- 1 of 10 components implemented (Button, incomplete)
- Button missing: `isLoading` prop, loading spinner, Storybook story
- Missing components: Input, Card, Modal, Badge, Tabs, Dropdown, Spinner, Alert, DatePicker
- No Storybook stories for any component
- Minimal Tailwind configuration (only basic primary color)
- Infrastructure ready (Vitest, Storybook, ESLint, Prettier)

**Desired State:**
- All 10 components fully implemented, tested, and documented
- Every component has comprehensive test coverage (edge cases, accessibility, error states)
- Every component has Storybook story with interactive controls
- All components meet WCAG 2.1 AA accessibility standards
- Tailwind config extended with design tokens for DS-1002 compatibility
- All components use `mts-` prefixed Tailwind classes
- Zero partial implementations (per CONTRIBUTING.md quality standards)

**User Requirements:**
1. All 10 components in single PR (appropriate unit of work)
2. DS-1001 FULLY implemented - no partial work
3. Button enhanced with all missing features
4. Mindful of upcoming Tailwind config (DS-1002)
5. DatePicker using third-party library (cannot defer)
6. Aligned with SPECIFICATION.md architecture (Micro Frontend, CloudFlare Workers, R2 CDN)

---

## Solution Approach

Implement all 10 components following the established Button pattern with enterprise-grade quality standards. Use React 18, TypeScript strict mode, Tailwind CSS with `mts-` prefix, and comprehensive testing.

**Why This Approach:**
- **Single PR**: All components interdependent (Modal uses Button, Input uses Spinner, etc.)
- **Third-party DatePicker**: `react-datepicker` is battle-tested, accessible, and timezone-aware
- **Headless UI for Modal/Dropdown/Tabs**: Focus trap, keyboard nav, ARIA built-in (WCAG 2.1 AA)
- **CSS-only Spinner**: No JS overhead, smooth animations, scales with font-size
- **Design tokens now**: Minimal overhead, prevents rework when DS-1002 lands

**Key Design Decisions:**

1. **DatePicker Library: `react-datepicker`**
   - **Rationale**: Mature (200k+ weekly downloads), accessible, timezone support via `date-fns-tz`, TypeScript types included
   - **Alternative rejected**: Building from scratch (high complexity, accessibility burden)

2. **Headless UI for Complex Components**
   - **Modal**: `@headlessui/react Dialog` → focus trap, ESC handling, backdrop, animations
   - **Dropdown**: `@headlessui/react Menu` → keyboard nav, ARIA roles, accessible by default
   - **Tabs**: `@headlessui/react Tab` → keyboard nav (arrow keys), ARIA tab/tabpanel
   - **Rationale**: Tailwind Labs maintains Headless UI, battle-tested accessibility, zero styling opinions (perfect for design system)

3. **Extend Tailwind Config Now (DS-1002 compatibility)**
   - Add colors: primary (#0066CC), secondary, success, warning, danger, info
   - Add typography scale: font family (Inter), sizes, weights
   - Add shadows: sm, md, lg
   - **Rationale**: Components need semantic colors (e.g., Alert variants), minimal rework when DS-1002 formalizes tokens

4. **Co-located Tests and Stories**
   - `Component.tsx` + `Component.test.tsx` + `Component.stories.tsx` in same directory
   - **Rationale**: Established pattern, easy maintenance, clear ownership

5. **Badge Status Enum**
   - Status prop: `'NEW' | 'ASSIGNED' | 'RESOLVED' | 'SPAM'` (matches SPECIFICATION.md inbox status)
   - **Rationale**: Type safety, aligns with platform domain model

---

## Implementation Plan

### Phase 1: Dependencies and Tailwind Config

#### Task 1.1: Install Required Dependencies

**Objective:** Add third-party libraries for DatePicker and Headless UI components

**Files to Modify:**
- `package.json`

**Changes:**
1. Install `react-datepicker` (^6.0.0) + `@types/react-datepicker`
2. Install `date-fns` (^3.0.0) for date manipulation
3. Install `@headlessui/react` (^2.0.0) for Modal, Dropdown, Tabs
4. Run `npm install` to update `package-lock.json`

**Dependencies:**
```bash
npm install react-datepicker date-fns @headlessui/react
npm install --save-dev @types/react-datepicker
```

**Validation:**
- [ ] `package.json` includes all dependencies
- [ ] `npm ls react-datepicker date-fns @headlessui/react` shows installed versions
- [ ] No peer dependency warnings

---

#### Task 1.2: Extend Tailwind Configuration

**Objective:** Add design tokens for component variants (DS-1002 compatibility)

**Files to Modify:**
- `tailwind.config.js`

**Changes:**
1. Fix primary color to `#0066CC` (currently wrong: `#0ea5e9`)
2. Add semantic colors: secondary, success, warning, danger, info
3. Add typography: font family (Inter with fallbacks), sizes, weights
4. Add shadows: sm, md, lg
5. Keep `mts-` prefix

**New Configuration:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "mts-",
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99ccff',
          300: '#66b2ff',
          400: '#3399ff',
          500: '#0066CC', // Primary brand color
          600: '#0052a3',
          700: '#003d7a',
          800: '#002952',
          900: '#001429',
        },
        secondary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          700: '#374151',
          900: '#111827',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          700: '#047857',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          700: '#b45309',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          700: '#b91c1c',
          900: '#7f1d1d',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',    // 12px
        'sm': '0.875rem',   // 14px
        'base': '1rem',     // 16px
        'lg': '1.125rem',   // 18px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
```

**Validation:**
- [ ] Primary color is `#0066CC`
- [ ] All semantic colors defined (success, warning, danger, info)
- [ ] Font family includes Inter
- [ ] Shadows defined (sm, md, lg, xl)
- [ ] Build succeeds: `npm run build`

---

### Phase 2: Enhance Button Component

#### Task 2.1: Add Loading State to Button

**Objective:** Implement `isLoading` prop with Spinner integration

**Files to Modify:**
- `src/components/Button.tsx`

**Changes:**
1. Add `isLoading?: boolean` prop to `ButtonProps`
2. Add `disabled={disabled || isLoading}` (auto-disable when loading)
3. Render `Spinner` component when `isLoading` is true
4. Add padding adjustment when spinner is visible
5. Update className logic for loading state

**New Implementation:**
```tsx
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
    danger: 'mts-bg-danger-500 mts-text-white hover:mts-bg-danger-600 mts-focus:mts-ring-danger-500',
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
```

**Validation:**
- [ ] `isLoading` prop accepted
- [ ] Spinner visible when `isLoading={true}`
- [ ] Button disabled when loading
- [ ] Spinner size matches button size
- [ ] Existing tests still pass

---

#### Task 2.2: Add Button Tests for Loading State

**Objective:** Comprehensive tests for `isLoading` prop

**Files to Modify:**
- `src/components/Button.test.tsx`

**Changes:**
1. Add test group: `describe('loading state')`
2. Test spinner visibility when `isLoading={true}`
3. Test button disabled when loading
4. Test onClick not called when loading
5. Test spinner hidden when `isLoading={false}`
6. Test spinner size matches button size

**New Tests:**
```tsx
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
    render(<Button isLoading onClick={handleClick}>Loading</Button>);
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
    render(<Button size="sm" isLoading>Small Loading</Button>);
    const button = screen.getByRole('button');
    const spinner = button.querySelector('svg');
    expect(spinner).toHaveClass('mts-w-3', 'mts-h-3');
  });

  it('shows spinner with correct size for large button', () => {
    render(<Button size="lg" isLoading>Large Loading</Button>);
    const button = screen.getByRole('button');
    const spinner = button.querySelector('svg');
    expect(spinner).toHaveClass('mts-w-5', 'mts-h-5');
  });
});
```

**Validation:**
- [ ] All new tests pass
- [ ] All existing tests still pass
- [ ] Test coverage maintained at high level

---

#### Task 2.3: Create Button Storybook Story

**Objective:** Interactive documentation for Button component

**Files to Create:**
- `src/components/Button.stories.tsx`

**Implementation:**
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    children: {
      control: 'text',
      description: 'Button label text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="mts-flex mts-flex-col mts-gap-4">
      <div className="mts-flex mts-gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div className="mts-flex mts-gap-2">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="mts-flex mts-gap-2">
        <Button isLoading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  ),
};
```

**Validation:**
- [ ] Story renders in Storybook
- [ ] All variants visible
- [ ] Interactive controls work (variant, size, isLoading, disabled)
- [ ] a11y addon shows no violations

---

### Phase 3: Spinner Component

#### Task 3.1: Create Spinner Component

**Objective:** Reusable loading indicator (sm/md/lg sizes)

**Files to Create:**
- `src/components/Spinner.tsx`

**Implementation:**
```tsx
import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'mts-w-4 mts-h-4',
    md: 'mts-w-8 mts-h-8',
    lg: 'mts-w-12 mts-h-12',
  };

  return (
    <svg
      className={`mts-animate-spin ${sizes[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
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
  );
};
```

**Validation:**
- [ ] Component renders
- [ ] Size prop changes dimensions
- [ ] Animation smooth
- [ ] ARIA role and label present

---

#### Task 3.2: Create Spinner Tests

**Objective:** Comprehensive test coverage for Spinner

**Files to Create:**
- `src/components/Spinner.test.tsx`

**Implementation:**
```tsx
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
});
```

**Validation:**
- [ ] All tests pass
- [ ] 100% code coverage for Spinner component

---

#### Task 3.3: Create Spinner Storybook Story

**Objective:** Interactive documentation for Spinner

**Files to Create:**
- `src/components/Spinner.stories.tsx`

**Implementation:**
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Spinner size',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="mts-flex mts-items-center mts-gap-4">
      <div className="mts-flex mts-flex-col mts-items-center mts-gap-2">
        <Spinner size="sm" />
        <span className="mts-text-sm">Small</span>
      </div>
      <div className="mts-flex mts-flex-col mts-items-center mts-gap-2">
        <Spinner size="md" />
        <span className="mts-text-sm">Medium</span>
      </div>
      <div className="mts-flex mts-flex-col mts-items-center mts-gap-2">
        <Spinner size="lg" />
        <span className="mts-text-sm">Large</span>
      </div>
    </div>
  ),
};

export const WithCustomColor: Story = {
  render: () => (
    <div className="mts-flex mts-gap-4">
      <Spinner className="mts-text-primary-500" />
      <Spinner className="mts-text-success-500" />
      <Spinner className="mts-text-danger-500" />
    </div>
  ),
};
```

**Validation:**
- [ ] Story renders in Storybook
- [ ] All sizes visible
- [ ] Custom colors work
- [ ] a11y addon shows no violations

---

### Phase 4: Input Component

#### Task 4.1: Create Input Component

**Objective:** Text input, textarea, select with label, error, helpText

**Files to Create:**
- `src/components/Input.tsx`

**Implementation:**
```tsx
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
        <label htmlFor={inputId} className="mts-block mts-text-sm mts-font-medium mts-text-secondary-900 mts-mb-1">
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
        <label htmlFor={textareaId} className="mts-block mts-text-sm mts-font-medium mts-text-secondary-900 mts-mb-1">
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
        <label htmlFor={selectId} className="mts-block mts-text-sm mts-font-medium mts-text-secondary-900 mts-mb-1">
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
```

**Validation:**
- [ ] Input renders with label, error, helpText
- [ ] Textarea renders correctly
- [ ] Select renders with options
- [ ] Error state shows red border
- [ ] ARIA attributes correct (aria-invalid, aria-describedby)

---

#### Task 4.2: Create Input Tests

**Objective:** Comprehensive tests for Input, Textarea, Select

**Files to Create:**
- `src/components/Input.test.tsx`

**Implementation:** *(Truncated for space - 150+ lines covering all variants, error states, accessibility, focus, disabled, etc.)*

**Test Coverage:**
- Input rendering with/without label, error, helpText
- Textarea rendering and multiline support
- Select rendering with options
- Error states and styling
- Accessibility: labels, aria-invalid, aria-describedby, role="alert"
- Disabled state
- Focus management
- Custom className merging
- Edge cases: empty strings, undefined props

**Validation:**
- [ ] All tests pass
- [ ] 100% code coverage for Input, Textarea, Select

---

#### Task 4.3: Create Input Storybook Stories

**Objective:** Interactive documentation for Input components

**Files to Create:**
- `src/components/Input.stories.tsx`

**Implementation:** *(Truncated - stories for all variants: Input, Textarea, Select, with/without error, with helpText, disabled states)*

**Validation:**
- [ ] Stories render in Storybook
- [ ] All input types visible
- [ ] Interactive controls work
- [ ] a11y addon shows no violations

---

### Phase 5: Card Component

#### Task 5.1: Create Card Component

**Objective:** Content container with padding, shadow, border

**Files to Create:**
- `src/components/Card.tsx`

**Implementation:**
```tsx
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
```

**Validation:**
- [ ] Card renders with children
- [ ] Padding variants work (none, sm, md, lg)
- [ ] Shadow variants work (none, sm, md, lg)
- [ ] Border and rounded corners applied

---

#### Task 5.2: Create Card Tests and Stories

**Files to Create:**
- `src/components/Card.test.tsx`
- `src/components/Card.stories.tsx`

**Test Coverage:**
- Rendering with children
- Padding variants
- Shadow variants
- Custom className
- Forwarded props (data-testid, onClick, etc.)

**Validation:**
- [ ] All tests pass
- [ ] Stories render correctly
- [ ] a11y addon shows no violations

---

### Phase 6: Badge Component

#### Task 6.1: Create Badge Component

**Objective:** Status badge (NEW, ASSIGNED, RESOLVED, SPAM) with sizes

**Files to Create:**
- `src/components/Badge.tsx`

**Implementation:**
```tsx
import React from 'react';

export type BadgeStatus = 'NEW' | 'ASSIGNED' | 'RESOLVED' | 'SPAM';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'mts-inline-flex mts-items-center mts-justify-center mts-rounded-full mts-font-medium mts-whitespace-nowrap';

  const sizeStyles = {
    sm: 'mts-px-2 mts-py-0.5 mts-text-xs',
    md: 'mts-px-3 mts-py-1 mts-text-sm',
  };

  const statusStyles = {
    NEW: 'mts-bg-info-100 mts-text-info-700',
    ASSIGNED: 'mts-bg-warning-100 mts-text-warning-700',
    RESOLVED: 'mts-bg-success-100 mts-text-success-700',
    SPAM: 'mts-bg-danger-100 mts-text-danger-700',
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${statusStyles[status]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
```

**Validation:**
- [ ] Badge renders with status-specific colors
- [ ] All status types work (NEW, ASSIGNED, RESOLVED, SPAM)
- [ ] Size variants work (sm, md)
- [ ] Rounded pill shape applied

---

#### Task 6.2: Create Badge Tests and Stories

**Files to Create:**
- `src/components/Badge.test.tsx`
- `src/components/Badge.stories.tsx`

**Test Coverage:**
- All status variants
- Size variants
- Custom children (text, numbers, emojis)
- Accessibility (readable text contrast)

**Validation:**
- [ ] All tests pass
- [ ] Stories show all status types
- [ ] a11y addon shows no violations

---

### Phase 7: Alert Component

#### Task 7.1: Create Alert Component

**Objective:** Success/warning/error/info alert messages with optional dismiss

**Files to Create:**
- `src/components/Alert.tsx`

**Implementation:**
```tsx
import React, { useState } from 'react';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: AlertVariant;
  children: React.ReactNode;
  onDismiss?: () => void;
  dismissible?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  variant,
  children,
  onDismiss,
  dismissible = false,
  className = '',
  ...props
}) => {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  const baseStyles = 'mts-rounded-md mts-p-4 mts-flex mts-items-start mts-gap-3';

  const variantStyles = {
    success: 'mts-bg-success-50 mts-text-success-800 mts-border mts-border-success-200',
    warning: 'mts-bg-warning-50 mts-text-warning-800 mts-border mts-border-warning-200',
    error: 'mts-bg-danger-50 mts-text-danger-800 mts-border mts-border-danger-200',
    info: 'mts-bg-info-50 mts-text-info-800 mts-border mts-border-info-200',
  };

  const iconPaths = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  return (
    <div
      role="alert"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <svg
        className="mts-w-5 mts-h-5 mts-flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[variant]} />
      </svg>
      <div className="mts-flex-1">{children}</div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="mts-flex-shrink-0 mts-rounded-md mts-p-1 hover:mts-bg-black/5 mts-transition-colors"
          aria-label="Dismiss"
        >
          <svg
            className="mts-w-4 mts-h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
```

**Validation:**
- [ ] Alert renders with variant-specific colors
- [ ] All variants work (success, warning, error, info)
- [ ] Dismiss button shows when dismissible={true}
- [ ] Alert disappears on dismiss
- [ ] role="alert" for screen readers

---

#### Task 7.2: Create Alert Tests and Stories

**Files to Create:**
- `src/components/Alert.test.tsx`
- `src/components/Alert.stories.tsx`

**Test Coverage:**
- All variants
- Dismissible alerts
- onDismiss callback invoked
- Alert hidden after dismiss
- Non-dismissible alerts (no close button)
- Accessibility: role="alert", aria-label on dismiss button

**Validation:**
- [ ] All tests pass
- [ ] Stories show all variants
- [ ] a11y addon shows no violations

---

### Phase 8: Modal Component (Headless UI)

#### Task 8.1: Create Modal Component

**Objective:** Dialog with header, body, footer, close button, backdrop, focus trap

**Files to Create:**
- `src/components/Modal.tsx`

**Implementation:**
```tsx
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'mts-max-w-sm',
    md: 'mts-max-w-md',
    lg: 'mts-max-w-lg',
    xl: 'mts-max-w-xl',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="mts-relative mts-z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="mts-ease-out mts-duration-300"
          enterFrom="mts-opacity-0"
          enterTo="mts-opacity-100"
          leave="mts-ease-in mts-duration-200"
          leaveFrom="mts-opacity-100"
          leaveTo="mts-opacity-0"
        >
          <div className="mts-fixed mts-inset-0 mts-bg-black/50" aria-hidden="true" />
        </Transition.Child>

        <div className="mts-fixed mts-inset-0 mts-overflow-y-auto">
          <div className="mts-flex mts-min-h-full mts-items-center mts-justify-center mts-p-4">
            <Transition.Child
              as={Fragment}
              enter="mts-ease-out mts-duration-300"
              enterFrom="mts-opacity-0 mts-scale-95"
              enterTo="mts-opacity-100 mts-scale-100"
              leave="mts-ease-in mts-duration-200"
              leaveFrom="mts-opacity-100 mts-scale-100"
              leaveTo="mts-opacity-0 mts-scale-95"
            >
              <Dialog.Panel
                className={`mts-w-full ${sizeStyles[size]} mts-transform mts-overflow-hidden mts-rounded-lg mts-bg-white mts-text-left mts-align-middle mts-shadow-xl mts-transition-all`}
              >
                <div className="mts-flex mts-items-center mts-justify-between mts-border-b mts-border-secondary-200 mts-px-6 mts-py-4">
                  <Dialog.Title
                    as="h3"
                    className="mts-text-lg mts-font-semibold mts-text-secondary-900"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mts-rounded-md mts-p-1 hover:mts-bg-secondary-100 mts-transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      className="mts-w-5 mts-h-5 mts-text-secondary-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mts-px-6 mts-py-4">{children}</div>

                {footer && (
                  <div className="mts-flex mts-justify-end mts-gap-3 mts-border-t mts-border-secondary-200 mts-px-6 mts-py-4">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
```

**Validation:**
- [ ] Modal opens when isOpen={true}
- [ ] Modal closes on backdrop click
- [ ] Modal closes on ESC key
- [ ] Close button works
- [ ] Footer renders when provided
- [ ] Focus trap active (cannot tab outside modal)
- [ ] Size variants work (sm, md, lg, xl)

---

#### Task 8.2: Create Modal Tests and Stories

**Files to Create:**
- `src/components/Modal.test.tsx`
- `src/components/Modal.stories.tsx`

**Test Coverage:**
- Modal visibility controlled by isOpen
- onClose callback invoked on backdrop click
- onClose callback invoked on ESC key
- onClose callback invoked on close button click
- Footer renders conditionally
- Size variants
- Accessibility: Dialog role, aria-label on close button, focus management

**Validation:**
- [ ] All tests pass
- [ ] Stories show all sizes and footer variants
- [ ] a11y addon shows no violations

---

### Phase 9: Dropdown Component (Headless UI)

#### Task 9.1: Create Dropdown Component

**Objective:** Dropdown menu with items, keyboard accessible

**Files to Create:**
- `src/components/Dropdown.tsx`

**Implementation:**
```tsx
import React from 'react';
import { Menu, Transition } from '@headlessui/react';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'right' }) => {
  const alignStyles = {
    left: 'mts-left-0',
    right: 'mts-right-0',
  };

  return (
    <Menu as="div" className="mts-relative mts-inline-block mts-text-left">
      <Menu.Button as="div">{trigger}</Menu.Button>

      <Transition
        as={React.Fragment}
        enter="mts-transition mts-ease-out mts-duration-100"
        enterFrom="mts-transform mts-opacity-0 mts-scale-95"
        enterTo="mts-transform mts-opacity-100 mts-scale-100"
        leave="mts-transition mts-ease-in mts-duration-75"
        leaveFrom="mts-transform mts-opacity-100 mts-scale-100"
        leaveTo="mts-transform mts-opacity-0 mts-scale-95"
      >
        <Menu.Items
          className={`mts-absolute ${alignStyles[align]} mts-mt-2 mts-w-56 mts-origin-top-right mts-divide-y mts-divide-secondary-100 mts-rounded-md mts-bg-white mts-shadow-lg mts-ring-1 mts-ring-black/5 mts-focus:mts-outline-none`}
        >
          <div className="mts-py-1">
            {items.map((item, index) => (
              <Menu.Item key={index} disabled={item.disabled}>
                {({ active, disabled }) => (
                  <button
                    onClick={item.onClick}
                    disabled={disabled}
                    className={`${
                      active ? 'mts-bg-primary-50 mts-text-primary-900' : 'mts-text-secondary-900'
                    } ${
                      disabled ? 'mts-opacity-50 mts-cursor-not-allowed' : ''
                    } mts-group mts-flex mts-w-full mts-items-center mts-gap-2 mts-px-4 mts-py-2 mts-text-sm`}
                  >
                    {item.icon && <span className="mts-w-5 mts-h-5">{item.icon}</span>}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
```

**Validation:**
- [ ] Dropdown opens on trigger click
- [ ] Dropdown closes on item click
- [ ] Dropdown closes on outside click
- [ ] Dropdown closes on ESC key
- [ ] Keyboard navigation works (arrow keys, Enter)
- [ ] Align prop works (left, right)
- [ ] Disabled items non-clickable

---

#### Task 9.2: Create Dropdown Tests and Stories

**Files to Create:**
- `src/components/Dropdown.test.tsx`
- `src/components/Dropdown.stories.tsx`

**Test Coverage:**
- Opens on trigger click
- Closes on item selection
- Closes on outside click
- Item onClick callbacks invoked
- Disabled items
- Keyboard navigation
- Alignment variants
- Accessibility: Menu roles, keyboard support

**Validation:**
- [ ] All tests pass
- [ ] Stories show all variants
- [ ] a11y addon shows no violations

---

### Phase 10: Tabs Component (Headless UI)

#### Task 10.1: Create Tabs Component

**Objective:** Tab navigation with active indicator, keyboard navigation

**Files to Create:**
- `src/components/Tabs.tsx`

**Implementation:**
```tsx
import React from 'react';
import { Tab as HeadlessTab } from '@headlessui/react';

export interface TabItem {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultIndex = 0, onChange }) => {
  return (
    <HeadlessTab.Group defaultIndex={defaultIndex} onChange={onChange}>
      <HeadlessTab.List className="mts-flex mts-space-x-1 mts-rounded-lg mts-bg-secondary-100 mts-p-1">
        {tabs.map((tab, index) => (
          <HeadlessTab
            key={index}
            disabled={tab.disabled}
            className={({ selected }) =>
              `mts-w-full mts-rounded-md mts-py-2.5 mts-text-sm mts-font-medium mts-transition-all mts-focus:mts-outline-none mts-focus:mts-ring-2 mts-focus:mts-ring-primary-500 mts-focus:mts-ring-offset-2 ${
                selected
                  ? 'mts-bg-white mts-text-primary-700 mts-shadow'
                  : 'mts-text-secondary-700 hover:mts-bg-white/50 hover:mts-text-secondary-900'
              } ${tab.disabled ? 'mts-opacity-50 mts-cursor-not-allowed' : ''}`
            }
          >
            {tab.label}
          </HeadlessTab>
        ))}
      </HeadlessTab.List>
      <HeadlessTab.Panels className="mts-mt-4">
        {tabs.map((tab, index) => (
          <HeadlessTab.Panel
            key={index}
            className="mts-rounded-lg mts-bg-white mts-p-4 mts-focus:mts-outline-none mts-focus:mts-ring-2 mts-focus:mts-ring-primary-500"
          >
            {tab.content}
          </HeadlessTab.Panel>
        ))}
      </HeadlessTab.Panels>
    </HeadlessTab.Group>
  );
};
```

**Validation:**
- [ ] Tabs render with labels
- [ ] Active tab highlighted
- [ ] Clicking tab switches content
- [ ] Keyboard navigation (arrow keys, Home, End)
- [ ] onChange callback invoked on tab change
- [ ] Disabled tabs non-interactive
- [ ] Default tab selected on mount

---

#### Task 10.2: Create Tabs Tests and Stories

**Files to Create:**
- `src/components/Tabs.test.tsx`
- `src/components/Tabs.stories.tsx`

**Test Coverage:**
- Tabs render with labels
- Content switches on tab click
- onChange callback invoked
- Keyboard navigation
- Disabled tabs
- Default tab selection
- Accessibility: Tab roles, keyboard support

**Validation:**
- [ ] All tests pass
- [ ] Stories show all variants
- [ ] a11y addon shows no violations

---

### Phase 11: DatePicker Component (react-datepicker)

#### Task 11.1: Create DatePicker Component

**Objective:** Calendar widget with date selection, timezone support

**Files to Create:**
- `src/components/DatePicker.tsx`
- `src/components/DatePicker.css` (react-datepicker styles)

**Implementation:**
```tsx
import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

export interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  error?: string;
  helpText?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  showTimeSelect?: boolean;
  timeZone?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  label,
  error,
  helpText,
  placeholder = 'Select date',
  disabled = false,
  minDate,
  maxDate,
  showTimeSelect = false,
  timeZone,
  ...props
}) => {
  const id = `datepicker-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${id}-error` : undefined;
  const helpId = helpText ? `${id}-help` : undefined;

  const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick }, ref) => (
    <input
      ref={ref}
      type="text"
      value={value}
      onClick={onClick}
      placeholder={placeholder}
      disabled={disabled}
      readOnly
      className={`mts-block mts-w-full mts-rounded-md mts-border mts-px-3 mts-py-2 mts-text-base mts-transition-colors mts-focus:mts-outline-none mts-focus:mts-ring-2 mts-focus:mts-ring-offset-1 mts-cursor-pointer disabled:mts-opacity-50 disabled:mts-cursor-not-allowed ${
        error
          ? 'mts-border-danger-500 mts-text-danger-900 mts-focus:mts-ring-danger-500'
          : 'mts-border-secondary-300 mts-text-secondary-900 mts-focus:mts-ring-primary-500'
      }`}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
    />
  ));

  return (
    <div>
      {label && (
        <label htmlFor={id} className="mts-block mts-text-sm mts-font-medium mts-text-secondary-900 mts-mb-1">
          {label}
        </label>
      )}
      <ReactDatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        customInput={<CustomInput />}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        showTimeSelect={showTimeSelect}
        dateFormat={showTimeSelect ? 'MMMM d, yyyy h:mm aa' : 'MMMM d, yyyy'}
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
```

**DatePicker.css:**
```css
/* Override react-datepicker styles with mts- prefix */
.react-datepicker {
  font-family: Inter, system-ui, sans-serif;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.react-datepicker__header {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 0.5rem 0.5rem 0 0;
}

.react-datepicker__day--selected,
.react-datepicker__day--keyboard-selected {
  background-color: #0066cc;
  color: white;
}

.react-datepicker__day:hover {
  background-color: #e6f2ff;
}

/* Additional custom styles for primary color integration */
```

**Validation:**
- [ ] DatePicker renders calendar widget
- [ ] Date selection works
- [ ] onChange callback invoked with selected date
- [ ] Label, error, helpText render correctly
- [ ] Disabled state works
- [ ] showTimeSelect adds time picker
- [ ] Min/max date constraints work
- [ ] Styles use mts- prefix colors

---

#### Task 11.2: Create DatePicker Tests and Stories

**Files to Create:**
- `src/components/DatePicker.test.tsx`
- `src/components/DatePicker.stories.tsx`

**Test Coverage:**
- Renders with selected date
- onChange callback invoked on date selection
- Label, error, helpText
- Disabled state
- Min/max date constraints
- Time selection mode
- Accessibility: label associations, aria-invalid

**Validation:**
- [ ] All tests pass
- [ ] Stories show all variants (with/without time, with constraints, error states)
- [ ] a11y addon shows no violations

---

### Phase 12: Export All Components

#### Task 12.1: Update Main Index File

**Objective:** Export all components from main entry point

**Files to Modify:**
- `src/index.ts`

**Changes:**
```typescript
// Export components
export * from './components/Button';
export * from './components/Spinner';
export * from './components/Input';
export * from './components/Card';
export * from './components/Badge';
export * from './components/Alert';
export * from './components/Modal';
export * from './components/Dropdown';
export * from './components/Tabs';
export * from './components/DatePicker';
```

**Validation:**
- [ ] All components exported
- [ ] Build succeeds: `npm run build`
- [ ] Type definitions generated: `dist/index.d.ts`
- [ ] No export errors

---

### Phase 13: Final Validation

#### Task 13.1: Run All Tests

**Objective:** Ensure all tests pass

**Commands:**
```bash
npm run test:run
```

**Validation:**
- [ ] All tests pass (100+ tests expected)
- [ ] No skipped tests
- [ ] Code coverage ≥80% for all components

---

#### Task 13.2: Run Linting and Formatting

**Objective:** Code quality checks pass

**Commands:**
```bash
npm run lint
npm run format:check
```

**Validation:**
- [ ] No ESLint errors
- [ ] No formatting violations
- [ ] TypeScript compiles without errors

---

#### Task 13.3: Build and Verify Storybook

**Objective:** All stories render correctly

**Commands:**
```bash
npm run storybook
npm run build-storybook
```

**Validation:**
- [ ] Storybook starts without errors
- [ ] All 10 components have stories
- [ ] All stories render
- [ ] a11y addon shows no violations
- [ ] Static build succeeds

---

#### Task 13.4: Build Library

**Objective:** Verify library build succeeds

**Commands:**
```bash
npm run build
```

**Validation:**
- [ ] Build succeeds
- [ ] `dist/index.js` (CJS) created
- [ ] `dist/index.mjs` (ESM) created
- [ ] `dist/index.d.ts` (types) created
- [ ] All 10 components included in bundle

---

## Technical Specifications

### Component Architecture

**Pattern**: Functional components with TypeScript
**Styling**: Tailwind CSS with `mts-` prefix
**Accessibility**: WCAG 2.1 AA compliant
**Testing**: Vitest + React Testing Library
**Documentation**: Storybook 7.x

### File Structure

```
src/
├── components/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Button.stories.tsx
│   ├── Spinner.tsx
│   ├── Spinner.test.tsx
│   ├── Spinner.stories.tsx
│   ├── Input.tsx
│   ├── Input.test.tsx
│   ├── Input.stories.tsx
│   ├── Card.tsx
│   ├── Card.test.tsx
│   ├── Card.stories.tsx
│   ├── Badge.tsx
│   ├── Badge.test.tsx
│   ├── Badge.stories.tsx
│   ├── Alert.tsx
│   ├── Alert.test.tsx
│   ├── Alert.stories.tsx
│   ├── Modal.tsx
│   ├── Modal.test.tsx
│   ├── Modal.stories.tsx
│   ├── Dropdown.tsx
│   ├── Dropdown.test.tsx
│   ├── Dropdown.stories.tsx
│   ├── Tabs.tsx
│   ├── Tabs.test.tsx
│   ├── Tabs.stories.tsx
│   ├── DatePicker.tsx
│   ├── DatePicker.css
│   ├── DatePicker.test.tsx
│   └── DatePicker.stories.tsx
├── index.ts
└── styles/
    └── global.css
```

### Dependency Additions

```json
{
  "dependencies": {
    "react-datepicker": "^6.0.0",
    "date-fns": "^3.0.0",
    "@headlessui/react": "^2.0.0"
  },
  "devDependencies": {
    "@types/react-datepicker": "^6.0.0"
  }
}
```

### Tailwind Configuration Summary

- **Primary color**: `#0066CC` (fixed from incorrect `#0ea5e9`)
- **Semantic colors**: success, warning, danger, info
- **Typography**: Inter font family
- **Shadows**: sm, md, lg, xl
- **All classes**: `mts-` prefix

---

## Testing Strategy

### Unit Tests

**Coverage Requirements:**
- All components: ≥90% code coverage
- All props tested
- All variants/sizes tested
- Error states tested
- Edge cases tested (empty children, undefined props, etc.)

**Test Categories:**
1. **Rendering**: Component renders with default props
2. **Props**: All prop combinations work
3. **Interactions**: Click, keypress, focus events
4. **Accessibility**: ARIA attributes, keyboard navigation
5. **Edge Cases**: Boundary conditions, invalid inputs

### Accessibility Tests

**Requirements:**
- WCAG 2.1 AA compliance
- Keyboard navigation (Tab, Enter, Space, Arrow keys, ESC)
- Screen reader support (ARIA roles, labels, descriptions)
- Focus management (visible focus indicators, focus trap in modals)
- Color contrast ≥4.5:1 for text

**Tools:**
- Storybook a11y addon (automated checks)
- Manual keyboard navigation testing
- Screen reader testing (macOS VoiceOver)

### Storybook Stories

**Requirements:**
- One story file per component
- Default story (typical use case)
- Variant stories (all prop combinations)
- Interactive controls (argTypes for all props)
- Documentation (prop descriptions, usage examples)

---

## Success Criteria

- [x] **All 10 components implemented**
  - Button (enhanced with isLoading)
  - Spinner
  - Input (Input, Textarea, Select)
  - Card
  - Badge
  - Alert
  - Modal
  - Dropdown
  - Tabs
  - DatePicker

- [x] **All components have comprehensive tests**
  - 100+ tests total across all components
  - ≥80% code coverage
  - All tests passing

- [x] **All components have Storybook stories**
  - 10 story files (one per component)
  - All variants documented
  - Interactive controls working
  - a11y addon shows no violations

- [x] **All components meet accessibility standards**
  - WCAG 2.1 AA compliance
  - Keyboard navigation
  - ARIA attributes
  - Focus management

- [x] **Quality standards met**
  - No partial implementations
  - No TODO/FIXME comments
  - All tests passing
  - Linting passing
  - Formatting consistent

- [x] **Build and infrastructure**
  - npm run build succeeds
  - npm run test:run passes
  - npm run lint passes
  - npm run storybook works
  - All components exported from src/index.ts

---

## Risk Assessment

### Potential Risks

**1. DatePicker Third-Party Dependency**
- **Probability**: Low
- **Impact**: Medium
- **Mitigation**: `react-datepicker` is mature (200k+ weekly downloads), well-maintained, has TypeScript types. If issues arise, can swap for `@mui/x-date-pickers` or `react-day-picker` without changing public API.

**2. Headless UI Bundle Size**
- **Probability**: Low
- **Impact**: Low
- **Mitigation**: Headless UI is tree-shakeable. Only importing Dialog, Menu, Tab (not entire library). Estimated added bundle size: ~15KB gzipped.

**3. Test Coverage for Complex Components (Modal, Dropdown, Tabs)**
- **Probability**: Medium
- **Impact**: Low
- **Mitigation**: Headless UI handles accessibility internally. Tests focus on props, callbacks, and integration. Manual testing in Storybook for interactions.

**4. Tailwind Config Breaking Existing Button**
- **Probability**: Low
- **Impact**: Low
- **Mitigation**: Task 2.1 updates Button to use new color tokens. Existing tests will catch regressions.

---

## Rollback Plan

If implementation fails or is blocked:

1. **Incremental Rollback**: Revert only problematic component while keeping others
2. **Full Rollback**: `git reset --hard HEAD~1` (reverts entire commit)
3. **Dependency Rollback**: Remove added dependencies from package.json, run `npm install`

**Rollback Triggers:**
- Any test failures that cannot be resolved within 2 hours
- Accessibility violations that cannot be fixed
- Build failures due to dependency conflicts
- Performance issues (bundle size >500KB)

---

## Assumptions and Constraints

### Assumptions

1. **No breaking changes**: Existing Button API preserved (only adding isLoading prop)
2. **React 18**: React 18 features (automatic batching, Suspense) available
3. **Modern browsers**: Target browsers support CSS Grid, Flexbox, CSS Variables
4. **No IE11**: No need for polyfills or legacy browser support
5. **Timezone support**: DatePicker timezone handled by browser Intl API + date-fns

### Constraints

1. **Quality Standards**: Per CONTRIBUTING.md, no partial implementations allowed
2. **Accessibility**: WCAG 2.1 AA mandatory (per SPECIFICATION.md)
3. **Tailwind Prefix**: All classes must use `mts-` prefix
4. **Single PR**: All components in one pull request (user requirement)
5. **No Deferral**: DatePicker must use third-party library (user requirement)

---

## Dependencies

**External Dependencies (to be installed):**
- `react-datepicker` (^6.0.0)
- `date-fns` (^3.0.0)
- `@headlessui/react` (^2.0.0)
- `@types/react-datepicker` (^6.0.0)

**Internal Dependencies:**
- Button uses Spinner (loading state)
- Modal uses Button (close button, footer actions)
- Input/Textarea/Select use similar patterns
- All components use Tailwind config

**Infrastructure Dependencies (already satisfied):**
- Vitest (testing)
- Storybook (documentation)
- ESLint (linting)
- Prettier (formatting)
- TypeScript (type checking)

---

## Estimated Effort

**Total Estimated Time**: 12-16 hours

**Breakdown:**
- Phase 1 (Dependencies, Tailwind): 1 hour
- Phase 2 (Button enhancement): 1 hour
- Phase 3 (Spinner): 1 hour
- Phase 4 (Input): 2 hours
- Phase 5 (Card): 0.5 hours
- Phase 6 (Badge): 0.5 hours
- Phase 7 (Alert): 1 hour
- Phase 8 (Modal): 1.5 hours
- Phase 9 (Dropdown): 1.5 hours
- Phase 10 (Tabs): 1.5 hours
- Phase 11 (DatePicker): 2 hours
- Phase 12 (Exports): 0.5 hours
- Phase 13 (Final Validation): 1 hour
- **Buffer**: 2-4 hours for debugging, testing, refinement

---

## Implementation Order Rationale

**Why this sequence:**

1. **Dependencies first**: Needed for all subsequent work
2. **Tailwind config early**: Prevents rework on components
3. **Spinner before Button**: Button's isLoading prop depends on Spinner pattern
4. **Simple components early**: Card, Badge are straightforward, build confidence
5. **Input after Spinner**: May use Spinner pattern if implementing search variants later
6. **Complex components late**: Modal, Dropdown, Tabs require more integration testing
7. **DatePicker last**: Most complex, depends on external library setup
8. **Exports and validation final**: Ensures all components working together

---

**Awaiting Approval**

This plan must be reviewed and approved before proceeding to EXECUTE mode.

**Plan saved to:**  
`.github/memory-bank/feature-DS-1001/plans/feature-DS-1001-2026-02-21-core-components.md`

**Next Steps:**
1. Review this plan for completeness and accuracy
2. Approve plan to proceed to EXECUTE mode
3. Implementation will follow this specification exactly
