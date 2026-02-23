# Plan: DS-1005 — Web Theming + Compiled Prefixed CSS (Approach 2)

**Date:** 2026-02-23
**Branch:** feature/DS-1005
**Ticket:** DS-1005
**Type:** Feature

---

## Problem Statement

DS components emit `mts-`-prefixed Tailwind utility class names, but current web build outputs are not reliably producing matching `.mts-*` CSS utilities. Separately, DS-1005 requires a web-only theming API (`useTheme()`), persistence, and respecting system preference, with theme definitions that can be reused by the React Native app.

**Current State:**
- Components in `src/components/*` hardcode `mts-` prefixed Tailwind utilities.
- Token pipeline exists:
  - `src/styles/variables.css` contains RGB-channel CSS custom properties (e.g. `--color-primary-500: 0 102 204`).
  - `src/tailwind.preset.ts` maps Tailwind colors to `rgb(var(--color-...)/<alpha-value>)`.
- Storybook imports `src/styles/global.css`.
- Fresh Storybook builds can include variables but omit `.mts-*` utility output (prefix/config drift).
- No `useTheme()` / theme persistence / system preference logic exists in `src/`.

**Desired State:**
- The design system ships a compiled CSS artifact that includes all required `.mts-*` utilities so consumers (and Storybook) do not need to run Tailwind to style DS components.
- Web theming API exists (`ThemeProvider` + `useTheme`) that:
  - Persists user choice in `localStorage`.
  - Defaults to system preference when no user preference is saved.
  - Updates the DOM so CSS variables resolve correctly for light/dark.
- Theme definitions are authored in TypeScript and reusable by React Native; dark theme is defined as “light base + dark overrides”.

**User Requirements:**
- `mts-` prefix is stable and must remain.
- DS-1005 theming API is web-only; theme definitions should be reusable by RN.
- Theme definitions should be more complete than “just colors”.
- Dark mode should be “light base + dark override”.
- Only DS components author `mts-` utilities; consumers should not need to.

---

## Solution Approach

Ship compiled, prefixed Tailwind CSS from the design system package (Approach 2) and implement a small web-only theming runtime that toggles a DOM attribute/class to activate dark overrides of CSS variables.

- **Compiled CSS** eliminates reliance on consumer Tailwind compilation (critical for MFEs) and fixes the observed “no `.mts-*` utilities” output.
- **Theme definitions in TypeScript** become the canonical cross-platform theme source.
- **CSS variables** are generated from the theme definitions for web runtime theming.

**Why This Approach:**
- Aligns with the constraint that only the DS should author `mts-` utilities.
- Works in micro-frontend environments where each app may have different Tailwind setups (or none).
- Keeps RN reuse realistic: RN consumes TS theme objects directly; web consumes TS theme objects via generated CSS variables.

**Key Design Decisions:**
1. **Ship compiled `.mts-*` CSS from the library** rather than requiring consumer Tailwind.
   - Reason: reduces integration surface area and prevents prefix/content drift.
2. **Use CSS variable overrides for dark mode** (light base in `:root`, dark overrides under a DOM selector).
   - Reason: matches “light base + dark override”; minimal runtime changes; works with existing Tailwind preset mapping.
3. **Theme choice is represented as `system | light | dark`**.
   - Reason: covers DS-1005 requirements (system default + user persistence) without expanding scope.

---

## Implementation Plan

### Task 1: Define canonical theme model (cross-platform)

**Objective:** Establish TypeScript theme structures that are reusable by RN and are the source-of-truth for web variable generation.

**Files to Modify:**
- `src/tokens/types.ts` (only if necessary for typing reuse)
- `src/tokens/index.ts` (only if necessary for exports)

**Files to Add:**
- `src/theme/types.ts`
- `src/theme/light.ts`
- `src/theme/darkOverrides.ts`
- `src/theme/mergeTheme.ts`
- `src/theme/index.ts`

**Changes:**
1. Define `Theme` type with at least:
   - `colors` (token scales + semantic aliases if present)
   - `typography`
   - `spacing`
   - `shadows` (include existing `web`/`rn` shape)
   - `borderRadius`, `zIndex`, `breakpoints`
2. Define `lightTheme: Theme` using current tokens as baseline.
3. Define `darkThemeOverrides: DeepPartial<Theme>` (only overrides; do not duplicate full theme).
4. Implement `mergeTheme(lightTheme, darkOverrides)` for RN and internal generation.

**Validation:**
- [ ] Type-check passes for new theme exports.
- [ ] `darkThemeOverrides` contains only a subset of keys.

---

### Task 2: Generate CSS variables for light + dark overrides

**Objective:** Generate web CSS variables from TS theme definitions, with light variables in `:root` and dark overrides under a single selector.

**Files to Modify:**
- `scripts/generate-tailwind-config.ts`
- `src/styles/variables.css` (generated output)

**Selector / Contract:**
- Use `html[data-mts-theme="dark"]` as the dark override selector.
  - Rationale: explicit and avoids global `.dark` collisions.

**Changes:**
1. Update the generator so it can output two variable blocks:
   - `:root { ...light variables... }`
   - `html[data-mts-theme="dark"] { ...dark overrides only... }`
2. Keep existing variable naming for compatibility with current Tailwind preset:
   - Continue producing `--color-<scale>-<shade>: R G B`.
3. Extend variable generation beyond colors only if required by DS-1005 web styling.
   - Default: generate colors as CSS vars (required), keep other tokens in TS theme for RN reuse.
4. (Optional, if desired for “system” fallback without JS) Add:
   - `@media (prefers-color-scheme: dark) { html:not([data-mts-theme]) { ...dark overrides... } }`
   - This should only apply when no explicit theme is set.

**Validation:**
- [ ] `src/styles/variables.css` includes both `:root` and the dark selector block.
- [ ] Existing tests for token generation still pass (add/adjust tests as needed).

---

### Task 3: Produce compiled prefixed CSS artifact (`.mts-*` utilities)

**Objective:** Ensure the package builds a distributable CSS file that contains `.mts-*` utilities required by DS components.

**Files to Modify:**
- `package.json`
- `tsup.config.ts` (only if needed to copy assets)
- `src/styles/global.css` (if used as build input)
- `tailwind.config.js` (or create a dedicated config for build)

**Files to Add:**
- `scripts/build-css.ts` (or `scripts/build-css.mjs`)
- `src/styles/mts.css` (Tailwind input stylesheet dedicated to DS output)
- `tailwind.mts.config.js` (dedicated Tailwind config for compiling DS CSS)
- `dist/styles.css` (generated output; do not commit unless required by repo policy)

**Changes:**
1. Create a dedicated Tailwind config used ONLY for compiling DS CSS:
   - `prefix: 'mts-'`
   - `content: ['src/components/**/*.{ts,tsx}', 'src/**/*.ts', 'src/**/*.tsx']`
   - `presets: [require('./dist/tailwind.preset.cjs') or import compiled preset]` (choose appropriate form based on build output)
   - Disable `preflight` to avoid global resets leaking into consumer apps:
     - `corePlugins: { preflight: false }`
2. Create a dedicated CSS input that includes variables + utilities:
   - `@import './variables.css';`
   - `@tailwind utilities;`
   - (omit `@tailwind base` and `@tailwind components` unless specifically needed)
3. Add a build script that compiles the CSS via Tailwind CLI:
   - Example: `tailwindcss -c tailwind.mts.config.js -i src/styles/mts.css -o dist/styles.css --minify`
4. Wire scripts into the existing build pipeline:
   - Ensure token generation runs before CSS build.
   - Ensure CSS build runs before publish.
5. Export the CSS artifact for consumers:
   - Add `exports` entry for `./styles.css` (or equivalent) and/or `style` field.

**Validation:**
- [ ] `dist/styles.css` contains `.mts-` selectors (smoke assertion in tests or CI).
- [ ] Storybook renders components with correct styling when importing the compiled CSS.

---

### Task 4: Update Storybook to use compiled CSS output

**Objective:** Make Storybook a consumer of the same compiled CSS artifact to prevent build drift.

**Files to Modify:**
- `.storybook/preview.ts`

**Changes:**
1. Replace the Tailwind-directive-based import path with an import of the compiled CSS artifact used by consumers.
   - In-repo development option A: import from `src/styles/mts.css` + ensure Storybook runs Tailwind compile (not preferred in Approach 2).
   - In-repo development option B (preferred): import from `dist/styles.css` and ensure `build-storybook` depends on the CSS build step.
2. Ensure Storybook still loads `variables.css` (either via `dist/styles.css` or direct import).

**Validation:**
- [ ] `npm run build-storybook` produces output CSS that includes `.mts-*` utilities.
- [ ] Visual inspection: Button/Modal/etc show expected styling.

---

### Task 5: Implement web theming runtime API (`ThemeProvider` + `useTheme`)

**Objective:** Provide the DS-1005 theming API for web (only), including persistence and system preference.

**Files to Add:**
- `src/theme/web/types.ts`
- `src/theme/web/ThemeProvider.tsx`
- `src/theme/web/useTheme.ts`
- `src/theme/web/applyThemeToDom.ts`

**Files to Modify:**
- `src/index.ts`

**API Contract (Web):**
- `ThemePreference = 'system' | 'light' | 'dark'`
- `useTheme()` returns:
  - `preference: ThemePreference`
  - `resolvedTheme: 'light' | 'dark'`
  - `setPreference(next: ThemePreference): void`

**DOM Contract:**
- When resolved theme is dark, set: `document.documentElement.dataset.mtsTheme = 'dark'`.
- When resolved theme is light, remove the attribute or set to `'light'` (choose one; prefer removing for light base).

**Persistence Contract:**
- Storage key: `mts-theme` (configurable via provider prop if needed).
- Behavior:
  1. On first load, read `localStorage[mts-theme]`.
  2. If missing/invalid, default to `'system'`.
  3. If `'system'`, resolve via `matchMedia('(prefers-color-scheme: dark)')`.
  4. Listen to `matchMedia` changes when preference is `'system'`.

**SSR / Safety:**
- Guard DOM and `window` access (`typeof window !== 'undefined'`).
- If SSR, default `resolvedTheme` to `'light'` and apply on client mount.

**Validation:**
- [ ] Unit tests cover: localStorage present/missing, invalid value, system preference switching.
- [ ] DOM attribute updates as expected.

---

### Task 6: Documentation updates for consumers and MFEs

**Objective:** Document the new consumption model (import DS CSS + use theming provider) and clarify that consumers do not need Tailwind.

**Files to Modify:**
- `README.md`
- `SPECIFICATION.md` (only if it documents theming/shared token constraints)

**Changes:**
1. Add usage snippet:
   - Import compiled CSS from the package.
   - Wrap app or DS mount with `ThemeProvider`.
2. Add MFE guidance:
   - Ensure CSS is loaded once per host shell if possible.
   - Ensure theme attribute is set at `html` root.
3. Add RN guidance:
   - Use TS theme exports; do not rely on CSS variables.

**Validation:**
- [ ] Docs build/format unchanged.
- [ ] Examples align with actual exports.

---

## Technical Specifications

### Theme Data Model
- `Theme` is a complete object (colors/spacing/typography/shadows/etc.).
- `darkThemeOverrides` is a deep partial that overlays `lightTheme`.
- The merged theme is the “dark theme” (computed).

### CSS Variable Strategy
- Color variables remain `--color-<scale>-<shade>` to preserve compatibility with existing Tailwind preset.
- Light theme values live in `:root`.
- Dark theme values live in `html[data-mts-theme="dark"]` and override only keys present in overrides.

### Compiled CSS Strategy
- Tailwind compilation is owned by this package.
- Prefix is enforced in the Tailwind compile config (`mts-`).
- Compiled CSS excludes `preflight` to reduce global side effects.

### Backwards Compatibility
- Existing components that use `mts-bg-primary-500` etc continue to work.
- Theme switching changes the underlying `--color-*` values.

---

## Testing Strategy

**Unit Tests:**
- [ ] `useTheme` resolves correct theme for each preference.
- [ ] `useTheme` persists preference and rehydrates correctly.
- [ ] System preference changes update resolved theme only when preference is `system`.

**Integration Tests:**
- [ ] Token generation test asserts `variables.css` includes dark override block.
- [ ] CSS build smoke test asserts compiled CSS contains at least one known `.mts-` selector (e.g. `.mts-bg-primary-500`).

**Manual Testing:**
- [ ] Storybook: toggle theme preference and confirm variables change.
- [ ] Consumer simulation: import CSS + render a Button and verify styling present without Tailwind.

---

## Success Criteria

- [ ] A compiled CSS artifact is produced and exported by the package.
- [ ] Storybook build output includes `.mts-*` utilities and components render styled.
- [ ] `useTheme()` + provider exist and meet DS-1005 persistence/system requirements.
- [ ] Light base + dark overrides implemented via CSS variables.
- [ ] Theme definitions are reusable by RN (TS exports, dark overrides model).
- [ ] All tests passing.

---

## Risk Assessment

**Potential Risks:**
1. **CSS size grows significantly** (compiled utilities can be large).
   - Probability: Medium
   - Impact: Medium
   - Mitigation: Ensure Tailwind content scanning is restricted to DS sources; avoid safelisting broad patterns.
2. **Global style leakage** (preflight/base styles affect consumer apps).
   - Probability: Medium
   - Impact: High
   - Mitigation: Disable Tailwind preflight in the compiled CSS config; keep CSS limited to utilities + variables.
3. **FOUC on first paint** when theme is stored as dark.
   - Probability: Medium
   - Impact: Medium
   - Mitigation: Allow optional consumer-provided inline script to set `data-mts-theme` early (documented), or rely on `@media` fallback.
4. **Mismatch between TS theme and CSS variables** over time.
   - Probability: Low
   - Impact: Medium
   - Mitigation: Generate variables directly from TS theme and add tests that validate key variables exist.

---

## Rollback Plan

- Revert new CSS build pipeline scripts and exports.
- Revert Storybook to import `src/styles/global.css`.
- Remove `ThemeProvider/useTheme` exports.
- Keep token pipeline intact (no breaking changes to tokens).

---

## Assumptions and Constraints

**Assumptions:**
- The package build process can emit non-TS artifacts (CSS) into `dist/` and publish them.
- Consumers can import a CSS file from the package.

**Constraints:**
- `mts-` prefix remains unchanged.
- Web-only theming runtime; RN consumes TS theme definitions.
- Dark theme authored as overrides on top of light base.

---

## Dependencies

- `tailwindcss` (already present): used for compile-time CSS generation.
- Potential addition: `postcss-cli` (only if Tailwind CLI approach is not used).

---

## Estimated Effort

- 1–2 days engineering time depending on how much of dark palette is already defined vs needs design input.

---

**Awaiting Approval**

This plan must be reviewed and approved before proceeding to EXECUTE mode.
