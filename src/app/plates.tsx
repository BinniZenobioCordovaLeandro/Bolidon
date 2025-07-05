import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import { MaterialIcon } from '../components/Icon';
import { MaintenanceRecordItem } from '../components/MaintenanceRecordItem';
import { NavigationBar } from '../components/NavigationBar';
import { PlateCard } from '../components/PlateCard';
import { Screen } from '../components/Screen';
import { usePlateBasedStorage } from '../hooks/usePlateBasedStorage';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { MigrationService } from '../services/MigrationService';
import type { MaintenanceRecord } from '../services/PlateBasedStorageService';

interface PlateData {
  licensePlate: string;
  lastUpdated: string;
  inCloud: boolean;
  recordCount: number;
}

interface MaintenanceHistoryItem {
  mileage: number;
  record: MaintenanceRecord;
}

type ViewMode = 'plates' | 'details';

export default function PlatesScreen() {
  const { theme, common } = useThemedStyles();
  const plateStorage = usePlateBasedStorage();

  const [viewMode, setViewMode] = useState<ViewMode>('plates');
  const [plates, setPlates] = useState<PlateData[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceHistoryItem[]>([]);
  const [_isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleNavigateBack = () => {
    router.back();
  };

  const styles = {
    container: {
      ...common.flex1,
      backgroundColor: theme.background,
    },
    header: {
      ...common.paddingLg,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerContent: {
      ...common.row,
      ...common.justifyBetween,
      ...common.itemsCenter,
    },
    headerTitle: {
      ...common.textXl,
      ...common.textBold,
      color: theme.text,
    },
    backButton: {
      ...common.row,
      ...common.itemsCenter,
      ...common.paddingSm,
      borderRadius: 8,
      backgroundColor: `${theme.primary}20`,
    },
    backButtonText: {
      ...common.textMd,
      color: theme.primary,
      marginLeft: 4,
    },
    content: {
      ...common.flex1,
      ...common.paddingMd,
    },
    emptyState: {
      ...common.flex1,
      ...common.justifyCenter,
      ...common.itemsCenter,
      ...common.paddingXl,
    },
    emptyText: {
      ...common.textMd,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      ...common.marginTopMd,
    },
    migrationContainer: {
      ...common.marginBottomLg,
      ...common.paddingMd,
      backgroundColor: `${theme.warning}20`,
      ...common.roundedMd,
      borderWidth: 1,
      borderColor: theme.warning,
    },
    migrationText: {
      ...common.textSm,
      color: theme.text,
      ...common.marginBottomMd,
    },
    listContainer: {
      ...common.flex1,
    },
    plateDetailsHeader: {
      ...common.marginBottomMd,
      ...common.paddingMd,
      backgroundColor: theme.surface,
      ...common.roundedMd,
      borderWidth: 1,
      borderColor: theme.border,
    },
    plateDetailsTitle: {
      ...common.textLg,
      ...common.textBold,
      color: theme.text,
      textAlign: 'center' as const,
    },
    plateDetailsSubtitle: {
      ...common.textSm,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      ...common.marginTopXs,
    },
  };

  const loadPlates = useCallback(async () => {
    setIsLoading(true);
    try {
      const syncStatus = await plateStorage.getSyncStatus();
      // Sort plates by last modification time (most recent first)
      const sortedPlates = syncStatus.sort((a, b) => {
        const dateA = new Date(a.lastUpdated);
        const dateB = new Date(b.lastUpdated);
        return dateB.getTime() - dateA.getTime();
      });
      setPlates(sortedPlates);
    } catch (error) {
      console.error('Failed to load plates:', error);
      Alert.alert('Error', 'No se pudieron cargar las placas registradas');
    } finally {
      setIsLoading(false);
    }
  }, [plateStorage.getSyncStatus]);

  const loadMaintenanceHistory = useCallback(
    async (licensePlate: string) => {
      setIsLoading(true);
      try {
        const history = await plateStorage.getMaintenanceHistory(licensePlate);
        setMaintenanceHistory(history);
      } catch (error) {
        console.error('Failed to load maintenance history:', error);
        Alert.alert('Error', 'No se pudo cargar el historial de mantenimiento');
      } finally {
        setIsLoading(false);
      }
    },
    [plateStorage.getMaintenanceHistory]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if (viewMode === 'plates') {
      await loadPlates();
    } else if (selectedPlate) {
      await loadMaintenanceHistory(selectedPlate);
    }
    setIsRefreshing(false);
  }, [viewMode, selectedPlate, loadPlates, loadMaintenanceHistory]);

  const handlePlatePress = useCallback(
    async (licensePlate: string) => {
      setSelectedPlate(licensePlate);
      setViewMode('details');
      await loadMaintenanceHistory(licensePlate);
    },
    [loadMaintenanceHistory]
  );

  const handleBackToPlates = useCallback(() => {
    setViewMode('plates');
    setSelectedPlate(null);
    setMaintenanceHistory([]);
  }, []);

  const _handleMigration = useCallback(async () => {
    Alert.alert(
      'Migrar Datos',
      '¿Desea migrar todos los datos de mantenimiento existentes al nuevo formato por placas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Migrar',
          onPress: async () => {
            setIsLoading(true);
            try {
              const result = await MigrationService.migrateAllMaintenanceData();

              if (result.success) {
                Alert.alert(
                  'Migración Completa',
                  `Se migraron exitosamente ${result.migratedRecords} registros de mantenimiento.`,
                  [{ text: 'OK', onPress: loadPlates }]
                );
              } else {
                Alert.alert(
                  'Migración con Problemas',
                  `Se migraron ${result.migratedRecords} registros con ${result.errors.length} errores.\n\nPrimer error: ${result.errors[0] || 'Desconocido'}`,
                  [{ text: 'OK', onPress: loadPlates }]
                );
              }
            } catch (error) {
              Alert.alert(
                'Error de Migración',
                error instanceof Error ? error.message : 'Error desconocido'
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  }, [loadPlates]);

  const renderPlateItem = useCallback(
    ({ item }: { item: PlateData }) => (
      <PlateCard
        licensePlate={item.licensePlate}
        recordCount={item.recordCount}
        lastUpdated={item.lastUpdated}
        inCloud={item.inCloud}
        onPress={() => handlePlatePress(item.licensePlate)}
      />
    ),
    [handlePlatePress]
  );

  const renderMaintenanceItem = useCallback(
    ({ item }: { item: MaintenanceHistoryItem }) => (
      <MaintenanceRecordItem mileage={item.mileage} record={item.record} />
    ),
    []
  );

  const renderEmptyPlates = useCallback(
    () => (
      <View style={styles.emptyState}>
        <MaterialIcon name="drive-eta" size={64} color={theme.onSurfaceVariant} />
        <Text style={styles.emptyText}>
          No se encontraron placas registradas.{'\n'}
          Use el botón "Migrar Datos" para migrar los registros existentes.
        </Text>
      </View>
    ),
    [styles.emptyState, styles.emptyText, theme.onSurfaceVariant]
  );

  const renderEmptyMaintenance = useCallback(
    () => (
      <View style={styles.emptyState}>
        <MaterialIcon name="build" size={64} color={theme.onSurfaceVariant} />
        <Text style={styles.emptyText}>
          No se encontraron registros de mantenimiento para esta placa.
        </Text>
      </View>
    ),
    [styles.emptyState, styles.emptyText, theme.onSurfaceVariant]
  );

  useEffect(() => {
    if (viewMode === 'plates') {
      loadPlates();
    }
  }, [viewMode, loadPlates]);

  return (
    <Screen>
      <View style={styles.container}>
        {/* Navigation Bar */}
        <NavigationBar
          title={viewMode === 'plates' ? 'Placas Registradas' : selectedPlate || ''}
          onBackPress={viewMode === 'details' ? handleBackToPlates : handleNavigateBack}
          backButtonText={viewMode === 'details' ? 'Volver' : 'Inicio'}
        />

        <View style={styles.content}>
          {/* Plate Details Header */}
          {viewMode === 'details' && selectedPlate && (
            <View style={styles.plateDetailsHeader}>
              <Text style={styles.plateDetailsTitle}>Historial de Mantenimiento</Text>
            </View>
          )}

          {/* Content List */}
          <View style={styles.listContainer}>
            {viewMode === 'plates' ? (
              <FlatList
                data={plates}
                renderItem={renderPlateItem}
                keyExtractor={(item: PlateData) => item.licensePlate}
                refreshControl={
                  <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={renderEmptyPlates}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <FlatList
                data={maintenanceHistory}
                renderItem={renderMaintenanceItem}
                keyExtractor={(item: MaintenanceHistoryItem) => `${item.mileage}-${item.record.id}`}
                refreshControl={
                  <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={renderEmptyMaintenance}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </View>
    </Screen>
  );
}
