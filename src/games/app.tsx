import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { APPS } from '../content/data/apps';
import { findApp } from '../content/itunes';
import { streamDeck } from '../content/deck';
import { normalize } from '../content/cache';
import { ZoomStage, focalOf } from './stages';

/**
 * Gentler than the painting ladder: App Store icons are only 512px square, so
 * anything past about 7× is a wall of interpolated mush rather than a puzzle.
 */
const SCALES = [7, 4.5, 3, 2, 1.3];

type AppPayload = { artwork: string; name: string; detail: string };

const seedId = (name: string) => `app:${normalize(name)}`;

function AppStage({ round, level, revealed }: StageProps) {
  const p = round.payload as AppPayload;
  return (
    <ZoomStage
      src={p.artwork}
      scales={SCALES}
      level={level}
      revealed={revealed}
      focal={focalOf(round.id)}
      caption={
        <>
          <strong>{p.name}</strong>
          <span>{p.detail}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const catalog: Option[] = APPS.map((a) => ({
    id: seedId(a.name),
    label: a.name,
    sublabel: a.seller,
  }));

  return streamDeck({
    pool: APPS,
    count,
    rng,
    catalog,
    eager: 2,
    concurrency: 2,
    resolve: async (seed) => {
      const app = await findApp(seed.name, seed.seller);
      return app?.artwork ? app : null;
    },
    toRound: (seed, app) => ({
      id: seedId(seed.name),
      answer: { id: seedId(seed.name), label: seed.name, sublabel: seed.seller, image: app.artwork },
      payload: {
        artwork: app.artwork,
        name: seed.name,
        detail: app.genre || seed.seller,
      } satisfies AppPayload,
    }),
    emptyError: 'Could not reach the App Store icon catalog.',
  });
}

export const appGame: GameDef = {
  slug: 'app',
  title: 'Guess the App',
  short: 'App',
  tagline: 'Seven times into the icon.',
  blurb:
    'An app icon from the home screen everyone has, magnified until it is four colours and a curve. Each skip pulls the camera back one step.',
  emoji: '📱',
  accent: '#5B3E8C',
  guess: 'search',
  levels: ['7×', '4.5×', '3×', '2×', '1.3×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['icon', 'phone', 'store', 'software', 'logo', 'zoom'],
  prefetch: (round) => { const p = round.payload as AppPayload | undefined; if (p?.artwork) new Image().src = p.artwork; },
  loadDeck,
  Stage: AppStage,
};
