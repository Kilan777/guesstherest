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

/**
 * Order here is the order on the home page. Roughly: the headline games first,
 * then the picture games, then the ones that are pure text and work offline.
 */
export const GAMES: GameDef[] = [
  songGame,
  sceneGame,
  posterGame,
  rebusGame,
  objectGame,
  animalGame,
  landmarkGame,
  flagGame,
  paintingGame,
  albumGame,
  actorGame,
  videoGameGame,
  dishGame,
  quoteGame,
  filmLineGame,
  openingLineGame,
  yearGame,
  capitalGame,
  elementGame,
];

export function gameBySlug(slug: string): GameDef | undefined {
  return GAMES.find((g) => g.slug === slug);
}
