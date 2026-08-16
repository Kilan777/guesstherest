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

let scriptRequested = false;

/** Loads AdSense once. Called from main.tsx; safe to call repeatedly. */
export function initAds(): void {
  if (scriptRequested || !adsEnabled()) return;
  // Never load a tracker into an automated browser or a local dev run.
  if (import.meta.env.DEV || navigator.webdriver) return;
  scriptRequested = true;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(CLIENT)}`;
  document.head.appendChild(s);
}

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
