import type { GameMeta } from '../engine/types';

export const capitalMeta: GameMeta = {
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
};
