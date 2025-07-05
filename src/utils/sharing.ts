import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { RefObject } from 'react';
import { Alert, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';

/**
 * Sharing utility service for the Bolidon app
 * Provides reusable sharing functionality with screenshot capabilities
 */
export class SharingService {
  /**
   * Share a text message or URL
   * @param content - The text content to share
   * @param title - Optional title for the share dialog
   */
  static async shareText(content: string, title?: string): Promise<void> {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      // Create a temporary file with the content
      const fileName = `bolidon_invite_${Date.now()}.txt`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: title || 'Share Bolidon Invite',
        UTI: 'public.plain-text',
      });

      // Clean up the temporary file
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    } catch (error) {
      console.error('Error sharing text:', error);
      Alert.alert('Error', 'Failed to share content. Please try again.');
    }
  }

  /**
   * Capture a screenshot of a component and share it
   * @param viewRef - Reference to the view component to capture
   * @param options - Optional capture and sharing options
   */
  static async shareScreenshot(
    viewRef: RefObject<any>,
    options: {
      title?: string;
      message?: string;
      format?: 'png' | 'jpg';
      quality?: number;
      includeText?: boolean;
      additionalText?: string;
    } = {}
  ): Promise<void> {
    try {
      console.log('Starting shareScreenshot...');

      if (!viewRef.current) {
        console.error('View reference is null');
        Alert.alert('Error', 'Unable to capture screenshot. Please try again.');
        return;
      }

      if (!(await Sharing.isAvailableAsync())) {
        console.error('Sharing is not available');
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      const {
        title = 'Share Bolidon Invite',
        message = 'Check out this invite to join the Bolidon network!',
        format = 'png',
        quality = 0.9,
        includeText = true,
        additionalText,
      } = options;

      console.log('Capturing screenshot...');

      // Capture the screenshot with more specific options
      const uri = await captureRef(viewRef.current, {
        format,
        quality,
        result: 'tmpfile',
        height: undefined,
        width: undefined,
      });

      console.log('Screenshot captured successfully:', uri);

      if (includeText || additionalText) {
        // If we want to include text, we need to create a combined sharing experience
        const textContent = [
          message,
          additionalText,
          '\n\nDownload Bolidon:',
          'https://expo.dev/accounts/llaapp/projects/bolidon/builds/2264eaa3-95f9-452d-9eb2-ee7f2ea37f3d',
        ]
          .filter(Boolean)
          .join('\n');

        // Create a text file to share alongside the image
        const textFileName = `bolidon_invite_${Date.now()}.txt`;
        const textFileUri = `${FileSystem.documentDirectory}${textFileName}`;

        await FileSystem.writeAsStringAsync(textFileUri, textContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        // Share the image first
        await Sharing.shareAsync(uri, {
          mimeType: format === 'png' ? 'image/png' : 'image/jpeg',
          dialogTitle: title,
        });

        // Then share the text (users can choose to share both)
        await Sharing.shareAsync(textFileUri, {
          mimeType: 'text/plain',
          dialogTitle: `${title} - Details`,
          UTI: 'public.plain-text',
        });

        // Clean up the text file
        await FileSystem.deleteAsync(textFileUri, { idempotent: true });
      } else {
        // Just share the image
        await Sharing.shareAsync(uri, {
          mimeType: format === 'png' ? 'image/png' : 'image/jpeg',
          dialogTitle: title,
        });
      }

      // Clean up the image file
      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch (error) {
      console.error('Error sharing screenshot:', error);
      Alert.alert('Error', 'Failed to share screenshot. Please try again.');
    }
  }

  /**
   * Share an invite with both QR code screenshot and text
   * @param viewRef - Reference to the component containing the QR code
   * @param inviteUrl - The invite URL to share
   * @param customMessage - Optional custom message
   */
  static async shareInvite(
    viewRef: RefObject<any>,
    inviteUrl: string,
    customMessage?: string
  ): Promise<void> {
    const defaultMessage =
      customMessage ||
      '🎯 ¡Únete a la red exclusiva de Bolidon!\n\n' +
        'Te invito a descargar la app Bolidon para gestionar el mantenimiento de tu vehículo de forma inteligente.\n\n' +
        'Escanea el código QR o usa el enlace para descargar:';

    await SharingService.shareScreenshot(viewRef, {
      title: 'Invitación a Bolidon',
      message: defaultMessage,
      additionalText: `\n🔗 Enlace directo: ${inviteUrl}`,
      includeText: true,
      format: 'png',
      quality: 0.9,
    });
  }

  /**
   * Check if sharing is available on the current platform
   */
  static async isAvailable(): Promise<boolean> {
    return await Sharing.isAvailableAsync();
  }

  /**
   * Get platform-specific sharing capabilities
   */
  static getPlatformCapabilities() {
    return {
      platform: Platform.OS,
      sharingAvailable: Sharing.isAvailableAsync(),
      canShareFiles: Platform.OS !== 'web',
      canCaptureScreenshots: Platform.OS !== 'web',
    };
  }
}

/**
 * Hook for using sharing functionality in components
 */
export const useSharing = () => {
  const shareText = async (content: string, title?: string) => {
    return SharingService.shareText(content, title);
  };

  const shareScreenshot = async (
    viewRef: RefObject<any>,
    options?: Parameters<typeof SharingService.shareScreenshot>[1]
  ) => {
    return SharingService.shareScreenshot(viewRef, options);
  };

  const shareInvite = async (
    viewRef: RefObject<any>,
    inviteUrl: string,
    customMessage?: string
  ) => {
    return SharingService.shareInvite(viewRef, inviteUrl, customMessage);
  };

  const isAvailable = async () => {
    return SharingService.isAvailable();
  };

  const getPlatformCapabilities = () => {
    return SharingService.getPlatformCapabilities();
  };

  return {
    shareText,
    shareScreenshot,
    shareInvite,
    isAvailable,
    getPlatformCapabilities,
  };
};

export default SharingService;
