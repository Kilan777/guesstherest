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
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

let unlocked = false;

/** Browsers start the context suspended until a real user gesture. */
export async function unlockAudio(): Promise<void> {
  const c = audioCtx();
  if (c.state === 'suspended') {
    try {
      await c.resume();
    } catch {
      return;
    }
  }
  unlocked = c.state === 'running';
}

/**
 * Once the player has clicked play even once, later rounds can start on their
 * own. Before that, autoplay is silently dropped by the browser — which would
 * leave the UI showing a clip that never sounds.
 */
export function isAudioUnlocked(): boolean {
  return unlocked;
}

export function preloadClip(url: string): Promise<AudioBuffer> {
  const cached = buffers.get(url);
  if (cached) return cached;
  const p = (async () => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`preview ${res.status}`);
    const bytes = await res.arrayBuffer();
    return await audioCtx().decodeAudioData(bytes);
  })();
  // Don't cache a rejection — a flaky network shouldn't poison the round.
  p.catch(() => buffers.delete(url));
  buffers.set(url, p);
  return p;
}

export type Playback = { stop: () => void };

const FADE = 0.012;

export function playClip(
  buffer: AudioBuffer,
  opts: { startSec: number; durationSec: number; onEnd?: () => void },
): Playback {
  const c = audioCtx();
  const src = c.createBufferSource();
  src.buffer = buffer;

  const gain = c.createGain();
  src.connect(gain).connect(c.destination);

  const start = Math.max(0, Math.min(opts.startSec, Math.max(0, buffer.duration - 0.05)));
  const duration = Math.max(0.05, Math.min(opts.durationSec, buffer.duration - start));
  const t0 = c.currentTime + 0.02;

  // Fade in, hold, fade out — all scheduled on the audio clock, not setTimeout.
  const fade = Math.min(FADE, duration / 4);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(1, t0 + fade);
  gain.gain.setValueAtTime(1, t0 + duration - fade);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  let stopped = false;
  src.onended = () => {
    if (!stopped) {
      stopped = true;
      opts.onEnd?.();
    }
  };

  src.start(t0, start, duration);
  src.stop(t0 + duration);

  return {
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
    if (c.state === 'suspended') return;
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
