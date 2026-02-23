/**
 * useTheme hook for web theming
 * Provides theme preference, resolved theme, and setter
 * Handles persistence and system preference listening
 */

import { useContext } from 'react';
import { ThemeContext } from './context';

/**
 * Hook to access the theme context
 * Must be used within a ThemeProvider
 *
 * @returns Object with:
 *   - preference: Current theme preference ('system', 'light', or 'dark')
 *   - resolvedTheme: Actual resolved theme ('light' or 'dark')
 *   - setPreference: Function to update the preference
 *
 * @throws Error if used outside ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
