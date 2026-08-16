/**
 * Famous film lines, quoted as they are actually spoken.
 *
 * The popular version of a movie line is very often not the line. Casablanca
 * has no "Play it again, Sam"; Star Wars has no "Luke, I am your father"; Snow
 * White's queen says "Magic mirror on the wall". Where the real wording differs
 * from the one everybody repeats, the misquote is noted above the entry — a
 * quiz that rewards the wrong words would be worse than no quiz.
 */
export type FilmLineSeed = {
  line: string;
  title: string;
  year: number;
  /** Who says it, revealed on the last rung. */
  who: string;
  /** Genre or setting, revealed on the middle rung. */
  setting: string;
};

export const FILM_LINES: FilmLineSeed[] = [
  { line: 'To infinity and beyond!', title: 'Toy Story', year: 1995, who: 'Buzz Lightyear', setting: 'Animation, a boy’s bedroom' },
  { line: 'There’s no place like home.', title: 'The Wizard of Oz', year: 1939, who: 'Dorothy Gale', setting: 'Musical fantasy, a land over the rainbow' },
  { line: 'Toto, I’ve a feeling we’re not in Kansas anymore.', title: 'The Wizard of Oz', year: 1939, who: 'Dorothy Gale', setting: 'Musical fantasy, just after a tornado' },
  { line: 'E.T. phone home.', title: 'E.T. the Extra-Terrestrial', year: 1982, who: 'E.T.', setting: 'Family science fiction, suburban California' },
  { line: 'Just keep swimming.', title: 'Finding Nemo', year: 2003, who: 'Dory', setting: 'Animation, the Great Barrier Reef' },
  { line: 'May the Force be with you.', title: 'Star Wars', year: 1977, who: 'General Dodonna', setting: 'Space opera, a rebel briefing' },
  // Commonly misquoted as "Luke, I am your father" — the name is never said.
  { line: 'No, I am your father.', title: 'The Empire Strikes Back', year: 1980, who: 'Darth Vader', setting: 'Space opera, a cloud city' },
  { line: 'Do. Or do not. There is no try.', title: 'The Empire Strikes Back', year: 1980, who: 'Yoda', setting: 'Space opera, a swamp planet' },
  { line: 'Here’s looking at you, kid.', title: 'Casablanca', year: 1942, who: 'Rick Blaine', setting: 'Wartime romance, a nightclub in Morocco' },
  // The famous "Play it again, Sam" is a misquote; this is the real line.
  { line: 'Play it, Sam. Play "As Time Goes By".', title: 'Casablanca', year: 1942, who: 'Ilsa Lund', setting: 'Wartime romance, a piano in a bar' },
  { line: 'My mama always said life was like a box of chocolates. You never know what you’re gonna get.', title: 'Forrest Gump', year: 1994, who: 'Forrest Gump', setting: 'Drama, a bench in Savannah' },
  { line: 'Houston, we have a problem.', title: 'Apollo 13', year: 1995, who: 'Jim Lovell', setting: 'Space drama, a crippled spacecraft' },
  { line: 'Anyone can cook.', title: 'Ratatouille', year: 2007, who: 'Chef Gusteau', setting: 'Animation, a Paris restaurant' },
  { line: 'Adventure is out there!', title: 'Up', year: 2009, who: 'Ellie Fredricksen', setting: 'Animation, a house lifted by balloons' },
  { line: 'I am Groot.', title: 'Guardians of the Galaxy', year: 2014, who: 'Groot', setting: 'Space adventure, a band of misfits' },
  { line: 'Nobody puts Baby in a corner.', title: 'Dirty Dancing', year: 1987, who: 'Johnny Castle', setting: 'Romance, a summer holiday resort' },
  { line: 'You’re gonna need a bigger boat.', title: 'Jaws', year: 1975, who: 'Chief Brody', setting: 'Thriller, a New England beach town' },
  { line: 'Show me the money!', title: 'Jerry Maguire', year: 1996, who: 'Rod Tidwell', setting: 'Sports comedy-drama, a sports agency' },
  { line: 'Roads? Where we’re going we don’t need roads.', title: 'Back to the Future', year: 1985, who: 'Doc Brown', setting: 'Science-fiction comedy, a driveway' },
  { line: 'My precious.', title: 'The Lord of the Rings: The Two Towers', year: 2002, who: 'Gollum', setting: 'Fantasy, a long journey on foot' },
  { line: 'You shall not pass!', title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, who: 'Gandalf', setting: 'Fantasy, a bridge deep underground' },
  { line: 'A wizard is never late, Frodo Baggins.', title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, who: 'Gandalf', setting: 'Fantasy, a cart on a country lane' },
  { line: 'There’s no crying in baseball!', title: 'A League of Their Own', year: 1992, who: 'Jimmy Dugan', setting: 'Sports comedy, a wartime baseball league' },
  { line: 'I’m the king of the world!', title: 'Titanic', year: 1997, who: 'Jack Dawson', setting: 'Romance, the bow of an ocean liner' },
  { line: 'Bond. James Bond.', title: 'Dr. No', year: 1962, who: 'James Bond', setting: 'Spy thriller, a casino table' },
  { line: 'Frankly, my dear, I don’t give a damn.', title: 'Gone with the Wind', year: 1939, who: 'Rhett Butler', setting: 'Historical epic, the American South' },
  { line: 'Ohana means family. Family means nobody gets left behind or forgotten.', title: 'Lilo & Stitch', year: 2002, who: 'Lilo Pelekai', setting: 'Animation, Hawaii' },
  { line: 'Some people are worth melting for.', title: 'Frozen', year: 2013, who: 'Olaf', setting: 'Animated musical, an endless winter' },
  { line: 'Live long and prosper.', title: 'Star Trek II: The Wrath of Khan', year: 1982, who: 'Spock', setting: 'Science fiction, a starship' },
  { line: 'That’ll do, pig. That’ll do.', title: 'Babe', year: 1995, who: 'Farmer Hoggett', setting: 'Family film, a sheepdog trial' },
  { line: 'I feel the need — the need for speed!', title: 'Top Gun', year: 1986, who: 'Maverick and Goose', setting: 'Action drama, a naval flight school' },
  { line: 'Nobody’s perfect.', title: 'Some Like It Hot', year: 1959, who: 'Osgood Fielding III', setting: 'Comedy, the last line of the film' },
  { line: 'As you wish.', title: 'The Princess Bride', year: 1987, who: 'Westley', setting: 'Fairy-tale comedy, a farm girl and a farmhand' },
  { line: 'Inconceivable!', title: 'The Princess Bride', year: 1987, who: 'Vizzini', setting: 'Fairy-tale comedy, a cliffside pursuit' },
  { line: 'Get busy living, or get busy dying.', title: 'The Shawshank Redemption', year: 1994, who: 'Andy Dufresne', setting: 'Prison drama, a friendship over decades' },
  { line: 'Carpe diem. Seize the day, boys.', title: 'Dead Poets Society', year: 1989, who: 'John Keating', setting: 'Drama, a boys’ boarding school' },
  { line: 'Wax on, wax off.', title: 'The Karate Kid', year: 1984, who: 'Mr Miyagi', setting: 'Sports drama, a mentor’s back yard' },
  { line: 'Ogres are like onions.', title: 'Shrek', year: 2001, who: 'Shrek', setting: 'Animated comedy, a swamp' },
  { line: 'Yer a wizard, Harry.', title: "Harry Potter and the Philosopher's Stone", year: 2001, who: 'Rubeus Hagrid', setting: 'Fantasy, a hut on a rock' },
  { line: 'Not all treasure is silver and gold, mate.', title: 'Pirates of the Caribbean: The Curse of the Black Pearl', year: 2003, who: 'Jack Sparrow', setting: 'Adventure, the high seas' },
  { line: 'Why do we fall, sir? So that we can learn to pick ourselves up.', title: 'Batman Begins', year: 2005, who: 'Alfred Pennyworth', setting: 'Superhero drama, a wealthy household' },
  { line: 'Great Scott!', title: 'Back to the Future', year: 1985, who: 'Doc Brown', setting: 'Science-fiction comedy, a laboratory' },
  { line: 'Everything is awesome.', title: 'The Lego Movie', year: 2014, who: 'Emmet Brickowski', setting: 'Animation, a city built of bricks' },
  { line: 'To boldly go where no man has gone before.', title: 'Star Trek: The Motion Picture', year: 1979, who: 'James T. Kirk', setting: 'Science fiction, an opening narration' },
  { line: 'Hakuna Matata. It means no worries.', title: 'The Lion King', year: 1994, who: 'Timon and Pumbaa', setting: 'Animation, the African savannah' },
  { line: 'Remember who you are.', title: 'The Lion King', year: 1994, who: 'Mufasa', setting: 'Animation, a vision in the clouds' },
];
