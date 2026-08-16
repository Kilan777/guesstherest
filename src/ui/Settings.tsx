import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../lib/settings';
import { setHandle, randomHandle } from '../lib/identity';
import { ensureSession } from '../lib/supabase';

export function Settings(props: { onClose: () => void }) {
  const s = getSettings();
  const [handle, setHandleValue] = useState(s.handle);
  const [supabaseUrl, setSupabaseUrl] = useState(s.supabaseUrl);
  const [supabaseKey, setSupabaseKey] = useState(s.supabaseKey);
  const [sfx, setSfx] = useState(s.sfx);

  const [sbState, setSbState] = useState<'idle' | 'checking' | 'ok' | 'bad'>('idle');
  const [sbMsg, setSbMsg] = useState('');

  // Escape closes without saving, like every other dialog on the web.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [props]);

  async function checkSupabase() {
    updateSettings({ supabaseUrl, supabaseKey });
    setSbState('checking');
    const uid = await ensureSession();
    if (uid) {
      setSbState('ok');
      setSbMsg('Connected — scores will post to the global board.');
    } else {
      setSbState('bad');
      setSbMsg(
        'Could not sign in. Check the URL and key, and make sure anonymous sign-ins are enabled under Authentication → Sign In / Providers.',
      );
    }
  }

  function saveAll() {
    setHandle(handle);
    updateSettings({ supabaseUrl, supabaseKey, sfx });
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
            />
            <button type="button" className="btn btn-ghost" onClick={() => setHandleValue(randomHandle())}>
              Random
            </button>
          </div>
          <p className="hint-text">
            Shown next to your scores. Signing in with Google replaces this with your Google name.
          </p>
        </section>

        <section className="field">
          <label htmlFor="set-sb-url">Supabase project URL</label>
          <input
            id="set-sb-url"
            value={supabaseUrl}
            onChange={(e) => {
              setSupabaseUrl(e.target.value);
              setSbState('idle');
            }}
            placeholder="https://xxxx.supabase.co"
            spellCheck={false}
          />
          <label htmlFor="set-sb-key">Supabase anon / publishable key</label>
          <div className="row">
            <input
              id="set-sb-key"
              value={supabaseKey}
              onChange={(e) => {
                setSupabaseKey(e.target.value);
                setSbState('idle');
              }}
              placeholder="eyJhbGciOi… or sb_publishable_…"
              spellCheck={false}
            />
            <button
              type="button"
              className="btn btn-ghost"
              onClick={checkSupabase}
              disabled={!supabaseUrl.trim() || !supabaseKey.trim()}
            >
              {sbState === 'checking' ? 'Checking…' : 'Test'}
            </button>
          </div>
          <p className={`hint-text ${sbState}`}>
            {sbMsg ||
              'Powers the global leaderboard and Google sign-in. Leave blank and everything still works — scores just stay on this device.'}
          </p>
        </section>

        <section className="field">
          <label className="checkbox">
            <input type="checkbox" checked={sfx} onChange={(e) => setSfx(e.target.checked)} />
            Sound effects
          </label>
        </section>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={props.onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={saveAll}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
