import type { GameMeta } from '../engine/types';

export const celebrityMeta: GameMeta = {
  slug: 'celebrity',
  title: 'Guess the Celebrity',
  short: 'Celebrity',
  tagline: 'Name the famous face as it comes into focus.',
  blurb:
    'Portraits of screen actors from the silent era to last year, blurred to a smudge. Hair and jawline come back first; the eyes are what settle it.',
  emoji: '🎭',
  accent: '#92315F',
  guess: 'search',
  levels: ['Soft', 'Nearly there', 'Almost sharp'],
  skipLabel: 'Sharpen',
  needsNetwork: true,
  rounds: 10,
  keywords: ['celebrity', 'famous', 'face', 'star', 'actor', 'musician', 'blur'],
};
