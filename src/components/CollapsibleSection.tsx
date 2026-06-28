import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';

import { useTheme } from '@/theme/theme';
import { spacing, type } from '@/theme/tokens';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function CollapsibleSection({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const { palette } = useTheme();
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };

  return (
    <View>
      <Pressable onPress={toggle} style={styles.header}>
        <Ionicons
          name={open ? 'chevron-down' : 'chevron-forward'}
          size={18}
          color={palette.textSecondary}
        />
        <Text style={[type.sectionHead, { color: palette.textPrimary }]}>{title}</Text>
        {count != null && (
          <Text style={[type.meta, { color: palette.textMuted }]}>{count}</Text>
        )}
      </Pressable>
      {open && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  body: { gap: spacing.md, paddingTop: spacing.sm },
});
