import { cached, MONTH, normalize } from './cache';
import { TokenBucket } from '../lib/ratelimit';

const ENDPOINT = 'https://itunes.apple.com/search';

type RawResult = {
  trackId?: number;
  collectionId?: number;
  trackName?: string;
  collectionName?: string;
  artistName?: string;
  artworkUrl100?: string;
  artworkUrl512?: string;
  sellerName?: string;
  primaryGenreName?: string;
  previewUrl?: string;
  releaseDate?: string;
  /** 'explicit' | 'cleaned' | 'notExplicit' — Apple's parental advisory flag. */
  trackExplicitness?: string;
  /** Same, for a collection: 'explicit' | 'cleaned' | 'notExplicit'. */
  collectionExplicitness?: string;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  previewUrl: string;
  year: number;
};

export type App = {
  id: string;
  name: string;
  seller: string;
  genre: string;
  artwork: string;
};

export type Album = {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  year: number;
};

export class ItunesUnavailable extends Error {}

/**
 * The catalog is full of note-for-note reissues by cover acts, and iTunes ranks
 * them above the original often enough to matter — searching "American Idiot
 * Green Day" surfaces the Rockabye Baby! lullaby record and a Vitamin String
 * Quartet tribute before Green Day themselves. Anything matching this gets
 * skipped no matter how well the title lines up.
 */
const IMPOSTER =
  /karaoke|tribute|made popular|originally performed|cover version|lullaby|rockabye|sparrow sleeps|string quartet|vitamin string|8-bit|8 bit|solo violin|piano tribute|music box|instrumental version|in the style of/i;

/**
 * Apple flags a parental advisory on each result as 'explicit', 'cleaned' or
 * 'notExplicit'. A clip is auto-played on a page that carries advertising, so
 * an explicit master is never an acceptable pick — a title that exists only in
 * an explicit cut is dropped from the deck rather than played.
 *
 * Measured against the live API over all 170 songs in the deck, Apple currently
 * ranks a clean master first every time, so this changes nothing today. That is
 * exactly why it belongs here: the ordering is Apple's to change, and nothing
 * else in the pipeline would notice if it did.
 *
 * The *track* flag is the one that matters for audio. `collectionExplicitness`
 * deliberately is not consulted here: a clean cut sitting on an album marked
 * explicit plays clean audio, and rejecting on the album flag cost four titles
 * their round for nothing. It is checked in {@link findAlbum}, where the album
 * — and its advisory sticker — is the thing on screen.
 */
function isExplicitTrack(r: RawResult): boolean {
  return r.trackExplicitness === 'explicit';
}

/* ── rate limiting ──────────────────────────────────────────────────────────
   iTunes caps search traffic per IP, and when it cuts you off it answers 403
   *without* CORS headers — so the browser rejects the fetch and the status is
   unreadable. All we see is a failed promise, which is indistinguishable from
   being offline. Both want the same response: slow down, retry, then give up
   loudly rather than silently returning a half-length deck.

   Requests are therefore serialised with a gap, and every loader resolves only
   as many rounds as it actually needs.                                       */

// Apple budgets roughly 20 search calls a minute. A ten-round deck needs ten of
// them, so the bucket lets a whole deck through at once and only starts holding
// requests back if you keep starting new games.
const bucket = new TokenBucket(14, 18);

// Three at a time is enough to hide latency without looking like a scraper.
const MAX_INFLIGHT = 3;
let inflight = 0;
const waiting: (() => void)[] = [];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function schedule<T>(fn: () => Promise<T>): Promise<T> {
  await bucket.take();
  if (inflight >= MAX_INFLIGHT) {
    await new Promise<void>((resolve) => waiting.push(resolve));
  }
  inflight++;
  try {
    return await fn();
  } finally {
    inflight--;
    waiting.shift()?.();
  }
}

async function query(params: Record<string, string>): Promise<RawResult[]> {
  const url = `${ENDPOINT}?${new URLSearchParams({ ...params, country: 'US' })}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await schedule(async () => {
      try {
        return await fetch(url);
      } catch {
        // Rejected before we can read a status: CORS-stripped 403, or offline.
        return null;
      }
    });

    if (res?.ok) {
      const body = (await res.json()) as { results?: RawResult[] };
      return body.results ?? [];
    }
    if (res && res.status !== 403 && res.status !== 429) {
      throw new ItunesUnavailable(`iTunes responded ${res.status}.`);
    }
    // Being cut off means our estimate of the budget was too generous.
    bucket.penalise(6);
    await sleep(1200 * 2 ** attempt);
  }

  throw new ItunesUnavailable(
    'iTunes is throttling this connection. Give it a minute and try again — already-seen tracks stay cached.',
  );
}

/** iTunes serves 100px art by default; the URL pattern scales to any size. */
function upscale(url: string, size = 600): string {
  return url.replace(/\/\d+x\d+bb\.(jpg|png)$/, `/${size}x${size}bb.$1`);
}

function yearOf(date: string | undefined): number {
  const y = Number((date ?? '').slice(0, 4));
  return Number.isFinite(y) && y > 1900 ? y : 0;
}

/**
 * Titles come from a curated list, so we search for the exact pairing and then
 * sanity-check the result — otherwise iTunes happily returns karaoke covers and
 * tribute-band recordings, which make for a miserable round.
 *
 * Throws (rather than returning null) when iTunes is unreachable, so a throttled
 * response is never cached as "this song doesn't exist".
 */
export async function findTrack(title: string, artist: string): Promise<Track | null> {
  const key = `itunes:track:${normalize(title)}|${normalize(artist)}`;
  return cached(key, MONTH, async () => {
    const results = await query({
      term: `${title} ${artist}`,
      media: 'music',
      entity: 'song',
      // 25 costs exactly the same one request as 12 and rescues the titles
      // buried under reissues and live versions.
      limit: '25',
    });

    const wantTitle = normalize(title);
    const wantArtist = normalize(artist);

    const match = results.find((r) => {
      if (!r.previewUrl || !r.artworkUrl100 || !r.trackName || !r.artistName) return false;
      // Nothing with a parental advisory is ever auto-played on an ad-carrying page.
      if (isExplicitTrack(r)) return false;
      const gotTitle = normalize(r.trackName);
      const gotArtist = normalize(r.artistName);
      const titleOk = gotTitle === wantTitle || gotTitle.startsWith(wantTitle);
      const artistOk = gotArtist.includes(wantArtist) || wantArtist.includes(gotArtist);
      return titleOk && artistOk && !IMPOSTER.test(`${r.trackName} ${r.artistName} ${r.collectionName ?? ''}`);
    });

    if (!match) return null;
    return {
      id: String(match.trackId ?? `${title}-${artist}`),
      title: match.trackName ?? title,
      artist: match.artistName ?? artist,
      album: match.collectionName ?? '',
      artwork: upscale(match.artworkUrl100 ?? ''),
      previewUrl: match.previewUrl ?? '',
      year: yearOf(match.releaseDate),
    } satisfies Track;
  });
}

/**
 * App Store icon lookup.
 *
 * The store is full of near-namesakes — searching "Signal" returns a dozen
 * signal-booster utilities before the messenger — so a result only counts if
 * its name starts with the requested one *and* the developer lines up. Where
 * the seller string has drifted (Apple rewrites these on acquisitions) an exact
 * name match is still accepted, but a prefix match on its own never is.
 *
 * Throws rather than returning null when iTunes is unreachable, so a throttled
 * response is never cached as "this app doesn't exist".
 *
 * No explicitness guard here, and deliberately: software results carry no
 * `trackExplicitness` at all — only an age rating (`contentAdvisoryRating`),
 * which is a different thing. Checked against the live API, the ratings on this
 * deck run 4+ to 17+, with LinkedIn and Reddit both sitting at 17+; filtering
 * on it would drop mainstream apps and guard nothing, since the round shows a
 * store icon and plays no audio. The one thing that auto-plays is the song
 * clip, and {@link findTrack} is where that is handled.
 */
export async function findApp(name: string, seller: string): Promise<App | null> {
  const key = `itunes:app:${normalize(name)}|${normalize(seller)}`;
  return cached(key, MONTH, async () => {
    const results = await query({
      term: name,
      entity: 'software',
      // The big names rank first, but regional clones and "… for X" companions
      // pad the top of the list often enough to want the depth.
      limit: '25',
    });

    const wantName = normalize(name);
    const wantSeller = normalize(seller);

    const nameOk = (r: RawResult) => {
      const got = normalize(r.trackName ?? '');
      return got === wantName || got.startsWith(`${wantName} `);
    };
    const sellerOk = (r: RawResult) => {
      const got = normalize(r.sellerName ?? '');
      return !!got && (got.includes(wantSeller) || wantSeller.includes(got));
    };
    const usable = results.filter((r) => r.artworkUrl512 && r.trackName);

    const match =
      usable.find((r) => nameOk(r) && sellerOk(r)) ??
      usable.find((r) => normalize(r.trackName ?? '') === wantName);

    if (!match) return null;
    return {
      id: String(match.trackId ?? name),
      name: match.trackName ?? name,
      seller: match.sellerName ?? seller,
      genre: match.primaryGenreName ?? '',
      artwork: match.artworkUrl512 ?? '',
    } satisfies App;
  });
}

export async function findAlbum(title: string, artist: string): Promise<Album | null> {
  const key = `itunes:album:${normalize(title)}|${normalize(artist)}`;
  return cached(key, MONTH, async () => {
    const results = await query({
      term: `${artist} ${title}`,
      media: 'music',
      entity: 'album',
      limit: '25',
    });

    const wantTitle = normalize(title);
    const wantArtist = normalize(artist);

    const match = results.find((r) => {
      if (!r.artworkUrl100 || !r.collectionName || !r.artistName) return false;
      // No audio here, but an explicit collection carries the advisory sticker
      // on its cover art, which is the thing this game puts on screen.
      if (r.collectionExplicitness === 'explicit' || isExplicitTrack(r)) return false;
      const gotTitle = normalize(r.collectionName);
      const gotArtist = normalize(r.artistName);
      // Ignore the endless "(Deluxe Edition)" / "(Remastered)" suffixes.
      const titleOk = gotTitle.startsWith(wantTitle) || wantTitle.startsWith(gotTitle);
      const artistOk = gotArtist.includes(wantArtist) || wantArtist.includes(gotArtist);
      // Cover-act reissues borrow the album title wholesale, so the same filter
      // the track search uses applies here too.
      return titleOk && artistOk && !IMPOSTER.test(`${r.collectionName} ${r.artistName}`);
    });

    if (!match) return null;
    return {
      id: String(match.collectionId ?? `${title}-${artist}`),
      title: match.collectionName ?? title,
      artist: match.artistName ?? artist,
      artwork: upscale(match.artworkUrl100 ?? '', 1000),
      year: yearOf(match.releaseDate),
    } satisfies Album;
  });
}
