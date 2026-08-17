import type { GameMeta } from '../engine/types';

export const logoMeta: GameMeta = {
  slug: 'logo',
  title: 'Guess the Logo',
  short: 'Logo',
  tagline: 'Name the brand from a few windows of its logo.',
  blurb:
    'A company logo behind a panel of twenty-four windows. Two are open to start, which is usually a patch of flat colour and part of one letter. Wordmarks give themselves up early; the marks that are only a shape can take all five rungs.',
  emoji: '✳️',
  accent: '#A8531C',
  guess: 'search',
  levels: ['2 windows', '5 windows', '9 windows', '14 windows', '20 windows'],
  skipLabel: 'Open more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['logo', 'brand', 'company', 'trademark', 'wordmark', 'business', 'tiles'],
};
