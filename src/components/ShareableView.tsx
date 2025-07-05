import type React from 'react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import { useSharing } from '../utils/sharing';

interface ShareableViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  shareOptions?: {
    title?: string;
    message?: string;
    format?: 'png' | 'jpg';
    quality?: number;
    includeText?: boolean;
    additionalText?: string;
  };
}

export interface ShareableViewRef {
  captureAndShare: () => Promise<void>;
  shareText: (content: string, title?: string) => Promise<void>;
}

/**
 * A reusable component that can capture and share its content
 * Provides both screenshot sharing and text-only sharing capabilities
 */
export const ShareableView = forwardRef<ShareableViewRef, ShareableViewProps>(
  ({ children, style, shareOptions }, ref) => {
    const viewRef = useRef<View>(null);
    const { shareScreenshot } = useSharing();

    useImperativeHandle(ref, () => ({
      captureAndShare: async () => {
        if (viewRef.current) {
          try {
            // Add a small delay to ensure the view is fully rendered
            await new Promise((resolve) => setTimeout(resolve, 100));
            await shareScreenshot(viewRef, shareOptions);
          } catch (error) {
            console.error('Error in captureAndShare:', error);
            throw error;
          }
        } else {
          throw new Error('View reference is not available for capture');
        }
      },
      shareText: async (_content: string, _title?: string) => {},
    }));

    return (
      <View ref={viewRef} style={style} collapsable={false} renderToHardwareTextureAndroid={true}>
        {children}
      </View>
    );
  }
);

ShareableView.displayName = 'ShareableView';
