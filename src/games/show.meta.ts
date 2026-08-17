import type { GameMeta } from '../engine/types';

export const showMeta: GameMeta = {
  slug: 'show',
  title: 'Guess the TV Show',
  short: 'Intro',
  tagline: 'Name the series from the first second of its theme tune.',
  blurb:
    'Opening titles, sound only — the picture stays off, because the title card is in the video and would give it away. One second of the theme, then two, five, ten, twenty. Most of them you know by the second bar.',
  emoji: '📺',
  accent: '#1F5F6B',
  guess: 'search',
  levels: ['1s', '2s', '5s', '10s', '20s'],
  skipLabel: 'Hear more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['tv', 'series', 'intro', 'opening', 'titles', 'theme', 'tune', 'sitcom', 'television'],
};
