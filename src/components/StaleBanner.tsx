import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/theme';
import { radius, spacing, type } from '@/theme/tokens';
import { daysSince } from '@/lib/format';

const STALE_DAYS = 14;

/** Shows when the last successful scrape is older than 2 weeks (brief §13.1). */
export function StaleBanner({ lastScrapeAt }: { lastScrapeAt: string | null | undefined }) {
  const { palette } = useTheme();
  const days = daysSince(lastScrapeAt);
  if (days === null || days < STALE_DAYS) return null;

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: palette.accentSubtle, borderColor: palette.accent },
      ]}>
      <Ionicons name="alert-circle-outline" size={18} color={palette.accent} />
      <Text style={[type.meta, { color: palette.textPrimary, flex: 1 }]}>
        Showtimes may be out of date — last updated {days} days ago.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.md,
  },
});
