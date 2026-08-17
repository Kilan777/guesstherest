import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { CELEBRITIES } from '../content/data/celebrities';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { BlurStage } from './stages';

/** Faces survive blur better than album sleeves do, so this ladder starts
 *  gentler than the album one and lands closer to sharp. */
const BLURS = [9, 4, 1.5];
const SCALES = [1.26, 1.14, 1.05];

type CelebrityPayload = { portrait: string | null; label: string; note: string };

function CelebrityStage({ round, level, revealed }: StageProps) {
  const p = round.payload as CelebrityPayload;
  return (
    <BlurStage
      src={p.portrait}
      blurs={BLURS}
      scales={SCALES}
      level={level}
      revealed={revealed}
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
      } satisfies CelebrityPayload,
    }),
    emptyError: 'Could not reach Wikipedia for actor portraits.',
  });
}

export const celebrityGame: GameDef = {
  slug: 'celebrity',
  title: 'Guess the Celebrity',
  short: 'Celebrity',
  tagline: 'Name the famous face as it comes into focus.',
  blurb:
    'Portraits of screen actors from the silent era to last year, blurred to a smudge. Hair and jawline come back first; the eyes are what settle it.',
  emoji: '🎭',
  accent: '#92315F',
  guess: 'search',
  levels: ['Soft', 'Nearly there', 'Almost sharp'],
  skipLabel: 'Sharpen',
  needsNetwork: true,
  rounds: 10,
  keywords: ['celebrity', 'famous', 'face', 'star', 'actor', 'musician', 'blur'],
  prefetch: (round) => {
    const p = round.payload as CelebrityPayload | undefined;
    if (p?.portrait) new Image().src = p.portrait;
  },
  loadDeck,
  Stage: CelebrityStage,
};
