import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import tokens from src/tokens
import { colors, spacing, typography, shadows, breakpoints, borderRadius, zIndex } from '../src/tokens/index';
// Import theme definitions for dark mode overrides
import { darkThemeOverrides } from '../src/theme/index';

/**
 * Convert hex color to RGB channels (e.g., "#0066CC" -> "0 102 204")
 */
function hexToRgbChannels(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Convert pixels to rem (16px = 1rem)
 */
function pxToRem(px: number): string {
  return `${px / 16}rem`;
}

/**
 * Convert spacing scale (pixels) to Tailwind format (rem)
 */
function transformSpacing() {
  const spacing_rem: Record<string, string> = {};
  for (const [key, value] of Object.entries(spacing)) {
    spacing_rem[key] = pxToRem(value);
  }
  return spacing_rem;
}

/**
 * Convert fontSize scale (pixels) to Tailwind format (rem with lineHeight)
 */
function transformFontSize() {
  const fontSize_rem: Record<string, [string, { lineHeight: string }]> = {};
  for (const [key, value] of Object.entries(typography.fontSize)) {
    fontSize_rem[key] = [pxToRem(value), { lineHeight: '1.5' }];
  }
  return fontSize_rem;
}

/**
 * Convert breakpoints to Tailwind format (px strings)
 */
function transformBreakpoints() {
  const bp: Record<string, string> = {};
  for (const [key, value] of Object.entries(breakpoints)) {
    bp[key] = `${value}px`;
  }
  return bp;
}

/**
 * Convert borderRadius to Tailwind format (rem strings)
 */
function transformBorderRadius() {
  const br: Record<string, string> = {};
  for (const [key, value] of Object.entries(borderRadius)) {
    if (key === 'full') {
      br[key] = '9999px';
    } else {
      br[key] = pxToRem(value);
    }
  }
  return br;
}

/**
 * Extract web shadows for Tailwind config
 */
function transformShadows() {
  const shadow_map: Record<string, string> = {};
  for (const [key, value] of Object.entries(shadows)) {
    shadow_map[key] = value.web;
  }
  return shadow_map;
}

/**
 * Generate CSS variables file with RGB channels for colors
 * Outputs light variables in :root
 * Outputs dark mode overrides under html[data-mts-theme="dark"]
 */
export function generateCssVariables(): string {
  const cssLines: string[] = [];
  
  // Light theme variables in :root
  cssLines.push(':root {');
  Object.entries(colors).forEach(([paletteName, shades]) => {
    Object.entries(shades).forEach(([shade, hex]) => {
      const channels = hexToRgbChannels(hex as string);
      cssLines.push(`  --color-${paletteName}-${shade}: ${channels};`);
    });
  });
  cssLines.push('}');
  
  // Dark theme overrides (only colors that differ from light)
  cssLines.push('');
  cssLines.push('html[data-mts-theme="dark"] {');
  if (darkThemeOverrides.colors) {
    Object.entries(darkThemeOverrides.colors).forEach(([paletteName, overrideShades]) => {
      if (overrideShades) {
        Object.entries(overrideShades).forEach(([shade, hex]) => {
          const channels = hexToRgbChannels(hex as string);
          cssLines.push(`  --color-${paletteName}-${shade}: ${channels};`);
        });
      }
    });
  }
  cssLines.push('}');
  
  // Optional: System preference fallback (when no JS-set data-mts-theme attribute)
  cssLines.push('');
  cssLines.push('@media (prefers-color-scheme: dark) {');
  cssLines.push('  html:not([data-mts-theme]) {');
  if (darkThemeOverrides.colors) {
    Object.entries(darkThemeOverrides.colors).forEach(([paletteName, overrideShades]) => {
      if (overrideShades) {
        Object.entries(overrideShades).forEach(([shade, hex]) => {
          const channels = hexToRgbChannels(hex as string);
          cssLines.push(`    --color-${paletteName}-${shade}: ${channels};`);
        });
      }
    });
  }
  cssLines.push('  }');
  cssLines.push('}');
  
  return cssLines.join('\n');
}

/**
 * Generate Tailwind preset with variables-based colors
 */
export function generateTailwindPreset(): string {
  // Build colors object with variable references for opacity support
  const colorObj: Record<string, any> = {};
  
  Object.entries(colors).forEach(([paletteName, shades]) => {
    colorObj[paletteName] = {};
    Object.entries(shades).forEach(([shade]) => {
      // Use rgb(var(...) / <alpha-value>) syntax for opacity support
      colorObj[paletteName][shade] = `rgb(var(--color-${paletteName}-${shade}) / <alpha-value>)`;
    });
  });

  const spacing_rem = transformSpacing();
  const fontSize_rem = transformFontSize();
  const bp = transformBreakpoints();
  const br = transformBorderRadius();
  const shadow_map = transformShadows();
  const zIndex_str: Record<string, string> = Object.fromEntries(
    Object.entries(zIndex).map(([key, value]) => [key, String(value)])
  );

  const preset = `// AUTO-GENERATED from src/tokens - DO NOT EDIT MANUALLY
// To modify tokens, edit files in src/tokens/ and run: npm run build:tokens

import type { Config } from 'tailwindcss';

const extend = {
  colors: ${JSON.stringify(colorObj, null, 6)},
  spacing: ${JSON.stringify(spacing_rem, null, 6)},
  fontSize: ${JSON.stringify(fontSize_rem, null, 6)},
  fontFamily: {
    sans: ${JSON.stringify(typography.fontFamily.sans)},
  },
  fontWeight: ${JSON.stringify(typography.fontWeight, null, 6)},
  boxShadow: ${JSON.stringify(shadow_map, null, 6)},
  screens: ${JSON.stringify(bp, null, 6)},
  borderRadius: ${JSON.stringify(br, null, 6)},
  zIndex: ${JSON.stringify(zIndex_str, null, 6)},
} satisfies NonNullable<Config['theme']>['extend'];

const preset: Config = {
  content: [],
  theme: {
    extend,
  },
  plugins: [],
};

export default preset;
`;

  return preset;
}

/**
 * Generate Tailwind config as a string
 */
export function generateTailwindConfig(): string {
  const spacing_rem = transformSpacing();
  const fontSize_rem = transformFontSize();
  const bp = transformBreakpoints();
  const br = transformBorderRadius();
  const shadow_map = transformShadows();

  const config = `// AUTO-GENERATED from src/tokens - DO NOT EDIT MANUALLY
// To modify tokens, edit files in src/tokens/ and run: npm run build:tokens

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 6)},
      spacing: ${JSON.stringify(spacing_rem, null, 6)},
      fontSize: ${JSON.stringify(fontSize_rem, null, 6)},
      fontFamily: {
        sans: ${JSON.stringify(typography.fontFamily.sans)},
      },
      fontWeight: ${JSON.stringify(typography.fontWeight, null, 6)},
      boxShadow: ${JSON.stringify(shadow_map, null, 6)},
      breakpoints: ${JSON.stringify(bp, null, 6)},
      borderRadius: ${JSON.stringify(br, null, 6)},
      zIndex: ${JSON.stringify(zIndex, null, 6)},
    },
  },
  plugins: [],
};
`;

  return config;
}

/**
 * Generate flattened token JSON for tooling
 */
export function generateTokensJSON() {
  return {
    colors,
    spacing,
    typography,
    shadows: Object.entries(shadows).reduce((acc, [key, val]) => {
      acc[key] = {
        web: val.web,
        rn: val.rn,
      };
      return acc;
    }, {} as Record<string, any>),
    breakpoints,
    borderRadius,
    zIndex,
  };
}

/**
 * Main generation function
 */
export function generateAll() {
  const projectRoot = path.resolve(__dirname, '..');

  // Generate CSS variables file
  const cssVariables = generateCssVariables();
  const stylesDir = path.join(projectRoot, 'src', 'styles');
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir, { recursive: true });
  }
  const variablesPath = path.join(stylesDir, 'variables.css');
  fs.writeFileSync(variablesPath, cssVariables, 'utf-8');
  console.log(`✓ Generated ${variablesPath}`);

  // Generate Tailwind preset
  const preset = generateTailwindPreset();
  const presetPath = path.join(projectRoot, 'src', 'tailwind.preset.ts');
  fs.writeFileSync(presetPath, preset, 'utf-8');
  console.log(`✓ Generated ${presetPath}`);

  // Generate Tailwind config (for local development)
  const tailwindConfig = generateTailwindConfig();
  const tailwindPath = path.join(projectRoot, 'tailwind.config.js');
  fs.writeFileSync(tailwindPath, tailwindConfig, 'utf-8');
  console.log(`✓ Generated ${tailwindPath}`);

  // Generate tokens.json
  const tokensJSON = generateTokensJSON();
  const distDir = path.join(projectRoot, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  const tokensJsonPath = path.join(distDir, 'tokens.json');
  fs.writeFileSync(tokensJsonPath, JSON.stringify(tokensJSON, null, 2), 'utf-8');
  console.log(`✓ Generated ${tokensJsonPath}`);

  console.log('\n✓ Token generation complete');
}
