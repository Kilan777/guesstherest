import type { GameMeta } from '../engine/types';

export const dishMeta: GameMeta = {
  slug: 'dish',
  title: 'Guess the Dish',
  short: 'Dish',
  tagline: 'Name the dish from a close crop of the plate.',
  blurb:
    'Plates from every cuisine that travels, zoomed until they are just texture. A grain of rice, a bit of sauce, and the country it came from.',
  emoji: '🍜',
  accent: '#B0551F',
  guess: 'search',
  levels: ['4.2×', '2.4×', '1.5×', 'Full plate'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['food', 'cuisine', 'cooking', 'meal', 'recipe', 'zoom'],
};
