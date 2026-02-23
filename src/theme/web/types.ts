/**
 * Type definitions for web-only theming
 */

import { ThemePreference, ResolvedTheme } from '../types';

/**
 * Context value for theme provider
 */
export interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}
