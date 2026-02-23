# Plan: DS-1005 — Remediation for Review Failures

**Date:** 2026-02-23
**Branch:** feature/DS-1005
**Ticket:** DS-1005
**Type:** Fix / Remediation

---

## Problem Statement

The implementation of DS-1005 (Web Theming Approach 2) failed the review gate due to a critical breakage in the CSS build process and several code quality issues.

**Failures Identified:**
1.  🔴 **CRITICAL**: `tailwind.mts.config.js` is missing the design system preset configuration. As a result, `dist/styles.css` is generated without any of the required `.mts-*` token utility classes (e.g., `mts-bg-primary-500`).
2.  ⚠️ **WARNING**: `src/theme/mergeTheme.ts` contains `any` types that violate lint rules.
3.  🟢 **INFO**: Formatting inconsistencies in `src/theme/types.ts` and `src/theme/web/useTheme.ts`.

**Desired State:**
- The build process generates a `dist/styles.css` file that includes all expected `.mts-*` utility classes derived from design tokens.
- All lint errors are resolved.
- Code formatting passes CI checks.

---

## Solution Approach

1.  **Configure Tailwind Preset**: Update `tailwind.mts.config.js` to import and use `src/tailwind.preset.ts` (or its built equivalent). This ensures the token map is available during compilation.
2.  **Fix Types**: Refactor `src/theme/mergeTheme.ts` to replace `any` with safer types (`unknown`, generics) or explicit suppressions where dynamic merging is strictly required and safe.
3.  **Apply Formatting**: Run the project's formatter on the affected files.
4.  **Verify**: Add a smoke test step to `scripts/build-css.mjs` (or run manually) to confirm the output CSS contains sample token classes.

---

## Implementation Plan

### Task 1: Fix CSS Build Configuration

**Objective**: Ensure the Tailwind build process includes the design tokens.

**Files to Modify**:
- `tailwind.mts.config.js`

**Changes**:
1.  Import the preset: `import preset from './src/tailwind.preset.ts';` (since we run with `tsx`).
2.  Add the preset to the config: `presets: [preset]`.
3.  Ensure `content` paths are correct to scan components for usage.

**Validation**:
- [ ] Run `npm run build:css`.
- [ ] `grep "mts-bg-primary-500" dist/styles.css` returns matches.

### Task 2: Resolve Lint Errors in `mergeTheme.ts`

**Objective**: Eliminate `any` usage in the deep merge utility.

**Files to Modify**:
- `src/theme/mergeTheme.ts`

**Changes**:
1.  Replace `any` with `Record<string, unknown>` or a generic `T` where possible.
2.  If strictly necessary for the recursive merge logic, use `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a comment explaining why (it's a generic deep merge utility).
3.  Verify lint passes: `npm run lint`.

### Task 3: Fix Formatting

**Objective**: conform to Prettier standards.

**Files to Modify**:
- `src/theme/types.ts`
- `src/theme/web/useTheme.ts`

**Changes**:
1.  Run `npm run format` (or `prettier --write` specifically on these files).

---

## Verification Plan

**Manual Verification**:
1.  Run `npm run build:css`.
2.  Inspect `dist/styles.css` output.
3.  Search for a known token utility (e.g., `.mts-text-primary-500`).
4.  Search for a known standard utility (e.g., `.mts-block`).

**Automated Checks**:
- `npm run lint` must pass.
- `npm run format:check` must pass.
- `npm test` must pass.

---

## Success Criteria

- [ ] `dist/styles.css` contains design system token utilities.
- [ ] No lint errors.
- [ ] No format errors.

---

**Awaiting Approval**
