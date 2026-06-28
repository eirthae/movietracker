import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CollapsibleSection } from '@/components/CollapsibleSection';
import { PosterGrid } from '@/components/FilmPoster';
import { StaleBanner } from '@/components/StaleBanner';
import { useTheme } from '@/theme/theme';
import { radius, spacing, type } from '@/theme/tokens';
import { formatShortDate } from '@/lib/format';
import { useCinemaFilms, useCinemas, useLastScrape } from '@/lib/queries';

export default function CinemasScreen() {
  const { palette } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cinemasQ = useCinemas();
  const cinemas = useMemo(() => cinemasQ.data ?? [], [cinemasQ.data]);
  const [selectedId, setSelectedId] = useState<string | undefined>();

  // Default-select the first cinema once they load / keep selection valid.
  useEffect(() => {
    if (!cinemas.length) {
      setSelectedId(undefined);
      return;
    }
    if (!selectedId || !cinemas.some((c) => c.id === selectedId)) {
      setSelectedId(cinemas[0].id);
    }
  }, [cinemas, selectedId]);

  const filmsQ = useCinemaFilms(selectedId);
  const scrapeQ = useLastScrape(selectedId);

  const refreshing =
    (filmsQ.isFetching && !filmsQ.isLoading) || cinemasQ.isFetching;
  const onRefresh = () => {
    cinemasQ.refetch();
    filmsQ.refetch();
    scrapeQ.refetch();
  };

  // ---- Empty state: no cinemas at all ----
  if (cinemasQ.isLoading) {
    return <Centered><ActivityIndicator color={palette.accent} /></Centered>;
  }
  if (!cinemas.length) {
    return (
      <Centered>
        <Ionicons name="film-outline" size={48} color={palette.textMuted} />
        <Text style={[type.sectionHead, { color: palette.textPrimary, marginTop: spacing.md }]}>
          No cinemas yet
        </Text>
        <Text style={[type.body, { color: palette.textSecondary, textAlign: 'center', marginTop: spacing.xs }]}>
          Add an AEON cinema to start tracking films.
        </Text>
        <Pressable
          onPress={() => router.push('/manage')}
          style={[styles.addBtn, { backgroundColor: palette.accent, marginTop: spacing.lg }]}>
          <Text style={[type.body, { color: '#fff', fontWeight: '700' }]}>Add cinema</Text>
        </Pressable>
      </Centered>
    );
  }

  const films = filmsQ.data;

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      {/* Cinema tab bar */}
      <View style={[styles.tabBarWrap, { borderBottomColor: palette.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}>
          {cinemas.map((c) => {
            const active = c.id === selectedId;
            return (
              <Pressable
                key={c.id}
                onPress={() => setSelectedId(c.id)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: active ? palette.accent : palette.surface,
                    borderColor: active ? palette.accent : palette.border,
                  },
                ]}>
                <Text
                  style={[
                    type.body,
                    { color: active ? '#fff' : palette.textSecondary, fontWeight: active ? '700' : '400' },
                  ]}>
                  {c.name.replace(/^AEON Cinema /i, '')}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.accent} />
        }>
        {/* Updated date */}
        <Text style={[type.meta, { color: palette.textMuted, marginBottom: spacing.md }]}>
          Updated {formatShortDate(scrapeQ.data?.started_at)}
        </Text>

        <StaleBanner lastScrapeAt={scrapeQ.data?.started_at} />

        {filmsQ.isLoading ? (
          <ActivityIndicator color={palette.accent} style={{ marginTop: spacing.xxl }} />
        ) : filmsQ.isError ? (
          <Text style={[type.body, { color: palette.error }]}>
            Couldn’t load films. Pull to retry.
          </Text>
        ) : (
          <>
            <Text style={[type.sectionHead, { color: palette.textPrimary, marginBottom: spacing.lg }]}>
              Now Showing
            </Text>
            {films && films.now_showing.length ? (
              <PosterGrid films={films.now_showing} />
            ) : (
              <Text style={[type.body, { color: palette.textMuted }]}>
                No films currently showing.
              </Text>
            )}

            {films && films.upcoming.length > 0 && (
              <View style={{ marginTop: spacing.xxl }}>
                <CollapsibleSection title="Coming Soon" count={films.upcoming.length}>
                  <View style={{ marginTop: spacing.sm }}>
                    <PosterGrid films={films.upcoming} />
                  </View>
                </CollapsibleSection>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  const { palette } = useTheme();
  return (
    <View style={[styles.centered, { backgroundColor: palette.background }]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  tabBarWrap: { borderBottomWidth: StyleSheet.hairlineWidth },
  tabBar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  manageTab: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  addBtn: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.md },
  content: { padding: spacing.lg },
});
