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
 * The featured row is curated rather than computed.
 *
 * It was ranked by play count, but with a handful of plays in the table that
 * ranking is noise — it surfaced whichever three games happened to be tried
 * first. These three are the ones worth showing a newcomer, in this order.
 */
const FEATURED = ['song', 'country', 'rebus'];

export async function trendingGames(limit = 3): Promise<Trending> {
  return { slugs: FEATURED.slice(0, limit), source: 'picks' };
}
