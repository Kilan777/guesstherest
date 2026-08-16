import { useEffect, useState } from 'react';
import { fetchBoard, myId, type Board } from '../lib/leaderboard';
import { formatScore } from '../lib/scoring';

export function Leaderboard(props: { slug: string; accent: string; refreshKey?: number; limit?: number }) {
  const [board, setBoard] = useState<Board | null>(null);
  const [me, setMe] = useState<string>('');

  useEffect(() => {
    let alive = true;
    setBoard(null);
    fetchBoard(props.slug, props.limit ?? 25).then((b) => alive && setBoard(b));
    myId().then((id) => alive && setMe(id));
    return () => {
      alive = false;
    };
  }, [props.slug, props.refreshKey, props.limit]);

  if (!board) {
    return <div className="board board-empty shimmer">Loading the board…</div>;
  }

  return (
    <div className="board">
      <div className="board-head">
        <h3>Leaderboard</h3>
        <span className={`board-src ${board.source}`}>
          {board.source === 'global' ? 'Global' : 'This device'}
        </span>
      </div>

      {board.note && <p className="board-note">{board.note}</p>}

      {board.entries.length === 0 ? (
        <p className="board-empty-msg">
          Nobody has posted a score yet. Play a run and the first name here is yours.
        </p>
      ) : (
        <ol className="board-list">
          {board.entries.map((e, i) => (
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
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
