import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { AppState } from 'react-native';

/**
 * Aggressive auto-update hook
 * Automatically checks for and installs updates immediately when available
 */
export const useAppUpdates = () => {
  /**
   * Check for updates and install them immediately
   */
  const checkAndInstallUpdates = async () => {
    try {
      // Only run in production builds
      if (__DEV__ || !Updates.isEnabled) {
        return;
      }

      console.log('Checking for updates...');

      // Check for updates
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        console.log('Update available, downloading...');

        // Immediately download and install the update
        const fetchedUpdate = await Updates.fetchUpdateAsync();

        if (fetchedUpdate.isNew) {
          console.log('New update downloaded, restarting app...');
          // Immediately restart the app to apply the update
          await Updates.reloadAsync();
        }
      } else {
        console.log('No updates available');
      }
    } catch (error) {
      // Log error but don't show to users
      console.log('Update check failed:', error);
    }
  };

  /**
   * Set up aggressive update checking
   */
  useEffect(() => {
    // Only run in production builds
    if (__DEV__ || !Updates.isEnabled) {
      console.log('Updates disabled in development mode');
      return;
    }

    // Check for updates immediately when the app starts
    checkAndInstallUpdates();

    // Set up frequent checking every 2 minutes for immediate updates
    const interval = setInterval(checkAndInstallUpdates, 2 * 60 * 1000);

    // Also check for updates when app comes back from background
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('App became active, checking for updates...');
        checkAndInstallUpdates();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearInterval(interval);
      subscription?.remove();
    };
  }, [checkAndInstallUpdates]);

  return {
    checkAndInstallUpdates,
  };
};
