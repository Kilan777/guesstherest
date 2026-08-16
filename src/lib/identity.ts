import { load, save } from './storage';
import { getSettings, updateSettings } from './settings';

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

export function randomHandle(): string {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${a}${n}${Math.floor(Math.random() * 90 + 10)}`;
}

/** The name shown on leaderboards. Auto-generated on first play, editable later. */
export function getHandle(): string {
  const existing = getSettings().handle.trim();
  if (existing) return existing;
  const generated = randomHandle();
  updateSettings({ handle: generated });
  return generated;
}

/** The player chose this name. Locks it so sign-in won't overwrite it. */
export function setHandle(name: string): string {
  const clean = name.replace(/\s+/g, ' ').trim().slice(0, 20);
  const final = clean || randomHandle();
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
  if (clean) updateSettings({ handle: clean });
}

/** True when the player has never picked a name for themselves. */
export function needsHandle(): boolean {
  return !getSettings().handleLocked;
}
