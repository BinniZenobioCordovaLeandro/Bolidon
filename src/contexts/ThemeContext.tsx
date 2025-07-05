import AsyncStorage from '@react-native-async-storage/async-storage';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  primary: string;
  background: string;
  text: string;
  card: string;
  border: string;
  notification: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  shadow: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

const lightTheme: Theme = {
  primary: '#FF3C38',
  background: '#F7F9FC',
  text: '#1C1C1E',
  card: '#FFFFFF',
  border: '#E5E7EB',
  notification: '#FF3C38',
  surface: '#FFFFFF',
  onSurface: '#1C1C1E',
  surfaceVariant: '#F3F4F6',
  onSurfaceVariant: '#6B7280',
  outline: '#D1D5DB',
  shadow: '#000000',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
};

const darkTheme: Theme = {
  primary: '#FF5F56',
  background: '#0D1117',
  text: '#E5E7EB',
  card: '#161B22',
  border: '#30363D',
  notification: '#FF5F56',
  surface: '#161B22',
  onSurface: '#E5E7EB',
  surfaceVariant: '#21262D',
  onSurfaceVariant: '#8B949E',
  outline: '#30363D',
  shadow: '#000000',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  info: '#60A5FA',
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@bolidon_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  // Load saved theme mode from storage
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
          setThemeMode(savedMode as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme mode from storage:', error);
      }
    };

    loadThemeMode();
  }, []);

  // Save theme mode to storage
  const handleSetThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeMode(mode);
    } catch (error) {
      console.warn('Failed to save theme mode to storage:', error);
      setThemeMode(mode);
    }
  };

  // Determine the actual theme to use
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  const theme = isDark ? darkTheme : lightTheme;

  const contextValue: ThemeContextType = {
    theme,
    themeMode,
    isDark,
    setThemeMode: handleSetThemeMode,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export theme objects for direct usage
export { lightTheme, darkTheme };
