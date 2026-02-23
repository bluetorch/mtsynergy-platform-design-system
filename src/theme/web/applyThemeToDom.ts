/**
 * DOM utility for applying theme
 * Sets the data-mts-theme attribute on the html element
 */

import { ResolvedTheme } from '../types';

/**
 * Apply theme to DOM by setting data-mts-theme attribute
 * @param theme - The resolved theme ('light' or 'dark')
 */
export function applyThemeToDom(theme: ResolvedTheme): void {
  if (typeof window === 'undefined') {
    return; // SSR-safe
  }

  const htmlElement = document.documentElement;

  // For light theme, remove attribute to use :root (light base)
  // For dark theme, set attribute to enable dark overrides
  if (theme === 'dark') {
    htmlElement.setAttribute('data-mts-theme', 'dark');
  } else {
    htmlElement.removeAttribute('data-mts-theme');
  }
}

/**
 * Get the current theme from DOM
 */
export function getThemeFromDom(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light'; // SSR-safe default
  }

  const htmlElement = document.documentElement;
  const themeAttr = htmlElement.getAttribute('data-mts-theme');

  return themeAttr === 'dark' ? 'dark' : 'light';
}
