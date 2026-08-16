import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { PAINTINGS } from '../content/data/paintings';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/** Paintings start deeper than objects — one brushstroke should be genuinely unfair. */
const SCALES = [16, 9, 5, 2.8, 1.6];

type PaintingPayload = {
  src: string | null;
  srcFull: string | null;
  title: string;
  artist: string;
};

function PaintingStage({ round, level, revealed }: StageProps) {
  const p = round.payload as PaintingPayload;
  return (
    <ZoomStage
      src={p.src}
      srcFallback={p.srcFull}
      scales={SCALES}
      level={level}
      revealed={revealed}
      focal={focalOf(round.id)}
      caption={
        <>
          <strong>{p.title}</strong>
          <span>{p.artist}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const catalog: Option[] = PAINTINGS.map((p) => ({
    id: `art:${p.wiki}`,
    label: p.title,
    sublabel: p.artist,
  }));

  return streamDeck({
    pool: PAINTINGS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `art:${seed.wiki}`,
      answer: { id: `art:${seed.wiki}`, label: seed.title, sublabel: seed.artist },
      payload: {
        src: info.image,
        srcFull: info.imageFull,
        title: seed.title,
        artist: seed.artist,
      } satisfies PaintingPayload,
    }),
    emptyError: 'Could not reach Wikipedia for artwork images.',
  });
}

export const paintingGame: GameDef = {
  slug: 'painting',
  title: 'Guess the Painting',
  short: 'Painting',
  tagline: 'Start with one brushstroke.',
  blurb:
    'The most famous canvases in the world, shown at sixteen times life size. Somewhere in that patch of colour is a face everyone knows.',
  emoji: '🖼️',
  accent: '#8A4E23',
  guess: 'search',
  levels: ['16×', '9×', '5×', '2.8×', '1.6×'],
  skipLabel: 'Step back',
  needsNetwork: true,
  rounds: 10,
  keywords: ['art','artwork','canvas','museum','gallery','zoom'],
  prefetch: (round) => { const p = round.payload as PaintingPayload | undefined; if (p?.src) new Image().src = p.src; },
  loadDeck,
  Stage: PaintingStage,
};
