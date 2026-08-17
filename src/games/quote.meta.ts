import type { GameMeta } from '../engine/types';

export const quoteMeta: GameMeta = {
  slug: 'quote',
  title: 'Guess Who Said It',
  short: 'Quote',
  tagline: 'Work out which famous person said it.',
  blurb:
    'A line somebody famous actually said — no internet misattributions here. Pick the face it belongs to. Stuck? Trade points for their field, their job, their initials.',
  emoji: '💬',
  accent: '#1F5136',
  guess: 'choice',
  levels: ['Cold', 'Field', 'Role', 'Initials'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['quote','saying','people','famous','who','history'],
};
