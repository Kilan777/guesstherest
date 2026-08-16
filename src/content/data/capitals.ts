/**
 * Official capitals only. Several countries separate the constitutional capital
 * from the city where the government actually sits, and plenty of people learn
 * the wrong one from quiz apps — Rio, Istanbul, Lagos, Yangon, Abidjan. Where a
 * country has more than one seat, the entry uses the constitutionally or legally
 * designated capital and carries a comment saying so. Where even that is
 * contested, the country is left out rather than guessed at.
 *
 * `region` groups countries so the three decoys are capitals from the same part
 * of the world. A South American capital sitting among three Asian ones answers
 * itself.
 */
export type Region =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'Middle East'
  | 'North America & Caribbean'
  | 'Oceania'
  | 'South America';

export type CapitalSeed = {
  country: string;
  capital: string;
  region: Region;
  /** One distinguishing fact about the city — the middle clue. */
  hint: string;
};

export const CAPITALS: CapitalSeed[] = [
  // ── South America ─────────────────────────────────────────────────────────
  { country: 'Peru', capital: 'Lima', region: 'South America', hint: 'Sits in a coastal desert where it drizzles but almost never rains.' },
  { country: 'Argentina', capital: 'Buenos Aires', region: 'South America', hint: 'Its residents are called porteños, after the port.' },
  { country: 'Chile', capital: 'Santiago', region: 'South America', hint: 'Sits in a valley with the Andes rising straight up to the east.' },
  { country: 'Colombia', capital: 'Bogotá', region: 'South America', hint: 'Sits on a high plateau at about 2,600 m.' },
  { country: 'Brazil', capital: 'Brasília', region: 'South America', hint: 'Built from nothing in the 1950s, laid out roughly in the shape of an aeroplane.' },
  { country: 'Ecuador', capital: 'Quito', region: 'South America', hint: 'Sits at 2,850 m, with the equator running just north of the city.' },
  { country: 'Uruguay', capital: 'Montevideo', region: 'South America', hint: 'Sits on the north bank of the Río de la Plata.' },
  { country: 'Paraguay', capital: 'Asunción', region: 'South America', hint: 'One of the oldest cities in South America, founded in 1537.' },
  { country: 'Venezuela', capital: 'Caracas', region: 'South America', hint: 'Separated from the Caribbean by a single steep coastal mountain.' },
  // Bolivia: Sucre is the constitutional capital; La Paz is the seat of government.
  { country: 'Bolivia', capital: 'Sucre', region: 'South America', hint: 'The constitutional capital — the government itself sits in another city.' },
  { country: 'Guyana', capital: 'Georgetown', region: 'South America', hint: 'Lies below high-tide level behind a long sea wall.' },
  { country: 'Suriname', capital: 'Paramaribo', region: 'South America', hint: 'Its Dutch colonial old town is a UNESCO World Heritage site.' },

  // ── Europe ────────────────────────────────────────────────────────────────
  { country: 'France', capital: 'Paris', region: 'Europe', hint: 'Its historic centre is two islands in a river.' },
  { country: 'Germany', capital: 'Berlin', region: 'Europe', hint: 'A wall ran through it for 28 years.' },
  { country: 'Spain', capital: 'Madrid', region: 'Europe', hint: 'The highest capital in the European Union, at about 650 m.' },
  { country: 'Portugal', capital: 'Lisbon', region: 'Europe', hint: 'Rebuilt on a grid after an earthquake and tsunami in 1755.' },
  { country: 'Italy', capital: 'Rome', region: 'Europe', hint: 'There is an independent country inside its city limits.' },
  { country: 'Greece', capital: 'Athens', region: 'Europe', hint: 'A marble temple from the 5th century BC stands on a rock above it.' },
  { country: 'Poland', capital: 'Warsaw', region: 'Europe', hint: 'Its old town was rebuilt from 18th-century paintings after 1944.' },
  { country: 'Czechia', capital: 'Prague', region: 'Europe', hint: 'A 14th-century stone bridge lined with statues crosses its river.' },
  { country: 'Hungary', capital: 'Budapest', region: 'Europe', hint: 'Two towns on opposite banks, merged into one city in 1873.' },
  { country: 'Austria', capital: 'Vienna', region: 'Europe', hint: 'Seat of the Habsburg court for centuries, with working vineyards inside the city.' },
  { country: 'Switzerland', capital: 'Bern', region: 'Europe', hint: 'Not the country’s largest city, and officially only the "federal city".' },
  { country: 'Sweden', capital: 'Stockholm', region: 'Europe', hint: 'Spread across fourteen islands.' },
  { country: 'Norway', capital: 'Oslo', region: 'Europe', hint: 'Sits at the head of a long fjord.' },
  { country: 'Denmark', capital: 'Copenhagen', region: 'Europe', hint: 'A small bronze mermaid sits on a rock in its harbour.' },
  { country: 'Finland', capital: 'Helsinki', region: 'Europe', hint: 'Two hours from Tallinn by ferry across the Gulf of Finland.' },
  { country: 'Iceland', capital: 'Reykjavík', region: 'Europe', hint: 'The northernmost capital of a sovereign state, heated by geothermal water.' },
  { country: 'Ireland', capital: 'Dublin', region: 'Europe', hint: 'Its name comes from the Irish for "black pool".' },
  // Netherlands: Amsterdam is the constitutional capital; parliament, the ministries
  // and the monarch's working palace are in The Hague.
  { country: 'Netherlands', capital: 'Amsterdam', region: 'Europe', hint: 'The constitutional capital, though parliament sits in The Hague.' },
  { country: 'Belgium', capital: 'Brussels', region: 'Europe', hint: 'Hosts both the EU institutions and NATO headquarters.' },
  { country: 'Romania', capital: 'Bucharest', region: 'Europe', hint: 'Home to one of the largest and heaviest administrative buildings on Earth.' },
  { country: 'Croatia', capital: 'Zagreb', region: 'Europe', hint: 'Sits inland on the Sava, nowhere near the country’s famous coast.' },
  { country: 'Ukraine', capital: 'Kyiv', region: 'Europe', hint: 'Its cave monastery above the Dnieper dates from 1051.' },
  { country: 'Russia', capital: 'Moscow', region: 'Europe', hint: 'Its metro stations were built like palaces, with chandeliers and mosaics.' },
  { country: 'Estonia', capital: 'Tallinn', region: 'Europe', hint: 'Its walled medieval old town survives almost intact.' },

  // ── Middle East ───────────────────────────────────────────────────────────
  { country: 'Turkey', capital: 'Ankara', region: 'Middle East', hint: 'Took over as capital in 1923 from the far larger city on the Bosphorus.' },
  { country: 'Iran', capital: 'Tehran', region: 'Middle East', hint: 'Climbs the foothills of the Alborz mountains.' },
  { country: 'Iraq', capital: 'Baghdad', region: 'Middle East', hint: 'Founded in 762 as a perfectly round walled city on the Tigris.' },
  { country: 'Saudi Arabia', capital: 'Riyadh', region: 'Middle East', hint: 'Its name comes from the Arabic word for gardens.' },
  { country: 'United Arab Emirates', capital: 'Abu Dhabi', region: 'Middle East', hint: 'Not the country’s largest or best-known city.' },
  { country: 'Qatar', capital: 'Doha', region: 'Middle East', hint: 'Almost the entire country’s population lives in it.' },
  { country: 'Oman', capital: 'Muscat', region: 'Middle East', hint: 'Squeezed between bare mountains and the Gulf of Oman.' },
  { country: 'Jordan', capital: 'Amman', region: 'Middle East', hint: 'Built over hills, with a Roman theatre still in the centre of town.' },
  { country: 'Lebanon', capital: 'Beirut', region: 'Middle East', hint: 'Rebuilt after a civil war that ran for fifteen years to 1990.' },
  { country: 'Syria', capital: 'Damascus', region: 'Middle East', hint: 'One of the strongest claimants to the oldest continuously inhabited city.' },
  { country: 'Yemen', capital: 'Sanaa', region: 'Middle East', hint: 'Its old city is full of mud-brick tower houses picked out in white gypsum.' },
  { country: 'Bahrain', capital: 'Manama', region: 'Middle East', hint: 'On an island joined to Saudi Arabia by a 25 km causeway.' },

  // ── Asia ──────────────────────────────────────────────────────────────────
  { country: 'Japan', capital: 'Tokyo', region: 'Asia', hint: 'Called Edo until the emperor moved there in 1868.' },
  { country: 'China', capital: 'Beijing', region: 'Asia', hint: 'Its walled imperial palace holds close to a thousand buildings.' },
  { country: 'South Korea', capital: 'Seoul', region: 'Asia', hint: 'Straddles the Han river, about 50 km from a heavily fortified border.' },
  { country: 'North Korea', capital: 'Pyongyang', region: 'Asia', hint: 'Sits on the Taedong river, and foreigners see it only on a guided tour.' },
  { country: 'Mongolia', capital: 'Ulaanbaatar', region: 'Asia', hint: 'The coldest national capital in the world.' },
  { country: 'Vietnam', capital: 'Hanoi', region: 'Asia', hint: 'Its name means "inside the river"; it marked its thousandth year in 2010.' },
  { country: 'Thailand', capital: 'Bangkok', region: 'Asia', hint: 'Its full ceremonial name is the longest place name in the world.' },
  { country: 'Cambodia', capital: 'Phnom Penh', region: 'Asia', hint: 'Sits where the Mekong meets the river that drains the great lake.' },
  { country: 'Laos', capital: 'Vientiane', region: 'Asia', hint: 'Sits on the Mekong, directly across the water from Thailand.' },
  // Malaysia: Kuala Lumpur is the official capital; only the administrative and
  // judicial branches moved to the purpose-built Putrajaya in the late 1990s.
  { country: 'Malaysia', capital: 'Kuala Lumpur', region: 'Asia', hint: 'Twin towers of 452 m stand at its centre; the ministries moved to Putrajaya.' },
  { country: 'Philippines', capital: 'Manila', region: 'Asia', hint: 'Faces a bay known for its sunsets; its walled Spanish core is Intramuros.' },
  // Myanmar: the capital moved from Yangon to the purpose-built Naypyidaw in 2005-06.
  { country: 'Myanmar', capital: 'Naypyidaw', region: 'Asia', hint: 'A purpose-built city of twenty-lane roads that are usually empty.' },
  { country: 'India', capital: 'New Delhi', region: 'Asia', hint: 'Laid out by British architects in the 1910s inside a far older city.' },
  { country: 'Pakistan', capital: 'Islamabad', region: 'Asia', hint: 'Built in the 1960s to take over from the big southern port city.' },
  { country: 'Bangladesh', capital: 'Dhaka', region: 'Asia', hint: 'Known for cycle rickshaws, counted in the hundreds of thousands.' },
  { country: 'Nepal', capital: 'Kathmandu', region: 'Asia', hint: 'Fills a bowl-shaped valley at 1,400 m, ringed by hills.' },
  // Sri Lanka: Sri Jayawardenepura Kotte is the legislative and official capital;
  // Colombo, next door, is the commercial centre and largest city.
  { country: 'Sri Lanka', capital: 'Sri Jayawardenepura Kotte', region: 'Asia', hint: 'The legislative capital, a suburb of the country’s biggest city.' },
  { country: 'Bhutan', capital: 'Thimphu', region: 'Asia', hint: 'One of the few capitals with no traffic lights at all.' },
  { country: 'Kazakhstan', capital: 'Astana', region: 'Asia', hint: 'Renamed more than once since 1998, and bitterly cold in winter.' },
  { country: 'Uzbekistan', capital: 'Tashkent', region: 'Asia', hint: 'Largely rebuilt in Soviet style after an earthquake in 1966.' },
  { country: 'Turkmenistan', capital: 'Ashgabat', region: 'Asia', hint: 'Holds the record for the most white marble-clad buildings.' },
  { country: 'Afghanistan', capital: 'Kabul', region: 'Asia', hint: 'Sits at 1,790 m in a narrow valley between mountains.' },
  { country: 'Maldives', capital: 'Malé', region: 'Asia', hint: 'One of the most densely populated islands on Earth.' },
  { country: 'Kyrgyzstan', capital: 'Bishkek', region: 'Asia', hint: 'Sits on a plain at the foot of the Kyrgyz Ala-Too range.' },

  // ── Africa ────────────────────────────────────────────────────────────────
  { country: 'Egypt', capital: 'Cairo', region: 'Africa', hint: 'The pyramids of Giza stand on its western edge.' },
  { country: 'Morocco', capital: 'Rabat', region: 'Africa', hint: 'An Atlantic capital, smaller than the country’s famous port city.' },
  { country: 'Algeria', capital: 'Algiers', region: 'Africa', hint: 'Its whitewashed casbah climbs a hill above the Mediterranean.' },
  { country: 'Tunisia', capital: 'Tunis', region: 'Africa', hint: 'The ruins of Carthage sit on its outskirts.' },
  { country: 'Libya', capital: 'Tripoli', region: 'Africa', hint: 'A Roman triumphal arch from AD 165 stands in its old town.' },
  { country: 'Sudan', capital: 'Khartoum', region: 'Africa', hint: 'Sits where the Blue Nile and the White Nile join.' },
  { country: 'Ethiopia', capital: 'Addis Ababa', region: 'Africa', hint: 'Sits at about 2,350 m and hosts the African Union headquarters.' },
  { country: 'Kenya', capital: 'Nairobi', region: 'Africa', hint: 'A national park with lions in it borders the city.' },
  { country: 'Uganda', capital: 'Kampala', region: 'Africa', hint: 'Built over hills near the north shore of Lake Victoria.' },
  { country: 'Rwanda', capital: 'Kigali', region: 'Africa', hint: 'Spread across ridges and valleys in the middle of a small country.' },
  // Tanzania: Dodoma was designated capital in the 1970s and the transfer of
  // government was completed in 1996; Dar es Salaam remains the largest city.
  { country: 'Tanzania', capital: 'Dodoma', region: 'Africa', hint: 'Chosen to move government inland; the old coastal capital is still far bigger.' },
  // Nigeria: Abuja replaced Lagos as capital in 1991.
  { country: 'Nigeria', capital: 'Abuja', region: 'Africa', hint: 'Built in the centre of the country and took over as capital in 1991.' },
  { country: 'Ghana', capital: 'Accra', region: 'Africa', hint: 'On the Gulf of Guinea, with the country’s independence arch at its centre.' },
  { country: 'Senegal', capital: 'Dakar', region: 'Africa', hint: 'On a peninsula at the westernmost point of mainland Africa.' },
  { country: 'Mali', capital: 'Bamako', region: 'Africa', hint: 'Straddles the Niger river and has grown extremely fast.' },
  // Côte d'Ivoire: Yamoussoukro has been the official capital since 1983; Abidjan
  // remains the seat of government and the largest city.
  { country: 'Côte d’Ivoire', capital: 'Yamoussoukro', region: 'Africa', hint: 'A small inland town holding the largest church in the world.' },
  // Benin: Porto-Novo is the official capital; Cotonou is the seat of government.
  { country: 'Benin', capital: 'Porto-Novo', region: 'Africa', hint: 'The official capital, though the government works from the bigger port city.' },
  { country: 'Cameroon', capital: 'Yaoundé', region: 'Africa', hint: 'Built across seven hills, inland from the country’s main port.' },
  { country: 'DR Congo', capital: 'Kinshasa', region: 'Africa', hint: 'Faces another country’s capital across a river.' },
  { country: 'Angola', capital: 'Luanda', region: 'Africa', hint: 'A Portuguese-speaking Atlantic port, long one of the priciest cities for expats.' },
  { country: 'Zambia', capital: 'Lusaka', region: 'Africa', hint: 'Sits on a plateau at about 1,280 m in the south of the country.' },
  { country: 'Zimbabwe', capital: 'Harare', region: 'Africa', hint: 'Renamed from Salisbury in 1982.' },
  { country: 'Botswana', capital: 'Gaborone', region: 'Africa', hint: 'Grew from a village into a capital after independence in 1966.' },
  { country: 'Namibia', capital: 'Windhoek', region: 'Africa', hint: 'Sits in central highlands, still lined with German colonial buildings.' },
  { country: 'Madagascar', capital: 'Antananarivo', region: 'Africa', hint: 'Built on a ridge at about 1,280 m in the island’s highlands.' },
  { country: 'Mozambique', capital: 'Maputo', region: 'Africa', hint: 'An Indian Ocean port in the far south, closer to South Africa than to home.' },
  { country: 'Somalia', capital: 'Mogadishu', region: 'Africa', hint: 'An Indian Ocean port with centuries of Arab and Persian trade behind it.' },
  { country: 'Burkina Faso', capital: 'Ouagadougou', region: 'Africa', hint: 'Hosts Africa’s biggest film festival every two years.' },

  // ── North America & Caribbean ─────────────────────────────────────────────
  { country: 'United States', capital: 'Washington, D.C.', region: 'North America & Caribbean', hint: 'A federal district that belongs to no state.' },
  { country: 'Canada', capital: 'Ottawa', region: 'North America & Caribbean', hint: 'Sits on a river border between two provinces, and is not the largest city.' },
  { country: 'Mexico', capital: 'Mexico City', region: 'North America & Caribbean', hint: 'Built on a drained lake bed, and still sinking into it.' },
  { country: 'Cuba', capital: 'Havana', region: 'North America & Caribbean', hint: 'Its harbour entrance is guarded by two 16th-century Spanish forts.' },
  { country: 'Jamaica', capital: 'Kingston', region: 'North America & Caribbean', hint: 'Sits on one of the largest natural harbours in the world.' },
  { country: 'Haiti', capital: 'Port-au-Prince', region: 'North America & Caribbean', hint: 'Wrecked by an earthquake in 2010.' },
  { country: 'Dominican Republic', capital: 'Santo Domingo', region: 'North America & Caribbean', hint: 'The oldest continuously inhabited European settlement in the Americas.' },
  { country: 'Costa Rica', capital: 'San José', region: 'North America & Caribbean', hint: 'Sits in a central valley at about 1,170 m, between two mountain ranges.' },
  { country: 'Honduras', capital: 'Tegucigalpa', region: 'North America & Caribbean', hint: 'A hillside city whose name is usually glossed as "silver hills".' },
  { country: 'Nicaragua', capital: 'Managua', region: 'North America & Caribbean', hint: 'On a lake shore, and flattened by an earthquake in 1972.' },
  { country: 'Belize', capital: 'Belmopan', region: 'North America & Caribbean', hint: 'Built inland in 1970 after a hurricane wrecked the old coastal capital.' },
  { country: 'Bahamas', capital: 'Nassau', region: 'North America & Caribbean', hint: 'On New Providence island, and a pirate base in the early 1700s.' },
  { country: 'Trinidad and Tobago', capital: 'Port of Spain', region: 'North America & Caribbean', hint: 'Home of a carnival held in the days before Lent.' },
  { country: 'Barbados', capital: 'Bridgetown', region: 'North America & Caribbean', hint: 'Its parliament is among the oldest in the Americas, sitting since 1639.' },

  // ── Oceania ───────────────────────────────────────────────────────────────
  { country: 'Australia', capital: 'Canberra', region: 'Oceania', hint: 'Purpose-built as a compromise between the two rival big cities.' },
  { country: 'New Zealand', capital: 'Wellington', region: 'Oceania', hint: 'The southernmost capital of a sovereign state, and famously windy.' },
  { country: 'Fiji', capital: 'Suva', region: 'Oceania', hint: 'On the wet southeast coast of the main island, Viti Levu.' },
  { country: 'Papua New Guinea', capital: 'Port Moresby', region: 'Oceania', hint: 'No road connects it to the country’s other major towns.' },
  { country: 'Samoa', capital: 'Apia', region: 'Oceania', hint: 'Robert Louis Stevenson spent his last years here and is buried above the town.' },
  { country: 'Tonga', capital: 'Nuku’alofa', region: 'Oceania', hint: 'Capital of the last Pacific kingdom, never formally colonised.' },
  { country: 'Vanuatu', capital: 'Port Vila', region: 'Oceania', hint: 'On Efate island, a short flight from an accessible active volcano.' },
  { country: 'Solomon Islands', capital: 'Honiara', region: 'Oceania', hint: 'On Guadalcanal, site of a long campaign in 1942.' },
  { country: 'Palau', capital: 'Ngerulmud', region: 'Oceania', hint: 'The least populated capital in the world, with a few hundred residents.' },
  { country: 'Marshall Islands', capital: 'Majuro', region: 'Oceania', hint: 'A thin ring of coral islets around a lagoon.' },
];
