import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { ELEMENTS, type ElementSeed } from '../content/data/elements';
import { streamDeck } from '../content/deck';
import { sample, shuffle } from '../lib/rng';
import { TextStage } from './stages';

type ElementPayload = { symbol: string; name: string; number: number; category: string };

function ElementStage({ round, level, revealed }: StageProps) {
  const p = round.payload as ElementPayload;
  return (
    <TextStage
      headline={p.symbol}
      tone="emoji"
      hints={round.hints ?? []}
      level={level}
      revealed={revealed}
      caption={
        <>
          <strong>{p.name}</strong>
          <span>
            {p.symbol} · number {p.number} · {p.category}
          </span>
        </>
      }
    />
  );
}

function toOption(seed: ElementSeed): Option {
  return { id: `element:${seed.symbol}`, label: seed.name };
}

/**
 * Two decoys from the answer's own category and one from outside it. All three
 * from the same category would make the category clue worthless — you would
 * already know it from the buttons — and all three from anywhere makes Iron
 * against Neon and Uranium a non-question.
 */
function choicesFor(seed: ElementSeed, rng: () => number): Option[] {
  const sameCategory = ELEMENTS.filter(
    (e) => e.category === seed.category && e.symbol !== seed.symbol,
  );
  const decoys = sample(sameCategory, 2, rng);

  const outside = sample(
    ELEMENTS.filter((e) => e.category !== seed.category),
    1,
    rng,
  );
  decoys.push(...outside);

  // Thin categories (the halogens are only four deep) can still come up short.
  while (decoys.length < 3) {
    const filler = sample(
      ELEMENTS.filter(
        (e) => e.symbol !== seed.symbol && !decoys.some((d) => d.symbol === e.symbol),
      ),
      1,
      rng,
    )[0];
    if (!filler) break;
    decoys.push(filler);
  }

  return shuffle([seed, ...decoys], rng).map(toOption);
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  return streamDeck<ElementSeed, Option[]>({
    pool: ELEMENTS,
    count,
    rng,
    catalog: [],
    // Nothing to fetch, so build the whole deck up front.
    eager: count,
    resolve: async (seed) => choicesFor(seed, rng),
    toRound: (seed, choices) => ({
      id: `element:${seed.symbol}`,
      answer: toOption(seed),
      choices,
      hints: [
        `Atomic number ${seed.number}`,
        `Category: ${seed.category}`,
        `You have met it here: ${seed.hint}`,
      ],
      payload: {
        symbol: seed.symbol,
        name: seed.name,
        number: seed.number,
        category: seed.category,
      } satisfies ElementPayload,
    }),
    emptyError: 'Could not build an elements deck.',
  });
}

export const elementGame: GameDef = {
  slug: 'element',
  title: 'Guess the Element',
  short: 'Element',
  tagline: 'One or two letters.',
  blurb:
    'A chemical symbol, blown up large, and four element names under it. The obvious ones are obvious; K, W, Sb and Sn are where it gets you. Skips buy the atomic number, then the category, then something you own that contains it.',
  emoji: '⚗️',
  accent: '#4E6B1C',
  guess: 'choice',
  levels: ['Symbol only', 'Atomic number', 'Category', 'Everyday use'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['element', 'periodic', 'table', 'chemistry', 'symbol', 'science', 'atom'],
  loadDeck,
  Stage: ElementStage,
};
