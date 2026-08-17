import type { Article } from './types';
import { GAMES as GAME_ARTICLES } from './games';
import { GUIDES } from './guides';
import { LEGAL } from './legal';

export type { Article, Section } from './types';

/** Every written page on the site, in the order they appear in the sitemap. */
export const ARTICLES: Article[] = [...GUIDES, ...GAME_ARTICLES, ...LEGAL];
