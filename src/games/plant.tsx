import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { PLANTS } from '../content/data/plants';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/** Eleven times in is a vein, a thorn or one edge of a petal. */
const SCALES = [7, 4.5, 3, 2, 1.3];

type PlantPayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  kind: string;
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
      } satisfies PlantPayload,
    }),
    emptyError: 'Could not reach Wikipedia for plant photographs.',
  });
}

export const plantGame: GameDef = {
  slug: 'plant',
  title: 'Guess the Plant',
  short: 'Plant',
  tagline: 'Name the plant from a close crop of a leaf or a flower.',
  blurb:
    'Seventy trees, flowers, crops and oddities, magnified until they are just green. Leaf shape and bark do most of the work; the flower, if there is one, only shows up on the last rung or two.',
  emoji: '🌿',
  accent: '#2F6B3D',
  guess: 'search',
  levels: ['7×', '4.5×', '3×', '2×', '1.3×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['plant', 'plants', 'tree', 'trees', 'flower', 'botany', 'garden', 'leaf', 'zoom'],
  prefetch: (round) => {
    const p = round.payload as PlantPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: PlantStage,
};
