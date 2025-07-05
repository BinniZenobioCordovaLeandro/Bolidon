export interface Vehicle {
  id: string;
  licensePlate: string; // Required: unique identifier, used as primary key
  nickname?: string; // Optional: user-friendly name like "My Car", "Work Truck"
  mileage?: number; // Optional: current mileage, can be added later
  make?: string; // Optional: can be added later
  model?: string; // Optional: can be added later
  year?: number; // Optional: can be added later
  vin?: string; // Optional: can be added later
  brand?: string; // Optional: vehicle brand/manufacturer
  fuelType?: string; // Optional: fuel type (gasoline, diesel, electric, hybrid, etc.)
  color?: string; // Optional: vehicle color
}

export interface MaintenanceService {
  id: string;
  vehicleId: string;
  serviceType: ServiceType;
  date: Date;
  mileage: number;
  nextServiceMileage?: number;
  nextServiceDate?: Date;
  notes?: string;
  receipts?: string[];
  createdAt: Date;
  updatedAt: Date;
  inCloud: boolean;
  deviceId?: string; // Device identifier for tracking record origin
}

export interface MaintenanceVisit {
  id: string;
  vehicleId: string;
  services: MaintenanceService[];
  totalCost: number;
  date: Date;
  mileage: number;
  nextServiceMileage?: number;
  nextServiceDate?: Date;
  generalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  inCloud: boolean;
  deviceId?: string; // Device identifier for tracking record origin
}

export interface SelectedService {
  serviceType: ServiceType;
  description: string; // Combined description and notes field
}

export enum ServiceType {
  OIL_CHANGE = 'oil_change',
  TIRE_ROTATION = 'tire_rotation',
  BRAKE_SERVICE = 'brake_service',
  TRANSMISSION_SERVICE = 'transmission_service',
  ENGINE_TUNE_UP = 'engine_tune_up',
  AIR_FILTER = 'air_filter',
  FUEL_FILTER = 'fuel_filter',
  SPARK_PLUGS = 'spark_plugs',
  BATTERY_SERVICE = 'battery_service',
  COOLING_SYSTEM = 'cooling_system',
  SUSPENSION = 'suspension',
  EXHAUST_SYSTEM = 'exhaust_system',
  ELECTRICAL = 'electrical',
  OTHER = 'other',
}

export interface ServiceTypeOption {
  value: ServiceType;
  label: string;
  icon: string;
}
