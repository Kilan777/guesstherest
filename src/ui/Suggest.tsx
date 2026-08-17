import { useState } from 'react';
import { getSupabase, ensureSession } from '../lib/supabase';

type State = 'idle' | 'sending' | 'sent' | 'error';

/**
 * "Which game should exist that doesn't?" — a footer form that writes to a
 * write-only Supabase table (see supabase/migrations/0003_suggestions.sql: the
 * table has an insert policy and no select policy, so nobody can read back what
 * anyone else wrote).
 *
 * Deliberately not a modal and not a required field anywhere: it sits at the
 * bottom of the launcher, and the only thing it asks for is the idea itself.
 */
export function Suggest() {
  const [idea, setIdea] = useState('');
  const [contact, setContact] = useState('');
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  const trimmed = idea.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < 3;
  const canSend = trimmed.length >= 3 && state !== 'sending';

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setState('sending');
    setError('');
    try {
      const sb = await getSupabase();
      if (!sb) throw new Error('Suggestions are offline right now.');
      // Best effort: a suggestion from someone who never signed in is still
      // worth having, so a missing session is not a failure.
      const uid = await ensureSession().catch(() => null);
      const { error: err } = await sb.from('suggestions').insert({
        idea: trimmed.slice(0, 1000),
        contact: contact.trim().slice(0, 200) || null,
        player_id: uid,
      });
      if (err) throw new Error(err.message);
      setState('sent');
      setIdea('');
      setContact('');
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Could not send that.');
    }
  }

  if (state === 'sent') {
    return (
      <section className="suggest suggest-done">
        <h2>Got it — thank you.</h2>
        <p>Every suggestion gets read. If yours gets built, that's how the list grew.</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setState('idle')}>
          Suggest another
        </button>
      </section>
    );
  }

  return (
    <section className="suggest">
      <div className="suggest-intro">
        <h2>Which game is missing?</h2>
        <p>
          Every game here started as somebody saying "you should be able to guess the…". Tell us
          what you'd want to guess.
        </p>
      </div>

      <form className="suggest-form" onSubmit={send}>
        <label className="sr-only" htmlFor="suggest-idea">
          Your game idea
        </label>
        <textarea
          id="suggest-idea"
          className="suggest-text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Guess the… city from its metro map? The film from one prop? The decade from a photo?"
          rows={3}
          maxLength={1000}
        />

        <div className="suggest-row">
          <label className="sr-only" htmlFor="suggest-contact">
            Email, if you want to be told when it's built
          </label>
          <input
            id="suggest-contact"
            className="suggest-contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email (optional)"
            maxLength={200}
            autoComplete="email"
          />
          <button type="submit" className="btn btn-primary" disabled={!canSend}>
            {state === 'sending' ? 'Sending…' : 'Send it'}
          </button>
        </div>

        {tooShort && <p className="suggest-note">A few more words than that.</p>}
        {state === 'error' && <p className="suggest-note suggest-bad">{error}</p>}
      </form>
    </section>
  );
}
