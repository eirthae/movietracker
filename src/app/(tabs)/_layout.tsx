import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { useTheme } from '@/theme/theme';
import { spacing } from '@/theme/tokens';

function SettingsButton() {
  const router = useRouter();
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={() => router.push('/settings')}
      hitSlop={12}
      accessibilityLabel="Settings"
      style={{ paddingHorizontal: spacing.lg }}>
      <Ionicons name="settings-outline" size={22} color={palette.textSecondary} />
    </Pressable>
  );
}

export default function TabsLayout() {
  const { palette } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: palette.background },
        headerTitleStyle: { color: palette.textPrimary, fontWeight: '700' },
        headerShadowVisible: false,
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarStyle: {
          backgroundColor: palette.background,
          borderTopColor: palette.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Cinemas',
          headerRight: () => <SettingsButton />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: 'Manage Cinemas',
          tabBarLabel: 'Manage',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
