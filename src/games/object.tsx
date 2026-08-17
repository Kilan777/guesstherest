import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { objectMeta } from './object.meta';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

const SCALES = [6.5, 4.3, 2.9, 2, 1.35];

type ObjectPayload = {
  src: string | null;
  srcFull: string | null;
  emoji: string;
  label: string;
  description: string;
};

function ObjectStage({ round, level, revealed }: StageProps) {
  const p = round.payload as ObjectPayload;
  return (
    <ZoomStage
      src={p.src}
      srcFallback={p.srcFull}
      fallbackEmoji={p.emoji}
      scales={SCALES}
      level={level}
      revealed={revealed}
      focal={focalOf(round.id)}
      caption={
        <>
          <strong>{p.label}</strong>
          {p.description && <span>{p.description}</span>}
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { OBJECTS } = await import('../content/data/objects');
  const catalog: Option[] = OBJECTS.map((o) => ({ id: `obj:${o.wiki}`, label: o.label }));

  return streamDeck({
    pool: OBJECTS,
    count,
    rng,
    catalog,
    // Wikipedia failures aren't fatal here — the wrapper is never null, so a
    // missed lookup still yields an emoji stand-in round, which is what makes
    // this the game that survives a dead network.
    resolve: async (seed) => ({ info: await pageInfo(seed.wiki) }),
    toRound: (seed, { info }) => ({
      id: `obj:${seed.wiki}`,
      answer: { id: `obj:${seed.wiki}`, label: seed.label },
      payload: {
        src: info?.image ?? null,
        srcFull: info?.imageFull ?? null,
        emoji: seed.emoji,
        label: seed.label,
        description: info?.description ?? '',
      } satisfies ObjectPayload,
    }),
    eager: 2,
    concurrency: 4,
    emptyError: 'Could not build an object deck.',
  });
}

export const objectGame: GameDef = {
  ...objectMeta,
  prefetch: (round) => { const p = round.payload as ObjectPayload | undefined; if (p?.src) new Image().src = p.src; },
  loadDeck,
  Stage: ObjectStage,
};
