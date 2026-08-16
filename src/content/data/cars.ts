/**
 * Cars with a shape people recognise from across a car park, keyed to their
 * Wikipedia articles.
 *
 * Two things kept knocking seeds out while this list was being built: marque
 * articles (`Mini_(marque)`, `Ferrari`) that are about a company rather than a
 * car, and model-range articles whose lead image is a spec table rather than a
 * photograph. Every title here was checked to return a real `originalimage`.
 *
 * `era` is production years, shown only after the round is over.
 * Titles are stored decoded — `pageInfo` encodes them itself.
 */
export type CarSeed = { wiki: string; label: string; era: string };

export const CARS: CarSeed[] = [
  { wiki: 'Volkswagen_Beetle', label: 'Volkswagen Beetle', era: '1938–2003' },
  { wiki: 'Austin_Mini', label: 'Mini', era: '1959–2000' },
  { wiki: 'Ford_Model_T', label: 'Ford Model T', era: '1908–1927' },
  { wiki: 'Ford_Model_A_(1927–1931)', label: 'Ford Model A', era: '1927–1931' },
  { wiki: 'Citroën_2CV', label: 'Citroën 2CV', era: '1948–1990' },
  { wiki: 'Citroën_DS', label: 'Citroën DS', era: '1955–1975' },
  { wiki: 'Fiat_500', label: 'Fiat 500', era: '1957–1975' },
  { wiki: 'Fiat_Panda', label: 'Fiat Panda', era: '1980–present' },
  { wiki: 'Trabant_601', label: 'Trabant 601', era: '1964–1990' },
  { wiki: 'Lada_Riva', label: 'Lada Riva', era: '1980–2012' },
  { wiki: 'Morris_Minor', label: 'Morris Minor', era: '1948–1972' },
  { wiki: 'Renault_4', label: 'Renault 4', era: '1961–1994' },
  { wiki: 'Peugeot_205', label: 'Peugeot 205', era: '1983–1999' },
  { wiki: 'Ford_Cortina', label: 'Ford Cortina', era: '1962–1982' },
  { wiki: 'Ford_Escort_(Europe)', label: 'Ford Escort', era: '1968–2004' },

  { wiki: 'Chevrolet_Corvette', label: 'Chevrolet Corvette', era: '1953–present' },
  { wiki: 'Ford_Mustang', label: 'Ford Mustang', era: '1964–present' },
  { wiki: 'Shelby_Mustang', label: 'Shelby Mustang', era: '1965–1970' },
  { wiki: 'Chevrolet_Camaro', label: 'Chevrolet Camaro', era: '1966–2024' },
  { wiki: 'Pontiac_Firebird', label: 'Pontiac Firebird', era: '1967–2002' },
  { wiki: 'Pontiac_GTO', label: 'Pontiac GTO', era: '1963–1974' },
  { wiki: 'Dodge_Charger_(B-body)', label: 'Dodge Charger', era: '1966–1978' },
  { wiki: 'Plymouth_Barracuda', label: 'Plymouth Barracuda', era: '1964–1974' },
  { wiki: 'Chevrolet_Bel_Air', label: 'Chevrolet Bel Air', era: '1950–1975' },
  { wiki: 'Cadillac_Eldorado', label: 'Cadillac Eldorado', era: '1952–2002' },
  { wiki: 'Ford_Thunderbird', label: 'Ford Thunderbird', era: '1955–2005' },
  { wiki: 'Lincoln_Continental', label: 'Lincoln Continental', era: '1939–2020' },
  { wiki: 'AMC_Gremlin', label: 'AMC Gremlin', era: '1970–1978' },
  { wiki: 'Dodge_Viper', label: 'Dodge Viper', era: '1992–2017' },
  { wiki: 'Ford_F-Series', label: 'Ford F-Series', era: '1948–present' },

  { wiki: 'Porsche_356', label: 'Porsche 356', era: '1948–1965' },
  { wiki: 'Porsche_911', label: 'Porsche 911', era: '1964–present' },
  { wiki: 'Volkswagen_Type_2', label: 'Volkswagen Type 2', era: '1950–2013' },
  { wiki: 'Volkswagen_Karmann_Ghia', label: 'Volkswagen Karmann Ghia', era: '1955–1974' },
  { wiki: 'Volkswagen_Golf', label: 'Volkswagen Golf', era: '1974–present' },
  { wiki: 'Mercedes-Benz_300SL', label: 'Mercedes-Benz 300 SL', era: '1954–1963' },
  { wiki: 'Mercedes-Benz_W123', label: 'Mercedes-Benz W123', era: '1976–1986' },
  { wiki: 'Mercedes-Benz_G-Class', label: 'Mercedes-Benz G-Class', era: '1979–present' },
  { wiki: 'BMW_Isetta', label: 'BMW Isetta', era: '1955–1962' },
  { wiki: 'BMW_M3', label: 'BMW M3', era: '1986–present' },
  { wiki: 'Audi_Quattro', label: 'Audi Quattro', era: '1980–1991' },
  { wiki: 'Smart_Fortwo', label: 'Smart Fortwo', era: '1998–present' },

  { wiki: 'Ferrari_250_GTO', label: 'Ferrari 250 GTO', era: '1962–1964' },
  { wiki: 'Ferrari_Testarossa', label: 'Ferrari Testarossa', era: '1984–1996' },
  { wiki: 'Ferrari_F40', label: 'Ferrari F40', era: '1987–1992' },
  { wiki: 'Lamborghini_Miura', label: 'Lamborghini Miura', era: '1966–1973' },
  { wiki: 'Lamborghini_Countach', label: 'Lamborghini Countach', era: '1974–1990' },
  { wiki: 'Lamborghini_Diablo', label: 'Lamborghini Diablo', era: '1990–2001' },
  { wiki: 'Bugatti_Veyron', label: 'Bugatti Veyron', era: '2005–2015' },
  { wiki: 'Lancia_Delta', label: 'Lancia Delta', era: '1979–1999' },
  { wiki: 'Alfa_Romeo_Spider', label: 'Alfa Romeo Spider', era: '1966–1993' },

  { wiki: 'Jaguar_E-Type', label: 'Jaguar E-Type', era: '1961–1975' },
  { wiki: 'Aston_Martin_DB5', label: 'Aston Martin DB5', era: '1963–1965' },
  { wiki: 'Rolls-Royce_Silver_Ghost', label: 'Rolls-Royce Silver Ghost', era: '1906–1926' },
  { wiki: 'McLaren_F1', label: 'McLaren F1', era: '1992–1998' },
  { wiki: 'Lotus_Esprit', label: 'Lotus Esprit', era: '1976–2004' },
  { wiki: 'Ford_GT40', label: 'Ford GT40', era: '1964–1969' },
  { wiki: 'DeLorean_DMC-12', label: 'DeLorean DMC-12', era: '1981–1983' },
  { wiki: 'Land_Rover_Defender', label: 'Land Rover Defender', era: '1983–present' },
  { wiki: 'Willys_MB', label: 'Willys MB Jeep', era: '1941–1945' },
  { wiki: 'Jeep_Wrangler', label: 'Jeep Wrangler', era: '1986–present' },
  { wiki: 'Hummer_H1', label: 'Hummer H1', era: '1992–2006' },
  { wiki: 'Volvo_240', label: 'Volvo 240', era: '1974–1993' },
  { wiki: 'Saab_900', label: 'Saab 900', era: '1978–1998' },

  { wiki: 'Toyota_Corolla', label: 'Toyota Corolla', era: '1966–present' },
  { wiki: 'Toyota_Land_Cruiser', label: 'Toyota Land Cruiser', era: '1951–present' },
  { wiki: 'Toyota_Supra', label: 'Toyota Supra', era: '1978–present' },
  { wiki: 'Toyota_Prius', label: 'Toyota Prius', era: '1997–present' },
  { wiki: 'Datsun_240Z', label: 'Datsun 240Z', era: '1969–1978' },
  { wiki: 'Nissan_Skyline_GT-R', label: 'Nissan Skyline GT-R', era: '1969–2002' },
  { wiki: 'Nissan_Leaf', label: 'Nissan Leaf', era: '2010–present' },
  { wiki: 'Mazda_MX-5', label: 'Mazda MX-5', era: '1989–present' },
  { wiki: 'Honda_Civic', label: 'Honda Civic', era: '1972–present' },
  { wiki: 'Honda_NSX', label: 'Honda NSX', era: '1990–2005' },
  { wiki: 'Subaru_Impreza', label: 'Subaru Impreza', era: '1992–present' },
  { wiki: 'Mitsubishi_Lancer_Evolution', label: 'Mitsubishi Lancer Evolution', era: '1992–2016' },
  { wiki: 'Hyundai_Pony', label: 'Hyundai Pony', era: '1975–1990' },
  { wiki: 'Tesla_Model_S', label: 'Tesla Model S', era: '2012–present' },
];
