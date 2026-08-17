/**
 * Vocabulary with definitions written from scratch rather than copied, in plain
 * language and short enough to fit on a stage.
 *
 * Two rules held throughout, because a vocabulary game that teaches a wrong
 * definition is worse than no game:
 *
 *  - Nothing here is included unless both the spelling and the sense are
 *    certain. Words that only exist on internet lists of "untranslatable"
 *    words (sonder, and most of that family) are not in a dictionary and are
 *    not here.
 *  - No definition or clue contains the word itself or an obvious derivative
 *    of it. That is checked mechanically, not by eye.
 *
 * `hint` is the last rung: an etymology or a usage note, which is usually the
 * thing that finally shakes the word loose.
 */
export type WordPos = 'noun' | 'verb' | 'adjective';

export type WordSeed = {
  /** Stored lowercase; capitalised for display. */
  word: string;
  definition: string;
  pos: WordPos;
  hint: string;
};

export const WORDS: WordSeed[] = [
  // ── the rare and pleasing ─────────────────────────────────────────────────
  {
    word: 'petrichor',
    definition: 'The pleasant smell of rain falling on dry earth.',
    pos: 'noun',
    hint: 'From Greek roots meaning stone and the fluid in the veins of the gods.',
  },
  {
    word: 'defenestration',
    definition: 'The act of throwing someone or something out of a window.',
    pos: 'noun',
    hint: 'The Latin for window sits inside it. A famous instance in Prague in 1618 helped start the Thirty Years War.',
  },
  {
    word: 'susurrus',
    definition: 'A soft whispering or rustling sound.',
    pos: 'noun',
    hint: 'Latin, and the word imitates the sound it names.',
  },
  {
    word: 'halcyon',
    definition: 'Calm and peaceful, especially of a remembered stretch of happiness.',
    pos: 'adjective',
    hint: 'From a Greek myth about a bird that nested on the open sea at midwinter and stilled the waves for a fortnight.',
  },
  {
    word: 'serendipity',
    definition: 'The luck of finding something valuable while looking for something else.',
    pos: 'noun',
    hint: 'Coined by Horace Walpole in 1754 after a Persian tale about three princes, using an old name for Sri Lanka.',
  },
  {
    word: 'quixotic',
    definition: 'Idealistic to the point of being hopelessly impractical.',
    pos: 'adjective',
    hint: 'From the hero of a Spanish novel of 1605 who charged at windmills.',
  },
  {
    word: 'schadenfreude',
    definition: 'Pleasure taken in the misfortune of another person.',
    pos: 'noun',
    hint: 'German, joining the words for harm and joy. English borrowed it whole in the 1890s.',
  },
  {
    word: 'zeitgeist',
    definition: 'The mood and outlook typical of a particular period in history.',
    pos: 'noun',
    hint: 'German, joining the words for time and spirit; Hegel gave it philosophical currency.',
  },
  {
    word: 'wanderlust',
    definition: 'A strong desire to travel and see distant places.',
    pos: 'noun',
    hint: 'Borrowed whole from German in the early 1900s; the first half means to roam.',
  },
  {
    word: 'ersatz',
    definition: 'Serving as an inferior substitute for the real thing.',
    pos: 'adjective',
    hint: 'German for replacement. English took it during the world wars, when substitute coffee and rubber were everywhere.',
  },
  {
    word: 'gossamer',
    definition: 'Fine filmy cobweb drifting in still autumn air; anything very light and delicate.',
    pos: 'noun',
    hint: 'Probably from a medieval name for a warm spell late in the year, when geese were eaten and spider silk floats on the breeze.',
  },
  {
    word: 'crepuscular',
    definition: 'Of or resembling twilight; of an animal, active at dawn and dusk.',
    pos: 'adjective',
    hint: 'From the Latin for twilight. Foxes, deer and most cats keep those hours.',
  },
  {
    word: 'antediluvian',
    definition: 'Absurdly old-fashioned; belonging to a very remote past.',
    pos: 'adjective',
    hint: 'Latin for "before the flood" — literally the era preceding the one in Genesis.',
  },
  {
    word: 'bucolic',
    definition: 'Relating to the pleasant, idealised side of country life.',
    pos: 'adjective',
    hint: 'From the Greek for cowherd, by way of pastoral poetry.',
  },
  {
    word: 'mellifluous',
    definition: 'Pleasingly smooth and musical to listen to.',
    pos: 'adjective',
    hint: 'Latin for honey-flowing.',
  },
  {
    word: 'penumbra',
    definition: 'The partly shaded outer region of a shadow.',
    pos: 'noun',
    hint: 'Latin for "almost shadow", coined by Kepler while working on eclipses.',
  },
  {
    word: 'lacuna',
    definition: 'A gap where something is missing, especially in a manuscript or an argument.',
    pos: 'noun',
    hint: 'Latin for a pit or a pool. The same root gave us lagoon.',
  },
  {
    word: 'maelstrom',
    definition: 'A powerful whirlpool; a scene of violent turbulence or confusion.',
    pos: 'noun',
    hint: 'Dutch, roughly "grinding stream". It began as the name of a current off the coast of Norway.',
  },
  {
    word: 'kerfuffle',
    definition: 'A commotion or fuss over something fairly minor.',
    pos: 'noun',
    hint: 'From Scots, where it meant to throw into disorder.',
  },
  {
    word: 'discombobulate',
    definition: 'To throw someone into confusion.',
    pos: 'verb',
    hint: 'A jokey American coinage of the 1830s, built to sound like solemn Latin.',
  },
  {
    word: 'flummox',
    definition: 'To bewilder someone completely.',
    pos: 'verb',
    hint: 'English dialect of the 1830s, origin unknown. Dickens put it into print in The Pickwick Papers.',
  },
  {
    word: 'cantankerous',
    definition: 'Bad-tempered and inclined to argue.',
    pos: 'adjective',
    hint: 'Eighteenth-century English of uncertain parentage, probably built on a dialect word for quarrelsome.',
  },
  {
    word: 'obstreperous',
    definition: 'Noisy, unruly and hard to control.',
    pos: 'adjective',
    hint: 'Latin, roughly "making a noise against".',
  },
  {
    word: 'quagmire',
    definition: 'Soft wet ground that gives way underfoot; by extension, a situation that is hard to get out of.',
    pos: 'noun',
    hint: 'The second half is an old word for boggy ground; the first is a dialect word for the way such ground shakes.',
  },
  {
    word: 'panacea',
    definition: 'A single supposed remedy for every disease or problem.',
    pos: 'noun',
    hint: 'Named after a Greek goddess of healing whose name meant "all-curing".',
  },
  {
    word: 'umbrage',
    definition: 'Offence or resentment at a perceived slight.',
    pos: 'noun',
    hint: 'Latin for shade. To be put in someone else\'s shadow is to feel slighted. Almost always paired with the verb "take".',
  },
  {
    word: 'apocryphal',
    definition: 'Widely repeated but probably not true.',
    pos: 'adjective',
    hint: 'Greek for "hidden away", first used of writings left out of the biblical canon.',
  },
  {
    word: 'nadir',
    definition: 'The lowest point, especially of somebody\'s fortunes.',
    pos: 'noun',
    hint: 'From Arabic for "opposite" — in astronomy, the point directly beneath your feet.',
  },
  {
    word: 'zenith',
    definition: 'The point in the sky directly overhead; the highest point reached by anything.',
    pos: 'noun',
    hint: 'From an Arabic word for path, mangled by a medieval scribe copying it into Latin.',
  },
  {
    word: 'sanguine',
    definition: 'Cheerfully confident about the future, especially in a difficult situation.',
    pos: 'adjective',
    hint: 'From medieval medicine and its four humours: the temperament governed by blood.',
  },
  {
    word: 'tempestuous',
    definition: 'Stormy; full of violent emotion or upheaval.',
    pos: 'adjective',
    hint: 'The Latin original meant both a season and a storm.',
  },
  {
    word: 'vestige',
    definition: 'A small trace of something that has otherwise disappeared.',
    pos: 'noun',
    hint: 'Latin for footprint.',
  },
  {
    word: 'iridescent',
    definition: 'Showing shifting rainbow colours as the angle of view or light changes.',
    pos: 'adjective',
    hint: 'Named for the Greek goddess of the rainbow. Oil films, beetle shells and the inside of a shell all do it.',
  },
  {
    word: 'incandescent',
    definition: 'Glowing white with heat; also, extremely angry.',
    pos: 'adjective',
    hint: 'Latin candescere, to grow white-hot. The same root gave us candle.',
  },
  {
    word: 'effervescent',
    definition: 'Giving off bubbles of gas; of a person, lively and high-spirited.',
    pos: 'adjective',
    hint: 'Latin for boiling up. The chemistry sense came first; the personality followed.',
  },

  // ── the genuinely useful ──────────────────────────────────────────────────
  {
    word: 'ephemeral',
    definition: 'Lasting for a very short time.',
    pos: 'adjective',
    hint: 'From the Greek for "lasting only a day". A whole order of insects is named from the same root.',
  },
  {
    word: 'ubiquitous',
    definition: 'Present everywhere, or seeming to turn up wherever you look.',
    pos: 'adjective',
    hint: 'From the Latin for everywhere.',
  },
  {
    word: 'gregarious',
    definition: 'Fond of company; sociable.',
    pos: 'adjective',
    hint: 'From Latin grex, a flock or herd — the same root as congregation.',
  },
  {
    word: 'laconic',
    definition: 'Using very few words.',
    pos: 'adjective',
    hint: 'From the Greek region around Sparta, whose people were famous for one-word replies.',
  },
  {
    word: 'pragmatic',
    definition: 'Dealing with things in a practical way rather than by theory.',
    pos: 'adjective',
    hint: 'From the Greek for a deed or a thing done. An American school of philosophy built on the same root judges an idea by its results.',
  },
  {
    word: 'taciturn',
    definition: 'Reserved; saying very little by habit.',
    pos: 'adjective',
    hint: 'From Latin tacere, to be silent.',
  },
  {
    word: 'garrulous',
    definition: 'Excessively talkative, especially about trivial things.',
    pos: 'adjective',
    hint: 'From the Latin for chattering.',
  },
  {
    word: 'obfuscate',
    definition: 'To make something unclear or hard to follow, usually deliberately.',
    pos: 'verb',
    hint: 'From Latin fuscus, dark.',
  },
  {
    word: 'juxtapose',
    definition: 'To place two things side by side, usually to point up a contrast.',
    pos: 'verb',
    hint: 'A Latin word meaning beside, glued onto a French verb meaning to place.',
  },
  {
    word: 'ameliorate',
    definition: 'To make a bad situation better.',
    pos: 'verb',
    hint: 'From the Latin for better.',
  },
  {
    word: 'cacophony',
    definition: 'A harsh, jarring mixture of sounds.',
    pos: 'noun',
    hint: 'Greek kakos, bad, welded to the Greek word for sound.',
  },
  {
    word: 'ineffable',
    definition: 'Too great or too strange to be described in words.',
    pos: 'adjective',
    hint: 'From a Latin verb meaning to speak out, with a negative prefix. It was first used of things too sacred to name.',
  },
  {
    word: 'lugubrious',
    definition: 'Looking or sounding mournful, often to a faintly comic degree.',
    pos: 'adjective',
    hint: 'From Latin lugere, to mourn.',
  },
  {
    word: 'sycophant',
    definition: 'A person who flatters someone powerful in order to gain advantage.',
    pos: 'noun',
    hint: 'Greek, literally "one who shows the fig". Nobody is sure what the gesture meant.',
  },
  {
    word: 'perfunctory',
    definition: 'Done with the minimum of effort or care, purely as a duty.',
    pos: 'adjective',
    hint: 'Latin, from the sense of getting a duty discharged and being done with it.',
  },
  {
    word: 'surreptitious',
    definition: 'Done secretly, so as not to be noticed.',
    pos: 'adjective',
    hint: 'From a Latin verb meaning to snatch away in secret.',
  },
  {
    word: 'vicarious',
    definition: 'Experienced at second hand, through watching or reading about someone else.',
    pos: 'adjective',
    hint: 'From the Latin for a stand-in or substitute; a parish priest holds a title from the same root.',
  },
  {
    word: 'tenacious',
    definition: 'Holding on firmly and refusing to give up.',
    pos: 'adjective',
    hint: 'From Latin tenere, to hold.',
  },
  {
    word: 'myriad',
    definition: 'A countless or extremely great number of things.',
    pos: 'noun',
    hint: 'In ancient Greek it was an exact figure: ten thousand.',
  },
  {
    word: 'eloquent',
    definition: 'Fluent and persuasive in speech or writing.',
    pos: 'adjective',
    hint: 'From Latin loqui, to speak.',
  },
  {
    word: 'austere',
    definition: 'Severe or plain, without comfort or decoration.',
    pos: 'adjective',
    hint: 'The Greek original described a harsh, drying taste long before it described a way of living.',
  },
  {
    word: 'resilient',
    definition: 'Able to recover quickly from difficulty, or to spring back into shape.',
    pos: 'adjective',
    hint: 'From the Latin for leaping back.',
  },
  {
    word: 'meticulous',
    definition: 'Showing great attention to detail; very careful and precise.',
    pos: 'adjective',
    hint: 'From Latin metus, fear. For centuries it meant timid rather than thorough.',
  },
  {
    word: 'ambivalent',
    definition: 'Having mixed or contradictory feelings about something.',
    pos: 'adjective',
    hint: 'Coined by a Swiss psychiatrist around 1910 for patients pulled two ways at once.',
  },
  {
    word: 'arduous',
    definition: 'Requiring great and sustained effort; hard and tiring.',
    pos: 'adjective',
    hint: 'From the Latin for steep or high ground.',
  },
  {
    word: 'eclectic',
    definition: 'Drawing on a wide and varied range of sources or styles.',
    pos: 'adjective',
    hint: 'Greek for selective, after ancient philosophers who took doctrines from every school going.',
  },
  {
    word: 'empathy',
    definition: 'The ability to understand and share what another person is feeling.',
    pos: 'noun',
    hint: 'Coined around 1900 to render a German term meaning "feeling into", and first used about art rather than people.',
  },
  {
    word: 'enigmatic',
    definition: 'Mysterious and difficult to interpret.',
    pos: 'adjective',
    hint: 'From the Greek for a riddle.',
  },
  {
    word: 'exacerbate',
    definition: 'To make a problem or a bad feeling worse.',
    pos: 'verb',
    hint: 'From Latin acerbus, bitter or harsh.',
  },
  {
    word: 'facetious',
    definition: 'Treating a serious matter with inappropriate humour.',
    pos: 'adjective',
    hint: 'From the Latin for witty. Often pointed out as an English word containing all five vowels in order.',
  },
  {
    word: 'frugal',
    definition: 'Careful with money or resources; sparing.',
    pos: 'adjective',
    hint: 'From Latin frux, fruit or produce — thrift understood as a good yield.',
  },
  {
    word: 'hackneyed',
    definition: 'So overused that it has lost all force or freshness.',
    pos: 'adjective',
    hint: 'It first described a horse kept for hire and worn out by constant use.',
  },
  {
    word: 'impetuous',
    definition: 'Acting quickly and without thought for the consequences.',
    pos: 'adjective',
    hint: 'From the Latin for an attack or a rush at something.',
  },
  {
    word: 'inevitable',
    definition: 'Certain to happen and impossible to prevent.',
    pos: 'adjective',
    hint: 'From a Latin verb meaning to avoid, with a negative prefix.',
  },
  {
    word: 'innocuous',
    definition: 'Harmless, and unlikely to give offence.',
    pos: 'adjective',
    hint: 'From Latin nocere, to harm, with a negative prefix.',
  },
  {
    word: 'nostalgia',
    definition: 'A sentimental longing for the past.',
    pos: 'noun',
    hint: 'Coined in 1688 by a Swiss medical student from Greek words for homecoming and pain, to name an illness he saw in soldiers far from home.',
  },
  {
    word: 'obsolete',
    definition: 'No longer in use, having been replaced by something newer.',
    pos: 'adjective',
    hint: 'From a Latin verb meaning to fall out of use.',
  },
  {
    word: 'ostentatious',
    definition: 'Showy in a way designed to impress.',
    pos: 'adjective',
    hint: 'From the Latin for displaying or showing off.',
  },
  {
    word: 'placate',
    definition: 'To calm somebody\'s anger by doing or saying something.',
    pos: 'verb',
    hint: 'From the Latin for soothing — related to please.',
  },
  {
    word: 'plausible',
    definition: 'Seeming reasonable or likely to be true.',
    pos: 'adjective',
    hint: 'From the Latin for applauding. It once meant deserving of applause.',
  },
  {
    word: 'reticent',
    definition: 'Unwilling to say much about one\'s own thoughts or feelings.',
    pos: 'adjective',
    hint: 'From the Latin for keeping silent; a close cousin of taciturn.',
  },
  {
    word: 'scrupulous',
    definition: 'Very careful to do what is correct and right.',
    pos: 'adjective',
    hint: 'From the Latin for a small sharp stone — the kind that gets into a shoe and nags.',
  },
  {
    word: 'spurious',
    definition: 'False, although it has the appearance of being genuine.',
    pos: 'adjective',
    hint: 'From Latin for illegitimate, of uncertain parentage.',
  },
  {
    word: 'stoic',
    definition: 'Enduring pain or hardship without complaint or visible feeling.',
    pos: 'adjective',
    hint: 'Named for the painted porch in Athens where a school of Greek philosophers taught self-command.',
  },
  {
    word: 'superfluous',
    definition: 'More than is needed; serving no useful purpose.',
    pos: 'adjective',
    hint: 'Latin, from the sense of flowing over the top.',
  },
  {
    word: 'verbose',
    definition: 'Using far more words than are needed.',
    pos: 'adjective',
    hint: 'From the Latin for a word.',
  },
  {
    word: 'vindicate',
    definition: 'To clear of blame, or to prove right after doubt.',
    pos: 'verb',
    hint: 'From the Latin for claiming or avenging. The legal sense came first.',
  },
  {
    word: 'voracious',
    definition: 'Having a huge appetite, whether for food or for anything else.',
    pos: 'adjective',
    hint: 'From the Latin for devouring — the same root as carnivore.',
  },
  {
    word: 'wistful',
    definition: 'Quietly sad, with a longing for something lost or out of reach.',
    pos: 'adjective',
    hint: 'Probably a blend of an old adverb meaning intently and the adjective wishful.',
  },
  {
    word: 'zealous',
    definition: 'Showing great energy and enthusiasm for a cause or an aim.',
    pos: 'adjective',
    hint: 'From the Greek for ardour — and the same root as jealous.',
  },
  {
    word: 'sonorous',
    definition: 'Deep, full and resonant in sound.',
    pos: 'adjective',
    hint: 'From the Latin for sound, and normally said of a voice, a bell or an organ.',
  },
  {
    word: 'lucid',
    definition: 'Clear and easy to follow; of a mind, thinking plainly.',
    pos: 'adjective',
    hint: 'From the Latin for light. The same root gave us translucent.',
  },
];
