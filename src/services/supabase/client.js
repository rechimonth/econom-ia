import { createClient } from '@supabase/supabase-js';

let supabaseClient;

export function getSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error('SUPABASE_AUTH_NOT_CONFIGURED');
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, publishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseClient;
}
