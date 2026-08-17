import type { GameMeta } from '../engine/types';

export const sceneMeta: GameMeta = {
  slug: 'scene',
  title: 'Guess the Movie',
  short: 'Scene',
  tagline: 'Name the film from a single second of footage.',
  blurb:
    'A single second from somewhere in the middle of the trailer. Skip for two, four, eight, fifteen. The trick is that one second is almost always enough — you just have to trust it.',
  emoji: '🎬',
  accent: '#A8531C',
  guess: 'search',
  levels: ['1s', '2s', '4s', '8s', '15s'],
  skipLabel: 'Roll more',
  needsNetwork: true,
  rounds: 8,
  keywords: ['movie', 'film', 'trailer', 'clip', 'cinema', 'video'],
};
