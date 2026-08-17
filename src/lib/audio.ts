/**
 * Snippet playback for Guess the Song.
 *
 * An <audio> element can't reliably play 100ms — `currentTime` seeking and
 * `pause()` scheduling both jitter by tens of milliseconds, which is most of
 * the clip. So previews are fetched and decoded up front (iTunes serves them
 * with `Access-Control-Allow-Origin: *`), then played through Web Audio where
 * start/stop are sample-accurate. A few ms of fade on each end kills the click.
 */

let ctx: AudioContext | null = null;

function audioCtx(): AudioContext {
  if (!ctx) {
    // iOS 16.4+ routes Web Audio through the "ambient" audio session, which the
    // hardware ring/silent switch mutes outright — a phone on silent plays the
    // whole game without a sound and reports every state as healthy. Asking for
    // the 'playback' category before the context exists opts out of that.
    const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
    if (session) {
      try {
        session.type = 'playback';
      } catch {
        /* not supported here */
      }
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

let unlocked = false;
let primed = false;

/**
 * Nudge the context back to 'running', never throwing.
 *
 * `resume()` can reject, and on some engines throw outright; letting either
 * escape would take the whole play handler with it and leave the button dead.
 */
function resume(c: AudioContext): void {
  if (c.state === 'running') return;
  try {
    void Promise.resolve(c.resume()).catch(() => {});
  } catch {
    /* nothing more to try */
  }
}

/**
 * Starts the audio hardware. Must be reached *synchronously* from inside a user
 * gesture — before any `await`.
 *
 * Two things go wrong on a phone and neither shows up on desktop Chrome:
 *
 * The context is created during preload, long before anyone taps, so it is born
 * suspended. Testing for exactly `'suspended'` misses iOS Safari's fourth state,
 * `'interrupted'` — which is where a context created outside a gesture, or one
 * that lived through a phone call, a Siri invocation or a backgrounded tab, ends
 * up. A context left interrupted never resumes and every clip scheduled on it is
 * silent, while `state` never equals the one string the old check looked for.
 *
 * And iOS only really considers a context started once a source has actually run
 * on it. Resuming is not enough; a one-sample silent buffer, started inside the
 * gesture, is what flips it. That costs nothing and is the standard fix.
 */
function warmAudio(): void {
  let c: AudioContext;
  try {
    c = audioCtx();
  } catch {
    return;
  }

  resume(c);

  if (!primed) {
    try {
      const src = c.createBufferSource();
      src.buffer = c.createBuffer(1, 1, c.sampleRate);
      src.connect(c.destination);
      src.start(0);
      primed = true;
    } catch {
      /* try again on the next gesture */
    }
  }
}

/**
 * The first tap of a session usually lands somewhere else — a game tile, the
 * start button — well before the play button exists. Spending it on the audio
 * hardware means the context is already running by the time a clip is due, so
 * the play button never has to win the race itself.
 *
 * Deliberately does *not* mark audio unlocked: tapping a tile is consent to open
 * a game, not consent to have it start playing at you.
 */
if (typeof document !== 'undefined') {
  const events = ['pointerdown', 'touchend', 'keydown', 'click'] as const;
  const onGesture = () => {
    warmAudio();
    for (const e of events) document.removeEventListener(e, onGesture, true);
  };
  for (const e of events) document.addEventListener(e, onGesture, { capture: true, passive: true });
}

/**
 * Call this synchronously from the play handler, ahead of any `await`.
 *
 * Awaiting `resume()` first — which is what this used to do — hands the rest of
 * the handler to a later task, and on iOS the gesture no longer counts by then.
 */
export function primeAudio(): void {
  warmAudio();
  unlocked = true;
}

/** Async form, for callers that want to know the context settled. */
export async function unlockAudio(): Promise<void> {
  primeAudio();
  const c = audioCtx();
  if (c.state !== 'running') {
    try {
      await c.resume();
    } catch {
      /* nothing more to try */
    }
  }
}

/**
 * Once the player has clicked play even once, later rounds can start on their
 * own. Before that, autoplay is silently dropped by the browser — which would
 * leave the UI showing a clip that never sounds.
 */
export function isAudioUnlocked(): boolean {
  return unlocked;
}

/**
 * How much of a preview to fetch, and when.
 *
 * An iTunes preview is 30 seconds and about a megabyte. A round never plays more
 * than five of those seconds — but the *first* rung is a tenth of a second, and
 * nobody reaches the five-second rung without spending three clues first, which
 * is many seconds of wall clock. Downloading five seconds of audio before the
 * play button lights up is buying audio nobody needs yet. So the fetch is
 * tiered: enough to play, immediately; the rest of the ladder behind it.
 *
 * The files are MPEG-4/AAC and faststart — the `moov` header sits in the first
 * ~6.4 KB, so a byte prefix is a valid, decodable file, and Apple serves them
 * with `Accept-Ranges: bytes` and permissive CORS. The decoded samples are
 * bit-identical to the full download; this is not a lossy shortcut.
 *
 * What makes a prefix expensive is the `free` padding Apple leaves between
 * `moov` and `mdat`. Measured over 40 previews it is 8 bytes for 26 of them and
 * 18–92 KB for the other 14, which is the whole reason a fixed prefix had to be
 * 320 KB to be safe: on the worst file the first audio sample does not start
 * until byte 98,304. Padding is dead space by definition, so it is no longer
 * downloaded — the layout is parsed out of the opening 20 KB and the gap is
 * filled in locally with zeros. What is left is the audio, and the audio is
 * small: across those 40 previews, 11.7 KB of `mdat` covered the first tenth of
 * a second in the worst case and 201.8 KB covered all five seconds.
 */
const PROBE_BYTES = 20480;

/**
 * The ladder, as byte budgets into `mdat`.
 *
 * Measured worst cases were 27.4 / 66.1 / 124.7 / 201.8 KB for the four rungs;
 * these sizes cleared every one of the 40 previews with a third to spare (the
 * tightest decoded 0.79 s where 0.5 s was promised). Nothing trusts the numbers
 * regardless: what a tier is allowed to claim is its *decoded* duration, so an
 * unusually dense file simply moves on to the next tier.
 */
const TIERS: { sec: number; mdat: number }[] = [
  { sec: 0.5, mdat: 32768 },
  { sec: 1.5, mdat: 76800 },
  { sec: 3, mdat: 143360 },
  { sec: 5, mdat: 233472 },
];

/** The shortest rung — all the play button ever has to wait for. */
const MIN_SEC = 0.1;

/** Full 30-second decodes, kept apart from the prefixes and only for reveals. */
const fullBuffers = new Map<string, Promise<AudioBuffer>>();

/**
 * Clip downloads run strictly one at a time, urgent ones first.
 *
 * The next round's clip is fetched during the current one, and when both were in
 * flight together they simply split the connection: measured on a throttled
 * phone, the round the player was actually waiting for got 49% of the available
 * bandwidth and took twice as long to become playable. A queue costs the
 * prefetch nothing — it has a whole round to finish in — and gives the clip
 * somebody is waiting on the entire pipe.
 *
 * "Urgent" means somebody is looking at a disabled button: the opening tier of
 * any round, and any rung whose audio has not arrived by the time it is bought.
 * Topping this round's ladder up to five seconds is not urgent, and must never
 * push the *next* round's opening tier back — a round that cannot start yet
 * beats a rung nobody has reached. Each tier is a separate job for that reason:
 * a waiting round only ever sits behind one block of bytes, not the whole
 * remaining ladder.
 */
type Job = { urgent: boolean; run: () => Promise<void> };

const queue: Job[] = [];
let draining = false;

function enqueue(job: Job): void {
  queue.push(job);
  void drain();
}

async function drain(): Promise<void> {
  if (draining) return;
  draining = true;
  while (queue.length) {
    let i = queue.findIndex((j) => j.urgent);
    if (i < 0) i = 0;
    const [job] = queue.splice(i, 1);
    try {
      await (job as Job).run();
    } catch {
      /* every job records its own failure; the queue must keep moving */
    }
  }
  draining = false;
}

/** Longest rung the ladder can ask for; a prefix shorter than this is no use. */
const LADDER_SEC = 5;

/** Nothing may leave the player staring at a disabled "Loading…" button. */
const NET_TIMEOUT = 15000;
const DECODE_TIMEOUT = 20000;

async function download(url: string, range?: string): Promise<{ bytes: ArrayBuffer; status: number }> {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), NET_TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: abort.signal,
      ...(range ? { headers: { Range: range } } : {}),
    });
    if (!res.ok) throw new Error(`preview ${res.status}`);
    return { bytes: await res.arrayBuffer(), status: res.status };
  } finally {
    clearTimeout(timer);
  }
}

function decode(bytes: ArrayBuffer): Promise<AudioBuffer> {
  const c = audioCtx();
  const decoded = new Promise<AudioBuffer>((resolve, reject) => {
    // Safari below 14.1 only has the callback form and returns undefined, so
    // both shapes have to be handled or the promise never settles.
    const maybe = c.decodeAudioData(bytes, resolve, reject) as unknown as Promise<AudioBuffer> | undefined;
    if (maybe && typeof maybe.then === 'function') maybe.then(resolve, reject);
  });
  return withTimeout(decoded, DECODE_TIMEOUT, 'decode timed out');
}

function withTimeout<T>(p: Promise<T>, ms: number, why: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(why)), ms);
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

/**
 * Every channel flat, for the whole buffer or the whole ladder, whichever ends
 * first.
 *
 * A truncated MPEG-4 is not a decode error to every decoder. Safari's is
 * stricter than Chrome's about the prefix and can *succeed* while handing back a
 * buffer that is all zeros — which plays perfectly and makes no sound, exactly
 * the symptom being chased. Real music is never silent for five seconds; what a
 * *short* silent buffer means is decided by the caller, since songs are allowed
 * to open quietly.
 */
function isSilent(buffer: AudioBuffer): boolean {
  const upto = Math.min(buffer.length, Math.ceil(buffer.sampleRate * LADDER_SEC));
  if (upto <= 0) return true;
  const step = Math.max(1, Math.floor(upto / 4096));
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < upto; i += step) {
      if (Math.abs(data[i] as number) > 1e-4) return false;
    }
  }
  return true;
}

/* ── the tiered loader ───────────────────────────────────────────────────── */

/**
 * Where the audio lives in the file: the first byte of `mdat`, and the first
 * byte of the run of padding in front of it that needn't be downloaded.
 */
type Layout = { mdatStart: number; padFrom: number };

/**
 * Walk the top-level atoms of a faststart MPEG-4 and find `mdat`.
 *
 * Only the top level is read, and only for its lengths — every atom declares its
 * own size, so `mdat` can be located even when the padding in front of it runs
 * off the end of what has been downloaded. `free`/`skip` immediately before
 * `mdat` is padding and is the run that gets skipped; anything else in front of
 * `mdat` is real and must be fetched, so it does not count.
 *
 * Returns null on anything unexpected, and the caller falls back to plain
 * contiguous prefixes.
 */
function layoutOf(head: Uint8Array): Layout | null {
  const dv = new DataView(head.buffer, head.byteOffset, head.byteLength);
  let pad: { start: number; end: number } | null = null;
  let p = 0;
  while (p + 8 <= head.length) {
    let size = dv.getUint32(p);
    let header = 8;
    if (size === 1) {
      // 64-bit size. Read it as two halves rather than a BigInt, which this
      // build target does not have.
      if (p + 16 > head.length) return null;
      size = dv.getUint32(p + 8) * 4294967296 + dv.getUint32(p + 12);
      header = 16;
    } else if (size === 0) {
      // "runs to the end of the file" — nothing follows it to find.
      return null;
    }
    if (size < header || !Number.isSafeInteger(size)) return null;
    const type = String.fromCharCode(head[p + 4] as number, head[p + 5] as number, head[p + 6] as number, head[p + 7] as number);
    if (type === 'mdat') return { mdatStart: p, padFrom: pad && pad.end === p ? pad.start : p };
    pad = type === 'free' || type === 'skip' ? { start: p, end: p + size } : null;
    p += size;
    // The padding is allowed to run past what we hold — that is the whole point,
    // since it is exactly what we are not downloading. Anything else running
    // past the end means the header is incomplete and unusable.
    if (p > head.length) return pad && pad.end === p ? { mdatStart: p, padFrom: pad.start } : null;
  }
  return null;
}

type Waiter = { sec: number; resolve: (b: AudioBuffer) => void; reject: (e: unknown) => void };

type Loader = {
  url: string;
  /** The file as assembled so far: real bytes, with zeros where padding was skipped. */
  image: Uint8Array;
  layout: Layout | null;
  /** Index of the next tier to fetch; -1 until the opening probe has landed. */
  next: number;
  buffer: AudioBuffer | null;
  /** Seconds this buffer is known to hold — its decoded duration, nothing softer. */
  covered: number;
  /** No more tiers to try; only the whole file is left. */
  exhausted: boolean;
  finished: boolean;
  running: boolean;
  queued: Job | null;
  waiters: Waiter[];
  listeners: Set<() => void>;
  /** One handle per URL, so React sees a stable identity across rungs. */
  handle: Clip | null;
};

const loaders = new Map<string, Loader>();

/** A growing clip. `buffer` and `covered` change as tiers land. */
export type Clip = {
  readonly buffer: AudioBuffer;
  readonly covered: number;
  /** Resolves once the clip can honour `sec`, fetching more if that is what it takes. */
  need: (sec: number) => Promise<AudioBuffer>;
  /** Fires whenever the clip grows. Returns an unsubscribe. */
  subscribe: (fn: () => void) => () => void;
};

function notify(L: Loader): void {
  for (const fn of L.listeners) {
    try {
      fn();
    } catch {
      /* a listener must not stall the loader */
    }
  }
}

/** Copy, because `decodeAudioData` detaches what it is given and the image is reused. */
function decodeImage(L: Loader): Promise<AudioBuffer> {
  return decode(L.image.slice().buffer);
}

/**
 * Take a decoded tier — or don't.
 *
 * A truncated MPEG-4 is not a decode error to every decoder. Safari's can
 * *succeed* and hand back a buffer that is all zeros, which plays perfectly and
 * makes no sound. But real songs open quietly too — of the 40 previews measured,
 * one peaks at 0.0055 across its whole first half-second — so a short silent
 * buffer is not evidence of anything. It is simply not accepted yet: the next
 * tier costs a few tens of KB and settles it. Silence over a stretch long enough
 * to be sure is treated as the broken decode it is, and the whole file is
 * fetched instead.
 */
const SILENCE_TRUST = 1.4;

async function decodeTier(L: Loader): Promise<void> {
  const buffer = await decodeImage(L).catch(() => null);
  if (!buffer) return;
  if (isSilent(buffer)) {
    if (buffer.duration >= SILENCE_TRUST) {
      L.buffer = null;
      L.covered = 0;
      L.exhausted = true;
    }
    return;
  }
  if (buffer.duration <= L.covered) return;
  L.buffer = buffer;
  L.covered = buffer.duration;
  notify(L);
}

/** The whole file arrived despite the range request; keep it, it is already paid for. */
async function takeWholeFile(L: Loader, bytes: ArrayBuffer): Promise<void> {
  const full = decode(bytes.slice(0));
  full.catch(() => fullBuffers.delete(L.url));
  fullBuffers.set(L.url, full);
  const buffer = await full;
  if (isSilent(buffer)) throw new Error('preview is silent');
  L.buffer = buffer;
  L.covered = buffer.duration;
  L.exhausted = true;
  notify(L);
}

/** Fetch up to absolute byte `want`, skipping the padding if there is any. */
async function growTo(L: Loader, want: number): Promise<'grown' | 'short' | 'whole'> {
  if (want <= L.image.length) return 'grown';
  const skipTo = L.layout && L.image.length >= L.layout.padFrom ? L.layout.mdatStart : 0;
  const from = Math.max(L.image.length, skipTo);
  const { bytes, status } = await download(L.url, `bytes=${from}-${want - 1}`);
  if (status === 200) {
    await takeWholeFile(L, bytes);
    return 'whole';
  }
  const piece = new Uint8Array(bytes);
  if (piece.length === 0) return 'short';
  const grown = new Uint8Array(from + piece.length);
  grown.set(L.image.subarray(0, Math.min(L.image.length, from)));
  grown.set(piece, from);
  L.image = grown;
  // A short read means the file ended; there is nothing further to fetch.
  return from + piece.length >= want ? 'grown' : 'short';
}

/** One fetch-and-decode. Advances the loader by exactly one tier. */
async function step(L: Loader): Promise<void> {
  if (L.next < 0) {
    const { bytes, status } = await download(L.url, `bytes=0-${PROBE_BYTES - 1}`);
    if (status === 200) {
      await takeWholeFile(L, bytes);
      return;
    }
    L.image = new Uint8Array(bytes);
    L.layout = layoutOf(L.image);
    L.next = 0;
    await decodeTier(L);
    return;
  }
  const tier = TIERS[L.next] as { sec: number; mdat: number };
  L.next++;
  // Without a parsed layout there is no way to know where the padding ends, so
  // the budget is spent as a plain contiguous prefix — which is what the fixed
  // 320 KB prefix always was, and it still works, it is just less of a bargain.
  const want = (L.layout ? L.layout.mdatStart : 0) + tier.mdat;
  const got = await growTo(L, want);
  // The whole file turning up replaces everything, decode included.
  if (got === 'whole') return;
  if (got === 'short' || L.next >= TIERS.length) L.exhausted = true;
  await decodeTier(L);
}

/** The longest stretch anybody is currently waiting on. */
function demand(L: Loader): number {
  let sec = MIN_SEC;
  for (const w of L.waiters) sec = Math.max(sec, w.sec);
  return sec;
}

function settle(L: Loader): void {
  const still: Waiter[] = [];
  for (const w of L.waiters) {
    if (L.buffer && L.covered >= w.sec - 0.001) w.resolve(L.buffer);
    else if (L.finished) {
      // Nothing left to try. Short but audible still beats a dead round, and
      // every rung is clamped to what the buffer actually holds.
      if (L.buffer) w.resolve(L.buffer);
      else w.reject(new Error('preview unavailable'));
    } else still.push(w);
  }
  L.waiters = still;
}

/** Give up on tiers and take the whole 30 seconds. */
async function fallback(L: Loader): Promise<void> {
  try {
    const buffer = await loadFull(L.url);
    if (isSilent(buffer)) throw new Error('preview is silent');
    L.buffer = buffer;
    L.covered = buffer.duration;
    notify(L);
  } finally {
    finish(L);
  }
}

/** Nothing more will be fetched, so the assembled bytes can go. */
function finish(L: Loader): void {
  L.finished = true;
  L.image = new Uint8Array(0);
}

function pump(L: Loader): void {
  if (L.finished || L.running || L.queued) return;
  const wantFull = L.exhausted && L.covered < demand(L) - 0.001;
  if (L.exhausted && !wantFull) {
    finish(L);
    return;
  }
  const job: Job = {
    // The opening tier of a round is always urgent — a disabled play button is
    // the one thing a player cannot work around.
    urgent: L.covered < MIN_SEC || L.waiters.some((w) => w.sec > L.covered),
    run: async () => {
      L.queued = null;
      L.running = true;
      try {
        await (wantFull ? fallback(L) : step(L));
      } catch {
        // A failed tier is not fatal while the clip already plays; it just ends
        // the tiering, and the whole file is there if a rung really needs it.
        L.exhausted = true;
      } finally {
        L.running = false;
      }
      settle(L);
      pump(L);
    },
  };
  L.queued = job;
  enqueue(job);
}

function loaderFor(url: string): Loader {
  const existing = loaders.get(url);
  if (existing) return existing;
  const L: Loader = {
    url,
    image: new Uint8Array(0),
    layout: null,
    next: -1,
    buffer: null,
    covered: 0,
    exhausted: false,
    finished: false,
    running: false,
    queued: null,
    waiters: [],
    listeners: new Set(),
    handle: null,
  };
  loaders.set(url, L);
  pump(L);
  return L;
}

function clipOf(L: Loader): Clip {
  if (L.handle) return L.handle;
  L.handle = {
    get buffer() {
      return L.buffer as AudioBuffer;
    },
    get covered() {
      return L.covered;
    },
    need: (sec: number) =>
      new Promise<AudioBuffer>((resolve, reject) => {
        if (L.buffer && L.covered >= sec - 0.001) {
          resolve(L.buffer);
          return;
        }
        if (L.finished) {
          if (L.buffer) resolve(L.buffer);
          else reject(new Error('preview unavailable'));
          return;
        }
        L.waiters.push({ sec, resolve, reject });
        // Somebody is now watching a loading spinner, so this stops being
        // background work and goes to the front of the queue.
        if (L.queued) L.queued.urgent = true;
        pump(L);
      }),
    subscribe: (fn: () => void) => {
      L.listeners.add(fn);
      return () => {
        L.listeners.delete(fn);
      };
    },
  };
  return L.handle;
}

/**
 * Start a clip and resolve as soon as it can play its first rung — a tenth of a
 * second. The rest of the ladder keeps loading behind it.
 */
export function preloadClip(url: string): Promise<Clip> {
  const L = loaderFor(url);
  return new Promise<Clip>((resolve, reject) => {
    void clipOf(L)
      .need(MIN_SEC)
      .then(
        () => resolve(clipOf(L)),
        (err) => {
          // Don't cache a dead loader — a flaky network shouldn't poison the
          // round for good.
          if (loaders.get(url) === L) loaders.delete(url);
          reject(err);
        },
      );
  });
}

function loadFull(url: string): Promise<AudioBuffer> {
  const cached = fullBuffers.get(url);
  if (cached) return cached;
  const p = (async () => {
    const { bytes } = await download(url);
    return decode(bytes);
  })();
  p.catch(() => fullBuffers.delete(url));
  fullBuffers.set(url, p);
  return p;
}

/**
 * The whole 30 seconds, fetched only once a round is over and the answer is on
 * screen. Deliberately outside the prefix queue: the player is reading the
 * result, so this can take its time, and it must not delay the next round's
 * prefix by sitting in front of it.
 */
export function preloadFullClip(url: string): Promise<AudioBuffer> {
  return loadFull(url);
}

export type Playback = { stop: () => void; startsIn: number };

const FADE = 0.012;

/**
 * How far ahead of the clock to schedule.
 *
 * It used to be a flat 20 ms, which is comfortable on a desktop rendering in
 * 2.9 ms quanta and nowhere near enough on a phone. `currentTime` only advances
 * when the audio thread finishes a callback, and a phone's callback is tens of
 * milliseconds long, so between reading the clock and the schedule landing the
 * clock can jump straight past the moment we picked. Everything then sits in the
 * past: `start` fires immediately, `stop` has already been and gone, and the
 * gain envelope collapses to its final value before a sample is heard. A 0.1
 * second rung disappears completely — no error, no sound, which is the bug.
 *
 * Scaling with the device's own reported latency keeps desktop snappy and gives
 * a slow phone the headroom it needs.
 */
function leadTime(c: AudioContext): number {
  const latency = (c.baseLatency || 0) + (c.outputLatency || 0);
  return Math.min(0.25, Math.max(0.08, latency * 2));
}

export function playClip(
  buffer: AudioBuffer,
  opts: { startSec: number; durationSec: number; onEnd?: () => void },
): Playback {
  const c = audioCtx();
  // A context can drop back out of 'running' between rounds — iOS interrupts it
  // for a phone call and never puts it back on its own.
  resume(c);

  if (!(buffer.duration > 0)) {
    // A zero-length decode would otherwise schedule a source that ends instantly
    // and leaves the UI stuck mid-play.
    opts.onEnd?.();
    return { stop: () => {}, startsIn: 0 };
  }

  const start = Math.max(0, Math.min(opts.startSec, Math.max(0, buffer.duration - 0.05)));
  const duration = Math.max(0.05, Math.min(opts.durationSec, buffer.duration - start));
  const fade = Math.min(FADE, duration / 4);

  let src!: AudioBufferSourceNode;
  let gain!: GainNode;
  let t0 = 0;

  const schedule = (lead: number) => {
    src = c.createBufferSource();
    src.buffer = buffer;
    gain = c.createGain();
    src.connect(gain).connect(c.destination);

    // Read the clock as late as possible — after the nodes exist — so the window
    // between reading it and scheduling against it is as small as it can be.
    // While the context is still suspended `currentTime` is frozen, which is
    // fine: it resumes from exactly there and the clip plays from its first
    // sample.
    t0 = c.currentTime + lead;

    // Fade in, hold, fade out — all on the audio clock, not setTimeout.
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(1, t0 + fade);
    gain.gain.setValueAtTime(1, t0 + duration - fade);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    src.start(t0, start, duration);
    src.stop(t0 + duration);
  };

  schedule(leadTime(c));

  // If the main thread stalled while we were scheduling — a phone under load
  // does this constantly — the clock can already have passed the window we
  // picked, and a rung that short would simply never be heard. Anchor it again
  // from where the clock actually is. Costs nothing when nothing went wrong,
  // which is every desktop play.
  const late = c.currentTime - t0;
  if (late > 0) {
    try {
      src.stop();
      src.disconnect();
      gain.disconnect();
    } catch {
      /* nothing to unwind */
    }
    schedule(late + leadTime(c) * 2);
  }

  let stopped = false;
  src.onended = () => {
    if (!stopped) {
      stopped = true;
      opts.onEnd?.();
    }
  };

  return {
    // How long until the first sample sounds, so the progress bar can start
    // with the audio instead of ahead of it.
    startsIn: Math.max(0, t0 - c.currentTime),
    stop: () => {
      if (stopped) return;
      stopped = true;
      try {
        src.onended = null;
        src.stop();
      } catch {
        /* already finished */
      }
      opts.onEnd?.();
    },
  };
}

/** Tiny synthesised UI blips — no asset files, no licensing. */
export function blip(kind: 'correct' | 'wrong' | 'reveal' | 'finish'): void {
  try {
    const c = audioCtx();
    // Not just 'suspended' — an interrupted context is equally deaf.
    if (c.state !== 'running') return;
    const notes: Record<typeof kind, number[]> = {
      correct: [523.25, 659.25, 783.99],
      wrong: [196, 155.56],
      reveal: [440, 587.33],
      finish: [523.25, 659.25, 783.99, 1046.5],
    };
    notes[kind].forEach((freq, i) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = kind === 'wrong' ? 'sawtooth' : 'triangle';
      osc.frequency.value = freq;
      const t = c.currentTime + i * 0.07;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(g).connect(c.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  } catch {
    /* audio is a nicety, never a failure */
  }
}
