import type { GameMeta } from '../engine/types';

export const landmarkMeta: GameMeta = {
  slug: 'landmark',
  title: 'Guess the Landmark',
  short: 'Landmark',
  tagline: 'Name the landmark from one fragment of stone.',
  blurb:
    'A place millions of people have photographed, cropped down to a patch of stone or steel. Pull back a step at a time until the shape gives it away.',
  emoji: '🗿',
  accent: '#7A4A24',
  guess: 'search',
  levels: ['7×', '4.5×', '3×', '2×', '1.3×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['landmark', 'monument', 'travel', 'geography', 'city', 'zoom'],
};
