/**
 * Dedicated Tailwind config for compiling DS prefixed CSS
 * This config is ONLY used for building dist/styles.css
 * Prefix: 'mts-', no preflight to avoid global resets
 */

import preset from './src/tailwind.preset.ts';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './src/components/**/*.{ts,tsx}',
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {},
  },
  prefix: 'mts-',
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
