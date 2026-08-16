import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSettings, hasSupabase, onSettingsChange } from './settings';

let client: SupabaseClient | null = null;
let clientKey = '';

/** Rebuilt automatically if the player pastes different credentials at runtime. */
export function getSupabase(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  const { supabaseUrl, supabaseKey } = getSettings();
  const key = `${supabaseUrl}|${supabaseKey}`;
  if (client && clientKey === key) return client;
  try {
    client = createClient(supabaseUrl.trim(), supabaseKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Google sends the player back here with tokens in the URL fragment;
        // the client has to read them to complete the sign-in.
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    });
    clientKey = key;
    sessionPromise = null;
    return client;
  } catch {
    client = null;
    return null;
  }
}

onSettingsChange(() => {
  clientKey = '';
  sessionPromise = null;
});

let sessionPromise: Promise<string | null> | null = null;

/** The signed-in user id, if there already is a session. Never creates one. */
export async function existingUserId(): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data } = await sb.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Leaderboard writes are authenticated as a real Supabase user — signed in with
 * Google, or anonymously for players who'd rather not. Either way they get an
 * `auth.uid()`, which is what the RLS insert policy checks, so nobody can post
 * a score under someone else's id.
 *
 * The anonymous path requires "Allow anonymous sign-ins" in the project's Auth
 * settings. Called lazily — merely looking at a leaderboard shouldn't mint an
 * account.
 */
export function ensureSession(): Promise<string | null> {
  if (sessionPromise) return sessionPromise;
  sessionPromise = (async () => {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data } = await sb.auth.getSession();
      if (data.session?.user) return data.session.user.id;
      const { data: signed, error } = await sb.auth.signInAnonymously();
      if (error) {
        console.warn('[guess-the] anonymous sign-in failed:', error.message);
        return null;
      }
      return signed.user?.id ?? null;
    } catch (err) {
      console.warn('[guess-the] supabase unreachable:', err);
      return null;
    }
  })();
  return sessionPromise;
}
