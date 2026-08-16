import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { OBJECTS } from '../content/data/objects';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

const SCALES = [11, 6.5, 3.8, 2.2, 1.4];

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
  slug: 'object',
  title: 'Guess the Object',
  short: 'Object',
  tagline: 'Eleven times too close.',
  blurb:
    'An everyday thing, photographed and then magnified until it is abstract. Pull back one step at a time until you recognise it — or admit defeat and pull back again.',
  emoji: '🔍',
  accent: '#4cc9f0',
  guess: 'search',
  levels: ['11×', '6.5×', '3.8×', '2.2×', '1.4×'],
  skipLabel: 'Zoom out',
  needsNetwork: false,
  rounds: 10,
  keywords: ['thing','zoom','photo','item','macro','close up'],
  prefetch: (round) => { const p = round.payload as ObjectPayload | undefined; if (p?.src) new Image().src = p.src; },
  loadDeck,
  Stage: ObjectStage,
};
