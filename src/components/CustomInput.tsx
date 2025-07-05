import type React from 'react';
import { Text, TextInput, View } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { dimensions, iconSizes, spacing, typography } from '../styles/tokens';
import { MaterialIcon, type MaterialIconName } from './Icon';

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  icon?: MaterialIconName;
  editable?: boolean;
}

/**
 * Custom input component with Material Design styling and theme support
 * Includes label, icon, error handling, and accessibility features
 */
export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  icon,
  editable = true,
}) => {
  const { theme, common } = useThemedStyles();

  const styles = {
    container: {
      marginBottom: spacing.lg,
    },
    label: {
      ...common.textLg,
      ...common.textSemibold,
      color: theme.onSurface,
      marginBottom: spacing.sm,
    },
    inputContainer: {
      ...common.row,
      ...common.inputBase,
      alignItems: multiline ? 'flex-start' : 'center',
      minHeight: multiline ? dimensions.inputHeight.lg : dimensions.inputHeight.md,
    },
    inputError: {
      borderColor: theme.error,
      borderWidth: 2,
    },
    icon: {
      padding: spacing.lg,
      paddingRight: spacing.md,
    },
    input: {
      ...common.flex1,
      fontSize: typography.fontSize.lg,
      color: theme.onSurface,
      padding: spacing.lg,
      textAlignVertical: (multiline ? 'top' : 'center') as 'top' | 'center',
    },
    inputWithIcon: {
      paddingLeft: spacing.xs,
    },
    multilineInput: {
      minHeight: dimensions.inputHeight.xl,
      textAlignVertical: 'top' as const,
    },
    disabledInput: {
      backgroundColor: theme.surfaceVariant,
      color: theme.onSurfaceVariant,
    },
    errorText: {
      ...common.textSm,
      color: theme.error,
      marginTop: spacing.xs,
      marginLeft: spacing.xs,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && (
          <MaterialIcon
            name={icon}
            size={iconSizes.md}
            color={error ? theme.error : theme.onSurfaceVariant}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            multiline && styles.multilineInput,
            !editable && styles.disabledInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.onSurfaceVariant}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          accessibilityLabel={label}
          accessibilityHint={placeholder}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
