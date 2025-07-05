import type React from 'react';
import { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { borderRadius, spacing } from '../styles/tokens';
import type { ServiceType } from '../types';
import { SERVICE_TYPE_OPTIONS } from '../utils/helpers';
import { MaterialIcon, type MaterialIconName } from './Icon';

interface ServiceTypePickerProps {
  label: string;
  value?: ServiceType;
  onValueChange: (value: ServiceType) => void;
  error?: string;
}

/**
 * Service type picker component with modal interface
 * Displays service types with icons and allows single selection
 */
export const ServiceTypePicker: React.FC<ServiceTypePickerProps> = ({
  label,
  value,
  onValueChange,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { theme, common } = useThemedStyles();

  const styles = {
    container: {
      ...common.marginBottomLg,
    },
    label: {
      ...common.textLg,
      ...common.textSemibold,
      color: theme.onSurface,
      ...common.marginBottomSm,
    },
    picker: {
      ...common.row,
      ...common.itemsCenter,
      justifyContent: 'space-between' as const,
      ...common.border,
      borderColor: error ? theme.error : theme.outline,
      ...common.roundedLg,
      backgroundColor: theme.surface,
      ...common.paddingLg,
      minHeight: 50,
    },
    pickerContent: {
      ...common.row,
      ...common.itemsCenter,
      ...common.flex1,
    },
    pickerIcon: {
      marginRight: spacing.sm,
    },
    pickerText: {
      ...common.textLg,
      color: theme.onSurface,
    },
    placeholderText: {
      color: theme.onSurfaceVariant,
    },
    errorText: {
      ...common.textSm,
      color: theme.error,
      marginTop: spacing.xs,
      marginLeft: spacing.xs,
    },
    modalOverlay: {
      ...common.flex1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end' as const,
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      maxHeight: '80%' as const,
    },
    modalHeader: {
      ...common.row,
      ...common.itemsCenter,
      justifyContent: 'space-between' as const,
      ...common.paddingLg,
      borderBottomWidth: 1,
      borderBottomColor: theme.outline,
    },
    modalTitle: {
      ...common.textXl,
      ...common.textSemibold,
      color: theme.onSurface,
    },
    closeButton: {
      padding: spacing.xs,
    },
    optionsList: {
      maxHeight: 400,
    },
    optionItem: {
      ...common.row,
      ...common.itemsCenter,
      ...common.paddingLg,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.outline}30`,
    },
    selectedOption: {
      backgroundColor: `${theme.primary}20`,
    },
    optionIcon: {
      marginRight: spacing.md,
    },
    optionText: {
      ...common.textLg,
      color: theme.onSurface,
      ...common.flex1,
    },
    selectedOptionText: {
      color: theme.primary,
      ...common.textSemibold,
    },
    checkIcon: {
      marginLeft: spacing.sm,
    },
  };

  const selectedOption = SERVICE_TYPE_OPTIONS.find((option) => option.value === value);

  const handleSelect = (serviceType: ServiceType) => {
    onValueChange(serviceType);
    setModalVisible(false);
  };

  const renderServiceTypeItem = ({ item }: { item: (typeof SERVICE_TYPE_OPTIONS)[0] }) => (
    <TouchableOpacity
      style={[styles.optionItem, value === item.value && styles.selectedOption]}
      onPress={() => handleSelect(item.value)}
    >
      <MaterialIcon
        name={item.icon as MaterialIconName}
        size={24}
        color={value === item.value ? '#2196f3' : '#666'}
        style={styles.optionIcon}
      />
      <Text style={[styles.optionText, value === item.value && styles.selectedOptionText]}>
        {item.label}
      </Text>
      {value === item.value && (
        <MaterialIcon name="check" size={20} color="#2196f3" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.picker]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel={label}
        accessibilityHint="Tap to select service type"
      >
        <View style={styles.pickerContent}>
          {selectedOption && (
            <MaterialIcon
              name={selectedOption.icon as MaterialIconName}
              size={20}
              color="#666"
              style={styles.pickerIcon}
            />
          )}
          <Text style={[styles.pickerText, !selectedOption && styles.placeholderText]}>
            {selectedOption ? selectedOption.label : 'Select service type'}
          </Text>
        </View>
        <MaterialIcon name="keyboard-arrow-down" size={24} color="#666" />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Service Type</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <MaterialIcon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={SERVICE_TYPE_OPTIONS}
              renderItem={renderServiceTypeItem}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
