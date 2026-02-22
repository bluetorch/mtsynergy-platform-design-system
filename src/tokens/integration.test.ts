import { describe, it, expect } from 'vitest';
import { colors, spacing, typography, shadows, borderRadius, breakpoints, zIndex } from './index';

describe('Design Tokens - Component Integration', () => {
  describe('Token Usage in Component Styles', () => {
    it('should support inline styles with color tokens', () => {
      const styles = {
        backgroundColor: colors.primary[500],
        color: colors.secondary[600],
        borderColor: colors.success[600],
      };

      expect(styles.backgroundColor).toMatch(/^#[0-9a-f]{6}$/i);
      expect(styles.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(styles.borderColor).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should support spacing tokens for padding/margin', () => {
      const styles = {
        padding: `${spacing[4]}px ${spacing[6]}px`,
        margin: `${spacing[2]}px 0`,
        gap: spacing[8],
      };

      expect(styles.padding).toBe('16px 24px');
      expect(styles.margin).toBe('8px 0');
      expect(styles.gap).toBe(32);
    });

    it('should support typography tokens', () => {
      const styles = {
        fontFamily: typography.fontFamily.sans,
        fontSize: `${typography.fontSize.base}px`,
        fontWeight: typography.fontWeight.semibold,
      };

      expect(styles.fontFamily).toContain('Inter');
      expect(styles.fontSize).toBe('16px');
      expect(styles.fontWeight).toBe('600');
    });

    it('should support shadow tokens', () => {
      const buttonStyle = {
        boxShadow: shadows.md.web,
      };

      expect(buttonStyle.boxShadow).toContain('rgba');
      expect(buttonStyle.boxShadow).toMatch(/\d+px/);
    });

    it('should support border radius tokens', () => {
      const styles = {
        borderRadius: borderRadius.md,
        borderRadiusLg: borderRadius.lg,
      };

      expect(styles.borderRadius).toBe(6);
      expect(styles.borderRadiusLg).toBe(8);
    });

    it('should support z-index tokens for layering', () => {
      const styles = {
        modal: { zIndex: zIndex.modal },
        dropdown: { zIndex: zIndex.dropdown },
        tooltip: { zIndex: zIndex.tooltip },
      };

      expect(styles.modal.zIndex).toBe(1400);
      expect(styles.dropdown.zIndex).toBe(1000);
      expect(styles.tooltip.zIndex > styles.modal.zIndex).toBe(true);
    });
  });

  describe('Responsive Design with Breakpoints', () => {
    it('should provide breakpoints for responsive design', () => {
      const responsiveStyles = {
        defaultFontSize: typography.fontSize.base,
        mobileFontSize: typography.fontSize.sm,
        tabletPadding: spacing[4],
        desktopPadding: spacing[6],
      };

      expect(responsiveStyles.defaultFontSize).toBeGreaterThanOrEqual(
        responsiveStyles.mobileFontSize
      );
      expect(responsiveStyles.desktopPadding).toBeGreaterThan(responsiveStyles.tabletPadding);
    });

    it('media queries should use breakpoint values', () => {
      const mediaQueries = {
        sm: `@media (min-width: ${breakpoints.sm}px)`,
        md: `@media (min-width: ${breakpoints.md}px)`,
        lg: `@media (min-width: ${breakpoints.lg}px)`,
      };

      expect(mediaQueries.sm).toBe('@media (min-width: 640px)');
      expect(mediaQueries.md).toBe('@media (min-width: 768px)');
      expect(mediaQueries.lg).toBe('@media (min-width: 1024px)');
    });
  });

  describe('Semantic Color Usage', () => {
    it('should have semantic colors for standard UI states', () => {
      const semanticMap = {
        success: colors.success[600],
        warning: colors.warning[600],
        error: colors.danger[600],
        info: colors.info[600],
      };

      Object.values(semanticMap).forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('should support color hierarchy from light to dark', () => {
      // Primary scale should have multiple shades
      const shades = Object.values(colors.primary);
      expect(shades.length).toBeGreaterThan(1);

      // All should be valid hex colors
      shades.forEach((shade) => {
        expect(shade).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });

  describe('Component-Specific Token Combinations', () => {
    it('button styles should combine multiple tokens', () => {
      const buttonStyles = {
        backgroundColor: colors.primary[600],
        color: colors.secondary[50],
        padding: `${spacing[3]}px ${spacing[4]}px`,
        fontSize: `${typography.fontSize.base}px`,
        fontWeight: typography.fontWeight.semibold,
        borderRadius: borderRadius.md,
        boxShadow: shadows.sm.web,
      };

      expect(buttonStyles.backgroundColor).toMatch(/^#/);
      expect(buttonStyles.color).toMatch(/^#/);
      expect(buttonStyles.padding).toBe('12px 16px');
      expect(buttonStyles.fontSize).toBe('16px');
    });

    it('card styles should combine elevation and spacing', () => {
      const cardStyles = {
        padding: spacing[6],
        borderRadius: borderRadius.lg,
        boxShadow: shadows.md.web,
        backgroundColor: colors.secondary[50],
      };

      expect(cardStyles.padding).toBe(24);
      expect(cardStyles.borderRadius).toBe(8);
      expect(cardStyles.boxShadow).toContain('rgba');
    });

    it('modal styles should use modal z-index and spacing', () => {
      const modalStyles = {
        zIndex: zIndex.modal,
        padding: spacing[8],
        borderRadius: borderRadius.xl,
        boxShadow: shadows.xl.web,
      };

      expect(modalStyles.zIndex).toBe(1400);
      expect(modalStyles.padding).toBe(32);
    });
  });

  describe('Token Type Safety', () => {
    it('should have type-safe color access', () => {
      const primaryColor = colors.primary[600];
      expect(typeof primaryColor).toBe('string');
      expect(primaryColor).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should have type-safe spacing access', () => {
      const buttonPadding = spacing[4];
      expect(typeof buttonPadding).toBe('number');
      expect(buttonPadding).toBeGreaterThan(0);
    });

    it('should have type-safe typography access', () => {
      const fontSize = typography.fontSize.base;
      expect(typeof fontSize).toBe('number');
      expect(fontSize).toBeGreaterThan(0);
    });

    it('should have type-safe shadow access', () => {
      const shadow = shadows.md;
      expect(shadow).toHaveProperty('web');
      expect(shadow).toHaveProperty('rn');
      expect(typeof shadow.web).toBe('string');
    });
  });

  describe('Cross-Platform Token Support', () => {
    it('web styles should work with CSS box-shadow', () => {
      const webStyles = {
        boxShadow: shadows.lg.web,
      };

      // Should be valid CSS box-shadow format
      expect(webStyles.boxShadow).toContain('rgba');
      expect(webStyles.boxShadow).toMatch(/\d+px/);
    });

    it('react native styles should have elevation', () => {
      const rnStyles = {
        elevation: shadows.lg.rn.elevation,
      };

      expect(typeof rnStyles.elevation).toBe('number');
      expect(rnStyles.elevation).toBeGreaterThan(0);
    });

    it('color tokens should work on all platforms', () => {
      const webColor = colors.primary[600];
      const rnColor = colors.primary[600];

      // Should be identical across platforms
      expect(webColor).toBe(rnColor);
      expect(webColor).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('spacing tokens should work on all platforms', () => {
      const webSpacing = spacing[4];
      const rnSpacing = spacing[4];

      // Should be identical numeric values
      expect(webSpacing).toBe(rnSpacing);
      expect(webSpacing).toBe(16);
    });
  });

  describe('Token Edge Cases', () => {
    it('should handle zero spacing', () => {
      expect(spacing[0]).toBe(0);
    });

    it('should handle full border radius (circular)', () => {
      expect(borderRadius.full).toBe(9999);
    });

    it('should handle base z-index layer', () => {
      expect(zIndex.base).toBe(0);
    });

    it('should handle largest shadow', () => {
      const largestShadow = shadows['2xl'];
      expect(largestShadow).toBeDefined();
      expect(largestShadow.web).toContain('rgba');
    });
  });

  describe('Token Consistency Across Categories', () => {
    it('should have consistent naming conventions', () => {
      // All size scales should use same increment pattern where applicable
      expect(spacing[1]).toBe(4);
      expect(spacing[2]).toBe(8);
      expect(spacing[3]).toBe(12);
      expect(spacing[4]).toBe(16);

      // Check typography sizes follow similar pattern
      expect(typography.fontSize.xs).toBeLessThan(typography.fontSize.sm);
      expect(typography.fontSize.sm).toBeLessThan(typography.fontSize.base);
    });

    it('should maintain visual hierarchy with shadows', () => {
      const shadowElevations = {
        sm: shadows.sm.rn.elevation,
        md: shadows.md.rn.elevation,
        lg: shadows.lg.rn.elevation,
        xl: shadows.xl.rn.elevation,
      };

      expect(shadowElevations.sm).toBeLessThan(shadowElevations.md);
      expect(shadowElevations.md).toBeLessThan(shadowElevations.lg);
      expect(shadowElevations.lg).toBeLessThan(shadowElevations.xl);
    });

    it('should maintain proper z-index hierarchy', () => {
      expect(zIndex.dropdown).toBeGreaterThan(zIndex.base);
      expect(zIndex.modal).toBeGreaterThan(zIndex.dropdown);
      expect(zIndex.tooltip).toBeGreaterThan(zIndex.modal);
    });
  });
});
