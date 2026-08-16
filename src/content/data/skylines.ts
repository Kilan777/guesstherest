/**
 * Cities, keyed to their English Wikipedia articles. The lead image on a city
 * article is normally a skyline shot or a montage of the same, which is what the
 * zoom crops into — though a few cities lead with their best-known building
 * instead, so a round can turn on a roofline rather than a river bend.
 *
 * Two entries do not point at the city's own article. Singapore and Hong Kong
 * are territories as well as cities, so those articles lead with a flag; the
 * city-centre article is used instead and the answer is still the city.
 *
 * Weighted away from Europe and the United States on purpose: a deck that is
 * half European capitals is a deck about spires.
 *
 * Every title here was checked against the summary API: HTTP 200, not a
 * disambiguation page, and an `originalimage` present.
 */
export type SkylineSeed = { wiki: string; label: string; country: string };

export const SKYLINES: SkylineSeed[] = [
  // East and Southeast Asia
  { wiki: 'Kuala_Lumpur', label: 'Kuala Lumpur', country: 'Malaysia' },
  { wiki: 'Bangkok', label: 'Bangkok', country: 'Thailand' },
  { wiki: 'Central_Area,_Singapore', label: 'Singapore', country: 'Singapore' },
  { wiki: 'Jakarta', label: 'Jakarta', country: 'Indonesia' },
  { wiki: 'Manila', label: 'Manila', country: 'Philippines' },
  { wiki: 'Hanoi', label: 'Hanoi', country: 'Vietnam' },
  { wiki: 'Ho_Chi_Minh_City', label: 'Ho Chi Minh City', country: 'Vietnam' },
  { wiki: 'Seoul', label: 'Seoul', country: 'South Korea' },
  { wiki: 'Tokyo', label: 'Tokyo', country: 'Japan' },
  { wiki: 'Osaka', label: 'Osaka', country: 'Japan' },
  { wiki: 'Shanghai', label: 'Shanghai', country: 'China' },
  { wiki: 'Hong_Kong_Island', label: 'Hong Kong', country: 'China' },
  { wiki: 'Taipei', label: 'Taipei', country: 'Taiwan' },
  { wiki: 'Beijing', label: 'Beijing', country: 'China' },
  { wiki: 'Ulaanbaatar', label: 'Ulaanbaatar', country: 'Mongolia' },

  // South Asia
  { wiki: 'Mumbai', label: 'Mumbai', country: 'India' },
  { wiki: 'Delhi', label: 'Delhi', country: 'India' },
  { wiki: 'Kolkata', label: 'Kolkata', country: 'India' },
  { wiki: 'Karachi', label: 'Karachi', country: 'Pakistan' },
  { wiki: 'Dhaka', label: 'Dhaka', country: 'Bangladesh' },
  { wiki: 'Kathmandu', label: 'Kathmandu', country: 'Nepal' },

  // Middle East and Central Asia
  { wiki: 'Dubai', label: 'Dubai', country: 'United Arab Emirates' },
  { wiki: 'Doha', label: 'Doha', country: 'Qatar' },
  { wiki: 'Riyadh', label: 'Riyadh', country: 'Saudi Arabia' },
  { wiki: 'Kuwait_City', label: 'Kuwait City', country: 'Kuwait' },
  { wiki: 'Muscat,_Oman', label: 'Muscat', country: 'Oman' },
  { wiki: 'Amman', label: 'Amman', country: 'Jordan' },
  { wiki: 'Beirut', label: 'Beirut', country: 'Lebanon' },
  { wiki: 'Istanbul', label: 'Istanbul', country: 'Turkey' },
  { wiki: 'Tehran', label: 'Tehran', country: 'Iran' },
  { wiki: 'Baku', label: 'Baku', country: 'Azerbaijan' },
  { wiki: 'Tashkent', label: 'Tashkent', country: 'Uzbekistan' },
  { wiki: 'Almaty', label: 'Almaty', country: 'Kazakhstan' },

  // Africa
  { wiki: 'Cairo', label: 'Cairo', country: 'Egypt' },
  { wiki: 'Casablanca', label: 'Casablanca', country: 'Morocco' },
  { wiki: 'Algiers', label: 'Algiers', country: 'Algeria' },
  { wiki: 'Lagos', label: 'Lagos', country: 'Nigeria' },
  { wiki: 'Accra', label: 'Accra', country: 'Ghana' },
  { wiki: 'Nairobi', label: 'Nairobi', country: 'Kenya' },
  { wiki: 'Addis_Ababa', label: 'Addis Ababa', country: 'Ethiopia' },
  { wiki: 'Dar_es_Salaam', label: 'Dar es Salaam', country: 'Tanzania' },
  { wiki: 'Luanda', label: 'Luanda', country: 'Angola' },
  { wiki: 'Johannesburg', label: 'Johannesburg', country: 'South Africa' },
  { wiki: 'Cape_Town', label: 'Cape Town', country: 'South Africa' },

  // The Americas
  { wiki: 'Mexico_City', label: 'Mexico City', country: 'Mexico' },
  { wiki: 'Havana', label: 'Havana', country: 'Cuba' },
  { wiki: 'Panama_City', label: 'Panama City', country: 'Panama' },
  { wiki: 'Bogotá', label: 'Bogotá', country: 'Colombia' },
  { wiki: 'Lima', label: 'Lima', country: 'Peru' },
  { wiki: 'Santiago', label: 'Santiago', country: 'Chile' },
  { wiki: 'Buenos_Aires', label: 'Buenos Aires', country: 'Argentina' },
  { wiki: 'São_Paulo', label: 'São Paulo', country: 'Brazil' },
  { wiki: 'Rio_de_Janeiro', label: 'Rio de Janeiro', country: 'Brazil' },
  { wiki: 'Caracas', label: 'Caracas', country: 'Venezuela' },
  { wiki: 'Toronto', label: 'Toronto', country: 'Canada' },
  { wiki: 'New_York_City', label: 'New York City', country: 'United States' },

  // Oceania and Europe
  { wiki: 'Sydney', label: 'Sydney', country: 'Australia' },
  { wiki: 'Melbourne', label: 'Melbourne', country: 'Australia' },
  { wiki: 'Auckland', label: 'Auckland', country: 'New Zealand' },
  { wiki: 'Moscow', label: 'Moscow', country: 'Russia' },
  { wiki: 'Athens', label: 'Athens', country: 'Greece' },
];
