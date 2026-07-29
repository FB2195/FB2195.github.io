import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Fragt die Benachrichtigungs-Berechtigung an (No-Op im Web).
 * Hinweis: Dies aktiviert nur lokale Benachrichtigungen auf diesem Gerät.
 * Echte Push-Benachrichtigungen zwischen unterschiedlichen Geräten
 * benötigen zusätzlich ein Backend, das Nachrichten zentral verteilt.
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch {
    return false;
  }
}

export async function notifyLocal(title: string, body: string): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const granted = await ensureNotificationPermission();
    if (!granted) return;
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  } catch {
    // Benachrichtigungen sind ein Komfort-Feature – Fehler hier dürfen die App nicht blockieren.
  }
}
