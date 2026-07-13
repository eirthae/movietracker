import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const hasBackend = Boolean(url && key);

/**
 * With no .env the app runs on bundled mock data so the UI can be previewed
 * before the backend is live; `?mock` in the URL forces it.
 */
export const USE_MOCK =
  !hasBackend || new URLSearchParams(window.location.search).has('mock');

export const supabase: SupabaseClient = hasBackend
  ? createClient(url!, key!)
  : (null as unknown as SupabaseClient);
