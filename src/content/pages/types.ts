/**
 * Written pages — the readable half of the site.
 *
 * Everything here is prose that exists as real HTML at a real URL, generated at
 * build time by scripts/prerender.mjs. That matters for one specific reason:
 * this app is a hash-routed single-page app, so every screen in it lives at
 * `guesstherest.com/` and a visitor arriving without JavaScript sees an empty
 * document. AdSense reviewed exactly that document, found no publisher content
 * on a page carrying ad code, and declined the site. These pages are the answer:
 * genuine writing about each game, at its own address, that stands up on its own
 * whether or not the app ever boots.
 *
 * Paragraphs are plain strings, not HTML — the generator escapes them. Keep the
 * writing specific to the subject; a page that says nothing a reader could not
 * have guessed from the title is the thing being complained about, not the fix.
 */

export type Section = {
  heading: string;
  /** One string per paragraph. */
  body: string[];
};

export type Article = {
  /** URL path, e.g. 'games/song' → /games/song/. No leading or trailing slash. */
  path: string;
  /** <h1> and the basis of <title>. */
  title: string;
  /** <meta name="description">. One sentence, under ~155 characters. */
  description: string;
  /** Opening paragraphs, before the first heading. */
  intro: string[];
  sections: Section[];
  /**
   * Set on a game's page: adds a "Play it" link through to the game itself, and
   * lets the generator pull the card artwork in as the page's illustration.
   */
  gameSlug?: string;
  /** Kept out of the sitemap and marked noindex — for legal boilerplate. */
  utility?: boolean;
};
