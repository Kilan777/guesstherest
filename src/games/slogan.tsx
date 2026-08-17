import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { SLOGANS, type SloganSeed } from '../content/data/slogans';
import { streamDeck } from '../content/deck';
import { TextStage } from './stages';

type SloganPayload = { line: string; brand: string; sector: string; era: string };

function SloganStage({ round, level, revealed }: StageProps) {
  const p = round.payload as SloganPayload;
  return (
    <TextStage
      headline={`“${p.line}”`}
      tone="quote"
      hints={round.hints ?? []}
      level={level}
      revealed={revealed}
      caption={
        <>
          <strong>{p.brand}</strong>
          <span>
            {p.sector} · {p.era}
          </span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  // The catalog is every brand in the file — the game is recognising the line,
  // not narrowing down a shortlist.
  const catalog: Option[] = SLOGANS.map((s) => ({
    id: `slogan:${s.brand}`,
    label: s.brand,
    sublabel: s.sector,
  }));

  return streamDeck<SloganSeed, SloganSeed>({
    pool: SLOGANS,
    count,
    rng,
    catalog,
    eager: count,
    resolve: async (seed) => seed,
    toRound: (seed) => ({
      id: `slogan:${seed.brand}`,
      answer: { id: `slogan:${seed.brand}`, label: seed.brand, sublabel: seed.sector },
      hints: [`Sector: ${seed.sector}`, `Started running around ${seed.era}`, seed.hint],
      payload: {
        line: seed.line,
        brand: seed.brand,
        sector: seed.sector,
        era: seed.era,
      } satisfies SloganPayload,
    }),
    emptyError: 'Could not build a slogans deck.',
  });
}

export const sloganGame: GameDef = {
  slug: 'slogan',
  title: 'Guess the Slogan',
  short: 'Slogan',
  tagline: 'Name the brand behind an advertising line.',
  blurb:
    'An advertising line, quoted the way it actually ran, with the brand name taken out of it where there was one. Name the company that paid for it. Skips buy you the sector, roughly when it launched, then something about the campaign.',
  emoji: '📣',
  accent: '#B0551F',
  guess: 'search',
  levels: ['Cold', 'Sector', 'Era', 'Clue'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['slogan', 'advertising', 'brand', 'tagline', 'marketing', 'ad', 'company'],
  loadDeck,
  Stage: SloganStage,
};
