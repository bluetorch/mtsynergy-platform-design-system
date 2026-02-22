# Memory — RECALL

Recall relevant plans, reviews, or session notes from the repository memory bank.

**Purpose:** Retrieve context from previous work to inform current development decisions.

---

## Critical Path Policy

**Repository Root Requirement:**
- Memory bank MUST be at repository root: `.github/memory-bank/`
- Always use `git rev-parse --show-toplevel` to find repository root first
- NEVER search in subdirectories or package-level memory banks

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

## Recall Workflow

### 1. Determine Current Context

**Get repository root:**
```bash
git rev-parse --show-toplevel
```

**Get current branch and date:**
```bash
git branch --show-current
date +%Y-%m-%d
```

**Get recent activity (commits since last session):**
```bash
# View commits from last 24 hours
git log --since="24 hours ago" --oneline --all

# View commits since specific date
git log --since="2026-02-12" --oneline --all

# View recent changes to files
git log --since="1 week ago" --name-status --oneline
```

---

### 2. Search Memory Bank

**Find memory bank root:**
```bash
ROOT=$(git rev-parse --show-toplevel)
MEMORY_BANK="$ROOT/.github/memory-bank"
```

**Calculate branchSlug from current branch:**
```bash
BRANCH=$(git branch --show-current)
# Apply branchSlug transformation (replace /, \, non-alphanumeric, collapse -, trim)
```

**Search current branch memories:**
```bash
# List all memories for current branch
ls -la $MEMORY_BANK/[branchSlug]/plans/
ls -la $MEMORY_BANK/[branchSlug]/reviews/
ls -la $MEMORY_BANK/[branchSlug]/sessions/

# Search by content
grep -r "keyword" $MEMORY_BANK/[branchSlug]/
```

**Search across all branches:**
```bash
# Find memories containing specific keyword
find $MEMORY_BANK -type f -name "*.md" -exec grep -l "keyword" {} \;

# List all recent memories
find $MEMORY_BANK -type f -name "*.md" -mtime -7
```

---

### 3. Read Relevant Artifacts

**Read specific memory file:**
```bash
cat $MEMORY_BANK/[branchSlug]/plans/[filename].md
cat $MEMORY_BANK/[branchSlug]/reviews/[filename].md
cat $MEMORY_BANK/[branchSlug]/sessions/[filename].md
```

**Check git history of memory file:**
```bash
git log --follow --oneline -- .github/memory-bank/[branchSlug]/[type]/[filename].md
```

---

## Search Scope

**Priority Order:**
1. **Current branch, recent date** — Most relevant to active work
2. **Current branch, older dates** — Historical context for this feature
3. **Related branches** — Similar feature names or ticket numbers
4. **Main/master branch** — Architectural decisions and patterns
5. **All branches** — Broad pattern or decision search

**Search Strategies:**

**By Date Range:**
```bash
# Find memories from specific date range
find $MEMORY_BANK -type f -name "*2026-02-13*.md"
find $MEMORY_BANK -type f -name "*2026-02-1*.md"
```

**By Branch Pattern:**
```bash
# Find memories from feature branches
ls $MEMORY_BANK/ | grep "feature-"
```

**By Content:**
```bash
# Search for specific topics
grep -r "authentication" $MEMORY_BANK/
grep -r "TICKET-123" $MEMORY_BANK/
```

---

## Output Format

**Summary of Recalled Memories:**

**Context:**
- Current Branch: [branch name]
- Current Date: [YYYY-MM-DD]
- Recent Activity: [summary of git log findings]

**Relevant Memories Found:**

**Plans:**
- [Link to plan file]: [Brief description]

**Reviews:**
- [Link to review file]: [Brief description]

**Sessions:**
- [Link to session file]: [Brief description]

**Key Findings:**
- [Summarize important decisions]
- [List relevant patterns or approaches]
- [Note any blockers or warnings]

If no memories found, display: "No relevant memories found for [search criteria]"

---

## Usage Tips

- **Before starting work:** Recall plans to understand approved approach
- **After errors:** Check reviews to see if similar issues were encountered
- **During implementation:** Reference session notes for context and decisions
- **Cross-branch learning:** Search other branches for similar feature implementations
- **Pattern discovery:** Search by topic (e.g., "authentication", "caching") across all branches

---

## Remember Search Query Pattern

When searching, use multiple strategies:
1. Exact filename match (if known)
2. Keyword in content (grep)
3. Date range (find by filename pattern)
4. Branch pattern (feature-*, bugfix-*, etc.)
5. Git history (when file was modified)

**Combine strategies for better results:**
```bash
# Example: Find recent authentication-related memories
find $MEMORY_BANK -type f -name "*2026-02*.md" -exec grep -l "authentication" {} \;
```

---

**Memories help maintain context across sessions and prevent rediscovering solutions.**
