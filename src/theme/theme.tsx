/**
 * Theme context: resolves the active palette from the user's preference
 * (System / Light / Dark), persists the choice in AsyncStorage, and switches
 * instantly with no restart (brief §16).
 *
 * Usage in components:
 *   const { palette, mode, setMode, isDark } = useTheme();
 *   <View style={{ backgroundColor: palette.background }} />
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

import { colors, type Palette } from './tokens';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'cinema-tracker:theme-mode';

type ThemeContextValue = {
  /** The active resolved palette (already accounts for system + override). */
  palette: Palette;
  /** The user's stored preference. */
  mode: ThemeMode;
  /** Whether the resolved theme is dark. */
  isDark: boolean;
  /** Update + persist the preference. */
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type SystemScheme = 'light' | 'dark';

function normalizeScheme(scheme: string | null | undefined): SystemScheme {
  return scheme === 'light' ? 'light' : 'dark';
}

function resolveIsDark(mode: ThemeMode, system: SystemScheme): boolean {
  if (mode === 'system') return system === 'dark';
  return mode === 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<SystemScheme>(
    normalizeScheme(Appearance.getColorScheme()),
  );

  // Load the persisted preference once on mount.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setModeState(stored);
      }
    });
  }, []);

  // Track OS appearance changes so 'system' mode reacts live.
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) =>
      setSystemScheme(normalizeScheme(colorScheme)),
    );
    return () => sub.remove();
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = resolveIsDark(mode, systemScheme);
    return {
      mode,
      isDark,
      palette: isDark ? colors.dark : colors.light,
      setMode,
    };
  }, [mode, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
