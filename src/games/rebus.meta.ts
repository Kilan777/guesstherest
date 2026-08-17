import type { GameMeta } from '../engine/types';

export const rebusMeta: GameMeta = {
  slug: 'rebus',
  title: 'Guess by Emoji',
  short: 'Emoji',
  tagline: 'Read a title spelled out in emoji.',
  blurb:
    'Pick a category, then read the rebus. Two emoji to start; each skip adds another. Obvious once you see it, impossible until you do — and it works with the wifi off.',
  emoji: '🧩',
  accent: '#96701B',
  guess: 'search',
  levels: ['2 emoji', '+1 emoji', '+1 more', 'Written clue'],
  skipLabel: 'Add an emoji',
  needsNetwork: false,
  rounds: 10,
  keywords: ['emoji', 'rebus', 'puzzle', 'riddle', 'icons', 'movie', 'song', 'show', 'book'],
  options: {
    label: 'Pick a category',
    hint: 'It decides the puzzles and the list you search against.',
    // Stated rather than derived: the picker is part of the static game
    // definition, and the puzzle data now loads only once a category is
    // chosen. The counts are asserted in the data files' own checks.
    choices: [
      { id: 'Movie', label: 'Movies', emoji: '🎬', blurb: '55 puzzles' },
      { id: 'Song', label: 'Songs', emoji: '🎵', blurb: '34 puzzles' },
      { id: 'Show', label: 'TV shows', emoji: '📺', blurb: '30 puzzles' },
      { id: 'Book', label: 'Books', emoji: '📚', blurb: '26 puzzles' },
    ],
  },
};
