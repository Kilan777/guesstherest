import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
import { initAds } from './ui/AdSlot';
import { gameBySlug } from './games';
import { warmDeck } from './engine/warm';

const root = document.getElementById('root');
if (!root) throw new Error('#root missing from index.html');

/**
 * Starts the deck before React does.
 *
 * On a deep link the slug is in the URL from the first byte, but the request
 * that actually takes the time — the first iTunes lookup — used to wait for the
 * renderer to boot, the tree to mount and an effect to fire before it was even
 * issued. None of that is information the fetch needs. Kicking it off here puts
 * the round trip and the framework's first paint side by side instead of end to
 * end; `warmDeck` is the same mechanism a hovered card uses, and the game
 * screen claims what it finds already in flight.
 */
const deepLink = /^#\/play\/([a-z-]+)$/.exec(window.location.hash)?.[1];
const target = deepLink ? gameBySlug(deepLink) : undefined;
if (target) warmDeck(target);

// Auto ads: Google places the units. Skipped entirely in dev and in headless
// browsers, so local runs and screenshot tests never load a tracker.
initAds();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
