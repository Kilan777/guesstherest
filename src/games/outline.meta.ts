import type { GameMeta } from '../engine/types';

export const outlineMeta: GameMeta = {
  slug: 'outline',
  title: 'Guess the Country by Outline',
  short: 'Outline',
  tagline: 'Name the country from the shape of it on a map.',
  blurb:
    'A map of one country behind a panel of twenty-four windows. Three open to start, which is usually one stretch of border and two of nothing. Coastline gives it away faster than anything inland does.',
  emoji: '🗺️',
  accent: '#4E6B1C',
  guess: 'search',
  levels: ['3 windows', '7 windows', '12 windows', '18 windows', '24 windows'],
  skipLabel: 'Open more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['country', 'map', 'outline', 'border', 'geography', 'world', 'shape'],
};
