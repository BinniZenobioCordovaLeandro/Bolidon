import type React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type ThemeMode, useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { MaterialIcon } from './Icon';

interface ThemeSettingsProps {
  showLabels?: boolean;
}

/**
 * Theme settings component for switching between light, dark, and system themes
 */
export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ showLabels = true }) => {
  const { themeMode, setThemeMode } = useTheme();

  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: theme.outline,
      },
      themeOption: {
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        minWidth: 80,
      },
      activeThemeOption: {
        backgroundColor: theme.primary,
      },
      themeIcon: {
        marginBottom: showLabels ? 4 : 0,
      },
      themeLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.onSurface,
      },
      activeThemeLabel: {
        color: '#FFFFFF',
      },
    })
  );

  const themeOptions: Array<{
    mode: ThemeMode;
    icon: 'wb-sunny' | 'brightness-2' | 'settings';
    label: string;
  }> = [
    { mode: 'light', icon: 'wb-sunny', label: 'Light' },
    { mode: 'dark', icon: 'brightness-2', label: 'Dark' },
    { mode: 'system', icon: 'settings', label: 'System' },
  ];

  return (
    <View style={styles.container}>
      {themeOptions.map(({ mode, icon, label }) => {
        const isActive = themeMode === mode;

        return (
          <TouchableOpacity
            key={mode}
            style={[styles.themeOption, isActive && styles.activeThemeOption]}
            onPress={() => setThemeMode(mode)}
            accessibilityLabel={`Switch to ${label} theme`}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <MaterialIcon
              name={icon}
              size={20}
              color={isActive ? '#FFFFFF' : undefined}
              style={styles.themeIcon}
            />
            {showLabels && (
              <Text style={[styles.themeLabel, isActive && styles.activeThemeLabel]}>{label}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
