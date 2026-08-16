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

export function setHandle(name: string): string {
  const clean = name.replace(/\s+/g, ' ').trim().slice(0, 20);
  const final = clean || randomHandle();
  updateSettings({ handle: final });
  return final;
}
