/**
 * Design tokens — derived from the GitLab Brand Color System.
 * https://design.gitlab.com/brand-design/color
 *
 * Components must NEVER reference raw hex values or `colors.dark`/`colors.light`
 * directly — always go through the `useTheme()` hook (see theme.tsx), which
 * returns the active palette. This keeps acceptance criterion #15 satisfied.
 */

export const colors = {
  dark: {
    background: '#1F1E24', // GitLab dark base
    surface: '#2B2A33', // card background
    surfaceElevated: '#363540', // modals, bottom sheets
    accent: '#7759C2', // GitLab Purple — tabs, active states
    accentSubtle: '#3D2F6B', // pressed states
    textPrimary: '#FAFAFA',
    textSecondary: '#A8A7B3',
    textMuted: '#6E6D7A',
    border: '#3D3C48',
    error: '#C24040', // GitLab Red
    success: '#2DA160', // GitLab Green
    badgeEnglish: '#2DA160', // GitLab Green
    badgeJapanese: '#525160', // neutral mid
    badgeUnknown: 'transparent',
  },
  light: {
    background: '#FFFFFF',
    surface: '#F5F4FA',
    surfaceElevated: '#ECEAF5',
    accent: '#6B4FBB', // GitLab Purple (slightly deeper for contrast on white)
    accentSubtle: '#E8E2F7',
    textPrimary: '#1F1E24',
    textSecondary: '#525160',
    textMuted: '#A8A7B3',
    border: '#E0DFF0',
    error: '#B03030',
    success: '#2DA160',
    badgeEnglish: '#2DA160',
    badgeJapanese: '#8A8998',
    badgeUnknown: 'transparent',
  },
} as const;

export type ColorName = keyof typeof colors.dark;
/** A theme palette: the same keys as the dark palette, with string color values.
 *  (Mapped to `string` so the light & dark literal-typed palettes are interchangeable.) */
export type Palette = { [K in ColorName]: string };

/**
 * Typography scale (brief §10). `color` is intentionally omitted here — color
 * is applied at render time from the active palette so it adapts to the theme.
 */
export const type = {
  title: { fontSize: 16, fontWeight: '700' },
  titleSub: { fontSize: 13, fontWeight: '400' },
  body: { fontSize: 13, fontWeight: '400' },
  meta: { fontSize: 12, fontWeight: '400' },
  screenTime: { fontSize: 12, fontFamily: 'monospace' },
  badge: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  sectionHead: { fontSize: 14, fontWeight: '700' },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;
