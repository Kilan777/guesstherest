import { useEffect } from 'react';

/**
 * Google AdSense.
 *
 * The publisher id is not a secret — it ships in the page source of every site
 * that runs AdSense — so it lives here with an env override rather than in a
 * secrets file that a deploy would have to be taught about.
 *
 * Two modes:
 *  - Auto ads: injecting the script is enough; Google decides placement. This
 *    is what runs today, because auto ads need only the client id.
 *  - Manual units: `<AdSlot slot="1234567890" />` once ad units exist in the
 *    AdSense dashboard. A slot with no id renders nothing rather than emitting
 *    an empty `<ins>`, which AdSense logs as an error.
 */
const CLIENT =
  (import.meta.env.VITE_ADSENSE_CLIENT as string) || 'ca-pub-8046311729398937';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const adsEnabled = () => CLIENT.trim().length > 0;

/**
 * Ad unit ids, set once you create units in the AdSense dashboard. Until then
 * the placements render nothing — auto ads still run from the loader script,
 * and an empty `<ins>` would just log errors.
 *
 * One entry, on purpose. Every screen the app itself draws after the home page
 * is interactive: a stage waiting for a guess, a score, a leaderboard. AdSense
 * calls those "screens used for alerts, navigation or other behavioral
 * purposes" and declined the site over exactly that, so the app carries a
 * single unit under the game list and nothing else. The written pages under
 * /games/ and /guides/ carry their own, from VITE_ADSENSE_SLOT_ARTICLE — they
 * are static HTML, so that one is read by scripts/prerender.mjs rather than
 * here.
 */
export const AD_SLOTS = {
  home: (import.meta.env.VITE_ADSENSE_SLOT_HOME as string) || '',
};

/**
 * No-op: the loader is now a static tag in the built HTML (see the adsenseTag
 * plugin in vite.config.ts), because verification reads the page source rather
 * than running the app. Kept so callers don't need to care, and so a second
 * copy of the script is never appended — loading adsbygoogle.js twice throws.
 */
export function initAds(): void {}

export function AdSlot(props: {
  /** Ad unit id from the AdSense dashboard. Without one, nothing renders. */
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}) {
  const { slot } = props;

  useEffect(() => {
    if (!slot || !adsEnabled() || import.meta.env.DEV) return;
    initAds();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* blocked by an extension, or the script never loaded — leave it empty */
    }
  }, [slot]);

  if (!slot || !adsEnabled() || import.meta.env.DEV) return null;

  return (
    <div className={`ad-slot ${props.className ?? ''}`}>
      <span className="ad-label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={props.format ?? 'auto'}
        data-full-width-responsive="true"
      />
    </div>
  );
}
