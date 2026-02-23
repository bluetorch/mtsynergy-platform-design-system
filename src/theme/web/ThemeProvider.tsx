/**
 * ThemeProvider component for web theming
 * Provides theme context, persistence, and system preference support
 */

import React, { useEffect, useState, ReactNode } from 'react';
import { ThemePreference, ResolvedTheme } from '../types';
import { applyThemeToDom } from './applyThemeToDom';
import { ThemeContext } from './context';
import { ThemeContextValue } from './types';

interface ThemeProviderProps {
  children: ReactNode;
  /** Storage key for persisting theme preference (default: 'mts-theme') */
  storageKey?: string;
  /** Initial theme preference if no stored value found (default: 'system') */
  defaultPreference?: ThemePreference;
}

/**
 * ThemeProvider component
 * Wraps your app to provide theme context
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <YourApp />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  storageKey = 'mts-theme',
  defaultPreference = 'system',
}: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(defaultPreference);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [isClient, setIsClient] = useState(false);

  // Resolve theme based on preference
  const resolveTheme = (pref: ThemePreference): ResolvedTheme => {
    if (pref === 'dark') {
      return 'dark';
    }
    if (pref === 'light') {
      return 'light';
    }
    // 'system': use system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // SSR fallback
  };

  // Initialize on client
  useEffect(() => {
    setIsClient(true);

    // Load stored preference
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
      } else {
        // Use default if nothing stored
        setPreferenceState(defaultPreference);
      }
    }
  }, [storageKey, defaultPreference]);

  // Resolve and apply theme when preference changes
  useEffect(() => {
    if (!isClient) return;

    const resolved = resolveTheme(preference);
    setResolvedTheme(resolved);
    applyThemeToDom(resolved);
  }, [preference, isClient]);

  // Listen for system preference changes when preference is 'system'
  useEffect(() => {
    if (!isClient || preference !== 'system' || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      setResolvedTheme((mediaQuery.matches ? 'dark' : 'light') as ResolvedTheme);
      applyThemeToDom(mediaQuery.matches ? 'dark' : 'light');
    };

    // Modern listener API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [preference, isClient]);

  // Handle preference changes
  const setPreference = (newPreference: ThemePreference) => {
    setPreferenceState(newPreference);

    // Persist to localStorage
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (newPreference === defaultPreference) {
        // Remove from storage if setting to default
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, newPreference);
      }
    }
  };

  const value: ThemeContextValue = {
    preference,
    resolvedTheme,
    setPreference,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
