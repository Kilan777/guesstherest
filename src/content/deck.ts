import { sample } from '../lib/rng';
import { hiddenIds } from '../lib/moderation';
import type { Deck, Option, Round } from '../engine/types';

export type Resolved<S, R> = { seed: S; value: R };

/**
 * Ids a moderator has retired. Skipped when dealing, and topped up from the
 * pool so the deck is still its full length.
 *
 * The problem this solves: the id is produced by `toRound`, which is different
 * in each of the thirty games — `song:${title}|${artist}`, `dish:${wiki}`,
 * `country:${country}:${lat}` — and duplicating that logic here would mean
 * thirty chances to get it subtly wrong, silently, in a way that shows up as
 * "the hide didn't work" months later. So nothing is duplicated: the game's own
 * `toRound` is called on the resolved seed and the id read off the result, then
 * the round is thrown away if it is hidden. `toRound` is a pure object literal
 * in every game and costs nothing to call, and `streamDeck` already calls it
 * more than once per round anyway.
 */
export type Hidden = ReadonlySet<string>;

/** How many extra passes over the pool a short deck is allowed. */
const TOP_UP_PASSES = 4;

/**
 * Builds exactly as many rounds as a game needs, and no more.
 *
 * The naive version — sample 3× the rounds and resolve them all — is what got
 * the iTunes games throttled: thirty lookups to fill ten slots. This resolves
 * `count` seeds, counts the misses, and only then tops up, so a healthy deck
 * costs `count` requests and a lossy one costs a handful more.
 *
 * `resolve` returning null means "this seed has no usable content, skip it".
 * `resolve` throwing means the source itself is down — that aborts the build so
 * the player gets a real error instead of a two-round game.
 */
export async function buildDeck<S, R>(opts: {
  pool: readonly S[];
  count: number;
  rng: () => number;
  resolve: (seed: S) => Promise<R | null>;
  /** Parallel resolves. Sources with their own throttle should leave this low. */
  concurrency?: number;
  /** Extra seeds to try when the first pass comes up short. */
  topUpSlack?: number;
  /** Moderator-hidden round ids to skip. Needs `idOf` to be of any use. */
  hidden?: Hidden;
  /** The round id a resolved seed would produce — see {@link Hidden}. */
  idOf?: (seed: S, value: R) => string;
}): Promise<Resolved<S, R>[]> {
  const shuffled = sample(opts.pool, opts.pool.length, opts.rng);
  const cursor = { at: 0 };
  const out: Resolved<S, R>[] = [];
  await drain(shuffled, cursor, out, opts.count, opts.count, opts);
  await topUp(shuffled, cursor, out, opts.count, opts.count, opts, opts.topUpSlack ?? 3);
  return out.slice(0, opts.count);
}

/**
 * Fills a short deck back up to `need`, learning as it goes.
 *
 * A fixed "try three more" is right when the pool is healthy and useless when
 * it is not: with most of a pool hidden or unresolvable, three extra seeds land
 * a fraction of a round and the deck stays short. So each pass measures how
 * many seeds it actually took to land one round, and asks for that many more —
 * which converges in a pass or two however lossy the pool is.
 *
 * The first pass still asks for `short + slack`, so a healthy deck costs
 * exactly what it did before and nothing extra is fetched from a rate-limited
 * source on the strength of a hypothetical.
 */
async function topUp<S, R>(
  shuffled: S[],
  cursor: { at: number },
  out: Resolved<S, R>[],
  need: number,
  cap: number,
  opts: Parameters<typeof drain<S, R>>[5],
  slack: number,
): Promise<void> {
  let consumed = 0;
  let landed = 0;

  for (let pass = 0; pass < TOP_UP_PASSES; pass++) {
    const short = need - out.length;
    if (short <= 0 || cursor.at >= shuffled.length) return;

    const perHit = landed > 0 ? consumed / landed : 1;
    const take = Math.min(Math.ceil(short * perHit) + slack, shuffled.length - cursor.at);

    const atBefore = cursor.at;
    const lenBefore = out.length;
    await drain(shuffled, cursor, out, take, cap, opts);
    consumed += cursor.at - atBefore;
    landed += out.length - lenBefore;

    // Nothing at all is landing and the pool is spent — further passes are just
    // wasted requests against a source that has nothing left to give.
    if (cursor.at >= shuffled.length) return;
  }
}

async function drain<S, R>(
  shuffled: S[],
  cursor: { at: number },
  out: Resolved<S, R>[],
  take: number,
  cap: number,
  opts: {
    resolve: (seed: S) => Promise<R | null>;
    concurrency?: number;
    /** Fired the instant a seed resolves, ahead of the batch finishing. */
    onResolved?: (r: Resolved<S, R>) => void;
    hidden?: Hidden;
    idOf?: (seed: S, value: R) => string;
  },
): Promise<void> {
  const batch = shuffled.slice(cursor.at, cursor.at + take);
  cursor.at += batch.length;
  if (!batch.length) return;

  let i = 0;
  let fatal: unknown = null;
  await Promise.all(
    Array.from({ length: Math.min(opts.concurrency ?? 3, batch.length) }, async () => {
      for (;;) {
        const seed = batch[i++];
        if (seed === undefined || fatal) return;
        try {
          const value = await opts.resolve(seed);
          if (value === null || isHidden(opts, seed, value)) continue;
          if (out.length < cap) {
            const resolved = { seed, value };
            out.push(resolved);
            opts.onResolved?.(resolved);
          }
        } catch (err) {
          fatal = err;
          return;
        }
      }
    }),
  );
  if (fatal && out.length === 0) throw fatal;
}

/**
 * Would this resolved seed produce a round a moderator has retired?
 *
 * Defensive on both sides: no hide-list means no work at all, and an `idOf`
 * that throws is treated as "not hidden" rather than being allowed to abort the
 * whole deck build. Failing open here is right — the worst case is one bad
 * round shown once more, against a game that will not deal at all.
 */
function isHidden<S, R>(
  opts: { hidden?: Hidden; idOf?: (seed: S, value: R) => string },
  seed: S,
  value: R,
): boolean {
  if (!opts.hidden?.size || !opts.idOf) return false;
  try {
    return opts.hidden.has(opts.idOf(seed, value));
  } catch {
    return false;
  }
}

/**
 * Progressive deck: hands back the first couple of rounds as soon as they are
 * ready and keeps loading the rest in the background.
 *
 * Waiting for all ten rounds before showing round one is the single biggest
 * source of "dealing a fresh deck…" — for the quote game that meant forty
 * Wikipedia lookups before anything appeared on screen. Since a player spends
 * ten seconds or more on the first round, the remainder always lands long
 * before it is needed.
 *
 * The tail is delivered round by round through `subscribe`, not in one lump when
 * `rest` settles. Handing over the whole tail at once meant round two waited on
 * round ten: on a phone, with a throttled source, that is a minute of staring at
 * a spinner between the first song and the second. Each round now shows up — and
 * gets its media prefetched — the moment it is ready.
 */
export async function streamDeck<S, R>(opts: {
  pool: readonly S[];
  count: number;
  rng: () => number;
  catalog: Option[];
  resolve: (seed: S) => Promise<R | null>;
  toRound: (seed: S, value: R) => Round;
  /** Rounds to have in hand before play starts. */
  eager?: number;
  concurrency?: number;
  emptyError: string;
  /**
   * Moderator-hidden round ids. Left off, the site-wide hide-list is fetched
   * and used — which is what covers all thirty games without each one having to
   * remember to opt in. Pass an explicit set (or an empty one) to override.
   */
  hidden?: Hidden;
}): Promise<Deck> {
  const eager = Math.min(opts.eager ?? 2, opts.count);
  const shuffled = sample(opts.pool, opts.pool.length, opts.rng);
  const cursor = { at: 0 };

  // Every game funnels through here, and every game supplies a `toRound`, so
  // this one line is what filters hidden content out of all thirty of them.
  // `hiddenIds` resolves to an empty set — quickly — whenever Supabase is
  // unreachable or the moderation tables do not exist, so nothing below can
  // stop a deck being dealt.
  const filtered = {
    ...opts,
    hidden: opts.hidden ?? (await hiddenIds()),
    idOf: (seed: S, value: R) => opts.toRound(seed, value).id,
  };

  const firstBatch: Resolved<S, R>[] = [];
  await drain(shuffled, cursor, firstBatch, eager, eager, filtered);
  if (firstBatch.length === 0) {
    // Try a little harder before declaring the source dead.
    await drain(shuffled, cursor, firstBatch, eager + 3, eager, filtered);
  }
  if (firstBatch.length === 0) throw new Error(opts.emptyError);

  // A deck is often warmed long before anything subscribes to it, so landed
  // rounds are kept and replayed to each new listener.
  const landed: Round[] = [];
  const listeners = new Set<(round: Round) => void>();
  const emit = (round: Round) => {
    landed.push(round);
    for (const fn of listeners) fn(round);
  };
  const subscribe = (fn: (round: Round) => void) => {
    for (const round of landed) fn(round);
    listeners.add(fn);
    return () => listeners.delete(fn);
  };
  const streaming = {
    ...filtered,
    onResolved: (r: Resolved<S, R>) => emit(opts.toRound(r.seed, r.value)),
  };

  const remaining = opts.count - firstBatch.length;
  const rest =
    remaining > 0
      ? (async () => {
          const more: Resolved<S, R>[] = [];
          await drain(shuffled, cursor, more, remaining, remaining, streaming);
          // Hidden items are misses like any other, so a moderated pool can
          // come up short repeatedly. `topUp` measures the real hit rate rather
          // than assuming one more handful will do it.
          await topUp(shuffled, cursor, more, remaining, remaining, streaming, 3);
          return more.map((r) => opts.toRound(r.seed, r.value));
        })()
      : Promise.resolve<Round[]>([]);

  return {
    rounds: firstBatch.map((r) => opts.toRound(r.seed, r.value)),
    catalog: opts.catalog,
    expected: opts.count,
    rest,
    subscribe,
  };
}
