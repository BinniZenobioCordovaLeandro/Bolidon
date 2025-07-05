import { router } from 'expo-router';
import { useRef } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { NavigationBar, ShareableView, type ShareableViewRef } from '../components';
import { CustomButton } from '../components/CustomButton';
import { Screen } from '../components/Screen';
import { useTheme } from '../contexts/ThemeContext';
import { createCommonStyles } from '../styles';
import * as BackgroundTask from 'expo-background-task';
import { runBackgroundSyncWork, manualSync } from '../services/SyncService';

export default function InvitationScreen() {
  const { theme } = useTheme();
  const styles = createCommonStyles(theme);
  const shareableViewRef = useRef<ShareableViewRef>(null);

  // Trigger background task for testing via long press
  const handleTriggerBackgroundTask = async () => {
    try {
      console.log('Calling triggerTaskWorkerForTestingAsync');
      const triggered = await BackgroundTask.triggerTaskWorkerForTestingAsync();
      console.log('Background task triggered for testing:', triggered);
      if (!triggered) {
        console.warn('triggerTaskWorkerForTestingAsync returned false; running sync work directly for Expo Go');
        await runBackgroundSyncWork();
      }
    } catch (error) {
      console.error('Error triggering background task:', error);
    }
  };

  const inviteUrl = 'https://bolidon.web.app';

  const handleShareInvite = async () => {
    try {
      console.log('Starting share process...');
      if (!shareableViewRef.current) {
        throw new Error('ShareableView reference is not available');
      }
      await shareableViewRef.current.captureAndShare();
      console.log('Share completed successfully');
    } catch (error) {
      console.error('Error sharing invite:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert(
        'Error',
        `No se pudo compartir la invitación: ${errorMessage}\n\nInténtalo de nuevo en unos momentos.`
      );
    }
  };

  return (
    <Screen>
      <NavigationBar title={''} backButtonText="Volver" onBackPress={() => router.back()} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ShareableView
          ref={shareableViewRef}
          style={[styles.columnCenter, styles.marginBottomXl]}
          shareOptions={{
            title: 'Invitación a Bolidon',
            message: '¡Únete a la red exclusiva de Bolidon!',
            includeText: true,
            additionalText: `\n🔗 Enlace directo: ${inviteUrl}`,
          }}
        >
          <View style={{ backgroundColor: theme.primary }}>
            <View style={[styles.columnCenter, styles.marginBottomXl, styles.paddingLg]}>
              <Text
                style={[
                  styles.textXl,
                  styles.textBold,
                  styles.marginBottomSm,
                  { textAlign: 'center' },
                ]}
              >
                Red de Invitaciones a Bolidon
              </Text>
              <Text style={[styles.textMd, styles.textSecondary, { textAlign: 'center' }]}>
                Muestra este código QR para invitar a otros a la app Bolidon
              </Text>
            </View>

            <View style={[styles.columnCenter, styles.marginBottomXl]}>
              <View
                style={[
                  styles.surface,
                  styles.paddingLg,
                  styles.marginBottomLg,
                  { borderRadius: 16 },
                ]}
              >
                <QRCode
                  value={inviteUrl}
                  size={250}
                  backgroundColor={theme.surface}
                  color={theme.text}
                  logoBackgroundColor={theme.surface}
                />
              </View>

              <View style={[styles.card]}>
                <Text style={[styles.textSm, styles.textMedium, styles.marginBottomSm]}>
                  📱 Cómo Instalar BOLIDON:
                </Text>
                <Text style={[styles.textXs, styles.textSecondary, { lineHeight: 18 }]}>
                  1. Escanea el código QR con la cámara de tu teléfono
                  {'\n'}
                  2. Toca el enlace que aparece en pantalla
                  {'\n'}
                  3. Permite la instalación desde fuentes desconocidas
                  {'\n'}
                  4. Descarga e instala la aplicación
                  {'\n'}
                  5. ¡Listo! Ya puedes usar BOLIDON
                </Text>
              </View>
            </View>

            <View style={[styles.card]}>
              <Text
                style={[
                  styles.textSm,
                  styles.textSecondary,
                  { textAlign: 'center', lineHeight: 20 },
                ]}
              >
                🎯 Red de Acceso Exclusivo
                {'\n'}
                Solo los usuarios invitados pueden acceder a la app Bolidon. Comparte este código QR
                o enlace con contactos de confianza para invitarlos a unirse a la red. Cada escaneo
                permite la instalación segura de la app.
              </Text>
            </View>
          </View>
        </ShareableView>

        <View style={[styles.column, styles.marginBottomXl]}>
          <CustomButton
            title="Compartir con Imagen QR"
            onPress={handleShareInvite}
            onLongPress={handleTriggerBackgroundTask}
            variant="primary"
          />
          <CustomButton
            title="______________________________________"
            onPress={manualSync}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
