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

export default defineConfig({
  plugins: [react(), adsenseTag()],
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
          react: ['react', 'react-dom', 'react-dom/client'],
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
