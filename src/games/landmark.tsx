import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { landmarkMeta } from './landmark.meta';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/** Buildings survive a shallower crop than paintings — brick reads as brick. */
const SCALES = [7, 4.5, 3, 2, 1.3];

type LandmarkPayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  where: string;
};

function LandmarkStage({ round, level, revealed }: StageProps) {
  const p = round.payload as LandmarkPayload;
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
  const { LANDMARKS } = await import('../content/data/landmarks');
  const catalog: Option[] = LANDMARKS.map((l) => ({
    id: `landmark:${l.wiki}`,
    label: l.label,
    sublabel: l.where,
  }));

  return streamDeck({
    pool: LANDMARKS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `landmark:${seed.wiki}`,
      answer: { id: `landmark:${seed.wiki}`, label: seed.label, sublabel: seed.where },
      payload: {
        src: info.image,
        srcFull: info.imageFull,
        label: seed.label,
        where: seed.where,
      } satisfies LandmarkPayload,
    }),
    emptyError: 'Could not reach Wikipedia for landmark photographs.',
  });
}

export const landmarkGame: GameDef = {
  ...landmarkMeta,
  prefetch: (round) => {
    const p = round.payload as LandmarkPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: LandmarkStage,
};
