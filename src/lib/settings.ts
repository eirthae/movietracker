/** Locally-persisted app preferences (AsyncStorage). */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const NOTIF_KEY = 'cinema-tracker:notifications-enabled';

/**
 * Whether English-film alerts are enabled (brief §17.4). Defaults to ON.
 * Returns the value, a setter, and whether it has loaded from storage yet.
 */
export function useNotificationsEnabled() {
  const [enabled, setEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(NOTIF_KEY).then((v) => {
      if (v != null) setEnabled(v === 'true');
      setLoaded(true);
    });
  }, []);

  const set = (next: boolean) => {
    setEnabled(next);
    AsyncStorage.setItem(NOTIF_KEY, String(next)).catch(() => {});
  };

  return { enabled, setEnabled: set, loaded };
}

export async function notificationsEnabled(): Promise<boolean> {
  const v = await AsyncStorage.getItem(NOTIF_KEY);
  return v == null ? true : v === 'true';
}
