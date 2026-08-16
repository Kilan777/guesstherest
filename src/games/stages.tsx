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
 * Windowed reveal: the picture sits behind a blur, and each rung cuts a few
 * sharp windows into it.
 *
 * This was originally opaque grey tiles laid over the image, which looked like
 * scaffolding and — worse — animated back in on a round change, flashing the
 * whole picture for the length of the transition. Now a blurred copy is always
 * the base layer, and a sharp copy on top is masked to just the revealed cells,
 * so there is never a frame where the full picture is visible.
 */
export function TileStage(props: {
  src: string | null;
  /** Cells revealed by this rung. */
  opened: number[];
  level: number;
  revealed: boolean;
  cols: number;
  rows: number;
  /** Stable per-round cell order. */
  seed: string;
  /**
   * How the unrevealed area is hidden.
   *  - 'blur'  the rest of the picture is blurred. Right for posters and box
   *            art, where shape and composition are the clue.
   *  - 'hide'  the rest is solid. Necessary for flags: blur leaves the colour
   *            layout completely intact, which is the entire answer.
   */
  conceal?: 'blur' | 'hide';
  /**
   * Frame shape. Posters and box art are portrait; flags are landscape, and a
   * landscape image in a 2:3 frame with object-fit:cover crops away the sides,
   * which is where half a flag's identity lives.
   */
  aspect?: 'portrait' | 'landscape';
  caption?: React.ReactNode;
}) {
  const { src, opened, level, revealed, cols, rows } = props;
  const conceal = props.conceal ?? 'blur';
  const state = useImageState([src]);
  const total = cols * rows;

  // Deterministic shuffle so the same round always opens the same cells.
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
  const open = order.slice(0, openCount);

  // One mask layer per revealed cell. Percentage positions follow the same
  // rule as background-position: c/(cols-1) aligns that fraction of the layer
  // with that fraction of the box, which lands each cell exactly on its grid.
  const mask = useMemo(() => {
    if (!open.length) return { WebkitMaskImage: 'none', maskImage: 'none', opacity: 0 };
    const layers: string[] = [];
    const sizes: string[] = [];
    const positions: string[] = [];
    for (const i of open) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      // Feathered windows look better over a blur; over a solid backing a soft
      // edge just smears the flag's colours outward, so keep those crisp.
      layers.push(
        conceal === 'hide'
          ? 'radial-gradient(closest-side, #000 94%, rgba(0,0,0,0) 100%)'
          : 'radial-gradient(closest-side, #000 72%, rgba(0,0,0,0) 100%)',
      );
      const spread = conceal === 'hide' ? 1.02 : 1.35;
      sizes.push(`${(100 / cols) * spread}% ${(100 / rows) * spread}%`);
      positions.push(`${cols > 1 ? (c / (cols - 1)) * 100 : 50}% ${rows > 1 ? (r / (rows - 1)) * 100 : 50}%`);
    }
    const common = {
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskImage: layers.join(','),
      WebkitMaskImage: layers.join(','),
      maskSize: sizes.join(','),
      WebkitMaskSize: sizes.join(','),
      maskPosition: positions.join(','),
      WebkitMaskPosition: positions.join(','),
    } as React.CSSProperties;
    return common;
  }, [open.join(','), cols, rows, conceal]);

  const baseBlur = revealed ? 0 : 26;

  return (
    <div className="stage">
      <div className={`frame ${props.aspect === 'landscape' ? 'frame-flag' : 'frame-poster'}`}>
        {state.status === 'ready' ? (
          <>
            {conceal === 'hide' && !revealed ? (
              <div className="tile-img tile-solid" aria-hidden />
            ) : (
              <img
                className="tile-img tile-base"
                src={state.url}
                alt=""
                draggable={false}
                style={{ filter: `blur(${baseBlur}px)`, transform: 'scale(1.08)' }}
              />
            )}
            {(openCount > 0 || revealed) && (
              <img
                className="tile-img tile-sharp"
                src={state.url}
                alt=""
                draggable={false}
                style={revealed ? undefined : mask}
              />
            )}
          </>
        ) : state.status === 'failed' || state.status === 'idle' ? (
          <div className="frame-msg">Poster unavailable.</div>
        ) : (
          <div className="frame-msg shimmer">Loading…</div>
        )}
      </div>
      {revealed && props.caption ? <div className="stage-caption">{props.caption}</div> : null}
    </div>
  );
}

/** Album covers reveal by de-blurring instead of zooming — the shapes come back first. */
export function BlurStage(props: {
  src: string | null;
  /**
   * Frame shape. Album art is square; a car photo is landscape, and squeezing
   * one into a square frame with object-fit:cover cuts the nose and tail off —
   * which for a car is most of what identifies it.
   */
  aspect?: 'square' | 'landscape';
  /**
   * 'contain' guarantees the whole subject is visible. Worth it when the
   * silhouette is the clue, as with cars.
   */
  fit?: 'cover' | 'contain';
  blurs: number[];
  scales: number[];
  level: number;
  revealed: boolean;
  caption?: React.ReactNode;
}) {
  const { src, blurs, scales, level, revealed } = props;
  const fit = props.fit ?? 'cover';
  const state = useImageState([src]);
  const i = Math.min(level, blurs.length - 1);
  const blur = revealed ? 0 : (blurs[i] ?? 0);
  const scale = revealed ? 1 : (scales[i] ?? 1);

  return (
    <div className="stage">
      <div className={`frame ${props.aspect === 'landscape' ? 'frame-wide' : 'frame-square'}`}>
        {state.status === 'ready' ? (
          <img
            className="frame-img"
            src={state.url}
            alt=""
            draggable={false}
            style={{
              filter: `blur(${blur}px) saturate(1.05)`,
              transform: `scale(${scale})`,
              objectFit: fit,
            }}
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

/**
 * Street View panorama you can look around in.
 *
 * Uses Google's iframe embed, which needs no API key but only renders when it
 * is actually inside an iframe. Two things have to be handled:
 *
 *  - The embed prints the place name in its top-left corner, which is the
 *    answer. That corner is covered.
 *  - Google's logo, the Terms link and the imagery attribution along the bottom
 *    are left completely visible. Covering the place label is fine; hiding
 *    attribution is not, and their terms say so.
 *
 * Dragging to look around still works — only the top-left corner is masked.
 */
export function StreetViewStage(props: {
  lat: number;
  lng: number;
  /** Stable per-round heading so the same round always faces the same way. */
  seed: string;
  revealed: boolean;
  caption?: React.ReactNode;
}) {
  const { lat, lng, seed, revealed } = props;

  const heading = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return h % 360;
  }, [seed]);

  const src = `https://maps.google.com/maps?q&layer=c&cbll=${lat},${lng}&cbp=11,${heading},0,0,0&output=svembed`;

  return (
    <div className="stage">
      <div className="frame frame-wide sv-frame">
        <iframe
          key={`${lat},${lng}`}
          className="sv-frame-inner"
          src={src}
          title="Street View"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen={false}
        />
        {/* Covers the place-name label and the "View on Google Maps" link.
            Deliberately small: everything else, including Google's attribution
            along the bottom, stays visible and interactive. */}
        {!revealed && <div className="sv-label-mask" aria-hidden />}
      </div>
      <p className="stage-note">Drag to look around. Road signs, plates and which side they drive on all help.</p>
      {revealed && props.caption ? <div className="stage-caption">{props.caption}</div> : null}
    </div>
  );
}
