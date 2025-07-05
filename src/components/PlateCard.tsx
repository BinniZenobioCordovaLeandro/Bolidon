import type React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { MaterialIcon } from './Icon';

interface PlateCardProps {
  licensePlate: string;
  recordCount: number;
  lastUpdated: string;
  inCloud: boolean;
  onPress?: () => void;
}

/**
 * Reusable component to display a license plate card with summary info
 */
export const PlateCard: React.FC<PlateCardProps> = ({
  licensePlate,
  recordCount,
  lastUpdated,
  inCloud,
  onPress,
}) => {
  const { theme, common } = useThemedStyles();

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Hace menos de 1 hora';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
      } else {
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    }
  };

  const styles = {
    container: {
      backgroundColor: theme.surface,
      ...common.paddingLg,
      ...common.marginBottomMd,
      ...common.roundedLg,
      borderWidth: 1,
      borderColor: theme.border,
      ...common.shadowSm,
    },
    header: {
      ...common.row,
      ...common.justifyBetween,
      ...common.itemsCenter,
      ...common.marginBottomMd,
    },
    plateContainer: {
      ...common.row,
      ...common.itemsCenter,
    },
    plateText: {
      ...common.textXl,
      ...common.textBold,
      color: theme.text,
      marginLeft: 8,
    },
    infoContainer: {
      ...common.row,
      ...common.justifyBetween,
      ...common.itemsCenter,
    },
    recordCountContainer: {
      ...common.row,
      ...common.itemsCenter,
    },
    recordCountText: {
      ...common.textMd,
      ...common.textSemibold,
      color: theme.primary,
      marginLeft: 4,
    },
    lastUpdatedText: {
      ...common.textSm,
      color: theme.onSurfaceVariant,
    },
    syncStatusContainer: {
      ...common.row,
      ...common.itemsCenter,
    },
    syncStatusText: {
      ...common.textSm,
      color: inCloud ? theme.success : theme.warning,
      marginLeft: inCloud ? 4 : 0,
    },
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      {/* Header with plate and sync status */}
      <View style={styles.header}>
        <View style={styles.plateContainer}>
          <MaterialIcon name="drive-eta" size={24} color={theme.primary} />
          <Text style={styles.plateText}>{licensePlate}</Text>
        </View>
        {inCloud && <MaterialIcon name="cloud-done" size={18} color={theme.success} />}
      </View>

      {/* Info row */}
      <View style={styles.infoContainer}>
        <View>
          <View style={styles.recordCountContainer}>
            <MaterialIcon name="list" size={16} color={theme.primary} />
            <Text style={styles.recordCountText}>
              {recordCount} registro{recordCount !== 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={styles.lastUpdatedText}>{formatLastUpdated(lastUpdated)}</Text>
        </View>

        <View style={styles.syncStatusContainer}>
          {inCloud && <MaterialIcon name="cloud-done" size={14} color={theme.success} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};
