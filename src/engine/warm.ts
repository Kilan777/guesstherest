import type { Deck, GameDef } from './types';

/**
 * Deck pre-warming.
 *
 * Building a deck means talking to iTunes or Wikipedia, and doing that only
 * once the game screen opens means staring at a spinner. Hovering a card is a
 * strong signal you're about to play it, so that's when the fetching starts —
 * by the time the click lands the deck is usually already in hand.
 *
 * A warmed deck is claimed exactly once. Playing the same game again builds a
 * fresh one, otherwise you'd get the same ten rounds every time.
 */

type Entry = { promise: Promise<Deck>; startedAt: number };

const warmed = new Map<string, Entry>();

/** Warmed content goes stale — a deck held too long may reference expired URLs. */
const MAX_AGE_MS = 10 * 60 * 1000;

export function warmDeck(game: GameDef): void {
  // A game that asks a question first has nothing to warm — we don't know which
  // deck the player wants yet.
  if (game.options) return;
  const existing = warmed.get(game.slug);
  if (existing && Date.now() - existing.startedAt < MAX_AGE_MS) return;

  const promise = game.loadDeck(game.rounds, Math.random);
  // Nothing may be awaiting this yet; mark it handled so a failed warm-up
  // doesn't surface as an unhandled rejection. The stored promise keeps its
  // rejection for whoever eventually claims it.
  promise.catch(() => warmed.delete(game.slug));
  warmed.set(game.slug, { promise, startedAt: Date.now() });
}

/** Takes the warmed deck if there is a fresh one, otherwise null. */
export function claimDeck(game: GameDef): Promise<Deck> | null {
  const entry = warmed.get(game.slug);
  if (!entry) return null;
  warmed.delete(game.slug);
  if (Date.now() - entry.startedAt > MAX_AGE_MS) return null;
  return entry.promise;
}

export function isWarm(slug: string): boolean {
  const entry = warmed.get(slug);
  return !!entry && Date.now() - entry.startedAt < MAX_AGE_MS;
}

const inflight = new Map<string, Promise<Deck>>();

/**
 * One deck build per logical load.
 *
 * React StrictMode mounts every component twice in development, so the session's
 * load effect fires twice and — without this — builds two full decks, doubling
 * the API calls and the time to first round. The cancelled-flag guard stops the
 * second result being *used*, but not from being fetched.
 *
 * Keyed by attempt, so pressing "Play again" still gets fresh content.
 */
export function loadDeckOnce(game: GameDef, attempt: string, option?: string): Promise<Deck> {
  const key = `${game.slug}#${option ?? ''}#${attempt}`;
  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = claimDeck(game) ?? game.loadDeck(game.rounds, Math.random, option);
  inflight.set(key, promise);
  // Held only long enough to absorb the double mount, not to cache results.
  const release = () => setTimeout(() => inflight.delete(key), 2000);
  promise.then(release, release);
  return promise;
}
