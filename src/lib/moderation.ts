import { useEffect, useState } from 'react';
import { existingUserId, getSupabase } from './supabase';
import { getSettings, hasSupabase } from './settings';
import { cached, invalidate } from '../content/cache';

/**
 * Moderation: keeping bad rounds out of the deck.
 *
 * Two halves. A moderator signed in with their Google account gets a control on
 * the reveal screen that files the current round's id into `hidden_items`; every
 * client, signed in or not, reads that list and filters it out of the deck it
 * deals. See `supabase/migrations/0004_moderation.sql` for the policies.
 *
 * Nothing in here is allowed to break a game. Supabase being unreachable, the
 * tables not existing yet, a malformed response — every path resolves to "not a
 * moderator" and "nothing is hidden", because thirty games that still deal a
 * deck during an outage is worth far more than a hide-list that is always
 * current.
 *
 * The moderator check here decides one thing only: whether to render a button.
 * It is not what protects the table. Anyone can edit the JavaScript on a page
 * and make `isModerator()` return true; what stops them writing to
 * `hidden_items` is the RLS policy, which matches the verified email claim in
 * their JWT against the `moderators` table server-side.
 */

const HIDDEN_KEY = 'hidden-items';

/**
 * Short, because a hide has to take effect quickly for everyone — a moderator
 * pulling an offensive rebus does not want it dealt to players for another day.
 * Cheap to refresh: one small request per five minutes per browser.
 */
const HIDDEN_TTL = 5 * 60 * 1000;

/**
 * Deck building must not wait on Supabase. If the hide-list has not arrived in
 * this long, the deck is built unfiltered and the fetch is left to finish in
 * the background for the next deck. A stalled network delays a game by at most
 * this much.
 */
const HIDDEN_DEADLINE = 1200;

/** Sane upper bound on a hand-curated list; also stops a runaway table. */
const HIDDEN_LIMIT = 5000;

/**
 * How long to stop asking after a failed fetch.
 *
 * Without this, a project where the moderation migration has not been run yet
 * would fire a request that 404s on every single deck build — thirty games, a
 * fresh deck each time you press "Play again". One attempt a minute is plenty
 * to notice the tables appearing, and keeps the console quiet in between.
 */
const FAILURE_BACKOFF = 60 * 1000;

type HiddenRow = { game_slug: string; item_id: string };

const EMPTY: ReadonlySet<string> = new Set<string>();

// ── am I a moderator? ───────────────────────────────────────────────────────

let modPromise: Promise<boolean> | null = null;

/**
 * True when the current session belongs to a moderator.
 *
 * Asks the database rather than comparing emails here: the `moderators` SELECT
 * policy only ever exposes the caller's own row, so "did a row come back?" is
 * the whole check, and the answer is computed by the same policy that guards
 * the writes. No email ever needs to be hardcoded in the bundle.
 *
 * `existingUserId` rather than `ensureSession` on purpose — asking whether
 * someone is a moderator must never mint an anonymous account as a side effect.
 * Cached for the session; cleared when the auth state changes.
 */
export function isModerator(): Promise<boolean> {
  if (modPromise) return modPromise;
  modPromise = (async () => {
    try {
      const uid = await existingUserId();
      if (!uid) return false;
      const sb = await getSupabase();
      if (!sb) return false;
      const { data, error } = await sb.from('moderators').select('email').limit(1);
      // A missing table, a revoked grant, an outage: all "no".
      if (error) return false;
      return (data?.length ?? 0) > 0;
    } catch {
      return false;
    }
  })();
  return modPromise;
}

/** Forget the cached answer — call when someone signs in or out. */
export function resetModerator(): void {
  modPromise = null;
}

/**
 * `isModerator()` as a hook, re-checked whenever the auth state changes so the
 * controls appear on sign-in and vanish on sign-out without a reload.
 *
 * Returns false until proven otherwise, which is what keeps the controls
 * invisible for every normal player including during the check.
 */
export function useModerator(): boolean {
  const [mod, setMod] = useState(false);

  useEffect(() => {
    let alive = true;
    let unsubscribe: (() => void) | undefined;

    const check = () => {
      isModerator().then((v) => alive && setMod(v));
    };
    check();

    void (async () => {
      const sb = await getSupabase();
      if (!alive || !sb) return;
      const { data } = sb.auth.onAuthStateChange((event) => {
        // Only when the identity actually changes. INITIAL_SESSION fires on
        // load and would just repeat the check already in flight, and
        // TOKEN_REFRESHED is the same person with a fresher token.
        if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT' && event !== 'USER_UPDATED') return;
        resetModerator();
        check();
      });
      unsubscribe = () => data.subscription.unsubscribe();
    })();

    return () => {
      alive = false;
      unsubscribe?.();
    };
  }, []);

  return mod;
}

// ── the hide-list ───────────────────────────────────────────────────────────

let rowsPromise: Promise<HiddenRow[]> | null = null;
let failedAt = 0;

/**
 * The whole hide-list, in one request for the whole site rather than one per
 * game. It is a hand-curated list of tens of rows, so fetching all of it costs
 * less than thirty filtered requests would, and it means a deck can be filtered
 * without the deck builder having to know which game it is building for — which
 * is what lets all thirty games be covered by a single change. See `deck.ts`.
 *
 * Throws on failure so that a failure is never written to the cache; callers
 * below turn that into an empty set.
 */
function loadRows(): Promise<HiddenRow[]> {
  if (rowsPromise) return rowsPromise;
  if (failedAt && Date.now() - failedAt < FAILURE_BACKOFF) {
    return Promise.reject(new Error('hide-list unavailable'));
  }
  rowsPromise = cached(HIDDEN_KEY, HIDDEN_TTL, async () => {
    // Deliberately not the Supabase client.
    //
    // Every deck build reads this list, so it sits directly between opening a
    // game and the first round appearing — and pulling it through
    // `supabase-js` meant downloading 36 KB of client library first, on the
    // same phone connection the audio preview is waiting for. The hide-list is
    // world-readable by policy (see 0004_moderation.sql), so anon key in a
    // header is all PostgREST wants, and a plain GET costs nothing but the
    // request itself. Writes still go through the real client, where the auth
    // and session handling actually earn their weight.
    if (!hasSupabase()) throw new Error('supabase unavailable');
    const { supabaseUrl, supabaseKey } = getSettings();
    const key = supabaseKey.trim();
    const url =
      `${supabaseUrl.trim().replace(/\/+$/, '')}/rest/v1/hidden_items` +
      `?select=game_slug,item_id&limit=${HIDDEN_LIMIT}`;
    const res = await fetch(url, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`hide-list responded ${res.status}`);
    failedAt = 0;
    return (await res.json()) as HiddenRow[];
  }).catch((err: unknown) => {
    // Don't memoize the failure itself — just back off for a minute, so the
    // list is picked up soon after the tables appear without hammering until
    // they do. `cached` writes nothing when its fetcher throws, so no empty
    // list is left behind in localStorage either.
    rowsPromise = null;
    failedAt = Date.now();
    throw err;
  });
  return rowsPromise;
}

/** Local echo of hides made in this tab, so they apply before any refetch. */
const justHidden = new Set<string>();

function keyOf(gameSlug: string, itemId: string): string {
  return `${gameSlug} ${itemId}`;
}

/**
 * Hidden item ids for one game.
 *
 * Resolves to an empty set on any failure — Supabase down, tables not created
 * yet, request too slow. A game that deals an unfiltered deck is a far better
 * outcome than a game that will not deal one.
 */
export async function fetchHidden(gameSlug: string): Promise<Set<string>> {
  try {
    const rows = await withDeadline(loadRows(), HIDDEN_DEADLINE, [] as HiddenRow[]);
    const out = new Set<string>();
    for (const r of rows) if (r.game_slug === gameSlug) out.add(r.item_id);
    for (const k of justHidden) {
      const [slug, id] = k.split(' ');
      if (slug === gameSlug && id) out.add(id);
    }
    return out;
  } catch {
    return new Set<string>();
  }
}

/**
 * Every hidden id across every game, which is what the deck builder filters
 * against. Round ids carry their own game prefix — `song:`, `dish:`, `rebus:`,
 * thirty distinct ones — so matching on the id alone is exact without needing
 * to know the slug. Even if two games ever did collide on an id, the failure
 * mode is one extra item hidden, never bad content shown.
 */
export async function hiddenIds(): Promise<ReadonlySet<string>> {
  try {
    const rows = await withDeadline(loadRows(), HIDDEN_DEADLINE, [] as HiddenRow[]);
    if (!rows.length && !justHidden.size) return EMPTY;
    const out = new Set<string>();
    for (const r of rows) out.add(r.item_id);
    for (const k of justHidden) {
      const id = k.split(' ')[1];
      if (id) out.add(id);
    }
    return out;
  } catch {
    return EMPTY;
  }
}

/**
 * Take a round out of circulation. Returns false if the write was refused —
 * which is what a non-moderator gets, since the policy is the real gate.
 */
export async function hideItem(gameSlug: string, itemId: string, reason?: string): Promise<boolean> {
  try {
    const sb = await getSupabase();
    if (!sb) return false;
    const uid = await existingUserId();
    if (!uid) return false;

    const { error } = await sb.from('hidden_items').insert({
      game_slug: gameSlug,
      item_id: itemId,
      reason: reason ?? null,
      hidden_by: uid,
    });
    // Already hidden by someone else is a success from here: the item is out.
    if (error && error.code !== '23505') {
      console.warn('[guess-the] hide failed:', error.message);
      return false;
    }

    justHidden.add(keyOf(gameSlug, itemId));
    refresh();
    return true;
  } catch {
    return false;
  }
}

/** Undo a hide. */
export async function unhideItem(gameSlug: string, itemId: string): Promise<boolean> {
  try {
    const sb = await getSupabase();
    if (!sb) return false;

    const { error } = await sb
      .from('hidden_items')
      .delete()
      .eq('game_slug', gameSlug)
      .eq('item_id', itemId);
    if (error) {
      console.warn('[guess-the] unhide failed:', error.message);
      return false;
    }

    justHidden.delete(keyOf(gameSlug, itemId));
    refresh();
    return true;
  } catch {
    return false;
  }
}

// ── taking a handle off a board ─────────────────────────────────────────────

/**
 * Remove a player's scores for one game, which is how a bad handle comes off a
 * leaderboard.
 *
 * Scores are otherwise immutable — 0001 gave the table no UPDATE or DELETE
 * policy at all — and that is still true for players. `0005_handle_guard.sql`
 * adds a DELETE policy for moderators only, checked against the verified email
 * claim in the JWT exactly as the hide-list is.
 *
 * It deletes every score that player has for that game rather than the single
 * row on screen, because `leaderboard` is a DISTINCT ON view showing each
 * player's personal best: delete only their best run and their second-best run
 * takes its place, under the same name, and the moderator gets to play
 * whack-a-mole with one person's ten attempts. The handle is the problem, so
 * the handle has to go.
 *
 * Their scores on OTHER games are untouched. Those are separate boards with
 * their own rows, and a moderator looking at one board has only judged that
 * board; a name bad enough to remove everywhere is easier to sweep in the
 * dashboard than to guess at from here.
 *
 * Returns whether anything was actually removed. That distinction matters: a
 * non-moderator now holds the DELETE privilege but not the policy, so their
 * request is not an error — it matches zero rows and returns 200. Asking for
 * the deleted rows back with `.select()` and counting them is the only honest
 * way to tell "removed" from "refused".
 */
export async function removeScores(gameSlug: string, playerId: string): Promise<boolean> {
  try {
    const sb = await getSupabase();
    if (!sb) return false;

    const { data, error } = await sb
      .from('scores')
      .delete()
      .eq('game_slug', gameSlug)
      .eq('player_id', playerId)
      .select('id');
    if (error) {
      console.warn('[guess-the] score removal failed:', error.message);
      return false;
    }
    return (data?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

/** Both cache tiers now hold a stale list; drop them so the next read refetches. */
function refresh(): void {
  rowsPromise = null;
  // A successful write proves the tables are reachable, so drop any backoff.
  failedAt = 0;
  invalidate(HIDDEN_KEY);
}

/**
 * Resolve `fallback` if `p` has not settled in `ms`. `p` is left running — the
 * result still lands in the cache for whoever asks next — and its rejection is
 * swallowed so a slow failure never surfaces as an unhandled rejection.
 */
function withDeadline<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise<T>((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      },
    );
  });
}
