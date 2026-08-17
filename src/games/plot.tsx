import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import type { PlotSeed } from '../content/data/plots';
import { streamDeck } from '../content/deck';
import { TextStage } from './stages';

type PlotPayload = { plot: string; title: string; year: number; genre: string };

function decadeOf(year: number): string {
  return `${Math.floor(year / 10) * 10}s`;
}

function PlotStage({ round, level, revealed }: StageProps) {
  const p = round.payload as PlotPayload;
  return (
    <TextStage
      headline={p.plot}
      tone="quote"
      hints={round.hints ?? []}
      level={level}
      revealed={revealed}
      caption={
        <>
          <strong>{p.title}</strong>
          <span>
            {p.genre} · {p.year}
          </span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { PLOTS } = await import('../content/data/plots');
  // The catalog is every film in the file — the game is recognising the story,
  // not narrowing down a shortlist.
  const catalog: Option[] = PLOTS.map((s) => ({
    id: `plot:${s.title}`,
    label: s.title,
    sublabel: String(s.year),
  }));

  return streamDeck<PlotSeed, PlotSeed>({
    pool: PLOTS,
    count,
    rng,
    catalog,
    eager: count,
    resolve: async (seed) => seed,
    toRound: (seed) => ({
      id: `plot:${seed.title}`,
      answer: { id: `plot:${seed.title}`, label: seed.title, sublabel: String(seed.year) },
      hints: [`Released in the ${decadeOf(seed.year)}`, `Genre: ${seed.genre}`, seed.hint],
      payload: {
        plot: seed.plot,
        title: seed.title,
        year: seed.year,
        genre: seed.genre,
      } satisfies PlotPayload,
    }),
    emptyError: 'Could not build a plots deck.',
  });
}

export const plotGame: GameDef = {
  slug: 'plot',
  title: 'Guess the Plot',
  short: 'Plot',
  tagline: 'Name the film from a deliberately flat plot summary.',
  blurb:
    'A famous film described in one flat sentence, with no names and nothing that makes it sound worth watching. Most films survive the treatment for about four words. Skips buy you the decade, the genre, then a fact about how it was made.',
  emoji: '🎬',
  accent: '#8C2F39',
  guess: 'search',
  levels: ['Cold', 'Decade', 'Genre', 'Clue'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['film', 'movie', 'plot', 'synopsis', 'summary', 'cinema', 'story'],
  loadDeck,
  Stage: PlotStage,
};
