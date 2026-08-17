import { useCallback, useEffect, useRef, useState } from 'react';
import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { sceneMeta } from './scene.meta';
import { streamDeck } from '../content/deck';
import { loadYouTubeApi, type YTPlayer } from '../lib/youtube';
import { usePlayAction } from '../engine/player';

const DURATIONS = [1, 2, 4, 8, 15];

type ScenePayload = {
  video: string;
  title: string;
  year: number;
  start: number;
};

/**
 * Fallback for where in the trailer to start.
 *
 * Every film in MOVIES carries a measured `start`, so this is only reached if a
 * row is added without one. Trailers are built out of real footage, but not
 * evenly: the first fifth is studio logos and setup, and the last eighth is
 * title cards, cast lists and a release date — all of which either give the
 * answer away or show nothing of the film. The middle is where actual scenes
 * live, so it guesses 38%–72% in.
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
  const giveUpTimer = useRef<number>(0);
  // Read inside the state callback, which is created once per player.
  const clipRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  // Whether YouTube is *actually* rendering video, as opposed to us having
  // asked it to. Between those two moments it shows its poster frame, which
  // for most trailers has the film's title printed on it.
  const [showingVideo, setShowingVideo] = useState(false);

  const clipSec = revealed ? 25 : (DURATIONS[Math.min(level, DURATIONS.length - 1)] ?? 15);
  clipRef.current = clipSec;

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
            // Captions were auto-showing, which prints the dialogue on screen
            // and hands over far more than a second of footage should.
            cc_load_policy: 0,
            hl: 'en',
          },
          events: {
            onReady: () => !disposed && setReady(true),
            onError: () => !disposed && setError('This trailer will not play here.'),
            // 1 = PLAYING. The shield lifts here and the clip timer starts
            // here, so the player always gets the full duration of footage
            // however long YouTube took to buffer.
            onStateChange: (e) => {
              if (disposed) return;
              if (e.data === 1) {
                window.clearTimeout(giveUpTimer.current);
                setShowingVideo(true);
                window.clearTimeout(stopTimer.current);
                stopTimer.current = window.setTimeout(() => {
                  try {
                    playerRef.current?.pauseVideo();
                  } catch {
                    /* ignore */
                  }
                  setPlaying(false);
                  setShowingVideo(false);
                }, clipRef.current * 1000);
              } else if (e.data === 0) {
                setPlaying(false);
                setShowingVideo(false);
              }
            },
          },
        });
      })
      .catch((e: Error) => !disposed && setError(e.message));

    return () => {
      disposed = true;
      window.clearTimeout(stopTimer.current);
      window.clearTimeout(giveUpTimer.current);
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
    window.clearTimeout(giveUpTimer.current);

    let duration = 0;
    try {
      duration = player.getDuration();
    } catch {
      duration = 0;
    }
    const usable = duration * TAIL_GUARD;
    // `start` was measured, not guessed: every trailer was sampled at five
    // points and each pair of frames scored for motion, colour and darkness, so
    // the offset stored here is one where the screen holds real footage rather
    // than a studio logo, a "FROM THE CREATORS OF" card or a held black frame.
    const wanted =
      Number.isFinite(p.start) && p.start > 0 ? p.start : duration * startFraction(round.id);
    const start = duration > 5 ? Math.max(0, Math.min(wanted, usable - clipSec)) : 0;

    player.seekTo(Math.max(0, start), true);
    player.playVideo();
    setPlaying(true);

    // No stop timer here. YouTube buffers for a second or two, and at the first
    // rung the clip is only one second long — starting the countdown on the
    // click meant it expired before a single frame rendered, so the round
    // showed a poster and no footage. onStateChange starts it instead.
    giveUpTimer.current = window.setTimeout(() => {
      setPlaying(false);
      setError('YouTube would not start this clip. Try again, or skip the round.');
    }, 12000);
  }, [clipSec, round.id, p.start]);

  // Space bar plays the clip.
  usePlayAction(ready && !error ? play : null, [ready, error, play]);

  // Buying another rung should just play the longer clip. Pressing the button
  // is itself the user gesture, so autoplay policy is satisfied.
  const firstLevel = useRef(level);
  useEffect(() => {
    if (level === firstLevel.current) return;
    firstLevel.current = level;
    if (ready && !error && !revealed) play();
    // Keyed on the rung only — `play` changes identity whenever the clip
    // length does, which is on every rung.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  return (
    <div className="stage">
      <div className="frame frame-wide">
        <div className="yt-crop">
          <div ref={mountRef} className="yt-mount" />
        </div>
        {/* Blocks clicks, the title bar, and the paused frame — a freeze-frame
            would hand over more of the film than the player paid for. */}
        <div className={`yt-shield ${showingVideo ? 'clear' : ''}`}>
          {!showingVideo && (
            <div className="yt-shield-inner">
              {error ? (
                <span className="frame-msg">{error}</span>
              ) : !ready ? (
                <span className="frame-msg shimmer">Cueing up…</span>
              ) : playing ? (
                <span className="frame-msg shimmer">Starting…</span>
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
  const { MOVIES } = await import('../content/data/movies');
  const catalog: Option[] = MOVIES.map((m) => ({
    id: `scene:${m.wiki}`,
    label: m.title,
    sublabel: String(m.year),
  }));

  /*
   * No Wikipedia lookup, and that is a deliberate removal rather than an
   * oversight.
   *
   * This used to fetch each film's lead image "for the reveal card". Nothing
   * ever rendered it: `SceneStage` shows the trailer, and its reveal card shows
   * the title and the year — the poster was written into the payload and read
   * by no one. So it bought nothing and cost two things. One was a Wikipedia
   * round trip per round, on the critical path of dealing the deck, for a value
   * that was thrown away. The other was a licensing trap: a film article's lead
   * image is almost always a poster hosted locally on en.wikipedia under a
   * fair-use rationale that does not extend to this site, and it was sitting in
   * the payload waiting for someone to render it.
   *
   * Every trailer id in MOVIES was verified when the deck was written, so a
   * round now needs no network at all to be dealt.
   */
  return streamDeck({
    pool: MOVIES,
    count,
    rng,
    catalog,
    resolve: async (seed) => seed,
    toRound: (seed) => ({
      id: `scene:${seed.wiki}`,
      answer: { id: `scene:${seed.wiki}`, label: seed.title, sublabel: String(seed.year) },
      payload: {
        video: seed.yt,
        title: seed.title,
        year: seed.year,
        start: seed.start,
      } satisfies ScenePayload,
    }),
    eager: 2,
    emptyError: 'Could not build a film deck.',
  });
}

export const sceneGame: GameDef = {
  ...sceneMeta,
  loadDeck,
  Stage: SceneStage,
};
