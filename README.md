# platform-design-system

**React Component Library — UI Components, Tailwind Tokens, Storybook**

## Overview

**platform-design-system** is a shared React component library containing:

- Reusable UI components (Button, Input, Card, Modal, etc.)
- Tailwind CSS design tokens (colors, spacing, typography)
- Storybook for component documentation & visual regression testing
- Deployed to CloudFlare R2 CDN for browser consumption via import maps

**Technology Stack:**
- **Language:** TypeScript/React
- **Styling:** Tailwind CSS 3.x
- **Build Tool:** Vite (ESM output)
- **Documentation:** Storybook 7.x
- **Testing:** Vitest + Chromatic (visual testing)
- **Distribution:** npm package (OneDev registry) + CDN (R2)

## Project Structure

```
platform-design-system/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── components/
│   │   ├── Button.tsx              # Button variants (primary, secondary, danger)
│   │   ├── Input.tsx               # Text input, textarea, select
│   │   ├── Card.tsx                # Content card container
│   │   ├── Modal.tsx               # Modal dialog
│   │   ├── Dropdown.tsx            # Dropdown menu
│   │   ├── Badge.tsx               # Status badge (New, Assigned, Resolved, Spam)
│   │   ├── Tabs.tsx                # Tab navigation
│   │   ├── Spinner.tsx             # Loading indicator
│   │   ├── Alert.tsx               # Alert messages
│   │   ├── DatePicker.tsx          # Date/time selector
│   │   └── index.ts                # Export all
│   ├── tokens/
│   │   ├── colors.ts               # Tailwind color palette
│   │   ├── spacing.ts              # Tailwind spacing scale
│   │   ├── typography.ts           # Font family, size, weight
│   │   ├── shadows.ts              # Shadow definitions
│   │   └── index.ts                # Export all tokens
│   ├── styles/
│   │   ├── tailwind.config.ts      # Tailwind configuration
│   │   ├── global.css              # Global styles (CSS variables)
│   │   └── themes.css              # Light/dark mode themes
│   ├── types/
│   │   └── index.ts                # Component prop types
│   ├── hooks/
│   │   ├── useTheme.ts             # Theme switching (light/dark)
│   │   └── useClickOutside.ts      # Utility hooks
│   └── __tests__/
│       ├── Button.test.tsx
│       └── Modal.test.tsx
├── stories/
│   ├── Button.stories.tsx          # Storybook story definitions
│   ├── Input.stories.tsx
│   ├── Modal.stories.tsx
│   └── ...
├── .storybook/
│   ├── main.ts                     # Storybook config
│   ├── preview.ts                  # Global preview config
│   └── manager.ts                  # Manager customization
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── package.json
├── README.md
├── SPECIFICATION.md
└── USER_STORIES.md
```

## Responsibilities

### 1. **Reusable UI Components**

#### Button

```typescript
// src/components/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', isLoading, ...props }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${isLoading ? 'is-loading' : ''}`}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {props.children}
    </button>
  );
}
```

#### Input

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export function Input({ label, error, helpText, ...props }: InputProps) {
  return (
    <div className="input-group">
      {label && <label className="label">{label}</label>}
      <input className={`input ${error ? 'input-error' : ''}`} {...props} />
      {error && <span className="error-text">{error}</span>}
      {helpText && <span className="help-text">{helpText}</span>}
    </div>
  );
}
```

#### Modal

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`} onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-action">{footer}</div>}
      </div>
    </div>
  );
}
```

#### Badge

```typescript
interface BadgeProps {
  status: 'NEW' | 'ASSIGNED' | 'RESOLVED' | 'SPAM' | 'DRAFT' | 'APPROVED';
  children: React.ReactNode;
}

export function Badge({ status, children }: BadgeProps) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{children}</span>;
}
```

### 2. **Tailwind Design Tokens**

```typescript
// src/tokens/colors.ts
export const COLORS = {
  primary: '#0066CC',
  secondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#D1D5DB',
  },
};

// src/styles/tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: COLORS,
      spacing: SPACING,
      typography: TYPOGRAPHY,
    },
  },
};
```

### 3. **Storybook Documentation**

```typescript
// stories/Button.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Button' },
};

export const Loading: Story = {
  args: { isLoading: true, children: 'Loading...' },
};
```

## Build & Development

### Local Development

```bash
npm install

# Run Storybook locally
npm run storybook
# Opens at http://localhost:6006

# Build library
npm run build

# Run tests
npm run test
npm run test:watch

# Visual regression testing (Chromatic)
npm run chromatic
```

### Storybook

```bash
# Start Storybook dev server
npm run storybook

# Build static Storybook for CI
npm run build-storybook

# Deploy to Chromatic (visual testing + documentation hosting)
npm run chromatic
```

## Configuration

### tailwind.config.ts

```typescript
import { COLORS, SPACING, TYPOGRAPHY } from './src/tokens';

export default {
  content: [
    './src/**/*.{tsx,ts}',
    './stories/**/*.{tsx,ts}',
  ],
  theme: {
    extend: {
      colors: COLORS,
      spacing: SPACING,
      fontFamily: TYPOGRAPHY.fontFamily,
      fontSize: TYPOGRAPHY.fontSize,
    },
  },
  plugins: [require('daisyui')],
};
```

## Distribution

### Publishing as npm Package

```bash
# Build library
npm run build

# Publish to OneDev registry (internal)
npm run publish

# Tag version
git tag v1.0.0
git push origin v1.0.0
```

### CDN Deployment (CloudFlare R2)

This package is deployed to R2 and injected via import maps in platform-shell responses:

```html
<script type="importmap">
{
  "imports": {
    "@mtsynergy/design-system": "https://r2.cdn.com/@mtsynergy/design-system@1.0.0/dist/index.esm.js"
  }
}
</script>
```

### Usage in Other Projects

```typescript
// platform-shell
import { Button, Input, Card } from '@mtsynergy/design-system';
import { COLORS } from '@mtsynergy/design-system/tokens';

// All components imported from CDN via import map
```

## Deployment

### To OneDev Registry

```bash
# Build
npm run build

# Publish
npm run publish
```

### To CloudFlare R2

```bash
# Build
npm run build

# Sync to R2
wrangler r2 cp ./dist/* r2://mtsynergy-cdn/@mtsynergy/design-system@1.0.0/ --recursive
```

### Deployment Checklist

- [ ] All tests passing (`npm run test`)
- [ ] Storybook stories complete & visual review approved
- [ ] Build succeeds (`npm run build`)
- [ ] Version bumped in package.json
- [ ] CHANGELOG.md updated
- [ ] Chromatic visual regression tests approved (no unexpected changes)
- [ ] Code review approved (CMP-020)
- [ ] Deployment approval (CMP-021)
- [ ] npm publish/R2 sync successful
- [ ] Verify CDN availability (curl the R2 URL)

## Performance Targets

- **Bundle Size:** < 50 KB (gzipped)
- **CSS Payload:** < 10 KB (Tailwind output)
- **Time to Interactive:** < 500ms (cached from R2)

## Versioning & Compatibility

Components follow semantic versioning:

- **Major (1.0.0 → 2.0.0):** Breaking API changes (component prop removal)
- **Minor (1.0.0 → 1.1.0):** New components, backward-compatible features
- **Patch (1.0.0 → 1.0.1):** Bug fixes, style adjustments

### Import Map Pinning

All consumers pin to specific versions in import maps:

```json
{
  "imports": {
    "@mtsynergy/design-system": "https://r2.cdn.com/@mtsynergy/design-system@1.0.0/dist/index.esm.js"
  }
}
```

This prevents breaking changes from affecting other projects.

## Related Projects

- **platform-shell** — Imports components via import map
- **platform-mfe-publishing** — Uses Button, Input, Modal, Badge, etc.
- **platform-mfe-inbox** — Uses Card, Badge, Button
- **platform-mfe-reporting** — Uses Card, Badge, Spinner
- **platform-mobile** — Does NOT use (React Native has own components)

---

**For story details:** See [USER_STORIES.md](USER_STORIES.md)

**For component API documentation:** See Storybook at `http://localhost:6006` (local dev)

