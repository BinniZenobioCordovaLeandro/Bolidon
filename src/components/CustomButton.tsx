import { LinearGradient } from 'expo-linear-gradient';
import type React from 'react';
import { ActivityIndicator, Text, type TextStyle, TouchableOpacity, View } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { dimensions, iconSizes, spacing, typography } from '../styles/tokens';
import { MaterialIcon, type MaterialIconName } from './Icon';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  onLongPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: MaterialIconName;
  fullWidth?: boolean;
}

/**
 * Custom button component with Material Design styling and theme support
 * Supports different variants, sizes, loading states, and icons
 */
export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  onLongPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}) => {
  const isDisabled = disabled || loading;

  const { theme, common } = useThemedStyles();

  const styles = {
    button: {
      ...common.buttonBase,
      overflow: 'hidden' as const,
      minHeight:
        size === 'small'
          ? dimensions.buttonHeight.sm
          : size === 'large'
            ? dimensions.buttonHeight.lg
            : dimensions.buttonHeight.md,
    },
    gradient: {
      ...common.roundedLg,
      minHeight:
        size === 'small'
          ? dimensions.buttonHeight.sm
          : size === 'large'
            ? dimensions.buttonHeight.lg
            : dimensions.buttonHeight.md,
    },
    content: {
      ...common.row,
      ...common.itemsCenter,
      ...common.justifyCenter,
      paddingHorizontal:
        size === 'small' ? spacing.md : size === 'large' ? spacing.xxl : spacing.lg,
      paddingVertical: size === 'small' ? spacing.sm : size === 'large' ? spacing.lg : spacing.md,
    },
    fullWidth: {
      ...common.wFull,
    },
    secondary: {
      ...common.bgSurfaceVariant,
    },
    outline: {
      backgroundColor: 'transparent' as const,
      borderWidth: 2,
      borderColor: theme.primary,
    },
    disabled: {
      opacity: 0.6,
    },
    text: {
      fontWeight: typography.fontWeight.semibold as TextStyle['fontWeight'],
      fontSize:
        size === 'small'
          ? typography.fontSize.md
          : size === 'large'
            ? typography.fontSize.xl
            : typography.fontSize.lg,
      color: '#fff',
      textAlign: 'center' as const,
    },
    textOutline: {
      color: theme.primary,
    },
    textSecondary: {
      color: theme.onSurfaceVariant,
    },
    icon: {
      marginRight: spacing.sm,
    },
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return iconSizes.sm;
      case 'large':
        return iconSizes.lg;
      default:
        return iconSizes.md;
    }
  };

  const getActivityIndicatorColor = () => {
    if (variant === 'outline') return theme.primary;
    if (variant === 'secondary') return theme.onSurfaceVariant;
    return '#fff';
  };

  const getIconColor = () => {
    if (variant === 'outline') return theme.primary;
    if (variant === 'secondary') return theme.onSurfaceVariant;
    return '#fff';
  };

  const getButtonContent = () => (
    <View style={[styles.content, fullWidth && styles.fullWidth]}>
      {loading ? (
        <ActivityIndicator size="small" color={getActivityIndicatorColor()} />
      ) : (
        <>
          {icon && (
            <MaterialIcon
              name={icon}
              size={getIconSize()}
              color={getIconColor()}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              variant === 'outline' && styles.textOutline,
              variant === 'secondary' && styles.textSecondary,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    const primaryColor = theme.primary;
    const primaryDark = `${theme.primary}99`; // Add transparency for gradient effect

    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={isDisabled}
        style={[styles.button, fullWidth && styles.fullWidth, isDisabled && styles.disabled]}
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
      >
        <LinearGradient
          colors={isDisabled ? [theme.outline, theme.outline] : [primaryColor, primaryDark]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {getButtonContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={isDisabled}
      style={[
        styles.button,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
      ]}
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {getButtonContent()}
    </TouchableOpacity>
  );
};
