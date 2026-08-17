import type { GameMeta } from '../engine/types';

export const YEAR_MIN = 1930;
export const YEAR_MAX = new Date().getFullYear();

export const yearMeta: GameMeta = {
  slug: 'year',
  title: 'Guess the Year',
  short: 'Year',
  tagline: 'Guess the year a film came out.',
  blurb:
    'Name the year a film came out. Exact is full marks; one year off still pays 60%, two years 35%, three years 15%. Four and you have burned a rung.',
  emoji: '📅',
  accent: '#16665A',
  guess: 'year',
  levels: ['Cold', 'Description', 'Decade', 'Five-year window'],
  skipLabel: 'Narrow it down',
  needsNetwork: true,
  rounds: 10,
  yearRange: [YEAR_MIN, YEAR_MAX],
  keywords: ['movie', 'film', 'date', 'release', 'when', 'timeline'],
};
