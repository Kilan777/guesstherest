import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { PLANETS } from '../content/data/planets';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { ZoomStage, focalOf } from './stages';

/**
 * Shallower than the other zoom games on purpose. Planetary surfaces are
 * low-contrast and mostly one colour, so a 16× crop of Callisto is a grey
 * rectangle with no information in it at all. Nine times is close enough to
 * hide the disc's outline — which is the real giveaway — while still leaving
 * craters and cloud bands on screen.
 */
const SCALES = [9, 5.5, 3.4, 2.1, 1.3];

type PlanetPayload = {
  src: string | null;
  srcFull: string | null;
  label: string;
  kind: string;
};

function PlanetStage({ round, level, revealed }: StageProps) {
  const p = round.payload as PlanetPayload;
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
          <span>{p.kind}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const catalog: Option[] = PLANETS.map((p) => ({
    id: `planet:${p.wiki}`,
    label: p.label,
    sublabel: p.kind,
  }));

  return streamDeck({
    pool: PLANETS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `planet:${seed.wiki}`,
      answer: { id: `planet:${seed.wiki}`, label: seed.label, sublabel: seed.kind },
      payload: {
        src: info.image,
        srcFull: info.imageFull,
        label: seed.label,
        kind: seed.kind,
      } satisfies PlanetPayload,
    }),
    emptyError: 'Could not reach Wikipedia for planetary images.',
  });
}

export const planetGame: GameDef = {
  slug: 'planet',
  title: 'Guess the Moon or Planet',
  short: 'Planet',
  tagline: 'A patch of somewhere else.',
  blurb:
    'Craters, cloud bands and ice, cropped so the outline of the disc is off screen. Planets, the larger moons, the dwarf planets, and the few asteroids and comets a spacecraft has been close enough to photograph.',
  emoji: '🪐',
  accent: '#43378A',
  guess: 'search',
  levels: ['9×', '5.5×', '3.4×', '2.1×', '1.3×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['space','solar system','astronomy','moon','asteroid','comet','zoom'],
  prefetch: (round) => { const p = round.payload as PlanetPayload | undefined; if (p?.src) new Image().src = p.src; },
  loadDeck,
  Stage: PlanetStage,
};
