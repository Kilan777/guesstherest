import type { GameMeta } from '../engine/types';

export const wordMeta: GameMeta = {
  slug: 'word',
  title: 'Guess the Word',
  short: 'Word',
  tagline: 'Name the word from its definition.',
  blurb:
    'A definition on screen and the word missing from it. Mostly vocabulary worth owning, with a few rarities that are only in here because somebody had to name the smell of rain on dry ground. Skips buy you the part of speech and the length, then the first letter, then where it came from.',
  emoji: '📕',
  accent: '#4E3F80',
  guess: 'search',
  levels: ['Cold', 'Type', 'First letter', 'Origin'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['word', 'vocabulary', 'definition', 'dictionary', 'english', 'meaning', 'etymology'],
};
