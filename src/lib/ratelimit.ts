/**
 * Token bucket.
 *
 * A fixed delay between requests is the wrong shape for an API like iTunes,
 * which budgets by requests-per-minute rather than by spacing. A flat 500ms gap
 * made a ten-round deck take ten seconds while still only using ten of the
 * minute's allowance — all of the waiting, none of the protection.
 *
 * A bucket lets the first deck fire straight through at full speed and only
 * starts holding requests back once the sustained rate would actually exceed
 * what the API allows.
 */
export class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private readonly capacity: number;
  private readonly refillMs: number;

  /**
   * @param capacity how many requests may burst back-to-back
   * @param perMinute sustained requests allowed per minute
   */
  constructor(capacity: number, perMinute: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillMs = 60000 / perMinute;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const gained = Math.floor((now - this.lastRefill) / this.refillMs);
    if (gained > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + gained);
      this.lastRefill += gained * this.refillMs;
    }
  }

  /** Resolves once a token is available, then spends it. */
  async take(): Promise<void> {
    for (;;) {
      this.refill();
      if (this.tokens > 0) {
        this.tokens--;
        return;
      }
      const wait = this.refillMs - (Date.now() - this.lastRefill);
      await new Promise((r) => setTimeout(r, Math.max(50, wait)));
    }
  }

  /** Drop tokens after a rejection, so a throttled client backs off properly. */
  penalise(n: number): void {
    this.tokens = Math.min(this.tokens, 0) - n;
  }
}
