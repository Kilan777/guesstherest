import type { GameMeta } from '../engine/types';

export const birdMeta: GameMeta = {
  slug: 'bird',
  title: 'Guess the Bird',
  short: 'Bird',
  tagline: 'Name the bird from a patch of feathers.',
  blurb:
    'Eighty-odd birds from every continent, cropped down to a patch of plumage. Colour and barring narrow it down a rung or two before a beak or an eye comes into frame — which, for the ones that are mostly beak, is the whole game.',
  emoji: '🦜',
  accent: '#1F5F73',
  guess: 'search',
  levels: ['5×', '3.4×', '2.4×', '1.7×', '1.2×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['bird', 'birds', 'birding', 'feather', 'plumage', 'ornithology', 'species', 'zoom'],
};
