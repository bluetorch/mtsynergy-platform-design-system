# Plan: Fix Loki Docker Configuration for CI Support (DS-1003)

**Date:** 2026-02-22
**Branch:** feature/DS-1003
**Story:** DS-1003 - Visual Regression Testing Implementation
**Type:** Bug Fix / Configuration

---

## Problem Statement

The initial implementation of Loki visual regression testing relies on the `chrome.app` target, which uses the locally installed Google Chrome browser on macOS. While this resolves local execution issues on ARM64 Macs, it breaks compatibility with CI/CD environments (Linux) where `chrome.app` is not available.

**Current State:**
- `package.json` configured with single target `chrome.laptop` mapped to `chrome.app`.
- Docker target (`chrome.docker`) was abandoned due to networking (`ECONNRESET`) issues on local ARM64 macOS.
- CI/CD integration is currently impossible without Docker support.

**Desired State:**
- Dual configuration supporting both local (`chrome.app`) and CI (`chrome.docker`) environments.
- Functional Docker-based testing that works in CI (Linux/amd64).
- Clear documentation for running tests in both contexts.

**User Requirements:**
- Enable visual regression testing in CI/CD pipelines.
- Maintain ease of use for local developers (fast execution via `chrome.app`).

---

## Solution Approach

We will implement a multi-target configuration in Loki:

1. **Retain `chrome.laptop`** (using `chrome.app`) for local development speed and reliability.
2. **Add `chrome.ci`** (using `chrome.docker`) for CI environments.
3. **Configure Docker Image:** Explicitly set the Docker image for the CI target.

**Why This Approach:**
- **Hybrid Strategy:** Best of both worlds—speed locally, consistency in CI.
- **Resilience:** CI environments (Linux) handle Docker networking differently than macOS Docker Desktop, often avoiding the `ECONNRESET` issues seen locally.

**Key Design Decisions:**
1. **Separate npm scripts:** `loki:test` (default local) vs `loki:test:ci` (docker).
2. **Standard Docker Image:** Use `yukinying/chrome-headless-browser:latest` as the default for CI.

---

## Implementation Plan

### Task 1: Update Loki Configuration

**Objective:** Define parallel configurations for local and CI execution.

**Files to Modify:**
- `package.json`

**Changes:**
1. Modify `loki.configurations` object to include both targets:
   ```json
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
   }
   ```
2. Restore `chromeDockerImage` setting: `"chromeDockerImage": "yukinying/chrome-headless-browser:latest"`

**Validation:**
- [ ] Verify `npm run loki:test` still works locally (using `chrome.laptop`).

---

### Task 2: Add CI-Specific Scripts

**Objective:** Enable running tests specifically against the Docker target.

**Files to Modify:**
- `package.json`

**Changes:**
1. Add `loki:test:ci`: `"loki test --configuration=chrome.ci --reactUri http://localhost:6007"`
2. Add `loki:update:ci`: `"loki update --configuration=chrome.ci --reactUri http://localhost:6007"`

**Validation:**
- [ ] Scripts are runnable via `npm run` (even if they fail locally due to Docker issues, the command structure should be valid).

---

### Task 3: Update Documentation

**Objective:** Explain the dual-target strategy and CI setup.

**Files to Modify:**
- `VISUAL_TESTING.md`

**Changes:**
1. Update "Available Commands" section to include `loki:test:ci`.
2. Add "CI/CD Setup" section explaining:
   - Use `npm run loki:test:ci` in CI.
   - Requirements (Docker + Git LFS).
3. Update "Troubleshooting" to mention Docker/CI specifically.

**Validation:**
- [ ] Documentation clearly explains how to set up CI.

---

## Technical Specifications

- **Target `chrome.laptop`:** Uses `chrome.app` (Local Chrome installation).
- **Target `chrome.ci`:** Uses `chrome.docker` with image `yukinying/chrome-headless-browser:latest`.
- **Viewport:** 1366x768 (consistent across both).
- **Diffing Engine:** `pixelmatch` (0.1% tolerance).

---

## Testing Strategy

**Manual Testing:**
- [ ] Run `npm run loki:test` locally -> Should succeed (uses chrome.app).
- [ ] Run `npm run loki:test:ci` locally -> May fail with ECONNRESET (expected on ARM64), but confirms it attempts to use Docker.

---

## Success Criteria

- [ ] `package.json` contains both `chrome.laptop` and `chrome.ci` configurations.
- [ ] New npm scripts `loki:test:ci` and `loki:update:ci` exist.
- [ ] Documentation fully covers CI execution.
- [ ] Local development workflow remains unbroken.
