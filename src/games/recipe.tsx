import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { RECIPES, type RecipeSeed } from '../content/data/recipes';
import { streamDeck } from '../content/deck';
import { TextStage } from './stages';

type RecipePayload = {
  dish: string;
  ingredients: string[];
  origin: string;
  hint: string;
};

/**
 * How much of the list each rung shows: half, three quarters, then all of it.
 * Derived from the length rather than hardcoded, so a seed with something other
 * than eight ingredients still divides sensibly.
 */
function shownCount(total: number, level: number): number {
  const steps = [Math.ceil(total / 2), Math.ceil((total * 3) / 4), total];
  return steps[Math.min(level, steps.length - 1)] ?? total;
}

function RecipeStage({ round, level, revealed }: StageProps) {
  const p = round.payload as RecipePayload;

  // The list grows rather than being replaced, and it is ordered so the boring
  // half comes first — salt and oil tell you nothing, which is the point. The
  // last two are what give the dish away.
  const shown = revealed ? p.ingredients.length : shownCount(p.ingredients.length, level);
  const headline = p.ingredients.slice(0, shown).join(', ');

  return (
    <TextStage
      headline={headline}
      tone="quote"
      // Every clue in this game is an ingredient; there is no written rung.
      hints={[]}
      level={0}
      revealed={revealed}
      caption={
        <>
          <strong>
            {p.dish} — {p.origin}
          </strong>
          <span>{p.hint}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  // The whole file is the guess list. Where it is from stays off the catalog on
  // purpose — the origin is part of the answer, not part of the search.
  const catalog: Option[] = RECIPES.map((s) => ({
    id: `recipe:${s.dish}`,
    label: s.dish,
  }));

  return streamDeck<RecipeSeed, RecipeSeed>({
    pool: RECIPES,
    count,
    rng,
    catalog,
    // Nothing to fetch — build the whole deck before play starts.
    eager: count,
    resolve: async (seed) => seed,
    toRound: (seed) => ({
      id: `recipe:${seed.dish}`,
      answer: { id: `recipe:${seed.dish}`, label: seed.dish },
      payload: {
        dish: seed.dish,
        ingredients: seed.ingredients,
        origin: seed.origin,
        hint: seed.hint,
      } satisfies RecipePayload,
    }),
    emptyError: 'Could not build a recipe deck.',
  });
}

export const recipeGame: GameDef = {
  slug: 'recipe',
  title: 'Guess the Recipe',
  short: 'Recipe',
  tagline: 'Name the dish from its ingredients.',
  blurb:
    'Half an ingredient list, ordered from the things every kitchen has to the one thing that gives the dish away. Skip and you get three quarters of it, then all eight. Salt and onion will not help you; what arrives at the end usually will.',
  emoji: '🥘',
  accent: '#B0551F',
  guess: 'search',
  levels: ['Half the ingredients', 'Three quarters', 'Everything'],
  skipLabel: 'Add more ingredients',
  needsNetwork: false,
  rounds: 10,
  keywords: ['food', 'recipe', 'cooking', 'ingredients', 'cuisine', 'dish', 'kitchen'],
  loadDeck,
  Stage: RecipeStage,
};
