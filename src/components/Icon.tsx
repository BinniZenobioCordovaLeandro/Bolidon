import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from '@expo/vector-icons';
import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// Tipos de familias de iconos disponibles
export type IconFamily =
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'Ionicons'
  | 'FontAwesome'
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome5'
  | 'Foundation'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

// Mapeo de componentes de iconos
const IconComponents = {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome5,
  Foundation,
  Octicons,
  SimpleLineIcons,
  Zocial,
} as const;

// Tipos de nombres de iconos para cada familia
export type MaterialIconName = keyof typeof MaterialIcons.glyphMap;
export type MaterialCommunityIconName = keyof typeof MaterialCommunityIcons.glyphMap;
export type IoniconsName = keyof typeof Ionicons.glyphMap;
export type FontAwesomeName = keyof typeof FontAwesome.glyphMap;
export type AntDesignName = keyof typeof AntDesign.glyphMap;
export type EntypoName = keyof typeof Entypo.glyphMap;
export type EvilIconsName = keyof typeof EvilIcons.glyphMap;
export type FeatherName = keyof typeof Feather.glyphMap;
export type FontAwesome5Name = keyof typeof FontAwesome5.glyphMap;
export type FoundationName = keyof typeof Foundation.glyphMap;
export type OcticonsName = keyof typeof Octicons.glyphMap;
export type SimpleLineIconsName = keyof typeof SimpleLineIcons.glyphMap;
export type ZocialName = keyof typeof Zocial.glyphMap;

export interface IconProps {
  family?: IconFamily;
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Componente de icono universal que soporta múltiples familias de iconos de Expo Vector Icons
 * Por defecto usa MaterialIcons para mantener compatibilidad con el código existente
 */
export const Icon: React.FC<IconProps> = ({
  family = 'MaterialIcons',
  name,
  size = 24,
  color = '#666',
  style,
}) => {
  const IconComponent = IconComponents[family];

  if (!IconComponent) {
    console.warn(`Familia de iconos "${family}" no encontrada`);
    return null;
  }

  return <IconComponent name={name as never} size={size} color={color} style={style} />;
};

// Componentes específicos para familias de iconos más comunes (para mejor tipado)
export const MaterialIcon: React.FC<Omit<IconProps, 'family'> & { name: MaterialIconName }> = (
  props
) => <Icon {...props} family="MaterialIcons" />;

export const MaterialCommunityIcon: React.FC<
  Omit<IconProps, 'family'> & { name: MaterialCommunityIconName }
> = (props) => <Icon {...props} family="MaterialCommunityIcons" />;

export const IonicIcon: React.FC<Omit<IconProps, 'family'> & { name: IoniconsName }> = (props) => (
  <Icon {...props} family="Ionicons" />
);

export const FeatherIcon: React.FC<Omit<IconProps, 'family'> & { name: FeatherName }> = (props) => (
  <Icon {...props} family="Feather" />
);

// Constantes para iconos comúnmente usados en la app
export const COMMON_ICONS = {
  // Navegación
  back: 'arrow-back',
  close: 'close',
  menu: 'menu',

  // Acciones
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  save: 'save',
  search: 'search',

  // Estados
  check: 'check',
  error: 'error',
  warning: 'warning',
  info: 'info',

  // Vehículos y mantenimiento
  car: 'directions-car',
  garage: 'garage',
  build: 'build',
  settings: 'settings',

  // Formularios
  visibility: 'visibility',
  visibilityOff: 'visibility-off',
  calendar: 'calendar-today',
  location: 'location-on',
} as const;

export default Icon;
