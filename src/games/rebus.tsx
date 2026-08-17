import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { rebusMeta } from './rebus.meta';
import type { EmojiCategory, EmojiSeed } from '../content/data/emoji';
import { streamDeck } from '../content/deck';
import { TextStage } from './stages';

type RebusPayload = {
  emoji: string;
  more: [string, string];
  answer: string;
  kind: EmojiCategory;
  hint: string;
};

const DEFAULT_CATEGORY: EmojiCategory = 'Movie';

function RebusStage({ round, level, revealed }: StageProps) {
  const p = round.payload as RebusPayload;

  // Each rung adds another emoji to the line rather than replacing it, so the
  // puzzle grows in front of you instead of restarting.
  const shown = revealed ? 2 : Math.min(level, 2);
  const headline = [p.emoji, ...p.more.slice(0, shown)].join(' ');

  // The written clue is the last rung only; TextStage reveals hints by level,
  // so it gets an empty list until then.
  const hints = revealed || level >= 3 ? [p.hint] : [];

  return (
    <TextStage
      headline={headline}
      tone="emoji"
      hints={hints}
      level={3}
      revealed={revealed}
      caption={
        <>
          <strong>{p.answer}</strong>
          <span>{p.kind}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number, option?: string): Promise<Deck> {
  const { EMOJI_BY_CATEGORY, isEmojiCategory } = await import('../content/data/emoji');
  const category: EmojiCategory = isEmojiCategory(option) ? option : DEFAULT_CATEGORY;
  const pool = EMOJI_BY_CATEGORY[category];

  // The guess list is the whole category — that's what makes picking a category
  // matter. Searching 55 films is a different game from searching 26 books.
  const catalog: Option[] = pool.map((p) => ({
    id: `rebus:${p.a}`,
    label: p.a,
    sublabel: category,
  }));

  return streamDeck<EmojiSeed, EmojiSeed>({
    pool,
    count,
    rng,
    catalog,
    // Nothing to fetch, so build the whole deck up front.
    eager: count,
    resolve: async (seed) => seed,
    toRound: (seed) => ({
      id: `rebus:${seed.a}`,
      answer: { id: `rebus:${seed.a}`, label: seed.a, sublabel: category },
      payload: {
        emoji: seed.e,
        more: seed.more,
        answer: seed.a,
        kind: seed.kind,
        hint: seed.hint,
      } satisfies RebusPayload,
    }),
    emptyError: 'Could not build an emoji deck.',
  });
}

export const rebusGame: GameDef = {
  ...rebusMeta,
  loadDeck,
  Stage: RebusStage,
};
