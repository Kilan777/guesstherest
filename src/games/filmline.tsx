import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { filmLineMeta } from './filmline.meta';
import type { FilmLineSeed } from '../content/data/filmlines';
import { streamDeck } from '../content/deck';
import { TextStage } from './stages';

type FilmLinePayload = { line: string; title: string; year: number; who: string };

function FilmLineStage({ round, level, revealed }: StageProps) {
  const p = round.payload as FilmLinePayload;
  return (
    <TextStage
      headline={`“${p.line}”`}
      tone="quote"
      hints={round.hints ?? []}
      level={level}
      revealed={revealed}
      caption={
        <>
          <strong>{p.title}</strong>
          <span>
            {p.who} · {p.year}
          </span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { FILM_LINES } = await import('../content/data/filmlines');
  // Several films contribute more than one line, so the catalog is deduplicated
  // by title — otherwise the same film would appear twice in the guess list.
  const seen = new Set<string>();
  const catalog: Option[] = [];
  for (const s of FILM_LINES) {
    if (seen.has(s.title)) continue;
    seen.add(s.title);
    catalog.push({ id: `film:${s.title}`, label: s.title, sublabel: String(s.year) });
  }

  return streamDeck<FilmLineSeed, FilmLineSeed>({
    pool: FILM_LINES,
    count,
    rng,
    catalog,
    eager: count,
    resolve: async (seed) => seed,
    toRound: (seed) => ({
      id: `film:${seed.title}:${seed.line.slice(0, 16)}`,
      // The answer id must match the catalog entry, which is keyed by title
      // alone — two lines from the same film are both answered by that film.
      answer: { id: `film:${seed.title}`, label: seed.title, sublabel: String(seed.year) },
      hints: [
        `Released in the ${Math.floor(seed.year / 10) * 10}s`,
        seed.setting,
        `Said by ${seed.who}`,
      ],
      payload: {
        line: seed.line,
        title: seed.title,
        year: seed.year,
        who: seed.who,
      } satisfies FilmLinePayload,
    }),
    emptyError: 'Could not build a film-line deck.',
  });
}

export const filmLineGame: GameDef = {
  ...filmLineMeta,
  loadDeck,
  Stage: FilmLineStage,
};
