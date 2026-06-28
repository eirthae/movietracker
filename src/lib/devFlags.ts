/**
 * Whether to use bundled mock data instead of Supabase.
 *
 * Tied to __DEV__ so it can never leak into a shipped APK:
 *  - dev (expo start / web / Expo Go) → true → bundled mock data, so the UI can
 *    be previewed before the backend is live
 *  - release builds (eas build) → false → real Supabase data
 *
 * Set this to a literal `false` if you want a dev build to hit the real backend.
 */
export const USE_MOCK = __DEV__;
