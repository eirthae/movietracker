import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/theme';
import { radius, spacing, type } from '@/theme/tokens';
import { formatDate } from '@/lib/format';
import type { Screening } from '@/lib/types';

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dayParts(iso: string): { weekday: string; day: number } {
  const [y, m, d] = iso.split('-').map(Number);
  return { weekday: WEEK[new Date(y, m - 1, d).getDay()], day: d };
}

type DayTimes = { date: string; times: string[] };

/**
 * Showtimes for a (single-language) film: one unified card holding an iOS-style
 * day tab strip — with a caret under the selected day pointing at its times —
 * and that day's times as large display pills. Defaults to today, else the next
 * day with showings. Times are informational, not tappable.
 */
export function Showtimes({ screenings }: { screenings: Screening[] }) {
  const { palette } = useTheme();

  const days = useMemo<DayTimes[]>(() => {
    const map = new Map<string, Set<string>>();
    for (const s of screenings) {
      const set = map.get(s.date) ?? new Set<string>();
      for (const t of s.times) set.add(t);
      map.set(s.date, set);
    }
    return [...map.keys()]
      .sort()
      .map((date) => ({ date, times: [...map.get(date)!].sort() }));
  }, [screenings]);

  const [selDate, setSelDate] = useState<string>(() => {
    const today = todayISO();
    return (
      days.find((d) => d.date === today)?.date ??
      days.find((d) => d.date > today)?.date ??
      days[0]?.date ??
      ''
    );
  });

  if (!days.length) {
    return <Text style={[type.body, { color: palette.textMuted }]}>No showtimes listed.</Text>;
  }

  const today = todayISO();
  const current = days.find((d) => d.date === selDate) ?? days[0];

  return (
    <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dates}>
        {days.map((d) => {
          const active = d.date === current.date;
          const isToday = d.date === today;
          const { weekday, day } = dayParts(d.date);
          return (
            <Pressable
              key={d.date}
              onPress={() => setSelDate(d.date)}
              style={[styles.tab, active && { backgroundColor: palette.accent }]}>
              <Text style={[styles.tw, { color: active ? 'rgba(255,255,255,0.85)' : palette.textSecondary }]}>
                {isToday ? 'Today' : weekday}
              </Text>
              <Text style={[styles.tn, { color: active ? '#fff' : palette.textPrimary }]}>{day}</Text>
              {active && <View style={[styles.caret, { borderTopColor: palette.accent }]} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.divider, { backgroundColor: palette.border }]} />

      <Text style={[type.meta, styles.label, { color: palette.textSecondary }]}>
        {formatDate(current.date)}
      </Text>

      <View style={styles.times}>
        {current.times.map((t, i) => (
          <View
            key={`${t}-${i}`}
            style={[styles.pill, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}>
            <Text style={[styles.time, { color: palette.textPrimary }]}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  dates: { gap: spacing.sm, paddingBottom: 14 },
  tab: {
    width: 50,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  tw: { fontSize: 11 },
  tn: { fontSize: 17, fontWeight: '600', marginTop: 2 },
  caret: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -7,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  divider: { height: StyleSheet.hairlineWidth, marginBottom: spacing.md },
  label: { marginBottom: spacing.md, marginLeft: 2 },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  pill: {
    minWidth: 82,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  time: { fontFamily: 'monospace', fontSize: 19 },
});
