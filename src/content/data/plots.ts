/**
 * Very famous films, each reduced to one deliberately flat sentence.
 *
 * The summaries are written here rather than lifted from anywhere, and they are
 * written badly on purpose: no names, no adjectives, no stakes, and the
 * emotional centre of the film described as an administrative event. That is
 * the joke, and it is also the puzzle — strip the tone out of a story and the
 * plot underneath is usually ridiculous.
 *
 * Two rules: never name a character, an actor or the title, and never describe
 * something that does not actually happen. A dry summary is still a true one,
 * so anything that needed a twist spoiled to make sense was rewritten to sit
 * before the twist instead.
 *
 * Titles and years line up with `movies.ts` so a player who has been through the
 * poster and trailer games is guessing from the same shelf of films.
 */
export type PlotSeed = {
  /** One flat sentence. No names, no title, no adjectives worth having. */
  plot: string;
  title: string;
  year: number;
  genre: string;
  /** Something about the production or its reception — the last rung. */
  hint: string;
};

export const PLOTS: PlotSeed[] = [
  { plot: 'A thief who steals corporate secrets through dream-sharing technology is offered a chance to have his past erased.', title: 'Inception', year: 2010, genre: 'Science fiction', hint: 'The hotel corridor fight was shot in a set mounted on a rotating rig.' },
  { plot: 'A seaside town keeps its beaches open through the summer season despite a problem with a large fish.', title: 'Jaws', year: 1975, genre: 'Thriller', hint: 'The mechanical animal kept breaking down, so most of the film is shot from where it would have been.' },
  { plot: 'The youngest son of an immigrant family, having avoided the family business, gradually takes it over.', title: 'The Godfather', year: 1972, genre: 'Crime drama', hint: 'The studio wanted almost none of the cast that ended up in it.' },
  { plot: 'Two passengers from different decks meet on a ship that later has an accident.', title: 'Titanic', year: 1997, genre: 'Romantic drama', hint: 'For twelve years it was the highest-grossing film ever made, until the same director beat it.' },
  { plot: 'A banker convicted of murder spends two decades improving the prison library.', title: 'The Shawshank Redemption', year: 1994, genre: 'Prison drama', hint: 'It lost money in cinemas and became famous entirely through television repeats and rentals.' },
  { plot: 'An office worker who writes software at night is told that his surroundings are being rendered for him.', title: 'The Matrix', year: 1999, genre: 'Science fiction', hint: 'The slow-motion camera-array effect it popularised was named after the pause it creates.' },
  { plot: 'A farm boy delivers a message, joins a rebellion and helps destroy a military installation.', title: 'Star Wars', year: 1977, genre: 'Space opera', hint: 'It was released with no episode number, which was added to the crawl three years later.' },
  { plot: 'Investors tour a theme park before opening and raise concerns about the safety systems.', title: 'Jurassic Park', year: 1993, genre: 'Adventure', hint: 'The most convincing creature in it is a puppet, filmed in the rain.' },
  { plot: 'A man at a bus stop describes several decades of good luck to whoever is sitting next to him.', title: 'Forrest Gump', year: 1994, genre: 'Drama', hint: 'The archive-footage inserts were an early showcase for digital compositing.' },
  { plot: 'Two colleagues run errands for their employer while a boxer fails to lose a fight as agreed.', title: 'Pulp Fiction', year: 1994, genre: 'Crime', hint: 'The scenes are shown out of order, so the man who dies is alive again at the end.' },
  { plot: 'An insomniac with a furniture-buying habit starts a members-only club with a new acquaintance.', title: 'Fight Club', year: 1999, genre: 'Drama', hint: 'It flopped on release and was rescued by the DVD.' },
  { plot: 'A young animal is persuaded that he caused his father’s death and leaves home for several years.', title: 'The Lion King', year: 1994, genre: 'Animation', hint: 'It was the studio’s B project at the time; the A project was a film about a Native American woman.' },
  { plot: 'A child’s favourite possession is displaced by a newer one, and the two are then lost together.', title: 'Toy Story', year: 1995, genre: 'Animation', hint: 'The first feature made entirely on computers, by a company that had been selling imaging hardware.' },
  { plot: 'A boy hides a stranded visitor in his bedroom and helps arrange transport home.', title: 'E.T. the Extra-Terrestrial', year: 1982, genre: 'Science fiction', hint: 'One confectionery company turned down the product placement, and its competitor’s sales doubled.' },
  { plot: 'A teenager travels thirty years into the past and has to get his parents to meet.', title: 'Back to the Future', year: 1985, genre: 'Science fiction', hint: 'The lead was recast five weeks into filming, and the original footage was scrapped.' },
  { plot: 'A trainee investigator consults an imprisoned specialist for help with an open case.', title: 'The Silence of the Lambs', year: 1991, genre: 'Thriller', hint: 'The specialist is on screen for about sixteen minutes and still won an acting Oscar.' },
  { plot: 'A factory owner keeps expanding his workforce for reasons his accountant works out early.', title: "Schindler's List", year: 1993, genre: 'Historical drama', hint: 'Shot in black and white, with one object picked out in colour.' },
  { plot: 'A demoted general works his way back to the capital through a series of arena bookings.', title: 'Gladiator', year: 2000, genre: 'Historical epic', hint: 'One of the cast died partway through filming and was completed with a digital face.' },
  { plot: 'A city’s police, a wealthy vigilante and a man in makeup disagree about how order should work.', title: 'The Dark Knight', year: 2008, genre: 'Superhero', hint: 'The opening bank robbery was shot on IMAX cameras, which was unusual for a drama at the time.' },
  { plot: 'A mining company sends a remote-controlled body to negotiate with residents living on the deposit.', title: 'Avatar', year: 2009, genre: 'Science fiction', hint: 'The director waited about a decade for the performance-capture technology to be built.' },
  { plot: 'A family gradually secures employment with a wealthier household.', title: 'Parasite', year: 2019, genre: 'Black comedy', hint: 'The first film not in English to win Best Picture.' },
  { plot: 'A farmer leaves his children behind to look for somewhere else to grow crops.', title: 'Interstellar', year: 2014, genre: 'Science fiction', hint: 'A physicist consulted on it, and the visual-effects work on the black hole produced a published paper.' },
  { plot: 'A family takes a winter caretaking job at a hotel with no other guests.', title: 'The Shining', year: 1980, genre: 'Horror', hint: 'The novelist it is based on disliked it for years.' },
  { plot: 'A commercial towing crew is diverted to investigate a signal and picks up a passenger.', title: 'Alien', year: 1979, genre: 'Science fiction horror', hint: 'The creature was designed by a Swiss painter working from his own airbrushed nightmares.' },
  { plot: 'An employee absconds with company money and stops for the night at a quiet motel.', title: 'Psycho', year: 1960, genre: 'Horror', hint: 'The director bought up copies of the novel to keep the ending quiet.' },
  { plot: 'A bar owner in a neutral city is asked to help a former acquaintance leave the country.', title: 'Casablanca', year: 1942, genre: 'Romantic drama', hint: 'The script was still being written during filming, so the cast did not know how it ended.' },
  { plot: 'A girl’s house is relocated by weather, and she walks a long way to ask an official about getting home.', title: 'The Wizard of Oz', year: 1939, genre: 'Fantasy', hint: 'The song that became its signature was nearly cut for making the opening too slow.' },
  { plot: 'A girl takes a job at a bathhouse to work off what her parents ate.', title: 'Spirited Away', year: 2001, genre: 'Animation', hint: 'It was the highest-grossing film in its home country for nearly twenty years.' },
  { plot: 'A property owner agrees to collect a stranger’s fiancée in exchange for having squatters removed.', title: 'Shrek', year: 2001, genre: 'Animation', hint: 'It won the first Oscar ever given for an animated feature.' },
  { plot: 'A rodent with strong opinions about food operates a restaurant employee from under his hat.', title: 'Ratatouille', year: 2007, genre: 'Animation', hint: 'The director was brought in partway through and rebuilt the story from scratch.' },
  { plot: 'A student is bitten during a school field trip and takes on a second job.', title: 'Spider-Man', year: 2002, genre: 'Superhero', hint: 'The first film to take over $100m in a single weekend.' },
  { plot: 'An arms manufacturer is injured by his own product and takes up metalwork.', title: 'Iron Man', year: 2008, genre: 'Superhero', hint: 'Much of the dialogue was improvised, and the studio had to mortgage its characters to finance it.' },
  { plot: 'A part-time clown loses access to his social services and his medication.', title: 'Joker', year: 2019, genre: 'Drama', hint: 'Made for a fraction of the usual budget for its genre, and the first of them to take a billion dollars.' },
  { plot: 'A waitress is informed that her unborn son will matter and that a visitor intends to prevent him.', title: 'The Terminator', year: 1984, genre: 'Science fiction', hint: 'The director sold the script for a dollar on condition he was allowed to direct it.' },
  { plot: 'A detective is brought out of retirement to find four employees who left their posts.', title: 'Blade Runner', year: 1982, genre: 'Science fiction', hint: 'At least seven different cuts exist, and they disagree about the narration and the ending.' },
  { plot: 'A tanker driver takes an unauthorised detour, and then everyone drives back the way they came.', title: 'Mad Max: Fury Road', year: 2015, genre: 'Action', hint: 'Almost all of the vehicles are real and were built for the shoot, which ran for months in the Namib desert.' },
  { plot: 'Two detectives work a case that has been organised around a list.', title: 'Se7en', year: 1995, genre: 'Thriller', hint: 'The studio was sent the wrong draft, which is the only reason the ending survived.' },
  { plot: 'A child psychologist takes on a boy who reports seeing things other people do not.', title: 'The Sixth Sense', year: 1999, genre: 'Supernatural thriller', hint: 'Its ending was so widely discussed that it changed how trailers were cut for years afterwards.' },
  { plot: 'A man visits his girlfriend’s parents for the weekend and finds them extremely welcoming.', title: 'Get Out', year: 2017, genre: 'Horror', hint: 'The director came from television sketch comedy and won an Oscar for the screenplay.' },
  { plot: 'A weatherman covering a small-town ceremony finds his schedule unusually repetitive.', title: 'Groundhog Day', year: 1993, genre: 'Comedy', hint: 'The film never says how long he is stuck, and the writer and director disagreed about it.' },
  { plot: 'A man describes his career in organised crime and the paperwork that ended it.', title: 'Goodfellas', year: 1990, genre: 'Crime', hint: 'The three-minute unbroken shot through a nightclub kitchen was done because the crew could not get permission to use the front door.' },
  { plot: 'A student builds a website and is later sued by several people at once.', title: 'The Social Network', year: 2010, genre: 'Drama', hint: 'Two of the plaintiffs are twins, played by one actor.' },
  { plot: 'A linguist is hired to establish what some visitors want.', title: 'Arrival', year: 2016, genre: 'Science fiction', hint: 'The written language in it was designed as a working system before anything was filmed.' },
  { plot: 'A group forms to walk a piece of jewellery a very long way.', title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, genre: 'Fantasy', hint: 'All three parts were filmed at once, over more than a year in New Zealand.' },
  { plot: 'An orphan living under the stairs learns he has been enrolled at a boarding school.', title: "Harry Potter and the Philosopher's Stone", year: 2001, genre: 'Fantasy', hint: 'The title was changed for the American release because the studio thought the original word sounded dull.' },
  { plot: 'A noble family is given administrative control of a desert planet that produces a valuable spice.', title: 'Dune', year: 2021, genre: 'Science fiction', hint: 'Two earlier attempts to film the novel collapsed, one of them famously before a frame was shot.' },
  { plot: 'A physicist manages a large government project and is later questioned about who he used to know.', title: 'Oppenheimer', year: 2023, genre: 'Biographical drama', hint: 'Released the same day as a film about a doll, which turned into a joint marketing event.' },
  { plot: 'An apprentice swordsmith teams up with a criminal to recover a kidnapped official’s daughter.', title: 'Pirates of the Caribbean: The Curse of the Black Pearl', year: 2003, genre: 'Adventure', hint: 'It is based on a theme-park ride, and the studio was nervous about the lead performance until it opened.' },
  { plot: 'An onboard computer and the crew disagree about the purpose of the mission.', title: '2001: A Space Odyssey', year: 1968, genre: 'Science fiction', hint: 'The novel and the film were written at the same time, by two people, deliberately.' },
  { plot: 'A pilot trains with a swamp-dwelling teacher while his friends are pursued across the galaxy.', title: 'The Empire Strikes Back', year: 1980, genre: 'Space opera', hint: 'The line everyone quotes from it is misquoted, because the real one starts with a name.' },
  { plot: 'A squad is sent across occupied territory to send one soldier home.', title: 'Saving Private Ryan', year: 1998, genre: 'War', hint: 'The opening half-hour was shot with the shutter angle altered to make the action look harsher.' },
  { plot: 'A concierge at a mountainside spa resort inherits a painting and is then accused of murder.', title: 'The Grand Budapest Hotel', year: 2014, genre: 'Comedy', hint: 'It uses three different screen shapes, one per time period.' },
];
