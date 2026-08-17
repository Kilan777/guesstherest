import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { animalMeta } from './animal.meta';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/** Fourteen times in is usually one patch of coat, feather or scale. */
const SCALES = [8, 5, 3.2, 2, 1.3];

type AnimalPayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  note: string;
};

function AnimalStage({ round, level, revealed }: StageProps) {
  const p = round.payload as AnimalPayload;
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
          {p.note ? <span>{p.note}</span> : null}
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { ANIMALS } = await import('../content/data/animals');
  const catalog: Option[] = ANIMALS.map((a) => ({
    id: `animal:${a.wiki}`,
    label: a.label,
  }));

  return streamDeck({
    pool: ANIMALS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `animal:${seed.wiki}`,
      answer: { id: `animal:${seed.wiki}`, label: seed.label },
      payload: {
        src: info.image,
        srcFull: info.imageFull,
        label: seed.label,
        // Wikipedia's one-line description, e.g. "species of carnivore".
        note: info.description,
      } satisfies AnimalPayload,
    }),
    emptyError: 'Could not reach Wikipedia for animal photographs.',
  });
}

export const animalGame: GameDef = {
  ...animalMeta,
  prefetch: (round) => {
    const p = round.payload as AnimalPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: AnimalStage,
};
