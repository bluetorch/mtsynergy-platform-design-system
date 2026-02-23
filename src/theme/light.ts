/**
 * Light theme definition (base theme)
 * Uses existing design tokens as the canonical light mode
 */

import { tokens } from '../tokens';
import { Theme } from './types';

export const lightTheme: Theme = {
  colors: tokens.colors,
  typography: tokens.typography,
  spacing: tokens.spacing,
  shadows: tokens.shadows,
  borderRadius: tokens.borderRadius,
  zIndex: tokens.zIndex,
  breakpoints: tokens.breakpoints,
};
