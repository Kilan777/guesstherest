import type { GameMeta } from '../engine/types';

export const plantMeta: GameMeta = {
  slug: 'plant',
  title: 'Guess the Plant',
  short: 'Plant',
  tagline: 'Name the plant from a close crop of a leaf or a flower.',
  blurb:
    'Seventy trees, flowers, crops and oddities, magnified until they are just green. Leaf shape and bark do most of the work; the flower, if there is one, only shows up on the last rung or two.',
  emoji: '🌿',
  accent: '#2F6B3D',
  guess: 'search',
  levels: ['7×', '4.5×', '3×', '2×', '1.3×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['plant', 'plants', 'tree', 'trees', 'flower', 'botany', 'garden', 'leaf', 'zoom'],
};
