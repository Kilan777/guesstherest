import type { GameMeta } from '../engine/types';

export const filmLineMeta: GameMeta = {
  slug: 'filmline',
  title: 'Guess the Film Line',
  short: 'Film line',
  tagline: 'Name the film a line of dialogue comes from.',
  blurb:
    'A line of film dialogue, quoted the way it is actually spoken rather than the way everyone repeats it. Name the film it comes from.',
  emoji: '🎞️',
  accent: '#7B6212',
  guess: 'search',
  levels: ['Cold', 'Decade', 'Setting', 'Who says it'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['movie', 'film', 'quote', 'line', 'dialogue', 'cinema', 'script'],
};
