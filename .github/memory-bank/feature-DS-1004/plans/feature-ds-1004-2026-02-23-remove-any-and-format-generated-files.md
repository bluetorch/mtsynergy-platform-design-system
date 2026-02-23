# Plan: DS-1004 Fix — Remove `as any` + Stabilize Formatting for Generated Artifacts

**Date:** 2026-02-23  
**Branch:** feature/DS-1004  
**Ticket:** DS-1004  
**Type:** Bug Fix / Quality Improvement

---

## Problem Statement

DS-1004 Tailwind integration is functionally correct (CSS variables + Tailwind preset + opacity support) but the most recent REVIEW found a **critical remediation miss**:

- The generated preset still contains `} as any,` (and an ESLint suppression comment), which violates the approved remediation plan intent (“remove `any` via `satisfies` typing”).

Additionally, local quality gates are fragile because:
- `prettier --check src/` fails due to generated files (`src/tailwind.preset.ts`, `src/styles/variables.css`) not being formatted.

**Current State:**
- `scripts/generate-tailwind-config.ts` generates `src/tailwind.preset.ts` that contains `as any` and a lint suppression comment.
- `prettier --check src/` reports code style issues in the generated files.

**Desired State:**
- Generated preset uses TypeScript type safety without `any`.
- Generated artifacts are formatted deterministically so `npm run format:check` passes.
- Core DS-1004 behavior remains unchanged:
  - CSS variables remain RGB channels.
  - Tailwind preset colors remain `rgb(var(--color-...) / <alpha-value>)`.
  - Build artifacts remain exported (`./tailwind-preset`, `./styles.css`).

**User Requirements:**
- “the fix for this issue” → implement the remediation fix that removes `as any` from generated preset.

---

## Solution Approach

Make the **generator** the single source of truth and ensure it produces:
1. A preset that is type-safe via TypeScript’s `satisfies` operator.
2. Generated files that are Prettier-compliant immediately after generation.

**Why This Approach:**
- Eliminates the root cause (generator emits `any`).
- Keeps output stable and CI-friendly (format check no longer flakes on generated files).
- Avoids manual edits to generated files; regeneration remains the workflow.

**Key Design Decisions:**
1. Replace `} as any,` with a `satisfies`-based shape check on the generated `extend` object.
2. Format generated artifacts automatically as part of `build:tokens` to keep them compliant.

---

## Implementation Plan

### Task 1: Remove `as any` From Generated Tailwind Preset (CRITICAL)

**Objective:** Ensure the generated `src/tailwind.preset.ts` contains **no** `as any` and no ESLint suppression.

**Files to Modify:**
- `scripts/generate-tailwind-config.ts`

**Changes:**
1. Update `generateTailwindPreset()` template output to:
   - Create an `extend` object as a standalone constant.
   - Use the `satisfies` operator to validate it:

   ```ts
   const extend = {
     colors: ..., 
     spacing: ...,
     // etc
   } satisfies Partial<Config['theme']>['extend'];

   const preset: Config = {
     content: [],
     theme: {
       extend,
     },
     plugins: [],
   };
   ```

2. Remove:
   - `// eslint-disable-next-line @typescript-eslint/no-explicit-any`
   - `} as any,`

**Validation:**
- [ ] Regenerate artifacts (`npm run build:tokens`).
- [ ] Confirm `src/tailwind.preset.ts` contains **no** `as any` string.
- [ ] `npm run lint` succeeds with zero errors.

---

### Task 2: Ensure Generated Artifacts Pass `prettier --check`

**Objective:** Make `npm run format:check` pass consistently after generation.

**Files to Modify:**
- `package.json`

**Changes (preferred, simplest):**
1. Update `build:tokens` to format the generated files immediately after generation:
   - Change from:
     - `"build:tokens": "tsx scripts/build-tokens.ts"`
   - To:
     - `"build:tokens": "tsx scripts/build-tokens.ts && prettier --write src/tailwind.preset.ts src/styles/variables.css"`

**Rationale:**
- Uses existing devDependency (`prettier`).
- Cross-platform (no `cp`, no bash-only syntax).
- Ensures the generated artifacts are always in a “checked” state.

**Validation:**
- [ ] Run `npm run build:tokens`.
- [ ] Run `npm run format:check` → expect success.

---

### Task 3: Keep Generated Files Policy Explicit (Commit vs Ignore)

**Objective:** Remove ambiguity about whether `src/tailwind.preset.ts` and `src/styles/variables.css` should be committed.

**Files to Modify (documentation / housekeeping):**
- (Optional) `README.md` or a DS-1004 note in an existing doc

**Decision Options:**
- **Option A (recommended): Commit the generated files**
  - Pros: clean checkouts include required entrypoints; format/lint applies predictably.
  - Cons: requires regeneration discipline when tokens change.

- **Option B: Do not commit (keep generated-only)**
  - Pros: fewer files tracked.
  - Cons: local work often ends with untracked/dirty state; format check can fail depending on whether files exist.

**Plan Default:** Option A (commit), because `tsup` has an entrypoint at `src/tailwind.preset.ts` and developer workflows are simpler with it present.

**Validation:**
- [ ] `git status` is clean after commit.
- [ ] `npm run build` still succeeds.

---

## Technical Specifications

### Type Safety Target
- Use TypeScript `satisfies` (TypeScript >= 4.9; project currently uses TypeScript 5.x).
- Type for validation:
  - `Partial<Config['theme']>['extend']`

### Output Invariants
- CSS variables remain in the form:
  - `--color-primary-500: 0 102 204;`
- Preset colors remain in the form:
  - `rgb(var(--color-primary-500) / <alpha-value>)`

---

## Testing Strategy

**Unit Tests:**
- [ ] `npm run test:run` (expect existing 239 tests passing)

**Build & Quality:**
- [ ] `npm run build:tokens`
- [ ] `npm run lint`
- [ ] `npm run format:check`
- [ ] `npm run build`

**Manual Verification:**
- [ ] Confirm `dist/tailwind.preset.js` exists after build.
- [ ] Confirm `dist/styles.css` exists after build.

---

## Success Criteria

- [ ] Generated preset contains no `as any` and no ESLint suppression for `any`.
- [ ] `npm run lint` passes.
- [ ] `npm run format:check` passes.
- [ ] `npm run test:run` passes.
- [ ] `npm run build` passes and outputs `dist/styles.css` + `dist/tailwind.preset.*`.

---

## Risk Assessment

1. **Risk:** `satisfies` typing rejects the generated extend shape
   - Probability: Medium
   - Impact: Medium
   - Mitigation: Adjust generation to match Tailwind’s expected `extend` shape; if necessary, fall back to a non-`any` cast (e.g., `as Partial<...>`) as a last resort.

2. **Risk:** Formatting command slows down token generation
   - Probability: Low
   - Impact: Low
   - Mitigation: Limit formatting to only the two generated files.

---

## Rollback Plan

- Revert changes to generator and scripts:
  - `git checkout -- scripts/generate-tailwind-config.ts package.json`
- Regenerate artifacts back to previous behavior (if needed):
  - `npm run build:tokens`

---

## Assumptions and Constraints

**Assumptions:**
- TypeScript >= 4.9 is available (true: TS 5.x in devDependencies).
- Prettier is available in devDependencies (true).

**Constraints:**
- No functional changes to tokens, CSS variables naming, or Tailwind preset API.

---

## Dependencies

- Internal: `scripts/build-tokens.ts` continues to call the generation pipeline.
- External: none (uses existing `prettier`).

---

## Estimated Effort

- 20–40 minutes (generator template adjustment + script update + validation).

---

**Awaiting Approval**

This plan must be reviewed and approved before proceeding to EXECUTE mode.
