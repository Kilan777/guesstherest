import type { GameMeta } from '../engine/types';

export const boardgameMeta: GameMeta = {
  slug: 'boardgame',
  title: 'Guess the Board Game',
  short: 'Board game',
  tagline: 'Name the board game from a few windows of the box.',
  blurb:
    'Box art and boards from five thousand years of the genre, behind a blur with a few sharp windows cut into it. Modern games give up their logo early; the old ones are a wooden grid and a handful of pieces, and could be any of six.',
  emoji: '🎲',
  accent: '#92315F',
  guess: 'search',
  levels: ['2 windows', '6 windows', '13 windows', '24 windows', '36 windows'],
  skipLabel: 'Open more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['board game', 'boardgame', 'tabletop', 'card game', 'box art', 'games'],
};
