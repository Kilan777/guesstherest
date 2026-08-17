import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const ADSENSE_CLIENT = 'ca-pub-8046311729398937';

/**
 * Puts the AdSense loader in the built HTML, at the end of <body>.
 *
 * It used to be injected by JavaScript at runtime, which works for serving ads
 * but fails site verification: Google fetches the page and looks for the
 * snippet in the source, and a script that only exists after React has booted
 * simply isn't there. So it stays in the served HTML — but at the bottom, not
 * in <head>. The ad stack is 650 KB of JavaScript, more than everything this
 * site ships put together, and in <head> the browser starts pulling it before
 * the game's own code, on the same phone radio the audio preview needs.
 * Discovered last, it still loads and still verifies, but it stops competing
 * with the thing the player is waiting for.
 *
 * Build-only, so local dev and headless test runs never load a tracker.
 *
 * One thing this tag cannot decide, and the console must: Auto ads have to stay
 * OFF for this site. The whole app is one URL, so auto ads cannot be excluded
 * from the play and results screens by URL the way they normally would be — the
 * loader would place units on a screen showing a stopwatch and a leaderboard,
 * which is the exact placement the site was declined for. With auto ads off,
 * the loader fills only the units that are explicitly written into a page: one
 * under the game list on the home page, and one on each prerendered article.
 */
function adsenseTag(): Plugin {
  return {
    name: 'adsense-tag',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '</body>',
        `  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>\n  </body>`,
      );
    },
  };
}

/**
 * Starts a deep-linked game's own chunks downloading from the HTML.
 *
 * `#/play/song` is a route the server knows nothing about, so the chunks that
 * route needs used to be discovered three hops late: the browser fetched the
 * entry, the entry fetched React, React mounted, the game screen ran an effect,
 * *then* the game's module was requested, and only once that had parsed did its
 * song list follow. Five round trips of pure discovery latency on a phone,
 * before a single byte of the thing the player is waiting for had been asked
 * for. Every one of those chunks is knowable at build time from the hash in the
 * URL, so this writes the slug→chunks map into <head> and preloads them the
 * moment the HTML is parsed. They arrive alongside React instead of behind it,
 * and `loadGame` resolves out of the cache.
 *
 * Only the game's own chunks — the launcher's route gets nothing, since a
 * visitor to the home page is not waiting on any of them.
 */
function routePreload(): Plugin {
  let base = '/';
  return {
    name: 'route-preload',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;

        const chunks = Object.values(bundle).filter(
          (c): c is Extract<typeof c, { type: 'chunk' }> => c.type === 'chunk',
        );
        // Everything the entry already pulls in statically is in the HTML
        // already; preloading it again would only duplicate work.
        const entry = chunks.find((c) => c.isEntry);
        const already = new Set([entry?.fileName, ...(entry?.imports ?? [])].filter(Boolean));

        const byFile = new Map(chunks.map((c) => [c.fileName, c]));
        const map: Record<string, string[]> = {};

        for (const chunk of chunks) {
          const id = chunk.facadeModuleId ?? '';
          const m = /\/src\/games\/([a-z-]+)\.tsx$/.exec(id);
          if (!m) continue;

          // The game's module, whatever it statically imports, and one level of
          // its dynamic imports — which is where every game's seed data lives,
          // and the last link in the old waterfall.
          const want = new Set<string>([chunk.fileName]);
          for (const dep of chunk.imports) want.add(dep);
          for (const dyn of chunk.dynamicImports) {
            want.add(dyn);
            for (const dep of byFile.get(dyn)?.imports ?? []) want.add(dep);
          }
          const files = [...want].filter((f) => !already.has(f));
          if (files.length) map[m[1]] = files;
        }

        // The launcher is lazy too (see App.tsx), and every URL that is not a
        // game is the launcher — so it gets the same treatment under a key no
        // slug can collide with.
        const home = chunks.find((c) => /\/src\/ui\/Home\.tsx$/.test(c.facadeModuleId ?? ''));
        if (home) {
          const want = new Set<string>([home.fileName, ...home.imports]);
          map[''] = [...want].filter((f) => !already.has(f));
        }

        if (!Object.keys(map).length) return html;

        const script =
          `<script>(function(){var m=${JSON.stringify(map)},` +
          `s=(/^#\\/play\\/([a-z-]+)/.exec(location.hash)||[])[1]||"",c=m[s];if(!c)return;` +
          `for(var i=0;i<c.length;i++){var l=document.createElement("link");` +
          `l.rel="modulepreload";l.href=${JSON.stringify(base.endsWith('/') ? base : `${base}/`)}+c[i];` +
          `document.head.appendChild(l)}})()</script>`;

        return html.replace('</head>', `  ${script}\n  </head>`);
      },
    },
  };
}

/**
 * Makes `vite preview` compress the way the real host does.
 *
 * GitHub Pages gzips every text asset — the React chunk leaves the server as
 * 60 KB, not 194 KB. Vite's preview server sends them raw, so timing a
 * throttled load against it charges the phone for three times the bytes
 * production sends, and every conclusion drawn from that number is about a
 * site nobody is visiting. This serves the text assets itself, gzipped, rather
 * than wrapping the response stream — a wrapper has to cooperate with whatever
 * else is writing to the socket, and getting that wrong silently yields a gzip
 * of a gzip.
 *
 * Preview only. The build output and the dev server are untouched.
 */
function previewGzip(): Plugin {
  const TEXT = /\.(js|mjs|css|html|json|svg|webmanifest|map)$/;
  const TYPES: Record<string, string> = {
    js: 'text/javascript',
    mjs: 'text/javascript',
    css: 'text/css',
    html: 'text/html; charset=utf-8',
    json: 'application/json',
    map: 'application/json',
    svg: 'image/svg+xml',
    webmanifest: 'application/manifest+json',
  };
  return {
    name: 'preview-gzip',
    configurePreviewServer(server) {
      const root = resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '/').split('?')[0];
        if (req.method !== 'GET' || !TEXT.test(path)) return next();
        if (!/\bgzip\b/.test((req.headers['accept-encoding'] as string) ?? '')) return next();

        const file = resolve(root, `.${path}`);
        if (!file.startsWith(root) || !existsSync(file)) return next();

        const body = gzipSync(readFileSync(file), { level: 9 });
        res.setHeader('Content-Type', TYPES[path.split('.').pop() ?? ''] ?? 'application/octet-stream');
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Length', String(body.length));
        res.setHeader('Vary', 'Accept-Encoding');
        res.setHeader('Cache-Control', 'no-cache');
        res.end(body);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), adsenseTag(), routePreload(), previewGzip()],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/client': 'preact/compat/client',
      'react/jsx-runtime': 'preact/jsx-runtime',
      'react/jsx-dev-runtime': 'preact/jsx-dev-runtime',
    },
  },
  server: { port: 5173, host: true },
  build: {
    // Only needed for Safari below 16.4. It is 710 bytes at the top of the
    // entry chunk, which is 710 bytes ahead of the game starting.
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks: {
          // 'react-dom/client' is a different module id from 'react-dom', and
          // it is the one main.tsx actually imports. Leaving it out left the
          // 177 KB DOM client renderer in the app chunk, where every deploy
          // invalidated it. Naming it moves it somewhere that only changes when
          // React does.
          react: ['preact/compat', 'preact', 'preact/hooks', 'preact/jsx-runtime'],
          // Supabase is deliberately NOT listed. Naming a package here makes
          // Rollup treat its chunk as a static import of the entry, so Vite
          // writes a <link rel="modulepreload"> for it and the browser
          // downloads 132 KB before the first round — undoing the dynamic
          // import in src/lib/supabase.ts that was written to avoid exactly
          // that. Left alone, it stays a lazy chunk nobody pays for until they
          // open a leaderboard.
        },
      },
    },
  },
});
