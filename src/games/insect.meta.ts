import type { GameMeta } from '../engine/types';

export const insectMeta: GameMeta = {
  slug: 'insect',
  title: 'Guess the Insect',
  short: 'Insect',
  tagline: 'Name the insect from a close crop of it.',
  blurb:
    'Butterflies, beetles, bees and ants, plus a few spiders and scorpions, photographed close and then cropped closer. The ladder starts gentler than the other zoom games, because a macro shot is already abstract before you magnify it.',
  emoji: '🦋',
  accent: '#7B6212',
  guess: 'search',
  levels: ['4×', '2.9×', '2.1×', '1.6×', '1.15×'],
  skipLabel: 'Zoom out',
  needsNetwork: true,
  rounds: 10,
  keywords: ['insect', 'insects', 'bug', 'bugs', 'beetle', 'butterfly', 'spider', 'entomology', 'zoom'],
};
