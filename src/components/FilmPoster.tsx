import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/theme';
import { radius, spacing } from '@/theme/tokens';
import { filmLanguage } from '@/lib/queries';
import type { FilmWithScreenings } from '@/lib/types';
import { LanguageBadge } from './LanguageBadge';

/**
 * The Cinemas grid item: just the poster + language badge. All textual detail
 * lives on the film detail screen (tap to open).
 */
export function FilmPoster({ film }: { film: FilmWithScreenings }) {
  const { palette } = useTheme();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/film/${film.id}`)}
      style={({ pressed }) => [styles.wrap, { opacity: pressed ? 0.8 : 1 }]}>
      <View style={[styles.poster, { backgroundColor: palette.surfaceElevated }]}>
        {film.poster_url ? (
          <Image source={{ uri: film.poster_url }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
        ) : (
          <Ionicons name="film-outline" size={28} color={palette.textMuted} />
        )}
        <View style={styles.badge}>
          <LanguageBadge language={filmLanguage(film)} />
        </View>
      </View>
    </Pressable>
  );
}

/** 3-column poster grid (negative margin trick gives even gutters at the edges). */
export function PosterGrid({ films }: { films: FilmWithScreenings[] }) {
  return (
    <View style={styles.grid}>
      {films.map((f) => (
        <View key={f.id} style={styles.cell}>
          <FilmPoster film={f} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs },
  cell: { width: '33.333%', padding: spacing.xs },
  wrap: { flex: 1 },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: { position: 'absolute', top: spacing.xs, right: spacing.xs },
});
