import { sample } from '../lib/rng';
import type { Deck, Option, Round } from '../engine/types';

export type Resolved<S, R> = { seed: S; value: R };

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
}): Promise<Resolved<S, R>[]> {
  const shuffled = sample(opts.pool, opts.pool.length, opts.rng);
  const cursor = { at: 0 };
  const out: Resolved<S, R>[] = [];
  await drain(shuffled, cursor, out, opts.count, opts.count, opts);
  if (out.length < opts.count && cursor.at < shuffled.length) {
    const slack = opts.topUpSlack ?? 3;
    await drain(shuffled, cursor, out, opts.count - out.length + slack, opts.count, opts);
  }
  return out.slice(0, opts.count);
}

async function drain<S, R>(
  shuffled: S[],
  cursor: { at: number },
  out: Resolved<S, R>[],
  take: number,
  cap: number,
  opts: { resolve: (seed: S) => Promise<R | null>; concurrency?: number },
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
          if (value !== null && out.length < cap) out.push({ seed, value });
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
 * Progressive deck: hands back the first couple of rounds as soon as they are
 * ready and keeps loading the rest in the background.
 *
 * Waiting for all ten rounds before showing round one is the single biggest
 * source of "dealing a fresh deck…" — for the quote game that meant forty
 * Wikipedia lookups before anything appeared on screen. Since a player spends
 * ten seconds or more on the first round, the remainder always lands long
 * before it is needed.
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
}): Promise<Deck> {
  const eager = Math.min(opts.eager ?? 2, opts.count);
  const shuffled = sample(opts.pool, opts.pool.length, opts.rng);
  const cursor = { at: 0 };

  const firstBatch: Resolved<S, R>[] = [];
  await drain(shuffled, cursor, firstBatch, eager, eager, opts);
  if (firstBatch.length === 0) {
    // Try a little harder before declaring the source dead.
    await drain(shuffled, cursor, firstBatch, eager + 3, eager, opts);
  }
  if (firstBatch.length === 0) throw new Error(opts.emptyError);

  const remaining = opts.count - firstBatch.length;
  const rest =
    remaining > 0
      ? (async () => {
          const more: Resolved<S, R>[] = [];
          await drain(shuffled, cursor, more, remaining, remaining, opts);
          if (more.length < remaining && cursor.at < shuffled.length) {
            await drain(shuffled, cursor, more, remaining - more.length + 3, remaining, opts);
          }
          return more.map((r) => opts.toRound(r.seed, r.value));
        })()
      : Promise.resolve<Round[]>([]);

  return {
    rounds: firstBatch.map((r) => opts.toRound(r.seed, r.value)),
    catalog: opts.catalog,
    expected: opts.count,
    rest,
  };
}
