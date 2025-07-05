import type React from 'react';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type SelectedService, ServiceType } from '../types';
import { getServiceTypeLabel } from '../utils/helpers';
import { CustomButton } from './CustomButton';
import { CustomInput } from './CustomInput';
import { MaterialIcon } from './Icon';
import { ServiceTypePicker } from './ServiceTypePicker';

interface MultipleServicesManagerProps {
  services: SelectedService[];
  onServicesChange: (services: SelectedService[]) => void;
  error?: string;
}

/**
 * Componente para gestionar múltiples servicios en una sola visita de mantenimiento
 * Permite agregar, editar y eliminar servicios con tipo de servicio y descripción
 * El costo se maneja a nivel de visita, no por servicio individual
 */
export const MultipleServicesManager: React.FC<MultipleServicesManagerProps> = ({
  services,
  onServicesChange,
  error,
}) => {
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentService, setCurrentService] = useState<SelectedService>({
    serviceType: ServiceType.OIL_CHANGE,
    description: '',
  });

  const resetCurrentService = () => {
    setCurrentService({
      serviceType: ServiceType.OIL_CHANGE,
      description: '',
    });
  };

  const handleAddService = () => {
    if (!currentService.description.trim()) {
      Alert.alert('Información Faltante', 'Por favor, completa la descripción del servicio');
      return;
    }

    // Verificar si el tipo de servicio ya existe
    const existingService = services.find((s) => s.serviceType === currentService.serviceType);
    if (existingService && editingIndex === null) {
      Alert.alert(
        'Servicio Ya Agregado',
        `${getServiceTypeLabel(currentService.serviceType)} ya está en la lista. ¿Te gustaría editarlo en su lugar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Editar Existente',
            onPress: () => {
              const index = services.findIndex((s) => s.serviceType === currentService.serviceType);
              handleEditService(index);
            },
          },
        ]
      );
      return;
    }

    if (editingIndex !== null) {
      // Actualizar servicio existente
      const updatedServices = [...services];
      updatedServices[editingIndex] = { ...currentService };
      onServicesChange(updatedServices);
      setEditingIndex(null);
    } else {
      // Agregar nuevo servicio
      onServicesChange([...services, { ...currentService }]);
    }

    resetCurrentService();
    setIsAddingService(false);
  };

  const handleEditService = (index: number) => {
    setCurrentService({ ...services[index] });
    setEditingIndex(index);
    setIsAddingService(true);
  };

  const handleRemoveService = (index: number) => {
    Alert.alert(
      'Eliminar Servicio',
      `¿Estás seguro de que quieres eliminar ${getServiceTypeLabel(services[index].serviceType)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const updatedServices = services.filter((_, i) => i !== index);
            onServicesChange(updatedServices);
          },
        },
      ]
    );
  };

  const handleCancelEdit = () => {
    resetCurrentService();
    setIsAddingService(false);
    setEditingIndex(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Servicios Realizados</Text>
      </View>

      {/* Lista de Servicios */}
      {services.length > 0 && (
        <ScrollView style={styles.servicesList} showsVerticalScrollIndicator={false}>
          {services.map((service, index) => (
            <View key={`${service.serviceType}-${index}`} style={styles.serviceItem}>
              <View style={styles.serviceHeader}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceType}>{getServiceTypeLabel(service.serviceType)}</Text>
                </View>
                <View style={styles.serviceActions}>
                  <TouchableOpacity
                    onPress={() => handleEditService(index)}
                    style={styles.actionButton}
                  >
                    <MaterialIcon name="edit" size={20} color="#2196f3" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRemoveService(index)}
                    style={styles.actionButton}
                  >
                    <MaterialIcon name="delete" size={20} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add/Edit Service Form */}
      {isAddingService && (
        <View style={styles.addServiceForm}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {editingIndex !== null ? 'Editar Servicio' : 'Agregar Servicio'}
            </Text>
            <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
              <MaterialIcon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ServiceTypePicker
            label="Tipo de Servicio"
            value={currentService.serviceType}
            onValueChange={(serviceType) => setCurrentService((prev) => ({ ...prev, serviceType }))}
          />

          <CustomInput
            label="Descripción"
            value={currentService.description}
            onChangeText={(description) => setCurrentService((prev) => ({ ...prev, description }))}
            placeholder="ej., Cambio de aceite sintético completo con filtro"
            icon="description"
            multiline
            numberOfLines={3}
          />

          <View style={styles.formButtons}>
            <CustomButton
              title="Cancelar"
              onPress={handleCancelEdit}
              variant="outline"
              size="medium"
            />
            <View style={styles.buttonSpacing} />
            <CustomButton
              title={editingIndex !== null ? 'Actualizar Servicio' : 'Agregar Servicio'}
              onPress={handleAddService}
              size="medium"
              icon={editingIndex !== null ? 'check' : 'add'}
            />
          </View>
        </View>
      )}

      {/* Botón Agregar Servicio */}
      {!isAddingService && (
        <CustomButton
          title="Agregar Servicio"
          onPress={() => setIsAddingService(true)}
          variant="outline"
          icon="add"
          fullWidth
        />
      )}

      {/* Mensaje de Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Empty State */}
      {services.length === 0 && !isAddingService && (
        <View style={styles.emptyState}>
          <MaterialIcon name="build" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No services added yet</Text>
          <Text style={styles.emptySubtext}>
            Add the services performed during this maintenance visit
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  servicesList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  serviceItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  serviceActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addServiceForm: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    padding: 4,
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  buttonSpacing: {
    width: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    marginTop: 8,
    marginLeft: 4,
  },
});
