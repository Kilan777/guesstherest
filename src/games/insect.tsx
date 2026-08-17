import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { INSECTS } from '../content/data/insects';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/**
 * Gentler than the other zoom games. These are macro shots to begin with, so a
 * fourteen-times crop of one is abstract before the ladder does anything — ten
 * still lands on a single eye or one segment of leg, which is enough.
 */
const SCALES = [6, 4, 2.8, 1.8, 1.2];

type InsectPayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  kind: string;
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
      } satisfies InsectPayload,
    }),
    emptyError: 'Could not reach Wikipedia for insect photographs.',
  });
}

export const insectGame: GameDef = {
  slug: 'insect',
  title: 'Guess the Insect',
  short: 'Insect',
  tagline: 'Name the insect from a close crop of it.',
  blurb:
    'Butterflies, beetles, bees and ants, plus a few spiders and scorpions, photographed close and then cropped closer. The ladder starts gentler than the other zoom games, because a macro shot is already abstract before you magnify it.',
  emoji: '🦋',
  accent: '#7B6212',
  guess: 'search',
  levels: ['6×', '4×', '2.8×', '1.8×', '1.2×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['insect', 'insects', 'bug', 'bugs', 'beetle', 'butterfly', 'spider', 'entomology', 'zoom'],
  prefetch: (round) => {
    const p = round.payload as InsectPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: InsectStage,
};
