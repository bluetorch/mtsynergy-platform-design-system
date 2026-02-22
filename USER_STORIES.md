# platform-design-system - React Component Library User Stories

## Overview

This document lists user stories owned by **platform-design-system** (React component library). This library provides reusable UI components and Tailwind design tokens for all frontend projects.

**Full story definitions:** See [../USER_STORIES.md](../USER_STORIES.md)

## Design System Stories

### Component Library (DS-1001)

- **DS-1001-DS:** Implement core UI components
  - **Button:** primary, secondary, danger variants; sm/md/lg sizes; loading state
  - **Input:** text input, textarea, select dropdown; error states; help text
  - **Card:** content container with padding, shadow, border
  - **Modal:** dialog box with header, body, footer; close button; backdrop
  - **Badge:** status badge (NEW, ASSIGNED, RESOLVED, SPAM); small/medium sizes
  - **Tabs:** tab navigation with active indicator; keyboard navigation
  - **Dropdown:** dropdown menu with items; keyboard accessible
  - **Spinner:** loading indicator (animated); sm/md/lg
  - **Alert:** success/warning/error/info alert messages
  - **DatePicker:** calendar widget with date selection; timezone support
  - All components accessible (ARIA, keyboard nav, focus management)

### Design Tokens (DS-1002)

- **DS-1002-DS:** Export Tailwind configuration & design tokens
  - **Colors:** Primary (#0066CC), secondary, success, warning, danger, info
  - **Spacing:** 0.5rem, 1rem, 1.5rem, 2rem, ... (Tailwind scale)
  - **Typography:** Font family (Inter, system), sizes (12px–48px), weights (400, 500, 600, 700)
  - **Shadows:** box-shadow definitions (sm, md, lg)
  - **Breakpoints:** Responsive: sm (640px), md (768px), lg (1024px), xl (1280px)
  - **Border radius:** Rounded corners (small, medium, large)
  - **Z-index:** Layer ordering (buttons, modals, tooltips)

### Storybook Documentation (DS-1003)

- **DS-1003-DS:** Create Storybook stories for all components
  - Story file per component (Button.stories.tsx, Input.stories.tsx, etc.)
  - Document component props, variants, states (default, loading, error, disabled)
  - Live examples with interactive controls (Storybook argTypes)
  - Accessibility tests (a11y addon)
  - Visual regression testing via Chromatic

### Tailwind Integration (DS-1004)

- **DS-1004-DS:** Provide tailwind.config.ts with custom tokens
  - Extend default Tailwind theme with design tokens
  - CSS variables for runtime theme switching (light/dark mode)
  - Global styles (resets, typography, spacing)
  - Component classes (btn, btn-primary, input, card, etc.)
  - Plugin support (daisyUI, headlessui)

### Theming Support (DS-1005)

- **DS-1005-DS:** Implement light/dark mode theming
  - `useTheme()` hook: `{ theme, toggleTheme }`
  - CSS variables: `--color-primary`, `--color-surface`, etc.
  - Persist theme preference to localStorage
  - Respect system preference (prefers-color-scheme) by default
  - All components support both themes

## Component API Examples

```typescript
// Button
<Button 
  variant="primary"    // 'primary' | 'secondary' | 'danger'
  size="md"            // 'sm' | 'md' | 'lg'
  isLoading={false}
  disabled={false}
  onClick={handleClick}
>
  Click me
</Button>

// Input
<Input
  type="email"
  label="Email"
  placeholder="you@example.com"
  error="Invalid email format"
  helpText="We'll never share your email"
  onChange={(e) => setValue(e.target.value)}
/>

// Modal
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  footer={
    <>
      <Button onClick={handleClose}>Cancel</Button>
      <Button variant="danger" onClick={handleConfirm}>Delete</Button>
    </>
  }
>
  Are you sure?
</Modal>

// Badge
<Badge status="RESOLVED">Resolved</Badge>
<Badge status="NEW">New</Badge>
```

## Build & Publishing

```bash
# Install dependencies
npm install

# Develop locally (Storybook)
npm run storybook     # http://localhost:6006

# Build Storybook static site
npm run build-storybook

# Build library
npm run build

# Run tests
npm run test

# Visual regression testing
npm run chromatic

# Publish to npm registry
npm publish --registry https://git.example.com/api/npm/registry/

# Deploy to R2 CDN
wrangler r2 cp ./dist/* r2://mtsynergy-cdn/@mtsynergy/design-system@1.0.0/ --recursive
```

## Versioning & Compatibility

- **Major:** Component API changes, prop removal, re-design
- **Minor:** New components, new variants, backwards-compatible features
- **Patch:** Bug fixes, style tweaks, performance improvements

**Semantic Versioning Examples:**
- v1.0.0 → v1.1.0: Added DatePicker component (backwards-compatible)
- v1.1.0 → v1.2.0: Added `variant="outline"` to Button (backwards-compatible)
- v1.2.0 → v2.0.0: Removed `icon` prop from Button (breaking change)

## Testing Strategy

- **Unit Tests:** Component rendering, prop validation
- **Visual Regression:** Chromatic (screenshot tests per variant)
- **Accessibility:** a11y addon (WCAG compliance checks)
- **Storybook:** Interactive docs + manual testing

## Related Projects

**Consumers of platform-design-system:**
- **platform-shell** — Imports Button, Input, Card, Modal, Badge (via import map)
- **platform-mfe-publishing** — Imports all components
- **platform-mfe-inbox** — Imports Button, Input, Badge, Card
- **platform-mfe-reporting** — Imports Card, Button, Select
- **platform-core** — (Does not consume; independently published)

**Deployment:**
- npm registry: `@mtsynergy/design-system`
- CDN: `https://r2.cdn.com/@mtsynergy/design-system@{VERSION}/dist/index.esm.js`

---

**For full story details:** See [../USER_STORIES.md](../USER_STORIES.md) Section 9 (Design System & Component Library)

