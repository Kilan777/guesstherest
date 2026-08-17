import type { GameMeta } from '../engine/types';

export const carMeta: GameMeta = {
  slug: 'car',
  title: 'Guess the Car',
  short: 'Car',
  tagline: 'Name the car from its blurred silhouette.',
  blurb:
    'Ninety years of cars, blurred until only the proportions are left. Each skip sharpens it. Roofline and glasshouse usually settle it two rungs before the badge is readable.',
  emoji: '🚗',
  accent: '#26517E',
  guess: 'search',
  levels: ['Blurry', 'Soft', 'Nearly there', 'Almost sharp'],
  skipLabel: 'Sharpen',
  needsNetwork: true,
  rounds: 10,
  keywords: ['cars','automobile','vehicle','motor','classic','blur'],
};
