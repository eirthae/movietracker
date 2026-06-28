import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/theme';
import { radius } from '@/theme/tokens';
import type { Language } from '@/lib/types';

const LABELS: Record<Language, string> = {
  english: 'ENG',
  japanese: '日本',
  unknown: '?',
};

/** Compact language label. `size` controls scale on dense poster grids vs detail. */
export function LanguageBadge({
  language,
  size = 'sm',
}: {
  language: Language;
  size?: 'sm' | 'md';
}) {
  const { palette } = useTheme();
  const isUnknown = language === 'unknown';
  const isKanji = language === 'japanese';

  const bg =
    language === 'english'
      ? palette.badgeEnglish
      : language === 'japanese'
        ? palette.badgeJapanese
        : 'transparent';

  const scale = size === 'md' ? { fontSize: 11, padV: 3, padH: 7 } : { fontSize: 10, padV: 2, padH: 5 };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingVertical: scale.padV,
          paddingHorizontal: scale.padH,
          borderWidth: isUnknown ? StyleSheet.hairlineWidth : 0,
          borderColor: palette.badgeJapanese,
        },
      ]}>
      <Text
        style={{
          fontSize: scale.fontSize,
          fontWeight: '700',
          letterSpacing: isKanji ? 0 : 0.5,
          color: isUnknown ? palette.textMuted : '#FFFFFF',
        }}>
        {LABELS[language]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
});
