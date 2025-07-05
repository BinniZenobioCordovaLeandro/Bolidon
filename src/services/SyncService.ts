import NetInfo from '@react-native-community/netinfo';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { databaseService } from './DatabaseService';
import { PlateBasedStorageService } from './PlateBasedStorageService';
import Constants from 'expo-constants';
import type { MaintenanceRecord } from './PlateBasedStorageService';

const BACKGROUND_FETCH_TASK = 'background-sync';
const FIREBASE_FUNCTION_URI = Constants.expoConfig?.extra?.apiUrl as string;

/**
 * Core background sync logic extracted for manual testing in Expo Go.
 */
export async function runBackgroundSyncWork(): Promise<BackgroundTask.BackgroundTaskResult> {
  console.log('Running background sync work manually...');
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('Device is offline, skipping sync');
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const unsyncedRecords = await databaseService.getUnsyncedRecords();
    console.log(`Found ${unsyncedRecords.length} DB records to sync:`, unsyncedRecords);
    if (unsyncedRecords.length > 0) {
      console.log(`Syncing ${unsyncedRecords.length} DB records...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      for (const record of unsyncedRecords) {
        const tableName = getTableNameFromType(record.type);
        await databaseService.markAsSynced(tableName, record.data?.id || record.id);
      }
    }

    console.log('Starting plate-based sync...');
    await syncPlateBasedData();
    console.log('Plate-based sync completed');

    console.log('Background sync completed successfully');
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('Background sync work failed:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
}

// Remove the old TaskManager.defineTask block

function getTableNameFromType(type: string): string {
  switch (type) {
    case 'vehicle':
      return 'vehicles';
    case 'visit':
      return 'maintenance_visits';
    case 'service':
      return 'maintenance_services';
    default:
      throw new Error(`Unknown record type: ${type}`);
  }
}

export async function registerBackgroundSync(): Promise<void> {
  try {
    const status = await BackgroundTask.getStatusAsync();
    console.log('Background task status:', status);
    // Debug: show current registered tasks before registration
    const beforeTasks = await TaskManager.getRegisteredTasksAsync();
    console.log('Registered tasks before register:', beforeTasks.map(t => t.taskName));

    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
      console.warn('Background tasks are restricted on this device; registering anyway for testing');
      // continue to register for testing purposes
    }

    const registeredTasks = await TaskManager.getRegisteredTasksAsync();
    console.log('Registered tasks:', registeredTasks.map(t => t.taskName));
    const isTaskRegistered = registeredTasks.some(
      (task) => task.taskName === BACKGROUND_FETCH_TASK
    );

    if (isTaskRegistered) {
      console.log('Background sync task is already registered');
    } else {
      await BackgroundTask.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 15, // minutes
      });
      console.log('Background sync registered successfully');
      // Debug: show tasks after registration
      const afterTasks = await TaskManager.getRegisteredTasksAsync();
      console.log('Registered tasks after register:', afterTasks.map(t => t.taskName));
    }
  } catch (error) {
    console.error('Failed to register background sync:', error);
  }
}

export async function unregisterBackgroundSync(): Promise<void> {
  try {
    await BackgroundTask.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    console.log('Background sync unregistered');
  } catch (error) {
    console.error('Failed to unregister background sync:', error);
  }
}

export async function checkBackgroundSyncStatus(): Promise<BackgroundTask.BackgroundTaskStatus> {
  const status = await BackgroundTask.getStatusAsync();
  return status ?? BackgroundTask.BackgroundTaskStatus.Restricted;
}

export async function manualSync(): Promise<boolean> {
  try {
    console.log('Starting manual sync...');

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('No internet connection available');
    }

    const unsyncedRecords = await databaseService.getUnsyncedRecords();
    console.log(`DB unsynced records count: ${unsyncedRecords.length}`, unsyncedRecords);
    if (unsyncedRecords.length === 0) {
      console.log('No DB records to sync');
    } else {
      console.log(`Syncing ${unsyncedRecords.length} records...`);
      for (const record of unsyncedRecords) {
        await syncRecord(record);
      }
    }
    console.log('Proceeding to plate-based data sync');

    // Sync plate-based data
    await syncPlateBasedData();

    console.log('Manual sync completed successfully');
    return true;
  } catch (error) {
    console.error('Manual sync failed:', error);
    throw error;
  }
}

async function syncRecord(record: {
  id: string;
  type: string;
  data?: { id?: string };
}): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log(`Syncing ${record.type} record:`, record.id);
  const tableName = getTableNameFromType(record.type);
  await databaseService.markAsSynced(tableName, record.data?.id || record.id);
}

async function syncPlateBasedData(): Promise<void> {
  try {
    console.log('Retrieving plate sync status');
    const syncStatus = await PlateBasedStorageService.getSyncStatus();
    console.log('Plate sync status:', syncStatus);
    const unsyncedPlates = syncStatus.filter((plate) => !plate.inCloud);
    console.log(`Unsynced plates count: ${unsyncedPlates.length}`, unsyncedPlates);

    if (unsyncedPlates.length === 0) {
      console.log('No plate data to sync');
      return;
    }

    console.log(`Syncing ${unsyncedPlates.length} plates...`);

    for (const plateStatus of unsyncedPlates) {
      // Construct and log URL
      const plateUrl = `${FIREBASE_FUNCTION_URI}/plates/${plateStatus.licensePlate}`;
      console.log(`Posting maintenance data for plate ${plateStatus.licensePlate} to ${plateUrl}`);
      const plateData = await PlateBasedStorageService.getMaintenanceByPlate(
        plateStatus.licensePlate
      );

      if (plateData) {
        // Build full record payload for sync (exclude metadata fields)
        const syncData: Record<string, MaintenanceRecord> = {};
        Object.keys(plateData).forEach((key) => {
          if (key !== 'lastUpdated' && key !== 'inCloud' && !Number.isNaN(parseInt(key, 10))) {
            // plateData[key] is a MaintenanceRecord object
            syncData[key] = plateData[key] as MaintenanceRecord;
          }
        });

        try {
          const response = await fetch(plateUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(syncData),
          });
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
        } catch (fetchError) {
          console.error(`Failed to sync plate ${plateStatus.licensePlate}:`, fetchError);
          continue; // skip marking as synced
        }

        // Mark as synced
        await PlateBasedStorageService.markAsSynced(plateStatus.licensePlate);
        console.log(`Synced plate: ${plateStatus.licensePlate}`);
      }
    }
  } catch (error) {
    console.error('Failed to sync plate-based data:', error);
  }
}

export async function getNetworkStatus(): Promise<boolean> {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected || false;
}

export async function getBackgroundSyncInfo(): Promise<{
  status: BackgroundTask.BackgroundTaskStatus;
  isTaskRegistered: boolean;
  registeredTasks: string[];
}> {
  try {
    const status = await BackgroundTask.getStatusAsync();
    const registeredTasks = await TaskManager.getRegisteredTasksAsync();
    const isTaskRegistered = registeredTasks.some(
      (task) => task.taskName === BACKGROUND_FETCH_TASK
    );

    return {
      status: status ?? BackgroundTask.BackgroundTaskStatus.Restricted,
      isTaskRegistered,
      registeredTasks: registeredTasks.map((task) => task.taskName),
    };
  } catch (error) {
    console.error('Error getting background sync info:', error);
    return {
      status: BackgroundTask.BackgroundTaskStatus.Restricted,
      isTaskRegistered: false,
      registeredTasks: [],
    };
  }
}

export async function forceUnregisterAndRegister(): Promise<void> {
  try {
    console.log('Force unregistering and re-registering background sync...');

    try {
      await BackgroundTask.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      console.log('Successfully unregistered existing task');
    } catch (error) {
      console.log('No existing task to unregister:', error);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await registerBackgroundSync();

    console.log('Force re-registration completed');
  } catch (error) {
    console.error('Force re-registration failed:', error);
    throw error;
  }
}

export { BACKGROUND_FETCH_TASK };
