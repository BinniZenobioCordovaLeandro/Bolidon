import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { databaseService } from '../services/DatabaseService';
import { PlateBasedStorageService } from '../services/PlateBasedStorageService';
import { registerBackgroundSync } from '../services/SyncService';
import {
  addMaintenanceVisitAtom,
  addVehicleAtom,
  clearErrorAtom,
  errorAtom,
  isLoadingAtom,
  maintenanceVisitsAtom,
  vehiclesAtom,
} from '../store/atoms';
import type { MaintenanceService, MaintenanceVisit, Vehicle } from '../types';
import { getDeviceIdentifierWithFallback } from '../utils/deviceIdentifier';
import type { MaintenanceFormData } from '../utils/zodSchemas';

export const useMaintenanceStore = () => {
  const [vehicles, setVehicles] = useAtom(vehiclesAtom);
  const [maintenanceVisits, setMaintenanceVisits] = useAtom(maintenanceVisitsAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorAtom);

  const addVehicle = useSetAtom(addVehicleAtom);
  const addMaintenanceVisit = useSetAtom(addMaintenanceVisitAtom);
  const clearError = useSetAtom(clearErrorAtom);

  const initializeApp = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await databaseService.initializeDatabase();
      console.log('Database initialized successfully');

      const [vehiclesData, visitsData] = await Promise.all([
        databaseService.getAllVehicles(),
        databaseService.getAllMaintenanceVisits(),
      ]);

      setVehicles(vehiclesData);
      setMaintenanceVisits(visitsData);

      console.log('App initialized successfully');
    } catch (err) {
      console.error('App initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize app');
    } finally {
      setIsLoading(false);
    }
  }, [setVehicles, setMaintenanceVisits, setIsLoading, setError]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    const setupBackgroundSync = async () => {
      try {
        console.log('Setting up background sync...');
        await registerBackgroundSync();
      } catch (error) {
        console.error('Failed to setup background sync:', error);
      }
    };

    if (!isLoading && !error) {
      setupBackgroundSync();
    }
  }, [isLoading, error]);

  const handleAddVehicle = useCallback(
    async (vehicleData: Omit<Vehicle, 'id'>) => {
      try {
        setIsLoading(true);
        setError(null);

        await databaseService.initializeDatabase();
        console.log('Database ready for vehicle');

        const plateExists = await databaseService.checkLicensePlateExists(vehicleData.licensePlate);
        if (plateExists) {
          throw new Error(
            `A vehicle with license plate "${vehicleData.licensePlate}" already exists.`
          );
        }

        const newVehicle = await addVehicle(vehicleData);
        console.log('Vehicle added to store:', newVehicle.id);

        await databaseService.saveVehicle(newVehicle);
        console.log('Vehicle saved to database');

        return newVehicle;
      } catch (err) {
        console.error('Failed to add vehicle:', err);
        setError(err instanceof Error ? err.message : 'Failed to add vehicle');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addVehicle, setIsLoading, setError]
  );

  const handleAddMaintenanceRecord = useCallback(
    async (formData: MaintenanceFormData) => {
      try {
        setIsLoading(true);
        setError(null);

        await databaseService.initializeDatabase();
        console.log('Database ready for maintenance record');

        // Get device identifier for tracking record origin
        const deviceIdentifierResult = await getDeviceIdentifierWithFallback();
        const deviceId = deviceIdentifierResult.deviceId || undefined;

        let vehicle = vehicles.find(
          (v) => v.licensePlate.toUpperCase() === formData.licensePlate.toUpperCase()
        );

        if (!vehicle) {
          const newVehicleData: Omit<Vehicle, 'id'> = {
            licensePlate: formData.licensePlate.toUpperCase(),
          };
          console.log('Creating new vehicle for plate:', formData.licensePlate);
          vehicle = await handleAddVehicle(newVehicleData);
        }

        const services: MaintenanceService[] = formData.services.map((selectedService, index) => ({
          id: `${Date.now()}_${index}`,
          vehicleId: vehicle?.id,
          serviceType: selectedService.serviceType,
          date: new Date(formData.date),
          mileage: parseInt(formData.mileage),
          nextServiceMileage: formData.nextServiceMileage
            ? parseInt(formData.nextServiceMileage)
            : undefined,
          nextServiceDate: formData.nextServiceDate
            ? new Date(formData.nextServiceDate)
            : undefined,
          notes: selectedService.description,
          createdAt: new Date(),
          updatedAt: new Date(),
          inCloud: false,
          deviceId,
        }));

        const visitData: Omit<MaintenanceVisit, 'id' | 'createdAt' | 'updatedAt'> = {
          vehicleId: vehicle.id,
          services,
          totalCost: parseFloat(formData.totalCost),
          date: new Date(formData.date),
          mileage: parseInt(formData.mileage),
          nextServiceMileage: formData.nextServiceMileage
            ? parseInt(formData.nextServiceMileage)
            : undefined,
          nextServiceDate: formData.nextServiceDate
            ? new Date(formData.nextServiceDate)
            : undefined,
          generalNotes: formData.generalNotes,
          inCloud: false,
          deviceId,
        };

        const newVisit = await addMaintenanceVisit(visitData);

        await databaseService.saveMaintenanceVisit(newVisit);

        await PlateBasedStorageService.saveMaintenanceRecord(
          vehicle.licensePlate,
          parseInt(formData.mileage),
          newVisit
        );

        const newMileage = parseInt(formData.mileage);

        if (!vehicle.mileage || newMileage > vehicle.mileage) {
          const updatedVehicle = { ...vehicle, mileage: newMileage };
          await databaseService.saveVehicle(updatedVehicle);

          setVehicles((prev) => prev.map((v) => (v.id === vehicle?.id ? updatedVehicle : v)));
        }

        return newVisit;
      } catch (err) {
        console.error('Failed to add maintenance record:', err);
        setError(err instanceof Error ? err.message : 'Failed to add maintenance record');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [
      addMaintenanceVisit,
      vehicles,
      setVehicles,
      setIsLoading,
      setError,
      handleAddVehicle,
    ]
  );

  const getMaintenanceByVehicle = useCallback(
    (vehicleId: string) => {
      return maintenanceVisits.filter((visit) => visit.vehicleId === vehicleId);
    },
    [maintenanceVisits]
  );

  const getVehicleById = useCallback(
    (vehicleId: string) => {
      return vehicles.find((vehicle) => vehicle.id === vehicleId);
    },
    [vehicles]
  );

  return {
    vehicles,
    maintenanceVisits,

    isLoading,
    error,

    initializeApp,
    addVehicle: handleAddVehicle,
    addMaintenanceRecord: handleAddMaintenanceRecord,
    clearError,

    getMaintenanceByVehicle,
    getVehicleById,
  };
};
