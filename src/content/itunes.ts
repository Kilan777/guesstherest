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
  previewUrl?: string;
  releaseDate?: string;
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
