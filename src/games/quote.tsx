import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { QUOTES, type QuoteSeed } from '../content/data/quotes';
import { pageInfo } from '../content/wikipedia';
import { mapLimit } from '../content/cache';
import { streamDeck } from '../content/deck';
import { sample, shuffle } from '../lib/rng';
import { TextStage } from './stages';

const FIELD_LABEL: Record<QuoteSeed['field'], string> = {
  science: 'Science & invention',
  politics: 'Politics & activism',
  letters: 'Literature & philosophy',
  tech: 'Technology',
  sport: 'Sport',
  art: 'Art',
};

type QuotePayload = { quote: string; who: string; role: string };

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /[A-Za-zÀ-ÿ]/.test(w))
    .map((w) => `${w[0]}.`)
    .join(' ');
}

function QuoteStage({ round, level, revealed }: StageProps) {
  const p = round.payload as QuotePayload;
  return (
    <TextStage
      headline={`“${p.quote}”`}
      tone="quote"
      hints={round.hints ?? []}
      level={level}
      revealed={revealed}
      caption={
        <>
          <strong>{p.who}</strong>
          <span>{p.role}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  return streamDeck({
    pool: QUOTES,
    count,
    rng,
    catalog: [],
    resolve: async (seed) => {
      // Decoys come from the speaker's own field — a physicist among three
      // footballers isn't a guess, it's a giveaway.
      const sameField = QUOTES.filter((q) => q.field === seed.field && q.who !== seed.who);
      const uniquePeople = [...new Map(sameField.map((q) => [q.who, q])).values()];
      const decoys = sample(uniquePeople, 3, rng);

      // Tiny fields (art, sport) can run short — top up from anywhere.
      while (decoys.length < 3) {
        const filler = sample(
          QUOTES.filter(
            (q) => q.who !== seed.who && !decoys.some((d) => d.who === q.who),
          ),
          1,
          rng,
        )[0];
        if (!filler) break;
        decoys.push(filler);
      }

      const people = shuffle([seed, ...decoys], rng);
      return mapLimit(people, 4, async (person) => {
        const info = await pageInfo(person.wiki);
        return {
          id: `who:${person.who}`,
          label: person.who,
          sublabel: person.role,
          image: info?.thumb ?? undefined,
        } satisfies Option;
      });
    },
    toRound: (seed, withPortraits) => ({
      id: `quote:${seed.who}:${seed.q.slice(0, 24)}`,
      answer: withPortraits.find((o) => o.id === `who:${seed.who}`) ?? {
        id: `who:${seed.who}`,
        label: seed.who,
      },
      choices: withPortraits,
      hints: [
        `Their world: ${FIELD_LABEL[seed.field]}`,
        `They are best known as: ${seed.role}`,
        `Initials: ${initialsOf(seed.who)}`,
      ],
      payload: { quote: seed.q, who: seed.who, role: seed.role } satisfies QuotePayload,
    }),
    eager: 2,
    concurrency: 3,
    emptyError: 'Could not build a quote deck.',
  });
}

export const quoteGame: GameDef = {
  slug: 'quote',
  title: 'Guess Who Said It',
  short: 'Quote',
  tagline: 'Four faces, one voice.',
  blurb:
    'A line somebody famous actually said — no internet misattributions here. Pick the face it belongs to. Stuck? Trade points for their field, their job, their initials.',
  emoji: '💬',
  accent: '#1F5136',
  guess: 'choice',
  levels: ['Cold', 'Field', 'Role', 'Initials'],
  skipLabel: 'Give me a clue',
  needsNetwork: false,
  rounds: 10,
  keywords: ['quote','saying','people','famous','who','history'],
  prefetch: (round) => { for (const c of round.choices ?? []) if (c.image) new Image().src = c.image; },
  loadDeck,
  Stage: QuoteStage,
};
