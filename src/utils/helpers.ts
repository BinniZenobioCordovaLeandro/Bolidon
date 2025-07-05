import { ServiceType, type ServiceTypeOption } from '../types';

/**
 * Service type options with labels and icons for the UI
 */
export const SERVICE_TYPE_OPTIONS: ServiceTypeOption[] = [
  { value: ServiceType.OIL_CHANGE, label: 'Cambio de aceite', icon: 'local-gas-station' },
  { value: ServiceType.TIRE_ROTATION, label: 'Rotación de neumáticos', icon: 'track-changes' },
  { value: ServiceType.BRAKE_SERVICE, label: 'Servicio de frenos', icon: 'warning' },
  { value: ServiceType.TRANSMISSION_SERVICE, label: 'Servicio de transmisión', icon: 'settings' },
  { value: ServiceType.ENGINE_TUNE_UP, label: 'Ajuste de motor', icon: 'tune' },
  { value: ServiceType.AIR_FILTER, label: 'Filtro de aire', icon: 'air' },
  { value: ServiceType.FUEL_FILTER, label: 'Filtro de combustible', icon: 'local-gas-station' },
  { value: ServiceType.SPARK_PLUGS, label: 'Bujías', icon: 'flash-on' },
  { value: ServiceType.BATTERY_SERVICE, label: 'Servicio de batería', icon: 'battery-charging-full' },
  { value: ServiceType.COOLING_SYSTEM, label: 'Sistema de enfriamiento', icon: 'ac-unit' },
  { value: ServiceType.SUSPENSION, label: 'Suspensión', icon: 'directions-car' },
  { value: ServiceType.EXHAUST_SYSTEM, label: 'Sistema de escape', icon: 'cloud' },
  { value: ServiceType.ELECTRICAL, label: 'Sistema eléctrico', icon: 'electrical-services' },
  { value: ServiceType.OTHER, label: 'Otro', icon: 'build' },
];

/**
 * Format currency value for display
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Format mileage for display
 */
export const formatMileage = (mileage: number): string => {
  return `${new Intl.NumberFormat('en-US').format(mileage)} miles`;
};

/**
 * Validate VIN number (basic validation)
 */
export const isValidVIN = (vin: string): boolean => {
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
  return vinRegex.test(vin);
};

/**
 * Validate license plate (basic validation)
 */
export const isValidLicensePlate = (plate: string): boolean => {
  const plateRegex = /^[A-Z0-9\-\s]{2,10}$/i;
  return plateRegex.test(plate);
};

/**
 * Get service type label by value
 */
export const getServiceTypeLabel = (serviceType: ServiceType): string => {
  const option = SERVICE_TYPE_OPTIONS.find((opt) => opt.value === serviceType);
  return option?.label || serviceType;
};

/**
 * Get service type icon by value
 */
export const getServiceTypeIcon = (serviceType: ServiceType): string => {
  const option = SERVICE_TYPE_OPTIONS.find((opt) => opt.value === serviceType);
  return option?.icon || 'wrench';
};
