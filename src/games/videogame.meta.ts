import type { GameMeta } from '../engine/types';

export const videoGameMeta: GameMeta = {
  slug: 'videogame',
  title: 'Guess the Video Game',
  short: 'Video Game',
  tagline: 'Name the game from a few windows of its box art.',
  blurb:
    'Cover art from four decades of games, hidden behind forty-eight panels. The logo is usually the last thing to appear, so the art has to do the work.',
  emoji: '🕹️',
  accent: '#43378A',
  guess: 'search',
  levels: ['2 tiles', '6 tiles', '13 tiles', '24 tiles', '36 tiles'],
  skipLabel: 'Open more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['game', 'gaming', 'console', 'box art', 'cover', 'tiles'],
};
