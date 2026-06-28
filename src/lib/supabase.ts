import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client (read-only via the publishable key — RLS allows SELECT only).
 * Values come from app config / env via Expo's EXPO_PUBLIC_* convention, so they
 * are baked into the bundle at build time. The publishable key is client-safe.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Fail loud in dev rather than silently returning no data.
  console.warn(
    '[supabase] Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY — check your .env',
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '', {
  auth: {
    storage: AsyncStorage,
    persistSession: false, // no auth in this app
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
