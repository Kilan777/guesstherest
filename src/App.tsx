import { useCallback, useEffect, useState } from 'react';
import { Home } from './ui/Home';
import { GameScreen } from './ui/GameScreen';
import { Settings } from './ui/Settings';
import { gameBySlug } from './games';

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
        <Home key={version} onPlay={play} onOpenSettings={() => setSettingsOpen(true)} />
      )}

      {settingsOpen && (
        <Settings
          onClose={() => {
            setSettingsOpen(false);
            setVersion((v) => v + 1);
          }}
        />
      )}
    </>
  );
}
