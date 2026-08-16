import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { MOVIES } from '../content/data/movies';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { TileStage } from './stages';

const COLS = 6;
const ROWS = 8;
/** Tiles lifted at each rung, out of 48. */
const OPENED = [2, 6, 13, 24, 36];

type PosterPayload = { poster: string | null; title: string; year: number };

function PosterStage({ round, level, revealed }: StageProps) {
  const p = round.payload as PosterPayload;
  return (
    <TileStage
      src={p.poster}
      opened={OPENED}
      level={level}
      revealed={revealed}
      cols={COLS}
      rows={ROWS}
      seed={round.id}
      caption={
        <>
          <strong>{p.title}</strong>
          <span>{p.year}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const catalog: Option[] = MOVIES.map((m) => ({
    id: `poster:${m.wiki}`,
    label: m.title,
    sublabel: String(m.year),
  }));

  return streamDeck({
    pool: MOVIES,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      // Fair-use posters are small; the un-resized original is the sharpest
      // thing available and still only a few tens of kilobytes.
      return info?.imageFull ?? info?.image ?? null;
    },
    toRound: (seed, poster) => ({
      id: `poster:${seed.wiki}`,
      answer: { id: `poster:${seed.wiki}`, label: seed.title, sublabel: String(seed.year) },
      payload: { poster, title: seed.title, year: seed.year } satisfies PosterPayload,
    }),
    emptyError: 'Could not reach Wikipedia for poster art.',
  });
}

export const posterGame: GameDef = {
  slug: 'poster',
  title: 'Guess the Poster',
  short: 'Poster',
  tagline: 'Two tiles of forty-eight.',
  blurb:
    'A film poster behind a wall of tiles. Two are open to start. Every skip lifts a few more — but the good ones are rarely the ones you need.',
  emoji: '🍿',
  accent: '#ef476f',
  guess: 'search',
  levels: ['2 tiles', '6 tiles', '13 tiles', '24 tiles', '36 tiles'],
  skipLabel: 'Open more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['movie', 'film', 'poster', 'cinema', 'tiles', 'artwork'],
  prefetch: (round) => {
    const p = round.payload as PosterPayload | undefined;
    if (p?.poster) new Image().src = p.poster;
  },
  loadDeck,
  Stage: PosterStage,
};
