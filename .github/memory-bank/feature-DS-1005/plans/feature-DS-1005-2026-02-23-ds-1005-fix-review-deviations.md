# Plan: DS-1005 — Fix Review Deviations (Web Theme Tests + Merge Justification)

**Date:** 2026-02-23
**Branch:** feature/DS-1005
**Ticket:** DS-1005
**Type:** Test / Quality Remediation

---

## Problem Statement

The latest DS-1005 review passed functional gates but flagged two deviations from the approved plan/remediation:

1) 🟡 **WARNING**: Missing unit tests for the web theming runtime (`ThemeProvider` / `useTheme` / `applyThemeToDom`), despite explicit test requirements in the DS-1005 plan.
2) 🟡 **WARNING**: `src/theme/mergeTheme.ts` uses an ESLint suppression for `any` without an explicit justification comment at the suppression site (requested by remediation plan).

**Current State:**
- `ThemeProvider` and `useTheme` exist under `src/theme/web/`.
- Preference persistence uses `localStorage` (key defaults to `mts-theme`).
- System preference uses `window.matchMedia('(prefers-color-scheme: dark)')` and listens for changes.
- DOM contract applies `data-mts-theme="dark"` to `<html>` for dark; removes for light.
- Tests pass overall, but none explicitly validate the theming runtime contract.

**Desired State:**
- Dedicated unit tests validate the web theming runtime behavior (persistence, system resolution, DOM attribute).
- `mergeTheme` suppression is justified with a short explanatory comment.
- Lint/test/format gates continue to pass.

**User Requirements:**
- “fix the deviations” identified in the latest DS-1005 REVIEW.

---

## Solution Approach

Add a small, targeted test suite for the web theming runtime using Vitest + Testing Library, with controlled mocks for `localStorage` and `matchMedia`. Add a one-line justification comment adjacent to the existing ESLint suppression in `mergeTheme`.

**Why This Approach:**
- Addresses the review deviations directly with minimal surface area.
- Adds regression protection for behavior that is easy to break (system preference listeners, persistence, DOM updates).
- Does not change the API surface; only adds tests and clarifying documentation.

**Key Design Decisions:**
1. **Test at the API boundary (ThemeProvider + useTheme)** rather than testing internals: ensures tests reflect consumer usage.
2. **Mock `matchMedia`** with a controllable object exposing `matches` and event subscription to simulate system theme changes.
3. **Test DOM contract via `document.documentElement`** to ensure `data-mts-theme` toggling is correct.

---

## Implementation Plan

### Task 1: Add unit tests for web theming runtime

**Objective:** Implement the unit tests specified in DS-1005 Task 5 validation.

**Files to Add:**
- `src/theme/web/ThemeProvider.test.tsx`

**Files to Modify (only if needed):**
- `src/theme/web/ThemeProvider.tsx` (only if tests reveal required SSR/matchMedia guards)
- `src/theme/web/applyThemeToDom.ts` (only if tests reveal contract mismatch)

**Changes:**
1. Create `ThemeProvider.test.tsx` using `vitest` + `@testing-library/react`.
2. Add a small test harness component:
   - Wraps children in `ThemeProvider`.
   - Calls `useTheme()`.
   - Renders `preference`, `resolvedTheme`, and provides buttons to call `setPreference('light'|'dark'|'system')`.
3. Mock `window.matchMedia`:
   - Provide `matches` value.
   - Provide `addEventListener('change', cb)` / `removeEventListener`.
   - Provide a helper to fire a change event and update `matches`.
4. Test cases (all required):
   - **localStorage present**: stored values `light|dark|system` initialize provider state accordingly.
   - **localStorage missing**: defaults to `defaultPreference` (default: `system`).
   - **invalid localStorage value**: treated as missing and falls back to `defaultPreference`.
   - **setPreference persists**: setting to `light`/`dark` writes `localStorage[storageKey]`.
   - **setPreference to default removes**: when setting preference to `defaultPreference`, removes storage item.
   - **DOM attribute**: resolved `dark` sets `document.documentElement.dataset.mtsTheme === 'dark'`; resolved `light` removes `data-mts-theme`.
   - **system preference resolution**: with `preference='system'`, `resolvedTheme` tracks `matchMedia.matches`.
   - **system preference switching**: when `preference='system'` and matchMedia fires a `change`, DOM + resolvedTheme update.
   - **listener cleanup**: switching away from `system` removes listener (verify via mock call counts).
5. Ensure tests reset state between runs:
   - Clear `localStorage`.
   - Remove `data-mts-theme` from `<html>`.
   - Reset `matchMedia` mock.

**Validation:**
- [ ] `npm run test:run` passes.
- [ ] Tests explicitly reference and validate `mts-theme` storage key and `data-mts-theme` DOM contract.

---

### Task 2: Add justification comment for `mergeTheme` ESLint suppression

**Objective:** Remove ambiguity about why `any` is used inside the deep merge helper.

**Files to Modify:**
- `src/theme/mergeTheme.ts`

**Changes:**
1. Add a brief explanation comment adjacent to the existing suppression, e.g.:
   - The merge is a generic deep-merge over unknown shapes.
   - Keys are dynamic; runtime recursion makes strict typing impractical.
   - Boundary is safe because inputs are constrained to `Theme` + `ThemeOverrides`.
2. Do not change runtime behavior.

**Validation:**
- [ ] `npm run lint` remains 0 errors.

---

### Task 3 (Optional, not required by deviations): Remove React Refresh lint warning

**Objective:** Eliminate the `react-refresh/only-export-components` warning.

**Files to Modify:**
- `src/theme/web/ThemeProvider.tsx`
- `src/theme/web/types.ts` (or add `src/theme/web/context.ts`)

**Changes (Option A):**
1. Move `ThemeContext` into a non-component module (e.g. `src/theme/web/context.ts`).
2. Update imports accordingly.

**Validation:**
- [ ] `npm run lint` has no warnings from `react-refresh/only-export-components`.

---

## Technical Specifications

### matchMedia Mock Contract
The `ThemeProvider` uses:
- `window.matchMedia('(prefers-color-scheme: dark)')`
- `addEventListener('change', handler)` (preferred) with fallback `addListener`.

Mock should support both to keep tests resilient:
- Provide both method sets (at least `addEventListener/removeEventListener`).
- Store subscribed callbacks and allow triggering them.

### localStorage Contract
- Default storage key: `mts-theme`.
- Stored value must be one of: `system | light | dark`.
- Invalid values treated as missing.

### DOM Contract
- Dark resolved theme: `<html data-mts-theme="dark">`.
- Light resolved theme: remove `data-mts-theme` attribute.

---

## Testing Strategy

**Unit Tests:**
- [ ] Initializes from stored `localStorage` preference.
- [ ] Falls back to `defaultPreference` when missing/invalid.
- [ ] Persists changes to `localStorage` on `setPreference`.
- [ ] Resolves and applies `system` preference from `matchMedia`.
- [ ] Responds to system preference changes while in `system` mode.
- [ ] Applies and removes `data-mts-theme` attribute correctly.
- [ ] Cleans up listeners when leaving `system` mode.

**Integration Tests:**
- N/A (existing suite is unit-focused).

**Manual Testing:**
- [ ] Run Storybook and toggle theme in a sandbox app (if available) to confirm variables switch visually.

---

## Success Criteria

- [ ] DS-1005 review deviations resolved:
  - [ ] Web theming runtime has dedicated unit tests matching plan requirements.
  - [ ] `mergeTheme` suppression is justified.
- [ ] `npm run test:run` passes.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run format:check` passes.

---

## Risk Assessment

**Potential Risks:**
1. matchMedia mocking doesn’t match browser behavior
   - Probability: Medium
   - Impact: Medium
   - Mitigation: Implement mock matching the provider’s actual usage (event subscription + `matches` reads) and verify by assertions.

2. JSDOM limitations around `matchMedia`
   - Probability: Medium
   - Impact: Low
   - Mitigation: Always stub `window.matchMedia` in tests; avoid relying on native implementation.

---

## Rollback Plan

If the test additions introduce instability:
1. Revert `src/theme/web/ThemeProvider.test.tsx` additions.
2. Revert comment-only changes in `src/theme/mergeTheme.ts`.
3. Confirm baseline `npm run test:run` still passes.

---

## Assumptions and Constraints

**Assumptions:**
- Test environment is `jsdom` (current component tests already use DOM APIs).
- `@testing-library/react` is available (already used in component tests).

**Constraints:**
- Keep changes minimal and strictly limited to resolving the deviations.
- Do not change the public theming API contract.

---

## Dependencies

- Existing dev dependencies: `vitest`, `@testing-library/react`, `jsdom`.

---

## Estimated Effort

- Task 1: 1–2 hours
- Task 2: 5 minutes
- Optional Task 3: 15–30 minutes

---

**Awaiting Approval**

This plan must be reviewed and approved before proceeding to EXECUTE mode.
