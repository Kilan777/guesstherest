import { load, save } from './storage';
import { getSupabase } from './supabase';

export type PlayEntry = { slug: string; at: number; score: number };

const KEY = 'history';
const MAX = 60;

export function recordPlay(slug: string, score: number): void {
  const all = load<PlayEntry[]>(KEY, []);
  all.unshift({ slug, at: Date.now(), score });
  save(KEY, all.slice(0, MAX));
}

/** Most recently finished games on this device, newest first, no repeats. */
export function localRecent(limit = 4): string[] {
  const seen = new Set<string>();
  for (const e of load<PlayEntry[]>(KEY, [])) {
    if (!seen.has(e.slug)) seen.add(e.slug);
    if (seen.size >= limit) break;
  }
  return [...seen];
}

export function localCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const e of load<PlayEntry[]>(KEY, [])) {
    counts.set(e.slug, (counts.get(e.slug) ?? 0) + 1);
  }
  return counts;
}

/**
 * Recently played, preferring the cloud so it follows a signed-in player between
 * browsers. Falls back to this device's history, which is also what an
 * anonymous player gets.
 */
export async function recentGames(userId: string | null, limit = 4): Promise<string[]> {
  const sb = getSupabase();
  if (sb && userId) {
    try {
      const { data, error } = await sb
        .from('scores')
        .select('game_slug, created_at')
        .eq('player_id', userId)
        .order('created_at', { ascending: false })
        .limit(60);
      if (!error && data?.length) {
        const seen: string[] = [];
        for (const row of data) {
          const slug = row.game_slug as string;
          if (!seen.includes(slug)) seen.push(slug);
          if (seen.length >= limit) break;
        }
        return seen;
      }
    } catch {
      /* fall through to local */
    }
  }
  return localRecent(limit);
}

export type Trending = {
  slugs: string[];
  source: 'global' | 'local' | 'picks';
};

/**
 * Shown before there's any play data to rank. An empty "Trending" row on a
 * first visit is worse than an honest set of suggestions, so these stand in —
 * labelled as picks, not as a trend nobody has actually set.
 */
const STARTER_PICKS = ['song', 'scene', 'rebus'];

/**
 * What everyone has been playing this week. With no backend (or no rows yet)
 * this falls back to this device's own counts, and the UI says which it is
 * rather than passing local habits off as a global trend.
 */
export async function trendingGames(limit = 3): Promise<Trending> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('trending')
        .select('game_slug, plays')
        .order('plays', { ascending: false })
        .limit(limit);
      if (!error && data?.length) {
        return { slugs: data.map((r) => r.game_slug as string), source: 'global' };
      }
    } catch {
      /* fall through to local */
    }
  }

  const counts = [...localCounts().entries()].sort((a, b) => b[1] - a[1]);
  if (counts.length >= limit) {
    return { slugs: counts.slice(0, limit).map(([slug]) => slug), source: 'local' };
  }

  // Top up thin local history with the starter picks so the row is never short.
  const slugs = counts.map(([slug]) => slug);
  for (const pick of STARTER_PICKS) {
    if (slugs.length >= limit) break;
    if (!slugs.includes(pick)) slugs.push(pick);
  }
  return { slugs, source: counts.length ? 'local' : 'picks' };
}
