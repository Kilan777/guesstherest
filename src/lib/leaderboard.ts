import { getSupabase, ensureSession } from './supabase';
import { getHandle, localPlayerId } from './identity';
import { load, save } from './storage';

export type Entry = {
  playerId: string;
  handle: string;
  score: number;
  roundsWon: number;
  bestStreak: number;
  createdAt: string;
};

export type RunResult = {
  score: number;
  roundsWon: number;
  bestStreak: number;
};

export type Board = {
  entries: Entry[];
  source: 'global' | 'local';
  /** Set when we wanted global but couldn't reach it. */
  note?: string;
};

const localKey = (game: string) => `board:${game}`;

function readLocal(game: string): Entry[] {
  return load<Entry[]>(localKey(game), []);
}

function writeLocal(game: string, run: RunResult): Entry[] {
  const entries = readLocal(game);
  entries.push({
    playerId: localPlayerId(),
    handle: getHandle(),
    score: run.score,
    roundsWon: run.roundsWon,
    bestStreak: run.bestStreak,
    createdAt: new Date().toISOString(),
  });
  entries.sort((a, b) => b.score - a.score);
  const top = entries.slice(0, 50);
  save(localKey(game), top);
  return top;
}

export function localBest(game: string): number {
  return readLocal(game)[0]?.score ?? 0;
}

/** Writes to the device board always; mirrors to Supabase when it's configured. */
export async function submitScore(game: string, run: RunResult): Promise<{ online: boolean }> {
  writeLocal(game, run);
  if (run.score <= 0) return { online: false };

  const sb = getSupabase();
  if (!sb) return { online: false };
  const uid = await ensureSession();
  if (!uid) return { online: false };

  const { error } = await sb.from('scores').insert({
    game_slug: game,
    player_id: uid,
    handle: getHandle(),
    score: run.score,
    rounds_won: run.roundsWon,
    best_streak: run.bestStreak,
  });
  if (error) {
    console.warn('[guess-the] score upload failed:', error.message);
    return { online: false };
  }
  return { online: true };
}

export async function fetchBoard(game: string, limit = 25): Promise<Board> {
  const sb = getSupabase();
  if (!sb) {
    return { entries: readLocal(game).slice(0, limit), source: 'local' };
  }
  try {
    // `leaderboard` is a view that keeps only each player's personal best.
    const { data, error } = await sb
      .from('leaderboard')
      .select('player_id, handle, score, rounds_won, best_streak, created_at')
      .eq('game_slug', game)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return {
      entries: (data ?? []).map((r) => ({
        playerId: r.player_id as string,
        handle: (r.handle as string) || 'anon',
        score: r.score as number,
        roundsWon: (r.rounds_won as number) ?? 0,
        bestStreak: (r.best_streak as number) ?? 0,
        createdAt: r.created_at as string,
      })),
      source: 'global',
    };
  } catch (err) {
    return {
      entries: readLocal(game).slice(0, limit),
      source: 'local',
      note: err instanceof Error ? err.message : 'Global board unreachable',
    };
  }
}

/** Your own Supabase user id, so the board can highlight your row. */
export async function myId(): Promise<string> {
  return (await ensureSession()) ?? localPlayerId();
}
