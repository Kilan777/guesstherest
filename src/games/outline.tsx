import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { outlineMeta } from './outline.meta';
import { pageInfo } from '../content/wikipedia';
import { streamDeck } from '../content/deck';
import { TileStage } from './stages';

/** A locator map is usually wider than it is tall, so the grid is 6×4 like the flag game's. */
const COLS = 6;
const ROWS = 4;
/** Windows cut at each rung, out of 24. */
const OPENED = [3, 7, 12, 18, 24];

type OutlinePayload = { map: string | null; label: string; region: string; wide: boolean };

function OutlineStage({ round, level, revealed }: StageProps) {
  const p = round.payload as OutlinePayload;
  return (
    <TileStage
      src={p.map}
      opened={OPENED}
      level={level}
      revealed={revealed}
      cols={COLS}
      rows={ROWS}
      seed={round.id}
      // A blurred map is still a perfectly readable silhouette, and the
      // silhouette is the entire question — so the unopened area is solid.
      conceal="hide"
      // The frame crops with object-fit: cover, so the wrong one throws the
      // answer away: Chile's map is 950×2132 and a 3:2 frame shows the middle
      // third of the country. Thirty of the sixty-eight maps are portrait, so
      // the seed carries the orientation its own lead image was measured at.
      aspect={p.wide ? 'landscape' : 'portrait'}
      caption={
        <>
          <strong>{p.label}</strong>
          <span>{p.region}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { OUTLINES } = await import('../content/data/outlines');
  const catalog: Option[] = OUTLINES.map((c) => ({
    id: `outline:${c.wiki}`,
    label: c.label,
    sublabel: c.region,
  }));

  return streamDeck({
    pool: OUTLINES,
    count,
    rng,
    catalog,
    eager: 2,
    resolve: async (seed) => {
      const info = await pageInfo(seed.wiki);
      // Maps are mostly flat colour, so the 1280px render is plenty and loads in
      // a fraction of the time the original takes.
      return info?.image ?? info?.imageFull ?? null;
    },
    toRound: (seed, map) => ({
      id: `outline:${seed.wiki}`,
      answer: { id: `outline:${seed.wiki}`, label: seed.label, sublabel: seed.region },
      payload: {
        map,
        label: seed.label,
        region: seed.region,
        wide: seed.wide,
      } satisfies OutlinePayload,
    }),
    emptyError: 'Could not reach Wikipedia for country maps.',
  });
}

export const outlineGame: GameDef = {
  ...outlineMeta,
  prefetch: (round) => {
    const p = round.payload as OutlinePayload | undefined;
    if (p?.map) new Image().src = p.map;
  },
  loadDeck,
  Stage: OutlineStage,
};
