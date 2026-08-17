import { load, save } from './storage';
import { getSettings, updateSettings } from './settings';
import { checkHandle } from './handle-filter';

const ADJECTIVES = [
  'Neon', 'Turbo', 'Silent', 'Cosmic', 'Feral', 'Velvet', 'Rogue', 'Golden',
  'Midnight', 'Electric', 'Lucky', 'Rapid', 'Hollow', 'Crimson', 'Atomic',
  'Wandering', 'Glass', 'Iron', 'Paper', 'Static',
];
const NOUNS = [
  'Otter', 'Comet', 'Falcon', 'Pixel', 'Bandit', 'Oracle', 'Machine', 'Ghost',
  'Wolf', 'Signal', 'Ranger', 'Lantern', 'Magpie', 'Vulture', 'Prophet',
  'Sparrow', 'Circuit', 'Nomad', 'Beacon', 'Fox',
];

/** Stable local id, used as the local-leaderboard key and as a fallback handle seed. */
export function localPlayerId(): string {
  let id = load<string>('playerId', '');
  if (!id) {
    id = crypto.randomUUID();
    save('playerId', id);
  }
  return id;
}

/**
 * A generated name is the fallback everywhere a chosen one is unusable, so it
 * has to be safe by construction. The word lists are tame, but an unlucky pair
 * could still read badly, so the result is vetted and re-rolled — with a dull
 * but guaranteed-clean last resort so this can never loop forever.
 */
export function randomHandle(): string {
  for (let i = 0; i < 12; i++) {
    const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const candidate = `${a}${n}${Math.floor(Math.random() * 90 + 10)}`;
    if (checkHandle(candidate).ok) return candidate;
  }
  return `Player${Math.floor(Math.random() * 9000 + 1000)}`;
}

/**
 * The name shown on leaderboards. Auto-generated on first play, editable later.
 *
 * The stored value is re-vetted on every read rather than trusted: it lives in
 * localStorage, which anyone can hand-edit, and the filter's word list can
 * gain entries after a name was already saved.
 */
export function getHandle(): string {
  const existing = getSettings().handle.trim();
  if (existing && checkHandle(existing).ok) return existing;
  const generated = randomHandle();
  updateSettings({ handle: generated });
  return generated;
}

/** The player chose this name. Locks it so sign-in won't overwrite it. */
export function setHandle(name: string): string {
  const clean = name.replace(/\s+/g, ' ').trim().slice(0, 20);
  // The UI blocks a rejected name before it gets here; this is the backstop for
  // any path that doesn't, and it substitutes rather than throws.
  const final = checkHandle(clean).ok ? clean : randomHandle();
  updateSettings({ handle: final, handleLocked: true });
  return final;
}

/**
 * Adopt a name suggested by an identity provider. Signing in used to call
 * `setHandle` directly, which clobbered a custom name on every token refresh —
 * so changing it in Settings appeared to work and then silently reverted.
 */
export function adoptHandle(name: string): void {
  if (getSettings().handleLocked) return;
  const clean = name.replace(/\s+/g, ' ').trim().slice(0, 20);
  // A provider name is no more trustworthy than a typed one — if it doesn't
  // pass, leave the handle alone and let `getHandle` generate one.
  if (clean && checkHandle(clean).ok) updateSettings({ handle: clean });
}

/** True when the player has never picked a name for themselves. */
export function needsHandle(): boolean {
  return !getSettings().handleLocked;
}
