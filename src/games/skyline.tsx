import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { skylineMeta } from './skyline.meta';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/**
 * Shallower than the painting ladder. City photographs are usually montages, so
 * a 16× crop lands inside a single pane of glass and tells you nothing at all.
 */
const SCALES = [6, 4, 2.8, 1.8, 1.2];

type SkylinePayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  country: string;
};

function SkylineStage({ round, level, revealed }: StageProps) {
  const p = round.payload as SkylinePayload;
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
          <span>{p.country}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { SKYLINES } = await import('../content/data/skylines');
  const catalog: Option[] = SKYLINES.map((c) => ({
    id: `city:${c.wiki}`,
    label: c.label,
    sublabel: c.country,
  }));

  return streamDeck({
    pool: SKYLINES,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `city:${seed.wiki}`,
      answer: { id: `city:${seed.wiki}`, label: seed.label, sublabel: seed.country },
      payload: {
        src: info.image,
        srcFull: info.imageFull,
        label: seed.label,
        country: seed.country,
      } satisfies SkylinePayload,
    }),
    emptyError: 'Could not reach Wikipedia for city photographs.',
  });
}

export const skylineGame: GameDef = {
  ...skylineMeta,
  prefetch: (round) => {
    const p = round.payload as SkylinePayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: SkylineStage,
};
