/** Expo push notifications: permission, token registration, channel setup. */
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { supabase } from './supabase';

// Show alerts even when the app is foregrounded.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

function projectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants as any).easConfig?.projectId
  );
}

async function getToken(): Promise<string | null> {
  try {
    const pid = projectId();
    const res = await Notifications.getExpoPushTokenAsync(
      pid ? { projectId: pid } : undefined,
    );
    return res.data;
  } catch (e) {
    console.warn('[notifications] could not get push token:', e);
    return null;
  }
}

export async function getPermissionStatus(): Promise<Notifications.PermissionStatus> {
  if (Platform.OS === 'web') return Notifications.PermissionStatus.UNDETERMINED;
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

/**
 * Request permission (if needed) and register this device's Expo push token in
 * Supabase. Returns the token, or null if unavailable / denied.
 */
export async function registerForPush(): Promise<string | null> {
  if (!Device.isDevice) return null;
  await ensureAndroidChannel();

  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    ({ status } = await Notifications.requestPermissionsAsync());
  }
  if (status !== 'granted') return null;

  const token = await getToken();
  if (!token) return null;

  await supabase.from('device_tokens').upsert(
    { token, platform: Platform.OS, updated_at: new Date().toISOString() },
    { onConflict: 'token' },
  );
  return token;
}

/** Remove this device's token so the Edge Function stops notifying it. */
export async function unregisterPush(): Promise<void> {
  const token = await getToken();
  if (!token) return;
  await supabase.from('device_tokens').delete().eq('token', token);
}
