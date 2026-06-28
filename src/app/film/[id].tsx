import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LanguageBadge } from '@/components/LanguageBadge';
import { Showtimes } from '@/components/Showtimes';
import { useTheme } from '@/theme/theme';
import { spacing, type } from '@/theme/tokens';
import { formatRun } from '@/lib/format';
import { displayTitle, filmLanguage, useFilm } from '@/lib/queries';

const HERO_HEIGHT = 215;

export default function FilmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const { data: film, isLoading, isError } = useFilm(id);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: palette.background }]}>
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }
  if (isError || !film) {
    return (
      <View style={[styles.centered, { backgroundColor: palette.background }]}>
        <Text style={[type.body, { color: palette.error }]}>Film not found.</Text>
      </View>
    );
  }

  const run = formatRun(film.run_from, film.run_to);
  const { primary, secondary } = displayTitle(film);

  return (
    <ScrollView
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
      {/* Full-bleed hero poster */}
      <View style={[styles.hero, { height: HERO_HEIGHT + insets.top, backgroundColor: palette.surfaceElevated }]}>
        {film.poster_url ? (
          <Image source={{ uri: film.poster_url }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
        ) : (
          <Ionicons name="film-outline" size={64} color={palette.textMuted} />
        )}
        <View style={[styles.badge, { top: insets.top + spacing.md }]}>
          <LanguageBadge language={filmLanguage(film)} size="md" />
        </View>
      </View>

      {/* Content */}
      <View style={styles.body}>
        <Text style={[styles.title, { color: palette.textPrimary }]}>{primary}</Text>
        {!!secondary && (
          <Text style={[type.titleSub, { color: palette.textSecondary, marginTop: 2 }]}>{secondary}</Text>
        )}
        {!!run && (
          <Text style={[type.meta, { color: palette.textMuted, marginTop: spacing.xs }]}>{run}</Text>
        )}

        {!!film.description && (
          <Text style={[type.body, { color: palette.textPrimary, marginTop: spacing.lg, lineHeight: 22 }]}>
            {film.description}
          </Text>
        )}

        {!!film.cast.length && (
          <Text style={[type.body, { marginTop: spacing.lg }]}>
            <Text style={{ color: palette.textSecondary, fontWeight: '700' }}>Cast: </Text>
            <Text style={{ color: palette.textMuted }}>{film.cast.join(', ')}</Text>
          </Text>
        )}

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[type.sectionHead, { color: palette.textPrimary, marginBottom: spacing.lg }]}>
            Showtimes
          </Text>
          <Showtimes screenings={film.screenings} />
        </View>

        {!!film.source_url && (
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync(film.source_url!)}
            style={styles.aeonLink}
            hitSlop={8}>
            <Ionicons name="open-outline" size={14} color={palette.textMuted} />
            <Text style={[type.meta, { color: palette.textMuted }]}>View on AEON</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badge: { position: 'absolute', right: spacing.lg },
  body: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: '700' },
  aeonLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
  },
});
