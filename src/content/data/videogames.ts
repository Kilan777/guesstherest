/**
 * Games whose box art is famous enough to name from a handful of tiles.
 *
 * The lead image on a Wikipedia game article is almost always the cover, and
 * almost always a non-free file kept deliberately small — a few hundred pixels
 * wide. That resolution rules out zooming, which is why this deck is played
 * through a tile grid instead.
 *
 * Every title was checked against the live summary API: HTTP 200, not a
 * disambiguation page, and an `originalimage` present. Titles are stored raw
 * rather than percent-encoded — `pageInfo` encodes them itself, and a
 * pre-encoded title comes back 403. Franchise articles carry no cover art, so
 * the ones that redirect to a series page (Minecraft, Fortnite, Undertale,
 * Fall Guys) are absent, and several others are disambiguated to the game.
 */
export type VideoGameSeed = { wiki: string; label: string; year: number };

export const VIDEO_GAMES: VideoGameSeed[] = [
  { wiki: 'The_Legend_of_Zelda:_Breath_of_the_Wild', label: 'The Legend of Zelda: Breath of the Wild', year: 2017 },
  { wiki: 'The_Legend_of_Zelda:_Ocarina_of_Time', label: 'The Legend of Zelda: Ocarina of Time', year: 1998 },
  { wiki: 'The_Legend_of_Zelda:_Tears_of_the_Kingdom', label: 'The Legend of Zelda: Tears of the Kingdom', year: 2023 },
  { wiki: 'Super_Mario_Bros.', label: 'Super Mario Bros.', year: 1985 },
  { wiki: 'Super_Mario_World', label: 'Super Mario World', year: 1990 },
  { wiki: 'Super_Mario_64', label: 'Super Mario 64', year: 1996 },
  { wiki: 'Super_Mario_Odyssey', label: 'Super Mario Odyssey', year: 2017 },
  { wiki: 'Mario_Kart_8', label: 'Mario Kart 8', year: 2014 },
  { wiki: 'Super_Smash_Bros._Melee', label: 'Super Smash Bros. Melee', year: 2001 },
  { wiki: 'Donkey_Kong_(1981_video_game)', label: 'Donkey Kong', year: 1981 },
  { wiki: 'Donkey_Kong_Country', label: 'Donkey Kong Country', year: 1994 },
  { wiki: 'Metroid_Prime', label: 'Metroid Prime', year: 2002 },
  { wiki: 'Pokémon_Red_and_Blue', label: 'Pokémon Red and Blue', year: 1996 },
  { wiki: 'Animal_Crossing:_New_Horizons', label: 'Animal Crossing: New Horizons', year: 2020 },
  { wiki: 'Tetris_(NES_video_game)', label: 'Tetris', year: 1989 },
  { wiki: 'Pac-Man', label: 'Pac-Man', year: 1980 },
  { wiki: 'Space_Invaders', label: 'Space Invaders', year: 1978 },
  { wiki: 'Street_Fighter_II', label: 'Street Fighter II', year: 1991 },
  { wiki: 'Mortal_Kombat_(1992_video_game)', label: 'Mortal Kombat', year: 1992 },
  { wiki: 'Sonic_the_Hedgehog_(1991_video_game)', label: 'Sonic the Hedgehog', year: 1991 },
  { wiki: 'Doom_(1993_video_game)', label: 'Doom', year: 1993 },
  { wiki: 'Half-Life_(video_game)', label: 'Half-Life', year: 1998 },
  { wiki: 'Half-Life_2', label: 'Half-Life 2', year: 2004 },
  { wiki: 'Portal_(video_game)', label: 'Portal', year: 2007 },
  { wiki: 'Portal_2', label: 'Portal 2', year: 2011 },
  { wiki: 'Halo:_Combat_Evolved', label: 'Halo: Combat Evolved', year: 2001 },
  { wiki: 'Call_of_Duty_4:_Modern_Warfare', label: 'Call of Duty 4: Modern Warfare', year: 2007 },
  { wiki: 'Grand_Theft_Auto:_San_Andreas', label: 'Grand Theft Auto: San Andreas', year: 2004 },
  { wiki: 'Grand_Theft_Auto_V', label: 'Grand Theft Auto V', year: 2013 },
  { wiki: 'Red_Dead_Redemption_2', label: 'Red Dead Redemption 2', year: 2018 },
  { wiki: 'The_Last_of_Us_(video_game)', label: 'The Last of Us', year: 2013 },
  { wiki: 'Uncharted_2:_Among_Thieves', label: 'Uncharted 2: Among Thieves', year: 2009 },
  { wiki: 'God_of_War_(2018_video_game)', label: 'God of War', year: 2018 },
  { wiki: 'Shadow_of_the_Colossus', label: 'Shadow of the Colossus', year: 2005 },
  { wiki: 'Dark_Souls_(video_game)', label: 'Dark Souls', year: 2011 },
  { wiki: 'Bloodborne', label: 'Bloodborne', year: 2015 },
  { wiki: 'Sekiro:_Shadows_Die_Twice', label: 'Sekiro: Shadows Die Twice', year: 2019 },
  { wiki: 'Elden_Ring', label: 'Elden Ring', year: 2022 },
  { wiki: 'The_Witcher_3:_Wild_Hunt', label: 'The Witcher 3: Wild Hunt', year: 2015 },
  { wiki: 'The_Elder_Scrolls_V:_Skyrim', label: 'The Elder Scrolls V: Skyrim', year: 2011 },
  { wiki: 'Fallout_3', label: 'Fallout 3', year: 2008 },
  { wiki: 'BioShock', label: 'BioShock', year: 2007 },
  { wiki: 'Mass_Effect_2', label: 'Mass Effect 2', year: 2010 },
  { wiki: "Baldur's_Gate_3", label: "Baldur's Gate 3", year: 2023 },
  { wiki: "Assassin's_Creed_II", label: "Assassin's Creed II", year: 2009 },
  { wiki: 'Cyberpunk_2077', label: 'Cyberpunk 2077', year: 2020 },
  { wiki: 'Resident_Evil_4', label: 'Resident Evil 4', year: 2005 },
  { wiki: 'Silent_Hill_2', label: 'Silent Hill 2', year: 2001 },
  { wiki: 'Metal_Gear_Solid_(1998_video_game)', label: 'Metal Gear Solid', year: 1998 },
  { wiki: 'Final_Fantasy_VII', label: 'Final Fantasy VII', year: 1997 },
  { wiki: 'World_of_Warcraft', label: 'World of Warcraft', year: 2004 },
  { wiki: 'StarCraft_(video_game)', label: 'StarCraft', year: 1998 },
  { wiki: 'Diablo_II', label: 'Diablo II', year: 2000 },
  { wiki: 'Overwatch_(2016_video_game)', label: 'Overwatch', year: 2016 },
  { wiki: 'League_of_Legends', label: 'League of Legends', year: 2009 },
  { wiki: 'The_Sims_(video_game)', label: 'The Sims', year: 2000 },
  { wiki: 'Tomb_Raider_(1996_video_game)', label: 'Tomb Raider', year: 1996 },
  { wiki: 'Among_Us', label: 'Among Us', year: 2018 },
  { wiki: 'Stardew_Valley', label: 'Stardew Valley', year: 2016 },
  { wiki: 'Hollow_Knight', label: 'Hollow Knight', year: 2017 },
  { wiki: 'Hades_(video_game)', label: 'Hades', year: 2020 },
  { wiki: 'Cuphead', label: 'Cuphead', year: 2017 },
];
