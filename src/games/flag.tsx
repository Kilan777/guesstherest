import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { FLAGS } from '../content/data/flags';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { TileStage } from './stages';

/** Flags are landscape, so the grid is wider than it is tall. */
const COLS = 6;
const ROWS = 4;
/** Tiles lifted at each rung, out of 24. */
const OPENED = [2, 5, 9, 14, 20];

type FlagPayload = { flag: string | null; label: string };

function FlagStage({ round, level, revealed }: StageProps) {
  const p = round.payload as FlagPayload;
  return (
    <TileStage
      src={p.flag}
      opened={OPENED}
      level={level}
      revealed={revealed}
      cols={COLS}
      rows={ROWS}
      seed={round.id}
      conceal="hide"
      aspect="landscape"
      caption={<strong>{p.label}</strong>}
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const catalog: Option[] = FLAGS.map((f) => ({
    id: `flag:${f.wiki}`,
    label: f.label,
  }));

  return streamDeck({
    pool: FLAGS,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      // Flags are drawn as SVG, so the rasterised render is the one to show —
      // the original is vector and some browsers scale it badly inside a grid.
      return info?.image ?? info?.imageFull ?? null;
    },
    toRound: (seed, flag) => ({
      id: `flag:${seed.wiki}`,
      answer: { id: `flag:${seed.wiki}`, label: seed.label },
      payload: { flag, label: seed.label } satisfies FlagPayload,
    }),
    emptyError: 'Could not reach Wikipedia for flag images.',
  });
}

export const flagGame: GameDef = {
  slug: 'flag',
  title: 'Guess the Flag',
  short: 'Flag',
  tagline: 'Two tiles of twenty-four.',
  blurb:
    'A national flag behind a grid of panels. Two are open to start, and two panels of one colour narrow it down to about forty countries. Every skip opens a few more.',
  emoji: '🏳️',
  accent: '#26517E',
  guess: 'search',
  levels: ['2 tiles', '5 tiles', '9 tiles', '14 tiles', '20 tiles'],
  skipLabel: 'Open more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['flag', 'country', 'nation', 'geography', 'world', 'tiles'],
  prefetch: (round) => {
    const p = round.payload as FlagPayload | undefined;
    if (p?.flag) new Image().src = p.flag;
  },
  loadDeck,
  Stage: FlagStage,
};
