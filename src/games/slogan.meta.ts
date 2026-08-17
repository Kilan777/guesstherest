import type { GameMeta } from '../engine/types';

export const sloganMeta: GameMeta = {
  slug: 'slogan',
  title: 'Guess the Slogan',
  short: 'Slogan',
  tagline: 'Name the brand behind an advertising line.',
  blurb:
    'An advertising line, quoted the way it actually ran, with the brand name taken out of it where there was one. Name the company that paid for it. Skips buy you the sector, roughly when it launched, then something about the campaign.',
  emoji: '📣',
  accent: '#B0551F',
  guess: 'search',
  levels: ['Cold', 'Sector', 'Era', 'Clue'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['slogan', 'advertising', 'brand', 'tagline', 'marketing', 'ad', 'company'],
};
