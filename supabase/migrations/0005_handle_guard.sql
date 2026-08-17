-- Handles: a server-side backstop, and a way to take one down.
--
-- Two problems, both of them the same problem seen from either end.
--
--  1. `handle` is the one piece of free text a player writes that everyone else
--     reads. It is vetted by `src/lib/handle-filter.ts` — a good filter that
--     defeats leetspeak, separators, padding and homoglyphs — and that filter is
--     called from every name input and again in `boardHandle()` before a score
--     is posted. Every one of those call sites runs IN THE BROWSER. The only
--     thing this database asked of a handle was `char_length between 1 and 20`
--     (0001). Anonymous sign-ins are on and the publishable key ships in the
--     bundle, so anybody can mint a session with one request and POST twenty
--     characters of whatever they like straight onto a world-readable board.
--     The client filter is not a security control; it never was one. It is a
--     courtesy that tells an honest player their name won't fly.
--
--  2. There was no way to take one down. 0001 says "Deliberately no UPDATE or
--     DELETE policy" — right for scores, wrong for the text attached to them —
--     and the moderation added in 0004 hides ROUNDS, not handles. A slur posted
--     to a public board was permanent, on an ad-supported site, with no
--     in-product remedy.
--
-- This file closes both. The database gets a coarse, unbypassable filter, and
-- moderators get a delete.
--
--
-- ── THE DIVISION OF LABOUR ─────────────────────────────────────────────────
--
-- The two layers are deliberately NOT equal, and it matters which is which:
--
--   the client filter  strict, chatty, tuneable. Rejects mild stuff, staff
--                      impersonation, anything ambiguous. Explains itself in a
--                      friendly sentence and offers another go. It can afford
--                      to be wrong because being wrong costs one retype.
--
--   this file          coarse, silent, unbypassable. Rejects the words that
--                      would embarrass the site if they appeared next to an ad,
--                      and nothing else. Being wrong here costs a real person
--                      their real name with an error they cannot act on, in a
--                      layer they cannot see, so it errs the other way.
--
-- Concretely: every term below is drawn from `BANNED` / `BANNED_STRICT` in
-- handle-filter.ts, and the innocent list below is that file's `INNOCENT` list
-- plus a few extra. Same algorithm, fewer banned words, more innocent words.
-- That is a deliberate invariant, worth keeping if this list is ever edited:
--
--     anything the client accepts, the database accepts.
--
-- So a player who plays by the rules can never be told "no" by a constraint,
-- and every rejection that does happen here is by definition someone who went
-- round the client on purpose.
--
--
-- ── WHY A TRIGGER AND NOT A CHECK CONSTRAINT ───────────────────────────────
--
-- Both were on the table. The structural rules (length, not blank) are a CHECK,
-- because they are genuinely immutable facts about the column. The word list is
-- a BEFORE trigger, for four reasons:
--
--   Existing rows. `ALTER TABLE ... ADD CHECK` validates every row already in
--   the table and takes an ACCESS EXCLUSIVE lock while it does. If one historic
--   handle failed, the migration would abort — and the rows most likely to fail
--   are exactly the ones this file exists because of. A trigger fires on new
--   writes only, so the migration always applies, and the bad rows already
--   present get cleaned up with the DELETE policy below (there is a query for
--   finding them at the bottom of this file).
--
--   The list is data, not logic, and data changes. A CHECK constraint must call
--   an IMMUTABLE function, and IMMUTABLE is a promise that the same input gives
--   the same answer forever. Editing a word list inside a function the planner
--   has been told is immutable is exactly the promise-breaking that bites you
--   later — cached plans, and a constraint whose meaning silently differs from
--   the rows that were admitted under it. A trigger makes no such promise:
--   `create or replace` the function and the next insert uses the new list.
--
--   Error messages. A trigger can `raise` with its own text and SQLSTATE.
--   PostgREST turns 23514 into a 400 the client can read, instead of the raw
--   "violates check constraint scores_handle_clean" with the constraint name
--   and, by extension, the shape of the guard.
--
--   Restore safety. pg_dump does not track the dependency of a CHECK expression
--   on a function, so a constraint calling one can fail to restore depending on
--   dump ordering. A trigger is created after the table, always.
--
-- The helpers are still marked IMMUTABLE so they can be called from a plain
-- SELECT and, if you ever want it, from a CHECK — see the sweep query at the
-- end. `set search_path = ''` on each so a temp-schema shadow cannot redirect a
-- call inside them (pg_catalog is always searched, so the built-ins still
-- resolve); everything else is schema-qualified.


-- ── normalisation ──────────────────────────────────────────────────────────

-- Lowercase, then fold accents and lookalike letters back to plain ASCII.
--
-- No `unaccent` extension on purpose: it needs a superuser CREATE EXTENSION and
-- a dictionary file, and this needs to be runnable by pasting it into the SQL
-- editor. translate() over a hand-written map does the same job for the Latin-1
-- and Latin Extended-A letters that actually turn up in names ("María" reads as
-- "maria"), and the few one-to-many cases are spelled out first.
--
-- The second translate() is the homoglyph fold, and it is the one piece here
-- that the client filter does not have: Cyrillic а е о р с у х і ј ѕ and Greek
-- ο ε α ρ ι κ are pixel-identical to their Latin twins in every font a browser
-- will pick. "fuсk" with a Cyrillic с sails through a naive match and renders
-- exactly like the real thing. Only the unambiguous lookalikes are mapped —
-- н→h, в→b and friends are left alone, because folding those would start
-- mangling genuine Cyrillic names into accidental matches.
create or replace function public.handle_fold(raw text)
returns text
language sql
immutable
strict
parallel safe
set search_path = ''
as $$
  select translate(
           translate(
             replace(replace(replace(replace(lower(raw),
               'ß', 'ss'), 'æ', 'ae'), 'œ', 'oe'), 'þ', 'th'),
             -- accented letters …
             'áàâäãåāăąéèêëēĕėęěíìîïĩīĭįıóòôöõøōŏőúùûüũūŭůűųñńņňçćĉċčýÿŷšśŝşșžźżťţțďđłĺľğĝġģřŕķŵ',
             -- … and their plain forms, one for one.
             'aaaaaaaaaeeeeeeeeeiiiiiiiiiooooooooouuuuuuuuuunnnncccccyyyssssszzztttddlllggggrrkw'),
           -- Cyrillic and Greek lookalikes …
           'аеорсухіјѕοεαριк',
           -- … and the Latin letters they impersonate.
           'aeopcyxijsoeapik')
$$;

comment on function public.handle_fold(text) is
  'Lowercase + accent/homoglyph fold. Shared by the handle guard and the sweep query.';

-- Reduce a folded string to bare letters.
--
-- Both readings are taken because they catch different evasions, exactly as the
-- client filter does: with leet folding "sh1t" becomes "shit", and without it
-- the digits in "f1u1c1k" simply drop out and leave "fuck". Everything that is
-- not a letter — space, dot, dash, underscore, digit, punctuation — disappears,
-- so "n_i_g_g_a" and "n.i.g.g.a" collapse onto the plain spelling.
create or replace function public.handle_letters(folded text, leet boolean)
returns text
language sql
immutable
strict
parallel safe
set search_path = ''
as $$
  select regexp_replace(
           case when leet
                then translate(folded, '013457@$!|+', 'oieastasiit')
                else folded
           end,
           '[^a-z]', '', 'g')
$$;

-- 'ass' -> 'a+s+s+'. Tolerates padded repeats ("aaassss") without having to
-- shorten the term, which is the trick handle-filter.ts uses. Safe to build a
-- pattern this way only because every term in the lists below is bare letters:
-- there is no metacharacter to escape.
create or replace function public.handle_stretch(word text)
returns text
language sql
immutable
strict
parallel safe
set search_path = ''
as $$
  select regexp_replace(word, '(.)', '\1+', 'g')
$$;

-- What actually gets stored: invisible characters removed, whitespace runs
-- collapsed, ends trimmed. Matches the client's `name.replace(/\s+/g,' ').trim()`
-- so the same input stores the same way whichever path it arrived by.
--
-- The invisible set is not about matching — the matcher throws away everything
-- that is not a letter anyway — it is about display. A zero-width joiner or a
-- U+202E right-to-left override in a handle does not read as a rude word, it
-- reverses the rest of the leaderboard row.
create or replace function public.handle_clean(raw text)
returns text
language sql
immutable
strict
parallel safe
set search_path = ''
as $$
  select btrim(
           regexp_replace(
             regexp_replace(
               raw,
               '[\u0000-\u001f\u007f-\u009f\u00ad\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]',
               '', 'g'),
             '\s+', ' ', 'g'))
$$;


-- ── the word lists ─────────────────────────────────────────────────────────

-- True if a handle is one this site will not host.
--
-- The shape is lifted from handle-filter.ts because that file has already lost
-- and won the Scunthorpe argument once:
--
--   1. a few compounds are tested against the RAW letters, because they are
--      insults whose second half is an innocent word that would otherwise be
--      whitened out from under them ("dumbass" -> blank out "bass" -> nothing
--      left to match);
--   2. every innocent word is then blanked out, longest first so "midnight" is
--      consumed before "night" can nibble at it, and the replacement is a SPACE
--      rather than nothing — banned patterns contain no spaces, so a blanked
--      word acts as a wall instead of gluing its neighbours into a match that
--      was never in the text;
--   3. the banned list is tested against what is left.
--
-- WHAT IS DELIBERATELY NOT HERE, and why. These are all in the client list and
-- all left out of this one, because each is a substring of ordinary names and
-- the whitelist is the only thing standing between them and a false positive —
-- which is a bet worth taking in a dialog box that says "pick another", and not
-- worth taking in a database error nobody can see:
--
--   ass, arse   the Scunthorpe magnet itself. Every -ass- compound that is
--               genuinely an insult is in the strict list above instead, so
--               "dumbass" is still refused while "Cassandra" and "GlassMachine"
--               are not resting on a whitelist entry to survive.
--   dick, cock  Dick, Dickens, Hancock, Woodcock, Cocker, and cocktail.
--   nig         König, Niger, Nigel. The list uses 'nigg' instead, which still
--               catches every spelling of the slur that doubles the g — which
--               is all of them — and cannot reach a real surname.
--   jap, negro  Japan, Montenegro, Rio Negro, negroni.
--   milf        Milford, Milfield.
--   clit        Clitheroe.
--   anus, anal  Anusha, Analeigh, and the whole -analy- family.
--   fag, homo,  Fagundes, Faggioli, Dyke as a surname and a landform,
--   dyke        homogeneous, Homolka.
--   piss, turd, mild, and each one lives inside something ordinary
--   thot, tits  (Pissarro, Saturday, Thoth, Titsworth).
--   admin,      the client's staff-impersonation check. "Badminton" contains
--   owner       "admin" and "Downer" contains "owner". A player pretending to
--               be staff is a nuisance, not a slur — and now deletable.
--
-- If you add a term: add it here only if there is no English word, surname or
-- place name that contains it, or if the innocent list below already covers the
-- ones there are. Then run the test at the bottom of this file.
create or replace function public.handle_is_abusive(raw text)
returns boolean
language plpgsql
immutable
strict
parallel safe
set search_path = ''
as $$
declare
  -- Tested against the unscrubbed letters. Every one is a compound with no
  -- innocent reading, so no whitelist can shield it.
  strict_terms constant text[] := array[
    'asshole', 'arsehole', 'asswipe', 'asshat', 'assclown', 'assface',
    'assmunch', 'asslick', 'asskiss', 'dumbass', 'dumass', 'fatass',
    'jackass', 'smartass', 'lardass', 'tightass', 'hardass', 'wiseass',
    'kissass', 'bullshit', 'motherfuck', 'fuckyou', 'fuckoff', 'nignog',
    'dickhead', 'dickface', 'dickwad', 'cockhead', 'cocksuck', 'shithead'
  ];

  -- Tested after the innocent words have been blanked out.
  banned_terms constant text[] := array[
    -- profanity
    'fuck', 'fuk', 'fck', 'phuck', 'shit', 'shite', 'cunt', 'bitch',
    'bastard', 'wank', 'twat', 'bollock', 'bellend',
    -- sexual
    'pussy', 'penis', 'vagina', 'whore', 'slut', 'jizz', 'cumshot',
    'cumslut', 'blowjob', 'handjob', 'rimjob', 'dildo', 'buttplug',
    'ballsack', 'nutsack', 'bukkake', 'porn', 'smegma', 'shemale',
    'ladyboy', 'gangbang',
    -- racial slurs
    'nigg', 'nigger', 'nigga', 'kike', 'kyke', 'spic', 'chink', 'gook',
    'wetback', 'beaner', 'coon', 'paki', 'raghead', 'towelhead', 'kaffir',
    'chinaman', 'darkie', 'darky',
    -- homophobic / transphobic slurs
    'faggot', 'fagot', 'poofter', 'tranny', 'trannie', 'battyboy',
    -- ableist slurs
    'retard', 'mongoloid', 'spastic',
    -- hate figures and groups
    'nazi', 'hitler', 'kkk', 'klux',
    -- violent / abusive
    'rape', 'rapist', 'molest', 'pedo', 'paedo', 'killyourself', 'killurself'
  ];

  -- handle-filter.ts's INNOCENT list verbatim, plus the extras marked below.
  -- Copied wholesale rather than trimmed to the terms still banned here: it
  -- costs nothing to blank a word nobody is looking for, and the day someone
  -- adds 'ass' back to the list above, the protection is already in place.
  --
  -- A missing entry here is a false positive on somebody's real name, so this
  -- list errs heavily towards adding words — including ones the repeat-tolerant
  -- patterns only reach through a doubled letter ("rapper" via `rape`, "Speedo"
  -- via `pedo`, "Shiite" via `shite`, "Saturday" via `turd`).
  innocent_terms constant text[] := array[
    -- -ass-
    'assassin', 'assassinate', 'assist', 'assign', 'assess', 'asset', 'assemble',
    'assembly', 'assert', 'assume', 'assure', 'associate', 'assort', 'assault',
    'assay', 'assuage', 'assiduous', 'assimilate', 'ambassador', 'assange',
    'assyria', 'assam', 'class', 'classic', 'glass', 'grass', 'brass', 'crass',
    'wrasse', 'bass', 'mass', 'pass', 'lass', 'sass', 'cass', 'hass', 'nass',
    'wass', 'morass', 'harass', 'carcass', 'jurassic', 'potassium', 'compass',
    'embassy', 'chassis', 'tassel', 'vassal', 'picasso', 'sassafras',
    'massachusetts', 'renaissance',
    -- -arse-
    'parse', 'sparse', 'coarse', 'hoarse', 'arsenal', 'arsenic', 'marseille',
    'marsh', 'varsity',
    -- -cunt-
    'scunthorpe', 'viscount', 'account', 'countable',
    -- -shit- / -shite-
    'shiitake', 'shitake', 'matsushita', 'mishit', 'shiite', 'ashito',
    -- -dick- / -cock-
    'dickens', 'dickinson', 'dickerson', 'dickson', 'dicky', 'benedick',
    'cocktail', 'cockpit', 'cockney', 'cockroach', 'cocker', 'cockatoo',
    'peacock', 'hancock', 'babcock', 'hitchcock', 'woodcock', 'shuttlecock',
    'stopcock', 'weathercock', 'cockle',
    -- -penis- / -anus- / -anal-
    'penistone', 'happiness', 'openness', 'uranus', 'janus', 'manus',
    'manuscript', 'vanuatu', 'analy', 'analog', 'canal', 'banal', 'canaletto',
    'annal',
    -- -nig-
    'night', 'nightly', 'nightmare', 'nightingale', 'midnight', 'tonight',
    'knight', 'nigh', 'nigel', 'nigella', 'nigeria', 'nigerien', 'benign',
    'niggle', 'nigiri', 'finnigan', 'hannigan', 'flanigan', 'brannigan',
    'branigan', 'dunnigan', 'lanigan', 'kernighan',
    -- -spic- / -chink- / -coon- / -paki- / -jap- / -wog- / -negro-
    'spice', 'spicy', 'spicer', 'suspicion', 'suspicious', 'auspice',
    'auspicious', 'conspicuous', 'despicable', 'hospice', 'chinkapin', 'raccoon',
    'racoon', 'cocoon', 'tycoon', 'coonhound', 'pakistan', 'japan', 'japanese',
    'jape', 'wogan', 'montenegro', 'negroni', 'negros',
    -- -fag- / -dyke- / -homo-
    'fagin', 'fagan', 'fagus', 'vandyke', 'dykstra', 'homogen', 'homonym',
    'homophone', 'homograph', 'homolog', 'homosapien', 'homosexual',
    -- -rape- / -rapist- / -pedo-
    'grape', 'grapefruit', 'drape', 'scrape', 'therapist', 'therapy', 'trapeze',
    'rapeseed', 'rapper', 'wrapper', 'trapper', 'strapper', 'rappel', 'rapping',
    'wrapping', 'trapping', 'strapping', 'rapped', 'wrapped', 'trapped',
    'strapped', 'torpedo', 'pedometer', 'speedo',
    -- -piss- / -turd- / -clit- / -nazi- / -retard- / -thot- / -fuk-
    'pissarro', 'saturday', 'sturdy', 'heraclitus', 'nazir', 'nazim',
    'retardant', 'thoth', 'fuku', 'titsworth',
    -- -sex- adjacent place names, kept safe in case the list ever grows
    'sussex', 'essex', 'middlesex', 'wessex', 'unisex', 'sexton', 'sextant',
    -- Extras beyond the client list. Adding here can only ever make the
    -- database MORE permissive than the client, which is the direction the
    -- invariant at the top of this file allows.
    --
    -- Most of these are not guesses: every word in /usr/share/dict was run
    -- through the guard, and these are the ordinary English words it caught.
    -- "whittler" via `hitler`, "saltwater" and "wristwatch" via `twat`,
    -- "parapet" and "therapeutic" via `rape`, "snazzier" via `nazi`, "aspic"
    -- and "perspicacious" via `spic`, "Laocoon" via `coon`, "swanky" via
    -- `wank`, "niggardly" and "niggling" via `nigg`. Not one of them would ever
    -- have occurred to anybody sitting down to write a word list, which is the
    -- argument for re-running that test after any edit — see the bottom of this
    -- file.
    'whittle', 'saltwater', 'watch', 'parapet', 'therapeutic', 'trapezoid',
    'trappist', 'snazz', 'laocoon', 'aspic', 'spica', 'spici', 'perspicac',
    'perspicu', 'despicabl', 'crape', 'sarape', 'serape', 'frappe',
    'gobbledygook', 'gobbledegook', 'niggard', 'niggling', 'snigger', 'swank',
    'pussycat', 'pussyfoot', 'witwatersrand',
    -- Names and places, same reasoning, from outside the dictionary.
    'nazia', 'nazareth', 'nazarene', 'nazca', 'cooney', 'coonan', 'wankel',
    'fukui', 'fukuoka', 'fukushima', 'coonawarra'
  ];

  folded  text;
  forms   text[];
  form    text;
  hits    text[];
  term    text;
  scrubbed text;
  ordered text[];
begin
  folded := public.handle_fold(raw);

  forms := array[public.handle_letters(folded, true)];
  -- The no-leet reading only differs when the handle has digits or symbols in
  -- it; skip the second pass otherwise. Most handles do not.
  if public.handle_letters(folded, false) <> forms[1] then
    forms := forms || public.handle_letters(folded, false);
  end if;

  -- Longest first, so "midnight" is blanked before "night" gets at it.
  select array_agg(t order by length(t) desc, t)
    into ordered
    from unnest(innocent_terms) as t;

  foreach form in array forms loop
    continue when form = '';

    foreach term in array strict_terms loop
      if form ~ public.handle_stretch(term) then
        return true;
      end if;
    end loop;

    -- Which banned terms are present BEFORE any whitening. Scrubbing only ever
    -- replaces letters with a space, and no banned pattern contains a space, so
    -- a match in the scrubbed text is always a match in the unscrubbed text at
    -- the same place. A term that misses here cannot appear later, which means
    -- an ordinary handle costs three regex passes and no scrubbing at all.
    select array_agg(t)
      into hits
      from unnest(banned_terms) as t
      where form ~ public.handle_stretch(t);

    continue when hits is null;

    scrubbed := form;
    foreach term in array ordered loop
      scrubbed := regexp_replace(scrubbed, public.handle_stretch(term), ' ', 'g');
    end loop;

    foreach term in array hits loop
      if scrubbed ~ public.handle_stretch(term) then
        return true;
      end if;
    end loop;
  end loop;

  return false;
end;
$$;

comment on function public.handle_is_abusive(text) is
  'Coarse server-side backstop for leaderboard handles. See 0005_handle_guard.sql.';


-- ── the guard itself ───────────────────────────────────────────────────────

-- Structural rules, as a CHECK, because these two really are immutable.
--
-- 0001 already bounded the length; this restates it over the TRIMMED handle, so
-- '                    ' — twenty characters, passes 0001, renders as a blank
-- row on the board — is refused, along with the empty string. Added NOT VALID
-- so it applies to every future write without validating the rows already
-- there: the constraint is a guard, not a verdict on history, and a migration
-- that refuses to apply because of the very rows it was written to deal with is
-- no use to anybody. The sweep query at the bottom finds those.
alter table public.scores
  drop constraint if exists scores_handle_clean;

alter table public.scores
  add constraint scores_handle_clean
  check (char_length(btrim(handle)) between 1 and 20)
  not valid;

-- If the table is clean, promote it to a fully validated constraint. Wrapped so
-- that a table which is NOT clean leaves the constraint in place as NOT VALID —
-- still enforced on writes — rather than aborting the migration.
do $$
begin
  alter table public.scores validate constraint scores_handle_clean;
  raise notice 'scores_handle_clean validated: no existing handle is blank or over-long.';
exception when check_violation then
  raise notice 'scores_handle_clean left NOT VALID: some existing handles are blank or over-long. It still applies to every new write. See the sweep query in 0005_handle_guard.sql.';
end;
$$;

-- And the word guard.
--
-- BEFORE INSERT OR UPDATE OF handle: there is no UPDATE policy on this table so
-- the update arm is unreachable from a client today, but it costs nothing and
-- means a future policy, or a hand-written UPDATE in the dashboard, cannot walk
-- a slur in past the insert check.
--
-- The trigger normalises before it judges, so what is judged is what is stored.
--
-- SQLSTATE 23514 (check_violation) rather than the default P0001: it is the
-- truthful code, and PostgREST maps it to a 400 with the message below. The
-- message says what is wrong and nothing about how — no sense handing back a
-- tuning signal for the next attempt.
create or replace function public.scores_handle_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.handle := public.handle_clean(new.handle);

  if new.handle is null or new.handle = '' then
    raise exception 'handle must not be empty'
      using errcode = 'check_violation';
  end if;

  if char_length(new.handle) > 20 then
    raise exception 'handle must be 20 characters or fewer'
      using errcode = 'check_violation';
  end if;

  if public.handle_is_abusive(new.handle) then
    raise exception 'that handle is not allowed on a public leaderboard'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists scores_handle_guard on public.scores;
create trigger scores_handle_guard
  before insert or update of handle on public.scores
  for each row
  execute function public.scores_handle_guard();


-- ── moderator takedown ─────────────────────────────────────────────────────

-- 0001's "deliberately no UPDATE or DELETE policy" stands for players, and this
-- does not soften it: there is still no UPDATE policy at all, and no player can
-- delete anything, their own rows included. A posted score is still immutable.
-- What changes is that a moderator can remove one.
--
-- The predicate is the same one 0004 uses on `hidden_items`, character for
-- character, and for the same reasons — worth repeating them here because this
-- policy deletes rows rather than adding them:
--
--   `auth.jwt() ->> 'email'` is a TOP-LEVEL claim, written by GoTrue from
--   `auth.users.email`, which the identity provider set at sign-in. The end
--   user cannot write to it.
--
--   It is deliberately NOT `auth.jwt() -> 'user_metadata' ->> 'email'`. That
--   one is user-editable — any client can call `updateUser({ data: { email:
--   ... } })` and set it to anything at all. A policy trusting it would let
--   anyone delete the entire leaderboard. Supabase's linter flags it as an
--   ERROR (0015_rls_references_user_metadata). Do not "simplify" into it.
--
--   It is also not `auth.role()`, which only says "this request carries some
--   valid token" — and every anonymous player has one of those.
--
--   Anonymous sessions have no email claim: `auth.jwt() ->> 'email'` is null or
--   '', `nullif` turns '' into null, `m.email = null` is null, never true. The
--   check fails closed for them rather than erroring.
--
--   `(select auth.jwt())` rather than a bare call so Postgres evaluates it once
--   per statement instead of once per row — which matters more here than in
--   0004, since a DELETE ... WHERE game_slug = ... tests this per candidate row.
--
--   And as in 0004 this leans on `moderators` being readable to its owner: the
--   subquery runs as `authenticated`, the moderators SELECT policy applies to
--   it, and the row it looks for is exactly the row that policy exposes.
drop policy if exists "moderators remove scores" on public.scores;
create policy "moderators remove scores"
  on public.scores
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.moderators m
      where m.email = lower(nullif((select auth.jwt() ->> 'email'), ''))
    )
  );

-- RLS decides which rows; the grant decides whether the Data API exposes the
-- verb at all. Without this, PostgREST answers a moderator's DELETE with 42501.
--
-- Note the shape of the failure for everyone else, because it is worth knowing
-- when reading `removeScores()` in src/lib/moderation.ts: a non-moderator now
-- has the privilege but not the policy, so their DELETE is not an error — it
-- matches zero rows and returns success. That is why the client asks for the
-- deleted rows back and counts them instead of trusting the absence of an
-- error.
grant delete on public.scores to authenticated;


-- ── cleaning up what is already there ──────────────────────────────────────
--
-- The trigger guards new writes; these find the rows that predate it. Run them
-- in the SQL editor, which bypasses RLS as the table owner.
--
--   -- what would the guard have refused?
--   select id, game_slug, handle, created_at
--   from public.scores
--   where public.handle_is_abusive(handle)
--      or char_length(btrim(handle)) not between 1 and 20
--   order by created_at desc;
--
--   -- remove them
--   delete from public.scores
--   where public.handle_is_abusive(handle)
--      or char_length(btrim(handle)) not between 1 and 20;
--
--   -- and once the table is clean, if you want the CHECK fully validated:
--   alter table public.scores validate constraint scores_handle_clean;
--
-- A quick sanity check on the lists themselves — the first must return true for
-- every row, the second must return no rows at all:
--
--   select bool_and(public.handle_is_abusive(w)) from unnest(array[
--     'fuck','sh1t','n1gg3r','f.u.c.k','Cunt','FaGgOt','dumbass','Hitler'
--   ]) w;
--
--   select w from unnest(array[
--     'Scunthorpe','Penistone','classic','assassin','cocktail','analysis',
--     'bass','class','glass','grass','Cassandra','Dickens','Hancock','Sussex',
--     'Essex','therapist','Uranus','kilan77','GlassMachine39','Kilan Rougeot',
--     'María López'
--   ]) w where public.handle_is_abusive(w);
--
-- And the test that actually matters if the lists are ever edited, because the
-- false positives are never the ones you would think of. Load a dictionary into
-- a scratch table and look at everything the guard refuses:
--
--   create table words(w text);
--   \copy words from '/usr/share/dict/american-english'
--   select w from words where public.handle_is_abusive(w) order by w;
--
-- Read the whole list. Every ordinary English word in it is a real person who
-- cannot post their name, so it belongs in `innocent_terms` above. Roughly a
-- minute for 75,000 words, which is also a useful figure in itself: the guard
-- costs about 0.9 ms per handle, paid once per score insert.
