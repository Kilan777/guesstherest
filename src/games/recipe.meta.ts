import type { GameMeta } from '../engine/types';

export const recipeMeta: GameMeta = {
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
};
