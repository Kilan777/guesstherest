/**
 * Street View round seeds.
 *
 * Every coordinate below was loaded through the keyless `output=svembed` iframe
 * and confirmed to return official Google Street View car imagery — the panorama
 * attribution reads "© <year> Google" rather than a contributor name. That check
 * matters: plenty of places with no car coverage still return *something*, a
 * user-uploaded photosphere shot indoors or from a hotel balcony, which makes a
 * poor round. Coordinates sit on ordinary streets and roads rather than at
 * monuments, so the answer has to come from signage, road markings, plates,
 * vegetation and which side of the road the traffic is on.
 *
 * `country` matches a `country` value in capitals.ts exactly, and `region`
 * matches that country's region there — a country outside that list would be
 * unanswerable.
 *
 * Countries omitted for lack of official coverage, despite being in capitals.ts:
 * China, India, Egypt, Saudi Arabia, Bahrain, Tanzania, Jamaica, Morocco,
 * Zambia, Zimbabwe, Mozambique, Madagascar, Fiji, Papua New Guinea, Samoa,
 * Tonga, Vanuatu, Solomon Islands, Palau, Marshall Islands, Trinidad and
 * Tobago, Belize, Nicaragua — plus the countries Google has never driven at all.
 */
export type StreetViewSeed = {
  lat: number;
  lng: number;
  /** The answer. Must exactly match a `country` value in src/content/data/capitals.ts. */
  country: string;
  /** Continent/region — copy the wording used for that country in capitals.ts. */
  region: string;
  /** A short, non-giveaway clue. Must NOT name the country, its capital, or a famous landmark. */
  hint: string;
};

export const STREET_VIEW: StreetViewSeed[] = [
  // ── Europe ────────────────────────────────────────────────────────────────
  { lat: 47.0840, lng: 2.3960, country: 'France', region: 'Europe', hint: 'Minor roads carry a “D” number, and the traffic police are a branch of the armed forces.' },
  { lat: 41.5030, lng: -5.7440, country: 'Spain', region: 'Europe', hint: 'Divided into autonomous communities, several with a second co-official language.' },
  { lat: 37.0180, lng: -7.9300, country: 'Portugal', region: 'Europe', hint: 'Official language is Portuguese — but this is not the largest country that speaks it.' },
  { lat: 40.3540, lng: 18.1720, country: 'Italy', region: 'Europe', hint: 'A Romance language with no native use of the letters k, w or y.' },
  { lat: 51.5300, lng: 9.9250, country: 'Germany', region: 'Europe', hint: 'Number plates open with a code for the district where the car is registered.' },
  { lat: 52.2550, lng: 6.1600, country: 'Netherlands', region: 'Europe', hint: 'More bicycles than people, and a good deal of the land sits below sea level.' },
  { lat: 52.6540, lng: -7.2520, country: 'Ireland', region: 'Europe', hint: 'Drives on the left, and road signs are bilingual.' },
  { lat: 62.4720, lng: 6.1540, country: 'Norway', region: 'Europe', hint: 'Has the highest share of electric cars anywhere, and is not in the EU.' },
  { lat: 63.9330, lng: -21.0000, country: 'Iceland', region: 'Europe', hint: 'No railways at all, and almost all heat and power come from geothermal and hydro.' },
  { lat: 51.2460, lng: 22.5680, country: 'Poland', region: 'Europe', hint: 'A Slavic language written in the Latin alphabet, heavy on z and w.' },
  { lat: 39.6390, lng: 22.4180, country: 'Greece', region: 'Europe', hint: 'The alphabet on the signs is not Latin, though most are transliterated too.' },
  { lat: 49.8330, lng: 24.0180, country: 'Ukraine', region: 'Europe', hint: 'Signs are Cyrillic, in the largest country lying wholly within Europe.' },

  // ── Asia ──────────────────────────────────────────────────────────────────
  { lat: 33.8390, lng: 132.7660, country: 'Japan', region: 'Asia', hint: 'Drives on the left, and tiny yellow-plated cars are a legal class of their own.' },
  { lat: 35.1590, lng: 129.0620, country: 'South Korea', region: 'Asia', hint: 'The writing system was designed from scratch in the 15th century, not borrowed.' },
  { lat: 16.4320, lng: 102.8280, country: 'Thailand', region: 'Asia', hint: 'Drives on the left; the script runs without spaces between words.' },
  { lat: 16.4640, lng: 107.5900, country: 'Vietnam', region: 'Asia', hint: 'Motorbikes rule the traffic, and the Latin alphabet is stacked with diacritics.' },
  { lat: 10.7000, lng: 122.5620, country: 'Philippines', region: 'Asia', hint: 'An archipelago of over 7,000 islands where converted jeeps run as buses.' },
  { lat: 5.4150, lng: 100.3320, country: 'Malaysia', region: 'Asia', hint: 'Drives on the left, and the country is split in two by a sea.' },
  { lat: 19.8860, lng: 102.1350, country: 'Laos', region: 'Asia', hint: 'The only landlocked country in its region, and heavily Buddhist.' },
  { lat: 7.2900, lng: 80.6330, country: 'Sri Lanka', region: 'Asia', hint: 'An island that drives on the left and exports a great deal of tea.' },
  { lat: 28.2100, lng: 83.9850, country: 'Nepal', region: 'Asia', hint: 'The only country whose national flag is not a rectangle.' },
  { lat: 27.4720, lng: 89.6390, country: 'Bhutan', region: 'Asia', hint: 'The government measures its progress with a happiness index.' },
  { lat: 47.9140, lng: 106.8860, country: 'Mongolia', region: 'Asia', hint: 'The least densely populated sovereign country on Earth.' },

  // ── Middle East ───────────────────────────────────────────────────────────
  { lat: 41.0400, lng: 28.9800, country: 'Turkey', region: 'Middle East', hint: 'Swapped Arabic script for the Latin alphabet in 1928; the country spans two continents.' },
  { lat: 33.8850, lng: 35.5150, country: 'Lebanon', region: 'Middle East', hint: 'A tree sits at the centre of the national flag.' },
  { lat: 31.7160, lng: 35.7940, country: 'Jordan', region: 'Middle East', hint: 'A kingdom with barely any coastline, bordering the lowest land on Earth.' },
  { lat: 25.2790, lng: 51.5200, country: 'Qatar', region: 'Middle East', hint: 'A small peninsula with exactly one land border.' },
  { lat: 23.5880, lng: 58.4080, country: 'Oman', region: 'Middle East', hint: 'A sultanate on the eastern corner of its peninsula, ruled by the same family since 1744.' },
  { lat: 25.2280, lng: 55.3390, country: 'United Arab Emirates', region: 'Middle East', hint: 'A federation of seven hereditary emirates.' },

  // ── Africa ────────────────────────────────────────────────────────────────
  { lat: -0.2860, lng: 36.0660, country: 'Kenya', region: 'Africa', hint: 'Drives on the left; the currency is a shilling and the equator crosses the country.' },
  { lat: 6.6900, lng: -1.6200, country: 'Ghana', region: 'Africa', hint: 'English-speaking, drives on the right, and the currency is the cedi.' },
  { lat: 14.7900, lng: -16.9300, country: 'Senegal', region: 'Africa', hint: 'French is official, and the country wraps almost entirely around a smaller neighbour.' },
  { lat: -24.6500, lng: 25.9100, country: 'Botswana', region: 'Africa', hint: 'Landlocked, thinly populated, drives on the left, and the currency means "rain".' },
  { lat: 0.3140, lng: 32.5850, country: 'Uganda', region: 'Africa', hint: 'Landlocked, English-speaking, drives on the left, and sits on a huge lake.' },
  { lat: 9.0600, lng: 7.4700, country: 'Nigeria', region: 'Africa', hint: 'The most populous country on the continent; drives on the right.' },
  { lat: 36.8010, lng: 10.1810, country: 'Tunisia', region: 'Africa', hint: 'Arabic and French sit side by side on the signs, on the Mediterranean coast.' },
  { lat: -22.5700, lng: 17.0850, country: 'Namibia', region: 'Africa', hint: 'Drives on the left, has German street names, and is mostly desert.' },
  { lat: -1.9700, lng: 30.1050, country: 'Rwanda', region: 'Africa', hint: 'Plastic bags are banned outright, and the roads climb a thousand hills.' },

  // ── North America & Caribbean ─────────────────────────────────────────────
  { lat: 41.6000, lng: -93.9000, country: 'United States', region: 'North America & Caribbean', hint: 'Speed limits are in miles per hour and fuel is sold by the gallon.' },
  { lat: 50.3930, lng: -105.5400, country: 'Canada', region: 'North America & Caribbean', hint: 'Speed limits in km/h, two official languages, and very long straight prairie roads.' },
  { lat: 20.9700, lng: -89.6200, country: 'Mexico', region: 'North America & Caribbean', hint: 'Speed bumps called topes are everywhere, and the currency is a peso.' },
  { lat: 10.0160, lng: -84.2140, country: 'Costa Rica', region: 'North America & Caribbean', hint: 'Abolished its army in 1948 and has run without one ever since.' },
  { lat: 19.4500, lng: -70.6900, country: 'Dominican Republic', region: 'North America & Caribbean', hint: 'Shares one island with a Creole-speaking neighbour.' },

  // ── South America ─────────────────────────────────────────────────────────
  { lat: -16.4000, lng: -71.5350, country: 'Peru', region: 'South America', hint: 'The currency is the sol, and much of the population lives above 2,000 m.' },
  { lat: -31.4180, lng: -64.1830, country: 'Argentina', region: 'South America', hint: 'Beef and mate, and the mainland reaches further south than any other country’s.' },
  { lat: -39.8140, lng: -73.2450, country: 'Chile', region: 'South America', hint: 'Over 4,000 km long, and rarely more than 200 km wide.' },
  { lat: 5.0680, lng: -75.5150, country: 'Colombia', region: 'South America', hint: 'Coffee country, with three separate branches of the Andes running through it.' },
  { lat: -8.0500, lng: -34.9000, country: 'Brazil', region: 'South America', hint: 'Official language is Portuguese, and the country borders all but two of its neighbours on the continent.' },
  { lat: -2.9000, lng: -79.0050, country: 'Ecuador', region: 'South America', hint: 'Dropped its own currency in 2000 and uses the US dollar.' },
  { lat: -17.3900, lng: -66.1560, country: 'Bolivia', region: 'South America', hint: 'Landlocked since losing its coast in a 19th-century war, and still keeps a navy.' },
  { lat: -27.3300, lng: -55.8700, country: 'Paraguay', region: 'South America', hint: 'Landlocked, with an indigenous language co-official and spoken by most people.' },

  // ── Oceania ───────────────────────────────────────────────────────────────
  { lat: -37.5620, lng: 143.8500, country: 'Australia', region: 'Oceania', hint: 'Drives on the left; this inland town grew rich on a 19th-century gold rush.' },
  { lat: -23.6980, lng: 133.8800, country: 'Australia', region: 'Oceania', hint: 'Red desert interior, where freight moves by road trains hauling three trailers.' },
  { lat: -39.4900, lng: 176.9100, country: 'New Zealand', region: 'Oceania', hint: 'Drives on the left, and sheep comfortably outnumber people.' },
  { lat: -45.8740, lng: 170.5030, country: 'New Zealand', region: 'Oceania', hint: 'Two main islands, with an indigenous Polynesian language co-official.' },
];
