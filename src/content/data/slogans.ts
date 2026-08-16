/**
 * Advertising lines that outlived the campaigns that made them, quoted in their
 * real wording rather than the version people half-remember.
 *
 * Two rules kept the file honest. First, if the attribution was not certain the
 * line was dropped — plenty of famous slogans get reassigned to whichever brand
 * in the category is biggest, and a quiz that teaches the wrong one is worse
 * than a shorter quiz. Second, nothing here contains the brand's own name:
 * "Have a break, have a Kit Kat" is a fine slogan and a useless question.
 *
 * `era` is when the line started running, not when the company was founded. A
 * few are decades rather than years, because the campaign ramped up rather than
 * launched. Naming brands and quoting their slogans in a quiz is nominative
 * use; no logos or artwork are reproduced anywhere in this game.
 */
export type SloganSeed = {
  line: string;
  brand: string;
  sector: string;
  /** When the line started running — "1988", or "the 1950s" where it crept in. */
  era: string;
  /** Something about the brand or the campaign, without naming either — the last rung. */
  hint: string;
};

export const SLOGANS: SloganSeed[] = [
  // ── sportswear & grooming ─────────────────────────────────────────────────
  { line: 'Just do it.', brand: 'Nike', sector: 'Sportswear', era: '1988', hint: 'An Oregon company named after a Greek goddess of victory.' },
  { line: 'Impossible is nothing.', brand: 'Adidas', sector: 'Sportswear', era: '2004', hint: 'A German company founded by one of two brothers who fell out and set up rival firms in the same small town.' },
  { line: 'The best a man can get.', brand: 'Gillette', sector: 'Grooming', era: '1989', hint: 'A razor company whose entire business model was giving away the handle.' },

  // ── fast food ─────────────────────────────────────────────────────────────
  { line: "I'm lovin' it", brand: "McDonald's", sector: 'Fast food', era: '2003', hint: 'The line arrived with a five-note jingle sung by a pop star, and has been kept in English in most countries.' },
  { line: 'Finger lickin’ good.', brand: 'KFC', sector: 'Fast food', era: '1956', hint: 'A chain built on a pressure fryer and a recipe of eleven herbs and spices.' },
  { line: 'Have it your way.', brand: 'Burger King', sector: 'Fast food', era: '1974', hint: 'The line was a direct attack on a competitor that refused to alter its sandwiches.' },
  { line: 'Eat fresh.', brand: 'Subway', sector: 'Fast food', era: '2000', hint: 'A chain with more outlets than any other, most of them assembling sandwiches in front of you.' },
  { line: "Where's the beef?", brand: "Wendy's", sector: 'Fast food', era: '1984', hint: 'Delivered by an elderly actor, the phrase escaped the advert and turned up in a presidential primary that year.' },

  // ── drinks ────────────────────────────────────────────────────────────────
  { line: 'Open Happiness', brand: 'Coca-Cola', sector: 'Soft drinks', era: '2009', hint: 'The company that also gave the world the modern picture of Father Christmas.' },
  { line: 'The choice of a new generation', brand: 'Pepsi', sector: 'Soft drinks', era: '1984', hint: 'The campaign was built around a pop star whose hair caught fire while filming it.' },
  { line: 'Good things come to those who wait.', brand: 'Guinness', sector: 'Beer', era: '1996', hint: 'A joke about the time it takes to pour one properly.' },
  { line: 'Probably the best lager in the world.', brand: 'Carlsberg', sector: 'Beer', era: '1973', hint: 'A Danish brewery; the hedge in the wording is the whole joke.' },
  { line: 'Refreshes the parts other beers cannot reach.', brand: 'Heineken', sector: 'Beer', era: '1974', hint: 'A Dutch brewery, in a campaign that only ever ran in Britain.' },
  { line: 'What else?', brand: 'Nespresso', sector: 'Coffee', era: '2006', hint: 'Sold in aluminium capsules, and advertised for years by one film star asking the question.' },

  // ── snacks & confectionery ────────────────────────────────────────────────
  { line: 'Melts in your mouth, not in your hands.', brand: "M&M's", sector: 'Confectionery', era: '1954', hint: 'The shell was designed so soldiers could carry chocolate in hot weather.' },
  { line: 'Taste the rainbow.', brand: 'Skittles', sector: 'Confectionery', era: '1994', hint: 'Small chewy sweets sorted by colour, which is what the line is really about.' },
  { line: "You're not you when you're hungry.", brand: 'Snickers', sector: 'Confectionery', era: '2010', hint: 'A peanut and caramel bar; the adverts cast a different celebrity as the hungry person each time.' },
  { line: "Betcha can't eat just one.", brand: "Lay's", sector: 'Snacks', era: '1963', hint: 'Potato crisps, sold under half a dozen different names around the world.' },
  { line: "Once you pop, you can't stop.", brand: 'Pringles', sector: 'Snacks', era: 'the 1990s', hint: 'Crisps that are not legally crisps, stacked in a cardboard tube.' },

  // ── technology & games ────────────────────────────────────────────────────
  { line: 'Think different.', brand: 'Apple', sector: 'Technology', era: '1997', hint: 'The campaign that marked the return of a founder who had been forced out a decade earlier.' },
  { line: 'Think', brand: 'IBM', sector: 'Technology', era: '1911', hint: 'The word was posted on office walls decades before anyone used it in an advert.' },
  { line: 'Where do you want to go today?', brand: 'Microsoft', sector: 'Technology', era: '1994', hint: 'A software company, in its first campaign aimed at the public rather than at businesses.' },
  { line: "Do what you can't", brand: 'Samsung', sector: 'Technology', era: '2016', hint: 'A South Korean conglomerate that also builds ships and apartment blocks.' },
  { line: 'Connecting People', brand: 'Nokia', sector: 'Mobile phones', era: '1992', hint: 'A Finnish company that started out in paper mills and rubber boots.' },
  { line: 'You press the button, we do the rest.', brand: 'Kodak', sector: 'Photography', era: '1888', hint: 'The line described a camera you posted back to the factory to have the film developed.' },
  { line: "Now you're playing with power.", brand: 'Nintendo', sector: 'Video games', era: '1988', hint: 'A Japanese company that spent its first sixty years making playing cards.' },
  { line: 'Live in your world. Play in ours.', brand: 'PlayStation', sector: 'Video games', era: '1999', hint: 'A games console that began as an abandoned CD add-on for a rival machine.' },

  // ── cars ──────────────────────────────────────────────────────────────────
  { line: 'The ultimate driving machine.', brand: 'BMW', sector: 'Cars', era: '1974', hint: 'A Bavarian firm that built aircraft engines before it built cars.' },
  { line: 'Think small.', brand: 'Volkswagen', sector: 'Cars', era: '1959', hint: 'The advert sold a tiny German car to Americans by admitting it was tiny.' },
  { line: 'Vorsprung durch Technik', brand: 'Audi', sector: 'Cars', era: '1971', hint: 'A German maker whose badge is four interlocking rings, one per founding company.' },
  { line: 'There is no substitute.', brand: 'Porsche', sector: 'Cars', era: 'the 1980s', hint: 'A German maker whose best-known model has kept its engine behind the rear axle since 1963.' },
  { line: 'The best or nothing.', brand: 'Mercedes-Benz', sector: 'Cars', era: '2010', hint: 'A translation of something the founding engineer is said to have insisted on.' },

  // ── shops & services ──────────────────────────────────────────────────────
  { line: 'Every little helps.', brand: 'Tesco', sector: 'Supermarkets', era: '1992', hint: "Britain's largest grocer, whose name is a contraction of a tea supplier and its founder." },
  { line: 'Save money. Live better.', brand: 'Walmart', sector: 'Retail', era: '2007', hint: 'The largest company in the world by revenue, run out of a small town in Arkansas.' },
  { line: 'Expect more. Pay less.', brand: 'Target', sector: 'Retail', era: '1994', hint: 'An American chain with a red bullseye and a habit of hiring fashion designers.' },
  { line: 'The wonderful everyday', brand: 'IKEA', sector: 'Furniture', era: '2013', hint: 'A Swedish company whose products are named rather than numbered, and carried home flat.' },
  { line: 'We try harder.', brand: 'Avis', sector: 'Car rental', era: '1962', hint: 'The campaign turned being second in the market into the entire selling point.' },
  { line: 'When it absolutely, positively has to be there overnight.', brand: 'FedEx', sector: 'Delivery', era: '1978', hint: 'A courier that flies almost everything through a single airport in Tennessee at night.' },
  { line: 'What can Brown do for you?', brand: 'UPS', sector: 'Delivery', era: '2002', hint: 'A courier whose vans, uniforms and aeroplanes are all the same colour.' },
  { line: "Don't leave home without it.", brand: 'American Express', sector: 'Financial services', era: '1975', hint: 'A charge card issued by a company that began as a stagecoach freight business.' },
  { line: "It's everywhere you want to be.", brand: 'Visa', sector: 'Financial services', era: '1985', hint: 'A payment network that does not issue any cards itself.' },
  { line: 'Priceless.', brand: 'Mastercard', sector: 'Financial services', era: '1997', hint: 'The adverts list the price of everything in the scene except the last item.' },
  { line: 'A diamond is forever.', brand: 'De Beers', sector: 'Jewellery', era: '1947', hint: 'Written by a young copywriter for a company that controlled most of the world supply, and credited with inventing the engagement ring as a rule.' },
  { line: "Because you're worth it.", brand: "L'Oréal", sector: 'Cosmetics', era: '1971', hint: 'A French cosmetics company; the line was written for a hair colourant.' },
  { line: 'Reach out and touch someone.', brand: 'AT&T', sector: 'Telecoms', era: '1979', hint: 'A telephone company that was broken up by antitrust regulators a few years later.' },
  { line: 'It keeps going and going and going.', brand: 'Energizer', sector: 'Batteries', era: '1989', hint: 'The adverts featured a drumming pink rabbit walking through other companies’ commercials.' },

  // ── travel & places ───────────────────────────────────────────────────────
  { line: "The world's favourite airline", brand: 'British Airways', sector: 'Airlines', era: '1983', hint: 'The claim was based on carrying more international passengers than anyone else, and was quietly dropped when that stopped being true.' },
  { line: 'Belong anywhere', brand: 'Airbnb', sector: 'Travel', era: '2014', hint: 'A company that owns none of the rooms it lets.' },
  { line: 'The happiest place on Earth', brand: 'Disneyland', sector: 'Theme parks', era: '1955', hint: 'A park in southern California, opened on a former orange grove.' },
  { line: 'What happens here, stays here.', brand: 'Las Vegas', sector: 'Tourism', era: '2003', hint: 'Written for a tourist board rather than a company, which is why it sells discretion instead of a product.' },
];
