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
const buffers = new Map<string, Promise<AudioBuffer>>();

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
 * How much of a preview to fetch for play. A round never needs more than five
 * seconds, but an iTunes preview is a whole 30 seconds — a megabyte — and on a
 * phone that download was 81% of the time between opening the game and being
 * able to press play.
 *
 * The files are MPEG-4/AAC and, usefully, faststart: the `moov` header sits in
 * the first ~6.4 KB, so a byte prefix is a valid, decodable file covering the
 * opening seconds. Apple serves them with `Accept-Ranges: bytes` and permissive
 * CORS, so one ranged request gets exactly that prefix. The decoded samples are
 * bit-identical to the full download — this is not a lossy shortcut.
 *
 * 320 KB is the size, not less: the padding between the header and the audio
 * data varies from 8 bytes to 96 KB, and across 199 previews the worst case
 * needed 288 KB to reach five seconds. 320 KB cleared every one of them with
 * room to spare, at roughly a third of the bytes.
 */
const PREFIX_BYTES = 327680;

/** Full 30-second decodes, kept apart from the prefixes and only for reveals. */
const fullBuffers = new Map<string, Promise<AudioBuffer>>();

/**
 * Prefixes are downloaded strictly one at a time.
 *
 * The next round's clip is fetched during the current one, and when both were in
 * flight together they simply split the connection: measured on a throttled
 * phone, the round the player was actually waiting for got 49% of the available
 * bandwidth and took twice as long to become playable. A queue costs the
 * prefetch nothing — it has a whole round to finish in — and gives the clip
 * somebody is waiting on the entire pipe.
 */
let chain: Promise<unknown> = Promise.resolve();

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
 * Every channel flat for the whole stretch the ladder can play.
 *
 * A truncated MPEG-4 is not a decode error to every decoder. Safari's is
 * stricter than Chrome's about the prefix and can *succeed* while handing back a
 * buffer that is all zeros — which plays perfectly and makes no sound, exactly
 * the symptom being chased. Real music is never silent for five seconds.
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

/** Long enough for the whole ladder, and audible. */
function usable(buffer: AudioBuffer): boolean {
  return buffer.duration >= LADDER_SEC && !isSilent(buffer);
}

/** The opening seconds of a preview — everything the reveal ladder can play. */
export function preloadClip(url: string): Promise<AudioBuffer> {
  const cached = buffers.get(url);
  if (cached) return cached;

  const p = chain.then(async () => {
    const { bytes, status } = await download(url, `bytes=0-${PREFIX_BYTES - 1}`);
    // A 200 means the range was ignored and the whole file arrived anyway;
    // those bytes are already paid for, so keep them for the reveal.
    if (status === 200) {
      const full = decode(bytes.slice(0));
      full.catch(() => fullBuffers.delete(url));
      fullBuffers.set(url, full);
    }

    // Two ways the prefix lets us down, and only one of them throws. Chrome
    // rejects a truncated MPEG-4 it cannot use; Safari has been known to return
    // a short or entirely silent buffer instead, which is worse — it plays, and
    // nothing comes out. Both end up on the whole file.
    const prefix = await decode(bytes).catch(() => null);
    if (prefix && usable(prefix)) return prefix;
    try {
      return await loadFull(url);
    } catch (err) {
      // Short but audible still beats an unplayable round; the ladder clamps
      // every rung to whatever the buffer actually holds.
      if (prefix && !isSilent(prefix)) return prefix;
      throw err;
    }
  });
  // The queue must survive a failed download, so it waits on the settled state
  // rather than on `p` itself.
  chain = p.catch(() => {});
  // Don't cache a rejection — a flaky network shouldn't poison the round.
  p.catch(() => buffers.delete(url));
  buffers.set(url, p);
  return p;
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
