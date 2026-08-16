import { load, save } from './storage';

/**
 * Config resolves in two layers: build-time env vars (`.env.local`) provide the
 * defaults, and anything the player types into the in-app Settings panel
 * overrides them. That way a deployed copy can ship with keys baked in while a
 * `git clone` still works with zero setup.
 */
export type Settings = {
  supabaseUrl: string;
  supabaseKey: string;
  handle: string;
  /** True once the player has chosen a name themselves. */
  handleLocked: boolean;
  sfx: boolean;
};

const env = import.meta.env;

const DEFAULTS: Settings = {
  supabaseUrl: (env.VITE_SUPABASE_URL as string) || '',
  supabaseKey: (env.VITE_SUPABASE_ANON_KEY as string) || '',
  handle: '',
  handleLocked: false,
  sfx: true,
};

let current: Settings = { ...DEFAULTS, ...load<Partial<Settings>>('settings', {}) };

const listeners = new Set<(s: Settings) => void>();

export function getSettings(): Settings {
  return current;
}

export function updateSettings(patch: Partial<Settings>): Settings {
  current = { ...current, ...patch };
  // Only persist what differs from the env defaults, so rotating a key in
  // `.env.local` isn't silently shadowed by a stale localStorage copy.
  const overrides: Partial<Settings> = {};
  for (const k of Object.keys(current) as (keyof Settings)[]) {
    if (current[k] !== DEFAULTS[k]) (overrides as Record<string, unknown>)[k] = current[k];
  }
  save('settings', overrides);
  for (const fn of listeners) fn(current);
  return current;
}

export function onSettingsChange(fn: (s: Settings) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const hasSupabase = () =>
  current.supabaseUrl.trim().length > 0 && current.supabaseKey.trim().length > 0;
