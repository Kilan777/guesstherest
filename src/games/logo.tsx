import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { LOGOS } from '../content/data/logos';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { TileStage } from './stages';

/** Marks are wider than they are tall far more often than not. */
const COLS = 6;
const ROWS = 4;
/** Windows cut at each rung, out of 24. */
const OPENED = [2, 5, 9, 14, 20];

/**
 * Two things TileStage does for flags are wrong for logos, and both are fixed
 * here rather than in the shared stylesheet so no other game moves:
 *
 *  - The solid backing behind the unopened windows is a dark green. Most marks
 *    in this deck are black or near-black on a transparent background — the
 *    swoosh, the Chanel Cs, the Apple, the X — and black on dark green is not
 *    a reveal, it is an empty frame.
 *  - `object-fit: cover` fills the 3:2 frame. A flag is 3:2 already; a logo can
 *    be a tall roundel or a very wide wordmark, and cropping to fill throws
 *    away the parts that identify it.
 */
const STAGE_CSS = `
.logo-stage .frame { background: #f3f1ec; }
.logo-stage .tile-solid { background: linear-gradient(150deg, #efece5, #ded8cb); }
.logo-stage .tile-img { object-fit: contain; }
`;

type LogoPayload = { src: string | null; label: string; sector: string };

function LogoStage({ round, level, revealed }: StageProps) {
  const p = round.payload as LogoPayload;
  return (
    <div className="logo-stage">
      <style>{STAGE_CSS}</style>
      <TileStage
        src={p.src}
        opened={OPENED}
        level={level}
        revealed={revealed}
        cols={COLS}
        rows={ROWS}
        seed={round.id}
        // Blurring a logo leaves its colours and its layout entirely legible,
        // and for a mark that is the whole answer. The rest stays solid.
        conceal="hide"
        aspect="landscape"
        caption={
          <>
            <strong>{p.label}</strong>
            <span>{p.sector}</span>
          </>
        }
      />
    </div>
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const catalog: Option[] = LOGOS.map((l) => ({
    id: `logo:${l.label}`,
    label: l.label,
    sublabel: l.sector,
  }));

  return streamDeck({
    pool: LOGOS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      // Logos are small non-free files as often as not, and the 1280px render
      // Wikimedia caches for larger images frequently isn't there for them —
      // so take the original first and fall back to the render.
      return info?.imageFull ?? info?.image ?? null;
    },
    toRound: (seed, src) => ({
      id: `logo:${seed.label}`,
      answer: { id: `logo:${seed.label}`, label: seed.label, sublabel: seed.sector },
      payload: { src, label: seed.label, sector: seed.sector } satisfies LogoPayload,
    }),
    emptyError: 'Could not reach Wikipedia for logo images.',
  });
}

export const logoGame: GameDef = {
  slug: 'logo',
  title: 'Guess the Logo',
  short: 'Logo',
  tagline: 'Colour first, letters later.',
  blurb:
    'A company logo behind a panel of twenty-four windows. Two are open to start, which is usually a patch of flat colour and part of one letter. Wordmarks give themselves up early; the marks that are only a shape can take all five rungs.',
  emoji: '✳️',
  accent: '#A8531C',
  guess: 'search',
  levels: ['2 windows', '5 windows', '9 windows', '14 windows', '20 windows'],
  skipLabel: 'Open more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['logo', 'brand', 'company', 'trademark', 'wordmark', 'business', 'tiles'],
  prefetch: (round) => {
    const p = round.payload as LogoPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: LogoStage,
};
