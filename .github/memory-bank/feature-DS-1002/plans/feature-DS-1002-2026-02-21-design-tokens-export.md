# Plan: DS-1002 Design Tokens Export

**Date:** 2026-02-21  
**Branch:** feature/DS-1002  
**Ticket:** DS-1002-DS  
**Type:** Feature - Design Token Export System

---

## Problem Statement

The platform-design-system library currently exports only React components. Design tokens (colors, typography, spacing, shadows, etc.) are defined in `tailwind.config.js` but are not programmatically accessible to consumers. This prevents:

1. **React Native mobile app** from using consistent design tokens (RN doesn't use CSS/Tailwind)
2. **Web consumers** from accessing token values for dynamic/computed styles
3. **Cross-platform consistency** between web and mobile applications
4. **Design tool integrations** that could consume tokens for UI mockups

**Current State:**
- ✅ Colors, typography, shadows defined in `tailwind.config.js`
- ❌ Spacing, breakpoints, border radius, z-index use Tailwind defaults (not explicitly defined)
- ❌ No programmatic export of token values
- ❌ No TypeScript types for tokens
- ❌ No JSON export for tooling/documentation
- ❌ React Native cannot consume tokens

**Desired State:**
- ✅ All 7 token categories explicitly defined (colors, spacing, typography, shadows, breakpoints, border radius, z-index)
- ✅ Tokens exported as TypeScript objects with full type definitions
- ✅ Tokens work on both web (React) and mobile (React Native)
- ✅ Tailwind config generated from token source (single source of truth)
- ✅ JSON export for documentation and tooling
- ✅ Package subpath exports for clean imports

**User Requirements:**
- Flat export structure (small project size)
- Follow SPECIFICATION.md best practices (cross-platform support)
- Platform-agnostic token values (hex colors, pixel values)
- Support both npm and CDN/import map consumption

---

## Solution Approach

**Approach 4: Unified Raw Tokens + Generated Tailwind Config**

Define platform-agnostic token values in TypeScript as the canonical source of truth, then generate `tailwind.config.js` from these tokens. Export tokens via package subpath for consumption by both web and React Native consumers.

### Why This Approach:

1. **Cross-Platform by Design**: Raw values (hex colors, pixel values) work identically on web and React Native
2. **Single Source of Truth**: Tokens defined once, used everywhere (web Tailwind, web inline styles, React Native StyleSheet)
3. **Type Safety**: Full TypeScript definitions for autocomplete and error checking
4. **Future-Proof**: Can add CSS variables in DS-1005 without breaking token API
5. **Developer Experience**: Clean imports, tree-shakeable, works with import maps
6. **Aligns with README.md**: Already shows `import { COLORS } from '@mtsynergy/design-system/tokens'` pattern

### Key Design Decisions:

1. **Tokens as Canonical Source**: TypeScript token definitions are the source of truth; Tailwind config is generated
   - **Why**: Easier to parse TS → Tailwind than reverse; tokens are simpler data structures
   
2. **Platform-Agnostic Values**: All values in pixels/hex, not CSS-specific units
   - **Why**: React Native uses pixel values (dp), web can convert to rem; simpler mental model
   
3. **Explicit MTSynergy Tokens**: Define all 7 categories even if matching Tailwind defaults
   - **Why**: Establishes MTSynergy namespace; allows future customization without breaking changes
   
4. **Subpath Exports**: `@mtsynergy/design-system/tokens` separate from main export
   - **Why**: Tree-shaking, clear separation, allows multiple token formats in future
   
5. **Build-Time Generation**: Tailwind config generated during `npm run build`
   - **Why**: No runtime overhead, consumers get static config file

---

## Implementation Plan

### Task 1: Define Token Data Structures

**Objective:** Create TypeScript interfaces and token definitions for all 7 categories

**Files to Create:**
- `src/tokens/types.ts` – TypeScript interfaces for all token types
- `src/tokens/colors.ts` – Color palette definitions
- `src/tokens/spacing.ts` – Spacing scale definitions
- `src/tokens/typography.ts` – Font families, sizes, weights
- `src/tokens/shadows.ts` – Shadow definitions (web and RN compatible)
- `src/tokens/breakpoints.ts` – Responsive breakpoint values
- `src/tokens/borderRadius.ts` – Border radius scale
- `src/tokens/zIndex.ts` – Z-index layer definitions
- `src/tokens/index.ts` – Main barrel export

**Changes:**

1. **Create `src/tokens/types.ts`:**
   - Define `ColorScale` interface (50-900 shades)
   - Define `ColorPalette` interface (primary, secondary, success, warning, danger, info)
   - Define `SpacingScale` interface (1-96 Tailwind scale)
   - Define `Typography` interface (fontFamily, fontSize, fontWeight)
   - Define `ShadowDefinition` interface (compatible with web and RN)
   - Define `Breakpoints` interface (sm, md, lg, xl, 2xl)
   - Define `BorderRadius` interface (none, sm, md, lg, xl, full)
   - Define `ZIndex` interface (named layers)
   - Define `DesignTokens` interface (combines all categories)

2. **Create `src/tokens/colors.ts`:**
   - Export color palette matching current `tailwind.config.js`
   - Primary: #0066CC as 500 value with full 50-900 scale
   - Secondary, success, warning, danger, info with full scales
   - Type: `ColorPalette`

3. **Create `src/tokens/spacing.ts`:**
   - Define spacing scale: 0, 1(4px), 2(8px), 3(12px), 4(16px), ..., 96(384px)
   - Match Tailwind default scale exactly (establishes MTSynergy namespace)
   - Type: `SpacingScale`

4. **Create `src/tokens/typography.ts`:**
   - fontFamily: { sans: 'Inter, system-ui, -apple-system, ...' }
   - fontSize: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, 2xl: 24, 3xl: 30, 4xl: 36 } (pixels)
   - fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' }
   - Type: `Typography`

5. **Create `src/tokens/shadows.ts`:**
   - Define shadows for web (CSS string) AND React Native (object with shadowColor, shadowOffset, shadowOpacity, shadowRadius)
   - sm, md, lg, xl, 2xl variants
   - Type: `{ web: string; rn: ShadowRN }[]`

6. **Create `src/tokens/breakpoints.ts`:**
   - sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536 (pixels)
   - Match Tailwind defaults
   - Type: `Breakpoints`

7. **Create `src/tokens/borderRadius.ts`:**
   - none: 0, sm: 2, DEFAULT: 4, md: 6, lg: 8, xl: 12, 2xl: 16, 3xl: 24, full: 9999 (pixels)
   - Match Tailwind defaults
   - Type: `BorderRadius`

8. **Create `src/tokens/zIndex.ts`:**
   - base: 0, dropdown: 1000, sticky: 1100, fixed: 1200, modalBackdrop: 1300, modal: 1400, popover: 1500, tooltip: 1600
   - MTSynergy-specific values based on component needs
   - Type: `ZIndex`

9. **Create `src/tokens/index.ts`:**
   - Barrel export all token categories
   - Export combined `tokens` object of type `DesignTokens`
   - Named exports: `colors`, `spacing`, `typography`, `shadows`, `breakpoints`, `borderRadius`, `zIndex`

**Validation:**
- [ ] All TypeScript files compile without errors
- [ ] Token types match data structures
- [ ] Values match existing `tailwind.config.js` where applicable
- [ ] Import statements work: `import { tokens, colors } from '@mtsynergy/design-system/tokens'`

---

### Task 2: Generate Tailwind Config from Tokens

**Objective:** Create build script to generate `tailwind.config.js` from token source

**Files to Create:**
- `scripts/generate-tailwind-config.ts` – Token → Tailwind transformer
- `scripts/build-tokens.ts` – Main build orchestrator

**Files to Modify:**
- `tailwind.config.js` – Replace with generated version (keep as .js for compatibility)
- `package.json` – Add token build scripts

**Changes:**

1. **Create `scripts/generate-tailwind-config.ts`:**
   - Import tokens from `src/tokens`
   - Transform colors: Keep as-is (already correct format)
   - Transform spacing: Convert pixels to rem (divide by 16): `{ 4: '1rem', 8: '2rem', ... }`
   - Transform typography.fontSize: Convert pixels to rem with default lineHeight
   - Transform shadows: Use web format only (CSS strings)
   - Transform breakpoints: Convert to px strings: `{ sm: '640px', ... }`
   - Transform borderRadius: Convert to px strings: `{ sm: '2px', ... }`
   - Export Tailwind config object as string template
   - Write to `tailwind.config.js`

2. **Create `scripts/build-tokens.ts`:**
   - Run `generate-tailwind-config.ts`
   - Generate `dist/tokens.json` (flattened token export)
   - Copy TypeScript declarations to `dist/tokens/`
   - Log build summary

3. **Modify `tailwind.config.js`:**
   - Add header comment: `// AUTO-GENERATED from src/tokens - DO NOT EDIT MANUALLY`
   - Add instructions: `// To modify tokens, edit files in src/tokens/ and run: npm run build:tokens`
   - Keep existing structure (prefix: "mts-", plugins: [])

4. **Modify `package.json`:**
   - Add script: `"build:tokens": "tsx scripts/build-tokens.ts"`
   - Add script: `"prebuild": "npm run build:tokens"` (auto-generate before build)
   - Add dependency: `"tsx": "^4.7.0"` (TypeScript executor for scripts)

**Validation:**
- [ ] `npm run build:tokens` generates valid `tailwind.config.js`
- [ ] Generated config matches existing token values
- [ ] Spacing values correctly converted px → rem (4 → '1rem')
- [ ] Build script runs before main build automatically
- [ ] Git diff shows generated file changes

---

### Task 3: Configure Package Exports

**Objective:** Set up subpath exports for tokens in `package.json`

**Files to Modify:**
- `package.json` – Add exports field
- `tsconfig.json` – Configure for token paths
- `tsup.config.ts` – Create for multi-entry build

**Changes:**

1. **Modify `package.json`:**
   - Replace `"main"` and `"module"` with `"exports"` field:
   ```json
   "exports": {
     ".": {
       "types": "./dist/index.d.ts",
       "import": "./dist/index.mjs",
       "require": "./dist/index.js"
     },
     "./tokens": {
       "types": "./dist/tokens/index.d.ts",
       "import": "./dist/tokens/index.mjs",
       "require": "./dist/tokens/index.js"
     },
     "./tokens.json": "./dist/tokens.json"
   }
   ```
   - Keep `"main"` and `"module"` for backwards compatibility
   - Update `"files"` to include tokens: `["dist"]`

2. **Create `tsup.config.ts`:**
   - Configure multi-entry build: `entry: ['src/index.ts', 'src/tokens/index.ts']`
   - Output formats: `['cjs', 'esm']`
   - Generate declarations: `dts: true`
   - Output structure: `dist/index.*, dist/tokens/index.*`
   - Clean dist before build: `clean: true`

3. **Modify `package.json` build script:**
   - Update: `"build": "npm run build:tokens && tsup"`
   - Ensures tokens built before component build

**Validation:**
- [ ] `npm run build` produces `dist/tokens/index.js`, `dist/tokens/index.mjs`, `dist/tokens/index.d.ts`
- [ ] `dist/tokens.json` created with flattened token values
- [ ] Import works: `import { tokens } from '@mtsynergy/design-system/tokens'`
- [ ] JSON import works: `import json from '@mtsynergy/design-system/tokens.json'`
- [ ] TypeScript autocomplete works for token imports
- [ ] Component build still works (no regression)

---

### Task 4: Create Token Documentation

**Objective:** Document token usage for web and React Native consumers

**Files to Create:**
- `src/tokens/README.md` – Token usage guide

**Changes:**

1. **Create `src/tokens/README.md`:**
   - Overview: What tokens are and why they exist
   - Installation: How to import tokens
   - **Web Usage Examples:**
     - Inline styles: `style={{ color: tokens.colors.primary[500] }}`
     - Tailwind classes: `className="mts-bg-primary-500"` (config uses tokens)
     - Computed styles: `const bgColor = tokens.colors.primary[isDark ? 700 : 100]`
   - **React Native Usage Examples:**
     - StyleSheet: `backgroundColor: tokens.colors.primary[500]`
     - Spacing: `padding: tokens.spacing[4]` (16 pixels/dp)
     - Shadows: `...tokens.shadows.md.rn` (spread shadow properties)
   - **Token Categories Reference:**
     - Colors: palette structure, shade meanings (50=lightest, 900=darkest)
     - Spacing: scale explanation, common uses (4=base, 8=comfortable)
     - Typography: font stack reasoning, size scale
     - Shadows: web vs RN format differences
     - Breakpoints: responsive design guidance
     - Border radius: when to use each size
     - Z-index: layering system, component stacking order
   - **Platform Differences:**
     - Spacing: pixels work on both platforms (web converts to rem)
     - Shadows: use `.web` for CSS, `.rn` for React Native
     - Breakpoints: web uses media queries, RN uses `Dimensions.get('window').width`
   - **Extending Tailwind Config:**
     - How to import config in consumer projects
     - Extending tokens with custom values
   - **TypeScript Support:**
     - All tokens fully typed
     - Autocomplete examples
     - Type safety benefits

**Validation:**
- [ ] Documentation covers all 7 token categories
- [ ] Code examples work for both web and React Native
- [ ] Links to main README.md for context

---

### Task 5: Update Main Documentation

**Objective:** Update README.md and package documentation with token export info

**Files to Modify:**
- `README.md` – Add tokens section
- `src/index.ts` – Add comment about tokens

**Changes:**

1. **Modify `README.md`:**
   - Add "Design Tokens" section after "Components"
   - Document token categories with examples
   - Show web and React Native usage patterns
   - Link to `src/tokens/README.md` for detailed docs
   - Update installation section to mention tokens
   - Add import examples to "Usage" section
   - Update deployment section (tokens included in bundle)

2. **Modify `src/index.ts`:**
   - Add JSDoc comment at top:
   ```typescript
   /**
    * @mtsynergy/platform-design-system
    * 
    * React component library and design tokens for MTSynergy platform.
    * 
    * Components: import { Button, Input, ... } from '@mtsynergy/design-system';
    * Tokens: import { tokens, colors, ... } from '@mtsynergy/design-system/tokens';
    * 
    * @see {@link https://github.com/mtsynergy/platform-design-system}
    */
   ```

**Validation:**
- [ ] README.md sections flow logically
- [ ] Code examples are tested and accurate
- [ ] Links resolve correctly
- [ ] Documentation matches actual API

---

### Task 6: Write Token Tests

**Objective:** Ensure token integrity and cross-platform compatibility

**Files to Create:**
- `src/tokens/tokens.test.ts` – Token validation tests

**Changes:**

1. **Create `src/tokens/tokens.test.ts`:**
   - **Structure Tests:**
     - All token categories exist
     - Token types match interfaces
     - No undefined or null values
   - **Color Tests:**
     - All color scales have shades 50, 100, 200, 300, 500, 600, 700, 900
     - Primary[500] is #0066CC (spec requirement)
     - All colors are valid hex format (#RRGGBB)
   - **Spacing Tests:**
     - Spacing scale matches Tailwind (0, 1, 2, 3, 4, ..., 96)
     - Values are multiples of 4 (except 0)
     - All values are positive integers
   - **Typography Tests:**
     - Font family includes Inter and system fallbacks
     - Font sizes are in ascending order
     - Font weights are valid CSS values
   - **Shadow Tests:**
     - All shadows have both web and rn formats
     - Web format is CSS string
     - RN format has required properties (shadowColor, shadowOffset, shadowOpacity, shadowRadius)
   - **Breakpoint Tests:**
     - Breakpoints in ascending order (sm < md < lg < xl)
     - Match Tailwind defaults (640, 768, 1024, 1280)
   - **Border Radius Tests:**
     - Values in ascending order
     - 'full' is large value (9999)
   - **Z-Index Tests:**
     - Modal > modalBackdrop > dropdown
     - All values are integers
     - No conflicts in layering

**Validation:**
- [ ] All tests pass: `npm run test src/tokens/tokens.test.ts`
- [ ] 100% coverage of token exports
- [ ] Tests catch invalid values (add deliberate error test)

---

### Task 7: Integration Testing

**Objective:** Verify tokens work in real components and across platforms

**Files to Create:**
- `src/tokens/integration.test.tsx` – Component integration tests

**Changes:**

1. **Create `src/tokens/integration.test.tsx`:**
   - **Web Component Test:**
     - Render Button with inline style: `style={{ backgroundColor: tokens.colors.primary[500] }}`
     - Verify computed style matches token value
     - Test with Tailwind class: `className="mts-bg-primary-500"`
     - Verify Tailwind config uses token color
   - **Token Import Test:**
     - Import individual categories: `import { colors } from '@mtsynergy/design-system/tokens'`
     - Import all tokens: `import { tokens } from '@mtsynergy/design-system/tokens'`
     - Verify tree-shaking works (mock bundler)
   - **TypeScript Type Test:**
     - Assign token to typed variable
     - Verify autocomplete provides correct properties
     - Catch type errors on invalid access
   - **Cross-Platform Compatibility Test:**
     - Mock React Native StyleSheet
     - Create style object using tokens
     - Verify no CSS-specific values (rem, vh, etc.)
     - Test shadow.rn format

**Validation:**
- [ ] All integration tests pass
- [ ] Components render correctly with token values
- [ ] No runtime errors or warnings
- [ ] TypeScript compilation succeeds

---

### Task 8: Build Verification

**Objective:** Ensure build output is correct and package is ready for publishing

**Files to Verify:**
- `dist/` directory structure
- Generated files

**Changes:**

1. **Run full build:** `npm run build`
2. **Verify dist/ structure:**
   ```
   dist/
     index.js          (components CJS)
     index.mjs         (components ESM)
     index.d.ts        (components types)
     tokens/
       index.js        (tokens CJS)
       index.mjs       (tokens ESM)
       index.d.ts      (tokens types)
     tokens.json       (flattened tokens)
   ```
3. **Verify generated Tailwind config:**
   - `tailwind.config.js` has auto-generated header
   - Colors match token values
   - Spacing converted to rem
   - Prefix "mts-" preserved
4. **Test package locally:**
   - Run `npm pack`
   - Extract tarball
   - Verify `dist/` contents included
   - Verify `package.json` exports field
5. **Test imports:**
   - Create test Node script
   - Import components: `const { Button } = require('@mtsynergy/design-system')`
   - Import tokens: `const { tokens } = require('@mtsynergy/design-system/tokens')`
   - Verify no module resolution errors

**Validation:**
- [ ] Build completes without errors
- [ ] All expected files in dist/
- [ ] Package size reasonable (< 500KB)
- [ ] Imports work from packed tarball
- [ ] TypeScript declarations present and valid

---

## Technical Specifications

### Token Value Formats

**Colors:**
- Format: Hex string `#RRGGBB`
- Scale: 50, 100, 200, 300, 500, 600, 700, 900 (standard Tailwind scale, omit 400 intentionally)
- Example: `{ primary: { 50: '#e6f2ff', 500: '#0066CC', 900: '#001429' } }`

**Spacing:**
- Format: Pixels (unitless numbers)
- Scale: 0, 1(4px), 2(8px), 3(12px), 4(16px), 5(20px), 6(24px), 8(32px), 10(40px), 12(48px), 16(64px), 20(80px), 24(96px), 32(128px), 40(160px), 48(192px), 56(224px), 64(256px), 96(384px)
- Web conversion: Divide by 16 for rem (16px = 1rem)
- RN usage: Direct pixel values (16dp = 16)

**Typography:**
- fontFamily: String (comma-separated font stack)
- fontSize: Pixels (unitless numbers): xs(12), sm(14), base(16), lg(18), xl(20), 2xl(24), 3xl(30), 4xl(36)
- fontWeight: String (CSS weight values): '400', '500', '600', '700'

**Shadows:**
- Format: Object with `web` (CSS string) and `rn` (React Native shadow object)
- Web: `"0 1px 3px 0 rgba(0, 0, 0, 0.1)"`
- RN: `{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 }`
- Note: `elevation` for Android compatibility

**Breakpoints:**
- Format: Pixels (unitless numbers)
- Values: sm(640), md(768), lg(1024), xl(1280), 2xl(1536)
- Web usage: Convert to px strings in media queries
- RN usage: Compare against `Dimensions.get('window').width`

**Border Radius:**
- Format: Pixels (unitless numbers)
- Values: none(0), sm(2), DEFAULT(4), md(6), lg(8), xl(12), 2xl(16), 3xl(24), full(9999)

**Z-Index:**
- Format: Integer
- Values: base(0), dropdown(1000), sticky(1100), fixed(1200), modalBackdrop(1300), modal(1400), popover(1500), tooltip(1600)

### Directory Structure

```
src/
  tokens/
    types.ts          # TypeScript interfaces
    colors.ts         # Color palette
    spacing.ts        # Spacing scale
    typography.ts     # Font definitions
    shadows.ts        # Shadow definitions
    breakpoints.ts    # Responsive breakpoints
    borderRadius.ts   # Border radius scale
    zIndex.ts         # Z-index layers
    index.ts          # Barrel export
    README.md         # Token documentation
    tokens.test.ts    # Token validation tests
    integration.test.tsx  # Integration tests
  components/         # Existing components
  styles/             # Existing styles
  index.ts            # Main export (components)

scripts/
  generate-tailwind-config.ts  # Tailwind generator
  build-tokens.ts              # Build orchestrator

dist/                 # Build output (generated)
  index.js
  index.mjs
  index.d.ts
  tokens/
    index.js
    index.mjs
    index.d.ts
  tokens.json

tailwind.config.js    # Generated from tokens
```

### TypeScript Interfaces

```typescript
// src/tokens/types.ts

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  500: string;
  600: string;
  700: string;
  900: string;
}

export interface ColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  danger: ColorScale;
  info: ColorScale;
}

export interface SpacingScale {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  // ... up to 96
}

export interface Typography {
  fontFamily: {
    sans: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface ShadowRN {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}

export interface ShadowDefinition {
  web: string;
  rn: ShadowRN;
}

export interface Shadows {
  sm: ShadowDefinition;
  md: ShadowDefinition;
  lg: ShadowDefinition;
  xl: ShadowDefinition;
  '2xl': ShadowDefinition;
}

export interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

export interface BorderRadius {
  none: number;
  sm: number;
  DEFAULT: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  full: number;
}

export interface ZIndex {
  base: number;
  dropdown: number;
  sticky: number;
  fixed: number;
  modalBackdrop: number;
  modal: number;
  popover: number;
  tooltip: number;
}

export interface DesignTokens {
  colors: ColorPalette;
  spacing: SpacingScale;
  typography: Typography;
  shadows: Shadows;
  breakpoints: Breakpoints;
  borderRadius: BorderRadius;
  zIndex: ZIndex;
}
```

### Package.json Exports

```json
{
  "name": "@mtsynergy/platform-design-system",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./tokens": {
      "types": "./dist/tokens/index.d.ts",
      "import": "./dist/tokens/index.mjs",
      "require": "./dist/tokens/index.js"
    },
    "./tokens.json": "./dist/tokens.json"
  },
  "files": ["dist"]
}
```

---

## Testing Strategy

### Unit Tests

**Token Validation Tests** (`src/tokens/tokens.test.ts`):
- [ ] All token categories exist and are exported
- [ ] Color scales have required shades (50, 100, 200, 300, 500, 600, 700, 900)
- [ ] Primary color 500 shade is #0066CC
- [ ] All colors are valid hex format
- [ ] Spacing values are multiples of 4 (except 0)
- [ ] Font sizes are in ascending order
- [ ] Shadow definitions have both web and rn formats
- [ ] RN shadows have all required properties
- [ ] Breakpoints are in ascending order
- [ ] Z-index values follow logical stacking order (modal > backdrop > dropdown)
- [ ] TypeScript types match runtime values

**Integration Tests** (`src/tokens/integration.test.tsx`):
- [ ] Tokens work with component inline styles
- [ ] Tailwind config references token values
- [ ] Individual category imports work (tree-shaking)
- [ ] Combined tokens object works
- [ ] TypeScript autocomplete provides token properties
- [ ] React Native StyleSheet compatibility (no CSS units)

### Build Tests

- [ ] `npm run build:tokens` generates valid `tailwind.config.js`
- [ ] Generated config matches token values
- [ ] Spacing converted correctly (pixels → rem for web)
- [ ] Build produces all expected output files
- [ ] Package exports resolve correctly
- [ ] TypeScript declarations compile without errors

### Manual Testing

- [ ] Import tokens in web project: `import { tokens } from '@mtsynergy/design-system/tokens'`
- [ ] Use token in inline style: `<div style={{ color: tokens.colors.primary[500] }}>`
- [ ] Use Tailwind class: `<div className="mts-bg-primary-500">`
- [ ] Import tokens in React Native project (mock with test)
- [ ] Create StyleSheet with token values
- [ ] Verify no CSS-specific units in RN context
- [ ] JSON import works: `import json from '@mtsynergy/design-system/tokens.json'`

### Regression Testing

- [ ] All existing component tests still pass
- [ ] Components render without errors
- [ ] Storybook builds successfully
- [ ] Build output size reasonable (< 500KB total)
- [ ] No breaking changes to component API

---

## Success Criteria

**Functional Requirements:**
- [x] All 7 token categories defined (colors, spacing, typography, shadows, breakpoints, borderRadius, zIndex)
- [x] Tokens exported via `@mtsynergy/design-system/tokens` subpath
- [x] TypeScript types provided for all tokens
- [x] JSON export available at `@mtsynergy/design-system/tokens.json`
- [x] Tailwind config generated from token source
- [x] Platform-agnostic values (pixels, hex) work on web and React Native
- [x] Existing tailwind.config.js values preserved (colors, typography, shadows)

**Quality Requirements:**
- [x] All tests passing (unit + integration)
- [x] No ESLint violations
- [x] TypeScript strict mode compliance
- [x] Build completes without errors
- [x] Documentation complete (README + inline docs)

**Integration Requirements:**
- [x] Tokens work with existing components
- [x] No breaking changes to component API
- [x] Storybook builds and displays correctly
- [x] Package exports resolve in Node.js and bundlers
- [x] Import maps compatible (CDN deployment)

**Performance Requirements:**
- [x] Build time < 30 seconds
- [x] Token bundle size < 50KB
- [x] Tree-shaking works (unused tokens eliminated)

---

## Risk Assessment

### Risk 1: Tailwind Config Generation Complexity
- **Probability:** Medium
- **Impact:** High
- **Description:** Converting tokens to Tailwind config format may have edge cases (nested objects, function values, plugins)
- **Mitigation:** 
  - Start with simple token categories (colors, spacing)
  - Test generated config against existing config (diff comparison)
  - Manual review of generated output before committing
  - Fallback: Keep manual Tailwind config if generation fails

### Risk 2: React Native Shadow Format Incompatibility
- **Probability:** Low
- **Impact:** Medium
- **Description:** RN shadow API differs between iOS/Android; may not perfectly replicate web shadows
- **Mitigation:**
  - Document limitations in token README
  - Provide `elevation` property for Android
  - Test on both platforms (or document as limitation)
  - Users can customize shadow values if needed

### Risk 3: Package Export Resolution Issues
- **Probability:** Low
- **Impact:** High
- **Description:** Subpath exports (`/tokens`) may not work in older bundlers or Node.js versions
- **Mitigation:**
  - Test with common bundlers (Webpack, Vite, esbuild)
  - Document minimum Node.js version (16+)
  - Provide fallback imports in documentation
  - Keep backward-compatible main/module fields

### Risk 4: Breaking Changes for Consumers
- **Probability:** Low
- **Impact:** Medium
- **Description:** Adding token exports shouldn't break existing consumers, but Tailwind config regeneration might
- **Mitigation:**
  - Preserve all existing Tailwind config values
  - Add generated comment to warn manual edits
  - Document migration path if values change
  - Version as minor (0.0.1 → 0.1.0) not patch

### Risk 5: Token Duplication Maintenance Burden
- **Probability:** Medium
- **Impact:** Low
- **Description:** Maintaining tokens separately from Tailwind config adds maintenance overhead
- **Mitigation:**
  - Automated generation reduces manual sync
  - Tests catch mismatches
  - Build fails if tokens → Tailwind conversion fails
  - Document process clearly for contributors

### Risk 6: Import Map CDN Caching
- **Probability:** Low
- **Impact:** Medium
- **Description:** CDN caching may serve stale token values if not properly versioned
- **Mitigation:**
  - Use versioned URLs in import maps (`@1.0.0`)
  - Document cache invalidation strategy
  - Test CDN deployment before production
  - This is existing risk, not introduced by tokens

---

## Rollback Plan

If implementation fails or causes issues:

1. **Revert Git Branch:**
   ```bash
   git checkout main
   git branch -D feature/DS-1002
   ```

2. **Restore Tailwind Config:**
   - Original `tailwind.config.js` preserved on main branch
   - No manual edits lost (config is generated)

3. **Remove Token Exports:**
   - Delete `src/tokens/` directory
   - Remove exports from `package.json`
   - Remove build scripts
   - Rebuild package: `npm run build`

4. **Rollback Package Version:**
   - If published to npm, deprecated version: `npm deprecate @mtsynergy/design-system@0.1.0 "Use 0.0.1 instead"`
   - Consumers pin to previous version in import maps

5. **No Breaking Changes:**
   - Component API unchanged (no rollback needed for consumers)
   - Existing imports continue working

**Rollback Triggers:**
- Build fails in CI/CD
- Tests fail after implementation
- Package size exceeds 1MB
- Import map resolution fails on CDN
- Critical bug discovered in production

---

## Assumptions and Constraints

### Assumptions:

1. **React Native Usage:** Mobile app will consume tokens for consistent styling
   - If false: Can simplify to web-only formats (CSS variables)

2. **Tailwind as Web Tool:** Web consumers primarily use Tailwind classes, not inline styles
   - If false: May prioritize CSS variable export over Tailwind config

3. **Import Map Support:** Consuming projects use modern bundlers/import maps
   - If false: May need CommonJS-only export

4. **Small Project Scale:** ~10 components, token changes infrequent
   - If false: More automation needed for token updates

5. **Node.js 16+:** Build environment supports modern Node.js features
   - If false: May need to transpile build scripts

### Constraints:

1. **No Breaking Changes:** Cannot change component API (out of scope)
   
2. **Backward Compatibility:** Must preserve existing Tailwind config values exactly

3. **Existing Dependencies:** Cannot add major new dependencies (keep bundle lean)
   - Allowed: Build-time dependencies (tsx, type utilities)
   - Forbidden: Runtime dependencies for tokens

4. **Build Time:** Token generation must add < 10 seconds to build time

5. **Package Size:** Tokens should add < 50KB to package (uncompressed)

6. **Platform Support:** Must work on Node.js, browsers (import maps), and React Native

7. **TypeScript Strict Mode:** All token code must pass strict type checking

---

## Dependencies

### External Dependencies:

- **tsx** (^4.7.0) – TypeScript executor for build scripts (devDependency)
  - Used to run `build-tokens.ts` and `generate-tailwind-config.ts`
  - Already in ecosystem (widely used)

### Internal Dependencies:

- **tailwindcss** (^3.4.1) – Already installed, used for config generation
- **typescript** (^5.3.3) – Already installed, used for type checking
- **tsup** (^8.0.1) – Already installed, used for building tokens

### No New Runtime Dependencies:

Tokens are pure data exports; no runtime dependencies needed.

---

## Estimated Effort

**Total Time:** 6-8 hours

**Breakdown:**
- Task 1 (Token Definitions): 2 hours
- Task 2 (Tailwind Generation): 2 hours
- Task 3 (Package Exports): 1 hour
- Task 4 (Documentation): 1.5 hours
- Task 5 (README Updates): 0.5 hours
- Task 6 (Token Tests): 1.5 hours
- Task 7 (Integration Tests): 1 hour
- Task 8 (Build Verification): 0.5 hours

**Complexity Factors:**
- High: Tailwind config generation (parsing, transforming, testing)
- Medium: React Native shadow format compatibility
- Low: Token data definitions (mostly data entry)

---

## Awaiting Approval

**Plan Summary:**
- Create unified platform-agnostic token definitions in TypeScript
- Generate Tailwind config from tokens (single source of truth)
- Export tokens via package subpath (`/tokens`)
- Support both web and React Native consumption
- Maintain backward compatibility with existing components

**Changes:**
- Add `src/tokens/` directory (9 new files)
- Add `scripts/` directory (2 new files)
- Modify `package.json` (exports, scripts, dependencies)
- Create `tsup.config.ts` for multi-entry build
- Generate `tailwind.config.js` from tokens
- Add token tests and documentation

**Non-Breaking:**
- Component API unchanged
- Existing imports continue working
- Tailwind values preserved

**Ready for Review:** This plan must be reviewed and approved before proceeding to EXECUTE mode.

---

**Plan File Location:**  
`.github/memory-bank/feature-DS-1002/plans/feature-DS-1002-2026-02-21-design-tokens-export.md`
