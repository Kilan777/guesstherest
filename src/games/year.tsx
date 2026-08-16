import type { Deck, GameDef, StageProps } from '../engine/types';
import { MOVIES } from '../content/data/movies';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';

type YearPayload = { poster: string | null; title: string; blurb: string; year: number };

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
      return { poster: info?.imageFull ?? null, blurb: info?.description ?? '' };
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
          value.blurb || 'No description on file.',
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
  tagline: 'Close counts. Barely.',
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
