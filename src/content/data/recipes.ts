/**
 * Ingredient lists for dishes that travel — the sort a menu anywhere in the
 * world might carry.
 *
 * The order inside `ingredients` is the entire game, and it is deliberate:
 * least distinctive first, most distinctive last. The opening four are things
 * half the world's cooking contains — salt, oil, flour, onion, garlic — and the
 * closing two are the ones that give the dish away, the saffron and the miso
 * and the avocado. Shuffle a list and the round becomes either instant or
 * impossible, which is the failure this ordering exists to prevent.
 *
 * Eight per dish, so the reveal fractions land cleanly: four, then six, then
 * all eight.
 *
 * Nothing here is invented. Where a dish has a canonical version — carbonara,
 * paella valenciana, pesto's cousins — that is the one described, and where the
 * authentic composition was not certain the dish was left out rather than
 * guessed at. `hint` is a short note shown once the round is over; it never
 * names the dish.
 */
export type RecipeSeed = {
  dish: string;
  /** Exactly eight, ordered least distinctive → most distinctive. */
  ingredients: string[];
  origin: string;
  hint: string;
};

export const RECIPES: RecipeSeed[] = [
  // ── Mexico & the Americas ─────────────────────────────────────────────────
  {
    dish: 'Guacamole',
    ingredients: ['Salt', 'Black pepper', 'Onion', 'Tomato', 'Green chilli', 'Lime', 'Coriander', 'Avocado'],
    origin: 'Mexico',
    hint: 'Aztec in origin, and the name comes from the Nahuatl words for the fruit and for sauce.',
  },
  {
    dish: 'Tacos al pastor',
    ingredients: ['Salt', 'Onion', 'Garlic', 'Coriander', 'Corn tortillas', 'Dried chillies', 'Achiote-marinated pork', 'Pineapple'],
    origin: 'Mexico',
    hint: 'The vertical spit came to Mexico with Lebanese immigrants; the pork and the pineapple are local additions.',
  },
  {
    dish: 'Mole poblano',
    ingredients: ['Salt', 'Onion', 'Garlic', 'Cinnamon', 'Sesame seeds', 'Almonds', 'Dried chillies', 'Dark chocolate'],
    origin: 'Mexico',
    hint: 'Associated with the convents of Puebla, and often built from twenty or more ingredients ground down together.',
  },
  {
    dish: 'Caesar salad',
    ingredients: ['Salt', 'Olive oil', 'Garlic', 'Lemon juice', 'Egg yolk', 'Romaine lettuce', 'Croutons', 'Anchovy'],
    origin: 'Mexico',
    hint: 'Invented in a Tijuana hotel restaurant in the 1920s by an Italian-born cook, and named after him rather than any Roman.',
  },
  {
    dish: 'Ceviche',
    ingredients: ['Salt', 'Onion', 'Garlic', 'Coriander', 'Sweet potato', 'Ají limo chilli', 'Lime juice', 'Raw white fish'],
    origin: 'Peru',
    hint: 'Nothing is cooked with heat — the acid firms the flesh. Peru gives it a national holiday.',
  },
  {
    dish: 'Feijoada',
    ingredients: ['Salt', 'Onion', 'Garlic', 'Bay leaf', 'Orange', 'Smoked sausage', 'Salted pork', 'Black beans'],
    origin: 'Brazil',
    hint: 'A weekend dish, served with rice, greens and toasted cassava flour.',
  },
  {
    dish: 'Clam chowder',
    ingredients: ['Salt', 'Butter', 'Flour', 'Onion', 'Potato', 'Bacon', 'Cream', 'Clams'],
    origin: 'United States',
    hint: 'The New England version is the white one; Manhattan makes its with tomato, which New England considers an offence.',
  },
  {
    dish: 'Gumbo',
    ingredients: ['Salt', 'Flour', 'Oil', 'Onion', 'Celery', 'Green pepper', 'Okra', 'Andouille sausage'],
    origin: 'Louisiana',
    hint: 'Starts with a roux cooked to the colour of dark chocolate. The three vegetables are known locally as the holy trinity.',
  },
  {
    dish: 'Poutine',
    ingredients: ['Salt', 'Black pepper', 'Flour', 'Butter', 'Beef stock', 'Cornflour', 'Thick-cut chips', 'Cheese curds'],
    origin: 'Quebec',
    hint: 'Rural Quebec, late 1950s. The curds have to squeak, and the gravy has to be hot enough to soften them without melting them flat.',
  },
  {
    dish: 'Pavlova',
    ingredients: ['Sugar', 'Egg white', 'Salt', 'Cornflour', 'White wine vinegar', 'Vanilla', 'Whipped cream', 'Passionfruit'],
    origin: 'Australia and New Zealand',
    hint: 'Named for a Russian ballerina who toured both countries in the 1920s. Which country invented it is still argued about.',
  },

  // ── Italy ─────────────────────────────────────────────────────────────────
  {
    dish: 'Carbonara',
    ingredients: ['Salt', 'Water', 'Olive oil', 'Black pepper', 'Egg', 'Spaghetti', 'Pecorino Romano', 'Guanciale'],
    origin: 'Italy',
    hint: 'Roman, and younger than it looks — the first recipes appear after the Second World War. No cream, ever.',
  },
  {
    dish: 'Margherita pizza',
    ingredients: ['Salt', 'Water', 'Flour', 'Yeast', 'Olive oil', 'Tomato', 'Mozzarella', 'Basil'],
    origin: 'Italy',
    hint: 'Neapolitan, and the three colours on top are said to have been chosen for the Italian flag.',
  },
  {
    dish: 'Risotto alla milanese',
    ingredients: ['Salt', 'Butter', 'Onion', 'White wine', 'Chicken stock', 'Parmesan', 'Arborio rice', 'Saffron'],
    origin: 'Italy',
    hint: 'From Milan, and traditionally served alongside braised veal shin. The yellow is the expensive part.',
  },
  {
    dish: 'Lasagne',
    ingredients: ['Salt', 'Olive oil', 'Onion', 'Carrot', 'Tomato', 'Minced beef', 'Béchamel sauce', 'Flat pasta sheets'],
    origin: 'Italy',
    hint: 'Bolognese in its classic form, where the pasta is green with spinach and the layers are counted.',
  },
  {
    dish: 'Tiramisu',
    ingredients: ['Sugar', 'Egg yolk', 'Egg white', 'Marsala wine', 'Cocoa powder', 'Savoiardi biscuits', 'Espresso', 'Mascarpone'],
    origin: 'Italy',
    hint: 'From the Veneto, and no older than the 1960s or 70s. The name means roughly "pick me up".',
  },

  // ── France ────────────────────────────────────────────────────────────────
  {
    dish: 'Ratatouille',
    ingredients: ['Salt', 'Olive oil', 'Onion', 'Garlic', 'Thyme', 'Tomato', 'Courgette', 'Aubergine'],
    origin: 'France',
    hint: 'From Nice, and traditionally each vegetable is cooked separately before they are brought together.',
  },
  {
    dish: 'Coq au vin',
    ingredients: ['Salt', 'Butter', 'Onion', 'Bay leaf', 'Mushroom', 'Bacon lardons', 'Chicken', 'Red wine'],
    origin: 'France',
    hint: 'A Burgundian way of making an old bird edible: long, slow, and drunk.',
  },
  {
    dish: 'Bouillabaisse',
    ingredients: ['Salt', 'Olive oil', 'Onion', 'Garlic', 'Tomato', 'Fennel', 'Saffron', 'Mixed rockfish'],
    origin: 'France',
    hint: 'A Marseille fishermen\'s dish, made from the bony fish nobody would buy. Served with a garlicky rust-coloured sauce on toast.',
  },
  {
    dish: 'Quiche Lorraine',
    ingredients: ['Salt', 'Butter', 'Flour', 'Egg', 'Black pepper', 'Nutmeg', 'Cream', 'Bacon lardons'],
    origin: 'France',
    hint: 'From the north-east, near the German border, and the name comes from a German word for cake. Cheese is a later addition.',
  },
  {
    dish: 'Croissant',
    ingredients: ['Salt', 'Sugar', 'Flour', 'Water', 'Milk', 'Yeast', 'Egg wash', 'Laminated butter'],
    origin: 'France',
    hint: 'Descended from an Austrian pastry brought to Paris in the nineteenth century. The layers come from folding butter into dough again and again.',
  },

  // ── Iberia ────────────────────────────────────────────────────────────────
  {
    dish: 'Paella',
    ingredients: ['Salt', 'Olive oil', 'Tomato', 'Green beans', 'Chicken', 'Rabbit', 'Short-grain rice', 'Saffron'],
    origin: 'Spain',
    hint: 'Valencian, cooked in a wide shallow pan over a fire. The prized part is the toasted crust at the bottom.',
  },
  {
    dish: 'Gazpacho',
    ingredients: ['Salt', 'Olive oil', 'Garlic', 'Stale bread', 'Cucumber', 'Green pepper', 'Sherry vinegar', 'Raw tomato'],
    origin: 'Spain',
    hint: 'Andalusian, never cooked and always served cold. The bread is what gives it body.',
  },
  {
    dish: 'Pastel de nata',
    ingredients: ['Sugar', 'Salt', 'Flour', 'Butter', 'Milk', 'Egg yolk', 'Cinnamon', 'Puff pastry'],
    origin: 'Portugal',
    hint: 'Made by monks in Lisbon before the monasteries closed in 1834; the recipe was sold to a nearby bakery that still trades on it.',
  },

  // ── Britain, central and eastern Europe ───────────────────────────────────
  {
    dish: 'Fish and chips',
    ingredients: ['Salt', 'Flour', 'Sunflower oil', 'Baking powder', 'Potato', 'Beer', 'Malt vinegar', 'Cod fillet'],
    origin: 'Britain',
    hint: 'The two halves were sold separately until the 1860s, when someone had the idea of putting them in the same paper.',
  },
  {
    dish: "Shepherd's pie",
    ingredients: ['Salt', 'Butter', 'Flour', 'Onion', 'Carrot', 'Milk', 'Minced lamb', 'Mashed potato topping'],
    origin: 'Britain and Ireland',
    hint: 'Make the same thing with beef and it has to be called something else.',
  },
  {
    dish: 'Wiener schnitzel',
    ingredients: ['Salt', 'Black pepper', 'Flour', 'Egg', 'Butter', 'Lemon', 'Breadcrumbs', 'Veal escalope'],
    origin: 'Austria',
    hint: 'Protected by Austrian law: use pork and it must be sold under a different name. It is fried so the coating puffs away from the meat.',
  },
  {
    dish: 'Fondue',
    ingredients: ['Salt', 'Garlic', 'Black pepper', 'Nutmeg', 'Cornflour', 'Dry white wine', 'Kirsch', 'Gruyère and Emmental'],
    origin: 'Switzerland',
    hint: 'Promoted hard by the Swiss cheese union in the 1930s as a national dish. Lose your bread in the pot and you owe the table a round.',
  },
  {
    dish: 'Pierogi',
    ingredients: ['Salt', 'Flour', 'Water', 'Egg', 'Butter', 'Onion', 'Curd cheese', 'Mashed potato'],
    origin: 'Poland',
    hint: 'Boiled first, then usually fried in butter with onions. The potato and cheese filling is the one named after Ruthenia.',
  },
  {
    dish: 'Goulash',
    ingredients: ['Salt', 'Lard', 'Onion', 'Garlic', 'Beef', 'Potato', 'Caraway seed', 'Sweet paprika'],
    origin: 'Hungary',
    hint: 'Herdsmen\'s food, and the name means herdsman. In Hungary it is a soup, not the thick stew the rest of Europe makes.',
  },
  {
    dish: 'Borscht',
    ingredients: ['Salt', 'Onion', 'Carrot', 'Potato', 'Cabbage', 'Beef stock', 'Soured cream', 'Beetroot'],
    origin: 'Ukraine',
    hint: 'Ukraine\'s national dish, and on the UNESCO list of cultural heritage in need of safeguarding since 2022.',
  },

  // ── Greece, Turkey and the Levant ─────────────────────────────────────────
  {
    dish: 'Moussaka',
    ingredients: ['Salt', 'Olive oil', 'Onion', 'Cinnamon', 'Tomato', 'Minced lamb', 'Béchamel sauce', 'Aubergine'],
    origin: 'Greece',
    hint: 'The white sauce on top is a twentieth-century addition by a French-trained Greek chef; older versions across the region go without.',
  },
  {
    dish: 'Greek salad',
    ingredients: ['Salt', 'Olive oil', 'Oregano', 'Red onion', 'Cucumber', 'Tomato', 'Kalamata olives', 'Feta'],
    origin: 'Greece',
    hint: 'No lettuce, and the cheese arrives as one slab rather than crumbled.',
  },
  {
    dish: 'Tzatziki',
    ingredients: ['Salt', 'Olive oil', 'Garlic', 'Black pepper', 'Dill', 'Lemon juice', 'Cucumber', 'Strained yoghurt'],
    origin: 'Greece',
    hint: 'The cucumber is grated and squeezed dry first, or the whole thing goes watery within the hour.',
  },
  {
    dish: 'Baklava',
    ingredients: ['Sugar', 'Water', 'Butter', 'Lemon juice', 'Cinnamon', 'Honey', 'Pistachios', 'Filo pastry'],
    origin: 'Turkey',
    hint: 'Refined in the Ottoman palace kitchens. Dozens of paper-thin sheets, each brushed with butter, then soaked in syrup while still hot.',
  },
  {
    dish: 'Hummus',
    ingredients: ['Salt', 'Water', 'Olive oil', 'Garlic', 'Cumin', 'Lemon juice', 'Chickpeas', 'Tahini'],
    origin: 'The Levant',
    hint: 'The full name means the pulse with sesame paste, and which country owns it is a live argument.',
  },
  {
    dish: 'Falafel',
    ingredients: ['Salt', 'Onion', 'Garlic', 'Black pepper', 'Cumin', 'Coriander leaf', 'Parsley', 'Dried chickpeas'],
    origin: 'The Middle East',
    hint: 'The pulses are soaked but never cooked before frying — use tinned ones and the whole thing falls apart in the oil. Egypt makes its with broad beans.',
  },
  {
    dish: 'Tabbouleh',
    ingredients: ['Salt', 'Olive oil', 'Spring onion', 'Lemon juice', 'Mint', 'Tomato', 'Bulgur wheat', 'Parsley'],
    origin: 'The Levant',
    hint: 'A herb salad rather than a grain salad — the wheat is a minor part, whatever the versions abroad do with it.',
  },
  {
    dish: 'Shakshuka',
    ingredients: ['Salt', 'Olive oil', 'Onion', 'Garlic', 'Cumin', 'Red pepper', 'Tomato', 'Eggs poached in the sauce'],
    origin: 'North Africa',
    hint: 'Tunisian or Libyan in origin, carried to Israel by North African immigrants, and now eaten at every hour of the day.',
  },
  {
    dish: 'Tagine',
    ingredients: ['Salt', 'Olive oil', 'Onion', 'Garlic', 'Cumin', 'Lamb', 'Dried apricots', 'Preserved lemon'],
    origin: 'Morocco',
    hint: 'Named after the conical earthenware pot it is cooked in, which returns the steam to the food instead of losing it.',
  },

  // ── Africa ────────────────────────────────────────────────────────────────
  {
    dish: 'Jollof rice',
    ingredients: ['Salt', 'Vegetable oil', 'Onion', 'Garlic', 'Thyme', 'Tomato purée', 'Long-grain rice', 'Scotch bonnet pepper'],
    origin: 'West Africa',
    hint: 'Nigeria and Ghana have been arguing over whose is better for decades. Named for the Wolof empire of Senegambia.',
  },
  {
    dish: 'Doro wat',
    ingredients: ['Salt', 'Onion', 'Garlic', 'Ginger', 'Clarified spiced butter', 'Chicken', 'Hard-boiled egg', 'Berbere spice mix'],
    origin: 'Ethiopia',
    hint: 'The onions are cooked down dry for the best part of an hour before any fat goes in. Eaten with a sour flatbread instead of cutlery.',
  },

  // ── South Asia ────────────────────────────────────────────────────────────
  {
    dish: 'Biryani',
    ingredients: ['Salt', 'Ghee', 'Garlic', 'Ginger', 'Yoghurt', 'Garam masala', 'Crisp fried onions', 'Basmati rice'],
    origin: 'South Asia',
    hint: 'Mughal in ancestry. The meat and the rice are cooked separately, then layered and sealed to finish in their own steam.',
  },
  {
    dish: 'Butter chicken',
    ingredients: ['Salt', 'Garlic', 'Ginger', 'Tomato', 'Chicken', 'Cream', 'Dried fenugreek leaves', 'Butter'],
    origin: 'India',
    hint: 'Invented in Delhi in the 1950s as a way of using up yesterday\'s tandoor-cooked meat before it dried out.',
  },
  {
    dish: 'Palak paneer',
    ingredients: ['Salt', 'Onion', 'Garlic', 'Ginger', 'Cumin', 'Cream', 'Spinach', 'Paneer'],
    origin: 'India',
    hint: 'North Indian. The cheese is set with acid rather than rennet, so it holds its shape in the pan instead of melting.',
  },

  // ── South-East Asia ───────────────────────────────────────────────────────
  {
    dish: 'Pad thai',
    ingredients: ['Sugar', 'Garlic', 'Egg', 'Bean sprouts', 'Fish sauce', 'Rice noodles', 'Crushed peanuts', 'Tamarind paste'],
    origin: 'Thailand',
    hint: 'Promoted by the Thai government in the 1930s and 40s to build a national cuisine and cut the country\'s rice consumption.',
  },
  {
    dish: 'Tom yum',
    ingredients: ['Sugar', 'Mushroom', 'Chilli', 'Fish sauce', 'Lime juice', 'Prawns', 'Lemongrass', 'Galangal'],
    origin: 'Thailand',
    hint: 'Hot and sour at once. The aromatics are bruised and simmered for flavour but not meant to be eaten.',
  },
  {
    dish: 'Pho',
    ingredients: ['Salt', 'Onion', 'Fish sauce', 'Beef bones', 'Coriander', 'Rice noodles', 'Charred ginger', 'Star anise'],
    origin: 'Vietnam',
    hint: 'From the north, early twentieth century. The onion and ginger are blackened over a flame before they go into the pot.',
  },
  {
    dish: 'Bánh mì',
    ingredients: ['Salt', 'Sugar', 'Cucumber', 'Coriander', 'Chilli', 'Pork pâté', 'Pickled carrot and daikon', 'Baguette'],
    origin: 'Vietnam',
    hint: 'What French colonial baking became once Vietnam got hold of it — the bread is lighter, from rice flour in the dough.',
  },
  {
    dish: 'Nasi goreng',
    ingredients: ['Salt', 'Garlic', 'Shallot', 'Egg', 'Chilli', 'Cooked rice', 'Shrimp paste', 'Kecap manis'],
    origin: 'Indonesia',
    hint: 'Built on yesterday\'s rice, which fries better than fresh. The dark sweet soy is what colours it.',
  },
  {
    dish: 'Rendang',
    ingredients: ['Salt', 'Garlic', 'Shallot', 'Ginger', 'Beef', 'Lemongrass', 'Galangal', 'Coconut milk'],
    origin: 'Indonesia',
    hint: 'Minangkabau, from west Sumatra. Cooked for hours until the liquid has gone entirely and the meat fries in what is left.',
  },
  {
    dish: 'Satay',
    ingredients: ['Salt', 'Sugar', 'Garlic', 'Turmeric', 'Lemongrass', 'Skewered chicken', 'Kecap manis', 'Peanut sauce'],
    origin: 'Indonesia and Malaysia',
    hint: 'Street food cooked over charcoal, and probably adapted from the kebabs of Indian and Arab traders.',
  },
  {
    dish: 'Adobo',
    ingredients: ['Salt', 'Sugar', 'Garlic', 'Bay leaf', 'Black peppercorns', 'Pork', 'Soy sauce', 'Vinegar'],
    origin: 'Philippines',
    hint: 'The technique predates Spanish contact — the acid was a way of keeping meat in a hot climate. The Spanish only supplied the name.',
  },

  // ── Japan ─────────────────────────────────────────────────────────────────
  {
    dish: 'Sushi',
    ingredients: ['Salt', 'Sugar', 'Rice', 'Rice vinegar', 'Wasabi', 'Soy sauce', 'Nori seaweed', 'Raw fish'],
    origin: 'Japan',
    hint: 'The word refers to the seasoned rice, not the fish. It began as a preservation method in which the rice was fermented and thrown away.',
  },
  {
    dish: 'Ramen',
    ingredients: ['Salt', 'Garlic', 'Spring onion', 'Egg', 'Soy sauce', 'Wheat noodles', 'Pork belly', 'Pork bone broth'],
    origin: 'Japan',
    hint: 'Chinese in origin, thoroughly Japanese now, and regional to the point of obsession — the broth alone runs to four main schools.',
  },
  {
    dish: 'Miso soup',
    ingredients: ['Water', 'Spring onion', 'Soy sauce', 'Kombu kelp', 'Bonito flakes', 'Silken tofu', 'Wakame seaweed', 'Fermented soybean paste'],
    origin: 'Japan',
    hint: 'Eaten at breakfast as readily as at dinner. The paste goes in off the heat: boil it and the flavour flattens.',
  },
  {
    dish: 'Tempura',
    ingredients: ['Salt', 'Flour', 'Egg', 'Vegetable oil', 'Soy sauce', 'Grated daikon', 'Prawns', 'Ice-cold sparkling water'],
    origin: 'Japan',
    hint: 'Portuguese missionaries brought the technique in the sixteenth century. The batter is barely mixed and kept freezing, which is what keeps it light.',
  },
  {
    dish: 'Okonomiyaki',
    ingredients: ['Salt', 'Flour', 'Egg', 'Spring onion', 'Cabbage', 'Pork belly', 'Japanese mayonnaise', 'Bonito flakes'],
    origin: 'Japan',
    hint: 'The name means roughly "grilled how you like it", and it is often cooked on a hotplate set into your table. Osaka and Hiroshima do it differently.',
  },

  // ── Korea ─────────────────────────────────────────────────────────────────
  {
    dish: 'Kimchi',
    ingredients: ['Salt', 'Sugar', 'Garlic', 'Ginger', 'Spring onion', 'Fish sauce', 'Napa cabbage', 'Gochugaru chilli flakes'],
    origin: 'Korea',
    hint: 'Salted, then left to ferment. Households once buried the jars for the winter; the practice is on the UNESCO heritage list.',
  },
  {
    dish: 'Bibimbap',
    ingredients: ['Salt', 'Rice', 'Egg', 'Carrot', 'Spinach', 'Beef', 'Sesame oil', 'Gochujang'],
    origin: 'Korea',
    hint: 'The name means mixed rice, and it is meant to be stirred into a mess before eating. Served in a hot stone bowl, the bottom layer crisps.',
  },
  {
    dish: 'Bulgogi',
    ingredients: ['Salt', 'Sugar', 'Garlic', 'Spring onion', 'Sesame oil', 'Soy sauce', 'Asian pear', 'Thinly sliced beef'],
    origin: 'Korea',
    hint: 'The name means fire meat. The grated fruit in the marinade tenderises as well as sweetens.',
  },

  // ── China ─────────────────────────────────────────────────────────────────
  {
    dish: 'Peking duck',
    ingredients: ['Sugar', 'Spring onion', 'Cucumber', 'Rice vinegar', 'Maltose syrup', 'Thin pancakes', 'Hoisin sauce', 'Whole duck'],
    origin: 'China',
    hint: 'An imperial dish. The skin is separated from the flesh with air, glazed and dried for hours, and served before the meat.',
  },
  {
    dish: 'Mapo tofu',
    ingredients: ['Salt', 'Garlic', 'Spring onion', 'Minced pork', 'Fermented black beans', 'Doubanjiang chilli bean paste', 'Sichuan peppercorn', 'Silken tofu'],
    origin: 'China',
    hint: 'Sichuanese, and named after the pockmarked old woman said to have cooked it. The peppercorns numb rather than burn.',
  },
  {
    dish: 'Kung Pao chicken',
    ingredients: ['Salt', 'Sugar', 'Garlic', 'Spring onion', 'Soy sauce', 'Chicken', 'Dried red chillies', 'Peanuts'],
    origin: 'China',
    hint: 'Also Sichuanese, and named after a Qing dynasty official\'s court title.',
  },
];
