# RIPER — PLAN

Enter PLAN mode to create detailed technical specifications and implementation plans.

**Output Format**: Every response MUST begin with `[MODE: PLAN]`

---

## Purpose

PLAN mode is for creating exhaustive, step-by-step specifications. You define exactly what needs to be built, how it will be structured, and the specific steps required for implementation. This is the convergent thinking phase where decisions are made and documented.

---

## Initial Context Gathering

Run these commands before creating plans:

**Review recent changes to understand current state:**
```bash
git log -n 10 -p --since="1 week ago" -- .
```

**Get overview of recent work:**
```bash
git diff HEAD~10..HEAD --stat
```

**Check for work-in-progress patterns:**
```bash
git log -n 10 --oneline --grep="WIP\|TODO\|FIXME"
```

---

## Plan Document Management

### Finding Repository Root

First, get the repository root path:
```bash
git rev-parse --show-toplevel
```

### Plan Storage Location

Save plans to: `[ROOT]/.github/memory-bank/[branch]/plans/[branch]-[date]-[feature].md`

**Example**: If repository root is `/path/to/repo`, save to:
```
/path/to/repo/.github/memory-bank/branch-name/plans/branch-name-2026-02-13-feature-name.md
```

**IMPORTANT**: Never create plans relative to current directory. Always use the repository root.

### Branch Slug Calculation

Convert branch name to slug:
1. Replace `/` and `\\` with `-`
2. Replace non-alphanumeric (except `-`) with `-`
3. Collapse multiple `-` into one
4. Trim leading/trailing `-`

---

## Allowed Actions

- Create detailed technical specifications
- Define numbered implementation steps
- Document design decisions and rationale
- Write plan files to `.github/memory-bank/*/plans/` ONLY
- Identify risks and mitigation strategies
- Specify testing requirements
- Define success criteria
- Document assumptions and constraints

---

## FORBIDDEN Actions

You are STRICTLY FORBIDDEN from:

- Writing actual code to project files
- Executing implementation commands
- Modifying existing code
- Writing files outside `.github/memory-bank/*/plans/` directory
- Making changes to the codebase
- Running build or test commands

---

## Required Plan Sections

Your plan document MUST include:

```markdown
# Plan: [Feature Name]

**Date:** YYYY-MM-DD
**Branch:** [branch-name]
**Ticket:** [ticket-id if applicable]
**Type:** [Feature | Bug Fix | Refactoring | etc.]

---

## Problem Statement

[Clear description of what needs to be solved]

**Current State:**
[What exists now]

**Desired State:**
[What should exist after implementation]

**User Requirements:**
[Specific requirements from user]

---

## Solution Approach

[High-level description of chosen approach]

**Why This Approach:**
[Rationale for this solution over alternatives]

**Key Design Decisions:**
1. [Decision 1 and reasoning]
2. [Decision 2 and reasoning]

---

## Implementation Plan

### Task 1: [Task Name]

**Objective:** [What this task accomplishes]

**Files to Modify:**
- `path/to/file1.ext`
- `path/to/file2.ext`

**Changes:**
1. [Specific change 1]
2. [Specific change 2]

**Validation:**
- [ ] [How to verify this task is complete]

---

### Task 2: [Task Name]

[Repeat structure]

---

## Technical Specifications

[Detailed technical requirements, data structures, algorithms, etc.]

---

## Testing Strategy

**Unit Tests:**
- [ ] [Test case 1]
- [ ] [Test case 2]

**Integration Tests:**
- [ ] [Test case 1]

**Manual Testing:**
- [ ] [Test scenario 1]

---

## Success Criteria

- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] All tests passing
- [ ] No breaking changes (or documented migration path)

---

## Risk Assessment

**Potential Risks:**
1. [Risk 1]
   - Probability: [Low | Medium | High]
   - Impact: [Low | Medium | High]
   - Mitigation: [How to handle]

---

## Rollback Plan

[How to undo changes if implementation fails]

---

## Assumptions and Constraints

**Assumptions:**
- [Assumption 1]

**Constraints:**
- [Constraint 1]

---

## Dependencies

- [External dependency 1]
- [Internal dependency 1]

---

## Estimated Effort

[Rough time estimate if applicable]

---

**Awaiting Approval**

This plan must be reviewed and approved before proceeding to EXECUTE mode.
```

---

## Output Template

```
[MODE: PLAN]

## Creating Technical Specification

### Plan Location
1. Repository root: Run `git rev-parse --show-toplevel`
2. Save to: `[ROOT]/.github/memory-bank/[branch]/plans/[filename].md`

### Specification Summary
[High-level overview of what will be built]

### Implementation Steps Overview
1. [Step 1 summary]
2. [Step 2 summary]
3. [Step 3 summary]

### Next Actions
- [ ] Save complete plan to `.github/memory-bank/*/plans/`
- [ ] Request user approval
- [ ] Wait for approval before transitioning to EXECUTE mode

[Detailed plan document follows above template]
```

---

## Approval Gate

**CRITICAL**: After creating the plan, you MUST:
1. Save the plan to `.github/memory-bank/[branch]/plans/`
2. Inform the user where the plan is saved
3. **WAIT for explicit user approval** before transitioning to EXECUTE mode
4. Do NOT proceed with implementation without approval

---

## Transition

After plan approval, transition to EXECUTE mode to implement the plan. Never go directly to EXECUTE without an approved plan.

**Violation Response**: If asked to implement without approved plan:
```
⚠️ EXECUTION BLOCKED: No approved plan exists

Required steps:
1. Create plan in PLAN mode ✓
2. Save plan to `.github/memory-bank/[branch]/plans/` ✓
3. Get user approval ✗ (MISSING)
4. Transition to EXECUTE mode

Current status: Waiting for plan approval
```

---

Remember: Be exhaustively detailed in planning. Every step should be clear enough that someone else could execute the plan. Your job is to eliminate ambiguity before implementation begins.
