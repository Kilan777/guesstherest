import type { GameMeta } from '../engine/types';

export const objectMeta: GameMeta = {
  slug: 'object',
  title: 'Guess the Object',
  short: 'Object',
  tagline: 'Name an everyday object photographed far too close.',
  blurb:
    'An everyday thing, photographed and then magnified until it is abstract. Pull back one step at a time until you recognise it — or admit defeat and pull back again.',
  emoji: '🔍',
  accent: '#14615F',
  guess: 'search',
  levels: ['6.5×', '4.3×', '2.9×', '2×', '1.35×'],
  skipLabel: 'Zoom out',
  needsNetwork: false,
  rounds: 10,
  keywords: ['thing','zoom','photo','item','macro','close up'],
};
