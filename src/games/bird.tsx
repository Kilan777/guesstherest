import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { birdMeta } from './bird.meta';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/** Twelve times in is one patch of plumage — barb, bar and not much else. */
const SCALES = [5, 3.4, 2.4, 1.7, 1.2];

type BirdPayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  where: string;
};

function BirdStage({ round, level, revealed }: StageProps) {
  const p = round.payload as BirdPayload;
  return (
    <ZoomStage
      src={p.src}
      srcFallback={p.srcFull}
      fallbackEmoji="🦜"
      scales={SCALES}
      level={level}
      revealed={revealed}
      focal={focalOf(round.id)}
      caption={
        <>
          <strong>{p.label}</strong>
          {p.where ? <span>{p.where}</span> : null}
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { BIRDS } = await import('../content/data/birds');
  const catalog: Option[] = BIRDS.map((b) => ({
    id: `bird:${b.wiki}`,
    label: b.label,
  }));

  return streamDeck({
    pool: BIRDS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `bird:${seed.wiki}`,
      answer: { id: `bird:${seed.wiki}`, label: seed.label },
      payload: {
        src: info.image,
        srcFull: info.imageFull,
        label: seed.label,
        where: seed.where,
      } satisfies BirdPayload,
    }),
    emptyError: 'Could not reach Wikipedia for bird photographs.',
  });
}

export const birdGame: GameDef = {
  ...birdMeta,
  prefetch: (round) => {
    const p = round.payload as BirdPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: BirdStage,
};
