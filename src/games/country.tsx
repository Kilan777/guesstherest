import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import type { StreetViewSeed } from '../content/data/streetview';
import { CAPITALS } from '../content/data/capitals';
import { streamDeck } from '../content/deck';
import { StreetViewStage } from './stages';

type CountryPayload = { lat: number; lng: number; country: string; region: string };

function CountryStage({ round, level, revealed }: StageProps) {
  const p = round.payload as CountryPayload;
  return (
    <StreetViewStage
      lat={p.lat}
      lng={p.lng}
      seed={round.id}
      revealed={revealed}
      hints={round.hints ?? []}
      level={level}
      caption={
        <>
          <strong>{p.country}</strong>
          <span>{p.region}</span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const { STREET_VIEW } = await import('../content/data/streetview');
  // The guess list is every country the site knows about, not just the ones
  // with a location in the deck — otherwise the catalog itself narrows the
  // answer down to fifty-odd countries.
  const catalog: Option[] = CAPITALS.map((c) => ({
    id: `country:${c.country}`,
    label: c.country,
    sublabel: c.region,
  }));

  return streamDeck<StreetViewSeed, StreetViewSeed>({
    pool: STREET_VIEW,
    count,
    rng,
    catalog,
    // Nothing to fetch — the panorama loads in an iframe when the round shows.
    eager: count,
    resolve: async (seed) => seed,
    toRound: (seed) => ({
      id: `country:${seed.country}:${seed.lat.toFixed(3)}`,
      // Answer id matches the catalog entry, which is keyed by country alone.
      answer: { id: `country:${seed.country}`, label: seed.country, sublabel: seed.region },
      hints: [
        `Somewhere in ${seed.region}`,
        seed.hint,
        `Starts with "${seed.country.charAt(0)}"`,
      ],
      payload: {
        lat: seed.lat,
        lng: seed.lng,
        country: seed.country,
        region: seed.region,
      } satisfies CountryPayload,
    }),
    emptyError: 'Could not build a location deck.',
  });
}

export const countryGame: GameDef = {
  slug: 'country',
  title: 'Guess the Country',
  short: 'Country',
  tagline: "Look around a street and work out which country you're in.",
  blurb:
    'A street somewhere on Earth, and you can look around as much as you like. The road markings, the signage, the plants and which side the cars are on will tell you more than the buildings do.',
  emoji: '🌐',
  accent: '#1F5136',
  guess: 'search',
  levels: ['Cold', 'Continent', 'Clue', 'First letter'],
  skipLabel: 'Give me a clue',
  needsNetwork: true,
  rounds: 8,
  keywords: ['country', 'geography', 'street view', 'map', 'world', 'travel', 'geo'],
  loadDeck,
  Stage: CountryStage,
};
