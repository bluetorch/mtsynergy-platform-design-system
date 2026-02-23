/**
 * Dark theme overrides (only specifies what differs from light theme)
 * Uses inverted color scales and adjusted tones for dark mode
 */

import { ThemeOverrides } from './types';

export const darkThemeOverrides: ThemeOverrides = {
  colors: {
    primary: {
      50: '#001429',
      100: '#003d7a',
      200: '#0052a3',
      300: '#0066CC',
      500: '#66b2ff',
      600: '#99ccff',
      700: '#cce5ff',
      900: '#e6f2ff',
    },
    secondary: {
      50: '#111827',
      100: '#374151',
      200: '#4b5563',
      300: '#6b7280',
      500: '#d1d5db',
      600: '#e5e7eb',
      700: '#f3f4f6',
      900: '#f9fafb',
    },
    success: {
      50: '#064e3b',
      100: '#047857',
      200: '#059669',
      300: '#10b981',
      500: '#6ee7b7',
      600: '#a7f3d0',
      700: '#d1fae5',
      900: '#ecfdf5',
    },
    warning: {
      50: '#78350f',
      100: '#b45309',
      200: '#d97706',
      300: '#f59e0b',
      500: '#fcd34d',
      600: '#fde68a',
      700: '#fef3c7',
      900: '#fffbeb',
    },
    danger: {
      50: '#7f1d1d',
      100: '#b91c1c',
      200: '#dc2626',
      300: '#ef4444',
      500: '#fca5a5',
      600: '#fecaca',
      700: '#fee2e2',
      900: '#fef2f2',
    },
    info: {
      50: '#0c2340',
      100: '#1e40af',
      200: '#2563eb',
      300: '#3b82f6',
      500: '#93c5fd',
      600: '#bfdbfe',
      700: '#dbeafe',
      900: '#eff6ff',
    },
  },
};
