import { useCallback, useEffect, useRef, useState } from 'react';
import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { MOVIES } from '../content/data/movies';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { loadYouTubeApi, type YTPlayer } from '../lib/youtube';
import { usePlayAction } from '../engine/player';

const DURATIONS = [1, 2, 4, 8, 15];

type ScenePayload = {
  video: string;
  poster: string | null;
  title: string;
  year: number;
};

/**
 * Where in the trailer to start.
 *
 * Trailers are built out of real footage, but not evenly: the first fifth is
 * studio logos and setup, and the last eighth is title cards, cast lists and a
 * release date — all of which either give the answer away or show nothing of
 * the film. The middle is where actual scenes live, so rounds sample 38%–72%
 * in, and the clip is pulled back if it would run into the end card.
 */
function startFraction(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 0.38 + (h % 35) / 100; // 38%–72% in
}

/** Trailers end on title cards; never let a clip run into them. */
const TAIL_GUARD = 0.88;

function SceneStage({ round, level, revealed, accent }: StageProps) {
  const p = round.payload as ScenePayload;
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const stopTimer = useRef<number>(0);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const clipSec = revealed ? 25 : (DURATIONS[Math.min(level, DURATIONS.length - 1)] ?? 15);

  useEffect(() => {
    let disposed = false;
    setReady(false);
    setError(null);

    loadYouTubeApi()
      .then((YT) => {
        if (disposed || !mountRef.current) return;
        const host = document.createElement('div');
        mountRef.current.replaceChildren(host);
        playerRef.current = new YT.Player(host, {
          videoId: p.video,
          width: '100%',
          height: '100%',
          playerVars: {
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            fs: 0,
            iv_load_policy: 3,
            playsinline: 1,
          },
          events: {
            onReady: () => !disposed && setReady(true),
            onError: () => !disposed && setError('This trailer will not play here.'),
          },
        });
      })
      .catch((e: Error) => !disposed && setError(e.message));

    return () => {
      disposed = true;
      window.clearTimeout(stopTimer.current);
      try {
        playerRef.current?.destroy();
      } catch {
        /* already gone */
      }
      playerRef.current = null;
    };
  }, [p.video]);

  const play = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    window.clearTimeout(stopTimer.current);

    let duration = 0;
    try {
      duration = player.getDuration();
    } catch {
      duration = 0;
    }
    const usable = duration * TAIL_GUARD;
    const start =
      duration > 5
        ? Math.max(0, Math.min(duration * startFraction(round.id), usable - clipSec))
        : 0;

    player.seekTo(Math.max(0, start), true);
    player.playVideo();
    setPlaying(true);

    stopTimer.current = window.setTimeout(() => {
      try {
        playerRef.current?.pauseVideo();
      } catch {
        /* ignore */
      }
      setPlaying(false);
    }, clipSec * 1000);
  }, [clipSec, round.id]);

  // Space bar plays the clip.
  usePlayAction(ready && !error ? play : null, [ready, error, play]);

  return (
    <div className="stage">
      <div className="frame frame-wide">
        <div className="yt-crop">
          <div ref={mountRef} className="yt-mount" />
        </div>
        {/* Blocks clicks, the title bar, and the paused frame — a freeze-frame
            would hand over more of the film than the player paid for. */}
        <div className={`yt-shield ${playing ? 'clear' : ''}`}>
          {!playing && (
            <div className="yt-shield-inner">
              {error ? (
                <span className="frame-msg">{error}</span>
              ) : !ready ? (
                <span className="frame-msg shimmer">Cueing up…</span>
              ) : (
                <span className="yt-idle">▶</span>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="play-btn"
        onClick={play}
        disabled={!ready || !!error}
        style={{ borderColor: accent }}
      >
        {playing ? `Playing ${clipSec}s…` : `▶ Play ${clipSec} second${clipSec === 1 ? '' : 's'}`}
        <kbd>space</kbd>
      </button>

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
  const catalog: Option[] = MOVIES.map((m) => ({
    id: `scene:${m.wiki}`,
    label: m.title,
    sublabel: String(m.year),
  }));

  // Every trailer id in MOVIES was checked, so this needs no network at all —
  // the poster lookup is only for the reveal card and may fail harmlessly.
  return streamDeck({
    pool: MOVIES,
    count,
    rng,
    catalog,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki).catch(() => null);
      return { poster: info?.imageFull ?? null };
    },
    toRound: (seed, value) => ({
      id: `scene:${seed.wiki}`,
      answer: { id: `scene:${seed.wiki}`, label: seed.title, sublabel: String(seed.year) },
      payload: {
        video: seed.yt,
        poster: value.poster,
        title: seed.title,
        year: seed.year,
      } satisfies ScenePayload,
    }),
    eager: 2,
    emptyError: 'Could not build a film deck.',
  });
}

export const sceneGame: GameDef = {
  slug: 'scene',
  title: 'Guess the Movie',
  short: 'Scene',
  tagline: 'One second of footage.',
  blurb:
    'A single second from somewhere in the middle of the trailer. Skip for two, four, eight, fifteen. The trick is that one second is almost always enough — you just have to trust it.',
  emoji: '🎬',
  accent: '#A8531C',
  guess: 'search',
  levels: ['1s', '2s', '4s', '8s', '15s'],
  skipLabel: 'Roll more',
  needsNetwork: true,
  rounds: 8,
  keywords: ['movie', 'film', 'trailer', 'clip', 'cinema', 'video'],
  loadDeck,
  Stage: SceneStage,
};
