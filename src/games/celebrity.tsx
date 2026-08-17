import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { celebrityMeta } from './celebrity.meta';
import { pageInfo, type ImageCredit } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { BlurStage } from './stages';

/** Faces survive blur better than album sleeves do, so this ladder starts
 *  gentler than the album one and lands closer to sharp. */
const BLURS = [9, 4, 1.5];
const SCALES = [1.26, 1.14, 1.05];

type CelebrityPayload = {
  portrait: string | null;
  label: string;
  note: string;
  /** Attribution for the portrait, shown on the reveal. */
  credit: ImageCredit | null;
};

function CelebrityStage({ round, level, revealed }: StageProps) {
  const p = round.payload as CelebrityPayload;
  return (
    <BlurStage
      src={p.portrait}
      blurs={BLURS}
      scales={SCALES}
      level={level}
      revealed={revealed}
      credit={p.credit}
      caption={
        <>
          <strong>{p.label}</strong>
          {p.note ? <span>{p.note}</span> : null}
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { CELEBRITIES } = await import('../content/data/celebrities');
  const catalog: Option[] = CELEBRITIES.map((a) => ({
    id: `celeb:${a.wiki}`,
    label: a.label,
  }));

  return streamDeck({
    pool: CELEBRITIES,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      return info?.image ? info : null;
    },
    toRound: (seed, info) => ({
      id: `celeb:${seed.wiki}`,
      answer: { id: `celeb:${seed.wiki}`, label: seed.label },
      payload: {
        portrait: info.image,
        label: seed.label,
        // The article's one-line description, e.g. "American actress".
        note: info.description,
        credit: info.credit,
      } satisfies CelebrityPayload,
    }),
    emptyError: 'Could not reach Wikipedia for actor portraits.',
  });
}

export const celebrityGame: GameDef = {
  ...celebrityMeta,
  prefetch: (round) => {
    const p = round.payload as CelebrityPayload | undefined;
    if (p?.portrait) new Image().src = p.portrait;
  },
  loadDeck,
  Stage: CelebrityStage,
};
