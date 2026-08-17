import type { GameMeta } from '../engine/types';

export const countryMeta: GameMeta = {
  slug: 'country',
  title: 'Guess the Country',
  short: 'Country',
  tagline: "Look around a street and work out which country you're in.",
  blurb:
    'A street somewhere on Earth, and thirty seconds to look around. The road markings, the signage, the plants and which side the cars are on will tell you more than the buildings do.',
  emoji: '🌐',
  accent: '#1F5136',
  guess: 'search',
  levels: ['Cold', 'Continent', 'Clue', 'First letter'],
  skipLabel: 'Give me a clue',
  needsNetwork: true,
  rounds: 8,
  // Looking around is the game; without a clock you can stand there all day.
  timeLimitMs: 30_000,
  keywords: ['country', 'geography', 'street view', 'map', 'world', 'travel', 'geo'],
};
