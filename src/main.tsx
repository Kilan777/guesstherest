import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
import { initAds } from './ui/AdSlot';

const root = document.getElementById('root');
if (!root) throw new Error('#root missing from index.html');

// Auto ads: Google places the units. Skipped entirely in dev and in headless
// browsers, so local runs and screenshot tests never load a tracker.
initAds();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
