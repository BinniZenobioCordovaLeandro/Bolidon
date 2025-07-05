import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MaintenanceService, MaintenanceVisit, Vehicle } from '../types';
import { PlateBasedStorageService } from './PlateBasedStorageService';

const STORAGE_KEYS = {
  VEHICLES: 'vehicles',
  MAINTENANCE_VISITS: 'maintenance_visits',
  UNSYNCED_RECORDS: 'unsynced_records',
  DB_VERSION: 'db_version',
} as const;

const DB_VERSION = 1;

// Types for stored records with metadata
interface StoredVehicle extends Vehicle {
  synced?: boolean;
  lastModified?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StoredMaintenanceVisit extends MaintenanceVisit {
  synced?: boolean;
  lastModified?: string;
}

interface StoredMaintenanceService extends MaintenanceService {
  synced?: boolean;
  lastModified?: string;
}

interface UnsyncedRecord {
  id: string;
  type: 'vehicle' | 'visit' | 'service';
  operation: 'insert' | 'update' | 'delete';
  data: Vehicle | MaintenanceVisit | MaintenanceService;
  createdAt: string;
  inCloud: boolean;
}

export class DatabaseService {
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  async initializeDatabase(): Promise<void> {
    // Return existing promise if initialization is already in progress
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Return immediately if already initialized
    if (this.initialized) {
      return Promise.resolve();
    }

    // Start initialization process
    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  private async performInitialization(): Promise<void> {
    try {
      await this.checkAndMigrateDatabase();
      this.initialized = true;
      console.log('AsyncStorage database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      // Reset promise so it can be retried
      this.initializationPromise = null;
      throw error;
    }
  }

  private async checkAndMigrateDatabase(): Promise<void> {
    try {
      const currentVersion = await AsyncStorage.getItem(STORAGE_KEYS.DB_VERSION);

      if (!currentVersion) {
        // First time setup
        await this.initializeStorage();
        await AsyncStorage.setItem(STORAGE_KEYS.DB_VERSION, DB_VERSION.toString());
      } else if (parseInt(currentVersion) < DB_VERSION) {
        // Migration needed
        await this.migrateDatabase(parseInt(currentVersion), DB_VERSION);
        await AsyncStorage.setItem(STORAGE_KEYS.DB_VERSION, DB_VERSION.toString());
      }
    } catch (error) {
      console.error('Database migration failed:', error);
      throw error;
    }
  }

  private async initializeStorage(): Promise<void> {
    // Initialize empty arrays for each data type
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.VEHICLES, JSON.stringify([])],
      [STORAGE_KEYS.MAINTENANCE_VISITS, JSON.stringify([])],
      [STORAGE_KEYS.UNSYNCED_RECORDS, JSON.stringify([])],
    ]);
  }

  private async migrateDatabase(fromVersion: number, toVersion: number): Promise<void> {
    console.log(`Migrating database from version ${fromVersion} to ${toVersion}`);
    // Add migration logic here when needed in future versions
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initializeDatabase();
    }
  }

  // Vehicle operations
  async saveVehicle(vehicle: Vehicle): Promise<void> {
    await this.ensureInitialized();

    try {
      const vehiclesWithMetadata = await this.getAllVehiclesWithMetadata();
      const existingIndex = vehiclesWithMetadata.findIndex((v) => v.id === vehicle.id);

      const vehicleWithTimestamp = {
        ...vehicle,
        createdAt:
          existingIndex === -1
            ? new Date().toISOString()
            : vehiclesWithMetadata[existingIndex].createdAt,
        updatedAt: new Date().toISOString(),
        synced: false,
      };

      if (existingIndex === -1) {
        vehiclesWithMetadata.push(vehicleWithTimestamp);
      } else {
        vehiclesWithMetadata[existingIndex] = vehicleWithTimestamp;
      }

      await AsyncStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehiclesWithMetadata));
      await this.addToSyncQueue('vehicle', 'insert', vehicle.id, vehicleWithTimestamp);
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      throw error;
    }
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    await this.ensureInitialized();

    try {
      const vehiclesJson = await AsyncStorage.getItem(STORAGE_KEYS.VEHICLES);
      if (!vehiclesJson) return [];

      const vehicles = JSON.parse(vehiclesJson) as StoredVehicle[];
      return vehicles.map((vehicle: StoredVehicle) => ({
        id: vehicle.id,
        licensePlate: vehicle.licensePlate,
        nickname: vehicle.nickname,
        mileage: vehicle.mileage,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin,
      }));
    } catch (error) {
      console.error('Failed to get vehicles:', error);
      return [];
    }
  }

  // Helper method to add records to sync queue
  private async addToSyncQueue(
    type: string,
    operation: string,
    _recordId: string,
    data: Vehicle | MaintenanceVisit | MaintenanceService
  ): Promise<void> {
    try {
      const unsyncedRecords = await this.getUnsyncedRecords();
      const newRecord: UnsyncedRecord = {
        id: `${Date.now()}_${Math.random()}`,
        type: type as 'vehicle' | 'visit' | 'service',
        operation: operation as 'insert' | 'update' | 'delete',
        data,
        createdAt: new Date().toISOString(),
        inCloud: false,
      };

      unsyncedRecords.push(newRecord);
      await AsyncStorage.setItem(STORAGE_KEYS.UNSYNCED_RECORDS, JSON.stringify(unsyncedRecords));
      console.log(`Added record to sync queue: ${newRecord.id}`);
    } catch (error) {
      console.warn('Failed to add to sync queue:', error);
    }
  }

  // Maintenance visit operations
  async saveMaintenanceVisit(visit: MaintenanceVisit): Promise<void> {
    await this.ensureInitialized();

    try {
      const visitsWithMetadata = await this.getAllMaintenanceVisitsWithMetadata();
      const existingIndex = visitsWithMetadata.findIndex((v) => v.id === visit.id);

      const visitWithTimestamp = {
        ...visit,
        createdAt: existingIndex === -1 ? new Date() : visitsWithMetadata[existingIndex].createdAt,
        updatedAt: new Date(),
        inCloud: false,
      };

      if (existingIndex === -1) {
        visitsWithMetadata.push(visitWithTimestamp);
      } else {
        visitsWithMetadata[existingIndex] = visitWithTimestamp;
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.MAINTENANCE_VISITS,
        JSON.stringify(visitsWithMetadata)
      );
      await this.addToSyncQueue('visit', 'insert', visit.id, visitWithTimestamp);
    } catch (error) {
      console.error('Failed to save maintenance visit:', error);
      throw error;
    }
  }

  async getAllMaintenanceVisits(): Promise<MaintenanceVisit[]> {
    await this.ensureInitialized();

    try {
      const visitsJson = await AsyncStorage.getItem(STORAGE_KEYS.MAINTENANCE_VISITS);
      if (!visitsJson) return [];

      const visits = JSON.parse(visitsJson) as StoredMaintenanceVisit[];
      return visits.map((visit: StoredMaintenanceVisit) => ({
        ...visit,
        date: new Date(visit.date),
        nextServiceDate: visit.nextServiceDate ? new Date(visit.nextServiceDate) : undefined,
        createdAt: new Date(visit.createdAt),
        updatedAt: new Date(visit.updatedAt),
        services: visit.services.map((service: StoredMaintenanceService) => ({
          ...service,
          date: new Date(service.date),
          nextServiceDate: service.nextServiceDate ? new Date(service.nextServiceDate) : undefined,
          createdAt: new Date(service.createdAt),
          updatedAt: new Date(service.updatedAt),
        })),
      }));
    } catch (error) {
      console.error('Failed to get maintenance visits:', error);
      return [];
    }
  }

  // Sync operations
  async getUnsyncedRecords(): Promise<UnsyncedRecord[]> {
    await this.ensureInitialized();

    try {
      const unsyncedJson = await AsyncStorage.getItem(STORAGE_KEYS.UNSYNCED_RECORDS);
      if (!unsyncedJson) return [];

      return JSON.parse(unsyncedJson);
    } catch (error) {
      console.error('Failed to get unsynced records:', error);
      return [];
    }
  }

  async markAsSynced(tableName: string, id: string): Promise<void> {
    await this.ensureInitialized();

    try {
      // Remove from unsynced records
      const unsyncedRecords = await this.getUnsyncedRecords();
      const filteredRecords = unsyncedRecords.filter(
        (record) =>
          !(record.data?.id === id && this.getTableNameFromType(record.type) === tableName)
      );

      await AsyncStorage.setItem(STORAGE_KEYS.UNSYNCED_RECORDS, JSON.stringify(filteredRecords));
      console.log(`Marked record ${id} in table ${tableName} as synced`);

      // Mark the actual record as synced
      if (tableName === 'vehicles') {
        const vehicles = await this.getAllVehiclesWithMetadata();
        const updatedVehicles = vehicles.map((vehicle: StoredVehicle) =>
          vehicle.id === id ? { ...vehicle, synced: true } : vehicle
        );
        await AsyncStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updatedVehicles));
      } else if (tableName === 'maintenance_visits') {
        const visits = await this.getAllMaintenanceVisitsWithMetadata();
        const updatedVisits = visits.map((visit: StoredMaintenanceVisit) =>
          visit.id === id ? { ...visit, synced: true } : visit
        );
        await AsyncStorage.setItem(STORAGE_KEYS.MAINTENANCE_VISITS, JSON.stringify(updatedVisits));

        // Also update the plate-based storage
        const syncedVisit = updatedVisits.find((visit) => visit.id === id);
        if (syncedVisit) {
          try {
            // Get the vehicle to find the license plate
            const vehicles = await this.getAllVehiclesWithMetadata();
            const vehicle = vehicles.find((v) => v.id === syncedVisit.vehicleId);
            if (vehicle) {
              await PlateBasedStorageService.markRecordAsSynced(
                vehicle.licensePlate,
                syncedVisit.mileage
              );
            }
          } catch (error) {
            console.warn('Failed to sync plate-based storage:', error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to mark as synced:', error);
    }
  }

  private getTableNameFromType(type: string): string {
    switch (type) {
      case 'vehicle':
        return 'vehicles';
      case 'visit':
        return 'maintenance_visits';
      case 'service':
        return 'maintenance_services';
      default:
        return type;
    }
  }

  private async getAllVehiclesWithMetadata(): Promise<StoredVehicle[]> {
    const vehiclesJson = await AsyncStorage.getItem(STORAGE_KEYS.VEHICLES);
    return vehiclesJson ? JSON.parse(vehiclesJson) : [];
  }

  private async getAllMaintenanceVisitsWithMetadata(): Promise<StoredMaintenanceVisit[]> {
    const visitsJson = await AsyncStorage.getItem(STORAGE_KEYS.MAINTENANCE_VISITS);
    return visitsJson ? JSON.parse(visitsJson) : [];
  }

  async clearAllData(): Promise<void> {
    await this.ensureInitialized();

    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.VEHICLES,
        STORAGE_KEYS.MAINTENANCE_VISITS,
        STORAGE_KEYS.UNSYNCED_RECORDS,
      ]);

      // Reinitialize with empty data
      await this.initializeStorage();
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }

  // Vehicle operations
  async checkLicensePlateExists(licensePlate: string, excludeId?: string): Promise<boolean> {
    await this.ensureInitialized();

    try {
      const vehicles = await this.getAllVehicles();
      const normalizedPlate = licensePlate.toUpperCase().trim();

      return vehicles.some(
        (vehicle) =>
          vehicle.licensePlate.toUpperCase().trim() === normalizedPlate && vehicle.id !== excludeId
      );
    } catch (error) {
      console.error('Failed to check license plate:', error);
      return false;
    }
  }
}

export const databaseService = new DatabaseService();
