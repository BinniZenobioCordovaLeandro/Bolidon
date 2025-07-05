import { StyleSheet } from 'react-native';
import type { Theme } from '../contexts/ThemeContext';
import { borderRadius, dimensions, shadows, spacing, typography } from './tokens';

/**
 * Common stylesheet factory that creates reusable styles based on theme
 * These styles can be used across all components for consistency
 */
export const createCommonStyles = (theme: Theme) =>
  StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    containerPadded: {
      flex: 1,
      backgroundColor: theme.background,
      padding: spacing.lg,
    },
    containerCentered: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Surface styles
    surface: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      ...shadows.md,
    },
    surfaceElevated: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      ...shadows.lg,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.md,
    },

    // Layout styles
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    column: {
      flexDirection: 'column',
    },
    columnCenter: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Spacing utilities
    marginXs: { margin: spacing.xs },
    marginSm: { margin: spacing.sm },
    marginMd: { margin: spacing.md },
    marginLg: { margin: spacing.lg },
    marginXl: { margin: spacing.xl },

    paddingXs: { padding: spacing.xs },
    paddingSm: { padding: spacing.sm },
    paddingMd: { padding: spacing.md },
    paddingLg: { padding: spacing.lg },
    paddingXl: { padding: spacing.xl },

    marginTopXs: { marginTop: spacing.xs },
    marginTopSm: { marginTop: spacing.sm },
    marginTopMd: { marginTop: spacing.md },
    marginTopLg: { marginTop: spacing.lg },
    marginTopXl: { marginTop: spacing.xl },

    marginBottomXs: { marginBottom: spacing.xs },
    marginBottomSm: { marginBottom: spacing.sm },
    marginBottomMd: { marginBottom: spacing.md },
    marginBottomLg: { marginBottom: spacing.lg },
    marginBottomXl: { marginBottom: spacing.xl },

    marginHorizontalXs: { marginHorizontal: spacing.xs },
    marginHorizontalSm: { marginHorizontal: spacing.sm },
    marginHorizontalMd: { marginHorizontal: spacing.md },
    marginHorizontalLg: { marginHorizontal: spacing.lg },
    marginHorizontalXl: { marginHorizontal: spacing.xl },

    marginVerticalXs: { marginVertical: spacing.xs },
    marginVerticalSm: { marginVertical: spacing.sm },
    marginVerticalMd: { marginVertical: spacing.md },
    marginVerticalLg: { marginVertical: spacing.lg },
    marginVerticalXl: { marginVertical: spacing.xl },

    // Typography styles
    textXs: {
      fontSize: typography.fontSize.xs,
      lineHeight: typography.lineHeight.xs,
      color: theme.onSurface,
    },
    textSm: {
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.sm,
      color: theme.onSurface,
    },
    textMd: {
      fontSize: typography.fontSize.md,
      lineHeight: typography.lineHeight.md,
      color: theme.onSurface,
    },
    textLg: {
      fontSize: typography.fontSize.lg,
      lineHeight: typography.lineHeight.lg,
      color: theme.onSurface,
    },
    textXl: {
      fontSize: typography.fontSize.xl,
      lineHeight: typography.lineHeight.xl,
      color: theme.onSurface,
    },
    textXxl: {
      fontSize: typography.fontSize.xxl,
      lineHeight: typography.lineHeight.xxl,
      color: theme.onSurface,
    },
    textXxxl: {
      fontSize: typography.fontSize.xxxl,
      lineHeight: typography.lineHeight.xxxl,
      color: theme.onSurface,
    },

    // Font weights
    textLight: { fontWeight: typography.fontWeight.light },
    textNormal: { fontWeight: typography.fontWeight.normal },
    textMedium: { fontWeight: typography.fontWeight.medium },
    textSemibold: { fontWeight: typography.fontWeight.semibold },
    textBold: { fontWeight: typography.fontWeight.bold },
    textExtrabold: { fontWeight: typography.fontWeight.extrabold },

    // Text colors
    textPrimary: { color: theme.primary },
    textSecondary: { color: theme.onSurfaceVariant },
    textMuted: { color: theme.onSurfaceVariant },
    textError: { color: theme.error },
    textSuccess: { color: theme.success },
    textWarning: { color: theme.warning },
    textInfo: { color: theme.info },
    textOnSurface: { color: theme.onSurface },
    textOnPrimary: { color: '#FFFFFF' },

    // Text alignment
    textCenter: { textAlign: 'center' },
    textLeft: { textAlign: 'left' },
    textRight: { textAlign: 'right' },

    // Border styles
    border: {
      borderWidth: 1,
      borderColor: theme.outline,
    },
    borderTop: {
      borderTopWidth: 1,
      borderTopColor: theme.outline,
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: theme.outline,
    },
    borderLeft: {
      borderLeftWidth: 1,
      borderLeftColor: theme.outline,
    },
    borderRight: {
      borderRightWidth: 1,
      borderRightColor: theme.outline,
    },

    // Border radius
    roundedXs: { borderRadius: borderRadius.xs },
    roundedSm: { borderRadius: borderRadius.sm },
    roundedMd: { borderRadius: borderRadius.md },
    roundedLg: { borderRadius: borderRadius.lg },
    roundedXl: { borderRadius: borderRadius.xl },
    roundedXxl: { borderRadius: borderRadius.xxl },
    roundedXxxl: { borderRadius: borderRadius.xxxl },
    roundedFull: { borderRadius: borderRadius.circle },

    // Background colors
    bgPrimary: { backgroundColor: theme.primary },
    bgSurface: { backgroundColor: theme.surface },
    bgSurfaceVariant: { backgroundColor: theme.surfaceVariant },
    bgCard: { backgroundColor: theme.card },
    bgError: { backgroundColor: theme.error },
    bgSuccess: { backgroundColor: theme.success },
    bgWarning: { backgroundColor: theme.warning },
    bgInfo: { backgroundColor: theme.info },

    // Button base styles
    buttonBase: {
      borderRadius: borderRadius.lg,
      minHeight: dimensions.buttonHeight.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    buttonPrimary: {
      backgroundColor: theme.primary,
    },
    buttonSecondary: {
      backgroundColor: theme.surfaceVariant,
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.primary,
    },

    // Input base styles
    inputBase: {
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      backgroundColor: theme.surface,
      minHeight: dimensions.inputHeight.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      fontSize: typography.fontSize.lg,
      color: theme.onSurface,
    },
    inputFocused: {
      borderColor: theme.primary,
      borderWidth: 2,
    },
    inputError: {
      borderColor: theme.error,
    },

    // Shadow utilities
    shadowNone: shadows.none,
    shadowSm: shadows.sm,
    shadowMd: shadows.md,
    shadowLg: shadows.lg,
    shadowXl: shadows.xl,

    // Position utilities
    absolute: { position: 'absolute' },
    relative: { position: 'relative' },

    // Flex utilities
    flex1: { flex: 1 },
    flex2: { flex: 2 },
    flex3: { flex: 3 },
    flexGrow1: { flexGrow: 1 },
    flexShrink1: { flexShrink: 1 },

    // Alignment utilities
    itemsCenter: { alignItems: 'center' },
    itemsStart: { alignItems: 'flex-start' },
    itemsEnd: { alignItems: 'flex-end' },
    itemsStretch: { alignItems: 'stretch' },

    justifyCenter: { justifyContent: 'center' },
    justifyStart: { justifyContent: 'flex-start' },
    justifyEnd: { justifyContent: 'flex-end' },
    justifyBetween: { justifyContent: 'space-between' },
    justifyAround: { justifyContent: 'space-around' },
    justifyEvenly: { justifyContent: 'space-evenly' },

    // Width/Height utilities
    wFull: { width: '100%' },
    hFull: { height: '100%' },

    // Overflow utilities
    overflowHidden: { overflow: 'hidden' },
    overflowVisible: { overflow: 'visible' },

    // Header styles
    header: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      ...shadows.md,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    headerText: {
      marginLeft: spacing.md,
    },
    headerTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: '#FFFFFF',
      lineHeight: typography.lineHeight.xl,
    },
    headerSubtitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      color: '#FFFFFF',
      opacity: 0.9,
      lineHeight: typography.lineHeight.md,
    },

    // Button styles for header
    themeButton: {
      padding: spacing.sm,
      borderRadius: borderRadius.circle,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    syncButton: {
      padding: spacing.sm,
      borderRadius: borderRadius.circle,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },

    // Status indicator
    statusIndicator: {
      padding: spacing.xs,
      borderRadius: borderRadius.circle,
      minWidth: dimensions.buttonHeight.sm,
      minHeight: dimensions.buttonHeight.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Sync status
    syncStatus: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
      alignItems: 'center',
    },
    syncStatusText: {
      fontSize: typography.fontSize.sm,
      color: '#FFFFFF',
      opacity: 0.8,
      textAlign: 'center',
    },

    // Theme settings
    themeSettingsContainer: {
      backgroundColor: theme.surface,
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.outline,
      ...shadows.sm,
    },
    themeSettingsTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: theme.onSurface,
      marginBottom: spacing.md,
      textAlign: 'center',
    },

    // Content area
    content: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // Error states
    errorContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: spacing.xl,
    },
    errorTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: theme.error,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    errorMessage: {
      fontSize: typography.fontSize.md,
      color: theme.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: typography.lineHeight.lg,
    },

    // Loading states
    loadingContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: spacing.xl,
    },
    loadingText: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
      color: theme.onSurfaceVariant,
      marginTop: spacing.md,
      textAlign: 'center',
    },

    // Modal styles
    modalContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    modalHeader: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      ...shadows.md,
    },
    modalHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalHeaderText: {
      marginLeft: spacing.md,
      flex: 1,
    },
    modalHeaderTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: '#FFFFFF',
      lineHeight: typography.lineHeight.xl,
    },
    modalHeaderSubtitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      color: '#FFFFFF',
      opacity: 0.9,
      lineHeight: typography.lineHeight.md,
    },
    modalContent: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // Form styles
    formContainer: {
      padding: spacing.lg,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      ...shadows.sm,
    },
    formSection: {
      marginBottom: spacing.xl,
    },
    formSectionTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: theme.onSurface,
      marginBottom: spacing.md,
    },

    // List styles
    listContainer: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      ...shadows.sm,
    },
    listItem: {
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.outline}30`,
      flexDirection: 'row',
      alignItems: 'center',
    },
    listItemLast: {
      borderBottomWidth: 0,
    },
    listItemContent: {
      flex: 1,
    },

    // Empty state
    emptyState: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      borderStyle: 'dashed',
    },
    emptyStateIcon: {
      marginBottom: spacing.md,
    },
    emptyStateTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: theme.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    emptyStateMessage: {
      fontSize: typography.fontSize.md,
      color: theme.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: typography.lineHeight.md,
    },

    // Badge styles
    badge: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.round,
      alignSelf: 'flex-start',
    },
    badgeText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      color: '#FFFFFF',
    },
    badgeSuccess: {
      backgroundColor: theme.success,
    },
    badgeWarning: {
      backgroundColor: theme.warning,
    },
    badgeError: {
      backgroundColor: theme.error,
    },
    badgeInfo: {
      backgroundColor: theme.info,
    },

    // Divider
    divider: {
      height: 1,
      backgroundColor: theme.outline,
      marginVertical: spacing.lg,
    },
    dividerThick: {
      height: 2,
    },

    // Navigation
    navigationBar: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    navigationContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    navigationBackButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: `${theme.primary}20`,
    },
    navigationBackText: {
      fontSize: typography.fontSize.md,
      color: theme.primary,
      marginLeft: spacing.xs,
    },
    navigationTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: theme.text,
      textAlign: 'center',
      flex: 1,
    },
    navigationRight: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    navigationSpacer: {
      width: 60, // Approximate width to balance the layout
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.sm,
      marginRight: spacing.md,
    },
    backButtonText: {
      fontSize: typography.fontSize.md,
      color: theme.primary,
      marginLeft: spacing.xs,
    },

    // Floating Button
    floatingButton: {
      position: 'absolute',
      bottom: spacing.xl,
      right: spacing.xl,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      zIndex: 1000,
    },

    // Navigator Bar (Bubble Navigation)
    navigatorBarContainer: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    navigatorBarContent: {
      flexDirection: 'row',
      justifyContent: 'flex-end', // Align to right side
      alignItems: 'flex-end',
      paddingRight: spacing.lg,
    },
    navigatorBubble: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: spacing.lg, // Use marginLeft for RTL support
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    navigatorBubbleActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
      elevation: 8,
      shadowOpacity: 0.3,
    },
    navigatorBubbleFirst: {
      marginLeft: 0, // First item has no left margin
    },
  });

export type CommonStyles = ReturnType<typeof createCommonStyles>;
