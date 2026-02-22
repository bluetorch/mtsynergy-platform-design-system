# PLAN: Full-Stack Infrastructure Setup

**Branch:** `infra/build`  
**Date:** 2026-02-21  
**Status:** PENDING APPROVAL

---

## Objective

Set up comprehensive build, test, lint, and publish infrastructure for `@mtsynergy/platform-design-system`. OneDev is the sole CI/CD platform; GitHub serves as a public mirror only.

---

## Quality Standards

**Enterprise-Grade Requirements:**
- **No partial implementations** — every feature is complete or not started
- **No stubs or TODOs** — all code is production-ready
- **Thorough testing** — cover edge cases, error states, and boundary conditions (not just happy path)
- **All tests must pass** — unrelated failures are fixed, not ignored
- **No test skipping** — `.skip()` is not an acceptable solution

---

## Implementation Steps

### Phase 1: Foundation Files

#### Step 1.0: Create Quality Standards document
**File:** `CONTRIBUTING.md`

```markdown
# Contributing to platform-design-system

## Quality Standards

This is an enterprise-grade project. All contributions must meet the following standards.

### Code Completeness

- **No partial implementations** — every feature is complete or not started
- **No stubs or TODOs** — all code is production-ready
- **No placeholder code** — if it's committed, it works

### Testing Requirements

- **Thorough testing** — cover edge cases, error states, and boundary conditions
- **Not just happy path** — tests should validate failure modes and unexpected inputs
- **All tests must pass** — unrelated failures are fixed, not ignored
- **No test skipping** — `.skip()` or `.only()` is not an acceptable solution
- **Tests are useful** — they catch real bugs, not just inflate coverage metrics

### Code Quality

- **Linting must pass** — ESLint errors are fixed, not disabled
- **Formatting is enforced** — Prettier runs on pre-commit
- **TypeScript strict mode** — no `any` types without explicit justification
- **Accessibility first** — all components meet WCAG 2.1 AA standards

### Pull Request Requirements

1. All CI checks must pass
2. Code review approval required
3. No merge commits in feature branches (rebase only)
4. Commit messages follow conventional commits format

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
- `feat(button): add loading state with spinner`
- `fix(modal): prevent body scroll when open`
- `test(input): add validation error state tests`

## Development Workflow

### Setup

```bash
nvm use              # Use project Node version
npm install          # Install dependencies
npm run storybook    # Start Storybook for development
```

### Before Committing

```bash
npm run lint         # Check for linting errors
npm run format:check # Check formatting
npm run test:run     # Run all tests
npm run build        # Verify build succeeds
```

Pre-commit hooks will automatically run lint-staged (ESLint + Prettier on staged files).

### Running Tests

```bash
npm run test         # Watch mode (development)
npm run test:run     # Single run (CI)
npm run test:coverage # With coverage report
```

## Architecture Decisions

### Tailwind Prefix

All Tailwind classes use the `mts-` prefix to avoid conflicts when consumed by other applications.

### Build Output

- CommonJS: `dist/index.js`
- ESM: `dist/index.mjs`  
- Types: `dist/index.d.ts`

### Publishing

Published to OneDev npm registry on version tags (`v*`). See `.onedev-buildspec.yml` for CI/CD configuration.
```

#### Step 1.1: Create `.gitignore`
**File:** `.gitignore`

```gitignore
# Dependencies
node_modules/

# Build output
dist/

# Storybook
storybook-static/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
.env.local
.env.*.local

# Testing
coverage/

# Cache
.cache/
.turbo/
*.tsbuildinfo
```

#### Step 1.2: Create `.nvmrc`
**File:** `.nvmrc`

```
22
```

*(Node.js 22 LTS — adjust if different version preferred)*

---

### Phase 2: ESLint Configuration

#### Step 2.1: Create ESLint config
**File:** `eslint.config.js` (flat config format for ESLint 9+)

```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'storybook-static/', '*.config.js'],
  }
);
```

#### Step 2.2: Add ESLint dependencies to `package.json`
**Dependencies to add:**
- `eslint` (^9.0.0)
- `@eslint/js`
- `typescript-eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

---

### Phase 3: Prettier Configuration

#### Step 3.1: Create Prettier config
**File:** `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "jsxSingleQuote": false
}
```

#### Step 3.2: Create Prettier ignore
**File:** `.prettierignore`

```
dist/
node_modules/
storybook-static/
coverage/
*.md
```

#### Step 3.3: Add Prettier dependencies and script
**Dependencies:** `prettier`
**Script:** `"format": "prettier --write src/"`
**Script:** `"format:check": "prettier --check src/"`

---

### Phase 4: Pre-commit Hooks (Husky + lint-staged)

#### Step 4.1: Add husky and lint-staged dependencies
**Dependencies:**
- `husky`
- `lint-staged`

#### Step 4.2: Create lint-staged config
**File:** `.lintstagedrc.json`

```json
{
  "src/**/*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "src/**/*.css": ["prettier --write"]
}
```

#### Step 4.3: Add prepare script for husky
**Script:** `"prepare": "husky"`

#### Step 4.4: Create husky pre-commit hook
**File:** `.husky/pre-commit`

```sh
npx lint-staged
```

---

### Phase 5: Vitest Configuration

#### Step 5.1: Create Vitest config
**File:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.tsx', 'src/test/**'],
    },
  },
});
```

#### Step 5.2: Create test setup file
**File:** `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom/vitest';
```

#### Step 5.3: Add Vitest dependencies
**Dependencies:**
- `vitest`
- `@vitejs/plugin-react`
- `jsdom`
- `@testing-library/react`
- `@testing-library/jest-dom`

#### Step 5.4: Add test scripts
**Scripts:**
- `"test": "vitest"`
- `"test:run": "vitest run"`
- `"test:coverage": "vitest run --coverage"`

---

### Phase 6: Storybook Configuration

#### Step 6.1: Create Storybook main config
**File:** `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

#### Step 6.2: Create Storybook preview config
**File:** `.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/react';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

#### Step 6.3: Create global CSS placeholder
**File:** `src/styles/global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Step 6.4: Add Storybook a11y addon
**Dependency:** `@storybook/addon-a11y`

---

### Phase 7: OneDev CI/CD Pipeline

#### Step 7.1: Create OneDev build spec
**File:** `.onedev-buildspec.yml`

```yaml
version: 38
jobs:
  - name: Build and Test
    steps:
      - !CheckoutStep
        name: Checkout
        cloneCredential: !DefaultCredential {}
        withLfs: false
        withSubmodules: false
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
      - !CommandStep
        name: Setup Node
        runInContainer: true
        image: node:22-alpine
        interpreter: !DefaultInterpreter
          commands: |
            node --version
            npm --version
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
      - !CommandStep
        name: Install Dependencies
        runInContainer: true
        image: node:22-alpine
        interpreter: !DefaultInterpreter
          commands: |
            npm ci
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
      - !CommandStep
        name: Lint
        runInContainer: true
        image: node:22-alpine
        interpreter: !DefaultInterpreter
          commands: |
            npm run lint
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
      - !CommandStep
        name: Format Check
        runInContainer: true
        image: node:22-alpine
        interpreter: !DefaultInterpreter
          commands: |
            npm run format:check
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
      - !CommandStep
        name: Test
        runInContainer: true
        image: node:22-alpine
        interpreter: !DefaultInterpreter
          commands: |
            npm run test:run
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
      - !CommandStep
        name: Build
        runInContainer: true
        image: node:22-alpine
        interpreter: !DefaultInterpreter
          commands: |
            npm run build
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
      - !CommandStep
        name: Build Storybook
        runInContainer: true
        image: node:22-alpine
        interpreter: !DefaultInterpreter
          commands: |
            npm run build-storybook
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
    triggers:
      - !BranchUpdateTrigger {}
    retryCondition: never
    maxRetries: 3
    retryDelay: 30
    timeout: 3600

  - name: Publish
    steps:
      - !CheckoutStep
        name: Checkout
        cloneCredential: !DefaultCredential {}
        withLfs: false
        withSubmodules: false
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
      - !CommandStep
        name: Install Dependencies
        runInContainer: true
        image: node:22-alpine
        interpreter: !DefaultInterpreter
          commands: |
            npm ci
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
      - !CommandStep
        name: Build
        runInContainer: true
        image: node:22-alpine
        interpreter: !DefaultInterpreter
          commands: |
            npm run build
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
      - !CommandStep
        name: Publish to Registry
        runInContainer: true
        image: node:22-alpine
        interpreter: !DefaultInterpreter
          commands: |
            npm publish --registry=http://onedev.mtsynergy.internal/lib/npm/
        condition: ALL_PREVIOUS_STEPS_WERE_SUCCESSFUL
    triggers:
      - !TagCreateTrigger
        tags: 'v*'
    retryCondition: never
    maxRetries: 3
    retryDelay: 30
    timeout: 3600
```

---

### Phase 8: Package.json Updates

#### Step 8.1: Update package.json with all new dependencies and scripts

**New devDependencies:**
```json
{
  "eslint": "^9.0.0",
  "@eslint/js": "^9.0.0",
  "typescript-eslint": "^8.0.0",
  "eslint-plugin-react-hooks": "^5.0.0",
  "eslint-plugin-react-refresh": "^0.4.0",
  "prettier": "^3.2.0",
  "husky": "^9.0.0",
  "lint-staged": "^15.0.0",
  "vitest": "^2.0.0",
  "@vitejs/plugin-react": "^4.2.0",
  "jsdom": "^24.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "@storybook/addon-a11y": "^7.6.10"
}
```

**New scripts:**
```json
{
  "format": "prettier --write src/",
  "format:check": "prettier --check src/",
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "prepare": "husky"
}
```

---

### Phase 9: Sample Test File

#### Step 9.1: Create comprehensive Button test
**File:** `src/components/Button.test.tsx`

```typescript
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
      render(<Button data-testid="custom-button" aria-label="Custom action">Test</Button>);
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
      expect(button.className).toContain('mts-bg-gray');
    });

    it('applies danger variant when specified', () => {
      render(<Button variant="danger">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('mts-bg-red');
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
      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies disabled attribute when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
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
  });
});
```

---

## File Checklist

| # | File | Action |
|---|------|--------|
| 1 | `CONTRIBUTING.md` | CREATE |
| 2 | `.gitignore` | CREATE |
| 3 | `.nvmrc` | CREATE |
| 4 | `eslint.config.js` | CREATE |
| 5 | `.prettierrc` | CREATE |
| 6 | `.prettierignore` | CREATE |
| 7 | `.lintstagedrc.json` | CREATE |
| 8 | `.husky/pre-commit` | CREATE |
| 9 | `vitest.config.ts` | CREATE |
| 10 | `src/test/setup.ts` | CREATE |
| 11 | `.storybook/main.ts` | CREATE |
| 12 | `.storybook/preview.ts` | CREATE |
| 13 | `src/styles/global.css` | CREATE |
| 14 | `.onedev-buildspec.yml` | CREATE |
| 15 | `package.json` | MODIFY (add deps + scripts) |
| 16 | `src/components/Button.test.tsx` | CREATE |

---

## Post-Implementation Steps

1. Run `npm install` to install all new dependencies
2. Run `npx husky init` then edit hook (or manually create `.husky/pre-commit`)
3. Run `npm run lint` to verify ESLint works — **fix any errors before proceeding**
4. Run `npm run test:run` to verify Vitest works — **all tests must pass**
5. Run `npm run build` to verify build works
6. Run `npm run storybook` to verify Storybook works
7. Commit all changes (pre-commit hooks will enforce lint + format)
8. Push to OneDev to trigger CI pipeline — **pipeline must pass before merge**

**Note:** If any existing code fails linting or tests, it will be fixed as part of this implementation. We do not skip or ignore failures.

---

## Approval Required

**Please review this plan and confirm to proceed to EXECUTE mode.**

Reply with:
- **"approved"** — to proceed with implementation
- **"modify [details]"** — to request changes to the plan
