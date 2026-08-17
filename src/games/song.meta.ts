import type { GameMeta } from '../engine/types';

export const songMeta: GameMeta = {
  slug: 'song',
  title: 'Guess the Song',
  short: 'Song',
  tagline: 'Name the song from as little of it as possible.',
  blurb:
    'You get 0.1 seconds of the track. Not enough? Trade points for more — half a second, a second and a half, three, five. Then name it.',
  emoji: '🎧',
  accent: '#9E2B3F',
  guess: 'search',
  levels: ['0.1s', '0.5s', '1.5s', '3s', '5s'],
  skipLabel: 'Hear more',
  needsNetwork: true,
  rounds: 10,
  keywords: ['music', 'audio', 'track', 'heardle', 'listen', 'tune'],
};
