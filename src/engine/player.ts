import { useEffect } from 'react';

/**
 * Lets the space bar drive whatever media the current stage owns.
 *
 * The keyboard handler lives in GameScreen, but the play button belongs to the
 * stage — only SongStage knows about its decoded audio buffer, only SceneStage
 * knows about its embedded player. Rather than lifting that state up, a stage
 * registers a play callback while it is mounted and GameScreen calls it.
 *
 * Exactly one stage is on screen at a time, so a single slot is enough.
 */
let play: (() => void) | null = null;

/** Registers this component's play action for as long as it is mounted. */
export function usePlayAction(fn: (() => void) | null, deps: unknown[]): void {
  useEffect(() => {
    if (!fn) return;
    play = fn;
    return () => {
      if (play === fn) play = null;
    };
    // The caller controls invalidation; `fn` is a fresh closure each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** True if a stage handled it, false if there is nothing to play. */
export function triggerPlay(): boolean {
  if (!play) return false;
  play();
  return true;
}
