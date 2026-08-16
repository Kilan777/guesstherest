import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { INSTRUMENTS } from '../content/data/instruments';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/** Same ladder as the dish game — an instrument is mostly wood grain up close. */
const SCALES = [13, 7.5, 4.2, 2.4, 1.4];

type InstrumentPayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  family: string;
};

function InstrumentStage({ round, level, revealed }: StageProps) {
  const p = round.payload as InstrumentPayload;
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
          <span>{p.family}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const catalog: Option[] = INSTRUMENTS.map((i) => ({
    id: `inst:${i.wiki}`,
    label: i.label,
    sublabel: i.family,
  }));

  return streamDeck({
    pool: INSTRUMENTS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `inst:${seed.wiki}`,
      answer: { id: `inst:${seed.wiki}`, label: seed.label, sublabel: seed.family },
      payload: {
        src: info.image,
        srcFull: info.imageFull,
        label: seed.label,
        family: seed.family,
      } satisfies InstrumentPayload,
    }),
    emptyError: 'Could not reach Wikipedia for instrument photographs.',
  });
}

export const instrumentGame: GameDef = {
  slug: 'instrument',
  title: 'Guess the Instrument',
  short: 'Instrument',
  tagline: 'Thirteen times too close.',
  blurb:
    'One instrument, photographed and then magnified until it is just varnish, skin or brass. Orchestras, gamelans and folk traditions all in the same deck, so a length of turned wood could be a bassoon or a shakuhachi.',
  emoji: '🎻',
  accent: '#7B6212',
  guess: 'search',
  levels: ['13×', '7.5×', '4.2×', '2.4×', '1.4×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['instrument', 'music', 'orchestra', 'strings', 'percussion', 'zoom'],
  prefetch: (round) => {
    const p = round.payload as InstrumentPayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: InstrumentStage,
};
