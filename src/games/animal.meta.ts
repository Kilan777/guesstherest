import type { GameMeta } from '../engine/types';

export const animalMeta: GameMeta = {
  slug: 'animal',
  title: 'Guess the Animal',
  short: 'Animal',
  tagline: 'Name the animal from a patch of fur, feather or scale.',
  blurb:
    'One patch of coat, feather or scale, magnified until it is just texture. Pull back a step at a time. Pattern narrows it down long before an eye or a beak appears.',
  emoji: '🦋',
  accent: '#2F6B3D',
  guess: 'search',
  levels: ['8×', '5×', '3.2×', '2×', '1.3×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['animal', 'wildlife', 'species', 'nature', 'zoo', 'zoom'],
};
