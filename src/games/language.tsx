import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { languageMeta } from './language.meta';
import type { LanguageSeed } from '../content/data/languages';
import { streamDeck } from '../content/deck';
import { sample, shuffle } from '../lib/rng';
import { TextStage } from './stages';

type LanguagePayload = { text: string; language: string; family: string; script: string };

function LanguageStage({ round, level, revealed }: StageProps) {
  const p = round.payload as LanguagePayload;
  return (
    <TextStage
      headline={p.text}
      tone="quote"
      hints={round.hints ?? []}
      level={level}
      revealed={revealed}
      caption={
        <>
          <strong>{p.language}</strong>
          <span>
            {p.family} · {p.script}
          </span>
        </>
      }
    />
  );
}

function toOption(seed: LanguageSeed): Option {
  return { id: `lang:${seed.language}`, label: seed.language, sublabel: seed.family };
}

/**
 * Three wrong languages from the same family. Mixing families hands the answer
 * over: one Romance language sitting among three East Asian ones is a matter of
 * looking at the alphabet, not of knowing anything. The small families — Greek,
 * Georgian, Basque and the rest have no close relatives in the file — get topped
 * up from anywhere, which is the best that can be done for a language with no
 * cousins.
 */
function choicesFor(seed: LanguageSeed, pool: LanguageSeed[], rng: () => number): Option[] {
  const sameFamily = pool.filter(
    (l) => l.family === seed.family && l.language !== seed.language,
  );
  const decoys = sample(sameFamily, 3, rng);

  while (decoys.length < 3) {
    const filler = sample(
      pool.filter(
        (l) => l.language !== seed.language && !decoys.some((d) => d.language === l.language),
      ),
      1,
      rng,
    )[0];
    if (!filler) break;
    decoys.push(filler);
  }

  return shuffle([seed, ...decoys], rng).map(toOption);
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { LANGUAGES } = await import('../content/data/languages');
  return streamDeck<LanguageSeed, Option[]>({
    pool: LANGUAGES,
    count,
    rng,
    catalog: [],
    // Nothing to fetch, so build the whole deck up front.
    eager: count,
    resolve: async (seed) => choicesFor(seed, LANGUAGES, rng),
    toRound: (seed, choices) => ({
      id: `lang:${seed.language}`,
      answer: toOption(seed),
      choices,
      hints: [`Script: ${seed.script}`, `Family: ${seed.family}`, seed.hint],
      payload: {
        text: seed.text,
        language: seed.language,
        family: seed.family,
        script: seed.script,
      } satisfies LanguagePayload,
    }),
    emptyError: 'Could not build a languages deck.',
  });
}

export const languageGame: GameDef = {
  ...languageMeta,
  loadDeck,
  Stage: LanguageStage,
};
