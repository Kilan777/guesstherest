/**
 * Emoji rebuses, split by category so the player can pick what they're good at.
 *
 * The trick is picking emoji that encode the *idea* rather than spelling the
 * title out — 🦁👑 is a puzzle, 🦁🤴👑👑 is just a label. The opening clue
 * should be genuinely hard; that's what the extra emoji are for.
 */
export type EmojiCategory = 'Movie' | 'Song' | 'Show' | 'Book';

export type EmojiSeed = {
  /** The opening clue: two or three emoji, deliberately cryptic. */
  e: string;
  /**
   * Two further emoji clues, revealed one per rung. Each should narrow things
   * down on its own — a setting, a character, an object, a plot beat.
   */
  more: [string, string];
  /** The answer, spelled the way a player would type it. */
  a: string;
  kind: EmojiCategory;
  /** Last-resort text clue, revealed on the final rung. */
  hint: string;
};
