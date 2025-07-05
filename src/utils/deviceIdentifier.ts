import * as Application from 'expo-application';
import { Platform } from 'react-native';

/**
 * Device identification utility using functional programming principles
 *
 * This utility provides a clean, functional approach to getting device identifiers
 * across different platforms (iOS/Android) with proper error handling and
 * type safety.
 */

/**
 * Type representing the result of device identification
 */
export interface DeviceIdentifierResult {
  readonly success: boolean;
  readonly deviceId: string | null;
  readonly platform: 'ios' | 'android' | 'web' | 'unknown';
  readonly error?: string;
}

/**
 * Type representing device identification functions
 */
type DeviceIdentifierFn = () => Promise<DeviceIdentifierResult>;

/**
 * Higher-order function that wraps device identification with error handling
 *
 * @param fn - The device identification function to wrap
 * @param platform - The platform string for error context
 * @returns A wrapped function that handles errors gracefully
 */
const withErrorHandling =
  (
    fn: () => Promise<string | null>,
    platform: DeviceIdentifierResult['platform']
  ): DeviceIdentifierFn =>
  async (): Promise<DeviceIdentifierResult> => {
    try {
      const deviceId = await fn();
      return {
        success: true,
        deviceId,
        platform,
      };
    } catch (error) {
      return {
        success: false,
        deviceId: null,
        platform,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  };

/**
 * Get Android device identifier
 *
 * @returns Promise resolving to Android device ID or null if unavailable
 */
const getAndroidDeviceId = async (): Promise<string | null> => {
  if (Platform.OS !== 'android') {
    return null;
  }

  const androidId = await Application.getAndroidId();
  return androidId || null;
};

/**
 * Get iOS device identifier
 *
 * @returns Promise resolving to iOS vendor ID or null if unavailable
 */
const getIosDeviceId = async (): Promise<string | null> => {
  if (Platform.OS !== 'ios') {
    return null;
  }

  const iosId = await Application.getIosIdForVendorAsync();
  return iosId || null;
};

/**
 * Get web device identifier (fallback for web platform)
 *
 * @returns Promise resolving to a web-based identifier or null
 */
const getWebDeviceId = async (): Promise<string | null> => {
  if (Platform.OS !== 'web') {
    return null;
  }

  // For web, we can use a combination of user agent and timestamp
  // This is not persistent across sessions but provides some identification
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
  const timestamp = Date.now().toString();

  return `web_${btoa(userAgent).substring(0, 16)}_${timestamp}`;
};

/**
 * Platform-specific device identifier functions
 */
const deviceIdentifierStrategies: Record<string, DeviceIdentifierFn> = {
  android: withErrorHandling(getAndroidDeviceId, 'android'),
  ios: withErrorHandling(getIosDeviceId, 'ios'),
  web: withErrorHandling(getWebDeviceId, 'web'),
};

/**
 * Get the current platform as a string
 *
 * @returns The current platform string
 */
const getCurrentPlatform = (): DeviceIdentifierResult['platform'] => {
  switch (Platform.OS) {
    case 'android':
      return 'android';
    case 'ios':
      return 'ios';
    case 'web':
      return 'web';
    default:
      return 'unknown';
  }
};

/**
 * Get device identifier for the current platform
 *
 * This function uses a functional approach to determine the appropriate
 * device identification strategy based on the current platform.
 *
 * @returns Promise resolving to DeviceIdentifierResult
 *
 * @example
 * ```typescript
 * const result = await getDeviceIdentifier();
 * if (result.success) {
 *   console.log('Device ID:', result.deviceId);
 * } else {
 *   console.error('Failed to get device ID:', result.error);
 * }
 * ```
 */
export const getDeviceIdentifier = async (): Promise<DeviceIdentifierResult> => {
  const platform = getCurrentPlatform();
  const strategy = deviceIdentifierStrategies[platform];

  if (!strategy) {
    return {
      success: false,
      deviceId: null,
      platform,
      error: `Unsupported platform: ${platform}`,
    };
  }

  return strategy();
};

/**
 * Get device identifier with fallback options
 *
 * This function tries multiple strategies to get a device identifier,
 * falling back to less reliable methods if the primary method fails.
 *
 * @returns Promise resolving to DeviceIdentifierResult
 */
export const getDeviceIdentifierWithFallback = async (): Promise<DeviceIdentifierResult> => {
  // Try primary strategy first
  const primaryResult = await getDeviceIdentifier();

  if (primaryResult.success && primaryResult.deviceId) {
    return primaryResult;
  }

  // Fallback: Generate a pseudo-unique identifier
  const fallbackId = generateFallbackId();

  return {
    success: true,
    deviceId: fallbackId,
    platform: getCurrentPlatform(),
    error: primaryResult.error
      ? `Primary method failed: ${primaryResult.error}. Using fallback.`
      : undefined,
  };
};

/**
 * Generate a fallback device identifier
 *
 * This creates a pseudo-unique identifier based on available device
 * information when platform-specific methods fail.
 *
 * @returns A fallback device identifier
 */
const generateFallbackId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  const platform = Platform.OS;

  return `fallback_${platform}_${timestamp}_${random}`;
};

/**
 * Validate device identifier
 *
 * @param deviceId - The device identifier to validate
 * @returns True if the device ID appears valid, false otherwise
 */
export const isValidDeviceId = (deviceId: string | null): boolean => {
  if (!deviceId) return false;

  // Basic validation - should be a non-empty string with minimum length
  return typeof deviceId === 'string' && deviceId.length >= 8;
};

/**
 * Format device identifier for display
 *
 * @param deviceId - The device identifier to format
 * @returns Formatted device identifier for display purposes
 */
export const formatDeviceIdForDisplay = (deviceId: string | null | undefined): string => {
  if (!deviceId) return 'Unknown Device';

  // Show first 8 characters for privacy
  return deviceId.length > 8 ? `${deviceId.substring(0, 8)}...` : deviceId;
};

/**
 * Get device information summary
 *
 * @returns Promise resolving to device information object
 */
export const getDeviceInfo = async (): Promise<{
  deviceId: string | null;
  platform: string;
  success: boolean;
  error?: string;
}> => {
  const result = await getDeviceIdentifierWithFallback();

  return {
    deviceId: result.deviceId,
    platform: result.platform,
    success: result.success,
    error: result.error,
  };
};

/**
 * Export utility functions for testing and debugging
 */
export const DeviceIdentifierUtils = {
  getAndroidDeviceId,
  getIosDeviceId,
  getWebDeviceId,
  generateFallbackId,
  getCurrentPlatform,
  isValidDeviceId,
  formatDeviceIdForDisplay,
} as const;
