import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { sportMeta } from './sport.meta';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/** Deep to start. Sport photographs are busy, so a twelve-times crop still
 *  lands on something — a boot, a line on the floor, a bit of kit. */
const SCALES = [7, 4, 2.4, 1.4];

type SportPayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  description: string;
};

function SportStage({ round, level, revealed }: StageProps) {
  const p = round.payload as SportPayload;
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
          {p.description ? <span>{p.description}</span> : null}
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { SPORTS } = await import('../content/data/sports');
  const catalog: Option[] = SPORTS.map((s) => ({
    id: `sport:${s.wiki}`,
    label: s.label,
  }));

  return streamDeck({
    pool: SPORTS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `sport:${seed.wiki}`,
      answer: { id: `sport:${seed.wiki}`, label: seed.label },
      payload: {
        src: info.image,
        srcFull: info.imageFull,
        label: seed.label,
        description: info.description,
      } satisfies SportPayload,
    }),
    emptyError: 'Could not reach Wikipedia for sport photographs.',
  });
}

export const sportGame: GameDef = {
  ...sportMeta,
  prefetch: (round) => { const p = round.payload as SportPayload | undefined; if (p?.src) new Image().src = p.src; },
  loadDeck,
  Stage: SportStage,
};
