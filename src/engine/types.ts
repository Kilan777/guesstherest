import type { ComponentType } from 'react';

export type Option = {
  id: string;
  label: string;
  sublabel?: string;
  image?: string;
};

export type Round = {
  id: string;
  answer: Option;
  /** Choice mode: the buttons to show. Search mode uses `Deck.catalog` instead. */
  choices?: Option[];
  /** One extra clue unlocked per ladder step — used by games with no visual reveal. */
  hints?: string[];
  /** Whatever the game's Stage component needs (audio url, poster url, …). */
  payload?: unknown;
  /** Year mode only. */
  year?: number;
};

export type Deck = {
  /** Rounds ready to play right now — may be fewer than `expected`. */
  rounds: Round[];
  /** Search mode: the full list the player can type against. */
  catalog: Option[];
  /** How many rounds the finished deck will hold. Defaults to `rounds.length`. */
  expected?: number;
  /** Rounds still being fetched; appended to `rounds` when they land. */
  rest?: Promise<Round[]>;
  /**
   * Delivers each streamed round the moment it resolves, rather than making the
   * player wait for the whole tail. Rounds that landed before you subscribed are
   * replayed immediately, so warming a deck early never loses any. Returns an
   * unsubscribe function.
   */
  subscribe?: (fn: (round: Round) => void) => () => void;
};

export type Outcome = 'won' | 'lost' | null;

export type StageProps = {
  round: Round;
  /** How many rungs of the reveal ladder have been burned (0 = hardest). */
  level: number;
  totalLevels: number;
  /** Round is over — show everything. */
  revealed: boolean;
  outcome: Outcome;
  accent: string;
};

export type GuessMode = 'search' | 'choice' | 'year';

export type GameOption = {
  id: string;
  label: string;
  emoji?: string;
  /** Shown under the label, e.g. how many puzzles the category holds. */
  blurb?: string;
};

/**
 * Everything the launcher needs to describe a game — and nothing that has to be
 * executed to play one. Each game keeps its own copy in a `<slug>.meta.ts`
 * sibling, which is what `src/games/index.ts` imports statically: the home page
 * can render all thirty cards without pulling in a single Stage component.
 */
export type GameMeta = {
  slug: string;
  title: string;
  /** Short name for tight spaces (nav, board headers). */
  short: string;
  tagline: string;
  blurb: string;
  emoji: string;
  accent: string;
  guess: GuessMode;
  /** Label per rung. Length = how many chances a round gives you. */
  levels: string[];
  /** Verb on the skip button, e.g. "Hear more". */
  skipLabel: string;
  /** False for games whose content is fully bundled. */
  needsNetwork: boolean;
  rounds: number;
  /**
   * Optional per-round countdown, in milliseconds. Time runs from the moment a
   * round starts and does not reset when you buy a rung — otherwise skipping
   * would be a way to buy more time as well as more information.
   */
  timeLimitMs?: number;
  yearRange?: [number, number];
  /** Extra words the home-page search should match on. */
  keywords?: string[];
  /**
   * Asked before the deck is built. The chosen id is handed to `loadDeck`, so a
   * game can offer variants — the emoji game uses it to pick a category, which
   * also decides what the guess list contains.
   */
  options?: { label: string; hint?: string; choices: GameOption[] };
};

/**
 * The metadata plus the code that plays the game. Only loaded once a game is
 * actually opened — see `loadGame` in `src/games/index.ts`.
 */
export type GameDef = GameMeta & {
  loadDeck: (count: number, rng: () => number, option?: string) => Promise<Deck>;
  /**
   * Pull the next round's media into cache while the current one is being
   * played, so advancing never waits on the network.
   */
  prefetch?: (round: Round) => void;
  Stage: ComponentType<StageProps>;
};
