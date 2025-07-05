# Design System - Bolidon.com

This document explains how to use the centralized design system for consistent UI development across the Bolidon.com React Native app.

## 🎨 Design Tokens

All design values are centralized in `src/styles/tokens.ts`. This includes:

### Spacing Scale
```typescript
import { spacing } from '../styles/tokens';

// Usage examples:
marginTop: spacing.lg,      // 16px
padding: spacing.xl,        // 20px
gap: spacing.sm,           // 8px
```

### Typography Scale
```typescript
import { typography } from '../styles/tokens';

// Font sizes
fontSize: typography.fontSize.lg,    // 16px
fontSize: typography.fontSize.xxxl,  // 24px

// Font weights  
fontWeight: typography.fontWeight.semibold,  // '600'
fontWeight: typography.fontWeight.bold,      // '700'
```

### Icon Sizes
```typescript
import { iconSizes } from '../styles/tokens';

<MaterialIcon 
  name="settings" 
  size={iconSizes.lg}  // 24px
  color={theme.primary} 
/>
```

### Component Dimensions
```typescript
import { dimensions } from '../styles/tokens';

minHeight: dimensions.buttonHeight.md,  // 44px
minHeight: dimensions.inputHeight.lg,   // 56px
```

## 🎯 Using the Design System

### Method 1: Common Styles (Recommended)
Use pre-built common styles for consistent UI:

```typescript
import { useThemedStyles } from '../hooks/useThemedStyles';

const MyComponent = () => {
  const { theme, common } = useThemedStyles();
  
  return (
    <View style={[common.container, common.paddingLg]}>
      <Text style={[common.textXl, common.textBold, common.textPrimary]}>
        Welcome to Bolidon.com
      </Text>
      <View style={[common.card, common.shadowMd]}>
        <Text style={common.textMd}>Card content</Text>
      </View>
    </View>
  );
};
```

### Method 2: Custom Styles with Tokens
Create custom styles using design tokens:

```typescript
import { useThemedStyles } from '../hooks/useThemedStyles';
import { spacing, typography, borderRadius } from '../styles/tokens';

const MyComponent = () => {
  const { theme, common } = useThemedStyles();
  
  const styles = {
    customContainer: {
      padding: spacing.lg,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
    },
    customText: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
      color: theme.onSurface,
      lineHeight: typography.lineHeight.lg,
    },
  };
  
  return (
    <View style={styles.customContainer}>
      <Text style={styles.customText}>Custom styled component</Text>
    </View>
  );
};
```

## 📚 Common Style Classes

### Layout
```typescript
common.container          // Basic flex container
common.containerPadded    // Container with padding
common.containerCentered  // Centered container
common.row               // Flex row
common.rowBetween        // Row with space-between
common.column            // Flex column
common.flex1             // flex: 1
```

### Spacing
```typescript
common.paddingLg         // padding: 16px
common.marginMd          // margin: 12px  
common.marginTopXl       // marginTop: 20px
common.marginBottomSm    // marginBottom: 8px
```

### Typography
```typescript
common.textLg            // 16px font size
common.textBold          // Bold font weight
common.textPrimary       // Primary color text
common.textCenter        // Center aligned text
```

### Backgrounds & Borders
```typescript
common.bgSurface         // Surface background
common.bgPrimary         // Primary background
common.roundedLg         // 8px border radius
common.border            // 1px border
```

### Buttons & Inputs
```typescript
common.buttonBase        // Base button styles
common.inputBase         // Base input styles
```

## 🔧 Component Examples

### Custom Button with Design System
```typescript
const CustomButton = ({ title, onPress, variant = 'primary' }) => {
  const { theme, common } = useThemedStyles();
  
  const styles = {
    button: {
      ...common.buttonBase,
      backgroundColor: variant === 'primary' ? theme.primary : theme.surface,
    },
    text: {
      ...common.textMd,
      ...common.textBold,
      color: variant === 'primary' ? '#fff' : theme.onSurface,
    },
  };
  
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Custom Card Component
```typescript
const Card = ({ children, elevated = false }) => {
  const { common } = useThemedStyles();
  
  return (
    <View style={[
      common.card, 
      elevated ? common.shadowLg : common.shadowMd
    ]}>
      {children}
    </View>
  );
};
```

## 🎨 Theme Integration

The design system automatically adapts to light/dark themes:

```typescript
const MyComponent = () => {
  const { theme, common } = useThemedStyles();
  
  // Theme colors automatically update based on user preference
  const styles = {
    container: {
      backgroundColor: theme.background,  // Auto light/dark
      borderColor: theme.outline,        // Auto light/dark
    },
    text: {
      color: theme.onSurface,           // Auto light/dark
    },
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Theme-aware content</Text>
    </View>
  );
};
```

## 📱 Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Prefer common styles** over custom styles when possible  
3. **Use semantic naming** for colors (theme.primary vs hardcoded colors)
4. **Maintain consistent spacing** using the spacing scale
5. **Test in both light and dark themes**
6. **Use appropriate icon sizes** from the iconSizes scale

## 🚀 Migration Guide

To migrate existing components:

1. Replace hardcoded numbers with design tokens:
   ```typescript
   // Before
   padding: 16,
   fontSize: 14,
   
   // After  
   padding: spacing.lg,
   fontSize: typography.fontSize.md,
   ```

2. Use themed colors:
   ```typescript
   // Before
   color: '#333',
   backgroundColor: '#fff',
   
   // After
   color: theme.onSurface,
   backgroundColor: theme.surface,
   ```

3. Leverage common styles:
   ```typescript
   // Before
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   
   // After
   ...common.rowBetween,
   ```

This design system ensures consistency, maintainability, and automatic theme support across the entire Bolidon.com application.
