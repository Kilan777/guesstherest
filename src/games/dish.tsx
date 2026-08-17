import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { dishMeta } from './dish.meta';
import { pageInfo, type ImageCredit } from '../content/wikipedia';
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
  /** Attribution for the photograph, shown on the reveal. */
  credit: ImageCredit | null;
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
      credit={p.credit}
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
        credit: info.credit,
      } satisfies DishPayload,
    }),
    emptyError: 'Could not reach Wikipedia for food photography.',
  });
}

export const dishGame: GameDef = {
  ...dishMeta,
  prefetch: (round) => {
    const p = round.payload as DishPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: DishStage,
};
