# DS-1002 Design Tokens - Session Log
**Date:** 2026-02-21  
**Branch:** feature/DS-1002  
**Story:** DS-1002-DS - Export Tailwind configuration & design tokens

---

## Session Overview

Researching and planning implementation of design token exports for the platform-design-system library to support both web (React + Tailwind) and mobile (React Native) applications.

---

## RESEARCH Phase

### Current State Analysis

**Existing Token Definitions (tailwind.config.js):**
- ✅ Colors: Primary (#0066CC), secondary, success, warning, danger, info (with 50-900 shades)
- ✅ Typography: Font family (Inter + system fallbacks), font sizes (xs → 4xl), font weights (400→700)
- ✅ Shadows: sm, DEFAULT, md, lg, xl
- ❌ Spacing: Not in extended theme (using Tailwind defaults)
- ❌ Breakpoints: Not in extended theme (using Tailwind defaults)
- ❌ Border radius: Not in extended theme (using Tailwind defaults)
- ❌ Z-index: Not in extended theme

**Export System:**
- Currently only React components exported from src/index.ts
- No design tokens programmatic export exists
- Build uses tsup (generates CJS, ESM, TypeScript declarations)

**Deployment Architecture (from SPECIFICATION.md):**
- Web: Micro Frontends on CloudFlare Workers
- CDN: CloudFlare R2 with import maps
- Mobile: React Native (iOS + Android)
- Shared: TypeScript types, API clients via npm

**Consumer Projects:**
- platform-shell (web)
- platform-mfe-publishing (web)
- platform-mfe-inbox (web)
- platform-mfe-reporting (web)
- Mobile app (React Native - iOS/Android)

### Key Insights

1. **Cross-Platform Requirement**: Tokens must work for both React (web) and React Native (mobile)
2. **Import Map Strategy**: Web consumers use CDN via import maps
3. **Single Source of Truth**: tailwind.config.js currently defines tokens
4. **Missing Token Categories**: Spacing, breakpoints, border radius, z-index need definition

### Questions Clarified

1. **Token Format**: User prefers following SPECIFICATION.md best practices
2. **Organization**: Flat export preferred given small project size
3. **Default Values**: Follow best practices for token definitions
4. **Consumption**: Both programmatic (JS/TS) and Tailwind extending

---

## INNOVATE Phase

### Approaches Explored

#### Approach 1: TypeScript Token Objects with Subpath Exports
- **Pros**: Type-safe, tree-shakeable, idiomatic for TypeScript projects, works with import maps
- **Cons**: Tokens duplicated between Tailwind and TS, requires manual sync
- **Initial Assessment**: Pragmatic for current scope

#### Approach 2: Direct Tailwind Config Export + JSON Generation
- **Pros**: Single source of truth, no sync issues, JSON supports tooling
- **Cons**: Less ergonomic API, deep nesting, includes framework internals
- **Assessment**: Good for avoiding duplication but less developer-friendly

#### Approach 3: CSS Custom Properties + TypeScript Definitions
- **Pros**: Runtime theme switching, browser-native, aligns with DS-1005
- **Cons**: Requires CSS import, not tree-shakeable, **doesn't work with React Native**
- **Assessment**: Not viable given React Native requirement

#### Approach 4: Hybrid Multi-Format Export
- **Pros**: Maximum flexibility, future-proof
- **Cons**: Complex build, larger package, more maintenance
- **Assessment**: Over-engineered for current needs

### Critical Constraint Identified

**React Native Compatibility**: USER pointed out mobile app uses React Native (iOS/Android). This eliminates CSS-based approaches:
- React Native doesn't use CSS
- React Native uses JavaScript StyleSheet API
- Tokens must be JavaScript/TypeScript objects consumable by both platforms

### Revised Approach Considerations

With React Native requirement:
1. **Must use JavaScript/TypeScript tokens** (not CSS variables)
2. **Platform-specific transformations needed**:
   - Web: Tailwind class names (`mts-bg-primary-500`)
   - Mobile: StyleSheet values (`{ backgroundColor: '#0066CC' }`)
3. **Shared token format**: Platform-agnostic token objects that both can consume
4. **Spacing units**: Web uses `rem`, React Native uses unitless numbers (dp)

### Outstanding Questions

1. Should tokens be platform-agnostic (hex colors, pixel values) with platform-specific adapters?
2. How to handle responsive breakpoints in React Native (different paradigm than CSS media queries)?
3. Should we provide pre-transformed tokens for each platform, or raw tokens with utilities?

---

## Next Steps

- [x] Refine approach recommendation considering React Native
- [x] Create detailed implementation plan
- [x] Define token structure that works cross-platform
- [x] Plan build process for token generation
- [ ] Get user approval for plan
- [ ] Execute implementation (EXECUTE mode)

---

## PLAN Phase

**Approach Selected:** Approach 4 - Unified Raw Tokens + Generated Tailwind Config

**Plan Document:** `.github/memory-bank/feature-DS-1002/plans/feature-DS-1002-2026-02-21-design-tokens-export.md`

**Key Decisions:**
1. TypeScript tokens as canonical source (not Tailwind config)
2. Platform-agnostic values (pixels, hex) for web + React Native compatibility
3. Generate Tailwind config from tokens via build script
4. Subpath exports: `@mtsynergy/design-system/tokens`
5. Export both TypeScript objects and JSON file
6. All 7 token categories explicitly defined (spacing, breakpoints, etc.)

**Implementation Strategy:**
- 8 tasks covering token definitions, Tailwind generation, package exports, documentation, testing
- Estimated 6-8 hours of work
- No breaking changes to existing component API
- New devDependency: tsx (for build scripts)

---

## Notes

- DS-1003 (Storybook) already complete as part of DS-1001
- DS-1004 (Tailwind Integration) and DS-1005 (Theming) are future stories
- CSS variables deferred to DS-1005 (may not be needed if React Native takes priority)
- React Native constraint eliminates CSS-based token approaches
- Shadow definitions need platform-specific formats (web CSS string, RN object)
