import type React from 'react';
import { KeyboardAvoidingView, Platform, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  paddingHorizontal?: number;
  safeAreaTop?: boolean;
  safeAreaBottom?: boolean;
  safeAreaLeft?: boolean;
  safeAreaRight?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  backgroundColor,
  paddingHorizontal = 0,
  safeAreaTop = true,
  safeAreaBottom = true,
  safeAreaLeft = false,
  safeAreaRight = false,
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const screenStyle: ViewStyle = {
    flex: 1,
    backgroundColor: backgroundColor || theme.background,
    paddingTop: safeAreaTop ? insets.top : 0,
    paddingBottom: safeAreaBottom ? insets.bottom : 0,
    paddingLeft: safeAreaLeft ? insets.left : paddingHorizontal,
    paddingRight: safeAreaRight ? insets.right : paddingHorizontal,
    ...style,
  };

  return (
    <KeyboardAvoidingView
      style={screenStyle}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </KeyboardAvoidingView>
  );
};
