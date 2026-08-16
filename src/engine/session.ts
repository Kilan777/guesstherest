import { useCallback, useEffect, useRef, useState } from 'react';
import type { Deck, GameDef, Option, Outcome, Round } from './types';
import { roundScore, yearAccuracy } from '../lib/scoring';
import { blip } from '../lib/audio';
import { getSettings } from '../lib/settings';
import { submitScore } from '../lib/leaderboard';
import { loadDeckOnce } from './warm';
import { recordPlay } from '../lib/history';

export type Phase = 'choosing' | 'loading' | 'error' | 'playing' | 'buffering' | 'revealed' | 'finished';

export type GuessFeedback = {
  option: Option;
  correct: boolean;
  /** Year mode: how close, 0..1. */
  accuracy?: number;
};

export type Session = {
  phase: Phase;
  error: string | null;
  deck: Deck | null;
  round: Round | null;
  roundIndex: number;
  totalRounds: number;
  level: number;
  totalLevels: number;
  wrongGuesses: Option[];
  outcome: Outcome;
  lastAward: number;
  lastAccuracy: number;
  score: number;
  streak: number;
  bestStreak: number;
  roundsWon: number;
  submitted: 'pending' | 'global' | 'local' | null;
  guess: (option: Option) => void;
  guessYear: (year: number) => void;
  skip: () => void;
  next: () => void;
  restart: () => void;
};

export function useGameSession(game: GameDef, option?: string): Session {
  const totalLevels = game.levels.length;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [phase, setPhase] = useState<Phase>(game.options && !option ? 'choosing' : 'loading');
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const [roundIndex, setRoundIndex] = useState(0);
  const [level, setLevel] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState<Option[]>([]);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [lastAward, setLastAward] = useState(0);
  const [lastAccuracy, setLastAccuracy] = useState(0);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [roundsWon, setRoundsWon] = useState(0);
  const [submitted, setSubmitted] = useState<'pending' | 'global' | 'local' | null>(null);

  const roundStart = useRef<number>(0);

  // Load (or reload) the deck.
  useEffect(() => {
    let cancelled = false;
    // Nothing to build until the player has answered the game's setup question.
    if (game.options && !option) {
      setPhase('choosing');
      return;
    }
    setPhase('loading');
    setError(null);
    // A deck warmed by hovering the card on the home page is usually already
    // finished by the time we get here.
    loadDeckOnce(game, String(nonce), option)
      .then((loaded) => {
        if (cancelled) return;
        if (!loaded.rounds.length) throw new Error('No rounds could be loaded.');
        setDeck(loaded);
        setRoundIndex(0);
        setLevel(0);
        setWrongGuesses([]);
        setOutcome(null);
        setScore(0);
        setStreak(0);
        setBestStreak(0);
        setRoundsWon(0);
        setLastAward(0);
        setSubmitted(null);
        roundStart.current = performance.now();
        setPhase('playing');

        // The rest of the deck streams in behind the first rounds. A player
        // spends far longer on round one than this takes, so it has always
        // landed by the time it's needed.
        loaded.rest
          ?.then((more) => {
            if (cancelled) return;
            // Pin `expected` to what actually arrived. If the tail came up
            // short — a few seeds with no usable media — the run has to end at
            // the real count, or the last round would buffer forever waiting
            // for rounds that were never coming.
            setDeck((d) =>
              d
                ? { ...d, rounds: [...d.rounds, ...more], expected: d.rounds.length + more.length }
                : d,
            );
          })
          .catch(() => {
            // Whatever loaded stays playable; the run just ends earlier.
            if (!cancelled) setDeck((d) => (d ? { ...d, expected: d.rounds.length } : d));
          });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Could not load this game.');
        setPhase('error');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, nonce, option]);

  const round = deck?.rounds[roundIndex] ?? null;
  const sfx = getSettings().sfx;

  // State updaters must stay pure: React invokes them twice under StrictMode, so
  // anything with a side effect inside one (enqueuing another setState, playing
  // a sound) runs twice and, in the case of `setScore(s => s + award)`, awards
  // the points twice. Everything below reads current state from scope instead.
  const finishRound = useCallback(
    (won: boolean, award: number, accuracy: number) => {
      setOutcome(won ? 'won' : 'lost');
      setLastAward(award);
      setLastAccuracy(accuracy);
      setPhase('revealed');
      if (won) {
        const nextStreak = streak + 1;
        setScore((s) => s + award);
        setRoundsWon((r) => r + 1);
        setStreak(nextStreak);
        setBestStreak((b) => Math.max(b, nextStreak));
      } else {
        setStreak(0);
      }
      if (sfx) blip(won ? 'correct' : 'reveal');
    },
    [sfx, streak],
  );

  const missStep = useCallback(() => {
    const next = level + 1;
    if (next >= totalLevels) {
      finishRound(false, 0, 0);
      return;
    }
    setLevel(next);
    if (sfx) blip('wrong');
  }, [finishRound, level, sfx, totalLevels]);

  const guess = useCallback(
    (option: Option) => {
      if (phase !== 'playing' || !round) return;
      if (option.id === round.answer.id) {
        const award = roundScore({
          level,
          totalLevels,
          elapsedMs: performance.now() - roundStart.current,
          streak,
        });
        finishRound(true, award, 1);
      } else {
        setWrongGuesses((w) => (w.some((o) => o.id === option.id) ? w : [...w, option]));
        missStep();
      }
    },
    [phase, round, level, totalLevels, streak, finishRound, missStep],
  );

  const guessYear = useCallback(
    (year: number) => {
      if (phase !== 'playing' || !round?.year) return;
      const accuracy = yearAccuracy(year, round.year);
      if (accuracy > 0) {
        const award = roundScore({
          level,
          totalLevels,
          elapsedMs: performance.now() - roundStart.current,
          streak,
          accuracy,
        });
        finishRound(true, award, accuracy);
      } else {
        setWrongGuesses((w) => [...w, { id: `y${year}`, label: String(year) }]);
        missStep();
      }
    },
    [phase, round, level, totalLevels, streak, finishRound, missStep],
  );

  const skip = useCallback(() => {
    if (phase !== 'playing') return;
    const next = level + 1;
    if (next >= totalLevels) {
      finishRound(false, 0, 0);
      return;
    }
    setLevel(next);
  }, [phase, level, totalLevels, finishRound]);

  const expected = deck ? (deck.expected ?? deck.rounds.length) : game.rounds;

  const next = useCallback(() => {
    if (phase !== 'revealed' || !deck) return;
    const nextIndex = roundIndex + 1;
    const total = deck.expected ?? deck.rounds.length;
    if (nextIndex >= total) {
      setPhase('finished');
      if (sfx) blip('finish');
      return;
    }
    setRoundIndex(nextIndex);
    // Reset before the buffering check — the new round starts clean either way,
    // and skipping this left the previous round's rungs and wrong guesses in
    // place when a round had to wait.
    setLevel(0);
    setWrongGuesses([]);
    setOutcome(null);
    setLastAward(0);
    roundStart.current = performance.now();

    // The round exists in the plan but hasn't streamed in yet — rare, but it
    // must not be mistaken for the end of the run.
    setPhase(nextIndex >= deck.rounds.length ? 'buffering' : 'playing');
  }, [phase, deck, roundIndex, sfx]);

  const restart = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (phase !== 'buffering' || !deck) return;
    if (deck.rounds[roundIndex]) {
      roundStart.current = performance.now();
      setPhase('playing');
    } else if (roundIndex >= (deck.expected ?? deck.rounds.length)) {
      setPhase('finished');
    }
  }, [phase, deck, roundIndex]);

  // Reset the per-round clock whenever a new round starts.
  useEffect(() => {
    if (phase === 'playing') roundStart.current = performance.now();
  }, [roundIndex, phase]);

  // Pull the next round's media down while this one is being played.
  useEffect(() => {
    if (!deck || !game.prefetch) return;
    const upcoming = deck.rounds[roundIndex + 1];
    if (upcoming) game.prefetch(upcoming);
  }, [deck, roundIndex, game]);

  // Post the run once, when the game ends.
  const posted = useRef(false);
  useEffect(() => {
    if (phase !== 'finished' || posted.current) return;
    posted.current = true;
    setSubmitted('pending');
    recordPlay(game.slug, score);
    submitScore(game.slug, { score, roundsWon, bestStreak })
      .then((r) => setSubmitted(r.online ? 'global' : 'local'))
      .catch(() => setSubmitted('local'));
  }, [phase, game.slug, score, roundsWon, bestStreak]);

  useEffect(() => {
    if (phase === 'loading') posted.current = false;
  }, [phase]);

  return {
    phase,
    error,
    deck,
    round,
    roundIndex,
    totalRounds: expected,
    level,
    totalLevels,
    wrongGuesses,
    outcome,
    lastAward,
    lastAccuracy,
    score,
    streak,
    bestStreak,
    roundsWon,
    submitted,
    guess,
    guessYear,
    skip,
    next,
    restart,
  };
}
