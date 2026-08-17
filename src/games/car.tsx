import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { carMeta } from './car.meta';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { BlurStage } from './stages';

/** Blur rather than zoom: a car is identified by its silhouette, and blurring
 *  is the one treatment that takes the badge and the panel gaps away while
 *  leaving the shape. */
const BLURS = [19, 11, 5, 2];
const SCALES = [1, 1, 1, 1];

type CarPayload = { src: string | null; label: string; era: string };

function CarStage({ round, level, revealed }: StageProps) {
  const p = round.payload as CarPayload;
  return (
    <BlurStage
      src={p.src}
      blurs={BLURS}
      scales={SCALES}
      aspect="landscape"
      fit="contain"
      level={level}
      revealed={revealed}
      caption={
        <>
          <strong>{p.label}</strong>
          <span>{p.era}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { CARS } = await import('../content/data/cars');
  const catalog: Option[] = CARS.map((c) => ({
    id: `car:${c.wiki}`,
    label: c.label,
    sublabel: c.era,
  }));

  return streamDeck({
    pool: CARS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `car:${seed.wiki}`,
      answer: { id: `car:${seed.wiki}`, label: seed.label, sublabel: seed.era },
      payload: {
        src: info.image,
        label: seed.label,
        era: seed.era,
      } satisfies CarPayload,
    }),
    emptyError: 'Could not reach Wikipedia for car photographs.',
  });
}

export const carGame: GameDef = {
  ...carMeta,
  prefetch: (round) => { const p = round.payload as CarPayload | undefined; if (p?.src) new Image().src = p.src; },
  loadDeck,
  Stage: CarStage,
};
