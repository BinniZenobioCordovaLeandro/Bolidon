import type React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createCommonStyles } from '../styles';
import { MaterialIcon } from './Icon';

interface NavigationBarProps {
  title: string;
  onBackPress?: () => void;
  backButtonText?: string;
  rightElement?: React.ReactNode;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  onBackPress,
  backButtonText = 'Volver',
  rightElement,
}) => {
  const { theme } = useTheme();
  const styles = createCommonStyles(theme);

  return (
    <View style={styles.navigationBar}>
      <View style={styles.navigationContent}>
        {onBackPress ? (
          <TouchableOpacity style={styles.navigationBackButton} onPress={onBackPress}>
            <MaterialIcon name="arrow-back" size={20} color={theme.primary} />
            <Text style={styles.navigationBackText}>{backButtonText}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.navigationSpacer} />
        )}

        <Text style={styles.navigationTitle}>{title}</Text>

        {rightElement ? (
          <View style={styles.navigationRight}>{rightElement}</View>
        ) : (
          <View style={styles.navigationSpacer} />
        )}
      </View>
    </View>
  );
};
