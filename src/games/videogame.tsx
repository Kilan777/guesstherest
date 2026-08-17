import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { videoGameMeta } from './videogame.meta';
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
      // The lead image on a game's article is usually box art, but by no means
      // always: of 62 titles here, 51 are portrait, 4 square and 7 landscape,
      // running from 0.60:1 up to League of Legends' 2.6:1 and Pokemon Red and
      // Blue's 3:1 wordmark. A 2:3 cover frame threw away three quarters of
      // those two and half of the 1.4:1 ones, magnifying what was left until a
      // round was two letters of a word. The frame is shaped to whatever the
      // round actually loaded instead, and `contain` guarantees the rest.
      aspect="auto"
      fit="contain"
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
  const { VIDEO_GAMES } = await import('../content/data/videogames');
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
  ...videoGameMeta,
  prefetch: (round) => {
    const p = round.payload as VideoGamePayload | undefined;
    if (p?.cover) new Image().src = p.cover;
  },
  loadDeck,
  Stage: VideoGameStage,
};
