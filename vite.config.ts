import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const ADSENSE_CLIENT = 'ca-pub-8046311729398937';

/**
 * Puts the AdSense loader in <head> of the built HTML.
 *
 * It used to be injected by JavaScript at runtime, which works for serving ads
 * but fails site verification: Google fetches the page and looks for the
 * snippet in the source, and a script that only exists after React has booted
 * simply isn't there.
 *
 * Build-only, so local dev and headless test runs never load a tracker.
 */
function adsenseTag(): Plugin {
  return {
    name: 'adsense-tag',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>\n  </head>`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), adsenseTag()],
  server: { port: 5173, host: true },
  build: {
    rollupOptions: {
      output: {
        // Split the vendor libraries out so they cache across deploys, and so
        // their real cost is visible rather than hidden in one lump.
        manualChunks: {
          react: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
