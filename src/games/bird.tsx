import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { BIRDS } from '../content/data/birds';
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
  slug: 'bird',
  title: 'Guess the Bird',
  short: 'Bird',
  tagline: 'Name the bird from a patch of feathers.',
  blurb:
    'Eighty-odd birds from every continent, cropped down to a patch of plumage. Colour and barring narrow it down a rung or two before a beak or an eye comes into frame — which, for the ones that are mostly beak, is the whole game.',
  emoji: '🦜',
  accent: '#1F5F73',
  guess: 'search',
  levels: ['5×', '3.4×', '2.4×', '1.7×', '1.2×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['bird', 'birds', 'birding', 'feather', 'plumage', 'ornithology', 'species', 'zoom'],
  prefetch: (round) => {
    const p = round.payload as BirdPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: BirdStage,
};
