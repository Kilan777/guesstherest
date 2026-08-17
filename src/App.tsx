import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { GameScreen } from './ui/GameScreen';
import { gameBySlug } from './games';

/**
 * The launcher is a route, not a prerequisite.
 *
 * Home is the biggest screen in the app — thirty-one cards, ~18 KB of hand-drawn
 * inline SVG in CardArt, the art credits, the suggestion box, sign-in — and a
 * player who opens `#/play/song` from a shared link never sees any of it. Kept
 * in the entry chunk it was downloaded, parsed and executed on the phone radio
 * that the first round was waiting for.
 *
 * Nobody pays a round trip for the split either way: the build writes a
 * `modulepreload` for whichever of the two routes the URL asks for (see
 * `routePreload` in vite.config.ts), so the home chunk starts downloading
 * alongside React for a visitor to the front page, exactly as it did when it
 * was welded to the entry.
 */
const Home = lazy(() => import('./ui/Home').then((m) => ({ default: m.Home })));
/** Opened by a button press, long after everything else has settled. */
const Settings = lazy(() => import('./ui/Settings').then((m) => ({ default: m.Settings })));

/** Hash routing — no dependency, and the whole site is two screens deep. */
function currentSlug(): string | null {
  const m = /^#\/play\/([a-z-]+)$/.exec(window.location.hash);
  return m?.[1] ?? null;
}

export function App() {
  const [slug, setSlug] = useState<string | null>(currentSlug);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const onHash = () => setSlug(currentSlug());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const play = useCallback((next: string) => {
    window.location.hash = `#/play/${next}`;
  }, []);

  const exit = useCallback(() => {
    window.location.hash = '';
  }, []);

  const game = slug ? gameBySlug(slug) : undefined;

  return (
    <>
      {game ? (
        // Remounting per slug (and per settings save) guarantees a clean deck
        // and no audio from the previous game still in flight.
        <GameScreen
          key={`${game.slug}:${version}`}
          game={game}
          onExit={exit}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      ) : (
        <Suspense fallback={null}>
          <Home key={version} onPlay={play} onOpenSettings={() => setSettingsOpen(true)} />
        </Suspense>
      )}

      {settingsOpen && (
        <Suspense fallback={null}>
          <Settings
            onClose={() => {
              setSettingsOpen(false);
              setVersion((v) => v + 1);
            }}
          />
        </Suspense>
      )}
    </>
  );
}
