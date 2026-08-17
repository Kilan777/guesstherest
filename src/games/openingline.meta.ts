import type { GameMeta } from '../engine/types';

export const openingLineMeta: GameMeta = {
  slug: 'openingline',
  title: 'Guess the Opening Line',
  short: 'Opening',
  tagline: 'Name the novel from its first sentence.',
  blurb:
    'The first line of a famous novel, quoted exactly. Some give the whole book away in six words; some tell you nothing at all until you have spent a clue on the decade.',
  emoji: '📖',
  accent: '#4E3F80',
  guess: 'search',
  levels: ['Cold', 'Decade', 'About it', 'Author'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['book', 'novel', 'literature', 'reading', 'first line', 'author', 'quote'],
};
