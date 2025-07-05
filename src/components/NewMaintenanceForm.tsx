import type React from 'react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { CustomInput } from '../components/CustomInput';
import { MultipleServicesManager } from '../components/MultipleServicesManager';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useZodForm } from '../hooks/useZodForm';
import { spacing } from '../styles/tokens';
import { formatCurrency } from '../utils/helpers';
import { type MaintenanceFormData, maintenanceFormSchema } from '../utils/zodSchemas';

interface MaintenanceFormProps {
  onSubmit: (data: MaintenanceFormData) => Promise<void>;
  isLoading?: boolean;
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, common } = useThemedStyles();

  const styles = {
    container: {
      ...common.flex1,
      backgroundColor: theme.background,
    },
    scrollView: {
      ...common.flex1,
    },
    scrollContent: {
      paddingBottom: spacing.lg,
    },
    form: {
      ...common.paddingLg,
    },
    buttonContainer: {
      ...common.marginTopLg,
      ...common.marginBottomLg,
    },
    totalCostDisplay: {
      ...common.row,
      ...common.justifyCenter,
      ...common.itemsCenter,
      ...common.marginTopMd,
      ...common.paddingMd,
      backgroundColor: `${theme.info}20`, // Add transparency
      ...common.roundedLg,
    },
    totalCostLabel: {
      ...common.textLg,
      ...common.textMedium,
      color: theme.info,
    },
    totalCostValue: {
      ...common.textXl,
      ...common.textBold,
      color: theme.info,
    },
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useZodForm(maintenanceFormSchema, {
    defaultValues: {
      licensePlate: '',
      services: [],
      totalCost: '',
      date: new Date().toISOString().split('T')[0], // Fecha de hoy
      mileage: '',
      nextServiceMileage: '',
      nextServiceDate: '',
      generalNotes: '',
    },
  });

  const currentMileage = watch('mileage');
  const services = watch('services');
  const totalCost = watch('totalCost');

  const handleFormSubmit = async (data: MaintenanceFormData) => {
    setIsSubmitting(true);
    await onSubmit(data);
    reset();
    setIsSubmitting(false);
  };

  return (
    <View style={styles.form}>
      {/* Placa del Vehículo */}
      <Controller
        control={control}
        name="licensePlate"
        render={({ field: { value, onChange } }) => (
          <CustomInput
            label="Placa del Vehículo"
            value={value}
            onChangeText={(text) => onChange(text.toUpperCase())}
            error={errors.licensePlate?.message}
            icon="drive-eta"
            placeholder="ABC123"
          />
        )}
      />

      {/* Gestión de Múltiples Servicios */}
      <Controller
        control={control}
        name="services"
        render={({ field: { value, onChange } }) => (
          <MultipleServicesManager
            services={value}
            onServicesChange={onChange}
            error={errors.services?.message}
          />
        )}
      />

      {/* Costo Total */}
      <Controller
        control={control}
        name="totalCost"
        render={({ field: { value, onChange } }) => (
          <CustomInput
            label="Costo Total de la Visita"
            value={value}
            onChangeText={onChange}
            error={errors.totalCost?.message}
            icon="attach-money"
            placeholder="0.00"
            keyboardType="numeric"
          />
        )}
      />

      {/* Fecha del Servicio */}
      <Controller
        control={control}
        name="date"
        render={({ field: { value, onChange } }) => (
          <CustomInput
            label="Fecha del Servicio"
            value={value}
            onChangeText={onChange}
            error={errors.date?.message}
            icon="calendar-today"
            placeholder="AAAA-MM-DD"
          />
        )}
      />

      {/* Kilometraje Actual */}
      <Controller
        control={control}
        name="mileage"
        render={({ field: { value, onChange } }) => (
          <CustomInput
            label="Kilometraje Actual"
            value={value}
            onChangeText={onChange}
            placeholder="0"
            error={errors.mileage?.message}
            keyboardType="numeric"
            icon="speed"
          />
        )}
      />

      {/* Próximo Kilometraje de Servicio (Opcional) */}
      <Controller
        control={control}
        name="nextServiceMileage"
        render={({ field: { value, onChange } }) => (
          <CustomInput
            label="Próximo Kilometraje de Servicio (Opcional)"
            value={value || ''}
            onChangeText={onChange}
            placeholder={currentMileage ? `${parseInt(currentMileage) + 5000}` : '0'}
            error={errors.nextServiceMileage?.message}
            keyboardType="numeric"
            icon="schedule"
          />
        )}
      />

      {/* Próxima Fecha de Servicio (Opcional) */}
      <Controller
        control={control}
        name="nextServiceDate"
        render={({ field: { value, onChange } }) => (
          <CustomInput
            label="Próxima Fecha de Servicio (Opcional)"
            value={value || ''}
            onChangeText={onChange}
            placeholder="AAAA-MM-DD"
            error={errors.nextServiceDate?.message}
            icon="event"
          />
        )}
      />

      {/* Notas Generales (Opcional) */}
      <Controller
        control={control}
        name="generalNotes"
        render={({ field: { value, onChange } }) => (
          <CustomInput
            label="Notas Generales (Opcional)"
            value={value || ''}
            onChangeText={onChange}
            placeholder="Notas generales sobre esta visita de mantenimiento..."
            error={errors.generalNotes?.message}
            icon="note"
            multiline
            numberOfLines={4}
          />
        )}
      />

      {/* Botón de Envío */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title={`Guardar Visita de Mantenimiento${services.length > 0 ? ` (${services.length} servicio${services.length > 1 ? 's' : ''})` : ''}`}
          onPress={handleSubmit(handleFormSubmit)}
          loading={isSubmitting || isLoading}
          disabled={!isValid || isSubmitting || isLoading || services.length === 0}
          icon="save"
          size="large"
          fullWidth
        />
        {totalCost && parseFloat(totalCost) > 0 && (
          <View style={styles.totalCostDisplay}>
            <Text style={styles.totalCostLabel}>Costo Total: </Text>
            <Text style={styles.totalCostValue}>{formatCurrency(parseFloat(totalCost))}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
