import type { GameDef, GameMeta } from '../engine/types';
import { songMeta } from './song.meta';
import { sceneMeta } from './scene.meta';
import { objectMeta } from './object.meta';
import { quoteMeta } from './quote.meta';
import { rebusMeta } from './rebus.meta';
import { yearMeta } from './year.meta';
import { landmarkMeta } from './landmark.meta';
import { animalMeta } from './animal.meta';
import { dishMeta } from './dish.meta';
import { videoGameMeta } from './videogame.meta';
import { celebrityMeta } from './celebrity.meta';
import { openingLineMeta } from './openingline.meta';
import { filmLineMeta } from './filmline.meta';
import { capitalMeta } from './capital.meta';
import { countryMeta } from './country.meta';
import { languageMeta } from './language.meta';
import { sloganMeta } from './slogan.meta';
import { plotMeta } from './plot.meta';
import { carMeta } from './car.meta';
import { sportMeta } from './sport.meta';
import { skylineMeta } from './skyline.meta';
import { outlineMeta } from './outline.meta';
import { boardgameMeta } from './boardgame.meta';
import { birdMeta } from './bird.meta';
import { plantMeta } from './plant.meta';
import { insectMeta } from './insect.meta';
import { wordMeta } from './word.meta';
import { recipeMeta } from './recipe.meta';
import { appMeta } from './app.meta';
import { logoMeta } from './logo.meta';

/**
 * Only the metadata is imported statically.
 *
 * The home page needs thirty titles, taglines and accents; it does not need a
 * single Stage component or deck builder to draw them. Those live behind
 * `loadGame`, so opening one game downloads one game's code instead of all
 * thirty — the entry chunk carries the launcher, not the arcade.
 *
 * Order here is the order on the home page: the headline games first, then the
 * picture games, then the ones that are pure text and work offline.
 */
export const GAMES: GameMeta[] = [
  songMeta,
  sceneMeta,
  countryMeta,
  rebusMeta,
  objectMeta,
  animalMeta,
  birdMeta,
  insectMeta,
  plantMeta,
  landmarkMeta,
  skylineMeta,
  outlineMeta,
  celebrityMeta,
  videoGameMeta,
  boardgameMeta,
  logoMeta,
  appMeta,
  carMeta,
  dishMeta,
  sportMeta,
  recipeMeta,
  quoteMeta,
  filmLineMeta,
  openingLineMeta,
  plotMeta,
  sloganMeta,
  languageMeta,
  wordMeta,
  yearMeta,
  capitalMeta,
];

export function gameBySlug(slug: string): GameMeta | undefined {
  return GAMES.find((g) => g.slug === slug);
}

/**
 * One dynamic import per game. Written out rather than built from a template
 * string so the bundler can see every target and give each one its own chunk.
 */
const loaders: Record<string, () => Promise<GameDef>> = {
  song: () => import('./song').then((m) => m.songGame),
  scene: () => import('./scene').then((m) => m.sceneGame),
  country: () => import('./country').then((m) => m.countryGame),
  rebus: () => import('./rebus').then((m) => m.rebusGame),
  object: () => import('./object').then((m) => m.objectGame),
  animal: () => import('./animal').then((m) => m.animalGame),
  bird: () => import('./bird').then((m) => m.birdGame),
  insect: () => import('./insect').then((m) => m.insectGame),
  plant: () => import('./plant').then((m) => m.plantGame),
  landmark: () => import('./landmark').then((m) => m.landmarkGame),
  skyline: () => import('./skyline').then((m) => m.skylineGame),
  outline: () => import('./outline').then((m) => m.outlineGame),
  celebrity: () => import('./celebrity').then((m) => m.celebrityGame),
  videogame: () => import('./videogame').then((m) => m.videoGameGame),
  boardgame: () => import('./boardgame').then((m) => m.boardgameGame),
  logo: () => import('./logo').then((m) => m.logoGame),
  app: () => import('./app').then((m) => m.appGame),
  car: () => import('./car').then((m) => m.carGame),
  dish: () => import('./dish').then((m) => m.dishGame),
  sport: () => import('./sport').then((m) => m.sportGame),
  recipe: () => import('./recipe').then((m) => m.recipeGame),
  quote: () => import('./quote').then((m) => m.quoteGame),
  filmline: () => import('./filmline').then((m) => m.filmLineGame),
  openingline: () => import('./openingline').then((m) => m.openingLineGame),
  plot: () => import('./plot').then((m) => m.plotGame),
  slogan: () => import('./slogan').then((m) => m.sloganGame),
  language: () => import('./language').then((m) => m.languageGame),
  word: () => import('./word').then((m) => m.wordGame),
  year: () => import('./year').then((m) => m.yearGame),
  capital: () => import('./capital').then((m) => m.capitalGame),
};

/** Modules already fetched. A second visit to a game costs nothing. */
const loaded = new Map<string, Promise<GameDef>>();

/** Fetches a game's code. Rejects if the slug is unknown or the network is. */
export function loadGame(slug: string): Promise<GameDef> {
  const cached = loaded.get(slug);
  if (cached) return cached;

  const loader = loaders[slug];
  if (!loader) return Promise.reject(new Error(`Unknown game: ${slug}`));

  const promise = loader();
  // A failed fetch shouldn't be remembered — the next attempt should try again
  // rather than replay the same rejection for the rest of the session.
  promise.catch(() => loaded.delete(slug));
  loaded.set(slug, promise);
  return promise;
}
