import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MaintenanceVisit, Vehicle } from '../types';

/**
 * Storage structure for plate-based maintenance records
 * Format: { [mileage]: MaintenanceRecord, lastUpdated: ISO string, inCloud: boolean }
 */
export interface MaintenanceRecord {
  id: string;
  date: Date;
  services: Array<{
    serviceType: string;
    description: string;
  }>;
  totalCost: number;
  nextServiceMileage?: number;
  nextServiceDate?: Date;
  generalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  inCloud: boolean;
  deviceId?: string; // Device identifier for tracking record origin
}

export interface PlateMaintenanceData {
  [key: string]: MaintenanceRecord | string | boolean;
  lastUpdated: string; // ISO date string
  inCloud: boolean;
}

/**
 * Service for managing maintenance data indexed by license plate and mileage
 *
 * This service implements a plate-based storage system where:
 * - Each license plate (e.g., "B0S104") has its own document
 * - Maintenance records are indexed by mileage (e.g., 22000, 21800, 19000)
 * - Each document tracks sync status and last update time
 */
// PlateBasedStorageService as a plain object to avoid static-only class anti-pattern
const INDEX_KEY = 'plate_maintenance_index';

function getPlateKey(licensePlate: string): string {
  return licensePlate.toUpperCase();
}

function isMaintenanceRecordKey(key: string): boolean {
  return key !== 'lastUpdated' && key !== 'inCloud' && !Number.isNaN(parseInt(key, 10));
}

function getMaintenanceRecord(
  data: PlateMaintenanceData,
  key: string
): MaintenanceRecord | null {
  if (!isMaintenanceRecordKey(key)) {
    return null;
  }
  const record = data[key];
  return typeof record === 'object' && record !== null && 'id' in record
    ? (record as MaintenanceRecord)
    : null;
}

async function getMaintenanceByPlate(licensePlate: string): Promise<PlateMaintenanceData | null> {
  try {
    const key = getPlateKey(licensePlate);
    const data = await AsyncStorage.getItem(key);

    if (!data) {
      return null;
    }

    const parsed = JSON.parse(data) as PlateMaintenanceData;

    // Convert date strings back to Date objects for maintenance records
    const records: PlateMaintenanceData = {
      lastUpdated: parsed.lastUpdated as string,
      inCloud: parsed.inCloud as boolean,
    };

    Object.keys(parsed).forEach((recordKey) => {
      if (isMaintenanceRecordKey(recordKey)) {
        const record = parsed[recordKey] as MaintenanceRecord;
        records[recordKey] = {
          ...record,
          date: new Date(record.date),
          nextServiceDate: record.nextServiceDate ? new Date(record.nextServiceDate) : undefined,
          createdAt: new Date(record.createdAt),
          updatedAt: new Date(record.updatedAt),
        };
      }
    });

    return records;
  } catch (error) {
    console.error('Failed to get maintenance by plate:', error);
    return null;
  }
}

async function saveMaintenanceRecord(
  licensePlate: string,
  mileage: number,
  maintenanceVisit: MaintenanceVisit
): Promise<void> {
  try {
    const key = getPlateKey(licensePlate);
    const existingData = (await getMaintenanceByPlate(licensePlate)) || {
      lastUpdated: new Date().toISOString(),
      inCloud: false,
    };

    // Create maintenance record from visit data
    const record: MaintenanceRecord = {
      id: maintenanceVisit.id,
      date: maintenanceVisit.date,
      services: maintenanceVisit.services.map((service) => ({
        serviceType: service.serviceType,
        description: service.notes || '',
      })),
      totalCost: maintenanceVisit.totalCost,
      nextServiceMileage: maintenanceVisit.nextServiceMileage,
      nextServiceDate: maintenanceVisit.nextServiceDate,
      generalNotes: maintenanceVisit.generalNotes,
      createdAt: maintenanceVisit.createdAt,
      updatedAt: maintenanceVisit.updatedAt,
      inCloud: maintenanceVisit.inCloud,
      deviceId: maintenanceVisit.deviceId,
    };

    // Update the data
    const updatedData: PlateMaintenanceData = {
      ...existingData,
      [mileage.toString()]: record,
      lastUpdated: new Date().toISOString(),
      inCloud: areAllRecordsSynced({
        ...existingData,
        [mileage.toString()]: record,
      }),
    };

    // Save to AsyncStorage
    await AsyncStorage.setItem(key, JSON.stringify(updatedData));

    // Update the index
    await updatePlateIndex(licensePlate);

    console.log(`Maintenance record saved for plate ${licensePlate} at mileage ${mileage}`);
  } catch (error) {
    console.error('Failed to save maintenance record:', error);
    throw error;
  }
}

async function getMaintenanceHistory(licensePlate: string): Promise<
  Array<{
    mileage: number;
    record: MaintenanceRecord;
  }>
> {
  try {
    const data = await getMaintenanceByPlate(licensePlate);

    if (!data) {
      return [];
    }

    const records: Array<{ mileage: number; record: MaintenanceRecord }> = [];

    Object.keys(data).forEach((key) => {
      if (isMaintenanceRecordKey(key)) {
        const mileage = parseInt(key, 10);
        const record = getMaintenanceRecord(data, key);
        if (record) {
          records.push({ mileage, record });
        }
      }
    });

    // Sort by mileage descending (most recent first)
    return records.sort((a, b) => b.mileage - a.mileage);
  } catch (error) {
    console.error('Failed to get maintenance history:', error);
    return [];
  }
}

async function getMaintenanceAtMileage(
  licensePlate: string,
  mileage: number
): Promise<MaintenanceRecord | null> {
  try {
    const data = await getMaintenanceByPlate(licensePlate);

    if (!data) {
      return null;
    }

    return data[mileage.toString()] &&
      isMaintenanceRecordKey(mileage.toString())
      ? getMaintenanceRecord(data, mileage.toString())
      : null;
  } catch (error) {
    console.error('Failed to get maintenance at mileage:', error);
    return null;
  }
}

async function deleteMaintenanceRecord(licensePlate: string, mileage: number): Promise<void> {
  try {
    const data = await getMaintenanceByPlate(licensePlate);

    if (!data) {
      return;
    }

    // Remove the specific mileage record
    delete data[mileage.toString()];

    // Update metadata
    data.lastUpdated = new Date().toISOString();
    data.inCloud = false;

    const key = getPlateKey(licensePlate);
    await AsyncStorage.setItem(key, JSON.stringify(data));

    console.log(`Maintenance record deleted for plate ${licensePlate} at mileage ${mileage}`);
  } catch (error) {
    console.error('Failed to delete maintenance record:', error);
    throw error;
  }
}

async function markAsSynced(licensePlate: string): Promise<void> {
  try {
    const data = await getMaintenanceByPlate(licensePlate);

    if (!data) {
      return;
    }

    // Mark all individual maintenance records as synced
    Object.keys(data).forEach((key) => {
      if (isMaintenanceRecordKey(key)) {
        const record = data[key] as MaintenanceRecord;
        if (record) {
          record.inCloud = true;
        }
      }
    });

    data.inCloud = areAllRecordsSynced(data);
    data.lastUpdated = new Date().toISOString();

    const key = getPlateKey(licensePlate);
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to mark as synced:', error);
    throw error;
  }
}

async function markRecordAsSynced(licensePlate: string, mileage: number): Promise<void> {
  try {
    const data = await getMaintenanceByPlate(licensePlate);

    if (!data) {
      return;
    }

    const recordKey = mileage.toString();
    const record = data[recordKey] as MaintenanceRecord;

    if (record) {
      record.inCloud = true;
      data.inCloud = areAllRecordsSynced(data);
      data.lastUpdated = new Date().toISOString();

      const key = getPlateKey(licensePlate);
      await AsyncStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error('Failed to mark record as synced:', error);
    throw error;
  }
}

async function getAllPlatesWithMaintenance(): Promise<string[]> {
  try {
    const indexData = await AsyncStorage.getItem(INDEX_KEY);
    return indexData ? JSON.parse(indexData) : [];
  } catch (error) {
    console.error('Failed to get plates index:', error);
    return [];
  }
}

async function getSyncStatus(): Promise<
  Array<{
    licensePlate: string;
    lastUpdated: string;
    inCloud: boolean;
    recordCount: number;
  }>
> {
  try {
    const plates = await getAllPlatesWithMaintenance();
    console.log(`🎸 Found ${plates.length} plates with maintenance records`);
    const syncStatus = await Promise.all(
      plates.map(async (plate) => {
        const data = await getMaintenanceByPlate(plate);
        if (!data) {
          return null;
        }

        const isAtLeastOneRecordNotSynced = true;

        return {
          licensePlate: plate,
          lastUpdated: data.lastUpdated,
          inCloud: !isAtLeastOneRecordNotSynced,
          recordCount: Object.keys(data).filter(isMaintenanceRecordKey).length,
        };
      })
    );

    return syncStatus.filter(Boolean) as Array<{
      licensePlate: string;
      lastUpdated: string;
      inCloud: boolean;
      recordCount: number;
    }>;
  } catch (error) {
    console.error('Failed to get sync status:', error);
    return [];
  }
}

async function updatePlateIndex(licensePlate: string): Promise<void> {
  try {
    const plates = await getAllPlatesWithMaintenance();
    const normalizedPlate = licensePlate.toUpperCase();

    if (!plates.includes(normalizedPlate)) {
      plates.push(normalizedPlate);
      await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(plates));
    }
  } catch (error) {
    console.error('Failed to update plate index:', error);
  }
}

async function migrateFromMaintenanceVisit(
  vehicle: Vehicle,
  maintenanceVisit: MaintenanceVisit
): Promise<void> {
  await saveMaintenanceRecord(
    vehicle.licensePlate,
    maintenanceVisit.mileage,
    maintenanceVisit
  );
}

async function clearPlateData(licensePlate: string): Promise<void> {
  try {
    const key = getPlateKey(licensePlate);
    await AsyncStorage.removeItem(key);

    // Remove from index
    const plates = await getAllPlatesWithMaintenance();
    const updatedPlates = plates.filter((plate) => plate !== licensePlate.toUpperCase());
    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(updatedPlates));

    console.log(`All maintenance data cleared for plate ${licensePlate}`);
  } catch (error) {
    console.error('Failed to clear plate data:', error);
    throw error;
  }
}

async function getStorageStats(): Promise<{
  totalPlates: number;
  totalRecords: number;
  unsyncedPlates: number;
  storageSize: number; // approximate size in bytes
}> {
  try {
    const syncStatus = await getSyncStatus();
    const totalRecords = syncStatus.reduce((sum, plate) => sum + plate.recordCount, 0);
    const unsyncedPlates = syncStatus.filter((plate) => !plate.inCloud).length;

    // Estimate storage size (rough calculation)
    let storageSize = 0;
    for (const status of syncStatus) {
      const data = await getMaintenanceByPlate(status.licensePlate);
      if (data) {
        storageSize += JSON.stringify(data).length;
      }
    }

    return {
      totalPlates: syncStatus.length,
      totalRecords,
      unsyncedPlates,
      storageSize,
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return {
      totalPlates: 0,
      totalRecords: 0,
      unsyncedPlates: 0,
      storageSize: 0,
    };
  }
}

function areAllRecordsSynced(data: PlateMaintenanceData): boolean {
  return Object.keys(data).every((key) => {
    if (isMaintenanceRecordKey(key)) {
      const record = data[key] as MaintenanceRecord;
      return record?.inCloud;
    }
    return true; // Non-record keys don't affect sync status
  });
}

async function debugSyncStatus(licensePlate: string): Promise<void> {
  try {
    const data = await getMaintenanceByPlate(licensePlate);

    if (!data) {
      console.log(`No data found for plate: ${licensePlate}`);
      return;
    }

    console.log(`\n=== Sync Status for Plate: ${licensePlate} ===`);
    console.log(`Plate-level inCloud: ${data.inCloud}`);
    console.log(`Last updated: ${data.lastUpdated}`);

    const maintenanceRecords: Array<{ mileage: string; inCloud: boolean }> = [];

    Object.keys(data).forEach((key) => {
      if (isMaintenanceRecordKey(key)) {
        const record = data[key] as MaintenanceRecord;
        if (record) {
          maintenanceRecords.push({
            mileage: key,
            inCloud: record.inCloud,
          });
        }
      }
    });

    console.log(`Total maintenance records: ${maintenanceRecords.length}`);
    maintenanceRecords
      .sort((a, b) => parseInt(b.mileage) - parseInt(a.mileage))
      .forEach(({ mileage, inCloud }) => {
        console.log(`  ${mileage} km: ${inCloud ? '✅ Synced' : '❌ Not synced'}`);
      });

    const allSynced = areAllRecordsSynced(data);
    console.log(`All records synced: ${allSynced}`);
    console.log(`Plate inCloud should be: ${allSynced}`);

    if (data.inCloud !== allSynced) {
      console.warn(
        `⚠️  INCONSISTENCY: Plate inCloud (${data.inCloud}) doesn't match calculated status (${allSynced})`
      );
    }

    console.log('=== End Debug ===\n');
  } catch (error) {
    console.error('Failed to debug sync status:', error);
  }
}

// Export as a singleton object
export const PlateBasedStorageService = {
  getMaintenanceByPlate,
  saveMaintenanceRecord,
  getMaintenanceHistory,
  getMaintenanceAtMileage,
  deleteMaintenanceRecord,
  markAsSynced,
  markRecordAsSynced,
  getAllPlatesWithMaintenance,
  getSyncStatus,
  migrateFromMaintenanceVisit,
  clearPlateData,
  getStorageStats,
  debugSyncStatus,
};
