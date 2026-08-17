import { Fragment, useEffect, useMemo, useState } from 'react';
import { imageLicence, type ImageCredit as Credit, type ImageLicence } from '../content/wikipedia';

export type { Credit };

/** A credit, optionally named — used where a round shows more than one picture. */
export type CreditItem = Credit & { label?: string };

/**
 * One picture's credit: a link to its file description page, upgraded to
 * "Image: <author> / <licence>" if and when the lazy lookup lands.
 */
function OneCredit({ credit }: { credit: CreditItem }) {
  const [detail, setDetail] = useState<ImageLicence | null>(null);

  useEffect(() => {
    setDetail(null);
    let alive = true;
    imageLicence(credit)
      .then((d) => {
        if (alive) setDetail(d);
      })
      .catch(() => {
        /* The link stands on its own — a failed upgrade changes nothing. */
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credit.page]);

  const named = [detail?.author, detail?.licence].filter(Boolean).join(' / ');
  return (
    <p className="img-credit">
      <a href={credit.page} target="_blank" rel="noopener noreferrer">
        {named ? `Image: ${named}` : 'Image source'}
      </a>
    </p>
  );
}

/**
 * The attribution line under a revealed picture.
 *
 * Most Wikimedia photographs are CC BY-SA, which requires the author and the
 * licence to travel with the picture. Two rules govern this component and
 * neither is negotiable:
 *
 *  - It renders *only* on the reveal. A Wikimedia file name almost always
 *    contains the subject's name, so a credit shown mid-round is the answer.
 *    Every stage below therefore places it inside its `revealed` branch, and
 *    nothing here is mounted — or fetched — before then.
 *  - It degrades to nothing. With no derivable file page there is no link and
 *    no line, rather than a plausible-looking URL that 404s.
 *
 * The link is a complete attribution on its own and is there from the first
 * frame. Author and licence are an upgrade fetched afterwards; if that request
 * is slow or fails, the line simply stays as "Image source".
 */
export function ImageCredit({ credit }: { credit?: CreditItem | CreditItem[] | null }) {
  const list = (Array.isArray(credit) ? credit : credit ? [credit] : []).filter((c) => !!c?.page);

  if (list.length === 0) return null;
  if (list.length === 1) return <OneCredit credit={list[0] as CreditItem} />;

  // A round that shows several pictures at once (the quote game's four
  // portraits) gets one line of links rather than four stacked credits. Each
  // link still lands on the file page that carries its author and licence.
  return (
    <p className="img-credit">
      Images:{' '}
      {list.map((c, i) => (
        <Fragment key={c.page}>
          {i > 0 ? ' · ' : ''}
          <a href={c.page} target="_blank" rel="noopener noreferrer">
            {c.label ?? 'source'}
          </a>
        </Fragment>
      ))}
    </p>
  );
}

/** Caption plus credit, the way every stage renders them once a round is over. */
function Reveal(props: {
  caption?: React.ReactNode;
  credit?: CreditItem | CreditItem[] | null;
}) {
  if (!props.caption && !props.credit) return null;
  return (
    <div className="stage-caption">
      {props.caption}
      <ImageCredit credit={props.credit} />
    </div>
  );
}

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
  | { status: 'idle' | 'loading' | 'failed'; url: null; w: 0; h: 0 }
  | { status: 'ready'; url: string; w: number; h: number };

/**
 * Tries each candidate URL in order and reports the first that decodes. The
 * smaller Wikimedia render is preferred but isn't cached for every file, so the
 * full-size original follows it as a fallback.
 *
 * The decoded size comes back with it: a stage that has to shape itself around
 * the picture can't know the picture's proportions any earlier than this.
 */
function useImageState(candidates: (string | null)[]): ImageState {
  const urls = candidates.filter((u): u is string => !!u);
  const key = urls.join('|');
  const [state, setState] = useState<ImageState>(
    urls.length ? { status: 'loading', url: null, w: 0, h: 0 } : { status: 'idle', url: null, w: 0, h: 0 },
  );

  useEffect(() => {
    if (!urls.length) {
      setState({ status: 'idle', url: null, w: 0, h: 0 });
      return;
    }
    let alive = true;
    setState({ status: 'loading', url: null, w: 0, h: 0 });

    const attempt = (i: number) => {
      if (!alive) return;
      const url = urls[i];
      if (!url) {
        setState({ status: 'failed', url: null, w: 0, h: 0 });
        return;
      }
      const img = new Image();
      img.onload = () =>
        alive && setState({ status: 'ready', url, w: img.naturalWidth, h: img.naturalHeight });
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
  /**
   * Attribution for the picture being shown. Rendered on the reveal only — see
   * {@link ImageCredit}.
   */
  credit?: CreditItem | CreditItem[] | null;
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
      <Reveal caption={revealed ? props.caption : null} credit={revealed ? props.credit : null} />
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
   *
   * 'auto' shapes the frame to the picture once it has decoded. Use it for a
   * deck that has no single shape: video game lead images run from 0.60:1 box
   * art to a 3:1 wordmark, so any fixed frame is wrong for part of the deck —
   * with 'cover' it crops the answer away, and with 'contain' it letterboxes,
   * which is worse here than it looks. The tile grid is laid over the frame, so
   * bars inside the frame mean the early rungs open windows onto blank
   * background and reveal nothing. Matching the frame to the image removes the
   * bars, which is what keeps every opened cell landing on artwork.
   */
  aspect?: 'portrait' | 'landscape' | 'auto';
  /**
   * Colour of the solid backing when `conceal` is 'hide'. Flags and maps are
   * colourful and sit well on dark; a lot of logos are black on transparent,
   * which on a dark backing reveals nothing at all.
   */
  backing?: 'dark' | 'light';
  /**
   * 'contain' keeps the whole subject in frame. Logos range from tall roundels
   * to very wide wordmarks, and cover crops the identifying part off both.
   */
  fit?: 'cover' | 'contain';
  caption?: React.ReactNode;
  /**
   * Attribution for the picture being shown. Rendered on the reveal only — see
   * {@link ImageCredit}.
   */
  credit?: CreditItem | CreditItem[] | null;
}) {
  const { src, opened, level, revealed } = props;
  const conceal = props.conceal ?? 'blur';
  const fit = props.fit ?? 'cover';
  const state = useImageState([src]);

  // Only a guard against a freak panorama making the frame a few pixels tall.
  // Everything in the decks that asks for 'auto' sits well inside it, so the
  // frame ends up exactly the picture's shape and nothing is letterboxed.
  const ratio =
    props.aspect === 'auto' && state.status === 'ready' && state.h > 0
      ? Math.min(3.6, Math.max(0.4, state.w / state.h))
      : null;

  // A 6x8 grid over a 3:1 wordmark makes cells four times wider than they are
  // tall, and the round-window masks over them read as letterbox slits. The
  // caller's cols x rows is taken as the budget of cells and re-proportioned to
  // the picture, so a window stays a window whatever shape the frame is.
  const { cols, rows } = useMemo(() => {
    if (ratio === null) return { cols: props.cols, rows: props.rows };
    const budget = props.cols * props.rows;
    const c = Math.max(2, Math.round(Math.sqrt(budget * ratio)));
    return { cols: c, rows: Math.max(2, Math.round(budget / c)) };
  }, [ratio, props.cols, props.rows]);

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
      <div
        className={`frame ${
          props.aspect === 'auto'
            ? 'frame-auto'
            : props.aspect === 'landscape'
              ? 'frame-flag'
              : 'frame-poster'
        }`}
        // Until the picture decodes there is nothing to shape the frame to, so
        // the CSS fallback holds a poster-shaped box rather than collapsing.
        style={ratio !== null ? ({ '--ar': ratio } as React.CSSProperties) : undefined}
      >
        {state.status === 'ready' ? (
          revealed ? (
            /* One clean copy once the round is over. Rendering the backing
               layer as well left a second image 8% larger sitting behind the
               first, which read as the picture doubled up on itself. */
            <img
              className="tile-img tile-sharp"
              src={state.url}
              alt=""
              draggable={false}
              style={{ objectFit: fit }}
            />
          ) : (
            <>
              {conceal === 'hide' ? (
                <div
                  className={`tile-img tile-solid ${props.backing === 'light' ? 'tile-solid-light' : ''}`}
                  aria-hidden
                />
              ) : (
                <img
                  className="tile-img tile-base"
                  src={state.url}
                  alt=""
                  draggable={false}
                  style={{ filter: `blur(${baseBlur}px)`, transform: 'scale(1.08)', objectFit: fit }}
                />
              )}
              {openCount > 0 && (
                <img
                  className="tile-img tile-sharp"
                  src={state.url}
                  alt=""
                  draggable={false}
                  style={{ ...mask, objectFit: fit }}
                />
              )}
            </>
          )
        ) : state.status === 'failed' || state.status === 'idle' ? (
          <div className="frame-msg">Poster unavailable.</div>
        ) : (
          <div className="frame-msg shimmer">Loading…</div>
        )}
      </div>
      <Reveal caption={revealed ? props.caption : null} credit={revealed ? props.credit : null} />
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
  /**
   * Attribution for the picture being shown. Rendered on the reveal only — see
   * {@link ImageCredit}.
   */
  credit?: CreditItem | CreditItem[] | null;
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
      <Reveal caption={revealed ? props.caption : null} credit={revealed ? props.credit : null} />
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
  /**
   * Attribution for the picture being shown. Rendered on the reveal only — see
   * {@link ImageCredit}.
   */
  credit?: CreditItem | CreditItem[] | null;
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
      <Reveal caption={props.revealed ? props.caption : null} credit={props.revealed ? props.credit : null} />
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
  /** Clues bought with skips. These had nowhere to render before. */
  hints?: string[];
  level?: number;
  caption?: React.ReactNode;
  /**
   * Attribution for the picture being shown. Rendered on the reveal only — see
   * {@link ImageCredit}.
   */
  credit?: CreditItem | CreditItem[] | null;
}) {
  const { lat, lng, seed, revealed } = props;
  const hints = props.hints ?? [];
  const visibleHints = revealed ? hints : hints.slice(0, props.level ?? 0);

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
      </div>
      <p className="stage-note">Drag to look around. Road signs, plates and which side they drive on all help.</p>
      {visibleHints.length > 0 && (
        <ul className="hint-list">
          {visibleHints.map((h, i) => (
            <li key={i} className="hint">
              <span className="hint-tag">Clue {i + 1}</span>
              {h}
            </li>
          ))}
        </ul>
      )}
      <Reveal caption={revealed ? props.caption : null} credit={revealed ? props.credit : null} />
    </div>
  );
}
