import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// The app must still run (in demo/mock mode) if these aren't set yet —
// this flag is checked everywhere data is fetched so we can fall back gracefully.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[revenue-agent-hub] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — running in local demo/mock mode. ' +
      'See supabase/README.md to wire up the real backend.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
