import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { VIDEO_GAMES } from '../content/data/videogames';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { TileStage } from './stages';

const COLS = 6;
const ROWS = 8;
/** Tiles lifted at each rung, out of 48. */
const OPENED = [2, 6, 13, 24, 36];

type VideoGamePayload = { cover: string | null; label: string; year: number };

function VideoGameStage({ round, level, revealed }: StageProps) {
  const p = round.payload as VideoGamePayload;
  return (
    <TileStage
      src={p.cover}
      opened={OPENED}
      level={level}
      revealed={revealed}
      cols={COLS}
      rows={ROWS}
      seed={round.id}
      caption={
        <>
          <strong>{p.label}</strong>
          <span>{p.year}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const catalog: Option[] = VIDEO_GAMES.map((g) => ({
    id: `game:${g.wiki}`,
    label: g.label,
    sublabel: String(g.year),
  }));

  return streamDeck({
    pool: VIDEO_GAMES,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      // Box art is non-free media, hosted at a few hundred pixels wide. The
      // un-resized original is the sharpest thing on offer and costs nothing.
      return info?.imageFull ?? info?.image ?? null;
    },
    toRound: (seed, cover) => ({
      id: `game:${seed.wiki}`,
      answer: { id: `game:${seed.wiki}`, label: seed.label, sublabel: String(seed.year) },
      payload: { cover, label: seed.label, year: seed.year } satisfies VideoGamePayload,
    }),
    emptyError: 'Could not reach Wikipedia for game cover art.',
  });
}

export const videoGameGame: GameDef = {
  slug: 'videogame',
  title: 'Guess the Video Game',
  short: 'Video Game',
  tagline: 'Box art, two tiles at a time.',
  blurb:
    'Cover art from four decades of games, hidden behind forty-eight panels. The logo is usually the last thing to appear, so the art has to do the work.',
  emoji: '🕹️',
  accent: '#43378A',
  guess: 'search',
  levels: ['2 tiles', '6 tiles', '13 tiles', '24 tiles', '36 tiles'],
  skipLabel: 'Open more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['game', 'gaming', 'console', 'box art', 'cover', 'tiles'],
  prefetch: (round) => {
    const p = round.payload as VideoGamePayload | undefined;
    if (p?.cover) new Image().src = p.cover;
  },
  loadDeck,
  Stage: VideoGameStage,
};
