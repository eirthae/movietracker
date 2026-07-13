/**
 * Local preferences: theme (System/Light/Dark) + notifications toggle.
 * Persisted in localStorage; theme is applied as data-theme on <html> so the
 * CSS variables in tokens.css switch instantly.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeSetting = 'system' | 'light' | 'dark';

const THEME_KEY = 'ct.theme';
const NOTIFY_KEY = 'ct.notifyEnglish';

function systemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.dataset.theme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute('content', resolved === 'dark' ? '#1F1E24' : '#FFFFFF');
}

interface Prefs {
  theme: ThemeSetting;
  setTheme: (t: ThemeSetting) => void;
  notifyEnglish: boolean;
  setNotifyEnglish: (on: boolean) => void;
}

const PrefsContext = createContext<Prefs | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeSetting>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  });
  const [notifyEnglish, setNotifyState] = useState<boolean>(
    () => localStorage.getItem(NOTIFY_KEY) !== 'off',
  );

  useEffect(() => {
    applyTheme(theme === 'system' ? systemTheme() : theme);
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme(systemTheme());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((t: ThemeSetting) => {
    localStorage.setItem(THEME_KEY, t);
    setThemeState(t);
  }, []);

  const setNotifyEnglish = useCallback((on: boolean) => {
    localStorage.setItem(NOTIFY_KEY, on ? 'on' : 'off');
    setNotifyState(on);
    if (on && 'Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, notifyEnglish, setNotifyEnglish }),
    [theme, setTheme, notifyEnglish, setNotifyEnglish],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): Prefs {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs outside PrefsProvider');
  return ctx;
}
