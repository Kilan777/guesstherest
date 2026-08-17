import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { appMeta } from './app.meta';
import { findApp } from '../content/itunes';
import { streamDeck } from '../content/deck';
import { normalize } from '../content/cache';
import { BlurStage } from './stages';

/**
 * Gentler than the painting ladder: App Store icons are only 512px square, so
 * anything past about 7× is a wall of interpolated mush rather than a puzzle.
 */
const BLURS = [80, 42, 20, 8, 1.5];
/**
 * The frame clips at its own edge, and a CSS blur samples transparency beyond
 * the image, so the first rungs need a real overscan — otherwise an 80px blur
 * fades the outer band of the icon into the frame background and the whole
 * thing reads as a vignette rather than an icon.
 */
const SCALES = [1.34, 1.18, 1.09, 1.04, 1.02];

type AppPayload = { artwork: string; name: string; detail: string };

const seedId = (name: string) => `app:${normalize(name)}`;

function AppStage({ round, level, revealed }: StageProps) {
  const p = round.payload as AppPayload;
  return (
    <BlurStage
      src={p.artwork}
      blurs={BLURS}
      scales={SCALES}
      level={level}
      revealed={revealed}
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
  const { APPS } = await import('../content/data/apps');
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
  ...appMeta,
  prefetch: (round) => { const p = round.payload as AppPayload | undefined; if (p?.artwork) new Image().src = p.artwork; },
  loadDeck,
  Stage: AppStage,
};
