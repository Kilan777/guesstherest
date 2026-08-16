import { useEffect, useState } from 'react';
import { getSettings } from '../lib/settings';
import { randomHandle, setHandle } from '../lib/identity';

/**
 * Asked once, the first time someone signs in.
 *
 * Google hands over a real name, which is a reasonable default but a poor
 * leaderboard handle — plenty of people would rather not have their full name
 * on a public board. Either answer locks the choice, so later token refreshes
 * stop overwriting it, and Settings can change it any time after.
 */
export function NamePrompt(props: { suggested: string; onDone: () => void }) {
  const [name, setName] = useState(() => getSettings().handle || props.suggested);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [props]);

  function save(value: string) {
    setHandle(value);
    props.onDone();
  }

  return (
    <div className="modal-backdrop" onClick={props.onDone}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Choose a leaderboard name">
        <div className="modal-head">
          <h2>Pick a leaderboard name</h2>
        </div>

        <p className="hint-text">
          This is what shows next to your scores. Your Google name is filled in, but it does not
          have to be — you can change it here or in Settings whenever you like.
        </p>

        <section className="field">
          <div className="row">
            <input
              autoFocus
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && save(name)}
              aria-label="Leaderboard name"
            />
            <button type="button" className="btn btn-ghost" onClick={() => setName(randomHandle())}>
              Random
            </button>
          </div>
        </section>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={() => save(props.suggested)}>
            Use “{props.suggested}”
          </button>
          <button type="button" className="btn btn-primary" onClick={() => save(name)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
