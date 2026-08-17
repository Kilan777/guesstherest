import type { Article } from './types';

/**
 * The site-level pages: the shared rules, the points system, what this is and
 * where the material comes from.
 *
 * Numbers here are read out of `src/lib/scoring.ts`, the game metadata and the
 * seed files rather than remembered. If the curve changes, this changes.
 */
export const GUIDES: Article[] = [
  {
    path: 'how-to-play',
    title: 'How to play',
    description:
      'One mechanic runs all 31 games: you start with almost nothing, and every extra look costs points. Here is exactly how that works.',
    intro: [
      "Every game here is built on the same idea. A round opens with the least information it can give you — a tenth of a second of audio, two tiles of forty-eight, a patch of feathers at five times magnification — and you answer from that if you can. If you cannot, you buy a better look, and the round is worth less when you win it.",
      "Nothing here needs an account. Open a game and play it; scores save to the device you are on. Signing in with Google is available and buys you two specific things, described at the bottom of this page.",
    ],
    sections: [
      {
        heading: 'The reveal ladder',
        body: [
          "Each game has a ladder of three to five rungs, and the labels tell you what each one gives: 0.1s, 0.5s, 1.5s, 3s, 5s in the song game; 2, 6, 13, 24 and 36 tiles in the video game deck; Cold, Decade, Setting, Who says it in the film-line game. The button that buys the next rung is labelled with the verb that fits — Zoom out, Hear more, Sharpen, Open more, Give me a clue — and it always shows what it will cost you in points before you press it.",
          "Rungs only go one way. There is no way back up the ladder, and no way to see less of a picture once you have seen more of it.",
          "Running off the bottom of the ladder ends the round at zero. So does pressing Skip round, which exists for the rounds you know you are not going to get and would rather not spend thirty seconds proving it.",
        ],
      },
      {
        heading: 'A wrong guess costs a rung',
        body: [
          "This is the rule that makes the whole thing a game rather than a quiz. Guessing wrong does exactly what buying a rung does: it drops you one step down the ladder and one step down the points. It does not end the round, and it does not cost you anything extra.",
          "Which means an early guess is a real bet rather than a free roll. In the games with a searchable answer list — most of them — the cheap move is to type a candidate into the box and read what comes back without submitting it, because seeing which options exist is free and submitting the wrong one is not.",
          "In the four-option games, the arithmetic runs the other way. A cold guess with four buttons wins outright a quarter of the time, and losing still leaves you on the next rung with three options left, so guessing before you buy is defensible.",
        ],
      },
      {
        heading: 'Three ways of answering',
        body: [
          "Search. A text box against the game's full answer list — every animal, every brand, every word. The list is deliberately not narrowed to the rounds in your deck, because a short list is a large hint.",
          "Choice. Four buttons, used by the capital, language and quote games. The three wrong answers are always drawn from the same family as the right one: capitals from the same region, languages from the same family, people from the same field. Mixing them would give the answer away by process of elimination.",
          "Year. A picker for the release-year game, which is also the only game that pays partial credit — one year off is worth 60 per cent, two years 35, three years 15.",
        ],
      },
      {
        heading: 'Streaks, speed and the clock',
        body: [
          "Consecutive correct rounds build a streak multiplier, worth a tenth more per round up to double at ten in a row. It resets to nothing the moment you lose a round, which is why abandoning a hopeless round early is sometimes worse than the zero suggests — the zero is not the expensive part, the broken streak is.",
          "Answering quickly is worth up to 160 points, tapering to nothing over twenty seconds. That is a bonus rather than a pressure: it is worth roughly two thirds of the last rung, so thinking for another ten seconds is nearly always cheaper than guessing wrong.",
          "One game has a clock. Guess the Country gives you thirty seconds per round, because looking around a street is the game and without a limit you could stand there all day. The clock does not reset when you buy a clue — otherwise a skip would be a way to buy time as well as information.",
        ],
      },
      {
        heading: 'Keyboard',
        body: [
          "Space plays or replays the clip, and falls back to revealing more in games that have nothing to play. R buys the next rung. S abandons the round for zero. Enter moves on once a round is over.",
          "In the search games those shortcuts stay out of the way while you are typing, because R and S are letters. Escape leaves the search box and hands the shortcuts back.",
        ],
      },
      {
        heading: 'Leaderboards, names and signing in',
        body: [
          "Every game has its own board, showing score, rounds won and best streak. Without a Supabase project configured the board says This device and holds your own last fifty runs; with one it says Global and shows everybody's.",
          "You are given a generated name — an adjective, a noun and two digits — which you can change in Settings at any time, up to twenty characters. That name is the only thing stored about a player.",
          "Signing in with Google is optional and never required to play or to post a score. It buys exactly two things: a name that follows you between browsers, and a Jump back in row of your recent games on the home page. That row is deliberately hidden when signed out, because a device's history and an account's history are not the same thing.",
        ],
      },
    ],
  },
  {
    path: 'scoring',
    title: 'How scoring works',
    description:
      'The exact points curve: 1000 at the top of the ladder, about 38 per cent off per rung, up to 160 for speed and a streak multiplier to 2x.',
    intro: [
      "All 31 games share one scoring function, and it is short enough to describe completely. A round is worth 1000 points at the top of its ladder. Each rung you spend multiplies that by 0.62 — a little under 38 per cent off — and the result is rounded to the nearest ten.",
      "On top of the rung value comes a speed bonus, and the total is multiplied by your current streak. That is the whole system.",
    ],
    sections: [
      {
        heading: 'What each rung is worth',
        body: [
          "On a five-rung ladder: 1000, 620, 380, 240, 150. On a four-rung ladder the first four of those. On the two three-rung games — Guess the Celebrity and Guess the Recipe — 1000, 620, 380 and nothing after that.",
          "The curve has a floor of 80 points, so that a last-gasp correct answer is never worth nothing at all. No ladder here is long enough to reach it: the deepest rung in use pays 150, a sixth would pay 90, and it would take a seventh before the floor did any work.",
          "Losing a rung to a wrong guess costs exactly the same as buying one. Two wrong guesses on a five-rung ladder puts a round that opened at 1000 down to 380.",
        ],
      },
      {
        heading: 'The speed bonus',
        body: [
          "Eight points per second of the twenty you did not use, so an instant answer is worth 160 and an answer after twenty seconds is worth nothing extra. It is added to the rung value before the multiplier is applied, so a fast answer on a live streak is worth more than a fast answer at the start of a run.",
          "The clock runs from the start of the round and is not reset by buying a rung. In practice the bonus is small enough that it should never make you guess: 160 points is less than the 380 you give up by dropping one rung on a fresh round.",
        ],
      },
      {
        heading: 'The streak multiplier',
        body: [
          "One tenth per consecutive correct round, capped at ten: your first correct answer is worth 1.0x, the second 1.1x, and from the eleventh onwards 2.0x. Any lost round resets it to zero.",
          "This is the largest single lever in the game. Across a ten-round run the multipliers sum to 14.5 if you win every round, which means the difference between winning nine rounds and winning all ten is much larger than one round's points.",
          "In the release-year game a near-miss still counts as a win for streak purposes, even when the accuracy fraction has cut the points to 15 per cent.",
        ],
      },
      {
        heading: 'Partial credit in the year game',
        body: [
          "Guess the Year is the only game with an accuracy fraction. Exact is 1.0, one year off is 0.6, two years 0.35, three years 0.15, and four or more is a miss — which costs a rung like any other wrong answer.",
          "The fraction multiplies the rung value and the speed bonus together, and the streak multiplier is applied after it. So a one-year miss at the top of the ladder with no bonus is 600 points, which is almost exactly what an exact answer one rung down would have paid.",
        ],
      },
      {
        heading: 'What a good run looks like',
        body: [
          "The theoretical maximum for a ten-round game is 16,820: every round answered instantly on the first rung, with the streak multiplier climbing all the way. For the two eight-round games — Guess the Movie and Guess the Country — it is 12,528.",
          "Nobody scores that. In practice, a run over 6,000 means you were mostly winning on the first two rungs, and a run over 10,000 means you were winning on the first rung and doing it quickly. Anything under 3,000 usually means a streak broke early and never recovered, which is worth more attention than any individual round.",
          "Scores post to that game's leaderboard when the run ends, along with rounds won and best streak, which are shown next to the score because they say something the total does not.",
        ],
      },
    ],
  },
  {
    path: 'about',
    title: 'About Guess The Rest',
    description:
      'Thirty-one guessing games behind one mechanic, built with no API keys and no accounts. What it is, why it exists and how it is put together.',
    intro: [
      "Guess The Rest is a set of 31 guessing games that share a single mechanic: you start with almost nothing, and every extra look costs you points. A tenth of a second of a song. Two tiles of a game cover. A patch of feathers at five times magnification. Name it from that, or pay for more.",
      "It is one website, free, with no account requirement and no app to install. It is also built under a deliberate constraint that shaped almost every game in it.",
    ],
    sections: [
      {
        heading: 'The constraint: no API keys',
        body: [
          "Every game sources its content from a public API that needs no key, no account and no billing relationship. That was chosen at the start and never relaxed, and it is the reason the set looks the way it does.",
          "Audio previews come from the iTunes Search API, which serves 30-second clips to anyone who asks. Photographs, portraits, box art, maps and logos come from Wikipedia's REST summary endpoint. Trailers and theme tunes are YouTube embeds. The street panoramas are Google's keyless Street View iframe, which needs no key but only renders when it really is inside an iframe.",
          "The cost of that constraint is real. It rules out the properly licensed film databases, which is why the poster and cover games use Wikipedia's low-resolution fair-use files and reveal them through tiles rather than by zooming — magnifying a 220-pixel poster thirteen times is unreadable mush. The benefit is that the whole thing runs from a clone with no setup: no keys to obtain, no quota to manage, and nothing that stops working when somebody's free tier expires.",
        ],
      },
      {
        heading: 'The content is verified, not assumed',
        body: [
          "Every seed list was checked against the live APIs before it shipped, and the checks kept finding things. Thirty of 117 candidate films failed, mostly YouTube trailer ids that no longer played — which to a player reads as a broken game rather than as stale data. Three of 227 Wikipedia pages were wrong: two were disambiguation pages and one needed a different title.",
          "For the theme-tune game, 977 candidate uploads were scraped and scored, and the survivors put through two gates: YouTube's keyless oEmbed endpoint, then a real embedded player watched to confirm playback actually advanced, because oEmbed will bless a video whose owner has turned embedding off. Of 165 series researched, 153 made it.",
          "The written decks were held to the same standard for a different reason. The quotations are only ones that hold up — no Einstein insanity line, no invented Marilyn Monroe. The film lines are quoted as they are actually spoken rather than as everyone repeats them. The word definitions are written from scratch and mechanically checked not to contain the word. A quiz that teaches you something false is worse than no quiz.",
        ],
      },
      {
        heading: 'How it is built',
        body: [
          "A single-page app in TypeScript, built with Vite, using the React API compiled against Preact for size. Only game metadata is loaded up front — 31 titles, taglines and accents — so opening one game downloads one game's code rather than all 31.",
          "Every zoom, blur and tile effect is a CSS transform or filter rather than a canvas operation. That sidesteps cross-origin canvas tainting entirely, which matters when every image is loaded from somebody else's domain, and it animates on the compositor for free.",
          "Decks stream rather than block: a game starts on round one and loads the rest behind it. Before that change, the quote game did forty Wikipedia lookups before anything appeared on screen. Time to first round went from between three and twenty seconds to under a second. Hovering a card on the home page starts building its deck, on the reasonable assumption that you are about to click it.",
          "The written pages you are reading, including this one, are generated as real HTML at build time. The app itself is hash-routed, so without them a visitor arriving without JavaScript would see an empty document.",
        ],
      },
      {
        heading: 'Accounts, data and ads',
        body: [
          "No account is needed for anything except a name that follows you between browsers. Scores save to your device by default; a Supabase project, if one is configured, mirrors them to a global board. The only thing stored about a player is the name they pick.",
          "The site runs Google AdSense in auto-ads mode. Ads are deliberately skipped in development and in headless browsers, so local runs and screenshot tests never load a tracker.",
          "Nothing is redistributed. The repository contains titles, artist names, emoji, quotations, ingredient lists and Wikipedia article ids — the media itself is fetched from its source at the moment you play, and credited where its licence requires it.",
        ],
      },
    ],
  },
  {
    path: 'sources',
    title: 'Where the content comes from',
    description:
      'iTunes previews, Wikipedia images, YouTube embeds and Street View iframes — what each game uses, and how the material is handled.',
    intro: [
      "Nothing in these games is hosted here. The repository holds lists — titles, artist names, article ids, emoji, quotations, ingredients — and the media is fetched from its source when a round is dealt. This page says exactly which source each game uses and what that means in practice.",
      "All four sources are public and keyless. That is a constraint the project set itself, and it shaped the games as much as any design decision did.",
    ],
    sections: [
      {
        heading: 'iTunes Search API',
        body: [
          "Guess the Song and Guess the App. The song game uses the 30-second preview clips the API serves; the app game uses the 512-pixel icon from the same catalog.",
          "Two things about that API shape how the games work. It indexes the store rather than the history of recorded music, so searches return karaoke versions, lullaby records, string-quartet tributes and 8-bit covers alongside the real thing, and anything matching that pattern is discarded before it can become a round. And it rate-limits by IP, answering 403 without CORS headers when you exceed it — from JavaScript that is indistinguishable from being offline — so requests go through a token bucket that allows a burst of 14 and a sustained 18 per minute.",
        ],
      },
      {
        heading: 'Wikipedia and Wikimedia Commons',
        body: [
          "Seventeen of the games load images from Wikipedia's REST summary endpoint: animals, birds, insects, plants, objects, landmarks, cities, dishes, sports, cars, celebrities, logos, country maps, video game covers, board game boxes and release-year posters, plus the four portraits in the quote game. Every one of those pictures is credited under the answer once a round is over, linking to the file it came from.",
          "Wikimedia serves only pre-rendered thumbnail widths. Probing a single file, 250, 330, 500, 1280, 1920 and 3840 pixels returned images and every other width returned HTTP 400 — so stage images ask for 1280, which is about a fifth of the bytes of a typical original, and fall back to the original for files that width was never cached for. Requests are queued at three in flight, because Wikipedia starts returning 429 at around eight.",
          "Not everything Wikipedia hosts is free to reuse, and the distinction is visible in the URL: files under upload.wikimedia.org/wikipedia/commons are freely licensed or public domain, while files under /wikipedia/en are local uploads carried under English Wikipedia's own fair-use rationale, which covers an encyclopedia and not an ad-supported game. The logo deck is filtered on exactly that test and lost sixteen brands to it. Film posters, game covers and board game boxes are the low-resolution non-free files, used in a quiz — the same shape of use as the encyclopedia's, but fair use rather than a licence, and the piece to revisit if this were ever run commercially at scale. Logos are shown as published and unaltered apart from the reveal; naming a brand from its mark is nominative use and implies no endorsement. Photographs used for the home page card art carry their licence and author in the photo credits panel on the home page, because CC-BY and CC-BY-SA require the attribution to be visible.",
        ],
      },
      {
        heading: 'YouTube',
        body: [
          "Guess the Movie plays one to fifteen seconds of a trailer through an embedded player. Guess the TV Show plays a theme tune through the same mechanism with the picture hidden, because opening titles print the show's name on screen within the first few seconds.",
          "Both games work around the embed rather than against it. Captions are disabled, since auto-showing subtitles print the dialogue. The film game covers the player whenever it is not actively rendering video, because a paused frame hands over more of the film than the player paid for and YouTube's title bar would simply print the answer. The theme-tune game rewrites the iframe's title attribute, which the embed API otherwise sets to the name of the video — that is, to the answer.",
        ],
      },
      {
        heading: 'Google Street View',
        body: [
          "Guess the Country uses Google's iframe embed, which needs no API key but only renders when it is genuinely inside an iframe. The 55 coordinates were each loaded through it and confirmed to return official Street View car imagery rather than a user-uploaded photosphere, which is a real problem otherwise: plenty of places with no car coverage still return something, often shot indoors or from a hotel balcony.",
          "The embed prints the place name in its top-left corner, which is the answer, so that corner is covered. Google's logo, the Terms link and the imagery attribution along the bottom are left completely visible and interactive. Covering a place label is fine; hiding attribution is not.",
        ],
      },
      {
        heading: 'Written by hand',
        body: [
          "Eleven games need no network at all, because their content is written into the site rather than fetched. The emoji rebuses, the film lines, the novel openings, the flat plot summaries, the advertising slogans, the language sentences, the capitals, the word definitions, the ingredient lists and the quotations are all bundled.",
          "Those files were the slowest part of the project and the ones with the strictest rules: no invented recipes, no misattributed quotations, no slogans whose attribution was uncertain, no language sentence that a speaker would not write. Where something could not be confirmed it was left out rather than guessed at, which is why several decks are shorter than they could have been.",
        ],
      },
    ],
  },
  {
    path: 'offline',
    title: 'Games that work offline',
    description:
      'Eleven of the 31 games are fully bundled and need no network at all, and a twelfth degrades gracefully.',
    intro: [
      "Most of these games fetch something — audio, a photograph, a trailer, a panorama — and without a connection they cannot deal a deck. Eleven of them do not, because their content is written into the site itself. Once the page has loaded, those eleven work on a plane, in a tunnel, or on hotel wifi that has decided today is not the day.",
      "They are also, not coincidentally, the games with the most writing in them.",
    ],
    sections: [
      {
        heading: 'The eleven',
        body: [
          "Guess by Emoji, with 145 rebuses across four categories. Guess the Film Line, 46 lines. Guess the Opening Line, 45 novels. Guess the Plot, 52 films described badly on purpose. Guess the Slogan, 50 advertising lines. Guess the Language, 67 languages in their own scripts. Guess the Capital, 124 countries. Guess the Word, 87 definitions. Guess the Recipe, 63 ingredient lists. Guess Who Said It, 73 quotations — this one fetches portraits for the four faces when it can, and is perfectly playable without them.",
          "Guess the Object is the eleventh and the odd one out: it fetches a photograph from Wikipedia when it can, and falls back to zooming into the object's emoji when it cannot. It is a worse game that way and a completely playable one.",
        ],
      },
      {
        heading: 'Why they are the text games',
        body: [
          "There is no way to bundle a song, a trailer or a photograph of a shoebill without hosting it, and hosting it is exactly what this project does not do. So the offline set is the set whose content is text: sentences, lists, definitions, emoji.",
          "That turned out to be a feature rather than a compromise. The text games are the ones where the writing is the game — where an ingredient list is ordered from least to most distinctive, or a film is summarised as an administrative event, or a language sentence has to be idiomatic enough that a speaker would recognise it. They are also the fastest to play, because there is nothing to load between rounds.",
        ],
      },
      {
        heading: 'What still needs a connection',
        body: [
          "Leaderboards. A global board needs a Supabase project to talk to; without one, or without a connection, scores are written to the device and the board says This device instead of Global. Nothing is lost — a run always saves locally first, and the local board keeps your last fifty.",
          "The remaining twenty games need the network for their media. If a game cannot reach its source it says so plainly and tells you what failed, rather than sitting on a spinner: the iTunes catalog could not be reached, or Wikipedia could not be reached for bird photographs. Individual rounds that lose their image are skippable for free.",
        ],
      },
    ],
  },
];
