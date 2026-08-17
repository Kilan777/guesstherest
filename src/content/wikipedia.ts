import { cached, MONTH } from './cache';

const SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

/**
 * Enough to credit a picture at the point of use.
 *
 * Most Wikimedia photographs are CC BY-SA, which requires the author and the
 * licence to be shown wherever the picture is. Attribution by hyperlink to the
 * file's own description page — which carries the author, the licence and the
 * full history — is the accepted form for this medium, and it is the only one
 * that fits under a game stage without turning into a wall of text.
 */
export type ImageCredit = {
  /** File name as Wikimedia stores it, e.g. `Puffin_(Fratercula_arctica).jpg`. */
  file: string;
  /** The file description page: author, licence, source, history. */
  page: string;
};

/** Author and licence, once the (lazy, post-reveal) lookup has landed. */
export type ImageLicence = { author: string | null; licence: string | null };

export type WikiPage = {
  title: string;
  description: string;
  /** Stage-sized render. May 400 for files this width isn't cached for. */
  image: string | null;
  /** Guaranteed-good original, used if `image` fails to load. */
  imageFull: string | null;
  thumb: string | null;
  /**
   * Credit for the lead image. Derived from the image URL, so it costs no
   * extra request and is available the instant the round is.
   */
  credit: ImageCredit | null;
};

/**
 * Wikipedia returns 429 readily if you fan out — measured at roughly 8 parallel
 * requests. Rounds are loaded through this queue so bursts become a steady
 * trickle, and a 429 still gets a couple of backed-off retries.
 */
const MAX_INFLIGHT = 3;
let inflight = 0;
const waiting: (() => void)[] = [];

function queued<T>(fn: () => Promise<T>): Promise<T> {
  const acquire = new Promise<void>((resolve) => {
    if (inflight < MAX_INFLIGHT) {
      inflight++;
      resolve();
    } else {
      waiting.push(() => {
        inflight++;
        resolve();
      });
    }
  });

  return acquire.then(fn).finally(() => {
    inflight--;
    waiting.shift()?.();
  });
}

/**
 * Seed files are hand-written, and it is very easy to paste a title straight
 * from a Wikipedia URL — which is already percent-encoded. Encoding that again
 * turns `%C3%A9` into `%25C3%25A9`, which the API answers with a 403, and the
 * loader then silently drops the round. Decoding first makes both spellings
 * work.
 */
function encodeTitle(title: string): string {
  const underscored = title.replace(/ /g, '_');
  let decoded = underscored;
  try {
    decoded = decodeURIComponent(underscored);
  } catch {
    // A stray literal '%' that isn't a valid escape — use it as written.
  }
  return encodeURIComponent(decoded);
}

async function fetchWithBackoff(url: string): Promise<Response | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await queued(() => fetch(url, { headers: { Accept: 'application/json' } }));
    if (res.status !== 429) return res;
    await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
  }
  return null;
}

/**
 * `originalimage` routinely comes back at 3840px / ~800KB, which is a visible
 * stall before the first rung even appears. Wikimedia will serve a smaller
 * render from the /thumb/ path — but only at widths it has already cached:
 * probing one file, 250/330/500/1280/1920/3840 returned images and every other
 * width returned HTTP 400. So we ask for 1280 (about a fifth of the bytes, and
 * still far more detail than a 16× crop of a 1200px frame can show) and keep
 * the original as a fallback for any file that width isn't cached for.
 */
const STAGE_WIDTH = 1280;

function sized(rawUrl: string, width: number): string {
  const url = rawUrl.split('?')[0] ?? rawUrl;

  // Already a thumbnail — just swap the width prefix.
  if (url.includes('/thumb/')) {
    return url.replace(/\/(\d+)px-([^/]+)$/, `/${width}px-$2`);
  }

  // A full-size original: rebuild it as the equivalent thumb URL.
  const m = /^(https?:\/\/upload\.wikimedia\.org\/wikipedia\/[^/]+)\/([0-9a-f])\/([0-9a-f]{2})\/(.+)$/.exec(
    url,
  );
  if (!m) return url;
  const [, base, a, b, file] = m;
  // Vector sources are rasterised by the thumbnailer, so they gain a .png tail.
  const name = file?.toLowerCase().endsWith('.svg') ? `${file}.png` : file;
  return `${base}/thumb/${a}/${b}/${file}/${width}px-${name}`;
}

/**
 * Turns the URL of a Wikimedia-served image into a link to the file's own
 * description page, where its author and licence live.
 *
 * Deliberately derived rather than fetched. A credit is needed for every
 * picture in every round, and asking an API for each one would put a second
 * network round trip in front of every round — on a source that 429s at about
 * eight parallel requests, and in a loader that has been tuned hard to get the
 * first round on screen fast. Everything needed for the link is already in the
 * URL we were given:
 *
 *   .../wikipedia/commons/thumb/a/ab/Foo.jpg/1280px-Foo.jpg  →  commons, Foo.jpg
 *   .../wikipedia/en/a/ab/Bar.png                            →  en,      Bar.png
 *
 * The project segment also says where the file is hosted, which matters: a file
 * on `commons` is free media and a file on `en` is usually a local fair-use
 * upload, so the link has to point at whichever one is actually being shown.
 *
 * Returns null for anything it does not recognise, so a caller can render
 * nothing rather than a guessed — and possibly broken — link.
 */
export function creditFor(rawUrl: string | null | undefined): ImageCredit | null {
  if (!rawUrl) return null;
  try {
    const { hostname, pathname } = new URL(rawUrl);
    if (hostname !== 'upload.wikimedia.org') return null;

    const parts = pathname.split('/').filter(Boolean);
    // ['wikipedia', <project>, ...]
    if (parts[0] !== 'wikipedia' || parts.length < 4) return null;
    const project = parts[1];
    if (!project) return null;

    // A thumb path ends `<file>/<width>px-<file>`; an original ends `<file>`.
    const raw = pathname.includes('/thumb/') ? parts[parts.length - 2] : parts[parts.length - 1];
    if (!raw) return null;

    let file = raw;
    try {
      file = decodeURIComponent(raw);
    } catch {
      // Leave it as written — a stray '%' is not worth dropping the credit for.
    }
    if (!file.includes('.')) return null;

    // Only two shapes ever come back from the summary API — `commons`, and a
    // language code for a locally hosted file. Anything else would build a
    // hostname that may not resolve, and a dead credit link is worse than none.
    const host =
      project === 'commons'
        ? 'https://commons.wikimedia.org'
        : /^[a-z]{2,3}$/.test(project)
          ? `https://${project}.wikipedia.org`
          : null;
    if (!host) return null;

    return { file, page: `${host}/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}` };
  } catch {
    return null;
  }
}

/** MediaWiki hands `Artist` back as a fragment of HTML — flatten it to text. */
function plainText(html: string): string {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/\s{2,}/g, ' ')
    .trim();
  // Some uploaders paste an entire biography in here. A caption is not the
  // place for it, and the link carries the full text anyway.
  return text.length > 70 ? `${text.slice(0, 67).trimEnd()}…` : text;
}

/**
 * Author and licence for a file, from the MediaWiki `extmetadata` API.
 *
 * Called only once a round has been revealed and the credit line is already on
 * screen showing its link — never while a deck is being dealt. That is the
 * whole point: the link alone is a complete attribution, so this request buys
 * a nicer caption and is free to be slow, to fail, or never to happen at all.
 * It deliberately does not go through `queued`, so it can never take a slot
 * from a round that is still loading.
 */
export async function imageLicence(credit: ImageCredit): Promise<ImageLicence | null> {
  return cached(`wikilic:${credit.page}`, MONTH, async () => {
    try {
      const origin = new URL(credit.page).origin;
      const api =
        `${origin}/w/api.php?action=query&format=json&origin=*&prop=imageinfo` +
        `&iiprop=extmetadata&titles=${encodeURIComponent(`File:${credit.file}`)}`;
      const res = await fetch(api, { headers: { Accept: 'application/json' } });
      if (!res.ok) return null;
      const j = (await res.json()) as {
        query?: { pages?: Record<string, { imageinfo?: { extmetadata?: Record<string, { value?: string }> }[] }> };
      };
      const page = Object.values(j.query?.pages ?? {})[0];
      const meta = page?.imageinfo?.[0]?.extmetadata;
      if (!meta) return null;

      const author = meta['Artist']?.value ? plainText(meta['Artist'].value) : '';
      const licence = meta['LicenseShortName']?.value ? plainText(meta['LicenseShortName'].value) : '';
      if (!author && !licence) return null;
      return { author: author || null, licence: licence || null } satisfies ImageLicence;
    } catch {
      return null;
    }
  });
}

export async function pageInfo(title: string): Promise<WikiPage | null> {
  const info = await cached(`wiki:${title}`, MONTH, async () => {
    try {
      const res = await fetchWithBackoff(SUMMARY + encodeTitle(title));
      if (!res || !res.ok) return null;
      const j = (await res.json()) as {
        title?: string;
        description?: string;
        originalimage?: { source?: string };
        thumbnail?: { source?: string };
      };
      const lead = (j.originalimage?.source ?? j.thumbnail?.source ?? null)?.split('?')[0] ?? null;
      return {
        title: j.title ?? title,
        description: j.description ?? '',
        image: lead ? sized(lead, STAGE_WIDTH) : null,
        imageFull: lead,
        // The API's own thumbnail width is cached by definition — don't touch it.
        thumb: j.thumbnail?.source?.split('?')[0] ?? null,
        // `image`, `imageFull` and `thumb` are all renders of the same file, so
        // one credit covers whichever of them a stage ends up showing.
        credit: creditFor(lead),
      } satisfies WikiPage;
    } catch {
      return null;
    }
  });

  // Entries cached before credits existed have no `credit` field, and the cache
  // is a month deep — so returning players would go on seeing uncredited
  // pictures for weeks. Filling it in on the way out fixes those without
  // invalidating the cache, which would have cost every one of them a fresh
  // round trip per round. The credit comes off the URL, so this is free.
  if (info && !info.credit) return { ...info, credit: creditFor(info.imageFull ?? info.image) };
  return info;
}
