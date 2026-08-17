import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { insectMeta } from './insect.meta';
import { pageInfo, type ImageCredit } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/**
 * Gentler than the other zoom games. These are macro shots to begin with, so a
 * fourteen-times crop of one is abstract before the ladder does anything — ten
 * still lands on a single eye or one segment of leg, which is enough.
 */
const SCALES = [4, 2.9, 2.1, 1.6, 1.15];

type InsectPayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  kind: string;
  /** Attribution for the photograph, shown on the reveal. */
  credit: ImageCredit | null;
};

function InsectStage({ round, level, revealed }: StageProps) {
  const p = round.payload as InsectPayload;
  return (
    <ZoomStage
      src={p.src}
      srcFallback={p.srcFull}
      fallbackEmoji="🦋"
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
  const { INSECTS } = await import('../content/data/insects');
  const catalog: Option[] = INSECTS.map((i) => ({
    id: `insect:${i.wiki}`,
    label: i.label,
  }));

  return streamDeck({
    pool: INSECTS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `insect:${seed.wiki}`,
      answer: { id: `insect:${seed.wiki}`, label: seed.label },
      payload: {
        src: info.image,
        srcFull: info.imageFull,
        label: seed.label,
        kind: seed.kind,
        credit: info.credit,
      } satisfies InsectPayload,
    }),
    emptyError: 'Could not reach Wikipedia for insect photographs.',
  });
}

export const insectGame: GameDef = {
  ...insectMeta,
  prefetch: (round) => {
    const p = round.payload as InsectPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: InsectStage,
};
