import { useEffect, useMemo, useState } from 'react';

/** Deterministic focal point per round, so the zoom target doesn't jump on re-render. */
export function focalOf(seedText: string): [number, number] {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const x = 20 + (Math.abs(h) % 61); // 20..80 — keep away from the very edge
  const y = 20 + (Math.abs(h >> 8) % 61);
  return [x, y];
}

type ImageState =
  | { status: 'idle' | 'loading' | 'failed'; url: null }
  | { status: 'ready'; url: string };

/**
 * Tries each candidate URL in order and reports the first that decodes. The
 * smaller Wikimedia render is preferred but isn't cached for every file, so the
 * full-size original follows it as a fallback.
 */
function useImageState(candidates: (string | null)[]): ImageState {
  const urls = candidates.filter((u): u is string => !!u);
  const key = urls.join('|');
  const [state, setState] = useState<ImageState>(
    urls.length ? { status: 'loading', url: null } : { status: 'idle', url: null },
  );

  useEffect(() => {
    if (!urls.length) {
      setState({ status: 'idle', url: null });
      return;
    }
    let alive = true;
    setState({ status: 'loading', url: null });

    const attempt = (i: number) => {
      if (!alive) return;
      const url = urls[i];
      if (!url) {
        setState({ status: 'failed', url: null });
        return;
      }
      const img = new Image();
      img.onload = () => alive && setState({ status: 'ready', url });
      img.onerror = () => attempt(i + 1);
      img.src = url;
    };
    attempt(0);

    return () => {
      alive = false;
    };
    // `key` collapses the candidate list into one stable dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}

/**
 * The zoom-out reveal shared by the object, poster and painting games: start
 * buried in the pixels at a fixed focal point, pull back one rung at a time.
 */
export function ZoomStage(props: {
  src: string | null;
  /** Used if `src` fails to load. */
  srcFallback?: string | null;
  fallbackEmoji?: string;
  scales: number[];
  level: number;
  revealed: boolean;
  focal: [number, number];
  /** Rendered under the frame once the round is over. */
  caption?: React.ReactNode;
}) {
  const { src, srcFallback, scales, level, revealed, focal, fallbackEmoji } = props;
  const state = useImageState([src, srcFallback ?? null]);
  const scale = revealed ? 1 : (scales[Math.min(level, scales.length - 1)] ?? 1);
  const [fx, fy] = focal;

  const transform = {
    transform: `scale(${scale})`,
    transformOrigin: `${fx}% ${fy}%`,
  } as const;

  const showEmoji = (state.status === 'idle' || state.status === 'failed') && fallbackEmoji;

  return (
    <div className="stage">
      <div className="frame">
        {showEmoji ? (
          <div className="frame-emoji" style={transform} aria-hidden>
            {fallbackEmoji}
          </div>
        ) : state.status === 'ready' ? (
          <img className="frame-img" src={state.url} alt="" style={transform} draggable={false} />
        ) : state.status === 'failed' || state.status === 'idle' ? (
          <div className="frame-msg">Image unavailable — skipping is free this round.</div>
        ) : (
          <div className="frame-msg shimmer">Loading…</div>
        )}
        {!revealed && <div className="frame-vignette" aria-hidden />}
      </div>
      {revealed && props.caption ? <div className="stage-caption">{props.caption}</div> : null}
    </div>
  );
}

/**
 * Tile reveal: the image sits behind a grid of panels that lift a few at a
 * time. Zooming needs a high-resolution source, and Wikipedia's fair-use film
 * posters are only ~220px wide — magnifying those is unreadable mush. Opening
 * tiles works at any resolution, and reads as a game rather than an effect.
 */
export function TileStage(props: {
  src: string | null;
  /** Tiles open by this rung. */
  opened: number[];
  level: number;
  revealed: boolean;
  cols: number;
  rows: number;
  /** Stable per-round tile order. */
  seed: string;
  caption?: React.ReactNode;
}) {
  const { src, opened, level, revealed, cols, rows } = props;
  const state = useImageState([src]);
  const total = cols * rows;

  // Deterministic shuffle so the same round always opens the same tiles.
  const order = useMemo(() => {
    let h = 2166136261;
    for (let i = 0; i < props.seed.length; i++) {
      h ^= props.seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const rand = () => {
      h = Math.imul(h ^ (h >>> 15), h | 1);
      h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
      return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
    };
    const idx = Array.from({ length: total }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const a = idx[i] as number;
      idx[i] = idx[j] as number;
      idx[j] = a;
    }
    return idx;
  }, [props.seed, total]);

  const openCount = revealed ? total : (opened[Math.min(level, opened.length - 1)] ?? 0);
  const open = new Set(order.slice(0, openCount));

  return (
    <div className="stage">
      <div className="frame frame-poster">
        {state.status === 'ready' ? (
          <img className="tile-img" src={state.url} alt="" draggable={false} />
        ) : state.status === 'failed' || state.status === 'idle' ? (
          <div className="frame-msg">Poster unavailable.</div>
        ) : (
          <div className="frame-msg shimmer">Loading…</div>
        )}
        <div className="tile-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`tile ${open.has(i) ? 'open' : ''}`} />
          ))}
        </div>
      </div>
      {revealed && props.caption ? <div className="stage-caption">{props.caption}</div> : null}
    </div>
  );
}

/** Album covers reveal by de-blurring instead of zooming — the shapes come back first. */
export function BlurStage(props: {
  src: string | null;
  blurs: number[];
  scales: number[];
  level: number;
  revealed: boolean;
  caption?: React.ReactNode;
}) {
  const { src, blurs, scales, level, revealed } = props;
  const state = useImageState([src]);
  const i = Math.min(level, blurs.length - 1);
  const blur = revealed ? 0 : (blurs[i] ?? 0);
  const scale = revealed ? 1 : (scales[i] ?? 1);

  return (
    <div className="stage">
      <div className="frame frame-square">
        {state.status === 'ready' ? (
          <img
            className="frame-img"
            src={state.url}
            alt=""
            draggable={false}
            style={{ filter: `blur(${blur}px) saturate(1.05)`, transform: `scale(${scale})` }}
          />
        ) : state.status === 'failed' || state.status === 'idle' ? (
          <div className="frame-msg">Artwork unavailable.</div>
        ) : (
          <div className="frame-msg shimmer">Loading…</div>
        )}
      </div>
      {revealed && props.caption ? <div className="stage-caption">{props.caption}</div> : null}
    </div>
  );
}

/**
 * Big centred stage for the two text games. `tone` picks the type scale —
 * emoji want to be enormous, a paragraph-long quote very much does not.
 */
export function TextStage(props: {
  headline: string;
  tone: 'emoji' | 'quote';
  hints: string[];
  level: number;
  revealed: boolean;
  caption?: React.ReactNode;
}) {
  const visible = props.hints.slice(0, props.revealed ? props.hints.length : props.level);
  return (
    <div className="stage">
      <div className="frame frame-text">
        <div className={`rebus rebus-${props.tone}`}>{props.headline}</div>
      </div>
      {visible.length > 0 && (
        <ul className="hint-list">
          {visible.map((h, i) => (
            <li key={i} className="hint">
              <span className="hint-tag">Clue {i + 1}</span>
              {h}
            </li>
          ))}
        </ul>
      )}
      {props.revealed && props.caption ? <div className="stage-caption">{props.caption}</div> : null}
    </div>
  );
}
