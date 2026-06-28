import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/theme';
import { radius, spacing, type } from '@/theme/tokens';
import { useCinemas } from '@/lib/queries';
import { supabase } from '@/lib/supabase';

export default function ManageCinemasScreen() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const cinemasQ = useCinemas();
  const cinemas = cinemasQ.data ?? [];

  const [url, setUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['cinemas'] });
    qc.invalidateQueries({ queryKey: ['films'] });
  };

  const onAdd = async () => {
    const trimmed = url.trim();
    setError(null);
    if (!/aeoncinema\.com/i.test(trimmed)) {
      setError('Enter an AEON cinema URL, e.g. https://cinema.aeoncinema.com/wm/utazu/');
      return;
    }
    setAdding(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('manage-cinema', {
        body: { action: 'add', url: trimmed },
      });
      if (fnErr) throw new Error(fnErr.message);
      if (data?.error) throw new Error(data.error);
      setUrl('');
      refresh();
      Alert.alert('Cinema added', `${data?.name ?? 'Cinema'} is now being tracked.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add cinema.');
    } finally {
      setAdding(false);
    }
  };

  const onDelete = (id: string, name: string) => {
    Alert.alert('Remove cinema', `Remove ${name} and all its films?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          setBusyId(id);
          try {
            const { data, error: fnErr } = await supabase.functions.invoke('manage-cinema', {
              body: { action: 'delete', id },
            });
            if (fnErr) throw new Error(fnErr.message);
            if (data?.error) throw new Error(data.error);
            refresh();
          } catch (e) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Could not remove cinema.');
          } finally {
            setBusyId(null);
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: palette.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
        {/* Add */}
        <Text style={[type.sectionHead, { color: palette.textPrimary, marginBottom: spacing.sm }]}>
          Add a cinema
        </Text>
        <Text style={[type.meta, { color: palette.textMuted, marginBottom: spacing.md }]}>
          Paste any AEON Cinema schedule URL (cinema.aeoncinema.com/wm/…). Works for any AEON theatre in Japan.
        </Text>
        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="https://cinema.aeoncinema.com/wm/utazu/"
          placeholderTextColor={palette.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.textPrimary }]}
        />
        {!!error && (
          <Text style={[type.meta, { color: palette.error, marginTop: spacing.sm }]}>{error}</Text>
        )}
        <Pressable
          onPress={onAdd}
          disabled={adding}
          style={[styles.addBtn, { backgroundColor: palette.accent, opacity: adding ? 0.6 : 1 }]}>
          {adding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[type.body, { color: '#fff', fontWeight: '700' }]}>Add &amp; scrape</Text>
          )}
        </Pressable>

        {/* List */}
        <Text style={[type.sectionHead, { color: palette.textPrimary, marginTop: spacing.xxl, marginBottom: spacing.md }]}>
          Your cinemas
        </Text>
        {cinemasQ.isLoading ? (
          <ActivityIndicator color={palette.accent} />
        ) : cinemas.length === 0 ? (
          <Text style={[type.body, { color: palette.textMuted }]}>No cinemas yet.</Text>
        ) : (
          <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            {cinemas.map((c, i) => (
              <View
                key={c.id}
                style={[styles.row, i > 0 && { borderTopColor: palette.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[type.body, { color: palette.textPrimary }]}>{c.name}</Text>
                  <Text style={[type.meta, { color: palette.textMuted }]}>{c.id}</Text>
                </View>
                {busyId === c.id ? (
                  <ActivityIndicator color={palette.accent} />
                ) : (
                  <Pressable onPress={() => onDelete(c.id, c.name)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={20} color={palette.error} />
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
  },
  addBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  card: { borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.md },
});
