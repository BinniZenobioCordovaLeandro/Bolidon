import type { Vehicle } from '../types';
import { databaseService } from './DatabaseService';
import { PlateBasedStorageService } from './PlateBasedStorageService';

/**
 * Migration utility service for converting existing maintenance data
 * to the new plate-based storage format
 */
export class MigrationService {
  /**
   * Migrate all existing maintenance data to plate-based storage
   */
  static async migrateAllMaintenanceData(): Promise<{
    success: boolean;
    migratedRecords: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let migratedRecords = 0;

    try {
      // Get all vehicles and maintenance visits from existing storage
      const [vehicles, maintenanceVisits] = await Promise.all([
        databaseService.getAllVehicles(),
        databaseService.getAllMaintenanceVisits(),
      ]);

      console.log(
        `Starting migration: ${vehicles.length} vehicles, ${maintenanceVisits.length} visits`
      );

      // Create a map of vehicle ID to vehicle for quick lookup
      const vehicleMap = new Map<string, Vehicle>();
      vehicles.forEach((vehicle) => {
        vehicleMap.set(vehicle.id, vehicle);
      });

      // Migrate each maintenance visit
      for (const visit of maintenanceVisits) {
        try {
          const vehicle = vehicleMap.get(visit.vehicleId);

          if (!vehicle) {
            errors.push(`Vehicle not found for maintenance visit: ${visit.id}`);
            continue;
          }

          // Save to plate-based storage
          await PlateBasedStorageService.saveMaintenanceRecord(
            vehicle.licensePlate,
            visit.mileage,
            visit
          );

          migratedRecords++;

          console.log(
            `Migrated record for plate ${vehicle.licensePlate} at mileage ${visit.mileage}`
          );
        } catch (error) {
          const errorMessage = `Failed to migrate visit ${visit.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMessage);
          console.error(errorMessage);
        }
      }

      const success = errors.length === 0;
      console.log(
        `Migration completed: ${migratedRecords} records migrated, ${errors.length} errors`
      );

      return {
        success,
        migratedRecords,
        errors,
      };
    } catch (error) {
      const errorMessage = `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMessage);
      console.error(errorMessage);

      return {
        success: false,
        migratedRecords,
        errors,
      };
    }
  }

  /**
   * Migrate maintenance data for a specific vehicle
   */
  static async migrateVehicleMaintenanceData(vehicleId: string): Promise<{
    success: boolean;
    migratedRecords: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let migratedRecords = 0;

    try {
      // Get the vehicle
      const vehicles = await databaseService.getAllVehicles();
      const vehicle = vehicles.find((v) => v.id === vehicleId);

      if (!vehicle) {
        errors.push(`Vehicle not found: ${vehicleId}`);
        return { success: false, migratedRecords: 0, errors };
      }

      // Get maintenance visits for this vehicle
      const allVisits = await databaseService.getAllMaintenanceVisits();
      const vehicleVisits = allVisits.filter((visit) => visit.vehicleId === vehicleId);

      console.log(`Migrating ${vehicleVisits.length} visits for vehicle ${vehicle.licensePlate}`);

      // Migrate each visit
      for (const visit of vehicleVisits) {
        try {
          await PlateBasedStorageService.saveMaintenanceRecord(
            vehicle.licensePlate,
            visit.mileage,
            visit
          );

          migratedRecords++;
          console.log(
            `Migrated record for plate ${vehicle.licensePlate} at mileage ${visit.mileage}`
          );
        } catch (error) {
          const errorMessage = `Failed to migrate visit ${visit.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMessage);
          console.error(errorMessage);
        }
      }

      return {
        success: errors.length === 0,
        migratedRecords,
        errors,
      };
    } catch (error) {
      const errorMessage = `Migration failed for vehicle ${vehicleId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMessage);
      console.error(errorMessage);

      return {
        success: false,
        migratedRecords,
        errors,
      };
    }
  }

  /**
   * Check if migration is needed by comparing data between storage systems
   */
  static async checkMigrationStatus(): Promise<{
    needsMigration: boolean;
    originalRecords: number;
    plateBasedRecords: number;
    plateBasedPlates: number;
  }> {
    try {
      // Get counts from original storage
      const maintenanceVisits = await databaseService.getAllMaintenanceVisits();
      const originalRecords = maintenanceVisits.length;

      // Get counts from plate-based storage
      const storageStats = await PlateBasedStorageService.getStorageStats();
      const plateBasedRecords = storageStats.totalRecords;
      const plateBasedPlates = storageStats.totalPlates;

      // Migration is needed if there are more records in original storage
      const needsMigration = originalRecords > plateBasedRecords;

      return {
        needsMigration,
        originalRecords,
        plateBasedRecords,
        plateBasedPlates,
      };
    } catch (error) {
      console.error('Failed to check migration status:', error);
      return {
        needsMigration: false,
        originalRecords: 0,
        plateBasedRecords: 0,
        plateBasedPlates: 0,
      };
    }
  }

  /**
   * Validate data integrity between storage systems
   */
  static async validateDataIntegrity(): Promise<{
    isValid: boolean;
    missingRecords: Array<{
      visitId: string;
      licensePlate: string;
      mileage: number;
    }>;
    issues: string[];
  }> {
    const missingRecords: Array<{
      visitId: string;
      licensePlate: string;
      mileage: number;
    }> = [];
    const issues: string[] = [];

    try {
      // Get all data from original storage
      const [vehicles, maintenanceVisits] = await Promise.all([
        databaseService.getAllVehicles(),
        databaseService.getAllMaintenanceVisits(),
      ]);

      // Create vehicle lookup map
      const vehicleMap = new Map<string, Vehicle>();
      vehicles.forEach((vehicle) => {
        vehicleMap.set(vehicle.id, vehicle);
      });

      // Check each maintenance visit
      for (const visit of maintenanceVisits) {
        const vehicle = vehicleMap.get(visit.vehicleId);

        if (!vehicle) {
          issues.push(`Vehicle not found for visit ${visit.id}`);
          continue;
        }

        // Check if record exists in plate-based storage
        const plateRecord = await PlateBasedStorageService.getMaintenanceAtMileage(
          vehicle.licensePlate,
          visit.mileage
        );

        if (!plateRecord) {
          missingRecords.push({
            visitId: visit.id,
            licensePlate: vehicle.licensePlate,
            mileage: visit.mileage,
          });
        } else {
          // Validate record integrity
          if (plateRecord.id !== visit.id) {
            issues.push(
              `ID mismatch for ${vehicle.licensePlate} at ${visit.mileage}: ${plateRecord.id} vs ${visit.id}`
            );
          }

          if (plateRecord.totalCost !== visit.totalCost) {
            issues.push(
              `Cost mismatch for ${vehicle.licensePlate} at ${visit.mileage}: ${plateRecord.totalCost} vs ${visit.totalCost}`
            );
          }
        }
      }

      const isValid = missingRecords.length === 0 && issues.length === 0;

      console.log(`Data validation completed: ${isValid ? 'VALID' : 'ISSUES FOUND'}`);
      console.log(`Missing records: ${missingRecords.length}, Issues: ${issues.length}`);

      return {
        isValid,
        missingRecords,
        issues,
      };
    } catch (error) {
      const errorMessage = `Data validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      issues.push(errorMessage);
      console.error(errorMessage);

      return {
        isValid: false,
        missingRecords,
        issues,
      };
    }
  }

  /**
   * Get migration statistics and recommendations
   */
  static async getMigrationReport(): Promise<{
    status: 'not_needed' | 'recommended' | 'required';
    originalStorage: {
      vehicles: number;
      visits: number;
    };
    plateBasedStorage: {
      plates: number;
      records: number;
      storageSize: number;
    };
    recommendations: string[];
  }> {
    try {
      const [migrationStatus, storageStats, vehicles] = await Promise.all([
        MigrationService.checkMigrationStatus(),
        PlateBasedStorageService.getStorageStats(),
        databaseService.getAllVehicles(),
      ]);

      const recommendations: string[] = [];

      let status: 'not_needed' | 'recommended' | 'required' = 'not_needed';

      if (migrationStatus.needsMigration) {
        if (migrationStatus.originalRecords > 0 && migrationStatus.plateBasedRecords === 0) {
          status = 'required';
          recommendations.push('Migration is required - no data found in plate-based storage');
        } else if (migrationStatus.originalRecords > migrationStatus.plateBasedRecords) {
          status = 'recommended';
          recommendations.push(
            `Migration recommended - ${migrationStatus.originalRecords - migrationStatus.plateBasedRecords} records missing from plate-based storage`
          );
        }
      }

      if (storageStats.unsyncedPlates > 0) {
        recommendations.push(`${storageStats.unsyncedPlates} plates have unsynced data`);
      }

      if (migrationStatus.originalRecords === 0 && migrationStatus.plateBasedRecords === 0) {
        recommendations.push('No maintenance data found in either storage system');
      }

      return {
        status,
        originalStorage: {
          vehicles: vehicles.length,
          visits: migrationStatus.originalRecords,
        },
        plateBasedStorage: {
          plates: storageStats.totalPlates,
          records: storageStats.totalRecords,
          storageSize: storageStats.storageSize,
        },
        recommendations,
      };
    } catch (error) {
      console.error('Failed to generate migration report:', error);
      return {
        status: 'required',
        originalStorage: { vehicles: 0, visits: 0 },
        plateBasedStorage: { plates: 0, records: 0, storageSize: 0 },
        recommendations: ['Error generating report - migration may be needed'],
      };
    }
  }
}
