import type { EmojiCategory, EmojiSeed } from './types';
import { EMOJI_MOVIES } from './movies';
import { EMOJI_SONGS } from './songs';
import { EMOJI_SHOWS } from './shows';
import { EMOJI_BOOKS } from './books';

export type { EmojiCategory, EmojiSeed } from './types';

export const EMOJI_BY_CATEGORY: Record<EmojiCategory, EmojiSeed[]> = {
  Movie: EMOJI_MOVIES,
  Song: EMOJI_SONGS,
  Show: EMOJI_SHOWS,
  Book: EMOJI_BOOKS,
};

/** Order shown in the category picker. */
export const EMOJI_CATEGORIES: { id: EmojiCategory; label: string; emoji: string }[] = [
  { id: 'Movie', label: 'Movies', emoji: '🎬' },
  { id: 'Song', label: 'Songs', emoji: '🎵' },
  { id: 'Show', label: 'TV shows', emoji: '📺' },
  { id: 'Book', label: 'Books', emoji: '📚' },
];

export function isEmojiCategory(value: string | undefined): value is EmojiCategory {
  return !!value && value in EMOJI_BY_CATEGORY;
}
