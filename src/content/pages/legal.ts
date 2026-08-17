import type { Article } from './types';

/**
 * The legal pages: privacy, terms, cookies.
 *
 * Every factual claim in the privacy policy below was checked against the code
 * that makes it true, and the file it lives in is named in the paragraph or in
 * the comment above the section. If any of those files change — a new
 * localStorage key, a new column on `scores`, a new third-party host contacted
 * from the browser — this page is wrong until it is updated too, and a privacy
 * policy that is wrong is worse than none at all.
 *
 * Sources, section by section:
 *   src/lib/storage.ts      the `guessthe:` localStorage prefix
 *   src/lib/identity.ts     the random player id and the leaderboard name
 *   src/lib/settings.ts     what the settings blob holds
 *   src/lib/history.ts      the 60-entry play history
 *   src/lib/leaderboard.ts  the per-game device board, and the score upload
 *   src/content/cache.ts    the cached API responses
 *   src/lib/supabase.ts     anonymous sign-in, persisted sessions
 *   src/lib/auth.ts         optional Google sign-in and what it reads
 *   src/lib/moderation.ts   moderator checks and the hide-list
 *   src/ui/Suggest.tsx      the suggestion form and its optional contact field
 *   supabase/migrations/*   the actual columns and row-level security policies
 *   src/content/itunes.ts   Apple
 *   src/content/wikipedia.ts Wikimedia
 *   src/lib/youtube.ts      YouTube
 *   src/games/stages.tsx    the Google Street View embed
 *   vite.config.ts          the AdSense loader tag
 *   src/ui/AdSlot.tsx       the ad units
 *
 * `utility: true` on all three: noindex, and kept out of the sitemap. These
 * exist to be read by a person who goes looking for them, not to rank.
 */

const EFFECTIVE = '17 August 2026';

/**
 * Not yet a real inbox. A policy whose only contact route is dead is itself a
 * compliance problem, so the placeholder is marked as loudly here as it will
 * render on the page — replace it, do not quietly ship it.
 */
const CONTACT = 'hello@guesstherest.com';
const CONTACT_WARNING =
  'PLACEHOLDER ADDRESS — not yet in service. It must be replaced with a working inbox before this policy is relied on.';

export const LEGAL: Article[] = [
  {
    path: 'privacy',
    title: 'Privacy Policy',
    description:
      'What Guess The Rest stores in your browser, what its leaderboards make public, and which third parties — including Google — your browser talks to.',
    utility: true,
    intro: [
      `Effective ${EFFECTIVE}.`,
      'Guess The Rest is a free set of browser games at guesstherest.com. This page describes exactly what the site collects, where it goes, and who else can see it. It is written from the code rather than from a template, so it is specific: where it says a particular thing is stored, that thing and nothing else is stored.',
      'The short version. You can play every game here without an account, and nothing about you is required to do it. The site keeps a handful of values in your own browser so it can remember your name, your scores and which games you have played. If global leaderboards are switched on, a score you finish is uploaded with the display name you chose, and that name is public. Advertising is served by Google, and Google and its advertising partners may set and read cookies in your browser as a result. There is no analytics package, no tracking pixel of our own, and nothing is ever sold.',
    ],
    sections: [
      {
        heading: 'What is stored in your browser',
        body: [
          'The site keeps a small amount of data in your browser’s localStorage, under keys beginning “guessthe:”. This never leaves your device on its own; it is not a cookie and it is not sent with requests. Clearing site data for guesstherest.com removes all of it, and the games carry on working from scratch.',
          'The display name you play under. Auto-generated on first play from a pair of harmless words, and editable in Settings. It is stored along with a flag recording that you chose it yourself, and your sound-effects preference, in a single settings entry.',
          'A random player id. A UUID generated in your browser the first time you finish a game. It is not derived from anything about you, it is never sent to an advertiser, and its only job is to key the leaderboard that lives on this device.',
          'Your recent play history: up to sixty entries, each one a game slug, a timestamp and a score. This is what fills the “recently played” row on the home page.',
          'A per-game leaderboard for this device: up to fifty of your own runs per game, each with the name you played under, the score, rounds won and best streak. Every game keeps its own, and this is what you see when global boards are unavailable.',
          'Cached answers from the outside services described below — Wikipedia page summaries and image URLs, iTunes search results, and the list of retired rounds described under Moderation — kept for about a month, or a few minutes in the case of the retired-rounds list, so the same lookup is not repeated every time you play. These hold facts about songs, films and animals, not about you. Apple rate-limits its search API by IP address, so caching is also what keeps the games playable.',
          'If you sign in, the Supabase client library stores your session token in localStorage too, so you stay signed in between visits. Signing out removes it.',
          'If you paste your own Supabase project URL and key into the Settings panel — an option that exists for people running their own copy — those are stored in the same settings entry, in your browser only.',
        ],
      },
      {
        heading: 'Leaderboards, and what becomes public',
        body: [
          'Global leaderboards run on Supabase, a hosted Postgres database. They are optional: with no database configured, every board is local to your device and nothing at all is uploaded.',
          'When they are configured and you finish a run with a score above zero, one row is written. It contains: the game’s slug, the account id described below, the display name you chose, your score, the number of rounds you won, your best streak, and the time. That is the whole row. No IP address, no browser fingerprint, no email, no location.',
          'Separately from what the row contains: Supabase, as the company hosting the database, necessarily sees the IP address and user-agent of any request your browser makes to it, in the ordinary way of any web server receiving a request. We do not read or use those logs, and nothing in this site’s own code records them.',
          'Leaderboard rows are readable by anybody. That is the point of a leaderboard, and it means the display name you pick is published next to your score, together with the random account id the row belongs to. Do not use your real name, or anything you would not want a stranger to read, if that matters to you. Names are checked against a rude-word filter before they can be saved or posted, and a name that fails is swapped for a generated one.',
          'Scores cannot be edited or deleted from the site once posted — the database refuses both, for everyone, so that nobody can rewrite their run or wipe somebody else’s. If you want a row of yours removed, write to us and we will remove it by hand.',
        ],
      },
      {
        heading: 'Accounts and signing in',
        body: [
          'Posting a score needs an account, but not one you have to create. The first time it is needed, the site signs you in anonymously: the database issues an account id and nothing else. There is no email, no password and no profile behind it. Merely looking at a leaderboard does not create one.',
          'Signing in with Google is offered, and is entirely optional. Its only purpose is to carry your name and your scores between browsers. If you use it, Google tells our database your email address, your display name and your profile picture URL, and the site reads your name — to offer it as your leaderboard handle, unless you have already chosen one — and your picture, to show it in the corner. Your email address is stored by Supabase as part of your account. It is not published on any leaderboard, not used for marketing, and not shared with anyone.',
          'You can sign out at any time from the home page, and you can revoke the site’s access to your Google account at any time from your Google account’s security settings.',
        ],
      },
      {
        heading: 'The suggestion form',
        body: [
          'The form at the bottom of the home page — “Which game is missing?” — sends whatever you type into a database table that only the site owner can read. Nobody else can read it back, including the person who wrote it: the table has permission to accept new rows and no permission to return any, so submissions cannot be listed by anyone using the site.',
          'A suggestion stores your idea, the optional email address you may type into the contact box, and the account id you happened to be using at the time. The email field exists so we can tell you if your idea gets built. It is optional, it is never used for anything else, and leaving it blank does not weaken the suggestion.',
        ],
      },
      {
        heading: 'Moderation',
        body: [
          'A short list of moderators can retire an individual round — a broken image, a silent audio preview, a misattributed quote, anything unfair or offensive — so that it is never dealt again to anyone.',
          'Moderators are identified by the verified email address on their Google account, held in a table that lists nothing but those addresses and a note about why each one is there. That table cannot be read by players; a signed-in person can only ever see their own row in it, which is how the site answers the single question “am I a moderator?”. The list of retired rounds is public, because every player’s copy of the game has to read it to filter its own deck. It records which game and item was hidden, the reason given, and the account id of the moderator who did it.',
        ],
      },
      {
        heading: 'Other companies your browser talks to',
        body: [
          'The games are built out of material that is fetched live, so playing them means your browser makes requests directly to other companies. Those requests carry your IP address, your browser’s user-agent string and, in some cases, the page you came from — that is how the web works, and it is true of every embedded image or player anywhere. We do not control what those companies do with it; each has its own privacy policy. They are:',
          'Apple. The iTunes Search API at itunes.apple.com supplies the song, album and app data used by several games, and the thirty-second audio previews and cover artwork are streamed from Apple’s own servers.',
          'The Wikimedia Foundation. Wikipedia’s summary API and the image servers at upload.wikimedia.org supply the photographs of animals, birds, plants, dishes, landmarks, cars, objects, people and company marks that the picture games are played with.',
          'Google, for YouTube. The film-scene and television games embed the YouTube player, loaded from youtube.com. YouTube may set cookies in your browser when its player loads.',
          'Google, for Maps. The Street View game embeds a Google Street View panorama from maps.google.com. Google may set cookies in your browser when it loads.',
          'Google, for advertising — described in its own section below.',
          'Supabase, if global leaderboards are configured, for the database and sign-in described above.',
          'That is the complete list. There is no analytics service, no tag manager, no social-media widget, no A/B testing tool and no error-reporting service on this site.',
        ],
      },
      {
        heading: 'Advertising, and cookies set by Google',
        body: [
          'This site carries advertising served by Google AdSense. The AdSense script is loaded from Google on every page.',
          'Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or to other websites.',
          'Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.',
          'Third parties may also place and read cookies in your browser, or use web beacons or IP addresses, to collect information as a result of ad serving on this site.',
          'You can opt out of personalised advertising by visiting Google’s Ads Settings at https://www.google.com/settings/ads. You can opt out of a third-party vendor’s use of cookies for personalised advertising at https://www.aboutads.info/choices.',
          'A full description of how Google uses the information it collects from sites that use its services is published at https://policies.google.com/technologies/partner-sites.',
          'Where the law requires consent before personalised advertising cookies may be used — in the European Economic Area, the United Kingdom and Switzerland — that consent is handled through Google’s own consent message. If you are in one of those places and were not asked, tell us at the address below and we will put it right.',
          'We do not receive, store or have access to any of the information Google’s advertising collects. We are not given your identity, your browsing history or anything else about you by Google; we are given a report of how many ads were shown.',
        ],
      },
      {
        heading: 'Children',
        body: [
          'This is a general-audience site. It is not directed at children under 13, it has no features aimed at them, and we do not knowingly collect personal information from them.',
          'The only place a child could type personal information into this site is the optional contact box on the suggestion form. If you believe a child under 13 has sent us an email address there, write to us and we will delete the submission.',
        ],
      },
      {
        heading: 'How to delete your data',
        body: [
          'Everything stored in your browser: clear site data for guesstherest.com in your browser’s settings, or use its “clear cookies and site data” control. That removes your name, your player id, your play history, your device leaderboards, your cached lookups and your sign-in session in one go. There is no “delete everything” button inside the app itself. One caveat, if you signed in with Google: your posted scores stay in the database, and the “recently played” row will fill itself back in from them next time you sign in. Deleting those means deleting the rows, below.',
          'A leaderboard row: write to us with the display name and the game, and we will delete the row. The site deliberately gives nobody — including you — the ability to delete scores directly, because the same power would let anyone delete anyone else’s.',
          'Your account: ask us and we will delete it. Deleting the account deletes every score attached to it at the same time; the database is set up so scores cannot outlive the account that posted them.',
          'A suggestion you sent: tell us roughly what it said and we will find and delete it.',
          'Google’s advertising cookies are not ours to delete. Use Google’s Ads Settings, linked above, or clear cookies in your browser.',
        ],
      },
      {
        heading: 'Changes, and how to reach us',
        body: [
          'If this policy changes in a way that affects what is collected or who sees it, the effective date at the top changes with it.',
          `Questions, deletion requests, or anything you think this page has got wrong: ${CONTACT}. ${CONTACT_WARNING}`,
        ],
      },
    ],
  },

  {
    path: 'terms',
    title: 'Terms of Use',
    description:
      'The short, plain terms for playing Guess The Rest: free to play, fair use of the leaderboards, and how third-party material is used.',
    utility: true,
    intro: [
      `Effective ${EFFECTIVE}.`,
      'These are the terms for using guesstherest.com. They are short on purpose. Playing a guessing game should not require reading eight pages of clauses, and nothing here is designed to catch you out.',
    ],
    sections: [
      {
        heading: 'Using the site',
        body: [
          'The games are free. No account is needed, nothing is for sale, and there is no subscription. You may play as much as you like, on as many devices as you like.',
          'The site is provided as it is, without any guarantee that it will work, stay available, or be correct. It depends on services run by other people — Apple, Wikimedia, YouTube, Google — and when one of those is slow or unreachable, games that need it will not work until it comes back. Content is added and removed over time and games may change or disappear.',
          'Please do not attack the site or the people using it: no automated scraping of the games, no scripted score submissions, no attempts to break the database or to post under someone else’s identity. Scores that were obviously not played may be removed.',
        ],
      },
      {
        heading: 'Names on leaderboards',
        body: [
          'The display name you pick appears in public next to your score. Pick something you are happy for strangers to read.',
          'Names are filtered for offensive language before they are saved or posted. A name that gets through the filter but should not have, or that impersonates somebody, or that exists to harass a person, may be replaced or removed without notice. Where a name is removed, the score usually stays: the rudeness costs you the name, not the run.',
        ],
      },
      {
        heading: 'Material that belongs to other people',
        body: [
          'The games are played with material published by other people: photographs from Wikimedia Commons, thirty-second preview clips and cover art from the iTunes Store, app icons, trailers embedded from YouTube, Street View panoramas from Google, and company marks.',
          'None of it belongs to this site and none of it is claimed. Photographs are used under the licences they were published under, and every one of them is credited, with its licence named, on the credits page. Preview clips, artwork, trailers and panoramas are embedded from the services that publish them, and play from those services rather than from here.',
          'Company names, logos and trademarks are the property of their owners. They appear here to be identified as part of a guessing game and for no other reason: no affiliation, sponsorship or endorsement is claimed or implied by any of them.',
          'The writing on this site, the games themselves, the clues, the card artwork and the code are the site’s own.',
          'If you own something used here and would rather it were not, write to us and it will be taken out. There is no argument to be had about it — an individual round can be retired from every player’s deck the same day.',
        ],
      },
      {
        heading: 'Advertising',
        body: [
          'The site carries advertising served by Google, which pays for it. Adverts are not endorsements: we do not choose which ones you see, and we have no relationship with the advertisers behind them. What Google collects in the process is described in the privacy policy.',
        ],
      },
      {
        heading: 'Liability, and changes',
        body: [
          'To the extent the law allows, the site is not liable for any loss arising from using it or from being unable to use it. It is a set of free guessing games.',
          'These terms may change. The effective date at the top is the date of the current version, and continuing to use the site is how you accept it.',
          `Anything you want to raise, including anything in these terms you think is unfair: ${CONTACT}. ${CONTACT_WARNING}`,
        ],
      },
    ],
  },

  {
    path: 'cookies',
    title: 'Cookies and Local Storage',
    description:
      'This site sets no cookies of its own — it uses localStorage. Here is exactly what it keeps, and which cookies Google’s ads, YouTube and Maps do set.',
    utility: true,
    intro: [
      `Effective ${EFFECTIVE}.`,
      'This page is kept separate from the privacy policy rather than folded into it, because the two answer different questions. The privacy policy is about information; this is about the specific storage mechanisms in your browser and how to switch each of them off. Anyone arriving from a cookie banner or a browser prompt wants this page, not a section halfway down a longer one — and it is short enough to read in full, which a combined page would not be.',
      'The headline is worth stating plainly: this site sets no cookies of its own. Not one. Everything it remembers about you is kept in localStorage, which is never transmitted anywhere. The cookies that do end up in your browser are set by Google, and only because of advertising and embedded players.',
    ],
    sections: [
      {
        heading: 'What this site stores, and why',
        body: [
          'All of the following live in your browser’s localStorage under keys beginning “guessthe:”. None of it is sent to a server by the site, and none of it is readable by another website.',
          'Your settings: the display name you play under, whether you chose that name yourself, and whether sound effects are on. Without it the site would forget your name every visit.',
          'A random player id: a UUID with no meaning outside this site, generated on your device the first time you finish a game, used to key your device’s own leaderboards.',
          'Your play history: up to sixty finished games, each recorded as a game name, a time and a score, so the home page can show what you have been playing.',
          'Your device leaderboards: up to fifty runs per game, so scores survive with no account and with no database configured.',
          'Cached lookups: replies from Wikipedia and the iTunes Search API, kept for about a month. These describe songs, films and animals rather than you, and they exist so a game does not re-fetch the same facts every round — which also keeps the site inside Apple’s rate limits.',
          'A sign-in session, if you sign in: the token that keeps you signed in between visits, stored by the Supabase client library. It disappears when you sign out.',
        ],
      },
      {
        heading: 'Cookies set by other companies',
        body: [
          'Google, for advertising. The site carries Google AdSense, and Google and its advertising partners may place and read cookies in your browser, and may use web beacons or your IP address to collect information, as a result of ads being served here. This can include using cookies to serve ads based on your previous visits to this site or to other sites. Google explains what it collects at https://policies.google.com/technologies/partner-sites, and you can turn personalised advertising off at https://www.google.com/settings/ads. Third-party vendors can be opted out of at https://www.aboutads.info/choices.',
          'Google, for YouTube. Games that play a film trailer or a television title sequence embed the YouTube player. Loading it may set YouTube cookies. If you never open one of those games, the player never loads.',
          'Google, for Street View. The country-from-a-street-corner game embeds a Google Street View panorama, which may set Google cookies when it loads.',
          'Apple and Wikimedia. Audio previews, cover art and photographs are fetched from Apple and Wikimedia servers. These are plain image and audio requests: they reveal your IP address to those companies, as any embedded image does, but they do not set advertising cookies.',
          'There are no analytics cookies here, because there is no analytics package. Nothing on this site measures you for our benefit.',
        ],
      },
      {
        heading: 'Turning it off',
        body: [
          'To erase everything this site has stored on your device, clear site data — sometimes labelled “cookies and site data” — for guesstherest.com in your browser’s settings. The games will still work; they will simply have forgotten your name, your history and your device scores. There is no button inside the site that does this.',
          'To stop it being stored in the first place, play in a private or incognito window. The site is written to survive localStorage being unavailable: scores stay in memory for the session and the games run normally.',
          'To limit Google’s cookies, use the opt-out links above, block third-party cookies in your browser, or use its tracking-protection setting. Blocking them does not break any game here.',
          `Anything unclear, or anything you think this page has missed: ${CONTACT}. ${CONTACT_WARNING}`,
        ],
      },
    ],
  },
];
