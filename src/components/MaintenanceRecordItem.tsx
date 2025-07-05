import type React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { MaintenanceRecord } from '../services/PlateBasedStorageService';
import { formatCurrency } from '../utils/helpers';
import { MaterialIcon } from './Icon';

interface MaintenanceRecordItemProps {
  mileage: number;
  record: MaintenanceRecord;
  onPress?: () => void;
}

/**
 * Reusable component to display a single maintenance record
 */
export const MaintenanceRecordItem: React.FC<MaintenanceRecordItemProps> = ({
  mileage,
  record,
  onPress,
}) => {
  const { theme, common } = useThemedStyles();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const styles = {
    container: {
      backgroundColor: theme.surface,
      ...common.paddingMd,
      ...common.marginBottomSm,
      ...common.roundedMd,
      borderWidth: 1,
      borderColor: theme.border,
    },
    header: {
      ...common.row,
      ...common.justifyBetween,
      ...common.itemsCenter,
      ...common.marginBottomSm,
    },
    mileageContainer: {
      ...common.row,
      ...common.itemsCenter,
    },
    mileageText: {
      ...common.textLg,
      ...common.textBold,
      color: theme.primary,
      marginLeft: 8,
    },
    costText: {
      ...common.textMd,
      ...common.textSemibold,
      color: theme.success,
    },
    dateText: {
      ...common.textSm,
      color: theme.onSurfaceVariant,
      ...common.marginBottomSm,
    },
    servicesContainer: {
      ...common.marginTopSm,
    },
    serviceItem: {
      ...common.row,
      ...common.itemsCenter,
      ...common.paddingSm,
      ...common.marginBottomXs,
      backgroundColor: `${theme.info}20`,
      ...common.roundedSm,
    },
    serviceText: {
      ...common.textSm,
      color: theme.text,
      ...common.flex1,
      marginLeft: 8,
    },
    notesText: {
      ...common.textSm,
      color: theme.onSurfaceVariant,
      ...common.marginTopSm,
      fontStyle: 'italic' as const,
    },
    nextServiceContainer: {
      ...common.marginTopSm,
      ...common.paddingSm,
      backgroundColor: `${theme.warning}20`,
      ...common.roundedSm,
    },
    nextServiceText: {
      ...common.textSm,
      color: theme.text,
      ...common.textSemibold,
    },
    syncStatusContainer: {
      ...common.row,
      ...common.itemsCenter,
    },
    cloudIcon: {
      marginRight: 4,
    },
  };

  const getServiceIcon = (serviceType: string): string => {
    const iconMap: Record<string, string> = {
      oil_change: 'local-gas-station',
      tire_rotation: 'drive-eta',
      brake_service: 'warning',
      transmission_service: 'settings',
      engine_tune_up: 'build',
      air_filter: 'air',
      fuel_filter: 'local-gas-station',
      spark_plugs: 'flash-on',
      battery_service: 'battery-charging-full',
      cooling_system: 'ac-unit',
      suspension: 'directions-car',
      exhaust_system: 'speed',
      electrical: 'flash-on',
      other: 'build',
    };
    return iconMap[serviceType] || 'build';
  };

  const formatServiceType = (serviceType: string): string => {
    return serviceType.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      {/* Header with mileage and cost */}
      <View style={styles.header}>
        <View style={styles.mileageContainer}>
          <MaterialIcon name="speed" size={20} color={theme.primary} />
          <Text style={styles.mileageText}>{mileage.toLocaleString()} km</Text>
        </View>
        <View style={styles.syncStatusContainer}>
          <Text style={styles.costText}>{formatCurrency(record.totalCost)}</Text>
        </View>
      </View>

      {/* Date */}
      <View style={common.row}>
        {record.inCloud && (
          <MaterialIcon
            name="cloud-done"
            size={20}
            color={theme.success}
            style={styles.cloudIcon}
          />
        )}
        {!record.inCloud && (
          <MaterialIcon
            name="cloud-upload"
            size={20}
            color={theme.error}
            style={styles.cloudIcon}
          />
        )}
        <Text style={styles.dateText}>{formatDate(record.date)}</Text>
      </View>

      {/* Services */}
      {record.services.length > 0 && (
        <View style={styles.servicesContainer}>
          {record.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <MaterialIcon
                name={getServiceIcon(service.serviceType) as any}
                size={16}
                color={theme.info}
              />
              <Text style={styles.serviceText}>
                {formatServiceType(service.serviceType)}
                {service.description && ` - ${service.description}`}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* General Notes */}
      {record.generalNotes && <Text style={styles.notesText}>Notas: {record.generalNotes}</Text>}

      {/* Next Service Info */}
      {(record.nextServiceMileage || record.nextServiceDate) && (
        <View style={styles.nextServiceContainer}>
          <Text style={styles.nextServiceText}>
            Próximo servicio:{' '}
            {record.nextServiceMileage && `${record.nextServiceMileage.toLocaleString()} km`}
            {record.nextServiceMileage && record.nextServiceDate && ' • '}
            {record.nextServiceDate && formatDate(record.nextServiceDate)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
