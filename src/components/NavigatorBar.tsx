import type React from 'react';
import type { ViewStyle } from 'react-native';
import { I18nManager, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createCommonStyles } from '../styles';
import type { MaterialIconName } from './Icon';
import { MaterialIcon } from './Icon';

interface NavigatorBarItem {
  icon: MaterialIconName;
  onPress: () => void;
  isActive?: boolean;
  id?: string; // Unique identifier for better key handling
  label?: string; // Accessible label for screen readers
}

interface NavigatorBarProps {
  items: NavigatorBarItem[];
  style?: ViewStyle;
}

/**
 * NavigatorBar component that displays navigation items as bubble-style buttons
 * Supports RTL layouts and aligns items to the right side
 *
 * @param items - Array of navigation items with icon, onPress, and optional isActive
 * @param style - Additional styles for the container
 *
 * @example
 * <NavigatorBar
 *   items={[
 *     { icon: 'list', onPress: () => navigate('/plates'), isActive: false },
 *     { icon: 'settings', onPress: () => navigate('/settings'), isActive: true }
 *   ]}
 * />
 */
export const NavigatorBar: React.FC<NavigatorBarProps> = ({ items, style }) => {
  const { theme } = useTheme();
  const styles = createCommonStyles(theme);

  // For RTL support, we need to reverse the items order
  const orderedItems = I18nManager.isRTL ? [...items].reverse() : items;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.navigatorBarContainer, style]}
      contentContainerStyle={styles.navigatorBarContent}
    >
      {orderedItems.map((item, index) => (
        <TouchableOpacity
          key={item.id || `nav-item-${index}`}
          style={[
            styles.navigatorBubble,
            item.isActive && styles.navigatorBubbleActive,
            index === 0 && styles.navigatorBubbleFirst,
          ]}
          onPress={item.onPress}
          activeOpacity={0.8}
          // Accessibility support
          accessibilityRole="button"
          accessibilityLabel={item.label || `Navigate to ${item.icon}`}
          accessibilityHint={item.isActive ? 'Currently active' : 'Tap to navigate'}
          accessibilityState={{ selected: item.isActive }}
        >
          <MaterialIcon
            name={item.icon}
            size={26}
            color={item.isActive ? '#fff' : theme.onSurface}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
