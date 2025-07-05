import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { MaintenanceVisit, SelectedService, Vehicle } from '../types';

// Core data atoms
export const vehiclesAtom = atom<Vehicle[]>([]);
export const maintenanceVisitsAtom = atom<MaintenanceVisit[]>([]);

// UI state atoms
export const isLoadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);
export const isOnlineAtom = atom<boolean>(true);

// Form state atoms
export const currentServicesAtom = atom<SelectedService[]>([]);

// Sync state atoms
export const lastSyncAtom = atomWithStorage<Date | null>('lastSync', null);
export const pendingSyncAtom = atom<boolean>(false);

// Actions atoms
export const addVehicleAtom = atom(null, async (get, set, vehicle: Omit<Vehicle, 'id'>) => {
  const newVehicle: Vehicle = {
    ...vehicle,
    id: Date.now().toString(),
  };

  const currentVehicles = get(vehiclesAtom);
  set(vehiclesAtom, [...currentVehicles, newVehicle]);

  return newVehicle;
});

export const addMaintenanceVisitAtom = atom(
  null,
  async (get, set, visit: Omit<MaintenanceVisit, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newVisit: MaintenanceVisit = {
      ...visit,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const currentVisits = get(maintenanceVisitsAtom);
    set(maintenanceVisitsAtom, [newVisit, ...currentVisits]);

    return newVisit;
  }
);

export const clearErrorAtom = atom(null, (_get, set) => {
  set(errorAtom, null);
});

export const setLoadingAtom = atom(null, (_get, set, loading: boolean) => {
  set(isLoadingAtom, loading);
});
