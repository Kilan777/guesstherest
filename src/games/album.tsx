import type { Deck, GameDef, Option, StageProps } from '../engine/types';
import { ALBUMS } from '../content/data/albums';
import { findAlbum } from '../content/itunes';
import { streamDeck } from '../content/deck';
import { normalize } from '../content/cache';
import { BlurStage } from './stages';

/** Heavy blur plus a push-in, easing back to the untouched cover. */
const BLURS = [44, 26, 14, 6, 2];
const SCALES = [1.6, 1.45, 1.3, 1.15, 1.05];

type AlbumPayload = { artwork: string; title: string; artist: string; year: number };

const seedId = (t: string, a: string) => `album:${normalize(t)}|${normalize(a)}`;

function AlbumStage({ round, level, revealed }: StageProps) {
  const p = round.payload as AlbumPayload;
  return (
    <BlurStage
      src={p.artwork}
      blurs={BLURS}
      scales={SCALES}
      level={level}
      revealed={revealed}
      caption={
        <>
          <strong>{p.title}</strong>
          <span>
            {p.artist}
            {p.year ? ` · ${p.year}` : ''}
          </span>
        </>
      }
    />
  );
}

async function loadDeck(count: number, rng: () => number): Promise<Deck> {
  const catalog: Option[] = ALBUMS.map((a) => ({
    id: seedId(a.t, a.a),
    label: a.t,
    sublabel: a.a,
  }));

  return streamDeck({
    pool: ALBUMS,
    count,
    rng,
    catalog,
    eager: 2,
    concurrency: 2,
    resolve: async (seed) => {
      const album = await findAlbum(seed.t, seed.a);
      return album?.artwork ? album : null;
    },
    toRound: (seed, album) => ({
      id: seedId(seed.t, seed.a),
      answer: { id: seedId(seed.t, seed.a), label: seed.t, sublabel: seed.a, image: album.artwork },
      payload: {
        artwork: album.artwork,
        title: seed.t,
        artist: seed.a,
        year: album.year,
      } satisfies AlbumPayload,
    }),
    emptyError: 'Could not reach the iTunes artwork catalog.',
  });
}

export const albumGame: GameDef = {
  slug: 'album',
  title: 'Guess the Album',
  short: 'Album',
  tagline: 'Name the album from its blurred cover.',
  blurb:
    'A famous sleeve, blurred past recognition. Every skip sharpens it a little. The shapes usually give it away before the text does.',
  emoji: '💿',
  accent: '#5B3E8C',
  guess: 'search',
  levels: ['Smudge', 'Blurry', 'Soft', 'Nearly there', 'Almost sharp'],
  skipLabel: 'Sharpen',
  needsNetwork: true,
  rounds: 10,
  keywords: ['music','cover','record','sleeve','vinyl','blur'],
  prefetch: (round) => { const p = round.payload as AlbumPayload | undefined; if (p?.artwork) new Image().src = p.artwork; },
  loadDeck,
  Stage: AlbumStage,
};
