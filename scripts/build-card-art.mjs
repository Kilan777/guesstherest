/**
 * Bakes the game cards' artwork into the repo as small local images.
 *
 * The cards used to be hand-drawn SVG, which read as clip-art. These are real
 * photographs of the thing each game is about, pulled from the same source the
 * games themselves use — Wikipedia lead images, and the iTunes artwork endpoint
 * for the app game.
 *
 * They are downloaded and resized at build time rather than hotlinked, because
 * the home page shows thirty cards at once and thirty remote images is exactly
 * the cold-start cost this site has spent so much effort removing. Each finished
 * card is a ~15 KB WebP served from our own origin.
 *
 * Licensing is recorded as it downloads: every file's licence and author come
 * back from the Commons API and are written to src/content/art-credits.ts, which
 * the credits page renders. Run: node scripts/build-card-art.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.resolve('public/art');
const CREDITS = path.resolve('src/content/art-credits.ts');
const W = 480;
const H = 270;
const UA = 'GuessTheRest/1.0 (https://guesstherest.com; card art build script)';

/**
 * One entry per game card. `photo` is a single image cropped to the card;
 * `grid` tiles several, which suits the games whose subject is a set of things
 * rather than one thing (logos, faces).
 */
const PLAN = {
  animal: { layout: 'photo', wiki: ['Red panda'] },
  bird: { layout: 'photo', wiki: ['Atlantic puffin'] },
  insect: { layout: 'photo', wiki: ['Monarch butterfly'] },
  plant: { layout: 'photo', wiki: ['Monstera deliciosa'] },
  dish: { layout: 'photo', wiki: ['Paella'] },
  recipe: { layout: 'photo', wiki: ['Mise en place'] },
  landmark: { layout: 'photo', wiki: ['Machu Picchu'] },
  capital: { layout: 'photo', wiki: ['Prague'] },
  skyline: { layout: 'photo', wiki: ['Manhattan'] },
  country: { layout: 'photo', wiki: ['Great Ocean Road'] },
  car: { layout: 'photo', wiki: ['Porsche 911'] },
  sport: { layout: 'photo', wiki: ['Basketball'] },
  boardgame: { layout: 'photo', wiki: ['Chess'] },
  object: { layout: 'photo', wiki: ['Typewriter'] },
  word: { layout: 'photo', wiki: ['Scrabble'] },
  outline: { layout: 'photo', wiki: ['World map'] },
  videogame: { layout: 'photo', wiki: ['Game controller'] },
  scene: { layout: 'photo', files: ['File:Kino Atlas Interier J.jpg'] },
  year: { layout: 'photo', wiki: ['Marquee (structure)'] },
  rebus: { layout: 'photo', wiki: ['Emoji'] },
  // Sets of things rather than one thing.
  // Named files, not article lead images: "FedEx" as an article leads with a
  // photo of an aeroplane, which is not what a logo game looks like.
  logo: {
    layout: 'grid',
    files: [
      'File:Coca-Cola logo.svg',
      'File:Logo NIKE.svg',
      'File:IBM logo.svg',
      "File:McDonald's Golden Arches.svg",
      'File:Adidas Logo.svg',
      'File:LEGO logo.svg',
    ],
  },
  celebrity: {
    layout: 'grid',
    wiki: ['Keanu Reeves', 'Zendaya', 'Idris Elba', 'Emma Stone', 'Pedro Pascal', 'Viola Davis'],
  },
  quote: {
    layout: 'grid',
    wiki: ['Albert Einstein', 'Mark Twain', 'Winston Churchill', 'Maya Angelou', 'Nelson Mandela', 'Marie Curie'],
  },
  // The app game's pictures are iTunes artwork, same as the game itself.
  app: { layout: 'grid', apps: ['Spotify', 'Duolingo', 'Airbnb', 'Uber', 'Shazam', 'Headspace'] },
};

const get = async (url, as = 'json') => {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return as === 'json' ? res.json() : Buffer.from(await res.arrayBuffer());
};

/** Lead image for a Wikipedia article, plus the licence of the underlying file. */
async function wikiImage(title) {
  const q =
    'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages' +
    `&piprop=original&redirects=1&titles=${encodeURIComponent(title)}`;
  const data = await get(q);
  const page = Object.values(data?.query?.pages ?? {})[0];
  const src = page?.original?.source;
  if (!src) throw new Error(`no lead image for "${title}"`);

  // The API appends tracking params; the filename is the path's last segment.
  const file = 'File:' + decodeURIComponent(new URL(src).pathname.split('/').pop());
  let licence = 'see Wikimedia Commons';
  let author = 'Wikimedia Commons';
  try {
    const meta = await get(
      'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
        `&prop=imageinfo&iiprop=extmetadata&titles=${encodeURIComponent(file)}`,
    );
    const info = Object.values(meta?.query?.pages ?? {})[0]?.imageinfo?.[0]?.extmetadata ?? {};
    const strip = (v) => (v ? String(v.value).replace(/<[^>]*>/g, '').trim() : '');
    licence = strip(info.LicenseShortName) || licence;
    author = strip(info.Artist) || author;
  } catch {
    /* Credit falls back to a plain Commons pointer. */
  }
  // Many logos are SVG on Commons, and sharp needs a raster. Special:FilePath
  // hands back a rendered PNG when asked for a width.
  const url = src.toLowerCase().includes('.svg')
    ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.slice(5))}?width=400`
    : src;
  return { url, file, licence, author, subject: title };
}

/** A named Commons file, for when an article's lead image is the wrong picture. */
async function commonsFile(title) {
  const meta = await get(
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
      `&prop=imageinfo&iiprop=url|extmetadata&titles=${encodeURIComponent(title)}`,
  );
  const page = Object.values(meta?.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.url) throw new Error(`no such Commons file: ${title}`);
  const strip = (v) => (v ? String(v.value).replace(/<[^>]*>/g, '').trim() : '');
  const ext = info.extmetadata ?? {};
  const url = info.url.toLowerCase().endsWith('.svg')
    ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title.slice(5))}?width=400`
    : info.url;
  return {
    url,
    file: title,
    licence: strip(ext.LicenseShortName) || 'see Wikimedia Commons',
    author: strip(ext.Artist) || 'Wikimedia Commons',
    subject: strip(ext.ObjectName) || title.slice(5).replace(/\.[a-z]+$/i, ''),
  };
}

/** iTunes artwork, keyless — the same lookup the app game uses at runtime. */
async function appImage(name) {
  const data = await get(
    `https://itunes.apple.com/search?media=software&limit=1&term=${encodeURIComponent(name)}`,
  );
  const hit = data?.results?.[0];
  if (!hit?.artworkUrl100) throw new Error(`no app artwork for "${name}"`);
  return {
    url: hit.artworkUrl100.replace(/100x100bb/, '512x512bb'),
    licence: 'App Store artwork',
    author: hit.artistName ?? name,
    subject: hit.trackName ?? name,
  };
}

const fit = (buf, w, h) =>
  sharp(buf, { failOn: 'none' })
    .rotate()
    .resize(w, h, { fit: 'cover', position: 'attention' })
    .toBuffer();

async function compose(spec, sources) {
  const buffers = await Promise.all(sources.map((s) => get(s.url, 'buf')));
  if (spec.layout === 'photo') return fit(buffers[0], W, H);

  // 3 × 2 tiles, each padded onto white so logos with transparency don't come
  // out as black squares.
  const cols = 3;
  const rows = 2;
  const tw = Math.round(W / cols);
  const th = Math.round(H / rows);
  const tiles = await Promise.all(
    buffers.slice(0, cols * rows).map(async (b, i) => ({
      input: await sharp(b, { failOn: 'none' })
        .rotate()
        .resize(tw - 8, th - 8, { fit: 'contain', background: '#ffffff' })
        .flatten({ background: '#ffffff' })
        .extend({ top: 4, bottom: 4, left: 4, right: 4, background: '#ffffff' })
        .toBuffer(),
      left: (i % cols) * tw,
      top: Math.floor(i / cols) * th,
    })),
  );
  return sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .composite(tiles)
    // Without an explicit format a created image comes back as raw pixels,
    // which nothing downstream can read.
    .png()
    .toBuffer();
}

await mkdir(OUT, { recursive: true });
const credits = {};
const failures = [];

for (const [slug, spec] of Object.entries(PLAN)) {
  try {
    const names = spec.wiki ?? spec.files ?? spec.apps;
    const lookup = spec.wiki ? wikiImage : spec.files ? commonsFile : appImage;
    // Sequential with a pause: the Commons API returns a plain-text "too many
    // requests" body under load, which fails in a confusing way as JSON.
    const settled = [];
    for (const n of names) {
      settled.push(await lookup(n).catch((e) => e));
      await new Promise((r) => setTimeout(r, 350));
    }
    const sources = settled.filter((s) => !(s instanceof Error));
    const missing = settled.filter((s) => s instanceof Error);
    if (!sources.length) throw new Error(missing.map((e) => e.message).join('; '));

    const out = await compose(spec, sources);
    const webp = await sharp(out).webp({ quality: 78 }).toBuffer();
    await writeFile(path.join(OUT, `${slug}.webp`), webp);
    credits[slug] = sources.map(({ subject, licence, author, file }) => ({
      subject,
      licence,
      author,
      file: file ?? null,
    }));
    const warn = missing.length ? `  (skipped ${missing.length}: ${missing[0].message})` : '';
    console.log(`  ${slug.padEnd(11)} ${String(Math.round(webp.length / 1024)).padStart(3)} KB  ${sources.map((s) => s.subject).join(', ')}${warn}`);
  } catch (err) {
    failures.push(`${slug}: ${err.message}`);
    console.log(`  ${slug.padEnd(11)} FAILED — ${err.message}`);
  }
}

const body = `/**
 * Generated by scripts/build-card-art.mjs — do not edit by hand.
 *
 * Every photograph on a game card, with the licence it came under and who made
 * it. The credits page renders this; CC-BY and CC-BY-SA both require the
 * attribution to be shown, so it has to live somewhere a reader can reach.
 */
export type ArtCredit = { subject: string; licence: string; author: string; file: string | null };

export const ART_CREDITS: Record<string, ArtCredit[]> = ${JSON.stringify(credits, null, 2)};
`;
await writeFile(CREDITS, body);

console.log(`\n  ${Object.keys(credits).length} cards written to public/art, credits to src/content/art-credits.ts`);
if (failures.length) {
  console.log(`  ${failures.length} failed:\n   - ${failures.join('\n   - ')}`);
  process.exitCode = 1;
}
