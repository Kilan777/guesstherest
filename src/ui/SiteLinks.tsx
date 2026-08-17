/**
 * The written pages, linked from inside the app.
 *
 * The prerendered documents (scripts/prerender.mjs) carry these links in their
 * own footers, but the moment the app boots it replaces #root and those are
 * gone — leaving a site that serves ads and offers no way to reach its privacy
 * policy, which is the breach the whole prerender effort exists to fix. So the
 * app renders them too, in the one place a footer belongs and again under a
 * finished run, where someone who deep-linked into a game will actually see
 * them.
 *
 * Plain hrefs, not hash routes: these are real documents at real URLs, and
 * handing them to the router would only turn a working link into a blank
 * screen. scripts/prerender.mjs warns at build time if any of these paths
 * stops being generated.
 */
export function SiteLinks(props: { className?: string }) {
  return (
    <nav className={`site-links ${props.className ?? ''}`} aria-label="Site information">
      <a href="/how-to-play/">How to play</a>
      <a href="/about/">About</a>
      <a href="/privacy/">Privacy</a>
      <a href="/terms/">Terms</a>
      <a href="/cookies/">Cookies</a>
    </nav>
  );
}
