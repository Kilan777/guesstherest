export const BASE_POINTS = 1000;

/**
 * Every game shares one scoring curve: the fewer reveals you burned, the more
 * you keep. Level 0 (first, hardest look) is worth full marks and each step
 * down the ladder costs ~38%.
 */
export function levelValue(level: number, totalLevels: number): number {
  const decay = 0.62;
  const raw = BASE_POINTS * Math.pow(decay, level);
  // Always leave something on the table for a last-gasp correct guess.
  const floor = totalLevels > 1 ? 80 : 0;
  return Math.max(floor, Math.round(raw / 10) * 10);
}

/** Fast answers are worth more, capped so slow-but-right still feels good. */
export function speedBonus(elapsedMs: number): number {
  const seconds = elapsedMs / 1000;
  return Math.max(0, Math.round((20 - seconds) * 8));
}

export function streakMultiplier(streak: number): number {
  return 1 + Math.min(streak, 10) * 0.1;
}

export function roundScore(opts: {
  level: number;
  totalLevels: number;
  elapsedMs: number;
  streak: number;
  /** 0..1 — year mode gives partial credit for near-misses. */
  accuracy?: number;
}): number {
  const accuracy = opts.accuracy ?? 1;
  if (accuracy <= 0) return 0;
  const base = levelValue(opts.level, opts.totalLevels) + speedBonus(opts.elapsedMs);
  return Math.round(base * accuracy * streakMultiplier(opts.streak));
}

/** Year mode: exact is full credit, near-misses taper off. */
export function yearAccuracy(guess: number, answer: number): number {
  const off = Math.abs(guess - answer);
  if (off === 0) return 1;
  if (off === 1) return 0.6;
  if (off === 2) return 0.35;
  if (off === 3) return 0.15;
  return 0;
}

export function formatScore(n: number): string {
  return n.toLocaleString('en-US');
}
