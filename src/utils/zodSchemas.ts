import { z } from 'zod';
import { ServiceType } from '../types';
import { isValidLicensePlate } from './helpers';

/**
 * Esquema de validación Zod para placas de vehículo
 */
const licensePlateSchema = z
  .string()
  .min(1, 'La placa del vehículo es requerida')
  .refine((value: string) => isValidLicensePlate(value), {
    message: 'Formato de placa inválido',
  });

/**
 * Esquema de validación Zod para vehículo - Registro sin fricción con solo placa requerida
 */
export const vehicleSchema = z.object({
  licensePlate: licensePlateSchema,
  nickname: z.string().max(50, 'El apodo no puede exceder 50 caracteres').optional(),
  mileage: z
    .number()
    .min(0, 'El kilometraje no puede ser negativo')
    .max(999999, 'El kilometraje no puede exceder 999,999')
    .optional(),
  make: z
    .string()
    .min(2, 'La marca debe tener al menos 2 caracteres')
    .max(50, 'La marca no puede exceder 50 caracteres')
    .optional(),
  model: z
    .string()
    .min(1, 'El modelo debe tener al menos 1 caracter')
    .max(50, 'El modelo no puede exceder 50 caracteres')
    .optional(),
  year: z
    .number()
    .min(1900, 'El año debe ser 1900 o posterior')
    .max(new Date().getFullYear() + 1, 'El año no puede ser futuro')
    .optional(),
  vin: z.string().length(17, 'El VIN debe tener exactamente 17 caracteres').optional(),
});

/**
 * Esquema de validación Zod para servicio seleccionado
 */
export const selectedServiceSchema = z.object({
  serviceType: z.nativeEnum(ServiceType, {
    errorMap: () => ({ message: 'Tipo de servicio inválido' }),
  }),
  description: z
    .string()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(300, 'La descripción no puede exceder 300 caracteres'),
});

/**
 * Esquema base de validación Zod para formulario de mantenimiento (sin superRefine)
 */
const baseMaintenanceFormSchema = z.object({
  licensePlate: licensePlateSchema,
  services: z
    .array(selectedServiceSchema)
    .min(1, 'Debe seleccionar al menos un servicio')
    .max(15, 'No puede exceder 15 servicios por visita'),
  totalCost: z
    .string()
    .min(1, 'El costo total es requerido')
    .refine(
      (value: string) => {
        const numValue = parseFloat(value);
        return !Number.isNaN(numValue) && numValue > 0 && numValue <= 99999;
      },
      {
        message: 'El costo total debe ser un número válido mayor a 0',
      }
    ),
  date: z
    .string()
    .min(1, 'La fecha es requerida')
    .refine(
      (value: string) => {
        const date = new Date(value);
        return date <= new Date();
      },
      {
        message: 'La fecha no puede ser futura',
      }
    ),
  mileage: z
    .string()
    .min(1, 'El kilometraje es requerido')
    .refine(
      (value: string) => {
        const numValue = parseInt(value, 10);
        return !Number.isNaN(numValue) && numValue >= 0 && numValue <= 999999;
      },
      {
        message: 'El kilometraje debe ser un número válido',
      }
    ),
  nextServiceMileage: z.string().optional(),
  nextServiceDate: z
    .string()
    .optional()
    .refine(
      (value: string | undefined) => {
        if (!value) return true;
        const date = new Date(value);
        return date > new Date();
      },
      {
        message: 'La próxima fecha de servicio debe ser futura',
      }
    ),
  generalNotes: z
    .string()
    .max(500, 'Las notas generales no pueden exceder 500 caracteres')
    .optional(),
});

/**
 * Esquema de validación Zod para formulario de mantenimiento con validación cruzada
 */
export const maintenanceFormSchema = baseMaintenanceFormSchema.superRefine((data, ctx) => {
  // Validación personalizada para nextServiceMileage
  if (data.nextServiceMileage) {
    const currentMileage = parseInt(data.mileage, 10);
    const nextMileage = parseInt(data.nextServiceMileage, 10);

    if (Number.isNaN(nextMileage) || nextMileage <= currentMileage || nextMileage > 999999) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nextServiceMileage'],
        message: 'El próximo kilometraje de servicio debe ser mayor al actual',
      });
    }
  }
});

/**
 * Tipos TypeScript inferidos de los esquemas Zod
 */
export type VehicleFormData = z.infer<typeof vehicleSchema>;
export type SelectedServiceFormData = z.infer<typeof selectedServiceSchema>;
export type MaintenanceFormData = z.infer<typeof maintenanceFormSchema>;

/**
 * Esquemas para validación de campos individuales (útil para validación en tiempo real)
 */
export const fieldSchemas = {
  licensePlate: licensePlateSchema,
  nickname: vehicleSchema.shape.nickname,
  mileage: vehicleSchema.shape.mileage,
  make: vehicleSchema.shape.make,
  model: vehicleSchema.shape.model,
  year: vehicleSchema.shape.year,
  vin: vehicleSchema.shape.vin,
  serviceType: selectedServiceSchema.shape.serviceType,
  description: selectedServiceSchema.shape.description,
  totalCost: baseMaintenanceFormSchema.shape.totalCost,
  date: baseMaintenanceFormSchema.shape.date,
  nextServiceMileage: baseMaintenanceFormSchema.shape.nextServiceMileage,
  nextServiceDate: baseMaintenanceFormSchema.shape.nextServiceDate,
  generalNotes: baseMaintenanceFormSchema.shape.generalNotes,
};
