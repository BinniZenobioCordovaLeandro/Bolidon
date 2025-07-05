import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StatusBar, Text, View } from 'react-native';
import { MaterialIcon } from '../components/Icon';
import { NavigatorBar } from '../components/NavigatorBar';
import { MaintenanceForm } from '../components/NewMaintenanceForm';
import { Screen } from '../components/Screen';
import { useTheme } from '../contexts/ThemeContext';
import { useMaintenanceStore } from '../hooks/useMaintenanceStore';
import { createCommonStyles } from '../styles';
import { iconSizes } from '../styles/tokens';
import type { MaintenanceFormData } from '../utils/zodSchemas';

export default function HomePage() {
  const [showVehicleForm, setShowVehicleForm] = useState(false);

  const { isLoading, addMaintenanceRecord, clearError } = useMaintenanceStore();

  const { theme } = useTheme();
  const styles = createCommonStyles(theme);

  const handleNavigateToPlates = () => {
    router.push('/plates');
  };

  const handleNavigateToProfile = () => {
    router.push('/invitation');
  };

  const navigationItems = [
    {
      icon: 'directions-car' as const,
      onPress: handleNavigateToPlates,
      isActive: false,
      id: 'plates',
      label: 'Placas de Vehículos',
    },
    {
      icon: 'mail' as const,
      onPress: handleNavigateToProfile,
      isActive: false,
      id: 'invitation',
      label: 'Red de Invitaciones',
    },
  ];

  const handleSubmitMaintenance = async (data: MaintenanceFormData) => {
    try {
      await addMaintenanceRecord(data);
      Alert.alert('Éxito', '¡Registro de mantenimiento guardado exitosamente!', [
        { text: 'OK', onPress: clearError },
      ]);
    } catch (error) {
      console.error('Error submitting maintenance:', error);
      Alert.alert(
        'Error',
        'No se pudo guardar el registro de mantenimiento. Los datos se guardaron localmente y se sincronizarán cuando esté en línea.',
        [{ text: 'OK', onPress: clearError }]
      );
    }
  };

  const handleCancelVehicleForm = () => {
    setShowVehicleForm(false);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={[styles.container, { paddingTop: 24 }]}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Screen>
            <NavigatorBar items={navigationItems} />
            <MaintenanceForm onSubmit={handleSubmitMaintenance} isLoading={isLoading} />
          </Screen>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={showVehicleForm}
          onRequestClose={handleCancelVehicleForm}
        >
          <View style={styles.modalContainer}>
            <StatusBar barStyle="light-content" backgroundColor={theme.primary} translucent />
            <LinearGradient
              colors={[theme.primary, `${theme.primary}99`]}
              style={styles.modalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.modalHeaderContent}>
                <MaterialIcon name="directions-car" size={iconSizes.xl} color="#fff" />
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalHeaderTitle}>Agregar Vehículo</Text>
                  <Text style={styles.modalHeaderSubtitle}>Registrar un nuevo vehículo</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      </View>
    </>
  );
}
