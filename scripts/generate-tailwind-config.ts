import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import tokens from src/tokens
import { colors, spacing, typography, shadows, breakpoints, borderRadius, zIndex } from '../src/tokens/index';

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
  prefix: "mts-",
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

  // Generate Tailwind config
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
