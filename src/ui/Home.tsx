import { useEffect, useMemo, useRef, useState } from 'react';
import { GAMES, gameBySlug } from '../games';
import type { GameMeta } from '../engine/types';
import { localBest } from '../lib/leaderboard';
import { formatScore } from '../lib/scoring';
import { getHandle, needsHandle } from '../lib/identity';
import { useAuth } from '../lib/auth';
import { recentGames, trendingGames, type Trending } from '../lib/history';
import { warmDeck } from '../engine/warm';
import { CardArt, hasCardPhoto } from './CardArt';
import { ART_CREDITS } from '../content/art-credits';
import { NamePrompt } from './NamePrompt';
import { AdSlot, AD_SLOTS } from './AdSlot';
import { SiteLinks } from './SiteLinks';
import { Suggest } from './Suggest';

/**
 * Builds the featured decks while the page is idle.
 *
 * Hovering a card warms it, but a phone has no hover — the first signal there
 * is the tap itself, which is far too late for a game that needs a couple of
 * network round trips before round one exists. Skipped on metered or slow
 * connections, where spending a visitor's data on a game they may not open is
 * the wrong trade.
 */
function warmFeatured(slugs: string[]): void {
  const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData || /2g/.test(conn?.effectiveType ?? '')) return;

  const start = () => {
    const first = slugs.map(gameBySlug).find((g): g is GameMeta => !!g && g.needsNetwork);
    if (first) warmDeck(first);
  };

  const idle = (window as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void })
    .requestIdleCallback;
  if (idle) idle(start, { timeout: 2500 });
  else window.setTimeout(start, 1200);
}

export function Home(props: { onPlay: (slug: string) => void; onOpenSettings: () => void }) {
  const auth = useAuth();
  const [query, setQuery] = useState('');
  const [credits, setCredits] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [trending, setTrending] = useState<Trending | null>(null);
  const [localName] = useState(getHandle);
  // Asked once, right after a first sign-in.
  const [askName, setAskName] = useState(false);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    let alive = true;
    // Recently played is a signed-in feature — it follows the account, not the
    // browser, so there's nothing meaningful to show before you sign in.
    if (auth.status === 'signed-in' && auth.player) {
      recentGames(auth.player.id, 4).then((r) => alive && setRecent(r));
    } else {
      setRecent([]);
    }
    if (auth.status === 'signed-in' && auth.player && needsHandle() && !asked) {
      setAsked(true);
      setAskName(true);
    }
    trendingGames(3).then((t) => {
      if (!alive) return;
      setTrending(t);
      warmFeatured(t.slugs);
    });
    return () => {
      alive = false;
    };
  }, [auth.status, auth.player, asked]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GAMES;
    return GAMES.filter((g) =>
      [g.title, g.short, g.tagline, g.blurb, ...(g.keywords ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  const recentGamesList = recent.map(gameBySlug).filter((g): g is GameMeta => !!g);
  const trendingList = (trending?.slugs ?? []).map(gameBySlug).filter((g): g is GameMeta => !!g);
  const searching = query.trim().length > 0;

  // A game featured in a row above shouldn't appear again in the grid. Search
  // hides those rows entirely, so when searching nothing is held back.
  const shownAbove = new Set(
    searching ? [] : [...recentGamesList, ...trendingList].map((g) => g.slug),
  );
  const gridGames = matches.filter((g) => !shownAbove.has(g.slug));

  return (
    <div className="home">
      {askName && auth.player && (
        <NamePrompt suggested={auth.player.name} onDone={() => setAskName(false)} />
      )}
      <nav className="topnav">
        <a className="brand" href="#/" onClick={() => setQuery('')}>
          <span className="brand-mark">🎯</span>
          <span className="brand-text">
            <span className="brand-name">
              GuessThe<em>Rest</em>
            </span>
            <span className="brand-strap">
              {GAMES.length} guessing games — the fewer clues, the higher your score
            </span>
          </span>
        </a>

        <div className="nav-search">
          <span aria-hidden>⌕</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games"
            aria-label="Search games"
          />
          {searching && (
            <button type="button" className="nav-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <div className="nav-right">
          <button type="button" className="icon-btn" onClick={props.onOpenSettings} aria-label="Settings">
            ⚙
          </button>
          <AuthButton auth={auth} fallbackName={localName} onOpenSettings={props.onOpenSettings} />
        </div>
      </nav>

      {!searching && recentGamesList.length > 0 && (
        <Row title="Jump back in" hint="Your last few games">
          {recentGamesList.map((g) => (
            <Card key={g.slug} game={g} onPlay={props.onPlay} compact />
          ))}
        </Row>
      )}

      {!searching && trendingList.length > 0 && (
        <Row
          title="Trending now"
          hint="Where most people start"
        >
          {trendingList.map((g, i) => (
            <Card key={g.slug} game={g} onPlay={props.onPlay} rank={i + 1} compact />
          ))}
        </Row>
      )}

      <section className="section section-main">
        <div className="section-head">
          <h2>
            {searching
              ? `${matches.length} result${matches.length === 1 ? '' : 's'}`
              : shownAbove.size
                ? `The other ${gridGames.length} games`
                : `All ${GAMES.length} games`}
          </h2>
        </div>

        {gridGames.length === 0 ? (
          <p className="no-results">
            Nothing matches “{query}”. Try <em>song</em>, <em>movie</em>, <em>art</em> or <em>emoji</em>.
          </p>
        ) : (
          <div className="grid">
            {gridGames.map((g) => (
              <Card key={g.slug} game={g} onPlay={props.onPlay} />
            ))}
          </div>
        )}
      </section>

      <AdSlot slot={AD_SLOTS.home} format="horizontal" className="ad-home" />

      <Suggest />

      <footer className="site-foot">
        <p>
          Audio previews from the iTunes Search API · posters, photographs and paintings from
          Wikipedia · trailers from YouTube. No API keys, no account required. The only thing stored
          about you is the name you pick.
        </p>
        <div className="foot-links">
          <button type="button" className="link-btn" onClick={() => setCredits(true)}>
            Photo credits
          </button>
          <SiteLinks />
        </div>
      </footer>

      {credits && <CreditsPanel onClose={() => setCredits(false)} />}
    </div>
  );
}

function Row(props: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>{props.title}</h2>
        {props.hint && <span className="section-hint">{props.hint}</span>}
      </div>
      <div className="row-scroll">{props.children}</div>
    </section>
  );
}

function Card(props: {
  game: GameMeta;
  onPlay: (slug: string) => void;
  compact?: boolean;
  rank?: number;
}) {
  const { game: g } = props;
  const best = localBest(g.slug);
  // Hovering is a strong signal you're about to play, so the deck starts
  // loading now rather than after the click.
  const warmed = useRef(false);
  const warm = () => {
    if (warmed.current) return;
    warmed.current = true;
    warmDeck(g);
  };

  return (
    <article
      className={`card ${props.compact ? 'card-compact' : ''}`}
      style={{ ['--accent' as string]: g.accent }}
      onPointerEnter={warm}
      onPointerDown={warm}
      onFocusCapture={warm}
    >
      <button type="button" className="card-hit" onClick={() => props.onPlay(g.slug)}>
        <span className="sr-only">Play {g.title}</span>
      </button>

      <div className="card-art">
        <CardArt slug={g.slug} />
        {/* The badge belongs on the drawn cards, where it is part of the
            picture. On a photograph it just sits in front of the subject. */}
        {!hasCardPhoto(g.slug) && (
          <span className="card-emoji" aria-hidden>
            {g.emoji}
          </span>
        )}
        {props.rank && <span className="card-rank">#{props.rank}</span>}
        {!g.needsNetwork && <span className="card-flag">offline ready</span>}
      </div>

      <div className="card-body">
        <h3 className="card-title">{g.title}</h3>
        <p className="card-tagline">{g.tagline}</p>
        <div className="card-foot">
          <span className="card-best">
            {best > 0 ? (
              <>
                best <strong>{formatScore(best)}</strong>
              </>
            ) : (
              `${g.rounds} rounds`
            )}
          </span>
        </div>
      </div>
    </article>
  );
}

function AuthButton(props: {
  auth: ReturnType<typeof useAuth>;
  fallbackName: string;
  onOpenSettings: () => void;
}) {
  const { auth } = props;
  const [open, setOpen] = useState(false);

  if (auth.status === 'unavailable') {
    return (
      <button type="button" className="signin" onClick={props.onOpenSettings} title="Connect Supabase to enable sign-in">
        <span className="signin-avatar">{props.fallbackName.slice(0, 1)}</span>
        <span className="signin-label">
          <span>{props.fallbackName}</span>
          <em>local only</em>
        </span>
      </button>
    );
  }

  if (auth.status === 'signed-in' && auth.player) {
    return (
      <div className="signin-wrap">
        <button type="button" className="signin in" onClick={() => setOpen(!open)}>
          {auth.player.avatar ? (
            <img className="signin-avatar" src={auth.player.avatar} alt="" referrerPolicy="no-referrer" />
          ) : (
            <span className="signin-avatar">{auth.player.name.slice(0, 1)}</span>
          )}
          <span className="signin-label">
            <span>{auth.player.name}</span>
            <em>signed in</em>
          </span>
        </button>
        {open && (
          <div className="signin-menu">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void auth.signOut();
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button type="button" className="signin google" onClick={() => void auth.signInWithGoogle()}>
      <GoogleMark />
      <span className="signin-label">
        <span>Sign in</span>
        <em>optional</em>
      </span>
    </button>
  );
}

function GoogleMark() {
  return (
    <svg className="signin-avatar google-mark" viewBox="0 0 48 48" aria-hidden>
      <path fill="#4285F4" d="M45 24c0-1.6-.1-2.7-.4-4H24v7.5h12c-.2 2-1.5 5-4.4 7l6.7 5.2C42.2 36 45 30.6 45 24z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.9-12.5-9.1l-7.1 5.5C8.1 41 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 9.9l7.1-5.5z" />
      <path fill="#EA4335" d="M24 10.6c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C34.9 4 29.9 2 24 2 15.4 2 8.1 7 4.4 14.1l7.1 5.5c1.8-5.2 6.7-9 12.5-9z" />
    </svg>
  );
}

/**
 * Attribution for the card photographs. Most come from Wikimedia Commons under
 * CC-BY or CC-BY-SA, and both licences require the credit to be shown somewhere
 * a reader can actually get to — so it lives one click from the footer rather
 * than buried in the repository.
 */
function CreditsPanel(props: { onClose: () => void }) {
  const entries = Object.entries(ART_CREDITS);
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Photo credits" onClick={props.onClose}>
      <div className="modal credits-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Photo credits</h2>
          <button type="button" className="icon-btn" onClick={props.onClose} aria-label="Close">
            ×
          </button>
        </div>
        <p className="credits-intro">
          The photograph on each game card, and where it came from. Images from Wikimedia Commons
          are used under the licence shown; app icons are App Store artwork belonging to their
          publishers.
        </p>
        <ul className="credits-list">
          {entries.map(([slug, items]) => (
            <li key={slug}>
              <strong>{slug}</strong>
              <span>
                {items
                  .map((i) => `${i.subject} — ${i.author}${i.licence ? ` (${i.licence})` : ''}`)
                  .join(' · ')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
