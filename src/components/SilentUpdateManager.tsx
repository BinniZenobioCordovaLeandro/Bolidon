import type React from 'react';
import { useAppUpdates } from '../hooks/useAppUpdates';

/**
 * Silent background update manager
 * Handles updates transparently without any UI
 */
export const SilentUpdateManager: React.FC = () => {
  // This hook automatically handles background updates
  useAppUpdates();

  // No UI rendered - updates happen silently
  return null;
};

export default SilentUpdateManager;
