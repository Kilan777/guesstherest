import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../lib/settings';
import { setHandle, randomHandle } from '../lib/identity';

/**
 * Player-facing settings only: what you're called, and whether it makes noise.
 *
 * Supabase credentials used to be editable here, from when the site had no
 * backend of its own and every visitor had to bring one. They now ship in the
 * build (see `.env`), so exposing them as form fields only invited someone to
 * break their own leaderboard. Anyone self-hosting a fork configures them
 * through env vars, which is where deployment config belongs.
 */
export function Settings(props: { onClose: () => void }) {
  const s = getSettings();
  const [handle, setHandleValue] = useState(s.handle);
  const [sfx, setSfx] = useState(s.sfx);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [props]);

  function save() {
    setHandle(handle);
    updateSettings({ sfx });
    props.onClose();
  }

  return (
    <div className="modal-backdrop" onClick={props.onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Settings">
        <div className="modal-head">
          <h2>Settings</h2>
          <button type="button" className="icon-btn" onClick={props.onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <section className="field">
          <label htmlFor="set-handle">Leaderboard name</label>
          <div className="row">
            <input
              id="set-handle"
              value={handle}
              maxLength={20}
              onChange={(e) => setHandleValue(e.target.value)}
              placeholder="Pick a name"
              onKeyDown={(e) => e.key === 'Enter' && save()}
            />
            <button type="button" className="btn btn-ghost" onClick={() => setHandleValue(randomHandle())}>
              Random
            </button>
          </div>
          <p className="hint-text">
            Shown next to your scores. Signing in with Google replaces it with your Google name.
          </p>
        </section>

        <section className="field">
          <label className="checkbox">
            <input type="checkbox" checked={sfx} onChange={(e) => setSfx(e.target.checked)} />
            Sound effects
          </label>
          <p className="hint-text">
            The short blips on a right or wrong answer. Song clips are unaffected.
          </p>
        </section>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={props.onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
