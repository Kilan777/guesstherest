/**
 * Countries, keyed to whichever English Wikipedia article carries a map of them.
 *
 * Not the country article: on `Chile`, `Italy`, `Japan` and most of the rest the
 * lead image is the flag, which would make this the flag game with extra steps.
 * `Geography of X` usually leads with a topographic or locator map, and where it
 * does not — or where it leads with a landscape photograph, as Ethiopia and DR
 * Congo do — the administrative-divisions article (`Regions of X`, `Provinces of
 * X`, `States of X`) leads with an outline of the country cut into its internal
 * borders, which is just as good a shape to guess from. Every title below was
 * checked one at a time and the resulting filename read: all of them are maps.
 *
 * Countries whose best available image was a raw satellite photograph with no
 * drawn coastline — Turkey, Thailand, Iceland, Denmark, Estonia — were left out
 * rather than shipped as an unguessable rectangle of terrain.
 *
 * `wide` is the shape of that map, measured from the API's `originalimage`
 * dimensions, and it decides which frame the tile grid uses. The frame crops
 * with object-fit: cover, so a 950×2132 map of Chile in a 3:2 frame shows the
 * middle third of the country and nothing else — which is the whole answer
 * thrown away. Thirty of the maps here are taller than they are wide, so the
 * orientation travels with the seed. If a lead image is ever replaced upstream
 * the flag can go stale; the fix is to re-measure, not to guess.
 *
 * `label` must match the `country` spelling used in capitals.ts, so the two
 * geography games never disagree about whether the answer is Côte d’Ivoire or
 * Ivory Coast — the article is filed under the latter, the answer is the former.
 */
export type OutlineRegion =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'Middle East'
  | 'North America & Caribbean'
  | 'Oceania'
  | 'South America';

export type OutlineSeed = {
  wiki: string;
  label: string;
  region: OutlineRegion;
  /** The lead image is at least as wide as it is tall. */
  wide: boolean;
};

export const OUTLINES: OutlineSeed[] = [
  // South America
  { wiki: 'Geography_of_Chile', label: 'Chile', region: 'South America', wide: false },
  { wiki: 'Geography_of_Argentina', label: 'Argentina', region: 'South America', wide: false },
  { wiki: 'States_of_Brazil', label: 'Brazil', region: 'South America', wide: true },
  { wiki: 'Regions_of_Peru', label: 'Peru', region: 'South America', wide: false },
  { wiki: 'Geography_of_Bolivia', label: 'Bolivia', region: 'South America', wide: true },
  { wiki: 'Geography_of_Uruguay', label: 'Uruguay', region: 'South America', wide: false },
  { wiki: 'Geography_of_Colombia', label: 'Colombia', region: 'South America', wide: false },
  { wiki: 'Geography_of_Venezuela', label: 'Venezuela', region: 'South America', wide: false },

  // Europe
  { wiki: 'Geography_of_Italy', label: 'Italy', region: 'Europe', wide: false },
  { wiki: 'Geography_of_Norway', label: 'Norway', region: 'Europe', wide: false },
  { wiki: 'Geography_of_Sweden', label: 'Sweden', region: 'Europe', wide: true },
  { wiki: 'Regions_of_Finland', label: 'Finland', region: 'Europe', wide: false },
  { wiki: 'Counties_of_Ireland', label: 'Ireland', region: 'Europe', wide: false },
  { wiki: 'Geography_of_Portugal', label: 'Portugal', region: 'Europe', wide: false },
  { wiki: 'Autonomous_communities_of_Spain', label: 'Spain', region: 'Europe', wide: true },
  { wiki: 'Regions_of_France', label: 'France', region: 'Europe', wide: true },
  { wiki: 'Geography_of_Germany', label: 'Germany', region: 'Europe', wide: false },
  { wiki: 'Geography_of_Poland', label: 'Poland', region: 'Europe', wide: true },
  { wiki: 'Administrative_regions_of_Greece', label: 'Greece', region: 'Europe', wide: true },
  { wiki: 'Geography_of_Croatia', label: 'Croatia', region: 'Europe', wide: true },
  { wiki: 'Oblasts_of_Ukraine', label: 'Ukraine', region: 'Europe', wide: true },
  { wiki: 'Provinces_of_the_Netherlands', label: 'Netherlands', region: 'Europe', wide: false },

  // Middle East
  { wiki: 'Outline_of_Iran', label: 'Iran', region: 'Middle East', wide: true },
  { wiki: 'Governorates_of_Iraq', label: 'Iraq', region: 'Middle East', wide: false },
  { wiki: 'Regions_of_Saudi_Arabia', label: 'Saudi Arabia', region: 'Middle East', wide: true },
  { wiki: 'Geography_of_Oman', label: 'Oman', region: 'Middle East', wide: false },
  { wiki: 'Geography_of_Yemen', label: 'Yemen', region: 'Middle East', wide: true },
  { wiki: 'Outline_of_Jordan', label: 'Jordan', region: 'Middle East', wide: false },

  // Asia
  { wiki: 'Prefectures_of_Japan', label: 'Japan', region: 'Asia', wide: false },
  { wiki: 'States_and_union_territories_of_India', label: 'India', region: 'Asia', wide: false },
  { wiki: 'Geography_of_Nepal', label: 'Nepal', region: 'Asia', wide: true },
  { wiki: 'Geography_of_Sri_Lanka', label: 'Sri Lanka', region: 'Asia', wide: false },
  { wiki: 'Geography_of_Vietnam', label: 'Vietnam', region: 'Asia', wide: false },
  { wiki: 'Geography_of_Cambodia', label: 'Cambodia', region: 'Asia', wide: true },
  { wiki: 'Geography_of_Laos', label: 'Laos', region: 'Asia', wide: false },
  { wiki: 'Geography_of_Malaysia', label: 'Malaysia', region: 'Asia', wide: true },
  { wiki: 'Regions_of_the_Philippines', label: 'Philippines', region: 'Asia', wide: false },
  { wiki: 'Geography_of_Myanmar', label: 'Myanmar', region: 'Asia', wide: false },
  { wiki: 'Geography_of_Mongolia', label: 'Mongolia', region: 'Asia', wide: true },
  { wiki: 'Geography_of_South_Korea', label: 'South Korea', region: 'Asia', wide: false },
  { wiki: 'Geography_of_North_Korea', label: 'North Korea', region: 'Asia', wide: false },
  { wiki: 'Geography_of_China', label: 'China', region: 'Asia', wide: true },
  { wiki: 'Geography_of_Pakistan', label: 'Pakistan', region: 'Asia', wide: true },
  { wiki: 'Geography_of_Afghanistan', label: 'Afghanistan', region: 'Asia', wide: true },

  // Africa
  { wiki: 'Geography_of_Egypt', label: 'Egypt', region: 'Africa', wide: true },
  { wiki: 'Geography_of_Morocco', label: 'Morocco', region: 'Africa', wide: true },
  { wiki: 'Geography_of_Algeria', label: 'Algeria', region: 'Africa', wide: true },
  { wiki: 'Geography_of_Libya', label: 'Libya', region: 'Africa', wide: true },
  { wiki: 'Outline_of_Sudan', label: 'Sudan', region: 'Africa', wide: true },
  { wiki: 'Regions_of_Ethiopia', label: 'Ethiopia', region: 'Africa', wide: true },
  { wiki: 'Counties_of_Kenya', label: 'Kenya', region: 'Africa', wide: false },
  { wiki: 'Regions_of_Tanzania', label: 'Tanzania', region: 'Africa', wide: true },
  { wiki: 'States_of_Nigeria', label: 'Nigeria', region: 'Africa', wide: true },
  { wiki: 'Geography_of_Ivory_Coast', label: 'Côte d’Ivoire', region: 'Africa', wide: false },
  {
    wiki: 'Provinces_of_the_Democratic_Republic_of_the_Congo',
    label: 'DR Congo',
    region: 'Africa',
    wide: true,
  },
  { wiki: 'Geography_of_Namibia', label: 'Namibia', region: 'Africa', wide: true },
  { wiki: 'Madagascar', label: 'Madagascar', region: 'Africa', wide: true },
  { wiki: 'Geography_of_Somalia', label: 'Somalia', region: 'Africa', wide: true },

  // North America and the Caribbean
  {
    wiki: 'Geography_of_United_States',
    label: 'United States',
    region: 'North America & Caribbean',
    wide: true,
  },
  { wiki: 'Geography_of_Canada', label: 'Canada', region: 'North America & Caribbean', wide: true },
  { wiki: 'States_of_Mexico', label: 'Mexico', region: 'North America & Caribbean', wide: true },
  { wiki: 'Provinces_of_Cuba', label: 'Cuba', region: 'North America & Caribbean', wide: true },
  { wiki: 'Geography_of_Haiti', label: 'Haiti', region: 'North America & Caribbean', wide: false },
  {
    wiki: 'Geography_of_the_Dominican_Republic',
    label: 'Dominican Republic',
    region: 'North America & Caribbean',
    wide: true,
  },

  // Oceania
  {
    wiki: 'States_and_territories_of_Australia',
    label: 'Australia',
    region: 'Oceania',
    wide: true,
  },
  { wiki: 'Regions_of_New_Zealand', label: 'New Zealand', region: 'Oceania', wide: false },
  { wiki: 'Geography_of_Fiji', label: 'Fiji', region: 'Oceania', wide: true },
  { wiki: 'Geography_of_Papua_New_Guinea', label: 'Papua New Guinea', region: 'Oceania', wide: false },
];
