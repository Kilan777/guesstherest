import type { GameMeta } from '../engine/types';

export const sportMeta: GameMeta = {
  slug: 'sport',
  title: 'Guess the Sport',
  short: 'Sport',
  tagline: 'Name the sport from a close crop of the action.',
  blurb:
    'One frame of play, cropped down to a patch of kit or a line on the ground. Olympic events and the games that are huge in one country and unheard of in the next. The surface tends to give it away before the ball does.',
  emoji: '🏅',
  accent: '#2F6B3D',
  guess: 'search',
  levels: ['7×', '4×', '2.4×', '1.4×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['sports','games','olympic','athletics','ball','zoom'],
};
