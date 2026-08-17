# Guess The Rest

**[guesstherest.com](https://guesstherest.com)**

Thirty guessing games behind one shared mechanic: you start with almost
nothing, and every extra look costs you points.

```bash
npm install
npm run dev      # http://localhost:5173
```

That's the whole setup. **No API keys. No account.** All thirty games work
immediately. Signing in with Google and the global leaderboard are optional
extras that need a Supabase project; without one, scores still save per-device.

---

## The games

| Game | What you get | Ladder |
|---|---|---|
| 🎧 **Guess the Song** | 0.1s of the track | 0.1s → 0.5 → 1.5 → 3 → 5s |
| 🎬 **Guess the Movie** | 1 second of trailer footage | 1s → 2 → 4 → 8 → 15s |
| 🧩 **Guess by Emoji** | a rebus, in your chosen category | 2 emoji → +1 → +1 → written clue |
| 🔍 **Guess the Object** | an everyday thing at 11× | 11× → 6.5 → 3.8 → 2.2 → 1.4× |
| 🦋 **Guess the Animal** | one patch of coat or feather at 14× | 14× → 8 → 4.5 → 2.6 → 1.5× |
| 🗿 **Guess the Landmark** | a patch of stone at 12× | 12× → 7 → 4 → 2.4 → 1.4× |
| 💿 **Guess the Album** | cover blurred to mush | five sharpening steps |
| 🎭 **Guess the Celebrity** | a face out of focus | three sharpening steps |
| 🕹️ **Guess the Video Game** | box art behind tiles | 2 → 6 → 13 → 24 → 36 tiles |
| 🍜 **Guess the Dish** | a plate at 4.2× | 4.2× → 2.4 → 1.5 → full plate |
| 💬 **Guess Who Said It** | a real quote, four faces | field → role → initials |
| 🎞️ **Guess the Film Line** | a line of dialogue | decade → setting → who says it |
| 📖 **Guess the Opening Line** | a novel's first sentence | decade → about it → author |
| 📅 **Guess the Year** | name a film's release year | description → decade → 5-year window |
| 🌍 **Guess the Capital** | a country, four cities | region → clue → first letter |
| 🌐 **Guess the Country** | a street you can look around | continent → clue → first letter |
| 🌆 **Guess the City** | a skyline at 10× | 10× → 6 → 3.6 → 2.2 → 1.3× |
| 🗺️ **Guess the Outline** | 3 windows onto a map | 3 → 7 → 12 → 18 → 24 windows |
| 🎲 **Guess the Board Game** | box art behind windows | 2 → 6 → 13 → 24 → 36 windows |
| 🚗 **Guess the Car** | a shape behind frosted glass | five sharpening steps |
| 🪐 **Guess the Planet** | a patch of somewhere else | 9× → 5.5 → 3.4 → 2.1 → 1.3× |
| 🏅 **Guess the Sport** | the action at 12× | 12× → 7 → 4 → 2.4 → 1.4× |
| 🎬 **Guess the Plot** | a film summarised badly | decade → genre → clue |
| 📣 **Guess the Slogan** | an advertising line | sector → era → clue |
| 🗣️ **Guess the Language** | a sentence in its own script | script → family → where |
| 📱 **Guess the App** | an icon at 7× | 7× → 4.5 → 3 → 2 → 1.3× |
| ✳️ **Guess the Logo** | 2 windows onto a brand mark | 2 → 5 → 9 → 14 → 20 windows |

**Scoring** is shared by all thirty. A round is worth 1000 points at the top of the
ladder and decays ~38% per rung, plus a speed bonus that tapers over 20 seconds
and a streak multiplier up to 2×. A wrong guess costs a rung, exactly like a
skip — so guessing early is a real gamble, not a free roll. Guess the Year pays
partial credit: one year off is 60%, two 35%, three 15%.

**Keyboard.** **Space** plays or replays the clip, **R** buys the next rung,
**S** abandons the round for zero, **Enter** moves on. In search games the
shortcuts stay out of the way while you are typing — **Esc** leaves the box and
hands them back. Space falls back to *reveal more* in games that have no player.

Seven games need no network at all — **Emoji**, **Film Line**, **Opening Line**,
**Plot**, **Slogan**, **Language** and **Capital** — and **Guess the Object** falls back to zooming
into an emoji when Wikipedia is unreachable.

---

## Optional: sign-in and global leaderboards

Both come from one Supabase project. Skip this and everything still works —
leaderboards just say "This device" instead of "Global".

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/0001_leaderboards.sql` in the SQL editor.
3. **Authentication → Sign In / Providers**: enable **Anonymous sign-ins** (so
   players who don't sign in can still post scores) and **Google** (paste a
   Google OAuth client id/secret, and add the Supabase callback URL to that
   client's authorised redirect URIs).
4. Paste the project URL and anon key into the in-app Settings, or `.env.local`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Signing in is never required. It buys you a name that follows you between
browsers and a **Jump back in** row of your recent games; that row is
deliberately hidden when signed out, because device history and account history
aren't the same thing.

---

## How it's put together

```
src/
  engine/
    types.ts       GameDef — what a game must provide
    session.ts     rounds, rungs, scoring, streaks, submission
    warm.ts        pre-loads a deck when you hover its card
  games/
    index.ts       the registry; add a game here and it appears on the home page
    stages.tsx     Zoom / Blur / Tile / Text stages, shared across the set
    song.tsx …     one file per game: a GameDef plus its Stage component
  content/
    itunes.ts      song + album lookups (token-bucketed)
    wikipedia.ts   posters, object photos, paintings, portraits
    deck.ts        builds exactly as many rounds as a game needs
    cache.ts       localStorage-backed API cache
    data/          the curated, validated seed lists
  lib/
    auth.ts        optional Google sign-in
    history.ts     recently played + trending
    audio.ts       Web Audio snippet playback
    ratelimit.ts   token bucket
    leaderboard.ts Supabase with a localStorage mirror
  ui/
    Home.tsx       nav, search, trending, grid
    CardArt.tsx    per-game SVG cover art
    GameScreen.tsx the play surface
```

### Adding a game

Write one file exporting a `GameDef`, add it to `src/games/index.ts`, and add an
art panel in `CardArt.tsx`. The engine gives you rounds, the reveal ladder,
scoring, streaks, prefetching, the leaderboard and the three guess widgets
(`search`, `choice`, `year`) for free.

---

## Notes from building it

**Street View without an API key.** Guess the Country uses Google's iframe
embed, which needs no key but only renders when it really is inside an iframe.
Two things needed handling: the embed prints the place name in its top-left
corner, which is the answer, so that corner is covered — and Google's logo,
Terms link and imagery attribution along the bottom are deliberately left
untouched, because covering the place label is fine and hiding attribution is
not.

**Blur is the wrong way to hide a flag.** The poster game reveals sharp windows
into a blurred image, which suits artwork. Applying the same treatment to flags
made them trivial: blur preserves the colour layout perfectly, and the colour
layout *is* the flag. `TileStage` grew a `conceal` mode so flags and country
outlines hide behind solid backing instead.

**The theme is light and green on purpose.** An earlier version was the usual
dark-mode-with-neon-accents, which is the default look of anything generated
rather than designed. It is now paper on warm off-white with a deep forest bar,
and the per-game accents were retuned from neon to jewel tones so they hold up
against white.

**Why Web Audio and not `<audio>`.** The song game hinges on 100ms being exactly
100ms. `currentTime` seeking and `pause()` scheduling both jitter by tens of
milliseconds — most of the clip. Previews are fetched, decoded and played
through Web Audio, where start and stop are sample-accurate, with ~12ms of fade
on each end to kill the click.

**iTunes rate-limits, and lies about it.** Exceed it and the API answers 403
*without* CORS headers, so the browser rejects the fetch and the status is
unreadable — from JavaScript it's indistinguishable from being offline. Requests
now go through a token bucket (14 burst, 18/min) rather than a fixed delay: a
flat 500ms gap made a ten-round deck take ten seconds while still only using ten
of the minute's allowance — all of the waiting, none of the protection.

**The content is verified, not assumed.** Every seed list was checked against
the live APIs, and the checks kept finding things:

- 19 of 109 albums didn't exist. Dark Side of the Moon, Nevermind, Dookie,
  Blonde, The Chronic — the Search API indexes the iTunes *Store*, and those
  aren't sold there anymore, so a search returns only lullaby covers and piano
  tributes. Removed.
- 30 of 117 candidate films failed: mostly YouTube trailer ids that no longer
  play, which would have looked like a broken game rather than bad data.
- 3 of 227 Wikipedia pages were wrong — `Battery` is a disambiguation page,
  `Ophelia (painting)` too, and `Nighthawks` needed a different title.

**Why the poster game uses tiles.** It was originally a deep zoom like the object
and painting games. But Wikipedia's fair-use film posters are only ~220px wide,
and magnifying those 13× is unreadable mush. Tiles work at any resolution — and
read as a game rather than an effect.

**Wikipedia serves only pre-rendered thumbnail widths.** Probing one file,
250/330/500/1280/1920/3840 returned images and every other width returned HTTP
400. Stage images request 1280 (about a fifth of the bytes of the 3840px
original) and fall back to the original for any file that width isn't cached for.

**Decks stream instead of blocking.** Waiting for all ten rounds before showing
round one was the single biggest source of "dealing a fresh deck…" — the quote
game did forty Wikipedia lookups before anything appeared. Games now start on
round one and load the rest behind it. Measured on the production build, time to
first round went from 3–20s to 0.1–0.9s across all nineteen.

**Percent-encoded seed titles were silently killing rounds.** Pasting a title
straight from a Wikipedia URL gives you `Caf%C3%A9_Terrace_at_Night`; encoding
that again produces `%25C3%25A9`, which the API answers with 403, and the loader
quietly dropped the round. Sixteen seeds were affected. The data is now stored
decoded and `wikipedia.ts` decodes before encoding, so both spellings work.

**Loading starts before you click.** Hovering a card is a strong signal you're
about to play it, so that's when the deck starts building. The warmed deck is
claimed exactly once — playing again builds a fresh one, or you'd get the same
ten rounds every time. Within a game, the next round's media is fetched while
the current one is on screen.

**No canvas anywhere.** Every zoom, blur and tile effect is a CSS `transform` or
`filter`. That sidesteps cross-origin canvas tainting entirely and animates on
the compositor for free.

**The quotes are checked.** Every attribution in `data/quotes.ts` is one that
holds up — no "insanity is doing the same thing twice" Einstein, no "first they
ignore you" Gandhi, no invented Marilyn Monroe. A quiz that teaches
misattributions would be worse than no quiz.

**Trailers get a shield.** The scene game covers the YouTube iframe whenever it
isn't actively playing. A paused frame would hand over more of the film than the
player paid for, and the shield also hides YouTube's title bar, which would
simply print the answer.

---

## Deploying

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`. `npm run build` runs `tsc` first, so a type error
fails the deploy instead of shipping a broken bundle.

For the custom domain, `public/CNAME` pins `guesstherest.com`. On the DNS side
(GoDaddy), point the apex at GitHub Pages:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  kilan777.github.io
```

Then in the repo: **Settings → Pages → Source: GitHub Actions**, and tick
*Enforce HTTPS* once the certificate is issued (it can take up to an hour).

### Seeded leaderboard scores

`supabase/seed/leaderboard_seed.sql` fills every board with plausible scores so
a new visitor doesn't meet an empty table. It needs migration
`0002_seeded_scores.sql` first, which drops the `auth.users` foreign key (a fake
player has no auth account) and adds a `bot` column.

It cannot be run from the browser: the RLS insert policy ties every client
insert to the caller's own `auth.uid()` and forbids `bot = true`, which is
precisely what stops a player fabricating their own scores. Seeding is an admin
action and happens in the SQL editor.

Regenerate with `node scripts/seed-leaderboards.mjs`. Remove them all with
`delete from public.scores where bot;`. Because they're flagged rather than
indistinguishable, you can also filter or label them later.

### Ads

AdSense runs in auto-ads mode: `src/ui/AdSlot.tsx` injects the loader with the
publisher id, and Google chooses placements. It is deliberately skipped in dev
and in headless browsers, so local runs and screenshot tests never load a
tracker. `public/ads.txt` carries the publisher record AdSense requires before
it will serve.

If you later create named ad units, `<AdSlot slot="…" />` renders one; without a
slot id it renders nothing rather than emitting an empty `<ins>`.

Note that AdSense approval requires a live site with real content, and Google
reviews the domain after you add it — the code being in place doesn't mean ads
appear straight away.

---

## Content sources

Nothing is redistributed. Audio previews come from the iTunes Search API,
trailers are embedded from YouTube, and posters, photographs and paintings are
loaded from Wikipedia at runtime. The repo contains only titles, artist names,
emoji, quotations and article ids.

One thing worth knowing: the film posters are the low-resolution **non-free**
files Wikipedia hosts under fair use. Using them in a quiz is the same shape of
use, but it is fair use rather than a licence. If this were ever deployed
commercially, that's the piece to revisit — TMDB is the properly licensed route,
at the cost of requiring an API key.

The only thing stored about a player is the name they pick.
