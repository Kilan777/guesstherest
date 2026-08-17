import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import type { CapitalSeed } from '../content/data/capitals';
import { streamDeck } from '../content/deck';
import { sample, shuffle } from '../lib/rng';
import { TextStage } from './stages';

type CapitalPayload = { country: string; capital: string; region: string };

function CapitalStage({ round, level, revealed }: StageProps) {
  const p = round.payload as CapitalPayload;
  return (
    <TextStage
      headline={p.country}
      tone="quote"
      hints={round.hints ?? []}
      level={level}
      revealed={revealed}
      caption={
        <>
          <strong>{p.capital}</strong>
          <span>{p.region}</span>
        </>
      }
    />
  );
}

function toOption(seed: CapitalSeed): Option {
  return { id: `capital:${seed.capital}`, label: seed.capital, sublabel: seed.region };
}

/**
 * Three wrong capitals from the same part of the world. Mixing regions gives it
 * away: one South American city among three Asian ones is a process of
 * elimination, not a guess. Small regions get topped up from anywhere.
 */
function choicesFor(seed: CapitalSeed, pool: CapitalSeed[], rng: () => number): Option[] {
  const sameRegion = pool.filter((c) => c.region === seed.region && c.country !== seed.country);
  const decoys = sample(sameRegion, 3, rng);

  while (decoys.length < 3) {
    const filler = sample(
      pool.filter(
        (c) => c.country !== seed.country && !decoys.some((d) => d.country === c.country),
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
  const { CAPITALS } = await import('../content/data/capitals');
  return streamDeck<CapitalSeed, Option[]>({
    pool: CAPITALS,
    count,
    rng,
    catalog: [],
    // Nothing to fetch, so build the whole deck up front.
    eager: count,
    resolve: async (seed) => choicesFor(seed, CAPITALS, rng),
    toRound: (seed, choices) => ({
      id: `capital:${seed.country}`,
      answer: toOption(seed),
      choices,
      hints: [
        `Region: ${seed.region}`,
        `The city: ${seed.hint}`,
        `It starts with "${seed.capital[0] ?? '?'}"`,
      ],
      payload: {
        country: seed.country,
        capital: seed.capital,
        region: seed.region,
      } satisfies CapitalPayload,
    }),
    emptyError: 'Could not build a capitals deck.',
  });
}

export const capitalGame: GameDef = {
  slug: 'capital',
  title: 'Guess the Capital',
  short: 'Capital',
  tagline: "Pick a country's capital city.",
  blurb:
    'A country on screen and four capitals to choose from, all four from the same part of the world. Official capitals only, so the seat of government beats the city you have heard of. Skips buy you the region, a fact about the city, then its first letter.',
  emoji: '🌍',
  accent: '#1F5F73',
  guess: 'choice',
  levels: ['Cold', 'Region', 'Clue', 'First letter'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['capital', 'country', 'geography', 'city', 'world', 'atlas', 'flags'],
  loadDeck,
  Stage: CapitalStage,
};
