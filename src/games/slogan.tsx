import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { sloganMeta } from './slogan.meta';
import type { SloganSeed } from '../content/data/slogans';
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
  const { SLOGANS } = await import('../content/data/slogans');
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
  ...sloganMeta,
  loadDeck,
  Stage: SloganStage,
};
