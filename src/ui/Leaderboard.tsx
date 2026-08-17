import { useEffect, useState } from 'react';
import { fetchBoard, myId, type Board, type Entry } from '../lib/leaderboard';
import { formatScore } from '../lib/scoring';
import { removeScores, useModerator } from '../lib/moderation';

export function Leaderboard(props: { slug: string; accent: string; refreshKey?: number; limit?: number }) {
  const [board, setBoard] = useState<Board | null>(null);
  const [me, setMe] = useState<string>('');
  const isMod = useModerator();
  // Rows removed in this tab, so a takedown is visible immediately instead of
  // waiting for whatever refetches the board next.
  const [gone, setGone] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    setBoard(null);
    setGone([]);
    fetchBoard(props.slug, props.limit ?? 25).then((b) => alive && setBoard(b));
    myId().then((id) => alive && setMe(id));
    return () => {
      alive = false;
    };
  }, [props.slug, props.refreshKey, props.limit]);

  if (!board) {
    return <div className="board board-empty shimmer">Loading the board…</div>;
  }

  const entries = board.entries.filter((e) => !gone.includes(e.playerId));

  return (
    <div className="board">
      <div className="board-head">
        <h3>Leaderboard</h3>
        <span className={`board-src ${board.source}`}>
          {board.source === 'global' ? 'Global' : 'This device'}
        </span>
      </div>

      {board.note && <p className="board-note">{board.note}</p>}

      {entries.length === 0 ? (
        <p className="board-empty-msg">
          Nobody has posted a score yet. Play a run and the first name here is yours.
        </p>
      ) : (
        <ol className={`board-list ${isMod ? 'board-list-mod' : ''}`}>
          {entries.map((e, i) => (
            <li key={`${e.playerId}-${i}`} className={`board-row ${e.playerId === me ? 'you' : ''}`}>
              <span className="board-rank" style={i === 0 ? { color: props.accent } : undefined}>
                {i + 1}
              </span>
              <span className="board-handle">
                {e.handle}
                {e.playerId === me && <em className="board-you">you</em>}
              </span>
              <span className="board-meta">
                {e.roundsWon}✓ · {e.bestStreak}🔥
              </span>
              <span className="board-score">{formatScore(e.score)}</span>
              {isMod && (
                <BoardRemove
                  slug={props.slug}
                  entry={e}
                  onRemoved={() => setGone((g) => [...g, e.playerId])}
                />
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

type RemoveState = 'idle' | 'confirm' | 'removing' | 'failed';

/**
 * The moderator's takedown, one per row.
 *
 * This is the answer to the other half of the handle problem: the database can
 * refuse a new slur (0005_handle_guard.sql), but a board that already has one on
 * it needed a human with a delete, and until now the only one was in the
 * Supabase dashboard.
 *
 * It renders for nobody else. `useModerator()` — which asks the database, and
 * whose answer is a row the `moderators` SELECT policy will only ever show to
 * its owner — is false for signed-out visitors, anonymous sessions, every
 * signed-in account that is not a moderator, and for everyone while the check is
 * still in flight. So there is no element to reveal, nothing disabled, and
 * nothing that flashes before it hides. Editing that away in devtools gets you
 * as far as the DELETE, which RLS then matches against zero rows.
 *
 * Two clicks on purpose. A misfire here deletes somebody's run, which unlike a
 * hidden round has no undo — the score is gone. Quiet enough not to distract
 * from the board (see `.board-mod`), explicit enough not to be an accident.
 */
function BoardRemove(props: { slug: string; entry: Entry; onRemoved: () => void }) {
  const { slug, entry } = props;
  const [state, setState] = useState<RemoveState>('idle');

  const remove = () => {
    setState('removing');
    removeScores(slug, entry.playerId)
      .then((ok) => (ok ? props.onRemoved() : setState('failed')))
      .catch(() => setState('failed'));
  };

  if (state === 'idle') {
    return (
      <span className="board-mod">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setState('confirm')}
          title={`Remove “${entry.handle}” from this board`}
        >
          Remove
        </button>
      </span>
    );
  }

  return (
    <span className="board-mod board-mod-confirm">
      <span className={`mod-note ${state === 'failed' ? 'mod-note-bad' : ''}`}>
        {state === 'failed' ? "That didn't work." : 'Remove?'}
      </span>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={remove}
        disabled={state === 'removing'}
      >
        {state === 'removing' ? 'Removing…' : 'Remove'}
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => setState('idle')}
        disabled={state === 'removing'}
      >
        Cancel
      </button>
    </span>
  );
}
