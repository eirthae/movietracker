import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, type ThemeMode } from '@/theme/theme';
import { radius, spacing, type } from '@/theme/tokens';
import { formatShortDate } from '@/lib/format';
import {
  getPermissionStatus,
  registerForPush,
  unregisterPush,
} from '@/lib/notifications';
import { useLatestScrape } from '@/lib/queries';
import { useNotificationsEnabled } from '@/lib/settings';

const THEME_OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: 'system', label: 'System default' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const { palette, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { enabled, setEnabled } = useNotificationsEnabled();
  const lastScrape = useLatestScrape();

  // OS-level permission: if denied, the toggle is disabled with a hint (§17.4).
  const [permDenied, setPermDenied] = useState(false);
  useEffect(() => {
    getPermissionStatus().then((s) => setPermDenied(s === 'denied'));
  }, []);

  const onToggleNotifications = async (next: boolean) => {
    setEnabled(next);
    if (next) {
      const token = await registerForPush();
      if (!token) {
        // Permission not granted / unavailable — reflect that in the UI.
        const status = await getPermissionStatus();
        setPermDenied(status === 'denied');
      } else {
        setPermDenied(false);
      }
    } else {
      unregisterPush();
    }
  };

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const build = Constants.expoConfig?.android?.versionCode ?? 1;

  return (
    <ScrollView
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
      {/* Appearance */}
      <Section title="Appearance">
        <Text style={[type.body, { color: palette.textSecondary, marginBottom: spacing.sm }]}>
          Theme
        </Text>
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          {THEME_OPTIONS.map((opt, i) => (
            <Pressable
              key={opt.key}
              onPress={() => setMode(opt.key)}
              style={[styles.radioRow, i > 0 && { borderTopColor: palette.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
              <Text style={[type.body, { color: palette.textPrimary }]}>{opt.label}</Text>
              <Ionicons
                name={mode === opt.key ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={mode === opt.key ? palette.accent : palette.textMuted}
              />
            </Pressable>
          ))}
        </View>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: spacing.md }}>
              <Text style={[type.body, { color: palette.textPrimary }]}>English films at Utazu</Text>
              <Text style={[type.meta, { color: palette.textMuted, marginTop: 2 }]}>
                {permDenied
                  ? 'Enable notifications in Android Settings to turn this on.'
                  : 'Get notified when a new English-language film appears at Utazu.'}
              </Text>
            </View>
            <Switch
              value={enabled && !permDenied}
              onValueChange={onToggleNotifications}
              disabled={permDenied}
              trackColor={{ true: palette.accent, false: palette.border }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </Section>

      {/* About */}
      <Section title="About">
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <AboutRow label="App version" value={`${version} (${build})`} border={false} />
          <AboutRow label="Last scrape" value={formatShortDate(lastScrape.data?.started_at)} />
          <AboutRow label="Data source" value="AEON Cinema" />
        </View>
      </Section>
    </ScrollView>
  );

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <View style={{ marginBottom: spacing.xxl }}>
        <Text style={[type.sectionHead, { color: palette.textPrimary, marginBottom: spacing.lg }]}>
          {title}
        </Text>
        {children}
      </View>
    );
  }

  function AboutRow({ label, value, border = true }: { label: string; value: string; border?: boolean }) {
    return (
      <View style={[styles.row, border && { borderTopColor: palette.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
        <Text style={[type.body, { color: palette.textSecondary }]}>{label}</Text>
        <Text style={[type.body, { color: palette.textPrimary }]}>{value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  card: { borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});
