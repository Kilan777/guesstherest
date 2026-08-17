import { useEffect, useState } from 'react';
import type { Round } from '../engine/types';
import { hideItem, unhideItem, useModerator } from '../lib/moderation';

type State = 'idle' | 'hiding' | 'hidden' | 'unhiding' | 'failed';

/**
 * The moderator's one control, shown under the verdict once the answer is out.
 *
 * Only on reveal, deliberately. Mid-round the moderator is a player like anyone
 * else and does not yet know what the round even was; by the reveal they have
 * seen the picture, heard the clip, read the answer, and can judge it. It also
 * means the control cannot be confused with a game action.
 *
 * For everyone else this renders nothing at all — not a hidden element, not a
 * disabled button. `useModerator()` is false for signed-out visitors, anonymous
 * sessions, and any signed-in account that is not in the `moderators` table,
 * and false is also what it returns while the check is still in flight, so
 * nothing ever flashes on screen for a normal player.
 */
export function ModeratorTools(props: { gameSlug: string; round: Round }) {
  const { gameSlug, round } = props;
  const isMod = useModerator();
  const [state, setState] = useState<State>('idle');

  // Each round starts clean — otherwise round two would open still showing
  // "Hidden" from round one.
  useEffect(() => setState('idle'), [round.id]);

  if (!isMod) return null;

  const hide = () => {
    setState('hiding');
    hideItem(gameSlug, round.id)
      .then((ok) => setState(ok ? 'hidden' : 'failed'))
      .catch(() => setState('failed'));
  };

  const undo = () => {
    setState('unhiding');
    unhideItem(gameSlug, round.id)
      .then((ok) => setState(ok ? 'idle' : 'failed'))
      .catch(() => setState('failed'));
  };

  return (
    <div className="mod-tools">
      {state === 'hidden' || state === 'unhiding' ? (
        <>
          <span className="mod-note">Hidden — it won't come up again.</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={undo}
            disabled={state === 'unhiding'}
          >
            {state === 'unhiding' ? 'Undoing…' : 'Undo'}
          </button>
        </>
      ) : (
        <>
          {state === 'failed' && (
            <span className="mod-note mod-note-bad">That didn't save. Try again?</span>
          )}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={hide}
            disabled={state === 'hiding'}
            title={`Never deal this round again (${round.id})`}
          >
            {state === 'hiding' ? 'Hiding…' : 'Hide this round'}
          </button>
        </>
      )}
    </div>
  );
}
