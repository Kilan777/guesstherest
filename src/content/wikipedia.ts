import { cached, MONTH } from './cache';

const SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

export type WikiPage = {
  title: string;
  description: string;
  /** Stage-sized render. May 400 for files this width isn't cached for. */
  image: string | null;
  /** Guaranteed-good original, used if `image` fails to load. */
  imageFull: string | null;
  thumb: string | null;
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
export async function pageInfo(title: string): Promise<WikiPage | null> {
  return cached(`wiki:${title}`, MONTH, async () => {
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
      } satisfies WikiPage;
    } catch {
      return null;
    }
  });
}
