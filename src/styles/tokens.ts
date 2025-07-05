/**
 * Design Tokens for Bolidon.com
 * Centralized design system constants for consistent UI
 */

// Spacing scale (based on 4px grid system)
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  giant: 64,
} as const;

// Typography scale
export const typography = {
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    huge: 28,
    massive: 32,
    giant: 40,
  },
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 26,
    xxl: 28,
    xxxl: 32,
    huge: 36,
    massive: 40,
    giant: 48,
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

// Border radius scale
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  xxl: 16,
  xxxl: 20,
  round: 50,
  circle: 9999,
} as const;

// Shadow system
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Icon sizes
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 56,
  giant: 64,
} as const;

// Component dimensions
export const dimensions = {
  buttonHeight: {
    sm: 32,
    md: 44,
    lg: 52,
    xl: 60,
  },
  inputHeight: {
    sm: 36,
    md: 48,
    lg: 56,
    xl: 64,
  },
  headerHeight: {
    sm: 56,
    md: 64,
    lg: 72,
    xl: 80,
  },
  minTouchTarget: 44, // iOS/Android minimum touch target
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  base: 0,
  raised: 1,
  dropdown: 10,
  overlay: 100,
  modal: 1000,
  toast: 10000,
} as const;

// Opacity scale
export const opacity = {
  transparent: 0,
  light: 0.1,
  medium: 0.5,
  heavy: 0.8,
  opaque: 1,
} as const;

// Animation durations (in milliseconds)
export const animations = {
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// Common percentages
export const percentages = {
  quarter: '25%',
  third: '33.333%',
  half: '50%',
  twoThirds: '66.666%',
  threeQuarters: '75%',
  full: '100%',
} as const;
