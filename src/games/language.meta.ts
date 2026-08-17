import type { GameMeta } from '../engine/types';

export const languageMeta: GameMeta = {
  slug: 'language',
  title: 'Guess the Language',
  short: 'Language',
  tagline: 'Work out which language a sentence is written in.',
  blurb:
    'An ordinary sentence — where the station is, where the keys went — written in its own alphabet, and four languages to pick from. The four are always relatives, so telling Danish from Swedish is the job rather than telling Danish from Thai. Skips buy you the script, then the family, then where it is spoken.',
  emoji: '🗣️',
  accent: '#1F5F73',
  guess: 'choice',
  levels: ['Cold', 'Script', 'Family', 'Where'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['language', 'linguistics', 'alphabet', 'script', 'translation', 'world', 'writing'],
};
