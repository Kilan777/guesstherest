import { useCallback, useEffect, useRef, useState } from 'react';
import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { songMeta } from './song.meta';
import { findTrack } from '../content/itunes';
import { streamDeck } from '../content/deck';
import { normalize } from '../content/cache';
import {
  isAudioUnlocked,
  playClip,
  preloadClip,
  preloadFullClip,
  unlockAudio,
  type Playback,
} from '../lib/audio';
import { usePlayAction } from '../engine/player';

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

  // While the round is live only the opening seconds have been downloaded; the
  // rest arrives once the answer is out and there is time to spare for it.
  const [fullBuffer, setFullBuffer] = useState<AudioBuffer | null>(null);
  const active = (revealed && fullBuffer) || buffer;

  const unlockedSec = DURATIONS[Math.min(level, DURATIONS.length - 1)] ?? 5;
  const clipSec = revealed ? Math.min(active?.duration ?? FULL_PREVIEW, FULL_PREVIEW) : unlockedSec;

  useEffect(() => {
    let alive = true;
    setBuffer(null);
    setFullBuffer(null);
    setFailed(false);
    preloadClip(p.previewUrl)
      .then((b) => alive && setBuffer(b))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [p.previewUrl]);

  // Reveal: go and get the whole thing so the answer plays out properly. If it
  // hasn't landed, the prefix still plays — several seconds of the song, which
  // is enough to recognise it.
  useEffect(() => {
    if (!revealed) return;
    let alive = true;
    preloadFullClip(p.previewUrl)
      .then((b) => alive && setFullBuffer(b))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [revealed, p.previewUrl]);

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
    if (!active) return;
    await unlockAudio();
    playback.current?.stop();
    cancelAnimationFrame(raf.current);

    const duration = clipSec;
    startedAt.current = performance.now();
    setPlaying(true);

    playback.current = playClip(active, {
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
  }, [active, clipSec]);

  // Space bar plays (or re-plays) the clip.
  usePlayAction(active && !failed ? () => void play() : null, [active, failed, play]);

  // Once audio is unlocked, each new rung plays itself — pressing play again
  // after every skip gets old fast.
  useEffect(() => {
    if (buffer && isAudioUnlocked() && !revealed) void play();
    // Deliberately keyed on the rung, not on `play`, which changes identity
    // whenever the window does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, buffer, round.id]);

  // The bar measures against whatever is actually playable right now.
  const scale = revealed ? Math.min(active?.duration ?? FULL_PREVIEW, FULL_PREVIEW) : 5;
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
        {DURATIONS.filter((d) => d <= scale).map((d) => (
          <span key={d} className="track-mark" style={{ left: `${(d / scale) * 100}%` }} />
        ))}
      </div>

      <div className="track-scale">
        <span>0s</span>
        <span>{revealed ? `${Math.round(scale)}s` : '5s'}</span>
      </div>

      <button
        type="button"
        className="play-btn"
        onClick={() => (playing ? stop() : void play())}
        disabled={!buffer || failed}
        style={{ borderColor: accent }}
      >
        {failed ? 'Preview unavailable' : !buffer ? 'Loading…' : playing ? '■ Stop' : `▶ Play ${clipSec}s`}
        <kbd>space</kbd>
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
  const { SONGS } = await import('../content/data/songs');
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
    // Round one needs one lookup, not two. The rest streams in behind it.
    eager: 1,
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
  }).then((deck) => {
    // Don't wait for the stage to mount before fetching audio — the download
    // and decode can overlap with the rest of the deck streaming in.
    const first = deck.rounds[0]?.payload as SongPayload | undefined;
    if (first?.previewUrl) void preloadClip(first.previewUrl).catch(() => {});
    return deck;
  });
}

export const songGame: GameDef = {
  ...songMeta,
  loadDeck,
  // Decoding a preview takes a moment; do the next one during this round.
  prefetch: (round) => {
    const p = round.payload as SongPayload | undefined;
    if (p?.previewUrl) void preloadClip(p.previewUrl).catch(() => {});
  },
  Stage: SongStage,
};
