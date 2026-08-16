import { useEffect, useMemo, useState } from 'react';
import type { GameDef } from '../engine/types';
import { useGameSession } from '../engine/session';
import { GuessSearch } from './GuessSearch';
import { ChoiceGrid } from './ChoiceGrid';
import { YearGuess } from './YearGuess';
import { Leaderboard } from './Leaderboard';
import { formatScore, levelValue } from '../lib/scoring';
import { localBest } from '../lib/leaderboard';
import { triggerPlay } from '../engine/player';

export function GameScreen(props: { game: GameDef; onExit: () => void; onOpenSettings: () => void }) {
  const { game } = props;
  const [option, setOption] = useState<string | undefined>(undefined);
  const session = useGameSession(game, option);
  const [boardKey, setBoardKey] = useState(0);

  const disabledIds = useMemo(
    () => new Set(session.wrongGuesses.map((o) => o.id)),
    [session.wrongGuesses],
  );

  // Keyboard shortcuts. Deliberately inert while a text field has focus —
  // "s" and "r" are letters people need for typing a guess — so the search box
  // also takes Escape to blur, which hands the keys back.
  const { phase, revealMore, skipRound, next } = session;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
        return;
      }
      const key = e.key.toLowerCase();
      if (phase === 'revealed') {
        if (e.key === 'Enter') {
          e.preventDefault();
          next();
        } else if (e.key === ' ') {
          // The answer is on screen and still playable — let space replay it.
          e.preventDefault();
          if (!triggerPlay()) next();
        }
        return;
      }
      if (phase !== 'playing') return;
      if (e.key === ' ') {
        e.preventDefault();
        // Space belongs to the media if this game has any; games without a
        // player fall back to buying the next rung.
        if (!triggerPlay()) revealMore();
      } else if (key === 'r') {
        e.preventDefault();
        revealMore();
      } else if (key === 's') {
        e.preventDefault();
        skipRound();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, revealMore, skipRound, next]);

  // Games that offer variants ask first; the answer decides the deck and, for
  // the emoji game, what the guess list contains.
  if (session.phase === 'choosing' && game.options) {
    return (
      <div className="screen" style={{ ['--accent' as string]: game.accent }}>
        <TopBar game={game} onExit={props.onExit} />
        <div className="panel picker">
          <h2>{game.options.label}</h2>
          {game.options.hint && <p>{game.options.hint}</p>}
          <div className="picker-grid">
            {game.options.choices.map((c) => (
              <button
                key={c.id}
                type="button"
                className="picker-choice"
                onClick={() => setOption(c.id)}
              >
                {c.emoji && (
                  <span className="picker-emoji" aria-hidden>
                    {c.emoji}
                  </span>
                )}
                <span className="picker-label">{c.label}</span>
                {c.blurb && <span className="picker-blurb">{c.blurb}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (session.phase === 'loading') {
    return (
      <div className="screen" style={{ ['--accent' as string]: game.accent }}>
        <TopBar game={game} onExit={props.onExit} />
        <div className="panel loading">
          <div className="spinner" style={{ borderTopColor: game.accent }} />
          <p>Dealing…</p>
        </div>
      </div>
    );
  }

  // The rest of the deck streams in behind the first rounds, so this is only
  // reached if the network is slower than the player.
  if (session.phase === 'buffering') {
    return (
      <div className="screen" style={{ ['--accent' as string]: game.accent }}>
        <TopBar game={game} onExit={props.onExit} />
        <div className="panel loading">
          <div className="spinner" style={{ borderTopColor: game.accent }} />
          <p>
            Round {session.roundIndex + 1} is still loading…
          </p>
        </div>
      </div>
    );
  }

  if (session.phase === 'error') {
    return (
      <div className="screen" style={{ ['--accent' as string]: game.accent }}>
        <TopBar game={game} onExit={props.onExit} />
        <div className="panel gate">
          <h2>That didn't load</h2>
          <p>{session.error}</p>
          <div className="gate-actions">
            <button type="button" className="btn btn-primary" onClick={session.restart}>
              Try again
            </button>
            <button type="button" className="btn btn-ghost" onClick={props.onOpenSettings}>
              Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (session.phase === 'finished') {
    const perfect = session.roundsWon === session.totalRounds;
    return (
      <div className="screen" style={{ ['--accent' as string]: game.accent }}>
        <TopBar game={game} onExit={props.onExit} />
        <div className="panel finish">
          <p className="finish-kicker">Run complete</p>
          <h2 className="finish-score" style={{ color: game.accent }}>
            {formatScore(session.score)}
          </h2>
          <div className="finish-stats">
            <span>
              <strong>
                {session.roundsWon}/{session.totalRounds}
              </strong>
              solved
            </span>
            <span>
              <strong>{session.bestStreak}</strong>best streak
            </span>
            <span>
              <strong>{formatScore(localBest(game.slug))}</strong>your best
            </span>
          </div>
          {perfect && <p className="finish-perfect">Clean sweep. Every single one.</p>}
          <p className="finish-sync">
            {session.submitted === 'pending' && 'Posting your score…'}
            {session.submitted === 'global' && 'Posted to the global leaderboard.'}
            {session.submitted === 'local' &&
              'Saved on this device. Add Supabase credentials in Settings to compete globally.'}
          </p>
          <div className="gate-actions">
            <button
              type="button"
              className="btn btn-primary"
              style={{ background: game.accent }}
              onClick={() => {
                session.restart();
                setBoardKey((k) => k + 1);
              }}
            >
              Play again
            </button>
            {game.options && (
              <button type="button" className="btn btn-ghost" onClick={() => setOption(undefined)}>
                Change {game.options.label.toLowerCase().replace(/[?.]/g, '')}
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={props.onExit}>
              Back to games
            </button>
          </div>
        </div>
        <Leaderboard slug={game.slug} accent={game.accent} refreshKey={boardKey} />
      </div>
    );
  }

  const round = session.round;
  if (!round) return null;

  const revealed = session.phase === 'revealed';
  const atStake = levelValue(session.level, session.totalLevels);
  const lastRung = session.level >= session.totalLevels - 1;
  const Stage = game.Stage;

  return (
    <div className="screen" style={{ ['--accent' as string]: game.accent }}>
      <TopBar game={game} onExit={props.onExit} />

      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">Round</span>
          <strong>
            {session.roundIndex + 1}
            <em>/{session.totalRounds}</em>
          </strong>
        </div>
        <div className="hud-item">
          <span className="hud-label">Score</span>
          <strong>{formatScore(session.score)}</strong>
        </div>
        <div className="hud-item">
          <span className="hud-label">Streak</span>
          <strong>{session.streak > 0 ? `${session.streak}🔥` : '—'}</strong>
        </div>
        <div className="hud-item">
          <span className="hud-label">At stake</span>
          <strong style={{ color: game.accent }}>{revealed ? '—' : formatScore(atStake)}</strong>
        </div>
      </div>

      <ol className="ladder" aria-label="Reveal ladder">
        {game.levels.map((label, i) => (
          <li
            key={label + i}
            className={`rung ${i < session.level ? 'spent' : ''} ${i === session.level && !revealed ? 'current' : ''}`}
            style={i <= session.level ? { borderColor: game.accent } : undefined}
          >
            <span className="rung-dot" style={i <= session.level ? { background: game.accent } : undefined} />
            <span className="rung-label">{label}</span>
          </li>
        ))}
      </ol>

      <Stage
        round={round}
        level={session.level}
        totalLevels={session.totalLevels}
        revealed={revealed}
        outcome={session.outcome}
        accent={game.accent}
      />

      {revealed && game.guess === 'choice' && round.choices && (
        <ChoiceGrid
          choices={round.choices}
          onGuess={() => {}}
          disabledIds={disabledIds}
          answerId={round.answer.id}
          revealed
          accent={game.accent}
          locked
        />
      )}

      {revealed ? (
        <div className={`verdict ${session.outcome}`}>
          <div className="verdict-text">
            {session.outcome === 'won' ? (
              <>
                <strong style={{ color: game.accent }}>
                  {session.lastAccuracy === 1 ? 'Got it.' : 'Close enough.'}
                </strong>
                <span>+{formatScore(session.lastAward)} points</span>
              </>
            ) : (
              <>
                <strong>Out of rungs.</strong>
                <span>
                  It was <b>{round.answer.label}</b>
                  {round.answer.sublabel ? ` — ${round.answer.sublabel}` : ''}.
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: game.accent }}
            onClick={session.next}
            autoFocus
          >
            {session.roundIndex + 1 >= session.totalRounds ? 'See results' : 'Next round'}
            <kbd className="kbd-on-solid">↵</kbd>
          </button>
        </div>
      ) : (
        <div className="controls">
          {game.guess === 'search' && session.deck && (
            <GuessSearch
              catalog={session.deck.catalog}
              onGuess={session.guess}
              disabledIds={disabledIds}
              accent={game.accent}
            />
          )}

          {game.guess === 'choice' && round.choices && (
            <ChoiceGrid
              choices={round.choices}
              onGuess={session.guess}
              disabledIds={disabledIds}
              answerId={round.answer.id}
              revealed={false}
              accent={game.accent}
              locked={false}
            />
          )}

          {game.guess === 'year' && game.yearRange && (
            <YearGuess
              range={game.yearRange}
              onGuess={session.guessYear}
              tried={session.wrongGuesses}
              accent={game.accent}
              disabled={false}
              roundId={round.id}
            />
          )}

          <div className="control-row">
            {/* Two different things: buy another rung, or abandon the round.
                On the last rung there is nothing left to buy. */}
            {!lastRung && (
              <button type="button" className="btn btn-skip" onClick={session.revealMore}>
                {game.skipLabel}
                <em>−{formatScore(atStake - levelValue(session.level + 1, session.totalLevels))} pts</em>
                <kbd>R</kbd>
              </button>
            )}
            <button type="button" className="btn btn-skip btn-forfeit" onClick={session.skipRound}>
              Skip round
              <em>scores 0</em>
              <kbd>S</kbd>
            </button>
            <p className="shortcut-hint">
              {game.guess === 'search'
                ? 'Esc leaves the search box, then Space plays · R reveals · S skips'
                : 'Space plays · R reveals more · S skips the round'}
            </p>
            {game.guess === 'search' && session.wrongGuesses.length > 0 && (
              <p className="tried">
                Tried: {session.wrongGuesses.map((o) => o.label).join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TopBar(props: { game: GameDef; onExit: () => void }) {
  return (
    <header className="topbar">
      {/* A bare arrow was too easy to miss, especially once the page went
          light — this says where it goes. */}
      <button type="button" className="back-btn" onClick={props.onExit}>
        <span aria-hidden>←</span>
        <em style={{ fontStyle: 'normal' }}>All games</em>
      </button>
      <div className="topbar-title">
        <span className="topbar-emoji" aria-hidden>
          {props.game.emoji}
        </span>
        <h1>{props.game.title}</h1>
      </div>
      <span className="topbar-tagline">{props.game.tagline}</span>
    </header>
  );
}
