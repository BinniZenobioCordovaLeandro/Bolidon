import 'expo-router/entry';

// Initialize background sync: define task and register on startup
import { registerBackgroundSync } from './services/SyncService';

registerBackgroundSync().catch((err) => console.error('Background sync registration error:', err));
