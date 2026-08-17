import type { GameMeta } from '../engine/types';

export const plotMeta: GameMeta = {
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
};
