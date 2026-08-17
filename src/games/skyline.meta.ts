import type { GameMeta } from '../engine/types';

export const skylineMeta: GameMeta = {
  slug: 'skyline',
  title: 'Guess the City',
  short: 'City',
  tagline: 'Name the city from a piece of its skyline.',
  blurb:
    'A city photographed from a distance, then cropped down to a few windows. Pull back until the towers, the hills behind them or the water in front give the place away. Sixty cities, most of them outside Europe and North America.',
  emoji: '🌆',
  accent: '#14615F',
  guess: 'search',
  levels: ['6×', '4×', '2.8×', '1.8×', '1.2×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['city', 'skyline', 'cityscape', 'urban', 'geography', 'zoom'],
};
