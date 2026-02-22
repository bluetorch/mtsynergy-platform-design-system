# Memory — LIST

List all RIPER artifacts from the repository memory bank.

**Purpose:** Display available plans, reviews, and sessions across all branches or for the current branch.

---

## Critical Path Policy

**Repository Root Requirement:**
- Memory bank MUST be at repository root: `.github/memory-bank/`
- Always use `git rev-parse --show-toplevel` to find repository root first
- NEVER create memory banks in subdirectories or packages

### Correct vs Incorrect Paths
✅ **Correct**: `[ROOT]/.github/memory-bank/[branch]/` (where ROOT = `git rev-parse --show-toplevel`)  
❌ **Wrong**: `./memory-bank/` (current directory)  
❌ **Wrong**: `packages/app/.github/memory-bank/` (subdirectory)

---

## Branch Slug Calculation

Use `branchSlug` (not raw branch name) for folder paths:

**Calculation Steps:**
1. Get current branch: `git branch --show-current`
2. Replace `/` and `\\` with `-`
3. Replace any non-alphanumeric (except `-`) with `-`
4. Collapse multiple `-` into one
5. Trim leading/trailing `-`
6. If branch cannot be determined, use `unknown-branch`

**Examples:**
- `feature/user-auth` → `feature-user-auth`
- `bugfix/TICKET-123` → `bugfix-TICKET-123`
- `main` → `main`

---

## Listing Current Branch Memories

**Get repository root and current branch:**
```bash
git rev-parse --show-toplevel
git branch --show-current
```

**List current branch artifacts:**
```bash
# Replace [ROOT] with output from git rev-parse --show-toplevel
# Replace [branchSlug] with calculated branch slug

ls -la [ROOT]/.github/memory-bank/[branchSlug]/
ls -la [ROOT]/.github/memory-bank/[branchSlug]/plans/
ls -la [ROOT]/.github/memory-bank/[branchSlug]/reviews/
ls -la [ROOT]/.github/memory-bank/[branchSlug]/sessions/
```

---

## Listing All Branch Memories

**Find all memory files across all branches:**
```bash
find [ROOT]/.github/memory-bank/ -type f -name "*.md" | head -20
```

**List all branch folders:**
```bash
ls -la [ROOT]/.github/memory-bank/
```

---

## Memory Bank Organization

```
[ROOT]/.github/memory-bank/  (where ROOT = `git rev-parse --show-toplevel`)
├── main/
│   ├── plans/
│   │   └── main-2026-02-13-feature.md
│   ├── reviews/
│   │   └── main-2026-02-13-feature-review.md
│   └── sessions/
│       └── main-2026-02-13-notes.md
├── feature-user-auth/
│   ├── plans/
│   │   └── feature-user-auth-2026-02-12-implementation.md
│   └── sessions/
│       └── feature-user-auth-2026-02-12-decisions.md
└── bugfix-TICKET-123/
    └── sessions/
        └── TICKET-123-2026-02-11-bugfix-notes.md
```

---

## Output Format

Display results organized by:

**Current Branch Memories:**
- Branch: [current branch name]
- Plans: [list file paths with links]
- Reviews: [list file paths with links]
- Sessions: [list file paths with links]

**All Branches:**
- [branch-name]: [count] artifacts
  - Plans: [count]
  - Reviews: [count]
  - Sessions: [count]

If no memories found, display: "No memories found for [branch-name]"

---

## Usage Tips

- **View current work:** Use this to see what's been saved for your current branch
- **Check other branches:** See what work exists on other feature branches
- **Find plans:** Quickly locate approved plans before executing
- **Find reviews:** Check review outcomes for completed work
- **Browse sessions:** Find notes and decisions from previous sessions

---

**Memories are organized by branch to prevent conflicts when switching branches.**
