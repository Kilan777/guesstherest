import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { SKYLINES } from '../content/data/skylines';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/**
 * Shallower than the painting ladder. City photographs are usually montages, so
 * a 16× crop lands inside a single pane of glass and tells you nothing at all.
 */
const SCALES = [10, 6, 3.6, 2.2, 1.3];

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
  slug: 'skyline',
  title: 'Guess the City',
  short: 'City',
  tagline: 'Ten times into the skyline.',
  blurb:
    'A city photographed from a distance, then cropped down to a few windows. Pull back until the towers, the hills behind them or the water in front give the place away. Sixty cities, most of them outside Europe and North America.',
  emoji: '🌆',
  accent: '#14615F',
  guess: 'search',
  levels: ['10×', '6×', '3.6×', '2.2×', '1.3×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['city', 'skyline', 'cityscape', 'urban', 'geography', 'zoom'],
  prefetch: (round) => {
    const p = round.payload as SkylinePayload | undefined;
    if (p?.src) new Image().src = p.src;
  },
  loadDeck,
  Stage: SkylineStage,
};
