import { useEffect, useMemo, useState } from 'react';
import { getSettings } from '../lib/settings';
import { randomHandle, setHandle } from '../lib/identity';
import { checkHandle } from '../lib/handle-filter';

/**
 * Asked once, the first time someone signs in.
 *
 * Google hands over a real name, which is a reasonable default but a poor
 * leaderboard handle — plenty of people would rather not have their full name
 * on a public board. Either answer locks the choice, so later token refreshes
 * stop overwriting it, and Settings can change it any time after.
 */
export function NamePrompt(props: { suggested: string; onDone: () => void }) {
  // Prefill with the first thing that would actually be allowed, so nobody is
  // dropped into a dialog whose Save button is disabled before they've typed.
  const [name, setName] = useState(() => {
    const candidates = [getSettings().handle, props.suggested];
    return candidates.find((c) => c && checkHandle(c).ok) ?? randomHandle();
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [props]);

  const nameProblem = useMemo(() => {
    const verdict = checkHandle(name);
    return verdict.ok ? null : verdict.reason;
  }, [name]);

  // The suggestion comes from Google, so it gets the same treatment as anything
  // typed here — a real name can be too long for the board, or worse.
  const suggestedOk = checkHandle(props.suggested).ok;

  function save(value: string) {
    if (!checkHandle(value).ok) return;
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
              aria-invalid={nameProblem ? true : undefined}
              aria-describedby={nameProblem ? 'prompt-handle-error' : undefined}
            />
            <button type="button" className="btn btn-ghost" onClick={() => setName(randomHandle())}>
              Random
            </button>
          </div>
          {nameProblem && (
            <p className="hint-text bad" id="prompt-handle-error" role="alert">
              {nameProblem}
            </p>
          )}
        </section>

        <div className="modal-foot">
          {suggestedOk && (
            <button type="button" className="btn btn-ghost" onClick={() => save(props.suggested)}>
              Use “{props.suggested}”
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => save(name)}
            disabled={!!nameProblem}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
