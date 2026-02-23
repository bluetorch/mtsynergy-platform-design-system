/**
 * Theme merge utility for combining base theme with overrides
 */

import { Theme, ThemeOverrides } from './types';

/**
 * Deep merge function that combines base theme with overrides
 * Used to merge lightTheme + darkThemeOverrides
 *
 * @param base - The base theme
 * @param overrides - Partial theme overrides
 * @returns Merged theme with overrides applied
 */
export function mergeTheme(base: Theme, overrides: ThemeOverrides): Theme {
  const result: Theme = JSON.parse(JSON.stringify(base)) as Theme;

  // Deep merge over dynamic keys; internal recursion uses runtime indexing, while inputs/outputs remain constrained by Theme/ThemeOverrides.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergeObject = (target: any, source: any): any => {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (
          sourceValue !== null &&
          typeof sourceValue === 'object' &&
          !Array.isArray(sourceValue) &&
          targetValue !== null &&
          typeof targetValue === 'object' &&
          !Array.isArray(targetValue)
        ) {
          // Recursively merge objects
          target[key] = mergeObject(targetValue, sourceValue);
        } else {
          // Directly assign primitive values or arrays
          target[key] = sourceValue;
        }
      }
    }
    return target;
  };

  return mergeObject(result, overrides);
}

/**
 * Convenience function to get the dark theme by merging light + overrides
 */
export function getDarkTheme(lightTheme: Theme, darkOverrides: ThemeOverrides): Theme {
  return mergeTheme(lightTheme, darkOverrides);
}
