import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { wordMeta } from './word.meta';
import type { WordSeed } from '../content/data/words';
import { streamDeck } from '../content/deck';
import { TextStage } from './stages';

type WordPayload = { word: string; definition: string; pos: string };

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * The ladder is deliberately mechanical: what kind of word it is and how long,
 * then the letter it starts with, then where it came from. Letter count is
 * measured off the word itself rather than typed into the seed file, because a
 * hand-counted "9 letters" that is wrong makes the round unwinnable.
 */
function hintsFor(seed: WordSeed): string[] {
  return [
    `${titleCase(seed.pos)}, ${seed.word.length} letters`,
    `Starts with ${seed.word.charAt(0).toUpperCase()}`,
    seed.hint,
  ];
}

function WordStage({ round, level, revealed }: StageProps) {
  const p = round.payload as WordPayload;
  return (
    <TextStage
      headline={p.definition}
      tone="quote"
      hints={round.hints ?? []}
      level={level}
      revealed={revealed}
      caption={
        <>
          <strong>{titleCase(p.word)}</strong>
          <span>{p.pos}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { WORDS } = await import('../content/data/words');
  // Every word in the file is in the guess list. That is the game: the answer
  // is somewhere in front of you and the definition is what narrows it down.
  const catalog: Option[] = WORDS.map((s) => ({
    id: `word:${s.word}`,
    label: titleCase(s.word),
    sublabel: s.pos,
  }));

  return streamDeck<WordSeed, WordSeed>({
    pool: WORDS,
    count,
    rng,
    catalog,
    // Nothing to fetch — build the whole deck before play starts.
    eager: count,
    resolve: async (seed) => seed,
    toRound: (seed) => ({
      id: `word:${seed.word}`,
      answer: { id: `word:${seed.word}`, label: titleCase(seed.word), sublabel: seed.pos },
      hints: hintsFor(seed),
      payload: {
        word: seed.word,
        definition: seed.definition,
        pos: seed.pos,
      } satisfies WordPayload,
    }),
    emptyError: 'Could not build a word deck.',
  });
}

export const wordGame: GameDef = {
  ...wordMeta,
  loadDeck,
  Stage: WordStage,
};
