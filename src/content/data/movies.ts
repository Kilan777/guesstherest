/**
 * Films for the three movie games — poster tiles, trailer clips and release years.
 *
 * Every row here was verified against two live sources: the Wikipedia article
 * resolves to a poster image, its text confirms the year, and the YouTube id
 * returns a real trailer whose title matches the film. Thirty candidates were
 * dropped for failing one of those checks — mostly trailer ids that no longer
 * play, which would have looked like a broken game rather than bad data.
 *
 * Posters are the low-resolution fair-use files Wikipedia hosts (~220px wide),
 * which is why the poster game reveals tiles rather than zooming in.
 */
/**
 * `start` is how many seconds into the trailer the clip should begin.
 *
 * It is measured, not guessed. Each trailer was played in a real browser and
 * sampled at five points between 30% and 70% in; at each point two frames 1.2s
 * apart were scored for motion, colour spread and darkness. Studio logos,
 * "FROM THE CREATORS OF" cards and release-date cards are static, flat or held
 * black, so they score low on all three; the offset kept here is the best
 * scoring point, and it is a moment the video was observed to be showing real
 * footage rather than text.
 */
export type MovieSeed = { wiki: string; title: string; year: number; yt: string; start: number };

export const MOVIES: MovieSeed[] = [
  { wiki: '2001:_A_Space_Odyssey_(film)', title: '2001: A Space Odyssey', year: 1968, yt: 'oR_e9y-bka0', start: 102 },
  { wiki: 'Alien_(film)', title: 'Alien', year: 1979, yt: 'LjLamj-b0I8', start: 41 },
  { wiki: 'Amélie', title: 'Amélie', year: 2001, yt: 'HUECWi5pX7o', start: 27 },
  { wiki: 'Arrival_(film)', title: 'Arrival', year: 2016, yt: 'tFMo3UJ4B4g', start: 45 },
  { wiki: 'Avatar_(2009_film)', title: 'Avatar', year: 2009, yt: '5PSNL1qE6VY', start: 150 },
  { wiki: 'Avengers:_Infinity_War', title: 'Avengers: Infinity War', year: 2018, yt: '6ZfuNTqbHE8', start: 74 },
  { wiki: 'Back_to_the_Future', title: 'Back to the Future', year: 1985, yt: 'qvsgGtivCgs', start: 74 },
  { wiki: 'Barbie_(film)', title: 'Barbie', year: 2023, yt: 'pBk4NYhWNMM', start: 98 },
  { wiki: 'Blade_Runner', title: 'Blade Runner', year: 1982, yt: 'eogpIG53Cis', start: 67 },
  { wiki: 'Casablanca_(film)', title: 'Casablanca', year: 1942, yt: 'BkL9l7qovsE', start: 79 },
  { wiki: 'City_of_God_(2002_film)', title: 'City of God', year: 2002, yt: 'ioUE_5wpg_E', start: 35 },
  { wiki: 'Coco_(2017_film)', title: 'Coco', year: 2017, yt: 'Ga6RYejo6Hk', start: 104 },
  { wiki: 'Deadpool_(film)', title: 'Deadpool', year: 2016, yt: 'ONHBaC-pfsk', start: 50 },
  { wiki: 'Django_Unchained', title: 'Django Unchained', year: 2012, yt: '0fUCuvNlOCg', start: 79 },
  { wiki: 'Dune_(2021_film)', title: 'Dune', year: 2021, yt: 'n9xhJrPXop4', start: 75 },
  { wiki: 'E.T._the_Extra-Terrestrial', title: 'E.T. the Extra-Terrestrial', year: 1982, yt: 'qYAETtIIClk', start: 64 },
  { wiki: 'Fight_Club', title: 'Fight Club', year: 1999, yt: 'qtRKdVHc-cE', start: 105 },
  { wiki: 'Forrest_Gump', title: 'Forrest Gump', year: 1994, yt: 'bLvqoHBptjg', start: 115 },
  { wiki: 'Frozen_(2013_film)', title: 'Frozen', year: 2013, yt: 'TbQm5doF_Uc', start: 78 },
  { wiki: 'Get_Out', title: 'Get Out', year: 2017, yt: 'DzfpyUB60YY', start: 93 },
  { wiki: 'Gladiator_(2000_film)', title: 'Gladiator', year: 2000, yt: 'owK1qxDselE', start: 67 },
  { wiki: 'Goodfellas', title: 'Goodfellas', year: 1990, yt: '2ilzidi_J8Q', start: 28 },
  { wiki: 'Gravity_(2013_film)', title: 'Gravity', year: 2013, yt: 'OiTiKOy59o4', start: 73 },
  { wiki: 'Groundhog_Day_(film)', title: 'Groundhog Day', year: 1993, yt: 'tSVeDx9fk60', start: 65 },
  { wiki: 'Guardians_of_the_Galaxy_(film)', title: 'Guardians of the Galaxy', year: 2014, yt: 'd96cjJhvlMA', start: 107 },
  { wiki: "Harry_Potter_and_the_Philosopher's_Stone_(film)", title: "Harry Potter and the Philosopher's Stone", year: 2001, yt: 'VyHV0BRtdxo', start: 97 },
  { wiki: 'Home_Alone', title: 'Home Alone', year: 1990, yt: 'jEDaVHmw7r4', start: 95 },
  { wiki: 'Inception', title: 'Inception', year: 2010, yt: 'YoHD9XEInc0', start: 59 },
  { wiki: 'Independence_Day_(1996_film)', title: 'Independence Day', year: 1996, yt: 'B1E7h3SeMDk', start: 90 },
  { wiki: 'Inside_Out_(2015_film)', title: 'Inside Out', year: 2015, yt: 'yRUAzGQ3nSY', start: 103 },
  { wiki: 'Interstellar_(film)', title: 'Interstellar', year: 2014, yt: 'zSWdZVtXT7E', start: 89 },
  { wiki: 'Iron_Man_(2008_film)', title: 'Iron Man', year: 2008, yt: '8ugaeA-nMTc', start: 108 },
  { wiki: 'Jaws_(film)', title: 'Jaws', year: 1975, yt: 'U1fu_sA7XhE', start: 82 },
  { wiki: 'Joker_(2019_film)', title: 'Joker', year: 2019, yt: 'zAGVQLHvwOY', start: 74 },
  { wiki: 'Jurassic_Park_(film)', title: 'Jurassic Park', year: 1993, yt: 'lc0UehYemQA', start: 64 },
  { wiki: 'Knives_Out', title: 'Knives Out', year: 2019, yt: 'qGqiHJTsRkQ', start: 71 },
  { wiki: 'La_La_Land', title: 'La La Land', year: 2016, yt: '0pdqf4P9MB8', start: 60 },
  { wiki: 'Mad_Max:_Fury_Road', title: 'Mad Max: Fury Road', year: 2015, yt: 'hEJnMQG9ev8', start: 77 },
  { wiki: 'Memento_(film)', title: 'Memento', year: 2000, yt: '0vS0E9bBSL0', start: 101 },
  { wiki: 'Moana_(2016_film)', title: 'Moana', year: 2016, yt: 'LKFuXETZUsI', start: 94 },
  { wiki: 'Moonlight_(2016_film)', title: 'Moonlight', year: 2016, yt: '9NJj12tJzqc', start: 71 },
  { wiki: 'My_Neighbor_Totoro', title: 'My Neighbor Totoro', year: 1988, yt: '92a7Hj0ijLs', start: 23 },
  { wiki: 'Oldboy_(2003_film)', title: 'Oldboy', year: 2003, yt: '2HkjrJ6IK5E', start: 37 },
  { wiki: 'Oppenheimer_(film)', title: 'Oppenheimer', year: 2023, yt: 'uYPbbksJxIg', start: 114 },
  { wiki: 'Parasite_(2019_film)', title: 'Parasite', year: 2019, yt: '5xH0HfJHsaY', start: 43 },
  { wiki: 'Pirates_of_the_Caribbean:_The_Curse_of_the_Black_Pearl', title: 'Pirates of the Caribbean: The Curse of the Black Pearl', year: 2003, yt: 'naQr0uTrH_s', start: 45 },
  { wiki: 'Princess_Mononoke', title: 'Princess Mononoke', year: 1997, yt: '4OiMOHRDs14', start: 32 },
  { wiki: 'Psycho_(1960_film)', title: 'Psycho', year: 1960, yt: 'NG3-GlvKPcg', start: 42 },
  { wiki: 'Pulp_Fiction', title: 'Pulp Fiction', year: 1994, yt: 's7EdQ4FqbhY', start: 132 },
  { wiki: 'Ratatouille_(film)', title: 'Ratatouille', year: 2007, yt: 'NgsQ8mVkN8w', start: 35 },
  { wiki: 'Saving_Private_Ryan', title: 'Saving Private Ryan', year: 1998, yt: '9CiW_DgxCnQ', start: 54 },
  { wiki: "Schindler's_List", title: "Schindler's List", year: 1993, yt: 'gG22XNhtnoY', start: 127 },
  { wiki: 'Seven_(1995_film)', title: 'Se7en', year: 1995, yt: 'znmZoVkCjpI', start: 70 },
  { wiki: 'Shrek', title: 'Shrek', year: 2001, yt: 'CwXOrWvPBPk', start: 97 },
  { wiki: 'Slumdog_Millionaire', title: 'Slumdog Millionaire', year: 2008, yt: 'AIzbwV7on6Q', start: 90 },
  { wiki: 'Spider-Man_(2002_film)', title: 'Spider-Man', year: 2002, yt: 't06RUxPbp_c', start: 60 },
  { wiki: 'Spider-Man:_Into_the_Spider-Verse', title: 'Spider-Man: Into the Spider-Verse', year: 2018, yt: 'g4Hbz2jLxvQ', start: 50 },
  { wiki: 'Spirited_Away', title: 'Spirited Away', year: 2001, yt: 'ByXuk9QqQkk', start: 104 },
  { wiki: 'Star_Wars_(film)', title: 'Star Wars', year: 1977, yt: 'vZ734NWnAHA', start: 35 },
  { wiki: 'Terminator_2:_Judgment_Day', title: 'Terminator 2: Judgment Day', year: 1991, yt: 'CRRlbK5w8AE', start: 95 },
  { wiki: 'The_Avengers_(2012_film)', title: 'The Avengers', year: 2012, yt: 'eOrNdBpGMv8', start: 39 },
  { wiki: 'The_Batman_(film)', title: 'The Batman', year: 2022, yt: 'mqqft2x_Aa4', start: 97 },
  { wiki: 'The_Dark_Knight', title: 'The Dark Knight', year: 2008, yt: 'EXeTwQWrcwY', start: 77 },
  { wiki: 'The_Empire_Strikes_Back', title: 'The Empire Strikes Back', year: 1980, yt: 'JNwNXF9Y6kY', start: 78 },
  { wiki: 'The_Godfather', title: 'The Godfather', year: 1972, yt: 'sY1S34973zA', start: 49 },
  { wiki: 'The_Grand_Budapest_Hotel', title: 'The Grand Budapest Hotel', year: 2014, yt: '1Fg5iWmQjwk', start: 103 },
  { wiki: 'The_Green_Mile_(film)', title: 'The Green Mile', year: 1999, yt: 'Ki4haFrqSrw', start: 71 },
  { wiki: 'The_Hunger_Games_(film)', title: 'The Hunger Games', year: 2012, yt: 'mfmrPu43DF8', start: 64 },
  { wiki: 'The_Lion_King', title: 'The Lion King', year: 1994, yt: '4sj1MT05lAA', start: 107 },
  { wiki: 'The_Lord_of_the_Rings:_The_Fellowship_of_the_Ring', title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, yt: 'V75dMMIW2B4', start: 54 },
  { wiki: 'The_Matrix', title: 'The Matrix', year: 1999, yt: 'vKQi3bBA1y8', start: 99 },
  { wiki: 'The_Prestige_(film)', title: 'The Prestige', year: 2006, yt: 'o4gHCmTQDVI', start: 110 },
  { wiki: 'The_Revenant_(2015_film)', title: 'The Revenant', year: 2015, yt: 'LoebZZ8K5N0', start: 102 },
  { wiki: 'The_Shawshank_Redemption', title: 'The Shawshank Redemption', year: 1994, yt: 'NmzuHjWmXOc', start: 50 },
  { wiki: 'The_Shining_(film)', title: 'The Shining', year: 1980, yt: 'S014oGZiSdI', start: 37 },
  { wiki: 'The_Silence_of_the_Lambs_(film)', title: 'The Silence of the Lambs', year: 1991, yt: 'W6Mm8Sbe__o', start: 67 },
  { wiki: 'The_Sixth_Sense', title: 'The Sixth Sense', year: 1999, yt: 'VG9AGf66tXM', start: 86 },
  { wiki: 'The_Social_Network', title: 'The Social Network', year: 2010, yt: 'lB95KLmpLR4', start: 47 },
  { wiki: 'The_Terminator', title: 'The Terminator', year: 1984, yt: 'k64P4l2Wmeg', start: 49 },
  { wiki: 'The_Wizard_of_Oz_(1939_film)', title: 'The Wizard of Oz', year: 1939, yt: 'PSZxmZmBfnU', start: 50 },
  { wiki: 'The_Wolf_of_Wall_Street_(2013_film)', title: 'The Wolf of Wall Street', year: 2013, yt: 'iszwuX1AK6A', start: 42 },
  { wiki: 'Titanic_(1997_film)', title: 'Titanic', year: 1997, yt: '2e-eXJ6HgkQ', start: 37 },
  { wiki: 'Top_Gun:_Maverick', title: 'Top Gun: Maverick', year: 2022, yt: 'qSqVVswa420', start: 94 },
  { wiki: 'Toy_Story', title: 'Toy Story', year: 1995, yt: 'v-PjgYDrg70', start: 64 },
  { wiki: 'Whiplash_(2014_film)', title: 'Whiplash', year: 2014, yt: '7d_jQycdQGo', start: 78 },
  { wiki: 'Your_Name', title: 'Your Name', year: 2016, yt: 'xU47nhruN-Q', start: 41 },
  { wiki: 'Zootopia', title: 'Zootopia', year: 2016, yt: 'jWM0ct-OLsM', start: 118 },
];
