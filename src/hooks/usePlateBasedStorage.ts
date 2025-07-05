import { useCallback, useMemo } from 'react';
import {
  type MaintenanceRecord,
  PlateBasedStorageService,
  type PlateMaintenanceData,
} from '../services/PlateBasedStorageService';
import type { MaintenanceVisit, Vehicle } from '../types';

/**
 * Hook for managing plate-based maintenance storage
 * This provides a React-friendly interface to the PlateBasedStorageService
 */
export const usePlateBasedStorage = () => {
  /**
   * Save a maintenance record using the plate-based storage system
   */
  const saveMaintenance = useCallback(
    async (vehicle: Vehicle, maintenanceVisit: MaintenanceVisit): Promise<void> => {
      await PlateBasedStorageService.saveMaintenanceRecord(
        vehicle.licensePlate,
        maintenanceVisit.mileage,
        maintenanceVisit
      );
    },
    []
  );

  /**
   * Get all maintenance records for a specific license plate
   */
  const getMaintenanceByPlate = useCallback(
    async (licensePlate: string): Promise<PlateMaintenanceData | null> => {
      return await PlateBasedStorageService.getMaintenanceByPlate(licensePlate);
    },
    []
  );

  /**
   * Get maintenance history sorted by mileage (most recent first)
   */
  const getMaintenanceHistory = useCallback(
    async (
      licensePlate: string
    ): Promise<Array<{ mileage: number; record: MaintenanceRecord }>> => {
      return await PlateBasedStorageService.getMaintenanceHistory(licensePlate);
    },
    []
  );

  /**
   * Get maintenance record at specific mileage
   */
  const getMaintenanceAtMileage = useCallback(
    async (licensePlate: string, mileage: number): Promise<MaintenanceRecord | null> => {
      return await PlateBasedStorageService.getMaintenanceAtMileage(licensePlate, mileage);
    },
    []
  );

  /**
   * Delete maintenance record at specific mileage
   */
  const deleteMaintenance = useCallback(
    async (licensePlate: string, mileage: number): Promise<void> => {
      await PlateBasedStorageService.deleteMaintenanceRecord(licensePlate, mileage);
    },
    []
  );

  /**
   * Get all license plates that have maintenance data
   */
  const getAllPlatesWithMaintenance = useCallback(async (): Promise<string[]> => {
    return await PlateBasedStorageService.getAllPlatesWithMaintenance();
  }, []);

  /**
   * Get sync status for all plates
   */
  const getSyncStatus = useCallback(async () => {
    return await PlateBasedStorageService.getSyncStatus();
  }, []);

  /**
   * Mark a plate's data as synced to cloud
   */
  const markAsSynced = useCallback(async (licensePlate: string): Promise<void> => {
    await PlateBasedStorageService.markAsSynced(licensePlate);
  }, []);

  /**
   * Clear all maintenance data for a specific plate
   */
  const clearPlateData = useCallback(async (licensePlate: string): Promise<void> => {
    await PlateBasedStorageService.clearPlateData(licensePlate);
  }, []);

  /**
   * Get storage usage statistics
   */
  const getStorageStats = useCallback(async () => {
    return await PlateBasedStorageService.getStorageStats();
  }, []);

  /**
   * Migrate existing maintenance visit to plate-based storage
   */
  const migrateFromMaintenanceVisit = useCallback(
    async (vehicle: Vehicle, maintenanceVisit: MaintenanceVisit): Promise<void> => {
      await PlateBasedStorageService.migrateFromMaintenanceVisit(vehicle, maintenanceVisit);
    },
    []
  );

  /**
   * Mark a specific maintenance record as synced
   */
  const markRecordAsSynced = useCallback(
    async (licensePlate: string, mileage: number): Promise<void> => {
      await PlateBasedStorageService.markRecordAsSynced(licensePlate, mileage);
    },
    []
  );

  /**
   * Mark all maintenance records for a plate as synced
   */
  const markPlateAsSynced = useCallback(async (licensePlate: string): Promise<void> => {
    await PlateBasedStorageService.markAsSynced(licensePlate);
  }, []);

  /**
   * Debug method to check sync status of all records in a plate
   */
  const debugSyncStatus = useCallback(async (licensePlate: string): Promise<void> => {
    await PlateBasedStorageService.debugSyncStatus(licensePlate);
  }, []);

  return useMemo(
    () => ({
      // Core operations
      saveMaintenance,
      getMaintenanceByPlate,
      getMaintenanceHistory,
      getMaintenanceAtMileage,
      deleteMaintenance,

      // Management operations
      getAllPlatesWithMaintenance,
      getSyncStatus,
      markAsSynced,
      clearPlateData,
      getStorageStats,

      // Migration
      migrateFromMaintenanceVisit,

      // Sync operations
      markRecordAsSynced,
      markPlateAsSynced,

      // Debug
      debugSyncStatus,
    }),
    [
      saveMaintenance,
      getMaintenanceByPlate,
      getMaintenanceHistory,
      getMaintenanceAtMileage,
      deleteMaintenance,
      getAllPlatesWithMaintenance,
      getSyncStatus,
      markAsSynced,
      clearPlateData,
      getStorageStats,
      migrateFromMaintenanceVisit,
      markRecordAsSynced,
      markPlateAsSynced,
      debugSyncStatus,
    ]
  );
};
