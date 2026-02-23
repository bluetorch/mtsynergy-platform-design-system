/**
 * Theme type definitions for cross-platform use (Web + React Native)
 */

import {
  ColorPalette,
  SpacingScale,
  Typography,
  Shadows,
  Breakpoints,
  BorderRadius,
  ZIndex,
} from '../tokens/types';

export interface Theme {
  colors: ColorPalette;
  typography: Typography;
  spacing: SpacingScale;
  shadows: Shadows;
  borderRadius: BorderRadius;
  zIndex: ZIndex;
  breakpoints: Breakpoints;
}

/**
 * DeepPartial allows any nested property of Theme to be optional
 * Used for dark theme overrides that only specify what differs from light base
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};

export type ThemeOverrides = DeepPartial<Theme>;

/**
 * Theme preference state for web theming
 */
export type ThemePreference = 'system' | 'light' | 'dark';

/**
 * Resolved theme (always either 'light' or 'dark', never 'system')
 */
export type ResolvedTheme = 'light' | 'dark';
