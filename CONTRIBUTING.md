# Contributing to platform-design-system

## Quality Standards

This is an enterprise-grade project. All contributions must meet the following standards.

### Code Completeness

- **No partial implementations** — every feature is complete or not started
- **No stubs or TODOs** — all code is production-ready
- **No placeholder code** — if it's committed, it works

### Testing Requirements

- **Thorough testing** — cover edge cases, error states, and boundary conditions
- **Not just happy path** — tests should validate failure modes and unexpected inputs
- **All tests must pass** — unrelated failures are fixed, not ignored
- **No test skipping** — `.skip()` or `.only()` is not an acceptable solution
- **Tests are useful** — they catch real bugs, not just inflate coverage metrics

### Code Quality

- **Linting must pass** — ESLint errors are fixed, not disabled
- **Formatting is enforced** — Prettier runs on pre-commit
- **TypeScript strict mode** — no `any` types without explicit justification
- **Accessibility first** — all components meet WCAG 2.1 AA standards

### Pull Request Requirements

1. All CI checks must pass
2. Code review approval required
3. No merge commits in feature branches (rebase only)
4. Commit messages follow conventional commits format

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
- `feat(button): add loading state with spinner`
- `fix(modal): prevent body scroll when open`
- `test(input): add validation error state tests`

## Development Workflow

### Setup

```bash
nvm use              # Use project Node version
npm install          # Install dependencies
npm run storybook    # Start Storybook for development
```

### Before Committing

```bash
npm run lint         # Check for linting errors
npm run format:check # Check formatting
npm run test:run     # Run all tests
npm run build        # Verify build succeeds
```

Pre-commit hooks will automatically run lint-staged (ESLint + Prettier on staged files).

### Running Tests

```bash
npm run test         # Watch mode (development)
npm run test:run     # Single run (CI)
npm run test:coverage # With coverage report
```

## Architecture Decisions

### Tailwind Prefix

All Tailwind classes use the `mts-` prefix to avoid conflicts when consumed by other applications.

### Build Output

- CommonJS: `dist/index.js`
- ESM: `dist/index.mjs`  
- Types: `dist/index.d.ts`

### Publishing

Published to OneDev npm registry on version tags (`v*`). See `.onedev-buildspec.yml` for CI/CD configuration.
