# Vehicle Maintenance Service Registration App

A React Native (Expo) application for registering multiple maintenance services for vehicles in a single visit. Built with TypeScript, Jotai state management, AsyncStorage offline storage, and background sync capabilities.

## 🌟 Key Features

### ✅ **Offline-First Architecture**
- **AsyncStorage Local Storage**: All data stored locally using React Native AsyncStorage
- **Background Sync**: Automatic synchronization when online using Expo Background Fetch
- **Network Status**: Real-time connectivity monitoring
- **Conflict Resolution**: Handles offline/online data synchronization

### ✅ **State Management**
- **Jotai**: Atomic state management for better performance and organization
- **Persistent State**: Important state persisted across app restarts
- **Reactive Updates**: Real-time UI updates based on state changes

### ✅ **Real-World Maintenance Model**
- **Multiple Services per Visit**: Add multiple maintenance services in one session
- **Single Visit Cost**: One total cost for all services (realistic billing)
- **Service Descriptions**: Individual descriptions/notes for each service
- **Vehicle Management**: Add and manage multiple vehicles

### ✅ **Frictionless Vehicle Registration**
- **License Plate Only**: Just enter license plate to get started quickly
- **Optional Details**: Add make, model, year, and other details later if needed
- **Unique Identification**: License plate serves as unique identifier
- **Progressive Enhancement**: Start minimal, add details when convenient

### ✅ **Modern UI/UX**
- **Material Design**: Beautiful, consistent Material Design components
- **Safe Areas**: Proper safe area handling for all devices
- **Pull-to-Refresh**: Refresh data with pull gesture
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: User-friendly error messages and recovery

## Architecture

The app follows clean architecture principles with the following structure:

```
src/
├── components/        # Reusable UI components
├── screens/          # Screen components
├── hooks/            # Custom React hooks
├── services/         # Data services and API calls
├── types/            # TypeScript type definitions
├── utils/            # Utility functions and helpers
└── validators/       # Form validation schemas
```

## Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type safety and better development experience
- **React Hook Form**: Efficient form handling with validation
- **Zod**: Schema validation with TypeScript-first design
- **AsyncStorage**: Local data persistence
- **Expo Vector Icons**: Icon library
- **Expo Linear Gradient**: Gradient backgrounds

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bolidon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app to run on your device

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## Usage

### Adding a Vehicle

1. Open the app
2. If no vehicles exist, you'll be prompted to add one
3. **Just enter the license plate** - that's all you need to get started!
4. Optionally add a nickname (e.g., "My Car", "Work Truck")
5. Tap "Add Vehicle" to save
6. Add more details (make, model, year, mileage) later in vehicle settings

### Recording Maintenance

1. Select a vehicle from the dropdown
2. Add multiple services for the visit:
   - Tap "Add Service" to start adding services
   - Choose the service type from the predefined options
   - Fill in service details (description, cost, notes)
   - Repeat for each service performed during the visit
3. Fill in visit details:
   - Date of service
   - Current mileage
   - Optional: Next service mileage and date
   - Optional: General notes for the entire visit
4. Review the total cost and service count
5. Tap "Save Maintenance Visit" to record all services

### Service Types

The app includes predefined service types such as:
- Oil Change
- Tire Rotation
- Brake Service
- Transmission Service
- Engine Tune-up
- Air Filter
- Fuel Filter
- Spark Plugs
- Battery Service
- Cooling System
- Suspension
- Exhaust System
- Electrical
- Other

## Project Structure

### Components

- **Icon**: Universal icon component supporting all Expo Vector Icons families
- **CustomButton**: Reusable button with multiple variants and loading states
- **CustomInput**: Text input component with validation and error handling
- **MaintenanceForm**: Main form for recording multiple maintenance services per visit
- **MultipleServicesManager**: Component for managing multiple services in a single visit
- **QuickVehicleForm**: Form for adding new vehicles
- **ServiceTypePicker**: Modal picker for selecting service types

### Hooks

- **useMaintenanceStore**: Custom hook for managing vehicle and maintenance data with Jotai
- **useZodForm**: Reusable hook for forms with Zod validation

### Services

- **DatabaseService**: Service for handling data persistence with AsyncStorage
- **SyncService**: Service for background data synchronization

### Validation

- **Zod Schemas**: Type-safe validation schemas for all forms and data structures

### Types

Complete TypeScript definitions for:
- Vehicle information
- Individual maintenance service records  
- Maintenance visit records (containing multiple services)
- Service type enumerations

## Development Guidelines

### Code Standards

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Implement proper error boundaries

### UI/UX Guidelines

- Follow Material Design principles
- Prioritize accessibility and usability
- Use consistent spacing and typography
- Implement smooth animations and transitions
- Provide clear visual feedback for user actions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material Design for UI/UX inspiration
- React Native community for excellent documentation
- Expo team for the amazing development platform

## Icon Component

The app uses a universal Icon component that supports all Expo Vector Icons families with consistent API and better TypeScript support.

### Basic Usage

```tsx
import { Icon, MaterialIcon } from '../components/Icon';

// Universal component (specify family)
<Icon family="MaterialIcons" name="build" size={24} color="#666" />

// Specific component with better typing
<MaterialIcon name="build" size={24} color="#666" />
```

### Available Icon Families

- **MaterialIcons** - Material Design icons (default)
- **MaterialCommunityIcons** - Extended Material Design icons
- **Ionicons** - Ionic framework icons
- **FontAwesome** - FontAwesome icons
- **Feather** - Feather icons
- **AntDesign** - Ant Design icons
- And more...

### Common Icons

Predefined constants for frequently used icons:

```tsx
import { MaterialIcon, COMMON_ICONS } from '../components/Icon';

<MaterialIcon name={COMMON_ICONS.car} size={24} color="#666" />
<MaterialIcon name={COMMON_ICONS.build} size={24} color="#666" />
<MaterialIcon name={COMMON_ICONS.check} size={24} color="#666" />
```

### Features

- **Type Safety**: Full TypeScript support with proper icon name typing
- **Consistent API**: Same interface across all icon families
- **Performance**: Optimized rendering with minimal re-renders
- **Accessibility**: Built-in accessibility support
- **Fallback Handling**: Graceful handling of missing icons
