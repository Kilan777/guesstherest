/**
 * Leaderboard-name vetting.
 *
 * Handles are shown publicly next to every score, so a name is checked before
 * it can be saved and again before it is posted to the global board.
 *
 * The hard part is not the word list, it's the Scunthorpe problem: naive
 * substring matching rejects Scunthorpe, Penistone, classic, assassin and
 * therapist, along with a long tail of real place names and surnames.
 * Rejecting a real person's name is a worse failure than letting one rude word
 * through, so the matcher blanks out known-innocent words *before* it looks for
 * anything banned, and the list deliberately leaves out mild or ambiguous terms
 * (damn, crap, hell, gay, queer) rather than risk them.
 *
 * Matching runs on a normalised form: accents stripped, lowercased, leetspeak
 * folded back to letters, and every separator (space, dot, dash, underscore,
 * digit, punctuation) removed — so "f.u.c.k", "sh1t" and "n_i_g_g_a" collapse
 * onto the same string as the plain spelling. Each term is compiled to a
 * repeat-tolerant pattern (`ass` -> /a+s+s+/) so "aaassss" is caught without
 * having to shorten the term itself.
 */

export type HandleCheck = { ok: true } | { ok: false; reason: string };

/** Matches the `maxLength` already on the name inputs. */
export const MAX_HANDLE_LENGTH = 20;

/* ── normalisation ─────────────────────────────────────────────────────────── */

const LEET: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  '$': 's',
  '!': 'i',
  '|': 'i',
  '+': 't',
};

/** Lowercase, and decompose accents so "María" reads as "maria". */
function fold(raw: string): string {
  return raw.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/**
 * Reduce to bare letters. Both readings are kept because they catch different
 * evasions: with leet folding "sh1t" becomes "shit", and without it the digits
 * in "f1u1c1k" simply drop out and leave "fuck".
 */
function letters(folded: string, leet: boolean): string {
  let out = '';
  for (const ch of folded) {
    const mapped = leet ? (LEET[ch] ?? ch) : ch;
    if (mapped >= 'a' && mapped <= 'z') out += mapped;
  }
  return out;
}

/** `ass` -> /a+s+s+/ — tolerates padded repeats without shortening the term. */
function stretchy(word: string, flags = ''): RegExp {
  return new RegExp(word.split('').join('+') + '+', flags);
}

/* ── word lists ────────────────────────────────────────────────────────────── */

/**
 * Terms that are checked against the *scrubbed* text, i.e. after innocent words
 * have been blanked out. Stored as bare letters; the matcher deals with case,
 * accents, leetspeak, separators and repeats.
 */
const BANNED = [
  // general profanity
  'fuck', 'fuk', 'fck', 'phuck', 'shit', 'shite', 'cunt', 'bitch', 'bastard',
  'ass', 'arse', 'piss', 'dick', 'cock', 'prick', 'wank', 'twat', 'bollock',
  'bellend', 'douche', 'turd', 'knobhead', 'jackoff',
  // sexual
  'pussy', 'penis', 'vagina', 'clit', 'anus', 'anal', 'whore', 'slut', 'skank',
  'thot', 'milf', 'jizz', 'cumshot', 'cumslut', 'blowjob', 'handjob', 'rimjob',
  'dildo', 'buttplug', 'ballsack', 'nutsack', 'bukkake', 'porn', 'tits',
  'titty', 'smegma', 'queef', 'shemale', 'ladyboy', 'gangbang',
  // racial slurs
  'nig', 'nigg', 'nigger', 'nigga', 'kike', 'kyke', 'spic', 'chink', 'gook',
  'wetback', 'beaner', 'coon', 'paki', 'wog', 'jap', 'negro', 'darkie',
  'darky', 'raghead', 'towelhead', 'kaffir', 'chinaman',
  // homophobic / transphobic slurs
  'faggot', 'fagot', 'fag', 'dyke', 'homo', 'poofter', 'tranny', 'trannie',
  'battyboy',
  // ableist slurs
  'retard', 'mongoloid', 'spastic',
  // hate figures and groups
  'nazi', 'hitler', 'kkk', 'klux',
  // violent / abusive
  'rape', 'rapist', 'molest', 'pedo', 'paedo', 'killyourself', 'killurself',
];

/**
 * Terms checked against the *unscrubbed* text.
 *
 * A whitelisted word can otherwise shield a genuine insult that ends with it:
 * "bass" is innocent, but blanking it out of "dumbass" would leave nothing to
 * match. Everything here is a compound with no innocent reading, so it is safe
 * to test before any scrubbing happens.
 */
const BANNED_STRICT = [
  'asshole', 'arsehole', 'asswipe', 'asshat', 'assclown', 'assface',
  // "assbandit" and "asshead" used to be here and were dropped: they are rare
  // insults, and they straddle the seam in ordinary compounds like
  // "GlassBandit" and "brasshead", which is exactly the trade this file avoids.
  'assmunch', 'asslick', 'asskiss', 'dumbass',
  'dumass', 'fatass', 'jackass', 'smartass', 'lardass', 'tightass',
  'hardass', 'wiseass', 'kissass', 'bullshit', 'motherfuck', 'fuckyou',
  'fuckoff', 'nignog',
];

/**
 * Innocent words that happen to contain a banned term. These are blanked out
 * before matching, so "Scunthorpe" never reaches the `cunt` test. A missing
 * entry here means a false positive on someone's real name, so this list errs
 * heavily towards adding words — including ones the repeat-tolerant patterns
 * only reach through a doubled letter ("rapper" via `rape`, "Speedo" via
 * `pedo`, "Shiite" via `shite`, "Saturday" via `turd`).
 */
const INNOCENT = [
  // -ass-
  'assassin', 'assassinate', 'assist', 'assign', 'assess', 'asset', 'assemble',
  'assembly', 'assert', 'assume', 'assure', 'associate', 'assort', 'assault',
  'assay', 'assuage', 'assiduous', 'assimilate', 'ambassador', 'assange',
  'assyria', 'assam', 'class', 'classic', 'glass', 'grass', 'brass', 'crass',
  'wrasse', 'bass', 'mass', 'pass', 'lass', 'sass', 'cass', 'hass', 'nass',
  'wass', 'morass', 'harass', 'carcass', 'jurassic', 'potassium', 'compass',
  'embassy', 'chassis', 'tassel', 'vassal', 'picasso', 'sassafras',
  'massachusetts', 'renaissance',
  // -arse-
  'parse', 'sparse', 'coarse', 'hoarse', 'arsenal', 'arsenic', 'marseille',
  'marsh', 'varsity',
  // -cunt-
  'scunthorpe', 'viscount', 'account', 'countable',
  // -shit- / -shite-
  'shiitake', 'shitake', 'matsushita', 'mishit', 'shiite', 'ashito',
  // -dick- / -cock-
  'dickens', 'dickinson', 'dickerson', 'dickson', 'dicky', 'benedick',
  'cocktail', 'cockpit', 'cockney', 'cockroach', 'cocker', 'cockatoo',
  'peacock', 'hancock', 'babcock', 'hitchcock', 'woodcock', 'shuttlecock',
  'stopcock', 'weathercock', 'cockle',
  // -penis- / -anus- / -anal-
  'penistone', 'happiness', 'openness', 'uranus', 'janus', 'manus',
  'manuscript', 'vanuatu', 'analy', 'analog', 'canal', 'banal', 'canaletto',
  'annal',
  // -nig-
  'night', 'nightly', 'nightmare', 'nightingale', 'midnight', 'tonight',
  // NB: bare "niger" is deliberately absent — its repeat-tolerant pattern also
  // swallows the slur spelled with a doubled g, which matters more than the
  // country name on its own. "nigeria"/"nigerien" cover the common uses.
  'knight', 'nigh', 'nigel', 'nigella', 'nigeria', 'nigerien', 'benign', 'niggle',
  'nigiri', 'finnigan', 'hannigan', 'flanigan', 'brannigan', 'branigan',
  'dunnigan', 'lanigan', 'kernighan',
  // -spic- / -chink- / -coon- / -paki- / -jap- / -wog- / -negro-
  'spice', 'spicy', 'spicer', 'suspicion', 'suspicious', 'auspice',
  'auspicious', 'conspicuous', 'despicable', 'hospice', 'chinkapin', 'raccoon',
  'racoon', 'cocoon', 'tycoon', 'coonhound', 'pakistan', 'japan', 'japanese',
  'jape', 'wogan', 'montenegro', 'negroni', 'negros',
  // -fag- / -dyke- / -homo-
  'fagin', 'fagan', 'fagus', 'vandyke', 'dykstra', 'homogen', 'homonym',
  'homophone', 'homograph', 'homolog', 'homosapien', 'homosexual',
  // -rape- / -rapist- / -pedo-
  'grape', 'grapefruit', 'drape', 'scrape', 'therapist', 'therapy', 'trapeze',
  'rapeseed', 'rapper', 'wrapper', 'trapper', 'strapper', 'rappel', 'rapping',
  'wrapping', 'trapping', 'strapping', 'rapped', 'wrapped', 'trapped',
  'strapped', 'torpedo', 'pedometer', 'speedo',
  // -piss- / -turd- / -clit- / -nazi- / -retard- / -thot- / -fuk-
  'pissarro', 'saturday', 'sturdy', 'heraclitus', 'nazir', 'nazim',
  'retardant', 'thoth', 'fuku', 'titsworth',
  // -sex- adjacent place names, kept safe in case the list ever grows
  'sussex', 'essex', 'middlesex', 'wessex', 'unisex', 'sexton', 'sextant',
];

/** Handles that pass themselves off as site staff. */
const STAFF = /admin|moderator|owner|official/;

const INNOCENT_RES = INNOCENT
  // Longest first, so "midnight" is consumed before "night" nibbles at it.
  .slice()
  .sort((a, b) => b.length - a.length)
  .map((w) => stretchy(w, 'g'));

const BANNED_RES = BANNED.map((w) => stretchy(w));
const BANNED_STRICT_RES = BANNED_STRICT.map((w) => stretchy(w));

/**
 * Blank out every innocent word. The replacement is a space rather than an
 * empty string: banned patterns contain no spaces, so a blanked word acts as a
 * wall instead of gluing its neighbours into an accidental match.
 */
function scrub(text: string): string {
  let out = text;
  for (const re of INNOCENT_RES) out = out.replace(re, ' ');
  return out;
}

function hasBanned(text: string): boolean {
  if (BANNED_STRICT_RES.some((re) => re.test(text))) return true;
  const scrubbed = scrub(text);
  return BANNED_RES.some((re) => re.test(scrubbed));
}

/* ── public API ────────────────────────────────────────────────────────────── */

const REJECT = 'That name won’t work on the public board — please pick another.';
const REJECT_STAFF = 'That name looks like site staff. Please pick another.';

/**
 * Vet a name a player wants on the leaderboard.
 *
 * The reason never names the word that matched — there's no sense handing back
 * a hint for tuning an evasion, and no sense lecturing anyone.
 */
export function checkHandle(name: string): HandleCheck {
  if (typeof name !== 'string') return { ok: false, reason: 'Please enter a name.' };

  const trimmed = name.replace(/\s+/g, ' ').trim();
  if (!trimmed) return { ok: false, reason: 'Please enter a name.' };
  if (trimmed.length > MAX_HANDLE_LENGTH) {
    return { ok: false, reason: `Keep it to ${MAX_HANDLE_LENGTH} characters or fewer.` };
  }

  const folded = fold(trimmed);
  const forms = [letters(folded, true), letters(folded, false)];

  if (forms.some((f) => STAFF.test(f))) return { ok: false, reason: REJECT_STAFF };
  if (forms.some(hasBanned)) return { ok: false, reason: REJECT };

  return { ok: true };
}

/** Convenience for call sites that only care whether it passes. */
export function isHandleOk(name: string): boolean {
  return checkHandle(name).ok;
}
