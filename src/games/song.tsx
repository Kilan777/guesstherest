import { useCallback, useEffect, useRef, useState } from 'react';
import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { SONGS } from '../content/data/songs';
import { findTrack } from '../content/itunes';
import { streamDeck } from '../content/deck';
import { normalize } from '../content/cache';
import { isAudioUnlocked, playClip, preloadClip, unlockAudio, type Playback } from '../lib/audio';

/** The ladder the whole game is built around: a tenth of a second, then more. */
const DURATIONS = [0.1, 0.5, 1.5, 3, 5];
const FULL_PREVIEW = 30;

type SongPayload = {
  previewUrl: string;
  artwork: string;
  title: string;
  artist: string;
};

const seedId = (t: string, a: string) => `song:${normalize(t)}|${normalize(a)}`;

function SongStage({ round, level, revealed, accent }: StageProps) {
  const p = round.payload as SongPayload;
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const playback = useRef<Playback | null>(null);
  const raf = useRef(0);
  const startedAt = useRef(0);

  const unlockedSec = DURATIONS[Math.min(level, DURATIONS.length - 1)] ?? 5;
  const clipSec = revealed ? Math.min(buffer?.duration ?? FULL_PREVIEW, FULL_PREVIEW) : unlockedSec;

  useEffect(() => {
    let alive = true;
    setBuffer(null);
    setFailed(false);
    preloadClip(p.previewUrl)
      .then((b) => alive && setBuffer(b))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [p.previewUrl]);

  const stop = useCallback(() => {
    playback.current?.stop();
    playback.current = null;
    cancelAnimationFrame(raf.current);
    setPlaying(false);
    setElapsed(0);
  }, []);

  // Never let one round's audio bleed into the next.
  useEffect(() => stop, [stop, round.id]);

  const play = useCallback(async () => {
    if (!buffer) return;
    await unlockAudio();
    playback.current?.stop();
    cancelAnimationFrame(raf.current);

    const duration = clipSec;
    startedAt.current = performance.now();
    setPlaying(true);

    playback.current = playClip(buffer, {
      startSec: 0,
      durationSec: duration,
      onEnd: () => {
        cancelAnimationFrame(raf.current);
        setPlaying(false);
        setElapsed(0);
        playback.current = null;
      },
    });

    const tick = () => {
      const t = (performance.now() - startedAt.current) / 1000;
      setElapsed(Math.min(t, duration));
      if (t < duration) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [buffer, clipSec]);

  // Once audio is unlocked, each new rung plays itself — pressing play again
  // after every skip gets old fast.
  useEffect(() => {
    if (buffer && isAudioUnlocked() && !revealed) void play();
    // Deliberately keyed on the rung, not on `play`, which changes identity
    // whenever the window does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, buffer, round.id]);

  const scale = revealed ? FULL_PREVIEW : 5;
  const unlockedPct = (clipSec / scale) * 100;
  const playedPct = (elapsed / scale) * 100;

  return (
    <div className="stage stage-song">
      <div className={`vinyl ${playing ? 'spinning' : ''} ${revealed ? 'revealed' : ''}`}>
        {revealed && p.artwork ? (
          <img src={p.artwork} alt="" className="vinyl-art" />
        ) : (
          <div className="vinyl-label" style={{ background: accent }}>
            <span>{playing ? '♪' : '?'}</span>
          </div>
        )}
      </div>

      <div className="track" role="img" aria-label={`${clipSec} seconds unlocked of ${scale}`}>
        <div className="track-unlocked" style={{ width: `${unlockedPct}%`, background: accent }} />
        <div className="track-played" style={{ width: `${playedPct}%` }} />
        {DURATIONS.map((d) => (
          <span key={d} className="track-mark" style={{ left: `${(d / scale) * 100}%` }} />
        ))}
      </div>

      <div className="track-scale">
        <span>0s</span>
        <span>{revealed ? `${FULL_PREVIEW}s` : '5s'}</span>
      </div>

      <button
        type="button"
        className="play-btn"
        onClick={() => (playing ? stop() : void play())}
        disabled={!buffer || failed}
        style={{ borderColor: accent }}
      >
        {failed ? 'Preview unavailable' : !buffer ? 'Loading…' : playing ? '■ Stop' : `▶ Play ${clipSec}s`}
      </button>

      {revealed && (
        <div className="stage-caption">
          <strong>{p.title}</strong>
          <span>{p.artist}</span>
        </div>
      )}
    </div>
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const catalog: Option[] = SONGS.map((s) => ({
    id: seedId(s.t, s.a),
    label: s.t,
    sublabel: s.a,
  }));

  return streamDeck({
    pool: SONGS,
    count,
    rng,
    catalog,
    eager: 2,
    concurrency: 2,
    resolve: async (s) => {
      const track = await findTrack(s.t, s.a);
      return track?.previewUrl ? track : null;
    },
    toRound: (seed, track) => ({
      id: seedId(seed.t, seed.a),
      answer: { id: seedId(seed.t, seed.a), label: seed.t, sublabel: seed.a, image: track.artwork },
      payload: {
        previewUrl: track.previewUrl,
        artwork: track.artwork,
        title: seed.t,
        artist: seed.a,
      } satisfies SongPayload,
    }),
    emptyError: 'Could not reach the iTunes preview catalog. Check your connection.',
  });
}

export const songGame: GameDef = {
  slug: 'song',
  title: 'Guess the Song',
  short: 'Song',
  tagline: 'One tenth of one second.',
  blurb:
    'You get 0.1 seconds of the track. Not enough? Trade points for more — half a second, a second and a half, three, five. Then name it.',
  emoji: '🎧',
  accent: '#ff4d6d',
  guess: 'search',
  levels: ['0.1s', '0.5s', '1.5s', '3s', '5s'],
  skipLabel: 'Hear more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['music', 'audio', 'track', 'heardle', 'listen', 'tune'],
  loadDeck,
  // Decoding a preview takes a moment; do the next one during this round.
  prefetch: (round) => {
    const p = round.payload as SongPayload | undefined;
    if (p?.previewUrl) void preloadClip(p.previewUrl).catch(() => {});
  },
  Stage: SongStage,
};
