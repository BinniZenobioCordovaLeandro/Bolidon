import type { ConfigContext, ExpoConfig } from 'expo/config';
import 'dotenv/config';

const NAME = 'Bolidon.com';
const SLUG = 'bolidon';
const PACKAGE = 'com.bolidon.app';

const VERSION = '1.0.0';


export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: NAME,
  slug: SLUG,
  scheme: SLUG,
  version: VERSION,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  runtimeVersion: '1.0.0',
  updates: {
    url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID}`,
  },
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FF3C38',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: PACKAGE,
    infoPlist: {
      UIBackgroundModes: ['fetch', 'processing'],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: PACKAGE,
    permissions: [
      'android.permission.WAKE_LOCK',
      'android.permission.RECEIVE_BOOT_COMPLETED',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-router',
      {
        root: 'src/app',
      },
    ],
    [
      'expo-updates',
      {
        username: 'llaapp',
        checkAutomatically: 'ON_LOAD',
        fallbackToCacheTimeout: 0,
      },
    ],
    'expo-background-task',
    'expo-task-manager',
  ],
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    appEnv: process.env.EXPO_PUBLIC_APP_ENV,
  },
  owner: 'llaapp',
});
