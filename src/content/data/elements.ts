/**
 * Symbol, name and atomic number are the real periodic table — the whole game
 * falls apart if K is not 19 or W is not tungsten, and those are exactly the
 * ones people misremember. Names use the IUPAC spelling (aluminium, caesium,
 * sulfur).
 *
 * `category` is the everyday grouping people are taught, not a strict IUPAC
 * block: it drives the middle clue and picks most of the decoys.
 */
export type ElementCategory =
  | 'actinide'
  | 'alkali metal'
  | 'alkaline earth metal'
  | 'halogen'
  | 'lanthanide'
  | 'metalloid'
  | 'noble gas'
  | 'nonmetal'
  | 'post-transition metal'
  | 'transition metal';

export type ElementSeed = {
  symbol: string;
  name: string;
  number: number;
  category: ElementCategory;
  /** What you have met it doing — the last clue. */
  hint: string;
};

export const ELEMENTS: ElementSeed[] = [
  // ── nonmetals ─────────────────────────────────────────────────────────────
  { symbol: 'H', name: 'Hydrogen', number: 1, category: 'nonmetal', hint: 'Two of its atoms in every water molecule; it also lifts weather balloons.' },
  { symbol: 'C', name: 'Carbon', number: 6, category: 'nonmetal', hint: 'Pencil leads, diamonds, and every living thing you have ever met.' },
  { symbol: 'N', name: 'Nitrogen', number: 7, category: 'nonmetal', hint: '78% of the air; kept liquid to freeze things in seconds.' },
  { symbol: 'O', name: 'Oxygen', number: 8, category: 'nonmetal', hint: 'About 21% of the air, and piped to hospital beds.' },
  { symbol: 'P', name: 'Phosphorus', number: 15, category: 'nonmetal', hint: 'Match heads and fertiliser.' },
  { symbol: 'S', name: 'Sulfur', number: 16, category: 'nonmetal', hint: 'The rotten-egg smell, and what vulcanises rubber into tyres.' },
  { symbol: 'Se', name: 'Selenium', number: 34, category: 'nonmetal', hint: 'A trace nutrient in Brazil nuts, and the active bit of anti-dandruff shampoo.' },

  // ── noble gases ───────────────────────────────────────────────────────────
  { symbol: 'He', name: 'Helium', number: 2, category: 'noble gas', hint: 'Party balloons, and the coolant in MRI magnets.' },
  { symbol: 'Ne', name: 'Neon', number: 10, category: 'noble gas', hint: 'Glows orange-red in the tubes named after it.' },
  { symbol: 'Ar', name: 'Argon', number: 18, category: 'noble gas', hint: 'Fills double glazing and shields a welding arc from the air.' },
  { symbol: 'Kr', name: 'Krypton', number: 36, category: 'noble gas', hint: 'Sits inside high-performance window panes and old photo flash lamps.' },
  { symbol: 'Xe', name: 'Xenon', number: 54, category: 'noble gas', hint: 'Bright car headlamps, and the propellant in spacecraft ion thrusters.' },
  { symbol: 'Rn', name: 'Radon', number: 86, category: 'noble gas', hint: 'The radioactive gas that seeps up into basements.' },

  // ── halogens ──────────────────────────────────────────────────────────────
  { symbol: 'F', name: 'Fluorine', number: 9, category: 'halogen', hint: 'Added to toothpaste and tap water to protect teeth.' },
  { symbol: 'Cl', name: 'Chlorine', number: 17, category: 'halogen', hint: 'Keeps swimming pools and drinking water clean.' },
  { symbol: 'Br', name: 'Bromine', number: 35, category: 'halogen', hint: 'Once the basis of film photography, now mostly flame retardants.' },
  { symbol: 'I', name: 'Iodine', number: 53, category: 'halogen', hint: 'Painted on skin as an antiseptic, and added to table salt.' },

  // ── alkali metals ─────────────────────────────────────────────────────────
  { symbol: 'Li', name: 'Lithium', number: 3, category: 'alkali metal', hint: 'The rechargeable battery in your phone.' },
  { symbol: 'Na', name: 'Sodium', number: 11, category: 'alkali metal', hint: 'One half of table salt.' },
  { symbol: 'K', name: 'Potassium', number: 19, category: 'alkali metal', hint: 'The reason people are told to eat a banana for cramp.' },
  { symbol: 'Rb', name: 'Rubidium', number: 37, category: 'alkali metal', hint: 'Runs the compact atomic clocks in telecoms gear and GPS ground stations.' },
  { symbol: 'Cs', name: 'Caesium', number: 55, category: 'alkali metal', hint: 'Defines the length of a second, in atomic clocks.' },

  // ── alkaline earth metals ─────────────────────────────────────────────────
  { symbol: 'Be', name: 'Beryllium', number: 4, category: 'alkaline earth metal', hint: 'Stiff and very light — aerospace parts and space telescope mirrors.' },
  { symbol: 'Mg', name: 'Magnesium', number: 12, category: 'alkaline earth metal', hint: 'Burns blinding white; alloyed into laptop shells and bike frames.' },
  { symbol: 'Ca', name: 'Calcium', number: 20, category: 'alkaline earth metal', hint: 'Bones, teeth, chalk and cement.' },
  { symbol: 'Sr', name: 'Strontium', number: 38, category: 'alkaline earth metal', hint: 'Makes fireworks burn red.' },
  { symbol: 'Ba', name: 'Barium', number: 56, category: 'alkaline earth metal', hint: 'The "meal" you swallow before an X-ray of the gut.' },
  { symbol: 'Ra', name: 'Radium', number: 88, category: 'alkaline earth metal', hint: 'Painted on glowing watch dials until it killed the women painting them.' },

  // ── metalloids ────────────────────────────────────────────────────────────
  { symbol: 'B', name: 'Boron', number: 5, category: 'metalloid', hint: 'Added to glass so it survives being taken from oven to sink.' },
  { symbol: 'Si', name: 'Silicon', number: 14, category: 'metalloid', hint: 'Sand, glass, and every computer chip ever made.' },
  { symbol: 'Ge', name: 'Germanium', number: 32, category: 'metalloid', hint: 'Infrared camera lenses, and the first transistors.' },
  { symbol: 'As', name: 'Arsenic', number: 33, category: 'metalloid', hint: 'The classic detective-novel poison; also dopes semiconductors.' },
  { symbol: 'Sb', name: 'Antimony', number: 51, category: 'metalloid', hint: 'A flame retardant in furniture foam; ancient Egyptians wore it as eye paint.' },
  { symbol: 'Te', name: 'Tellurium', number: 52, category: 'metalloid', hint: 'Paired with cadmium in thin-film solar panels.' },

  // ── post-transition metals ────────────────────────────────────────────────
  { symbol: 'Al', name: 'Aluminium', number: 13, category: 'post-transition metal', hint: 'Drink cans, kitchen foil and aircraft skins.' },
  { symbol: 'Ga', name: 'Gallium', number: 31, category: 'post-transition metal', hint: 'Melts in the warmth of your hand; runs LEDs and phone radio chips.' },
  { symbol: 'In', name: 'Indium', number: 49, category: 'post-transition metal', hint: 'The transparent conducting layer in every touchscreen.' },
  { symbol: 'Sn', name: 'Tin', number: 50, category: 'post-transition metal', hint: 'Solder, bronze, and the thin lining of a "tin" can.' },
  { symbol: 'Tl', name: 'Thallium', number: 81, category: 'post-transition metal', hint: 'Once sold as rat poison; now in infrared detectors.' },
  { symbol: 'Pb', name: 'Lead', number: 82, category: 'post-transition metal', hint: 'Car batteries, and the apron they put on you at the dentist.' },
  { symbol: 'Bi', name: 'Bismuth', number: 83, category: 'post-transition metal', hint: 'The pink stomach medicine, and lead-free shot and solder.' },

  // ── transition metals ─────────────────────────────────────────────────────
  { symbol: 'Ti', name: 'Titanium', number: 22, category: 'transition metal', hint: 'Hip implants and spectacle frames; its oxide is the white in white paint.' },
  { symbol: 'V', name: 'Vanadium', number: 23, category: 'transition metal', hint: 'Alloyed into steel for spanners and tool bits.' },
  { symbol: 'Cr', name: 'Chromium', number: 24, category: 'transition metal', hint: 'The shine on a chrome bumper, and what makes stainless steel stainless.' },
  { symbol: 'Mn', name: 'Manganese', number: 25, category: 'transition metal', hint: 'Hardens railway track steel; also sits in alkaline batteries.' },
  { symbol: 'Fe', name: 'Iron', number: 26, category: 'transition metal', hint: 'Steel, and the reason blood is red.' },
  { symbol: 'Co', name: 'Cobalt', number: 27, category: 'transition metal', hint: 'The blue in blue glass and pottery glaze; also in battery cathodes.' },
  { symbol: 'Ni', name: 'Nickel', number: 28, category: 'transition metal', hint: 'Coins, stainless steel and rechargeable batteries.' },
  { symbol: 'Cu', name: 'Copper', number: 29, category: 'transition metal', hint: 'House wiring, plumbing, and the green on an old roof.' },
  { symbol: 'Zn', name: 'Zinc', number: 30, category: 'transition metal', hint: 'Galvanises steel against rust; also the white paste in sunscreen.' },
  { symbol: 'Zr', name: 'Zirconium', number: 40, category: 'transition metal', hint: 'Cladding for nuclear fuel rods; its oxide is the fake diamond in cheap rings.' },
  { symbol: 'Mo', name: 'Molybdenum', number: 42, category: 'transition metal', hint: 'Engine-part steels, and a grey grease that lubricates under heavy load.' },
  { symbol: 'Ag', name: 'Silver', number: 47, category: 'transition metal', hint: 'Cutlery and jewellery, and the best electrical conductor there is.' },
  { symbol: 'Cd', name: 'Cadmium', number: 48, category: 'transition metal', hint: 'Old rechargeable batteries, and a bright yellow artists’ pigment.' },
  { symbol: 'W', name: 'Tungsten', number: 74, category: 'transition metal', hint: 'Old light-bulb filaments, and the carbide tip on a masonry drill.' },
  { symbol: 'Ir', name: 'Iridium', number: 77, category: 'transition metal', hint: 'Long-life spark plugs, and the thin layer marking the dinosaur extinction.' },
  { symbol: 'Pt', name: 'Platinum', number: 78, category: 'transition metal', hint: 'Jewellery, lab crucibles and catalytic converters.' },
  { symbol: 'Au', name: 'Gold', number: 79, category: 'transition metal', hint: 'Jewellery, and the plating on the connector pins in your computer.' },
  { symbol: 'Hg', name: 'Mercury', number: 80, category: 'transition metal', hint: 'Old thermometers and fluorescent tubes; liquid at room temperature.' },

  // ── lanthanides ───────────────────────────────────────────────────────────
  { symbol: 'Ce', name: 'Cerium', number: 58, category: 'lanthanide', hint: 'The spark thrown by a lighter flint; also polishes glass.' },
  { symbol: 'Nd', name: 'Neodymium', number: 60, category: 'lanthanide', hint: 'The magnet on your fridge, and the one inside your headphones.' },
  { symbol: 'Sm', name: 'Samarium', number: 62, category: 'lanthanide', hint: 'Magnets that keep working when hot — guitar pickups and small motors.' },
  { symbol: 'Eu', name: 'Europium', number: 63, category: 'lanthanide', hint: 'The red glow in old TV tubes, and the security marks on euro banknotes.' },
  { symbol: 'Gd', name: 'Gadolinium', number: 64, category: 'lanthanide', hint: 'Injected as the contrast agent for an MRI scan.' },

  // ── actinides ─────────────────────────────────────────────────────────────
  { symbol: 'Th', name: 'Thorium', number: 90, category: 'actinide', hint: 'The mantle in old camping gas lanterns.' },
  { symbol: 'U', name: 'Uranium', number: 92, category: 'actinide', hint: 'Fuel for nuclear power stations; it once coloured glassware green.' },
  { symbol: 'Pu', name: 'Plutonium', number: 94, category: 'actinide', hint: 'Powers the generators on deep-space probes.' },
  { symbol: 'Am', name: 'Americium', number: 95, category: 'actinide', hint: 'Sits inside the smoke detector on your ceiling.' },
  { symbol: 'Cf', name: 'Californium', number: 98, category: 'actinide', hint: 'A portable neutron source, used to scan for metal fatigue and to find oil.' },
];
