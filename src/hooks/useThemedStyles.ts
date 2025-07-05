import { StyleSheet } from 'react-native';
import { type Theme, useTheme } from '../contexts/ThemeContext';
import { type CommonStyles, createCommonStyles } from '../styles/common';

/**
 * Hook for creating theme-aware styles with access to common styles
 * Returns both the current theme, common styles, and a function to create themed styles
 */
export const useThemedStyles = <T extends StyleSheet.NamedStyles<T>>(
  styleCreator?: (theme: Theme, common: CommonStyles) => T
) => {
  const { theme } = useTheme();
  const common = createCommonStyles(theme);

  if (styleCreator) {
    const customStyles = StyleSheet.create(styleCreator(theme, common));
    return { theme, common, styles: customStyles };
  }

  return { theme, common };
};

/**
 * Simple hook to get the current theme
 */
export const useCurrentTheme = () => {
  const { theme } = useTheme();
  return theme;
};

/**
 * Hook to get common styles based on current theme
 */
export const useCommonStyles = () => {
  const { theme } = useTheme();
  return createCommonStyles(theme);
};
