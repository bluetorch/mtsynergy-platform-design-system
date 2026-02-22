# Design Tokens

TypeScript design tokens for the MTSynergy platform. All design values are centralized here and exported for both web (React) and mobile (React Native) consumption.

## Overview

Design tokens define the visual language of MTSynergy:
- **Colors**: Semantic color palette (primary, secondary, success, warning, danger, info)
- **Spacing**: Consistent spacing scale (4px, 8px, 16px, ...)
- **Typography**: Font families, sizes, weights
- **Shadows**: Elevation shadows for UI depth
- **Breakpoints**: Responsive design breakpoints
- **Border Radius**: Corner rounding scale
- **Z-Index**: Layer stacking order for components

All tokens are platform-agnostic and work on web and React Native.

## Installation

Tokens are included in the main package:

```bash
npm install @mtsynergy/platform-design-system
```

## Usage

### Import All Tokens

```typescript
import { tokens } from '@mtsynergy/platform-design-system/tokens';

// Access any token category
const primaryColor = tokens.colors.primary[500];      // '#0066CC'
const spacingUnit = tokens.spacing[4];                // 16 (pixels)
const fontSize = tokens.typography.fontSize.base;    // 16 (pixels)
```

### Import Specific Categories

```typescript
import { colors, spacing, typography, shadows, breakpoints, borderRadius, zIndex } 
  from '@mtsynergy/platform-design-system/tokens';

// Use individual tokens
const bgColor = colors.primary[500];
const padding = spacing[4];
```

### Import JSON (for tooling)

```typescript
import tokens from '@mtsynergy/platform-design-system/tokens.json';

const colorPalette = tokens.colors;
```

## Token Categories

### Colors

Semantic color palette with 8 shades per color (50, 100, 200, 300, 500, 600, 700, 900):
- Lighter shades (50–300): UI backgrounds, hover states
- Core shade (500): Primary component color
- Darker shades (600–900): Borders, text, focus states

**Available Colors:**
- `primary` (#0066CC) – Primary brand color
- `secondary` (neutral gray) – Secondary, muted UI
- `success` (green) – Positive, valid states
- `warning` (amber) – Alert, caution states
- `danger` (red) – Error, destructive states
- `info` (blue) – Informational messages

**Usage Examples:**

```typescript
// Web: inline style
<div style={{ color: colors.primary[500] }}>Text</div>

// Web: Tailwind class (config uses tokens)
<div className="mts-text-primary-500">Text</div>

// React Native: StyleSheet
const styles = StyleSheet.create({
  text: { color: colors.primary[500] }
});
```

### Spacing

Spacing scale in pixels (base unit = 4px):

| Token | Value | Use Case |
|-------|-------|----------|
| 0 | 0px | Remove spacing |
| 1 | 4px | Minimal gap (borders, lines) |
| 2 | 8px | Tight spacing (inline elements) |
| 4 | 16px | **Standard padding/margin** |
| 6 | 24px | Comfortable spacing |
| 8 | 32px | Larger component gaps |
| 12 | 48px | Section spacing |
| 16 | 64px | Major layout spacing |

**Conversion:**
- Web: Divide by 16 for rem (16px = 1rem)
- React Native: Use directly as dp (16 pixels/points)

**Usage Examples:**

```typescript
// Web: Computed style
const padding = `${spacing[4] / 16}rem`; // "1rem"

// Web: Tailwind (automatic conversion)
<div className="mts-p-4">Padded</div>

// React Native: Direct value
const styles = StyleSheet.create({
  container: { padding: spacing[4] } // 16dp
});
```

### Typography

Define font families, sizes, and weights.

**Font Family:**
```typescript
typography.fontFamily.sans // 'Inter, system-ui, ...'
```

**Font Sizes (in pixels):**
| Token | Size | Use |
|-------|------|-----|
| xs | 12px | Fine print, captions |
| sm | 14px | Body text, labels |
| base | 16px | **Default body** |
| lg | 18px | Subheadings |
| xl | 20px | Headings |
| 2xl | 24px | Section titles |
| 3xl | 30px | Large headings |
| 4xl | 36px | Hero text |

**Font Weights:**
```typescript
fontWeight.normal    // '400'
fontWeight.medium    // '500'
fontWeight.semibold  // '600'
fontWeight.bold      // '700'
```

**Usage Examples:**

```typescript
// Web: Inline style
<h1 style={{
  fontSize: `${typography.fontSize.xl / 16}rem`,
  fontWeight: typography.fontWeight.bold,
  fontFamily: typography.fontFamily.sans
}}>Heading</h1>

// Web: Tailwind
<h1 className="mts-text-xl mts-font-bold">Heading</h1>

// React Native: StyleSheet
const styles = StyleSheet.create({
  heading: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.sans
  }
});
```

### Shadows

Elevation shadows create depth in UI. Each shadow has:
- `web`: CSS box-shadow string (for web/CSS)
- `rn`: React Native shadow object (for mobile)

**Available Shadows:**
- `sm`: Subtle shadow (cards, small elevations)
- `md`: Medium shadow (modals, popovers)
- `lg`: Large shadow (important modals, overlays)
- `xl`: Extra large shadow (hero sections, max emphasis)
- `2xl`: Extreme shadow (rare use)

**Usage Examples:**

```typescript
// Web: Inline style
<div style={{ boxShadow: shadows.md.web }}>Card</div>

// Web: Tailwind
<div className="mts-shadow-md">Card</div>

// React Native: StyleSheet
const styles = StyleSheet.create({
  card: {
    ...shadows.md.rn  // Spread shadow properties
  }
});
```

### Breakpoints

Responsive design breakpoints in pixels:

| Token | Value | Device |
|-------|-------|--------|
| sm | 640px | Small phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

**Usage Examples:**

```typescript
// Web: Media queries
const desktopQuery = `@media (min-width: ${breakpoints.lg}px)`;

// Web: Tailwind classes
<div className="mts-hidden lg:mts-block">Desktop only</div>

// React Native: Responsive component
const windowWidth = Dimensions.get('window').width;
if (windowWidth >= breakpoints.md) {
  // Tablet/desktop layout
}
```

### Border Radius

Corner rounding values in pixels:

| Token | Value | Use |
|-------|-------|-----|
| none | 0px | Sharp corners |
| sm | 2px | Subtle rounding |
| DEFAULT | 4px | **Standard rounding** |
| md | 6px | Slightly rounder |
| lg | 8px | Visible rounding |
| xl | 12px | Prominent rounding |
| 2xl | 16px | Card-style rounding |
| 3xl | 24px | Large component rounding |
| full | 9999px | Pill shape / perfect circle |

**Usage Examples:**

```typescript
// Web: Inline style
<div style={{ borderRadius: `${borderRadius.lg / 16}rem` }}>Rounded</div>

// Web: Tailwind
<div className="mts-rounded-lg">Rounded</div>

// React Native: StyleSheet
const styles = StyleSheet.create({
  button: { borderRadius: borderRadius.lg }
});
```

### Z-Index

Layering order for components (higher = on top):

| Token | Value | Component |
|-------|-------|-----------|
| base | 0 | Default layer |
| dropdown | 1000 | Dropdown menus |
| sticky | 1100 | Sticky headers, footers |
| fixed | 1200 | Fixed positioning |
| modalBackdrop | 1300 | Modal background overlay |
| modal | 1400 | Modal dialog itself |
| popover | 1500 | Popovers, tooltips |
| tooltip | 1600 | Floating tooltips |

**Usage Examples:**

```typescript
// Web: Inline style
<div style={{ zIndex: zIndex.modal }}>Modal</div>

// Web: Tailwind
<div className="mts-z-modal">Modal</div>

// React Native: Note - RN doesn't use z-index, view order defines stacking
// Later components in the tree appear on top
<View>
  <View>Backdrop</View>
  <View>Modal (on top)</View>
</View>
```

## Platform Differences

### Spacing Units

**Web:**
- Tailwind config converts pixels to rem: `16px = 1rem`
- CSS media queries use px breakpoints
- Example: `s pace[4] = 16px = 1rem in web`

**React Native:**
- No unit suffix (unitless = display-independent pixels/points)
- Breakpoints compared directly to `Dimensions.get('window').width`
- Example: `spacing[4] = 16dp in React Native`

### Shadows

**Web:**
- `shadows[key].web` provides CSS box-shadow string
- Works with CSS, Tailwind classes
- Example: `boxShadow: shadows.md.web`

**React Native:**
- `shadows[key].rn` provides shadow object (elevation + shadow properties)
- Used with `...shadowObject` spread operator
- iOS uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
- Android uses elevation property
- Example: `...shadows.md.rn`

### Colors

Colors work identically on both platforms (hex strings).

### Typography

Sizes are pixels on both platforms:
- Web: Convert to rem if needed
- React Native: Use directly as pixel values

## TypeScript Support

All tokens are fully typed for autocomplete:

```typescript
import { tokens, DesignTokens } from '@mtsynergy/platform-design-system/tokens';

// Autocomplete guides you through available options
const color: string = tokens.colors.primary[500]; // Intellisense shows shades
const size: number = tokens.spacing[4];           // Intellisense shows scale
const font: string = tokens.typography.fontFamily.sans;

// Type definitions available
import type { ColorScale, SpacingScale, Typography } 
  from '@mtsynergy/platform-design-system/tokens';
```

## Best Practices

1. **Always use tokens** – Never hardcode colors, spacing, or sizes
2. **Mobile-first** – React Native tokens ensure consistency across platforms
3. **Semantic naming** – Use semantic colors (primary, success, danger) not literal (blue, red)
4. **Breakpoints** – Use predefined breakpoints for responsive design
5. **Z-index hierarchy** – Respect the zIndex scale to avoid layering conflicts
6. **Shadow elevation** – Use shadows to communicate hierarchy and depth

## Extending Tokens

To extend or customize tokens for your project, import and re-export:

```typescript
// project-tokens.ts
import { tokens } from '@mtsynergy/platform-design-system/tokens';

export const customTokens = {
  ...tokens,
  colors: {
    ...tokens.colors,
    // Add custom color if needed
    custom: { 500: '#FF00FF' }
  }
};
```

Alternatively, extend the Tailwind config in web projects:

```javascript
// tailwind.config.js
import { colors, spacing } from '@mtsynergy/platform-design-system/tokens';

export default {
  theme: {
    extend: {
      colors,
      spacing: { /* convert to rem */ }
    }
  }
};
```

## See Also

- [Component Library](../README.md) – React components for web and mobile
- [Tailwind Config](../../tailwind.config.js) – Generated from these tokens
