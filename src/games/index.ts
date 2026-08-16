import type { GameDef } from '../engine/types';
import { songGame } from './song';
import { sceneGame } from './scene';
import { posterGame } from './poster';
import { objectGame } from './object';
import { paintingGame } from './painting';
import { albumGame } from './album';
import { quoteGame } from './quote';
import { rebusGame } from './rebus';
import { yearGame } from './year';
import { flagGame } from './flag';
import { landmarkGame } from './landmark';
import { animalGame } from './animal';
import { dishGame } from './dish';
import { videoGameGame } from './videogame';
import { actorGame } from './actor';
import { openingLineGame } from './openingline';
import { filmLineGame } from './filmline';
import { capitalGame } from './capital';
import { elementGame } from './element';
import { countryGame } from './country';
import { languageGame } from './language';
import { sloganGame } from './slogan';
import { plotGame } from './plot';
import { planetGame } from './planet';
import { carGame } from './car';
import { sportGame } from './sport';
import { instrumentGame } from './instrument';
import { skylineGame } from './skyline';
import { outlineGame } from './outline';
import { boardgameGame } from './boardgame';

/**
 * Order here is the order on the home page: the headline games first, then the
 * picture games, then the ones that are pure text and work offline.
 */
export const GAMES: GameDef[] = [
  songGame,
  sceneGame,
  countryGame,
  posterGame,
  rebusGame,
  objectGame,
  animalGame,
  landmarkGame,
  skylineGame,
  flagGame,
  outlineGame,
  paintingGame,
  albumGame,
  actorGame,
  videoGameGame,
  boardgameGame,
  carGame,
  planetGame,
  dishGame,
  sportGame,
  instrumentGame,
  quoteGame,
  filmLineGame,
  openingLineGame,
  plotGame,
  sloganGame,
  languageGame,
  yearGame,
  capitalGame,
  elementGame,
];

export function gameBySlug(slug: string): GameDef | undefined {
  return GAMES.find((g) => g.slug === slug);
}
