#!/usr/bin/env node
/**
 * Writes the readable half of the site as real HTML at real URLs.
 *
 * The app is hash-routed, so every screen in it lives at `guesstherest.com/`
 * and a fetch of that URL returns a document whose body is one empty <div>.
 * AdSense reviewed exactly that — a blank page carrying ad code — and declined
 * the site. This runs after `vite build` and fixes the shape of the problem
 * rather than the symptom:
 *
 *  - every Article in src/content/pages becomes dist/<path>/index.html: a
 *    complete, styled, standalone document with the prose as real markup,
 *  - dist/index.html gets a static introduction and the full game list injected
 *    into #root, so the home document says something before any JavaScript runs
 *    (the app replaces it on boot; it is honest content, not a hidden layer),
 *  - dist/sitemap.xml is regenerated from the same list, so the pages are
 *    discoverable rather than merely present.
 *
 * The content modules are TypeScript, so they are bundled to a temp .mjs with
 * esbuild (already present via Vite) and imported. Two of the three source
 * files may legitimately be empty arrays while they are being written; that is
 * a smaller site, not an error.
 */

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import * as esbuild from 'esbuild';
import { loadEnv } from 'vite';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, 'dist');
const ORIGIN = 'https://guesstherest.com';

const env = loadEnv('production', ROOT, 'VITE_');
const ADSENSE_CLIENT = env.VITE_ADSENSE_CLIENT || 'ca-pub-8046311729398937';
/**
 * The article unit. Empty until a unit exists in the AdSense dashboard, in
 * which case the pages carry the loader only and auto ads decide — the same
 * rule AdSlot.tsx follows, because an <ins> with no slot id is logged as an
 * error rather than filled.
 */
const ADSENSE_SLOT_ARTICLE = env.VITE_ADSENSE_SLOT_ARTICLE || '';
/**
 * No ad on a page that has not earned one. Google's objection was ads without
 * publisher content; a short page with a unit on it is the same complaint in
 * miniature, so the unit only appears once there is a real read above it.
 */
const AD_MIN_WORDS = 250;

/* ── loading the content ──────────────────────────────────────────────────── */

/**
 * Bundles the .ts content and game metadata into something node can import.
 *
 * src/games/index.ts holds one dynamic import per game pointing at a .tsx
 * module full of components; none of that is needed to read a title and a
 * tagline, and bundling it would drag JSX and the whole engine in. Those
 * specifiers are marked external instead — the import expressions survive into
 * the output unevaluated, and nothing here ever calls loadGame.
 */
async function loadModules() {
  const dir = mkdtempSync(join(tmpdir(), 'guessthe-prerender-'));
  const out = join(dir, 'content.mjs');

  const articlesFrom = process.env.PRERENDER_ARTICLES || resolve(ROOT, 'src/content/pages/index.ts');

  await esbuild.build({
    stdin: {
      contents:
        `export { ARTICLES } from ${JSON.stringify(articlesFrom)};\n` +
        `export { GAMES } from ${JSON.stringify(resolve(ROOT, 'src/games/index.ts'))};\n`,
      resolveDir: ROOT,
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    outfile: out,
    logLevel: 'warning',
    plugins: [
      {
        name: 'external-game-modules',
        setup(build) {
          build.onResolve({ filter: /^\.\/[a-z0-9-]+$/ }, (args) => {
            if (!args.importer.endsWith('/src/games/index.ts')) return null;
            return { path: args.path, external: true };
          });
        },
      },
    ],
  });

  const mod = await import(`file://${out}`);
  rmSync(dir, { recursive: true, force: true });
  return { articles: mod.ARTICLES ?? [], games: mod.GAMES ?? [] };
}

/* ── text handling ────────────────────────────────────────────────────────── */

/** Article prose is plain text, never markup. Everything it contains is escaped. */
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const words = (a) =>
  [a.title, a.description, ...a.intro, ...a.sections.flatMap((s) => [s.heading, ...s.body])]
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;

const urlFor = (path) => `${ORIGIN}/${path.replace(/^\/+|\/+$/g, '')}/`;
const hrefFor = (path) => `/${path.replace(/^\/+|\/+$/g, '')}/`;

/* ── the pieces every page shares ─────────────────────────────────────────── */

/**
 * Pulled out of the built index.html rather than hardcoded: the CSS filename
 * carries a content hash that changes on every meaningful edit, and the loader
 * tag is owned by the adsenseTag plugin in vite.config.ts. Reading them here
 * keeps one copy of each fact.
 */
function readBuiltHtml() {
  const file = resolve(DIST, 'index.html');
  if (!existsSync(file)) {
    throw new Error('dist/index.html is missing — run `vite build` before prerendering.');
  }
  const html = readFileSync(file, 'utf8');
  const css = /<link rel="stylesheet"[^>]*href="([^"]+\.css)"/.exec(html)?.[1] ?? '';
  const adsense =
    /<script async src="https:\/\/pagead2\.googlesyndication\.com[^"]*"[^>]*><\/script>/.exec(
      html,
    )?.[0] ?? '';
  return { file, html, css, adsense };
}

const HEAD_ICONS = `<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png?v=2" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
    <link rel="manifest" href="/site.webmanifest" />`;

function header(links) {
  return `<header class="doc-head">
      <a class="doc-brand" href="/">
        <span class="doc-brand-mark" aria-hidden="true">🎯</span>
        <span class="doc-brand-name">GuessThe<em>Rest</em></span>
      </a>
      <nav class="doc-nav" aria-label="Site">
        <a href="/">All games</a>
        ${links.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join('\n        ')}
      </nav>
    </header>`;
}

function footer(utilityPages) {
  const legal = utilityPages
    .map((a) => `<a href="${hrefFor(a.path)}">${esc(a.title)}</a>`)
    .join('\n        ');
  return `<footer class="doc-foot">
      <p>
        Guess The Rest is a free set of guessing games — no account, no install. Audio previews come
        from the iTunes Search API; photographs and paintings from Wikipedia.
      </p>
      <nav class="doc-foot-nav" aria-label="Footer">
        <a href="/">Home</a>
        ${legal}
      </nav>
    </footer>`;
}

/**
 * The ad unit as it appears on an article page: labelled, below the writing,
 * and only where there is a substantial amount of it. Without a configured
 * slot id nothing is emitted and the loader's auto ads decide placement.
 */
function adUnit(article) {
  if (!ADSENSE_SLOT_ARTICLE || words(article) < AD_MIN_WORDS || article.utility) return '';
  return `<aside class="doc-ad" aria-label="Advertisement">
        <span class="doc-ad-label">Advertisement</span>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${esc(ADSENSE_CLIENT)}"
             data-ad-slot="${esc(ADSENSE_SLOT_ARTICLE)}"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </aside>`;
}

/* ── an article page ──────────────────────────────────────────────────────── */

function articlePage(article, ctx) {
  const { guides, gamePages, utilityPages, css, adsense, gameBySlug, hasArt } = ctx;

  const url = urlFor(article.path);
  const meta = article.gameSlug ? gameBySlug.get(article.gameSlug) : undefined;
  const art = article.gameSlug && hasArt(article.gameSlug) ? `/art/${article.gameSlug}.webp` : '';

  // Siblings start after this page in the list and wrap around, so no page
  // gets the same six neighbours and every game page is linked from several
  // others rather than from one hub.
  const others = gamePages.filter((a) => a.path !== article.path);
  const start = Math.max(0, gamePages.findIndex((a) => a.path === article.path));
  const siblings = others.length
    ? Array.from({ length: Math.min(6, others.length) }, (_, i) => others[(start + i) % others.length])
    : [];

  const navLinks = guides.slice(0, 3).map((g) => ({ href: hrefFor(g.path), label: g.title }));

  const intro = article.intro.map((p) => `<p>${esc(p)}</p>`).join('\n        ');

  const play = article.gameSlug
    ? `<div class="doc-play">
          ${art ? `<img class="doc-play-art" src="${art}" width="320" height="180" alt="${esc(article.title)} card artwork" />` : ''}
          <div class="doc-play-body">
            <p class="doc-play-line">${esc(meta?.tagline ?? 'Play it in the browser — no account, no install.')}</p>
            <a class="doc-play-btn" href="/#/play/${esc(article.gameSlug)}">Play ${esc(meta?.title ?? article.title)}</a>
            ${meta ? `<p class="doc-play-meta">${meta.rounds} rounds · ${meta.levels.length} clue levels · ${meta.needsNetwork ? 'needs a connection' : 'works offline'}</p>` : ''}
          </div>
        </div>`
    : '';

  const sections = article.sections
    .map(
      (s) => `<section class="doc-section">
          <h2>${esc(s.heading)}</h2>
          ${s.body.map((p) => `<p>${esc(p)}</p>`).join('\n          ')}
        </section>`,
    )
    .join('\n        ');

  const related = [
    guides.length
      ? `<section class="doc-related-group">
            <h2>Guides</h2>
            <ul>
              ${guides
                .map(
                  (g) =>
                    `<li><a href="${hrefFor(g.path)}">${esc(g.title)}</a><span>${esc(g.description)}</span></li>`,
                )
                .join('\n              ')}
            </ul>
          </section>`
      : '',
    siblings.length
      ? `<section class="doc-related-group">
            <h2>More games</h2>
            <ul>
              ${siblings
                .map(
                  (g) =>
                    `<li><a href="${hrefFor(g.path)}">${esc(g.title)}</a><span>${esc(g.description)}</span></li>`,
                )
                .join('\n              ')}
            </ul>
          </section>`
      : '',
  ]
    .filter(Boolean)
    .join('\n        ');

  const ogImage = art ? `${ORIGIN}${art}` : `${ORIGIN}/icon-512.png`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#f4f3ec" />
    <title>${esc(article.title)} — Guess The Rest</title>
    <meta name="description" content="${esc(article.description)}" />
    ${article.utility ? '<meta name="robots" content="noindex, follow" />' : ''}
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Guess The Rest" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(article.title)}" />
    <meta property="og:description" content="${esc(article.description)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    ${HEAD_ICONS}
    ${css ? `<link rel="stylesheet" href="${css}" />` : ''}
    <link rel="stylesheet" href="/article.css" />
  <body class="doc-body">
    ${header(navLinks)}
    <main class="doc-main">
      <article class="doc-article">
        <h1>${esc(article.title)}</h1>
        ${intro}
        ${play}
        ${sections}
      </article>
      ${adUnit(article)}
      <aside class="doc-related" aria-label="More on Guess The Rest">
        ${related}
      </aside>
    </main>
    ${footer(utilityPages)}
    ${/* No ad code at all on a utility page — no unit, and no loader either.
          There is nothing to monetise on a privacy policy, and boilerplate
          carrying ads is the "little publisher content" complaint in its purest
          form. Verification reads the home document, which still has the tag. */
      article.utility ? '' : adsense}
  </body>
</html>
`;
}

/* ── the home document ────────────────────────────────────────────────────── */

/**
 * Fills #root with the real thing.
 *
 * Not hidden, not in a <noscript>: a visitor without JavaScript reads an
 * introduction and a linked list of every game, and a visitor with JavaScript
 * sees the same list a fraction of a second later as the interactive launcher
 * that replaces it. Cloaking is showing the crawler something the reader never
 * gets; this is the reader's own content, served early.
 */
function homeContent(games, articles) {
  const byGame = new Map(articles.filter((a) => a.gameSlug).map((a) => [a.gameSlug, a]));
  const guides = articles.filter((a) => !a.utility && !a.gameSlug);

  const items = games
    .map((g) => {
      const article = byGame.get(g.slug);
      const read = article
        ? ` <a class="static-read" href="${hrefFor(article.path)}">How it works</a>`
        : '';
      return `<li class="static-item">
            <h3><a href="/#/play/${esc(g.slug)}">${esc(g.title)}</a></h3>
            <p>${esc(g.tagline)}</p>
            <p class="static-links"><a href="/#/play/${esc(g.slug)}">Play</a>${read}</p>
          </li>`;
    })
    .join('\n          ');

  const guideList = guides.length
    ? `<section class="static-section">
          <h2>Reading</h2>
          <ul class="static-guides">
            ${guides
              .map(
                (g) =>
                  `<li><a href="${hrefFor(g.path)}">${esc(g.title)}</a> — ${esc(g.description)}</li>`,
              )
              .join('\n            ')}
          </ul>
        </section>`
    : '';

  return `<div class="static-home">
        <h1>Guess The Rest — ${games.length} guessing games</h1>
        <p class="static-lede">
          Every game here works the same way: you get the smallest possible piece of something —
          a tenth of a second of a song, one frame of a film, a single street corner — and you name
          it. Ask for more and you keep playing, but the round is worth less. The whole score is in
          how little you needed.
        </p>
        <p class="static-lede">
          Nothing to install, no account to make, and ${games.filter((g) => !g.needsNetwork).length}
          of the ${games.length} games work with the connection off. Pick one below.
        </p>
        ${guideList}
        <section class="static-section">
          <h2>All ${games.length} games</h2>
          <ul class="static-grid">
          ${items}
          </ul>
        </section>
        ${legalList(articles)}
      </div>`;
}

function legalList(articles) {
  const legal = articles.filter((a) => a.utility);
  if (!legal.length) return '';
  return `<p class="static-links">
          ${legal.map((a) => `<a href="${hrefFor(a.path)}">${esc(a.title)}</a>`).join('\n          ')}
        </p>`;
}

const HOME_STYLE = `<style>
      /* Styles for the static introduction inside #root. It is replaced by the
         app on boot, so these rules only ever apply before that happens or when
         JavaScript never runs. */
      .static-home { max-width: 74ch; margin: 0 auto; padding: 28px clamp(16px, 4vw, 32px) 64px; }
      .static-home h1 { font-size: clamp(1.7rem, 4.6vw, 2.5rem); color: #1f5136; margin-bottom: 14px; }
      .static-home h2 { font-size: 1.25rem; color: #143524; margin: 34px 0 10px; }
      .static-home h3 { font-size: 1.02rem; margin: 0 0 2px; }
      .static-lede { font-size: 1.05rem; color: #4d5a51; margin: 0 0 12px; }
      .static-guides { padding-left: 20px; color: #4d5a51; }
      .static-guides li { margin-bottom: 6px; }
      .static-grid { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
      .static-item { background: #fff; border: 1px solid #e2e1d4; border-radius: 14px; padding: 14px 16px; }
      .static-item p { margin: 0 0 6px; color: #4d5a51; font-size: 0.94rem; }
      .static-links { display: flex; gap: 14px; font-size: 0.9rem; }
      .static-home a { color: #1f5136; }
    </style>`;

/* ── run ──────────────────────────────────────────────────────────────────── */

function writePage(path, html) {
  const dir = resolve(DIST, path.replace(/^\/+|\/+$/g, ''));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

async function main() {
  const { articles, games } = await loadModules();
  const built = readBuiltHtml();

  if (!built.css) console.warn('prerender: no stylesheet found in dist/index.html');
  if (!built.adsense) console.warn('prerender: no AdSense loader found in dist/index.html');

  const gameBySlug = new Map(games.map((g) => [g.slug, g]));
  const hasArt = (slug) => existsSync(resolve(DIST, 'art', `${slug}.webp`));

  const guides = articles.filter((a) => !a.utility && !a.gameSlug);
  const gamePages = articles.filter((a) => !a.utility && a.gameSlug);
  const utilityPages = articles.filter((a) => a.utility);

  const ctx = {
    guides,
    gamePages,
    utilityPages,
    css: built.css,
    adsense: built.adsense,
    gameBySlug,
    hasArt,
  };

  const seen = new Set();
  for (const article of articles) {
    const key = article.path.replace(/^\/+|\/+$/g, '');
    if (seen.has(key)) throw new Error(`prerender: two articles share the path "${key}"`);
    seen.add(key);
    writePage(key, articlePage(article, ctx));
  }

  // The home document: real content inside #root, plus the rules that style it.
  const marker = '<div id="root"></div>';
  if (built.html.includes(marker)) {
    const html = built.html
      .replace('</head>', `  ${HOME_STYLE}\n  </head>`)
      .replace(marker, `<div id="root">\n      ${homeContent(games, articles)}\n    </div>`);
    writeFileSync(built.file, html);
  } else if (!built.html.includes('class="static-home"')) {
    console.warn('prerender: #root not found in dist/index.html — home content not injected');
  }
  // Already injected: a second run over the same dist (rerunning the script by
  // hand) leaves the home page as it is rather than nesting another copy.

  // Article stylesheet. Written here rather than kept in public/ so the pages
  // and their styles can never drift apart in a deploy.
  writeFileSync(resolve(DIST, 'article.css'), ARTICLE_CSS);

  // src/ui/SiteLinks.tsx links to these by hand — the app cannot import the
  // article list without pulling every word of it into the entry chunk. If a
  // path is renamed in src/content/pages, this is where you find out, rather
  // than in a 404.
  for (const path of ['how-to-play', 'about', 'privacy', 'terms', 'cookies']) {
    if (!existsSync(resolve(DIST, path, 'index.html'))) {
      console.warn(
        `prerender: src/ui/SiteLinks.tsx links to /${path}/ but no page was generated for it`,
      );
    }
  }

  const urls = [
    { loc: `${ORIGIN}/`, priority: '1.0', changefreq: 'weekly' },
    ...articles
      .filter((a) => !a.utility)
      .map((a) => ({ loc: urlFor(a.path), priority: '0.7', changefreq: 'monthly' })),
  ];
  writeFileSync(
    resolve(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls
        .map(
          (u) =>
            `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
        )
        .join('\n') +
      `\n</urlset>\n`,
  );

  console.log(
    `prerender: ${articles.length} page${articles.length === 1 ? '' : 's'} ` +
      `(${gamePages.length} games, ${guides.length} guides, ${utilityPages.length} noindex), ` +
      `${urls.length} sitemap URLs, ${games.length} games listed on the home page`,
  );
}

/* ── stylesheet for the written pages ─────────────────────────────────────── */

/**
 * Layered on top of the app's own stylesheet, which the pages link first: the
 * palette, the typeface and the body rules all come from there, so an article
 * and the launcher are visibly the same site. What is here is only what a page
 * of prose needs and a game launcher does not — a measure, headings that sit in
 * a column, and a card for the play-through.
 */
const ARTICLE_CSS = `/* Generated by scripts/prerender.mjs — edit the script, not this file. */

.doc-body {
  background: var(--bg, #f4f3ec);
  color: var(--text, #16241c);
  font-family: var(--font, 'Inter', ui-sans-serif, system-ui, sans-serif);
  line-height: 1.6;
}

/* ── header ───────────────────────────────────────────────────────────────── */

.doc-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 22px;
  padding: 14px clamp(16px, 4vw, 40px);
  border-bottom: 1px solid var(--line-soft, #e2e1d4);
  background: var(--bg-raise, #fff);
}

.doc-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  color: var(--forest-deep, #143524);
  font-weight: 700;
  font-size: 1.06rem;
  letter-spacing: -0.02em;
}

.doc-brand-mark { font-size: 1.2rem; }
.doc-brand-name em { font-style: normal; color: var(--forest, #1f5136); opacity: 0.75; }

.doc-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin-left: auto;
  font-size: 0.92rem;
}

.doc-nav a { color: var(--text-dim, #4d5a51); text-decoration: none; }
.doc-nav a:hover { color: var(--forest, #1f5136); text-decoration: underline; }

/* ── article ──────────────────────────────────────────────────────────────── */

.doc-main {
  max-width: 72ch;
  margin: 0 auto;
  padding: clamp(24px, 5vw, 46px) clamp(16px, 4vw, 28px) 60px;
}

.doc-article h1 {
  font-size: clamp(1.75rem, 5vw, 2.6rem);
  line-height: 1.12;
  letter-spacing: -0.025em;
  color: var(--forest-deep, #143524);
  margin: 0 0 18px;
}

.doc-article > p {
  font-size: 1.08rem;
  color: var(--text-dim, #4d5a51);
  margin: 0 0 16px;
}

.doc-section { margin-top: 34px; }

.doc-section h2 {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  letter-spacing: -0.02em;
  color: var(--forest, #1f5136);
  margin: 0 0 10px;
  padding-top: 16px;
  border-top: 1px solid var(--line-soft, #e2e1d4);
}

.doc-section p {
  margin: 0 0 14px;
  font-size: 1.02rem;
}

/* ── play-through card ────────────────────────────────────────────────────── */

.doc-play {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  margin: 26px 0 8px;
  padding: 16px;
  background: var(--bg-raise, #fff);
  border: 1px solid var(--line-soft, #e2e1d4);
  border-radius: var(--radius, 14px);
  box-shadow: 0 10px 30px -18px rgba(20, 53, 36, 0.4);
}

.doc-play-art {
  width: 200px;
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm, 9px);
  display: block;
}

.doc-play-body { flex: 1 1 220px; }

.doc-play-line {
  margin: 0 0 12px;
  font-size: 1.02rem;
  color: var(--text, #16241c);
}

.doc-play-btn {
  display: inline-block;
  background: var(--forest, #1f5136);
  color: #fff;
  text-decoration: none;
  font-weight: 650;
  padding: 10px 18px;
  border-radius: 999px;
}

.doc-play-btn:hover { background: var(--forest-deep, #143524); }

.doc-play-meta {
  margin: 10px 0 0;
  font-size: 0.86rem;
  color: var(--text-faint, #7b877e);
}

/* ── ad ───────────────────────────────────────────────────────────────────── */

.doc-ad {
  margin: 40px 0 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Labelled, because an unlabelled ad that looks like site content is exactly
   what the policies prohibit. */
.doc-ad-label {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-faint, #7b877e);
}

/* ── related ──────────────────────────────────────────────────────────────── */

.doc-related { margin-top: 44px; }

.doc-related-group + .doc-related-group { margin-top: 26px; }

.doc-related-group h2 {
  font-size: 1.02rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-faint, #7b877e);
  margin: 0 0 10px;
}

.doc-related ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.doc-related li {
  background: var(--bg-raise, #fff);
  border: 1px solid var(--line-soft, #e2e1d4);
  border-radius: var(--radius-sm, 9px);
  padding: 11px 14px;
}

.doc-related a {
  color: var(--forest, #1f5136);
  font-weight: 600;
  text-decoration: none;
}

.doc-related a:hover { text-decoration: underline; }

.doc-related span {
  display: block;
  font-size: 0.88rem;
  color: var(--text-dim, #4d5a51);
  margin-top: 2px;
}

/* ── footer ───────────────────────────────────────────────────────────────── */

.doc-foot {
  border-top: 1px solid var(--line-soft, #e2e1d4);
  padding: 24px clamp(16px, 4vw, 40px) 40px;
  background: var(--bg-raise, #fff);
}

.doc-foot p {
  max-width: 72ch;
  margin: 0 auto 12px;
  font-size: 0.88rem;
  color: var(--text-dim, #4d5a51);
}

.doc-foot-nav {
  max-width: 72ch;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  font-size: 0.88rem;
}

.doc-foot-nav a { color: var(--forest, #1f5136); }

@media (max-width: 560px) {
  .doc-nav { margin-left: 0; width: 100%; }
  .doc-play { gap: 14px; }
  .doc-play-art { width: 100%; }
}
`;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
