import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from './supabase';
import { adoptHandle, getHandle } from './identity';
import { hasSupabase } from './settings';

/**
 * Signing in is entirely optional. Without it you still play everything and
 * still get leaderboards — they just live on this device. Google is offered
 * because it's the cheapest way to carry a name and a score history between
 * browsers, not because anything here needs an account.
 */
export type Player = {
  id: string;
  name: string;
  avatar: string | null;
  /** False for anonymous sessions and for local-only play. */
  signedIn: boolean;
};

export type AuthState = {
  player: Player | null;
  status: 'unavailable' | 'loading' | 'anonymous' | 'signed-in';
  error: string | null;
};

function toPlayer(session: Session | null): Player | null {
  const user = session?.user;
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  const signedIn = user.is_anonymous !== true;
  const name =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    (typeof user.email === 'string' && user.email.split('@')[0]) ||
    getHandle();
  return {
    id: user.id,
    name: String(name).slice(0, 20),
    avatar: typeof meta.avatar_url === 'string' ? meta.avatar_url : null,
    signedIn,
  };
}

export function useAuth(): AuthState & {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>(() => ({
    player: null,
    status: hasSupabase() ? 'loading' : 'unavailable',
    error: null,
  }));

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setState({ player: null, status: 'unavailable', error: null });
      return;
    }

    let alive = true;

    sb.auth
      .getSession()
      .then(({ data }) => {
        if (!alive) return;
        const player = toPlayer(data.session);
        setState({
          player,
          status: player?.signedIn ? 'signed-in' : 'anonymous',
          error: null,
        });
        // Only if they haven't picked one themselves.
        if (player?.signedIn) adoptHandle(player.name);
      })
      .catch(() => alive && setState({ player: null, status: 'anonymous', error: null }));

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      const player = toPlayer(session);
      setState({ player, status: player?.signedIn ? 'signed-in' : 'anonymous', error: null });
      if (player?.signedIn) adoptHandle(player.name);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) {
      setState((s) => ({ ...s, error: 'Add Supabase credentials in Settings first.' }));
      return;
    }
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      // Come back to the page they left, not to a bare origin.
      options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
    });
    if (error) setState((s) => ({ ...s, error: error.message }));
  }, []);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
    setState({ player: null, status: 'anonymous', error: null });
  }, []);

  return { ...state, signInWithGoogle, signOut };
}
