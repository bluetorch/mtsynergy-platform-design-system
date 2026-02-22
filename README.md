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
- **Testing:** Vitest + Loki (visual regression testing)
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

## Design Tokens

The design system exports platform-agnostic design tokens that work seamlessly across web (React/Tailwind) and mobile (React Native) applications.

### Token Categories

The following token categories are available:

- **Colors**: Full palette with accessibility-compliant contrast ratios
- **Spacing**: Responsive spacing scale (0–96px in 4px increments)
- **Typography**: Font families, sizes (12–36px), and weights (400–700)
- **Shadows**: Layered shadows for depth and hierarchy
- **Breakpoints**: Responsive breakpoints (sm, md, lg, xl, 2xl)
- **Border Radius**: Rounding scale from subtle to circular
- **Z-Index**: Layering system for modals, dropdowns, and tooltips

### Installation

Tokens are automatically exported with the package:

```bash
npm install @mtsynergy/design-system
```

### Usage

#### Web (React + Tailwind)

Use tokens directly in Tailwind CSS classes:

```typescript
import { Button, Input } from '@mtsynergy/design-system';

export function LoginForm() {
  return (
    <div className="p-8 gap-6 flex flex-col">
      <Input 
        label="Email" 
        placeholder="your@email.com"
        className="rounded-md border border-gray-200"
      />
      <Button 
        variant="primary" 
        className="bg-primary-600 hover:bg-primary-700"
      >
        Sign In
      </Button>
    </div>
  );
}
```

For direct token access in JavaScript:

```typescript
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BREAKPOINTS, BORDER_RADIUS, Z_INDEX } from '@mtsynergy/design-system/tokens';

// Use tokens programmatically
const buttonStyle = {
  padding: `${SPACING[4]}px ${SPACING[6]}px`, // 16px 24px
  backgroundColor: COLORS.primary[600],
  fontSize: TYPOGRAPHY.sizes.md,
  boxShadow: SHADOWS.md,
  borderRadius: BORDER_RADIUS.md,
};
```

#### Mobile (React Native)

Import tokens and use with StyleSheet or inline styles:

```typescript
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, Z_INDEX } from '@mtsynergy/design-system/tokens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING[6], // 24px
    backgroundColor: COLORS.background,
  },
  button: {
    paddingVertical: SPACING[3], // 12px
    paddingHorizontal: SPACING[4], // 16px
    backgroundColor: COLORS.primary[600],
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.md, // Includes elevation for React Native
  },
  buttonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights[600],
    color: COLORS.white,
  },
});

export function LoginButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Sign In</Text>
    </TouchableOpacity>
  );
}
```

### Platform Differences

| Feature | Web | React Native |
|---------|-----|--------------|
| **Spacing Units** | rem (via Tailwind) | px (numeric values) |
| **Shadows** | CSS box-shadow strings | elevation + iOS shadow objects |
| **Colors** | Hex strings | Hex strings |
| **Typography** | CSS font properties | fontSize + fontWeight |
| **Breakpoints** | CSS media queries | Manual layout logic |

### Type Safety

All tokens are fully typed with TypeScript:

```typescript
import type { ColorScale, SpacingScale, DesignTokens } from '@mtsynergy/design-system/tokens';

// Tokens autocomplete in your IDE
const color: keyof ColorScale = 'primary'; // ✓ Valid
const size: keyof SpacingScale = 4; // ✓ Valid
```

### JSON Export

For tooling and external systems, tokens are also available as JSON:

```bash
import tokens from '@mtsynergy/design-system/tokens.json';

console.log(tokens.colors.primary); // { "50": "#f0f7ff", "100": "#e0f1ff", ... }
```

### Extending Tokens

To add custom tokens while maintaining consistency, extend the token definitions:

```typescript
// your-app/tokens.ts
import { COLORS, SPACING } from '@mtsynergy/design-system/tokens';

export const CUSTOM_TOKENS = {
  colors: {
    ...COLORS,
    brand: {
      primary: '#your-color',
    },
  },
  spacing: {
    ...SPACING,
    custom: 100,
  },
};
```

### Documentation

For complete token specifications and values, see [src/tokens/README.md](./src/tokens/README.md).

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

# Visual regression testing (Loki)
npm run visual-test  # Build Storybook + run visual tests
npm run loki:update  # Update baselines after intentional changes
```

### Storybook

```bash
# Start Storybook dev server
npm run storybook

# Build static Storybook for deployment
npm run build-storybook

# Run visual regression tests
# Note: Requires HTTP server for Storybook
npm run loki:serve  # In one terminal
npm run visual-test  # In another terminal
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
- [ ] Loki visual regression tests passed (no unexpected changes)
- [ ] If visual changes are intentional, update baselines with `npm run loki:update`
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

