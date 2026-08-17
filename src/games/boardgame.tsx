import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { TileStage } from './stages';

/** Box art is portrait-ish, so the grid is taller than it is wide. */
const COLS = 6;
const ROWS = 8;
/** Windows cut at each rung, out of 48. */
const OPENED = [2, 6, 13, 24, 36];

type BoardGamePayload = { box: string | null; label: string; year: number };

/** Four of these predate the calendar most people use. */
function displayYear(year: number): string {
  return year < 0 ? `c. ${-year} BC` : String(year);
}

function BoardGameStage({ round, level, revealed }: StageProps) {
  const p = round.payload as BoardGamePayload;
  return (
    <TileStage
      src={p.box}
      opened={OPENED}
      level={level}
      revealed={revealed}
      cols={COLS}
      rows={ROWS}
      seed={round.id}
      fit="contain"
      caption={
        <>
          <strong>{p.label}</strong>
          <span>{displayYear(p.year)}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { BOARDGAMES } = await import('../content/data/boardgames');
  const catalog: Option[] = BOARDGAMES.map((g) => ({
    id: `bg:${g.wiki}`,
    label: g.label,
    sublabel: displayYear(g.year),
  }));

  return streamDeck({
    pool: BOARDGAMES,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      // Box art is non-free media uploaded at whatever size the uploader had, so
      // the /thumb/ render this width is frequently missing. Ask for the
      // original first — it is small to begin with.
      return info?.imageFull ?? info?.image ?? null;
    },
    toRound: (seed, box) => ({
      id: `bg:${seed.wiki}`,
      answer: { id: `bg:${seed.wiki}`, label: seed.label, sublabel: displayYear(seed.year) },
      payload: { box, label: seed.label, year: seed.year } satisfies BoardGamePayload,
    }),
    emptyError: 'Could not reach Wikipedia for board game images.',
  });
}

export const boardgameGame: GameDef = {
  slug: 'boardgame',
  title: 'Guess the Board Game',
  short: 'Board game',
  tagline: 'Name the board game from a few windows of the box.',
  blurb:
    'Box art and boards from five thousand years of the genre, behind a blur with a few sharp windows cut into it. Modern games give up their logo early; the old ones are a wooden grid and a handful of pieces, and could be any of six.',
  emoji: '🎲',
  accent: '#92315F',
  guess: 'search',
  levels: ['2 windows', '6 windows', '13 windows', '24 windows', '36 windows'],
  skipLabel: 'Open more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['board game', 'boardgame', 'tabletop', 'card game', 'box art', 'games'],
  prefetch: (round) => {
    const p = round.payload as BoardGamePayload | undefined;
    if (p?.box) new Image().src = p.box;
  },
  loadDeck,
  Stage: BoardGameStage,
};
