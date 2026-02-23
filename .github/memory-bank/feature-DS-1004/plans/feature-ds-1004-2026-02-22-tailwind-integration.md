# Plan: DS-1004 Tailwind Integration & CSS Variables

**Date:** 2026-02-22
**Branch:** feature/DS-1004
**Ticket:** DS-1004
**Type:** Feature

---

## Problem Statement

Consumers of the `@mtsynergy/platform-design-system` library need to:
1.  Customize the theme at runtime (e.g., light/dark mode toggling).
2.  Use standard Tailwind utility classes with opacity modifiers (e.g., `bg-primary-500/50`).
3.  Easily integrate the design system configuration into their own projects.

**Current State:**
- The library generates a static `tailwind.config.js` with hardcoded hex values (e.g., `#0066CC`).
- No CSS variables are exposed.
- Runtime theming is impossible without replacing the entire utility class set.
- A partially implemented `src/tailwind.preset.ts` exists but uses static hex values, preventing runtime theme updates.

**Desired State:**
- **CSS Variables**: A generated `src/styles/variables.css` file defines all color tokens as RGB channels (e.g., `--color-primary-500: 0 102 204`).
- **Tailwind Preset**: A generated `src/tailwind.preset.ts` maps Tailwind colors to these variables using the `rgb(var(...) / <alpha-value>)` syntax.
- **Exports**: The package exports both the preset and the stylesheet for easy consumption.
- **Dark Mode**: The CSS variables structure supports future dark mode implementation by simply overriding variables in a `.dark` scope.

**User Requirements:**
- "Provide tailwind.config.ts with custom tokens" (fulfilled via Preset).
- "CSS variables for runtime theme switching".
- "Extend default Tailwind theme with design tokens".

---

## Solution Approach

**Approach 1: The Preset + CSS Variables**

We will automate the generation of two key files from our TypeScript token source of truth (`src/tokens/*`):
1.  **CSS Variables File**: Definitions of raw color channels.
2.  **Tailwind Preset**: Configuration using those variables.

**Why This Approach:**
- **Runtime Theming**: CSS variables allow instant theme switching in the browser.
- **Opacity Support**: Storing colors as RGB channels (e.g., `0 102 204`) and using `rgb(var(...) / <alpha-value>)` is the standard Tailwind best practice for supporting opacity utilities like `bg-primary-500/50`.
- **Separation of Concerns**: The preset handles configuration; the CSS handles values. Consumers can override values in CSS without touching the config.

**Key Design Decisions:**
1.  **RGB Channels**: We will convert Hex tokens to RGB channels (`R G B`) instead of full `rgb()` strings to enable Tailwind's `opacity` variable injection.
2.  **Generated Source**: `src/styles/variables.css` and `src/tailwind.preset.ts` will be treated as build artifacts (auto-generated), not source files manually edited.
3.  **Standalone CSS**: We will export `dist/styles.css` (or similar) so consumers can import it directly: `import '@mtsynergy/platform-design-system/styles.css'`.

---

## Implementation Plan

### Task 1: Update Generation Script Logic

**Objective:** Refactor `scripts/generate-tailwind-config.ts` to support the new "RGB Channels" transformation logic.

**Files to Modify:**
- `scripts/generate-tailwind-config.ts`

**Changes:**
1.  Implement `hexToRgbChannels(hex)` helper: Converts `#0066CC` -> `0 102 204`.
2.  Create `generateCssVariables()` function:
    - Iterates over `tokens.colors`.
    - Generates CSS content: `:root { --color-primary-500: 0 102 204; ... }`.
    - Writes to `src/styles/variables.css`.
3.  Update `generateTailwindConfig()` (or create `generatePreset()`):
    - Instead of writing hex values to the config object, write `rgb(var(--color-primary-500) / <alpha-value>)`.
    - Ensure other tokens (spacing, typography) are still generated correctly.
    - Write the output to `src/tailwind.preset.ts`.

**Validation:**
- Run `npm run build:tokens`.
- Check `src/styles/variables.css` for valid CSS.
- Check `src/tailwind.preset.ts` for valid JS/TS syntax and correct color mapping.

---

### Task 2: Configure Global Styles

**Objective:** Ensure the generated variables are included in the library's global styles.

**Files to Modify:**
- `src/styles/global.css`

**Changes:**
1.  Import the generated variables file: `@import './variables.css';`.
2.  Ensure standard Tailwind directives (`@tailwind base`, etc.) are present.

**Validation:**
- Inspect `src/styles/global.css` to confirm the import is correct.

---

### Task 3: Update Package Exports

**Objective:** Expose the preset and styles to consumers.

**Files to Modify:**
- `package.json`
- `tsup.config.ts`

**Changes:**
1.  **Update `package.json`**:
    - Add/Update export for `"./styles.css"` pointing to `dist/styles.css` (or wherever `tsup` outputs it).
    - Ensure `./tailwind-preset` points to `dist/tailwind.preset.js`.
2.  **Update `tsup.config.ts`**:
    - Ensure `src/tailwind.preset.ts` is an entry point.
    - Verify CSS handling (tsup might bundle CSS; we want to ensure a usable CSS file is generated).

**Validation:**
- Run `npm run build`.
- Check `dist/` folder for `styles.css`, `tailwind.preset.js`, `tailwind.preset.mjs`.

---

## Technical Specifications

### Hex to RGB Channel Conversion
```typescript
function hexToRgbChannels(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}
```

### Tailwind Color Definition
```javascript
// Resulting structure in preset
colors: {
  primary: {
    500: 'rgb(var(--color-primary-500) / <alpha-value>)',
    // ...
  }
}
```

---

## Testing Strategy

**Manual Verification:**
- [ ] Run `npm run build:tokens` and inspect generated files.
- [ ] Run `npm run build` and inspect `dist/` artifacts.
- [ ] **Consumer Simulation**: Create a temporary test file (or use `integration.test.ts`) to import the preset and verify `theme.colors` structure.

**Integration Tests:**
- [ ] Verify `src/styles/variables.css` contains expected `--color-primary-500` variable.
- [ ] Verify `src/tailwind.preset.ts` contains the generated configuration.

---

## Success Criteria

- [ ] `src/styles/variables.css` is automatically generated with correct RGB channel values.
- [ ] `src/tailwind.preset.ts` uses `rgb(var(...) / <alpha-value>)` syntax.
- [ ] `npm run build` completes successfully.
- [ ] `dist/` contains usable `styles.css` and `tailwind.preset.js`.

---

## Risk Assessment

**Potential Risks:**
1.  **Breaking Change**: Changing static hex to mapped variables might break existing internal usage if not careful (though current usage is minimal).
    - *Mitigation*: Verify Storybook still renders correctly after changes.
2.  **CSS Specificity**: Global variables might conflict if not scoped or prefixed properly.
    - *Mitigation*: We are using explicit keys matching our tokens. We could consider a prefix like `--mts-` for variables if collisions are a concern (Plan assumes matching token names for simplicity first, but using specific token paths `color-primary-500` is fairly safe).

---

## Estimated Effort
- **Script Refactoring**: 30 mins
- **Configuration Updates**: 15 mins
- **Verification**: 15 mins

---

**Awaiting Approval**
This plan must be reviewed and approved before proceeding to EXECUTE mode.
