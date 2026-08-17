import { load, remove, save } from '../lib/storage';

type Envelope<T> = { at: number; value: T };

const memory = new Map<string, unknown>();

/**
 * API lookups (iTunes track search, Wikipedia page images) return the same
 * answer for weeks, and iTunes rate-limits by IP — so results are cached hard.
 */
export async function cached<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  if (memory.has(key)) return memory.get(key) as T;

  const stored = load<Envelope<T> | null>(`cache:${key}`, null);
  if (stored && Date.now() - stored.at < ttlMs) {
    memory.set(key, stored.value);
    return stored.value;
  }

  const value = await fetcher();
  memory.set(key, value);
  save(`cache:${key}`, { at: Date.now(), value } satisfies Envelope<T>);
  return value;
}

/**
 * Drops a cached entry from both tiers.
 *
 * Almost nothing needs this — an iTunes lookup is the same answer next week.
 * The moderation hide-list is the exception: when a moderator hides a round,
 * the list they cached seconds ago is now wrong, and it has to be refetched
 * rather than sat on until the TTL expires.
 */
export function invalidate(key: string): void {
  memory.delete(key);
  remove(`cache:${key}`);
}

export const WEEK = 7 * 24 * 60 * 60 * 1000;
export const MONTH = 30 * 24 * 60 * 60 * 1000;

/** Collapses accents/punctuation so "Dont Stop Me Now" matches "Don't Stop Me Now". */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Run promises with a concurrency cap so we don't hammer an API with 12 at once. */
export async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const i = cursor++;
      if (i >= items.length) return;
      results[i] = await fn(items[i] as T, i);
    }
  });
  await Promise.all(workers);
  return results;
}
