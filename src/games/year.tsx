import type { Deck, GameDef, StageProps } from '../engine/types';
import { MOVIES } from '../content/data/movies';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';

type YearPayload = { poster: string | null; title: string; blurb: string; year: number };

/**
 * Wikipedia's one-line description for a film is almost always "2010 film by
 * Christopher Nolan" — which hands over the answer on the first clue of a game
 * whose entire question is the year. Strip any year, and any decade written as
 * "1990s", then tidy up what's left.
 */
function stripYears(text: string): string {
  const cleaned = text
    .replace(/\b(1[89]|20)\d{2}s\b/g, '')
    .replace(/\b(1[89]|20)\d{2}\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s,–-]+/, '')
    .trim();
  if (!cleaned || cleaned.length < 8) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export const YEAR_MIN = 1930;
export const YEAR_MAX = new Date().getFullYear();

function YearStage({ round, level, revealed }: StageProps) {
  const p = round.payload as YearPayload;
  const hints = round.hints ?? [];
  const visible = revealed ? hints : hints.slice(0, level);

  return (
    <div className="stage">
      <div className="year-card">
        {p.poster ? (
          <img className="year-poster" src={p.poster} alt="" draggable={false} />
        ) : (
          <div className="year-poster year-poster-empty">🎞️</div>
        )}
        <div className="year-meta">
          <h3 className="year-title">{p.title}</h3>
          {visible.length > 0 && (
            <ul className="hint-list">
              {visible.map((h, i) => (
                <li key={i} className="hint">
                  <span className="hint-tag">Clue {i + 1}</span>
                  {h}
                </li>
              ))}
            </ul>
          )}
          {revealed && (
            <div className="year-answer">
              Released <strong>{p.year}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const usable = MOVIES.filter((m) => m.year >= YEAR_MIN && m.year <= YEAR_MAX);

  return streamDeck({
    pool: usable,
    count,
    rng,
    catalog: [],
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return { poster: info?.imageFull ?? null, blurb: stripYears(info?.description ?? '') };
    },
    toRound: (seed, value) => {
      const decade = Math.floor(seed.year / 10) * 10;
      // An off-centre five-year window: a symmetric one hands over the answer as
      // its midpoint.
      const lo = seed.year - (seed.title.length % 5);
      return {
        id: `year:${seed.wiki}`,
        answer: { id: `year:${seed.wiki}`, label: String(seed.year) },
        year: seed.year,
        hints: [
          value.blurb || 'No description on file — the poster is all you get.',
          `It came out in the ${decade}s`,
          `Somewhere between ${lo} and ${lo + 4}`,
        ],
        payload: {
          poster: value.poster,
          title: seed.title,
          blurb: value.blurb,
          year: seed.year,
        } satisfies YearPayload,
      };
    },
    eager: 2,
    emptyError: 'Could not reach Wikipedia for film data.',
  });
}

export const yearGame: GameDef = {
  slug: 'year',
  title: 'Guess the Year',
  short: 'Year',
  tagline: 'Guess the year a film came out.',
  blurb:
    'Name the year a film came out. Exact is full marks; one year off still pays 60%, two years 35%, three years 15%. Four and you have burned a rung.',
  emoji: '📅',
  accent: '#16665A',
  guess: 'year',
  levels: ['Cold', 'Description', 'Decade', 'Five-year window'],
  skipLabel: 'Narrow it down',
  needsNetwork: true,
  rounds: 10,
  yearRange: [YEAR_MIN, YEAR_MAX],
  keywords: ['movie', 'film', 'date', 'release', 'when', 'timeline'],
  prefetch: (round) => {
    const p = round.payload as YearPayload | undefined;
    if (p?.poster) new Image().src = p.poster;
  },
  loadDeck,
  Stage: YearStage,
};
