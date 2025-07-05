import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as JotaiProvider } from 'jotai';
import type React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SilentUpdateManager } from '../components/SilentUpdateManager';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

const AppContent: React.FC = () => {
  const { isDark, theme } = useTheme();

  return (
    <>
      <Slot />
      <StatusBar backgroundColor={theme.primary} translucent style={isDark ? 'light' : 'dark'} />
      <SilentUpdateManager />
    </>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <JotaiProvider>
          <AppContent />
        </JotaiProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
