import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/** Shallower than the painting deck — food is texture all the way down, and a
 *  16× crop of a curry is the same brown for everybody. */
const SCALES = [4.2, 2.4, 1.5, 1];

type DishPayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  where: string;
};

function DishStage({ round, level, revealed }: StageProps) {
  const p = round.payload as DishPayload;
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
          <strong>{p.label}</strong>
          <span>{p.where}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { DISHES } = await import('../content/data/dishes');
  const catalog: Option[] = DISHES.map((d) => ({
    id: `dish:${d.wiki}`,
    label: d.label,
    sublabel: d.where,
  }));

  return streamDeck({
    pool: DISHES,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `dish:${seed.wiki}`,
      answer: { id: `dish:${seed.wiki}`, label: seed.label, sublabel: seed.where },
      payload: {
        src: info.image,
        srcFull: info.imageFull,
        label: seed.label,
        where: seed.where,
      } satisfies DishPayload,
    }),
    emptyError: 'Could not reach Wikipedia for food photography.',
  });
}

export const dishGame: GameDef = {
  slug: 'dish',
  title: 'Guess the Dish',
  short: 'Dish',
  tagline: 'Name the dish from a close crop of the plate.',
  blurb:
    'Plates from every cuisine that travels, zoomed until they are just texture. A grain of rice, a bit of sauce, and the country it came from.',
  emoji: '🍜',
  accent: '#B0551F',
  guess: 'search',
  levels: ['4.2×', '2.4×', '1.5×', 'Full plate'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['food', 'cuisine', 'cooking', 'meal', 'recipe', 'zoom'],
  prefetch: (round) => {
    const p = round.payload as DishPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: DishStage,
};
