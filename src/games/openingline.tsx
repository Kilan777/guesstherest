import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { OPENING_LINES, type OpeningLineSeed } from '../content/data/openinglines';
import { streamDeck } from '../content/deck';
import { TextStage } from './stages';

type OpeningPayload = { line: string; title: string; author: string; year: number };

function decadeOf(year: number): string {
  return `${Math.floor(year / 10) * 10}s`;
}

function OpeningLineStage({ round, level, revealed }: StageProps) {
  const p = round.payload as OpeningPayload;
  return (
    <TextStage
      headline={`“${p.line}”`}
      tone="quote"
      hints={round.hints ?? []}
      level={level}
      revealed={revealed}
      caption={
        <>
          <strong>{p.title}</strong>
          <span>
            {p.author} · {p.year}
          </span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  // The catalog is every book in the file — the game is recognising the
  // sentence, not narrowing down a shortlist.
  const catalog: Option[] = OPENING_LINES.map((s) => ({
    id: `open:${s.title}`,
    label: s.title,
    sublabel: s.author,
  }));

  return streamDeck<OpeningLineSeed, OpeningLineSeed>({
    pool: OPENING_LINES,
    count,
    rng,
    catalog,
    eager: count,
    resolve: async (seed) => seed,
    toRound: (seed) => ({
      id: `open:${seed.title}`,
      answer: { id: `open:${seed.title}`, label: seed.title, sublabel: seed.author },
      hints: [
        `Published in the ${decadeOf(seed.year)}`,
        seed.about,
        `Written by ${seed.author}`,
      ],
      payload: {
        line: seed.line,
        title: seed.title,
        author: seed.author,
        year: seed.year,
      } satisfies OpeningPayload,
    }),
    emptyError: 'Could not build an opening-line deck.',
  });
}

export const openingLineGame: GameDef = {
  slug: 'openingline',
  title: 'Guess the Opening Line',
  short: 'Opening',
  tagline: 'The first sentence only.',
  blurb:
    'The first line of a famous novel, quoted exactly. Some give the whole book away in six words; some tell you nothing at all until you have spent a clue on the decade.',
  emoji: '📖',
  accent: '#9d4edd',
  guess: 'search',
  levels: ['Cold', 'Decade', 'About it', 'Author'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['book', 'novel', 'literature', 'reading', 'first line', 'author', 'quote'],
  loadDeck,
  Stage: OpeningLineStage,
};
