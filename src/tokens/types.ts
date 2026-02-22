// TypeScript interfaces for design tokens

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  500: string;
  600: string;
  700: string;
  900: string;
}

export interface ColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  danger: ColorScale;
  info: ColorScale;
}

export interface SpacingScale {
  [key: number]: number;
}

export interface Typography {
  fontFamily: {
    sans: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface ShadowRN {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ShadowDefinition {
  web: string;
  rn: ShadowRN;
}

export interface Shadows {
  sm: ShadowDefinition;
  md: ShadowDefinition;
  lg: ShadowDefinition;
  xl: ShadowDefinition;
  '2xl': ShadowDefinition;
}

export interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

export interface BorderRadius {
  none: number;
  sm: number;
  DEFAULT: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  full: number;
}

export interface ZIndex {
  base: number;
  dropdown: number;
  sticky: number;
  fixed: number;
  modalBackdrop: number;
  modal: number;
  popover: number;
  tooltip: number;
}

export interface DesignTokens {
  colors: ColorPalette;
  spacing: SpacingScale;
  typography: Typography;
  shadows: Shadows;
  breakpoints: Breakpoints;
  borderRadius: BorderRadius;
  zIndex: ZIndex;
}
