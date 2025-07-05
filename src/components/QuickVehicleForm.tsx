import type React from 'react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useZodForm } from '../hooks/useZodForm';
import { spacing, typography } from '../styles/tokens';
import type { Vehicle } from '../types';
import { type VehicleFormData, vehicleSchema } from '../utils/zodSchemas';
import { CustomButton } from './CustomButton';
import { CustomInput } from './CustomInput';

interface QuickVehicleFormProps {
  onSubmit: (data: Omit<Vehicle, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Formulario de registro de vehículo sin fricciones
 * Solo requiere placa - todo lo demás es opcional y se puede agregar después
 */
export const QuickVehicleForm: React.FC<QuickVehicleFormProps> = ({
  onSubmit,
  onCancel,
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
      ...common.flexGrow1,
      justifyContent: 'space-between' as const,
      ...common.paddingLg,
    },
    form: {
      ...common.flex1,
    },
    title: {
      ...common.textXxxl,
      ...common.textBold,
      color: theme.primary,
      ...common.marginBottomSm,
      ...common.textCenter,
    },
    subtitle: {
      ...common.textLg,
      color: theme.onSurfaceVariant,
      marginBottom: spacing.xxxl,
      ...common.textCenter,
      lineHeight: typography.lineHeight.lg,
    },
    note: {
      ...common.textSm,
      color: theme.onSurfaceVariant,
      ...common.marginTopLg,
      ...common.textCenter,
      lineHeight: typography.lineHeight.md,
      fontStyle: 'italic' as const,
    },
    actions: {
      marginTop: spacing.xxxl,
      gap: spacing.md,
    },
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useZodForm(vehicleSchema, {
    defaultValues: {
      licensePlate: '',
      nickname: '',
    },
  });

  const handleFormSubmit = async (data: VehicleFormData) => {
    try {
      setIsSubmitting(true);

      const vehicleData: Omit<Vehicle, 'id'> = {
        licensePlate: data.licensePlate.toUpperCase().trim(),
        nickname: data.nickname?.trim() || undefined,
      };

      await onSubmit(vehicleData);

      Alert.alert('Éxito', '¡Vehículo agregado! Puedes agregar más detalles después.', [
        { text: 'OK' },
      ]);
    } catch (_error) {
      Alert.alert('Error', 'Error al agregar vehículo. Por favor, intenta de nuevo.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.title}>Registro Rápido de Vehículo</Text>
          <Text style={styles.subtitle}>
            Solo ingresa tu placa para comenzar. Puedes agregar más detalles después.
          </Text>

          {/* Placa - REQUERIDA */}
          <Controller
            control={control}
            name="licensePlate"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="Placa *"
                value={value}
                onChangeText={onChange}
                placeholder="ej., ABC123"
                error={errors.licensePlate?.message}
                icon="directions-car"
              />
            )}
          />

          {/* Apodo - OPCIONAL */}
          <Controller
            control={control}
            name="nickname"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="Apodo (Opcional)"
                value={value || ''}
                onChangeText={onChange}
                placeholder="ej., Mi Carro, Camión de Trabajo"
                error={errors.nickname?.message}
                icon="label"
              />
            )}
          />

          <Text style={styles.note}>
            💡 Puedes agregar marca, modelo, año, kilometraje y otros detalles más tarde en
            configuración de vehículos.
          </Text>
        </View>

        <View style={styles.actions}>
          <CustomButton
            title="Agregar Vehículo"
            onPress={handleSubmit(handleFormSubmit)}
            disabled={!isValid || isSubmitting || isLoading}
            loading={isSubmitting || isLoading}
            variant="primary"
            icon="add"
          />

          <CustomButton
            title="Cancelar"
            onPress={onCancel}
            disabled={isSubmitting || isLoading}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
