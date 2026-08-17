import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { plantMeta } from './plant.meta';
import { pageInfo, type ImageCredit } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/** Eleven times in is a vein, a thorn or one edge of a petal. */
const SCALES = [7, 4.5, 3, 2, 1.3];

type PlantPayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  kind: string;
  /** Attribution for the photograph, shown on the reveal. */
  credit: ImageCredit | null;
};

function PlantStage({ round, level, revealed }: StageProps) {
  const p = round.payload as PlantPayload;
  return (
    <ZoomStage
      src={p.src}
      srcFallback={p.srcFull}
      fallbackEmoji="🌿"
      scales={SCALES}
      level={level}
      revealed={revealed}
      focal={focalOf(round.id)}
      credit={p.credit}
      caption={
        <>
          <strong>{p.label}</strong>
          {p.kind ? <span>{p.kind}</span> : null}
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { PLANTS } = await import('../content/data/plants');
  const catalog: Option[] = PLANTS.map((p) => ({
    id: `plant:${p.wiki}`,
    label: p.label,
  }));

  return streamDeck({
    pool: PLANTS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `plant:${seed.wiki}`,
      answer: { id: `plant:${seed.wiki}`, label: seed.label },
      payload: {
        src: info.image,
        srcFull: info.imageFull,
        label: seed.label,
        kind: seed.kind,
        credit: info.credit,
      } satisfies PlantPayload,
    }),
    emptyError: 'Could not reach Wikipedia for plant photographs.',
  });
}

export const plantGame: GameDef = {
  ...plantMeta,
  prefetch: (round) => {
    const p = round.payload as PlantPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: PlantStage,
};
