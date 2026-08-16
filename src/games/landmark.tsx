import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { LANDMARKS } from '../content/data/landmarks';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/** Buildings survive a shallower crop than paintings — brick reads as brick. */
const SCALES = [12, 7, 4, 2.4, 1.4];

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
  slug: 'landmark',
  title: 'Guess the Landmark',
  short: 'Landmark',
  tagline: 'Twelve times too close.',
  blurb:
    'A place millions of people have photographed, cropped down to a patch of stone or steel. Pull back a step at a time until the shape gives it away.',
  emoji: '🗿',
  accent: '#e07a5f',
  guess: 'search',
  levels: ['12×', '7×', '4×', '2.4×', '1.4×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['landmark', 'monument', 'travel', 'geography', 'city', 'zoom'],
  prefetch: (round) => {
    const p = round.payload as LandmarkPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: LandmarkStage,
};
