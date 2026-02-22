# DS-1003: Storybook Visual Regression Testing with Loki

**Date:** 2026-02-22  
**Branch:** feature/DS-1003  
**Story:** DS-1003-DS (Storybook Documentation - Visual Regression Testing)  
**Estimated Time:** 3-4 hours

---

## Problem Statement

DS-1003 requires "Visual regression testing via Chromatic" per USER_STORIES.md. However, Chromatic funding is not available. The project needs a self-hosted alternative that:

- Integrates with existing Storybook infrastructure (Storybook 7.6.10 + 95 stories)
- Provides screenshot-based visual regression testing
- Stores baselines in version control (Git)
- Requires zero external SaaS dependencies
- Scales to 10 components (no plans to expand beyond current set)

**Current State:**
- ✅ Storybook configured with 95 stories across 10 components
- ✅ a11y addon configured and functional
- ✅ Storybook static build working (`storybook-static/`)
- ❌ No visual regression testing infrastructure
- ❌ `npm run chromatic` command documented but non-functional

**Goal:** Implement Loki-based visual regression testing with Git storage, completing DS-1003 requirements.

---

## Solution: Loki + Git Storage

**Loki** is an open-source visual regression testing tool specifically built for Storybook. It uses Docker containers for consistent screenshot rendering and stores baselines in Git.

**Why Loki + Git:**
- **Self-hosted**: No external dependencies, fully open-source (MIT license)
- **Storybook-native**: Zero additional test files, works with existing stories
- **Simple storage**: Screenshots committed to Git like code (with Git LFS for efficiency)
- **Developer-friendly**: `loki approve` workflow for baseline updates
- **Cost-effective**: Free, no subscription fees
- **Appropriate scale**: 10 components = ~1-2MB total screenshot size (acceptable for Git LFS)

---

## Implementation Plan

### Task 1: Install Dependencies

**Duration:** 15 minutes

Install Loki and Git LFS tooling.

#### Subtask 1.1: Install Loki npm packages

```bash
npm install --save-dev loki
```

**Packages:**
- `loki`: Core testing framework and CLI with built-in Storybook support

**Amendment Note (2026-02-22):** Original plan specified `@loki/test-runner-storybook` package which does not exist in npm registry. Storybook support is included in the main `loki` package (v0.35.1).

#### Subtask 1.2: Install Git LFS

Git LFS (Large File Storage) stores binary files (screenshots) efficiently without bloating repository.

**macOS:**
```bash
brew install git-lfs
git lfs install
```

**Verification:**
```bash
git lfs version  # Should output: git-lfs/3.x.x
```

**Acceptance Criteria:**
- [ ] `loki` in `devDependencies`
- [ ] Git LFS installed and initialized
- [ ] `git lfs version` returns version number

---

### Task 2: Configure Loki

**Duration:** 30 minutes

Create Loki configuration file and package.json scripts.

#### Subtask 2.1: Create `.loki/` directory structure

```bash
mkdir -p .loki
```

This directory will store:
- `reference/`: Baseline screenshots (committed to Git via LFS)
- `current/`: New screenshots during test runs (gitignored)
- `difference/`: Diff images highlighting changes (gitignored)

#### Subtask 2.2: Configure Loki in `package.json`

Add Loki configuration block to `package.json`:

```json
{
  "loki": {
    "configurations": {
      "chrome.laptop": {
        "target": "chrome.docker",
        "width": 1366,
        "height": 768
      }
    },
    "chromeDockerImage": "yukinying/chrome-headless-browser:latest",
    "diffingEngine": "pixelmatch",
    "chromeTolerance": 0.1
  }
}
```

**Configuration Explanation:**
- `chrome.laptop`: Configuration name (can add `chrome.tablet`, `chrome.mobile` later if needed)
- `target: "chrome.docker"`: Use Docker Chrome container for consistent rendering
- `width/height`: Desktop viewport size (matches typical laptop resolution)
- `chromeDockerImage`: Chrome Docker image (using latest available version)
- `diffingEngine: "pixelmatch"`: Pixel-by-pixel comparison algorithm
- `chromeTolerance: 0.1`: Allow 0.1% pixel difference (handles anti-aliasing variations)

#### Subtask 2.3: Add npm scripts

Add to `package.json` scripts section:

```json
{
  "scripts": {
    "loki:test": "loki test --requireReference --reactUri file:./storybook-static",
    "loki:update": "loki update --requireReference --reactUri file:./storybook-static",
    "loki:approve": "loki approve",
    "visual-test": "npm run build-storybook && npm run loki:test"
  }
}
```

**Script Explanations:**
- `loki:test`: Run visual regression tests against existing baselines
- `loki:update`: Generate/update baseline screenshots
- `loki:approve`: Open diff viewer to approve/reject changes
- `visual-test`: Combined workflow (build Storybook + run tests)

**Flags:**
- `--requireReference`: Fail if baseline doesn't exist (forces explicit approval)
- `--reactUri file:./storybook-static`: Use static build (faster, more reliable than dev server)

**Acceptance Criteria:**
- [ ] `.loki/` directory created
- [ ] Loki configuration added to `package.json`
- [ ] npm scripts added and functional
- [ ] Configuration specifies single viewport (desktop only)

---

### Task 3: Configure Git LFS for Screenshots

**Duration:** 20 minutes

Set up Git LFS to efficiently store binary screenshot files.

#### Subtask 3.1: Create `.gitattributes` file

Create/update `.gitattributes` in repository root:

```gitattributes
# Loki reference screenshots tracked by Git LFS
.loki/reference/**/*.png filter=lfs diff=lfs merge=lfs -text
```

**Explanation:**
- Tracks all PNG files in `.loki/reference/` with LFS
- `filter=lfs`: Convert to LFS pointer on commit
- `diff=lfs`: Use LFS-aware diff
- `merge=lfs`: Use LFS-aware merge
- `-text`: Treat as binary (no line-ending conversion)

#### Subtask 3.2: Update `.gitignore`

Add to `.gitignore`:

```gitignore
# Loki temporary files
.loki/current/
.loki/difference/

# Loki configuration cache
.loki/.cache/
```

**Rationale:**
- `current/`: Temporary screenshots during test runs (regenerated each time)
- `difference/`: Diff images (only relevant during active test run)
- Keep `.loki/reference/` tracked (these are the baselines we want in Git)

#### Subtask 3.3: Initialize LFS tracking

```bash
git lfs track ".loki/reference/**/*.png"
git add .gitattributes
git commit -m "chore: configure Git LFS for Loki screenshots"
```

**Acceptance Criteria:**
- [ ] `.gitattributes` created with LFS pattern
- [ ] `.gitignore` excludes temporary Loki directories
- [ ] Git LFS tracking active for `.loki/reference/**/*.png`
- [ ] Changes committed to Git

---

### Task 4: Verify Docker Setup

**Duration:** 20 minutes

Loki requires Docker to run Chrome in a container. Verify Docker is available and pull required image.

#### Subtask 4.1: Check Docker installation

```bash
docker --version
docker ps
```

**Expected Output:**
```
Docker version 24.x.x, build xxxxx
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

**If Docker not installed:**
- macOS: Install Docker Desktop from https://www.docker.com/products/docker-desktop
- Linux: `curl -fsSL https://get.docker.com | sh`

#### Subtask 4.2: Pull Chrome Docker image

```bash
docker pull yukinying/chrome-headless-browser:latest
```

**Image Details:**
- Size: ~500MB
- Chrome version: 141.x dev (latest available)
- Headless: No GUI, optimized for CI/CD

**Amendment Note (2026-02-22):** Original plan specified `115.0.5763.0` tag which does not exist in Docker Hub. Using `:latest` tag instead (Chrome 141.0.7340.0 dev).

**Why using latest:**
- Specific version tag 115.0.5763.0 not found in registry
- Latest tag provides most recent stable Chrome build
- Can pin to specific digest later if needed for reproducibility

#### Subtask 4.3: Test Docker execution

```bash
docker run --rm yukinying/chrome-headless-browser:latest --version
```

**Expected Output:**
```
Google Chrome 141.0.7340.0 dev
```

**Acceptance Criteria:**
- [ ] Docker installed and running
- [ ] Chrome Docker image pulled successfully
- [ ] Docker can execute Chrome headless (version check passes)
- [ ] Developer documentation updated with Docker requirement

---

### Task 5: Generate Initial Baselines

**Duration:** 45 minutes

Create baseline screenshots for all 95 existing stories.

#### Subtask 5.1: Build Storybook static site

```bash
npm run build-storybook
```

**Why static build:**
- Faster: No Webpack dev server startup overhead
- Reliable: No hot-reload or dev-only bugs
- CI-friendly: Can cache build between test runs

**Expected Output:**
```
Storybook built in 45 seconds
Output directory: /storybook-static
```

#### Subtask 5.2: Run baseline generation

```bash
npm run loki:update
```

**Expected Duration:** 5-8 minutes for 95 stories

**Process:**
1. Loki starts Docker Chrome container
2. Loads each story from `storybook-static/iframe.html`
3. Waits for story to render (default 1000ms)
4. Captures screenshot
5. Saves to `.loki/reference/chrome_laptop_<story-id>.png`

**Expected Output:**
```
Starting Loki...
Generating screenshots for 95 stories...
✓ components-alert--info
✓ components-alert--success
✓ components-alert--warning
...
✓ components-tabs--interactive-example

All 95 screenshots generated successfully.
Reference images saved to .loki/reference/
```

#### Subtask 5.3: Verify baseline screenshots

```bash
ls -lh .loki/reference/ | head -10
```

**Expected:**
- 95 PNG files (one per story)
- File sizes: 10-50 KB per screenshot
- Total: ~1-2 MB

**Sample filenames:**
```
chrome_laptop_components-alert--info.png
chrome_laptop_components-button--primary.png
chrome_laptop_components-modal--basic.png
```

#### Subtask 5.4: Commit baselines to Git

```bash
git add .loki/reference/
git commit -m "feat(DS-1003): add Loki visual regression baselines for 10 components"
```

**Git LFS Behavior:**
- Actual PNG files stored in LFS
- Git repository contains small pointer files (~100 bytes each)
- Total repository size increase: ~10 KB (not 2 MB)

**Acceptance Criteria:**
- [ ] Storybook static build succeeds
- [ ] All 95 stories have baseline screenshots
- [ ] Screenshot files are ~1-2 MB total
- [ ] Baselines committed to Git via LFS
- [ ] Git repository size increase < 50 KB

---

### Task 6: Create Test Workflow

**Duration:** 30 minutes

Document and test the visual regression workflow.

#### Subtask 6.1: Test visual regression detection

Make deliberate component change to verify Loki catches it:

```bash
# 1. Modify a component (e.g., change Button padding)
# Edit src/components/Button.tsx

# 2. Rebuild Storybook
npm run build-storybook

# 3. Run visual tests
npm run loki:test
```

**Expected Output (if change detected):**
```
Running visual regression tests...
✗ components-button--primary (1 difference)
✓ components-button--secondary
✓ components-button--danger
...

1 story failed visual regression.
Differences saved to .loki/difference/
```

#### Subtask 6.2: Test approval workflow

```bash
npm run loki:approve
```

**Expected Behavior:**
1. Starts local web server (http://localhost:6006)
2. Opens browser with diff viewer
3. Shows side-by-side comparison:
   - **Baseline** (left)
   - **Current** (middle)
   - **Diff** (right, highlights in red)
4. Buttons: "Approve" (updates baseline) | "Reject" (keep existing)

**After approval:**
```bash
git add .loki/reference/
git commit -m "test: update visual baseline for Button padding change"
```

#### Subtask 6.3: Revert test change

```bash
# Revert Button change
git checkout src/components/Button.tsx

# Rebuild and verify tests pass
npm run build-storybook
npm run loki:test
```

**Expected:**
```
All 95 stories passed visual regression.
```

**Acceptance Criteria:**
- [ ] Loki detects visual changes (test with deliberate modification)
- [ ] Diff viewer opens and displays changes correctly
- [ ] Approval workflow updates baselines
- [ ] Tests pass after reverting changes
- [ ] Git commit workflow documented

---

### Task 7: Update Documentation

**Duration:** 30 minutes

Update project documentation to reflect Loki visual regression testing.

#### Subtask 7.1: Update `README.md`

Replace Chromatic references with Loki:

**Find:**
```markdown
# Visual regression testing (Chromatic)
npm run chromatic
```

**Replace with:**
```markdown
# Visual regression testing (Loki)
npm run visual-test           # Build Storybook + run tests
npm run loki:test             # Run tests (requires existing baselines)
npm run loki:update           # Generate/update baselines
npm run loki:approve          # Review and approve changes
```

Add new section:

```markdown
### Visual Regression Testing

This project uses [Loki](https://loki.js.org/) for visual regression testing of Storybook stories.

**Prerequisites:**
- Docker installed and running
- Git LFS installed (`brew install git-lfs`)

**Workflow:**

1. **Run tests against existing baselines:**
   ```bash
   npm run visual-test
   ```

2. **If tests fail (visual changes detected):**
   ```bash
   npm run loki:approve
   ```
   This opens a diff viewer in your browser. Review changes and click "Approve" to update baselines.

3. **Commit updated baselines:**
   ```bash
   git add .loki/reference/
   git commit -m "test: update visual baselines"
   ```

**Troubleshooting:**

- **"Docker not found"**: Install Docker Desktop and ensure it's running
- **"Reference not found"**: Run `npm run loki:update` to generate baselines
- **"Port 6006 in use"**: Stop existing Storybook server or change Loki port in config
```

#### Subtask 7.2: Update `USER_STORIES.md`

**Find:**
```markdown
# Visual regression testing
npm run chromatic
```

**Replace with:**
```markdown
# Visual regression testing
npm run visual-test
```

Update Testing Strategy section:

**Find:**
```markdown
- **Visual Regression:** Chromatic (screenshot tests per variant)
```

**Replace with:**
```markdown
- **Visual Regression:** Loki (screenshot tests per variant, Docker-based)
```

#### Subtask 7.3: Create `VISUAL_TESTING.md` guide

Create new file documenting visual testing workflow:

**File:** `docs/VISUAL_TESTING.md` (or `.github/VISUAL_TESTING.md`)

**Contents:**
```markdown
# Visual Regression Testing with Loki

## Overview

This project uses Loki for automated visual regression testing. Loki captures screenshots of Storybook stories and compares them to baseline images to detect unintended visual changes.

## Setup (One-time)

1. **Install Docker Desktop:**
   - macOS: https://www.docker.com/products/docker-desktop
   - Verify: `docker --version`

2. **Install Git LFS:**
   ```bash
   brew install git-lfs
   git lfs install
   ```

3. **Pull Chrome Docker image:**
   ```bash
   docker pull yukinying/chrome-headless-browser:115.0.5763.0
   ```

## Daily Workflow

### Before Committing Component Changes

```bash
# 1. Build Storybook with your changes
npm run build-storybook

# 2. Run visual tests
npm run loki:test
```

**If tests PASS:** ✅ No visual changes detected. Safe to commit.

**If tests FAIL:** ⚠️ Visual changes detected. Review them:

```bash
npm run loki:approve
```

This opens a diff viewer showing:
- **Baseline** (expected)
- **Current** (your changes)
- **Diff** (highlighted differences)

**Options:**
- **Approve:** If changes are intentional, click "Approve" to update baselines
- **Reject:** If changes are bugs, fix your code and re-test

### After Approving Changes

```bash
# Commit updated baselines with your component changes
git add .loki/reference/ src/components/
git commit -m "feat: update Button hover state

- Changed hover background color
- Updated visual baselines"
```

## Understanding Test Results

### Test Output Format

```
Running visual regression tests...
✓ components-alert--info
✓ components-alert--success
✗ components-button--primary (1 difference)
✓ components-button--secondary
...

Summary: 94 passed, 1 failed
```

### What Causes Test Failures?

**Intentional changes (expected failures):**
- Updated component styles (colors, spacing, borders)
- New props that change appearance
- Typography or font changes

**Unintentional changes (bugs):**
- CSS specificity conflicts
- Missing vendor prefixes (browser rendering differences)
- Z-index issues causing overlapping elements
- Responsive breakpoint shifts

### Tolerance Threshold

Loki is configured with 0.1% tolerance (`chromeTolerance: 0.1`) to handle:
- Anti-aliasing variations
- Sub-pixel rendering differences
- Browser font hinting differences

If tests fail due to minor anti-aliasing (< 0.1% pixels changed), increase tolerance in `package.json`:

```json
{
  "loki": {
    "chromeTolerance": 0.3
  }
}
```

## CI/CD Integration

(Future work: OneDev pipeline configuration)

Visual tests should run on every PR:

```yaml
# .onedev/ci.yml (example)
visual-regression:
  image: node:20
  services:
    - docker:dind
  script:
    - npm ci
    - npm run visual-test
```

## Troubleshooting

### "Error: Docker not found"

**Solution:** Start Docker Desktop application.

```bash
# Verify Docker is running
docker ps
```

### "Error: Reference not found for story X"

**Cause:** Missing baseline screenshot for a new story.

**Solution:** Generate baselines:

```bash
npm run loki:update
git add .loki/reference/
git commit -m "test: add baselines for new stories"
```

### "Error: Port 6006 already in use"

**Cause:** Storybook dev server running.

**Solution:** Stop dev server or configure Loki to use different port:

```json
{
  "loki": {
    "chromeLoadTimeout": 30000,
    "port": 6007
  }
}
```

### Baselines out of sync after merging branches

**Cause:** Parallel development updated same component baselines differently.

**Solution:** Regenerate baselines on merged branch:

```bash
git checkout main
git pull
npm run loki:update
git add .loki/reference/
git commit -m "test: regenerate baselines after merge"
```

## Best Practices

### ✅ DO:
- Run visual tests before committing component changes
- Review diff images carefully before approving
- Commit updated baselines with related code changes (atomic commits)
- Add new stories for new component states/variants
- Keep Docker image version pinned for reproducibility

### ❌ DON'T:
- Approve baselines without reviewing changes
- Commit baselines separately from code changes
- Upgrade Chrome Docker image without team discussion
- Ignore test failures ("I'll fix it later")
- Generate baselines on different machines (use CI/CD for consistency)

## Configuration Reference

**File:** `package.json`

```json
{
  "loki": {
    "configurations": {
      "chrome.laptop": {
        "target": "chrome.docker",
        "width": 1366,
        "height": 768
      }
    },
    "chromeDockerImage": "yukinying/chrome-headless-browser:115.0.5763.0",
    "diffingEngine": "pixelmatch",
    "chromeTolerance": 0.1,
    "chromeLoadTimeout": 30000,
    "chromeSelector": "#storybook-root"
  }
}
```

**Options:**
- `width/height`: Viewport size for screenshots
- `chromeDockerImage`: Pinned Chrome version (prevents rendering changes)
- `diffingEngine`: Comparison algorithm (`pixelmatch` or `looks-same`)
- `chromeTolerance`: Acceptable pixel difference (0-1, default 0)
- `chromeLoadTimeout`: Wait time for story rendering (ms)
- `chromeSelector`: Element to screenshot (default: entire viewport)

## Resources

- [Loki Documentation](https://loki.js.org/)
- [Git LFS Documentation](https://git-lfs.github.com/)
- [Storybook + Loki Tutorial](https://storybook.js.org/blog/visual-testing-with-storybook/)
```

**Acceptance Criteria:**
- [ ] `README.md` updated with Loki commands and workflow
- [ ] `USER_STORIES.md` Chromatic references replaced with Loki
- [ ] `VISUAL_TESTING.md` guide created with comprehensive documentation
- [ ] Docker and Git LFS requirements documented
- [ ] Troubleshooting section covers common issues

---

### Task 8: Validation Testing

**Duration:** 20 minutes

Final end-to-end validation of complete workflow.

#### Subtask 8.1: Clean state test

```bash
# Remove current/difference directories
rm -rf .loki/current .loki/difference

# Run fresh tests
npm run visual-test
```

**Expected:** All 95 stories pass (green checkmarks).

#### Subtask 8.2: Change detection test

```bash
# Make small CSS change
# Edit src/components/Badge.tsx - change padding

# Rebuild and test
npm run build-storybook
npm run loki:test
```

**Expected:** Badge stories fail with diff images generated.

#### Subtask 8.3: Approval workflow test

```bash
# Open diff viewer
npm run loki:approve

# Approve changes in browser
# Verify .loki/reference/ files updated
```

#### Subtask 8.4: Revert and final test

```bash
# Revert Badge change
git checkout src/components/Badge.tsx

# Final validation
npm run visual-test
```

**Expected:** All tests pass, clean state restored.

**Acceptance Criteria:**
- [ ] Fresh test run passes all 95 stories
- [ ] Intentional change detected by Loki
- [ ] Diff viewer opens and functions correctly
- [ ] Approval updates baseline correctly
- [ ] Tests pass after reverting change
- [ ] No leftover temporary files

---

### Task 9: Final Cleanup and Commit

**Duration:** 15 minutes

Commit all Loki infrastructure and documentation.

#### Subtask 9.1: Review changes

```bash
git status
git diff package.json
```

**Expected files:**
- Modified: `package.json` (Loki config + scripts)
- Modified: `README.md` (updated commands)
- Modified: `USER_STORIES.md` (Loki references)
- Added: `.gitattributes` (Git LFS config)
- Modified: `.gitignore` (Loki temp directories)
- Added: `docs/VISUAL_TESTING.md` (guide)
- Added: `.loki/reference/*.png` (95 baseline screenshots via LFS)

#### Subtask 9.2: Run final checks

```bash
# Ensure all tests pass
npm run test

# Ensure visual tests pass
npm run visual-test

# Ensure no linting errors
npm run lint
```

#### Subtask 9.3: Commit implementation

```bash
git add .
git commit -m "feat(DS-1003): implement Loki visual regression testing

- Install loki and @loki/test-runner-storybook
- Configure Git LFS for screenshot storage
- Generate baselines for all 95 stories across 10 components
- Add npm scripts: loki:test, loki:update, loki:approve, visual-test
- Update documentation (README, USER_STORIES, VISUAL_TESTING guide)
- Configure Loki with desktop viewport (1366x768)
- Pin Chrome Docker image for reproducibility

Baselines stored in .loki/reference/ via Git LFS.
Total screenshot size: ~1-2 MB (compressed to ~10 KB in Git via LFS).

Completes DS-1003: Storybook Documentation story.
Visual regression testing now available as self-hosted alternative to Chromatic."
```

**Acceptance Criteria:**
- [ ] All changes staged and committed
- [ ] Commit message follows conventional commits format
- [ ] All tests passing (unit + visual)
- [ ] No linting errors
- [ ] Branch ready for review

---

## Success Criteria

DS-1003 is complete when:

### Functional Requirements
- [x] Story files exist for all 10 components (95 stories) - **ALREADY COMPLETE**
- [x] Component props documented via argTypes - **ALREADY COMPLETE**
- [x] Interactive controls functional - **ALREADY COMPLETE**
- [x] a11y addon configured - **ALREADY COMPLETE**
- [ ] Visual regression testing infrastructure operational
- [ ] Baseline screenshots generated and committed
- [ ] Visual test workflow documented

### Technical Requirements
- [ ] Loki installed and configured
- [ ] Git LFS tracking screenshot files
- [ ] Docker Chrome image available
- [ ] npm scripts functional (`visual-test`, `loki:test`, `loki:update`, `loki:approve`)
- [ ] Baselines committed to Git via LFS
- [ ] All 95 stories have baseline screenshots

### Documentation Requirements
- [ ] README.md updated with Loki commands
- [ ] USER_STORIES.md references Loki instead of Chromatic
- [ ] VISUAL_TESTING.md guide created
- [ ] Docker and Git LFS prerequisites documented
- [ ] Troubleshooting guide available

### Validation Requirements
- [ ] `npm run visual-test` executes successfully
- [ ] All 95 stories pass visual regression tests
- [ ] Deliberate change detection verified (change → detect → approve workflow)
- [ ] Unit tests still passing (no regressions)
- [ ] ESLint passing (no new warnings)

---

## Timeline Estimate

| Task | Duration | Cumulative |
|------|----------|------------|
| Task 1: Install Dependencies | 15 min | 15 min |
| Task 2: Configure Loki | 30 min | 45 min |
| Task 3: Configure Git LFS | 20 min | 1h 5m |
| Task 4: Verify Docker | 20 min | 1h 25m |
| Task 5: Generate Baselines | 45 min | 2h 10m |
| Task 6: Test Workflow | 30 min | 2h 40m |
| Task 7: Update Documentation | 30 min | 3h 10m |
| Task 8: Validation Testing | 20 min | 3h 30m |
| Task 9: Final Commit | 15 min | 3h 45m |

**Total: 3-4 hours** (including Docker download time ~10-15 min)

---

## Risk Assessment

### Low Risk
- **Loki stability**: Mature project (5+ years), 3.4k GitHub stars, active maintenance
- **Docker availability**: Standard tool, already required for many dev workflows
- **Git LFS compatibility**: Widely supported (GitHub, GitLab, OneDev, Bitbucket)

### Medium Risk
- **Team Docker adoption**: Developers may not have Docker installed
  - **Mitigation**: Add clear setup instructions, offer pairing sessions
- **Screenshot size**: 1-2 MB may concern some developers
  - **Mitigation**: Git LFS makes this transparent (repo size increase ~10 KB)
- **Baseline merge conflicts**: Parallel development could conflict
  - **Mitigation**: Document resolution process, regenerate baselines on conflicts

### Negligible Risk
- **Performance**: Loki is fast (~5-8 minutes for 95 stories, cacheable in CI/CD)
- **Maintenance**: No external dependencies to maintain (self-hosted)
- **Compatibility**: Storybook 7.x fully supported by Loki

---

## Rollback Plan

If Loki implementation fails or causes issues:

1. **Remove Loki packages:**
   ```bash
   npm uninstall loki @loki/test-runner-storybook
   ```

2. **Remove Git LFS tracking:**
   ```bash
   git lfs untrack ".loki/reference/**/*.png"
   git rm -r .loki/
   ```

3. **Revert documentation:**
   ```bash
   git checkout HEAD~1 README.md USER_STORIES.md
   ```

4. **Remove scripts from package.json:**
   ```bash
   # Manually remove loki config and scripts
   ```

5. **Mark DS-1003 as blocked:**
   - Document Chromatic funding requirement
   - Defer visual regression to future sprint
   - Mark stories as "complete" (DS-1003.1), visual regression as "deferred" (DS-1003.2)

---

## Post-Implementation

### Immediate Next Steps (after DS-1003 merge)
1. Train team on Loki workflow (30-minute session)
2. Add Loki to CI/CD pipeline (OneDev integration)
3. Document baseline regeneration process for Chrome updates

### Future Enhancements (DS-1006?)
- Add tablet viewport configuration (`chrome.tablet`)
- Add mobile viewport configuration (`chrome.mobile`)
- Integrate with OneDev PR checks (auto-comment with diff images)
- Explore Loki parallel execution (--workers flag) for faster tests

---

## Approval Gate

**This plan requires approval before execution (PLAN → EXECUTE transition).**

Please review and confirm:
1. ✅ Loki + Git storage approach acceptable
2. ✅ Git LFS requirement acceptable (no concerns about LFS limits)
3. ✅ Docker requirement acceptable for all developers
4. ✅ 3-4 hour implementation timeline acceptable
5. ✅ No additional concerns or questions

**Reply with approval to proceed to EXECUTE mode.**
