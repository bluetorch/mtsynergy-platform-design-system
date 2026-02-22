# Visual Regression Testing with Loki

This project uses [Loki](https://loki.js.org/) for visual regression testing of Storybook stories. Loki captures screenshots of components and compares them with baseline images to detect unintended visual changes.

## Overview

- **Tool:** Loki v0.35.1
- **Storage:** Git LFS for baseline screenshots
- **Browser:** Chrome (local Chrome installation for development, Docker container for CI)
- **Viewport:** 1366x768 (laptop/desktop resolution)
- **Diffing Engine:** pixelmatch with 0.1% tolerance for anti-aliasing
- **Coverage:** 85 baseline screenshots across 10 components

## Prerequisites

- **Chrome Browser:** Loki uses your locally installed Chrome (`/Applications/Google Chrome.app`)
- **Git LFS:** Required for efficient storage of baseline screenshots (installed during setup)
- **Storybook:** All visual tests run against the static Storybook build

## Directory Structure

```
.loki/
├── reference/     # Baseline screenshots (tracked in Git via LFS)
├── current/       # Latest test screenshots (gitignored)
├── difference/    # Diff images when tests fail (gitignored)
└── .cache/        # Loki internal cache (gitignored)
```

## Available Commands

```bash
# Build Storybook static site (required before testing)
npm run build-storybook

# Start HTTP server for Storybook (required for Loki)
# Note: Run this in a separate terminal and keep it running
npm run loki:serve

# Run visual regression tests (compares against baselines)
# Local (uses chrome.app for speed)
npm run loki:test

# CI/CD (uses chrome.docker for consistency)
npm run loki:test:ci

# Update baselines after intentional visual changes
# Local
npm run loki:update

# CI/CD
npm run loki:update:ci

# Approve specific test failures (copies current -> reference)
npm run loki:approve

# Full workflow: Build Storybook + Run Tests (local)
npm run visual-test
```

## Workflow

### 1. Running Tests

```bash
# Terminal 1: Start HTTP server
npm run loki:serve

# Terminal 2: Run tests
npm run loki:test
```

If all tests pass, you'll see:
```
✓ PASS  chrome.app/chrome.laptop/Components/Alert
✓ PASS  chrome.app/chrome.laptop/Components/Badge
...
```

### 2. Handling Visual Differences

When tests fail, Loki generates diff images:

```
✗ FAIL  chrome.app/chrome.laptop/Components/Button
       Primary
       Screenshot differs from reference, see
       .loki/difference/chrome_laptop_Components_Button_Primary.png
```

**Review the diff images** in `.loki/difference/` to determine if changes are:
- **Intentional** (proceed to step 3)
- **Unintended** (fix the code and re-run tests)

### 3. Approving or Updating Baselines

#### Option A: Approve All Changes
```bash
npm run loki:approve
```
This copies all current screenshots to replace the reference baselines.

#### Option B: Update Specific Components
```bash
# Rebuild Storybook with your changes
npm run build-storybook

# Update baselines for all components
npm run loki:update
```

#### Option C: Manual Approval
```bash
# Copy specific screenshot from current to reference
cp .loki/current/chrome_laptop_Components_Button_Primary.png \
   .loki/reference/chrome_laptop_Components_Button_Primary.png

# Commit the updated baseline
git add .loki/reference/chrome_laptop_Components_Button_Primary.png
git commit -m "chore: update Button Primary baseline"
```

### 4. Committing Baseline Changes

Baseline screenshots are stored via Git LFS:

```bash
# Stage updated baselines
git add .loki/reference/

# Commit with descriptive message
git commit -m "chore: update visual baselines for Button redesign"

# Push (Git LFS handles large files automatically)
git push
```

## Configuration

Configuration is defined in `package.json`:

```json
{
  "loki": {
    "configurations": {
      "chrome.laptop": {
        "target": "chrome.app",
        "width": 1366,
        "height": 768
      },
      "chrome.ci": {
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

### Configuration Options

- **configurations:** Defines multiple targets for different environments
  - `chrome.laptop`: Uses `chrome.app` (local Chrome installation) for rapid local testing
  - `chrome.ci`: Uses `chrome.docker` (Docker container) for consistent CI/CD testing
- **width/height:** Desktop viewport size for consistent screenshots
- **chromeDockerImage:** Docker image for CI testing (`yukinying/chrome-headless-browser:latest`)
- **diffingEngine:** `pixelmatch` for pixel-perfect comparison
- **chromeTolerance:** 0.1% tolerance for anti-aliasing differences

## Troubleshooting

### Error: "Failed fetching stories because the server is down"

**Cause:** HTTP server not running or wrong port

**Solution:**
```bash
# Ensure HTTP server is running
npm run loki:serve

# Verify server is accessible
curl http://localhost:6007/iframe.html
```

### Error: "ECONNRESET" or "read ECONNRESET"

**Cause:** Network connectivity issue between Loki and Chrome

**Solution (Local Development):**
1. Stop all Loki processes: `pkill -f loki`
2. Restart HTTP server: `npm run loki:serve`
3. Clear Loki cache: `rm -rf .loki/.cache/`
4. Try again: `npm run loki:test` (uses `chrome.app` by default)

**Note:** If using Docker locally on ARM64 Macs, you may encounter ECONNRESET due to Docker Desktop networking. Use `npm run loki:test` (chrome.app) for local development. The Docker configuration is optimized for CI/CD environments (Linux/amd64).

### Baseline Mismatch After Git Clone

**Cause:** Git LFS not initialized or baselines not downloaded

**Solution:**
```bash
# Initialize Git LFS
git lfs install

# Fetch LFS files
git lfs pull

# Verify baselines exist
ls -lh .loki/reference/ | wc -l  # Should show 85 files
```

### Chrome Not Found

**Cause:** Chrome not installed at expected path

**Solution:**
1. Install Chrome: https://www.google.com/chrome/
2. Verify installation: `ls "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`
3. If using Chromium or different path, update `loki` configuration in `package.json`

### False Positives (Flaky Tests)

**Cause:** Animations, fonts not loaded, or timing issues

**Solution:**
1. Increase tolerance: `"chromeTolerance": 0.2` in `package.json`
2. Add delays in stories if components have animations
3. Ensure fonts are loaded before screenshot (Loki waits for network idle by default)

### Large Diff Images in Repository

**Cause:** Git LFS not configured correctly

**Solution:**
```bash
# Verify Git LFS tracking
git lfs ls-files  # Should show .loki/reference/*.png

# Re-track files if needed
git lfs track ".loki/reference/**/*.png"
git add .gitattributes
git commit -m "chore: ensure Git LFS tracking for Loki baselines"
```

## CI/CD Integration

Loki visual tests run in CI/CD using the Docker-based configuration for consistency across environments.

### Prerequisites for CI

1. **Git LFS:** Required for baseline image storage
2. **Docker:** Required for Chrome Docker image
3. **Node.js:** Same version as local development

### CI Setup

In your CI/CD pipeline, use `npm run loki:test:ci` which targets the `chrome.ci` configuration:

```yaml
- name: Install Git LFS
  run: git lfs install && git lfs pull

- name: Install dependencies
  run: npm ci

- name: Build Storybook
  run: npm run build-storybook

- name: Start HTTP server
  run: npm run loki:serve &

- name: Wait for server
  run: sleep 3

- name: Run visual regression tests (CI)
  run: npm run loki:test:ci

- name: Upload artifacts on failure
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: loki-diffs
    path: .loki/difference/
```

### Local Development vs CI

- **Local (`npm run loki:test`):** Uses `chrome.app` target for speed and ease of use
- **CI (`npm run loki:test:ci`):** Uses `chrome.docker` target for consistency and reproducibility

Both configurations produce identical viewport dimensions (1366x768) and use the same diffing tolerance (0.1%) to ensure visual consistency.

### Baseline Management

Baselines are committed to Git LFS and shared across all environments:

```bash
# Developers update baselines locally
npm run build-storybook
npm run loki:update

# Commit baseline changes
git add .loki/reference/
git commit -m "chore: update visual baselines"

# Push (Git LFS handles large files automatically)
git push

# CI pulls baselines and runs tests
# (see CI Setup section above)
```

## Best Practices

1. **Always rebuild Storybook** before running tests after code changes
2. **Review diff images** carefully before approving changes
3. **Commit baselines separately** from code changes for easier review
4. **Keep HTTP server running** during iterative testing
5. **Update baselines deliberately** - don't approve without review
6. **Test locally** before pushing to CI/CD
7. **Use descriptive commit messages** for baseline updates

## Component Coverage

Current visual regression coverage (85 screenshots):

- **Alert:** 9 variants (success, error, warning, info, dismissible, etc.)
- **Badge:** 9 variants (status colors, sizes, combinations)
- **Button:** 11 variants (sizes, variants, loading, disabled)
- **Card:** 7 variants (padding, shadow options)
- **DatePicker:** 10 variants (basic, constraints, time select, disabled)
- **Dropdown:** 11 variants (single/multiple select, disabled, error states)
- **Input:** 13 variants (text, password, email, disabled, error, success)
- **Modal:** 5 variants (sizes, actions, scrollable content)
- **Spinner:** 5 variants (sizes, colors)
- **Tabs:** 5 variants (default, disabled tabs, many tabs)

## Additional Resources

- [Loki Documentation](https://loki.js.org/)
- [Git LFS Documentation](https://git-lfs.com/)
- [Storybook Documentation](https://storybook.js.org/)
- [Pixelmatch (Diffing Engine)](https://github.com/mapbox/pixelmatch)

## Maintenance

### Updating Baselines After Design Changes

When design tokens or component styles change intentionally:

```bash
# 1. Update design tokens or component code
# 2. Rebuild Storybook
npm run build-storybook

# 3. Update all baselines
npm run loki:update

# 4. Review changes (check file sizes and visual diffs)
git status
git diff .loki/reference/

# 5. Commit with clear explanation
git add .loki/reference/
git commit -m "chore: update visual baselines after color token changes

- Updated primary color from #2563eb to #3b82f6
- Affected components: Button, Badge, Alert
- 25 screenshots updated"
```

### Regenerating All Baselines

If you need to recreate all baselines from scratch:

```bash
# 1. Delete existing baselines
rm -rf .loki/reference/

# 2. Rebuild Storybook
npm run build-storybook

# 3. Generate new baselines
npm run loki:serve  # Terminal 1
npm run loki:update  # Terminal 2

# 4. Verify count
find .loki/reference/ -name "*.png" | wc -l  # Should be 85

# 5. Commit
git add .loki/reference/
git commit -m "chore: regenerate all Loki baselines"
```

---

**Last Updated:** February 22, 2025  
**Loki Version:** 0.35.1  
**Story DS-1003** - Visual Regression Testing Implementation
