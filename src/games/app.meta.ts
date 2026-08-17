import type { GameMeta } from '../engine/types';

export const appMeta: GameMeta = {
  slug: 'app',
  title: 'Guess the App',
  short: 'App',
  tagline: 'Name the app as its icon comes into focus.',
  blurb:
    'An app icon from the home screen everyone has, magnified until it is four colours and a curve. Each skip pulls the camera back one step.',
  emoji: '📱',
  accent: '#5B3E8C',
  guess: 'search',
  levels: ['Smudge', 'Blurry', 'Soft', 'Nearly there', 'Almost sharp'],
  skipLabel: 'Sharpen',
  needsNetwork: true,
  rounds: 10,
  keywords: ['icon', 'phone', 'store', 'software', 'logo', 'zoom'],
};
