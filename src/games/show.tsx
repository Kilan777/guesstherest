import { useCallback, useEffect, useRef, useState } from 'react';
import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { showMeta } from './show.meta';
import { streamDeck } from '../content/deck';
import { normalize } from '../content/cache';
import { loadYouTubeApi, type YTPlayer } from '../lib/youtube';
import { usePlayAction } from '../engine/player';

/**
 * The ladder. A theme tune is the most over-learned music most people own, so
 * it can start meaner than the film game does: one second is a drum fill and a
 * key, which for Cheers or The Simpsons is already plenty. Twenty seconds at
 * the top is a whole verse of almost any title sequence.
 */
const DURATIONS: readonly number[] = [1, 2, 5, 10, 20];
/** The top of the ladder — what the progress track is measured against. */
const LADDER_SEC = 20;
/** How much of the theme the reveal plays out. */
const REVEAL_SEC = 30;

type ShowPayload = {
  video: string;
  title: string;
  year: number;
  /** Seconds into the upload where the theme actually starts. */
  start: number;
};

const BARS = [0.45, 0.8, 0.6, 1, 0.72, 0.9, 0.5, 0.85, 0.65];

const seedId = (title: string) => `show:${normalize(title)}`;

/**
 * Sound only, on purpose.
 *
 * Almost every opening title sequence prints the show's name on screen, usually
 * within the first few seconds — the film game's trailers only do that at the
 * very end, which is why it can afford to show pictures and this cannot. There
 * is no crop or blur that survives "the answer is written across the middle of
 * the frame", so the picture is not shown at all and the game is the theme tune.
 *
 * The player still has to be a real, playing YouTube iframe — that is the only
 * keyless way to get this audio — so it is moved off-screen rather than hidden.
 * All six ways of hiding it were measured against a live embed (`display:none`,
 * `visibility:hidden`, 0×0, 1×1, off-screen, and a visible control) and today's
 * Chrome keeps the sound on through every one of them. Off-screen is still the
 * one to pick: it is the only option that leaves a full-size, laid-out,
 * composited element, so nothing in the rendering pipeline is being asked to
 * play audio for a box it has been told is not there. Zero-sized and
 * `display:none` media have been throttled or refused before, on both engines,
 * and would fail silently — the round would simply make no sound. Parked at
 * left:-10000px it cannot be seen, hovered, focused or read either.
 */
function ShowStage({ round, level, revealed, accent }: StageProps) {
  const p = round.payload as ShowPayload;
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const stopTimer = useRef(0);
  const giveUpTimer = useRef(0);
  const raf = useRef(0);
  // Read from inside callbacks created once per player.
  const clipRef = useRef(0);
  const startRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const clipSec = revealed ? REVEAL_SEC : (DURATIONS[Math.min(level, DURATIONS.length - 1)] ?? 20);
  clipRef.current = clipSec;

  const stop = useCallback(() => {
    window.clearTimeout(stopTimer.current);
    window.clearTimeout(giveUpTimer.current);
    cancelAnimationFrame(raf.current);
    try {
      playerRef.current?.pauseVideo();
    } catch {
      /* player already gone */
    }
    setPlaying(false);
    setElapsed(0);
  }, []);

  useEffect(() => {
    let disposed = false;
    setReady(false);
    setError(null);
    setPlaying(false);
    setElapsed(0);

    // The IFrame API names its iframe after the video — "Friends Opening
    // Credits", i.e. the answer, sitting in the accessibility tree and in the
    // element's own tooltip. The host is aria-hidden, but the title is rewritten
    // the instant the element appears rather than trusted to stay buried, and
    // again if YouTube ever puts it back.
    const scrub = () => {
      const frame = mountRef.current?.querySelector('iframe');
      if (!frame || frame.getAttribute('title') === 'Theme tune player') return;
      frame.setAttribute('title', 'Theme tune player');
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('tabindex', '-1');
    };
    const watcher = new MutationObserver(scrub);
    if (mountRef.current) {
      watcher.observe(mountRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['title'],
      });
    }

    loadYouTubeApi()
      .then((YT) => {
        if (disposed || !mountRef.current) return;
        const host = document.createElement('div');
        mountRef.current.replaceChildren(host);
        playerRef.current = new YT.Player(host, {
          videoId: p.video,
          width: '320',
          height: '180',
          playerVars: {
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            fs: 0,
            iv_load_policy: 3,
            playsinline: 1,
            cc_load_policy: 0,
            hl: 'en',
          },
          events: {
            onReady: () => {
              if (disposed) return;
              scrub();
              setReady(true);
            },
            onError: () => !disposed && setError('This theme will not play here.'),
            onStateChange: (e) => {
              if (disposed) return;
              // 1 = PLAYING. The clip is timed from here, not from the click, so
              // buffering never eats into the second the player paid for.
              if (e.data === 1) {
                window.clearTimeout(giveUpTimer.current);
                window.clearTimeout(stopTimer.current);
                const began = performance.now();
                stopTimer.current = window.setTimeout(() => {
                  try {
                    playerRef.current?.pauseVideo();
                  } catch {
                    /* ignore */
                  }
                  cancelAnimationFrame(raf.current);
                  setPlaying(false);
                  setElapsed(0);
                }, clipRef.current * 1000);

                cancelAnimationFrame(raf.current);
                const tick = () => {
                  const t = (performance.now() - began) / 1000;
                  setElapsed(Math.min(t, clipRef.current));
                  if (t < clipRef.current) raf.current = requestAnimationFrame(tick);
                };
                raf.current = requestAnimationFrame(tick);
              } else if (e.data === 0) {
                cancelAnimationFrame(raf.current);
                setPlaying(false);
                setElapsed(0);
              }
            },
          },
        });
      })
      .catch((e: Error) => !disposed && setError(e.message));

    return () => {
      disposed = true;
      watcher.disconnect();
      window.clearTimeout(stopTimer.current);
      window.clearTimeout(giveUpTimer.current);
      cancelAnimationFrame(raf.current);
      try {
        playerRef.current?.destroy();
      } catch {
        /* already gone */
      }
      playerRef.current = null;
    };
  }, [p.video]);

  startRef.current = p.start;

  const play = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    window.clearTimeout(stopTimer.current);
    window.clearTimeout(giveUpTimer.current);
    cancelAnimationFrame(raf.current);
    setElapsed(0);

    player.seekTo(Math.max(0, startRef.current), true);
    player.playVideo();
    setPlaying(true);

    giveUpTimer.current = window.setTimeout(() => {
      setPlaying(false);
      setError('YouTube would not start this theme. Try again, or skip the round.');
    }, 12000);
  }, []);

  usePlayAction(ready && !error ? play : null, [ready, error, play]);

  // Buying a rung plays the longer clip straight away — the button press is
  // itself the gesture Chrome wants before it will let audio out.
  const shownLevel = useRef(level);
  useEffect(() => {
    if (level === shownLevel.current) return;
    shownLevel.current = level;
    if (ready && !error && !revealed) play();
    // Keyed on the rung alone.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // Never let one show's theme run on into the next round.
  useEffect(() => stop, [stop, round.id]);

  const scale = revealed ? REVEAL_SEC : LADDER_SEC;
  const unlockedPct = (clipSec / scale) * 100;
  const playedPct = (elapsed / scale) * 100;

  return (
    <div className="stage stage-show">
      {/* Laid out and playing, parked where it cannot be seen. Never remove it
          from the flow: a hidden player is a silent one. */}
      <div className="tv-audio-host" ref={mountRef} aria-hidden />

      <div className={`tv ${playing ? 'on' : ''} ${revealed ? 'revealed' : ''}`}>
        <div className="tv-screen" style={revealed ? { borderColor: accent } : undefined}>
          {playing ? (
            <div className="tv-eq" aria-hidden>
              {BARS.map((h, i) => (
                <span
                  key={i}
                  style={{ background: accent, animationDelay: `${i * 90}ms`, ['--h' as string]: h }}
                />
              ))}
            </div>
          ) : (
            <span className="tv-idle">{error ? '✕' : ready ? '📺' : '…'}</span>
          )}
          <div className="tv-scan" aria-hidden />
        </div>
        <div className="tv-legs" aria-hidden>
          <span />
          <span />
        </div>
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
        <span>{scale}s</span>
      </div>

      <button
        type="button"
        className="play-btn"
        onClick={() => (playing ? stop() : play())}
        disabled={!ready || !!error}
        style={{ borderColor: accent }}
      >
        {error ? 'Theme unavailable' : !ready ? 'Tuning in…' : playing ? '■ Stop' : `▶ Play ${clipSec}s`}
        <kbd>space</kbd>
      </button>

      {error && <span className="frame-msg">{error}</span>}

      {revealed && (
        <div className="stage-caption">
          <strong>{p.title}</strong>
          <span>{p.year}</span>
        </div>
      )}
    </div>
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { SHOWS } = await import('../content/data/shows');
  const catalog: Option[] = SHOWS.map((s) => ({
    id: seedId(s.title),
    label: s.title,
    sublabel: String(s.year),
  }));

  // Every id in SHOWS was checked against YouTube before it was written down,
  // so a deck costs no requests at all — the theme itself is the only fetch.
  return streamDeck({
    pool: SHOWS,
    count,
    rng,
    catalog,
    resolve: async () => ({}),
    toRound: (seed) => ({
      id: seedId(seed.title),
      answer: { id: seedId(seed.title), label: seed.title, sublabel: String(seed.year) },
      payload: {
        video: seed.yt,
        title: seed.title,
        year: seed.year,
        start: seed.start ?? 0,
      } satisfies ShowPayload,
    }),
    eager: 2,
    emptyError: 'Could not build a TV deck.',
  });
}

export const showGame: GameDef = {
  ...showMeta,
  loadDeck,
  Stage: ShowStage,
};
