import type { GameDef } from '../engine/types';
import { songGame } from './song';
import { sceneGame } from './scene';
import { objectGame } from './object';
import { albumGame } from './album';
import { quoteGame } from './quote';
import { rebusGame } from './rebus';
import { yearGame } from './year';
import { landmarkGame } from './landmark';
import { animalGame } from './animal';
import { dishGame } from './dish';
import { videoGameGame } from './videogame';
import { celebrityGame } from './celebrity';
import { openingLineGame } from './openingline';
import { filmLineGame } from './filmline';
import { capitalGame } from './capital';
import { countryGame } from './country';
import { languageGame } from './language';
import { sloganGame } from './slogan';
import { plotGame } from './plot';
import { planetGame } from './planet';
import { carGame } from './car';
import { sportGame } from './sport';
import { skylineGame } from './skyline';
import { outlineGame } from './outline';
import { boardgameGame } from './boardgame';
import { appGame } from './app';
import { logoGame } from './logo';

/**
 * Order here is the order on the home page: the headline games first, then the
 * picture games, then the ones that are pure text and work offline.
 */
export const GAMES: GameDef[] = [
  songGame,
  sceneGame,
  countryGame,
  rebusGame,
  objectGame,
  animalGame,
  landmarkGame,
  skylineGame,
  outlineGame,
  albumGame,
  celebrityGame,
  videoGameGame,
  boardgameGame,
  logoGame,
  appGame,
  carGame,
  planetGame,
  dishGame,
  sportGame,
  quoteGame,
  filmLineGame,
  openingLineGame,
  plotGame,
  sloganGame,
  languageGame,
  yearGame,
  capitalGame,
];

export function gameBySlug(slug: string): GameDef | undefined {
  return GAMES.find((g) => g.slug === slug);
}
