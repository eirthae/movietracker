import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { registerForPush } from '@/lib/notifications';
import { notificationsEnabled } from '@/lib/settings';
import { ThemeProvider, useTheme } from '@/theme/theme';

function useNotificationRouting() {
  const router = useRouter();
  useEffect(() => {
    // Push notifications aren't supported on web — skip the whole routing setup.
    if (Platform.OS === 'web') return;

    // Register this device on launch if alerts are enabled.
    notificationsEnabled().then((on) => {
      if (on) registerForPush();
    });

    const openFromData = (data: any) => {
      const screen = data?.screen;
      if (typeof screen === 'string') router.push(screen as never);
    };

    // Tapped while running / backgrounded.
    const sub = Notifications.addNotificationResponseReceivedListener((resp) =>
      openFromData(resp.notification.request.content.data),
    );
    // Cold start from a notification tap.
    Notifications.getLastNotificationResponseAsync().then((resp) => {
      if (resp) openFromData(resp.notification.request.content.data);
    });

    return () => sub.remove();
  }, [router]);
}

function RootNavigator() {
  const { palette, isDark } = useTheme();
  useNotificationRouting();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.background },
          headerTitleStyle: { color: palette.textPrimary },
          headerTintColor: palette.accent,
          contentStyle: { backgroundColor: palette.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="film/[id]"
          options={{ headerShown: false, gestureEnabled: true, fullScreenGestureEnabled: true }}
        />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
