import type { Article } from './types';

/**
 * One page per game, in the order the games appear on the home page.
 *
 * Everything stated here — ladder steps, zoom factors, tile counts, pool sizes,
 * point values — is read out of the game's own source and its seed file rather
 * than estimated. If a deck grows, the number on its page should grow with it.
 */
export const GAMES: Article[] = [
  {
    path: 'games/song',
    gameSlug: 'song',
    title: 'Guess the Song',
    description:
      'A tenth of a second of a track, and four chances to buy more. What a 100ms clip actually contains and how to read it.',
    intro: [
      "A round opens with one tenth of a second of audio. That is not a bar, or a beat, or a word — it is a single transient, usually the front edge of whatever instrument happened to be sounding when the clip began. Press play a few times and you start to hear it as a shape rather than a noise: an attack, a decay, and the size of the room behind it.",
      "Four more rungs are available, and each one costs points. Half a second, a second and a half, three, five. The whole game is the argument you have with yourself about whether you really need the next one.",
    ],
    sections: [
      {
        heading: 'What is in a tenth of a second',
        body: [
          "Almost always: a drum. Popular music puts something percussive on the downbeat, and the excerpt Apple serves is a 30-second cut taken from somewhere in the middle of the track rather than the top, so the clip tends to land on a bar line rather than on an intro. A kick reads as a soft thud with no top end. A snare is a burst of white noise with a pitched crack under it. A closed hi-hat is all top end and no body.",
          "That single hit rules out more than it names. A drum machine has no variation in the attack and no room tone around it, which places you in the 1980s or in electronic music. A live kit brings the sound of the room with it, and the length of that tail tells you whether the record was made in a big studio in the 1970s or in a treated box in the 2010s. Tape hiss, if you can hear any at all in 100 milliseconds, is its own answer.",
          "Occasionally the clip opens on a voice, which is a gift: the front of a sung syllable carries a lot of identity, and most people can put a name to a singer from one vowel.",
        ],
      },
      {
        heading: 'The ladder',
        body: [
          "0.1 seconds, then 0.5, 1.5, 3 and 5. The jump that changes the round is the third one. At half a second you have a sound; at a second and a half you have two or three beats, which means you have a tempo and a groove, and tempo alone eliminates most of a shortlist.",
          "Three seconds is usually a full phrase, and five seconds nearly always brings the vocal in. Getting there costs you 850 of the 1000 points the round opened with, so five seconds is a confession rather than a strategy.",
          "Audio is unlocked once and then each new rung plays itself, so buying more does not mean pressing play again. Space replays whatever you have paid for.",
        ],
      },
      {
        heading: 'Where the music comes from',
        body: [
          "The deck is built from 178 tracks by 114 artists, played through the iTunes Search API, which serves preview clips to anyone without a key or an account. Nothing is stored or redistributed — the repository holds titles and artist names, and the audio is fetched at the moment you play.",
          "That API indexes the store, not the history of recorded music, and the store is full of note-for-note impostors. A search for a well-known rock song will happily return a lullaby version, a string-quartet tribute, an 8-bit cover and a karaoke backing track ahead of the real thing. Anything matching that pattern is discarded before it can become a round, which is why you never get half a second of a music-box arrangement and have to guess what it is a cover of.",
          "Clips play through Web Audio rather than an audio element, because an audio element cannot honour 100 milliseconds. Seeking and pausing both jitter by tens of milliseconds, which on this ladder is most of the clip. Buffers are decoded up front and scheduled sample-accurately, with about 12 milliseconds of fade on each end to kill the click.",
        ],
      },
      {
        heading: 'Scoring a run',
        body: [
          "Ten rounds. A first-rung answer is worth 1000, then 620, 380, 240 and 150 as you buy your way down. A wrong guess costs a rung exactly like a skip does, so a stab in the dark at 0.1 seconds is a real bet: guess wrong twice and you are at three seconds with 240 points on the table.",
          "The speed bonus adds up to 160 points and tapers to nothing over 20 seconds, and the streak multiplier climbs by a tenth per consecutive correct round to a maximum of 2×. A run where you name everything from the first tenth of a second inside ten seconds is worth a shade under 16,000. Anything over 6,000 means you were mostly winning on the first two rungs.",
        ],
      },
    ],
  },
  {
    path: 'games/scene',
    gameSlug: 'scene',
    title: 'Guess the Movie',
    description:
      'One second of trailer footage, taken from a measured point in the middle. What a single second gives away, and how to use it.',
    intro: [
      "One second of a trailer, with no sound cue to help and no title card at either end. It feels like nothing while it plays and then, once it has stopped, you find you have retained a surprising amount: a face, a colour, the grain of the image, the way the camera was moving.",
      "The trick to this game is that one second is nearly always enough. The instinct to buy two more rungs before committing is the thing that costs most players their score.",
    ],
    sections: [
      {
        heading: 'Where the second comes from',
        body: [
          "Not the start. A trailer opens with studio logos and closes with title cards, cast lists and a release date, and both ends are useless or worse — the last eighth of a trailer usually prints the answer on screen. Every film in the deck carries a measured offset instead: each trailer was played in a real browser, sampled at five points between 30 and 70 percent in, and each pair of frames scored for motion, colour spread and darkness. The stored offset is the highest-scoring point, which is to say a moment the video was observed to be showing actual footage.",
          "Those offsets run from 23 seconds into My Neighbor Totoro to 150 seconds into Avatar. The player is also shielded whenever it is not actively rendering video, because a paused YouTube frame is a freeze-frame of the film you did not pay for, and YouTube's own title bar would simply print the answer. Captions are disabled for the same reason.",
        ],
      },
      {
        heading: 'Reading one second',
        body: [
          "Start with the image itself rather than what is in it. Film grain and a soft, slightly warm palette put you before about 2005; digital capture is cleaner, cooler and holds detail in the shadows. The orange-and-teal grade that dominates the 2010s is unmistakable once you have noticed it, and animation announces its own era faster than anything — hand-drawn cels, early CG with its plasticky specular highlights, or the modern look with real depth of field.",
          "Then the frame. Trailer editors cut on movement, so the second you get is usually a moving shot, and the kind of movement is informative: a slow push-in belongs to a drama, a handheld whip-pan to an action film, a locked-off symmetrical composition to a small number of directors with a house style.",
          "Aspect ratio narrows things down more than people expect. A very wide frame with black bars suggests a big-budget scope release; a boxier one suggests a comedy, a horror film, or something old.",
        ],
      },
      {
        heading: 'The ladder and the deck',
        body: [
          "One second, then two, four, eight and fifteen. Each rung restarts from the same measured offset, so buying more is genuinely watching more of the same shot rather than being shown a different part of the film. Four seconds is usually the point where a cut happens and you get a second shot, which is where most rounds are actually won.",
          "The deck holds 87 films spanning 1939 to 2023, each verified twice over: the Wikipedia article confirms the year, and the YouTube id returns a real trailer for that film. Thirty candidate films were dropped during that check, mostly for trailer ids that no longer play — a dead embed reads to a player as a broken game rather than as stale data.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Eight rounds rather than ten, because a trailer round takes longer to play than it does to think about. The ladder pays 1000, 620, 380, 240 and 150, plus a speed bonus of up to 160 that runs out after 20 seconds, and a streak multiplier that reaches 2× after ten correct answers in a row — which in an eight-round game means you never quite get there.",
          "A flawless run is worth about 11,600. Because a wrong guess burns a rung, the disciplined play is to watch the second twice, commit if you have a candidate, and buy the second rung immediately if you do not.",
        ],
      },
    ],
  },
  {
    path: 'games/show',
    gameSlug: 'show',
    title: 'Guess the TV Show',
    description:
      'A theme tune with the picture switched off: one second, then two, five, ten, twenty. Why the screen stays dark and how to date a theme.',
    intro: [
      "One second of a theme tune, sound only. The screen shows a small television with an equaliser on it and nothing else, which is not a stylistic decision — almost every opening title sequence prints the name of the show across the frame within a few seconds, and there is no crop or blur that survives the answer being written in the middle of the picture.",
      "Theme tunes are the most over-learned music most people own. That is why this ladder can start meaner than the film game's: one second of a title sequence is a drum fill and a key, and for a dozen shows in the deck that is already plenty.",
    ],
    sections: [
      {
        heading: 'Dating a theme by its instruments',
        body: [
          "Instrumentation places a theme in a decade faster than the melody does. A gated snare, a DX7 electric piano and a saxophone put you in the mid-1980s. A live band playing a major-key hook with a walking bass line under it is a 1980s or early-1990s sitcom. A full orchestra recorded with real air around it belongs to prestige drama from the late 1990s onward, and a lone cold synth arpeggio with no drums is a modern prestige title sequence.",
          "Cartoons are their own category: fast, brass-led, often with a choir of children, and frequently the show's name is sung in the first bar, which is why some rounds end at one second and others take twenty.",
          "Anime themes in the deck sound nothing like the Western ones — J-pop or J-rock, a full band, and a vocal that enters early. If the first second is a distorted guitar chord followed by a snare roll, you can eliminate most of the sitcoms outright.",
        ],
      },
      {
        heading: 'The ladder',
        body: [
          "One second, two, five, ten, twenty. Five seconds is usually a full phrase of the melody. Twenty seconds is a verse of almost any title sequence ever written, and by then the round is worth 150 points instead of 1000.",
          "Once the round is over the theme plays out for 30 seconds, which is the small reward for having sat through a game that hides its own pictures.",
        ],
      },
      {
        heading: 'How the audio is served',
        body: [
          "The player is a real YouTube embed — the only keyless way to get this audio — moved off-screen rather than hidden. That distinction matters more than it sounds: six ways of hiding it were measured against a live embed, and while today's Chrome keeps the sound on through all of them, zero-sized and display:none media have been throttled or refused before on both engines, and the failure mode is a round that simply makes no sound. Parked off the left edge of the page, the element is fully laid out and composited, and cannot be seen, hovered, focused or read.",
          "The embed also names its own iframe after the video it is playing, which is to say after the answer, sitting in the accessibility tree. That title is rewritten the instant the element appears, and again if it ever comes back.",
        ],
      },
      {
        heading: 'The deck',
        body: [
          "153 series, from I Love Lucy in 1951 to The Last of Us in 2023. Shows whose opening is a silent title card or pure ambience were left out however famous they are, because there is nothing to guess.",
          "Getting to 153 took some work: 977 candidate uploads were scraped and scored, and the best few per show were put through two gates — YouTube's keyless oEmbed endpoint, which fails for anything private or deleted, and then a real embedded player watched to confirm playback actually advances, because oEmbed will happily bless a video whose owner has turned embedding off. Of 165 series researched, twelve had no theme worth guessing and thirty more had the machine's pick overruled by hand for being a prequel, a spin-off, a parody or a fan edit.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380, 240 and 150 points per rung, plus up to 160 for speed and a streak multiplier that tops out at 2×. Wrong guesses cost a rung, and in this game they are cheap to make, because a great many themes share the same four-bar shape. Naming the genre in your head before you name the show is worth doing.",
        ],
      },
    ],
  },
  {
    path: 'games/country',
    gameSlug: 'country',
    title: 'Guess the Country',
    description:
      'Thirty seconds on a street somewhere on Earth. The road markings, plates, poles and plants that tell you which country you are standing in.',
    intro: [
      "A panorama drops you on an ordinary road, and you have thirty seconds to look around before the round ends. There is no monument, no skyline and no helpful sign pointing at the border. There is a road surface, some markings, whatever grows by the side of it, and the traffic.",
      "The 55 locations were each checked to be official Street View car imagery rather than a user-uploaded photosphere, and they sit on ordinary streets rather than at landmarks. Everything you need is in the furniture of the road.",
    ],
    sections: [
      {
        heading: 'What to look at first',
        body: [
          "Which side of the road the traffic is on cuts the world roughly into a third and two thirds, and it is the single fastest read available. Then the centre line: yellow in the Americas, in Japan and in much of South East Asia, white across Europe, Africa and Oceania. A double yellow line down the middle of a two-lane road is a strong North American tell.",
          "Utility poles are the next best thing. Wooden poles with pot-shaped transformers hanging off them are the Americas and the Philippines; concrete poles with a square section are much of Asia; buried cables and no poles at all are western Europe. Bollards, guardrails and kilometre markers are all designed nationally and are strikingly consistent within a country — the black-and-white striped posts along a European roadside differ in shape from one country to the next.",
          "Number plates carry colour information at surprising distance. A yellow rear plate reads as the Netherlands, the United Kingdom or a handful of others; a long white European plate with a blue band on the left is EU or its neighbours; the wider, squarer plate of the Americas and Japan is a different shape entirely before you can read a character of it.",
        ],
      },
      {
        heading: 'Reading the land',
        body: [
          "Vegetation dates and places a photograph faster than architecture does. Eucalyptus stands mean Australia or a country that imported them. Palms tell you the latitude and, by species, more than that. Red laterite soil at the road edge is a tropical tell across Africa, Brazil and parts of South Asia.",
          "The sun is a compass and a hemisphere check. If the shadows at midday fall south you are north of the tropics, and if they fall north you are south of them. In the far north the light stays low and long all day, which is its own signature.",
          "Language on signage is the obvious one, and worth checking last rather than first, because it is often absent for a full 360-degree turn. When you do find text, look at the diacritics rather than the words: a circumflex, a cedilla, a tilde or a ring over an A each rule out most of a continent.",
        ],
      },
      {
        heading: 'The clock and the clue ladder',
        body: [
          "Thirty seconds per round, running from the moment it starts. Buying a clue does not reset it, deliberately — otherwise skipping would be a way to buy time as well as information.",
          "Three clues are available. The first names the region, which narrows 124 possible answers to somewhere between ten and twenty-eight. The second is a written fact chosen not to give the game away — that minor roads carry a D number and the traffic police are a branch of the armed forces, for instance, which is France without saying France. The third is the country's first letter.",
        ],
      },
      {
        heading: 'The map, and what is missing from it',
        body: [
          "The 55 locations cover seven regions: twelve in Europe, eleven in Asia, nine in Africa, eight in South America, six in the Middle East, five in North America and the Caribbean, and four in Oceania. The answer list, though, is all 124 countries the site knows capitals for — narrowing the guess list to the countries actually in the deck would hand over most of the answer.",
          "Several countries are absent for lack of official coverage, including China, India, Egypt, Saudi Arabia and Morocco. The panorama comes from Google's keyless iframe embed, which is why the place-name label in the corner is covered up: that label is the answer. Google's logo, the Terms link and the imagery attribution along the bottom are left alone, because covering a label is fine and hiding attribution is not.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Eight rounds, worth 1000, 620, 380 and 240 as you spend clues, plus a speed bonus of up to 160 that decays over 20 seconds — which in a game with a 30-second clock is a genuine tension. Running out of time scores the round zero, exactly as a skip would.",
        ],
      },
    ],
  },
  {
    path: 'games/rebus',
    gameSlug: 'rebus',
    title: 'Guess by Emoji',
    description:
      'A title spelled out in emoji, two or three to start. Pick a category, read the rebus, and buy more pictures if you have to.',
    intro: [
      "Two or three emoji, arranged to encode an idea rather than to spell a title. A lion and a crown. A ship, an iceberg and a broken heart. The good ones are invisible until they are obvious, and then you cannot see how you ever missed them.",
      "You choose a category before the deck is built, and that choice decides both the puzzles and the list you search against: 55 films, 34 songs, 30 television shows or 26 books. Searching 55 films is a materially different game from searching 26 books, which is the point of asking.",
    ],
    sections: [
      {
        heading: 'How to read a rebus',
        body: [
          "The emoji encode the idea, not the words. A puzzle that spelled out the title would be a label rather than a question, so the opening clue is usually one concrete image from the story plus one abstraction: a genre, a setting, a feeling. Work outward from whichever emoji is doing the least literal work, since that is normally the one carrying the meaning.",
          "Watch for emoji used as sounds or as letters. A number in the middle of a line is often a number in the title. A flag is usually a country and occasionally a language. A repeated emoji tends to mean a plural or a sequel.",
          "The other trick is to hold two readings at once. The rebus for a song and the rebus for a film can start identically, which is why the category picker exists — inside a category, the answer space is small enough that a half-formed idea is worth typing into the search box to see what the list offers.",
        ],
      },
      {
        heading: 'What each rung adds',
        body: [
          "The first two clue rungs each add another pair of emoji, chosen to introduce something new — a character, an object, a scene — rather than to restate the opener. That is what makes them worth buying: the second clue is not the first clue louder.",
          "The last rung is a written clue, and it is generous by design. Disney, 1994, a stampede you never forget. Bee Gees, 1977, the tempo paramedics teach for chest compressions. By then the round is worth 240 rather than 1000, so the written clue is the point at which you are salvaging rather than competing.",
        ],
      },
      {
        heading: 'The four categories',
        body: [
          "Movies is the largest deck at 55 puzzles and the most forgiving, because film iconography is the most standardised: a glowing fingertip, a red pill, a bicycle against the moon.",
          "Songs, at 34, is the hardest of the four, because a song has no plot to draw on — the rebuses lean on the video, the album cover, or a single lyric rendered literally. Shows has 30 and rewards knowing catchphrases. Books has 26 and skews older and more literary, which makes it the one where the written clue earns its keep.",
          "None of this needs a network. The whole game is bundled, so it works with the wifi off.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds on a four-rung ladder: 1000 points for reading it from the opening emoji, then 620, 380 and 240. A wrong guess costs a rung, which in a game where the answer arrives all at once is worth remembering — if you are not sure, buying the next pair of emoji costs the same as being wrong and tells you something.",
        ],
      },
    ],
  },
  {
    path: 'games/object',
    gameSlug: 'object',
    title: 'Guess the Object',
    description:
      'An everyday thing photographed at 6.5x and pulled back one rung at a time. How to read material, tooling and scale out of a crop.',
    intro: [
      "A crop of an ordinary object, magnified until it is a texture rather than a thing. The first rung is 6.5x, and where in the picture it lands is decided by a hash of the round rather than by the centre of the frame, so you are not reliably looking at the important part.",
      "The pool is 109 objects and it is broader than the word suggests: a stapler and a fire hydrant, but also a geode, an artichoke, a Ferris wheel and a vacuum tube. Half the difficulty is that you have quietly assumed a scale, and the scale is wrong.",
    ],
    sections: [
      {
        heading: 'Material first, shape second',
        body: [
          "At 6.5x you are looking at a surface, so read the surface. Injection-moulded plastic has a slight orange-peel texture and a parting line where the mould halves met. Brushed aluminium has parallel scratches all running one way. Cast iron is pitted. Blown glass has a meniscus at every edge and a bright specular highlight that plastic never quite manages.",
          "Machining marks are almost as good as a label. A helical thread, a knurled grip, a hex socket, a Phillips cross — each of these belongs to a small family of objects. Woven fabric, moulded rubber and turned wood are similarly narrow.",
          "Then look for scale cues. Dust, fingerprints and a shallow depth of field mean the object is small and the photograph was taken close. Weathering, rust streaks and a hard blue sky at the edge of the frame mean the object is large and outdoors, which cuts a hundred candidates down to about a dozen.",
        ],
      },
      {
        heading: 'The ladder',
        body: [
          "6.5x, 4.3x, 2.9x, 2x, 1.35x. The final rung is not the full picture — it is still a slight crop, which is why a round can end with you looking at something you would recognise instantly if you could see two more centimetres of it.",
          "The step that usually decides a round is the middle one. Going from 4.3x to 2.9x is where an edge or a corner enters the frame, and an edge gives you a silhouette, which is what recognition actually runs on.",
        ],
      },
      {
        heading: 'Where the photographs come from',
        body: [
          "Each object is keyed to an English Wikipedia article chosen for a clean, well-lit lead photograph — the kind that survives being magnified this far. The image is fetched at play time from Wikimedia's pre-rendered 1280px width, which is about a fifth of the bytes of the original and holds up fine under a 6.5x crop.",
          "This is also the game that survives a dead network. Every object carries an emoji as a stand-in, and if Wikipedia cannot be reached the round zooms into that instead. It is a worse game and a completely playable one.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds, five rungs: 1000, 620, 380, 240, 150. A wrong guess costs a rung, and because the answer list is 109 items long and searchable, the temptation to fire off near-misses is strong. Typing a category into the search box to see what exists is free; submitting one is not.",
        ],
      },
    ],
  },
  {
    path: 'games/animal',
    gameSlug: 'animal',
    title: 'Guess the Animal',
    description:
      'One patch of coat, feather or scale at 8x. What pattern geometry gives away long before an eye or a beak comes into frame.',
    intro: [
      "The round opens on a patch of animal magnified eight times, which is generally not enough of it to be a body part. It is a pattern: spots, bars, a gradient, or a field of one colour with a texture in it.",
      "Pattern is enough far more often than people expect. Most of the 94 animals in the deck are identifiable from their markings alone by the second or third rung, well before anything anatomical arrives.",
    ],
    sections: [
      {
        heading: 'Reading a pattern',
        body: [
          "The big cats are the clearest lesson. A jaguar's rosettes have spots inside them; a leopard's rosettes are empty; a cheetah's spots are solid and round. All three read as orange with black marks at low magnification and separate cleanly the moment you look at what is inside the marks.",
          "Stripes carry direction and spacing. A tiger's are vertical, irregular and taper to points; a zebra's are broader, and the pattern on the rump differs by species. Bars that run across a feather rather than along it mean a bird of prey or a game bird.",
          "Then the substrate. Fur has depth and a soft edge; feathers resolve into parallel barbs with a visible shaft; scales are hard-edged, repeating and reflective. Amphibian skin is the odd one out — wet, slightly translucent, and often intensely saturated, which is a poison dart frog and almost nothing else in this pool.",
        ],
      },
      {
        heading: 'What the deck actually contains',
        body: [
          "94 animals, and despite the name they are not all mammals: the list runs through birds, reptiles, amphibians, insects and a substantial marine section. A blue-white field with a soft mottle is as likely to be a beluga-adjacent whale flank as anything terrestrial, and a very regular hexagonal pattern is a honeycomb-scaled reptile rather than a mammal.",
          "That breadth is worth internalising because it changes your priors. If a crop looks like nothing that grows on a mammal, stop trying to make it one.",
        ],
      },
      {
        heading: 'The ladder',
        body: [
          "8x, 5x, 3.2x, 2x, 1.3x. The second rung is where the pattern gains a boundary — the edge of a stripe field, the transition from flank to belly — and the fourth is where an eye, an ear or a beak usually appears. The reveal shows the whole photograph with Wikipedia's own one-line description under it.",
          "Photographs come from species articles on Wikipedia, which lead with a single clear picture of the animal. Genus and family pages tend to lead with a range map or a plate of engravings, which is no use at all, so the seed list points only at species.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380, 240 and 150. A strong run is one where you are committing on the second rung: the first is genuinely hard, and the difference between 620 and 380 across ten rounds is the difference between a good score and an average one.",
        ],
      },
    ],
  },
  {
    path: 'games/bird',
    gameSlug: 'bird',
    title: 'Guess the Bird',
    description:
      'A patch of plumage at 5x, pulled back to 1.2x. Barring, iridescence and bill colour, and why the beak arrives last.',
    intro: [
      "Five times into a photograph of a bird is usually one patch of feathers — a few dozen barbs, a colour, and whatever pattern the colour is arranged into. The ladder is gentler than the animal game's because plumage is finer-grained than fur, and a deeper crop would be barbs and nothing else.",
      "84 birds, from every continent including Antarctica. For a good third of them the identifying feature is the bill, which means the whole round is a wait for the frame to reach the front of the head.",
    ],
    sections: [
      {
        heading: 'Barring, streaking and structural colour',
        body: [
          "Marks that run across the feather are barring; marks that run along it are streaking. Barring is common in owls, hawks and game birds; streaking belongs to a lot of small brown passerines. A single bold band across an otherwise plain feather field is often a wing bar, which places you on the folded wing rather than the breast.",
          "Iridescence is the most useful signal in the game and the easiest to spot. Pigment colour is flat and consistent; structural colour shifts hue across the same feather and produces an oily sheen — the neck of a common starling, the head of a mallard, the whole body of a hummingbird. If a crop changes hue as it curves, you are looking at structural colour, and that eliminates most of the deck.",
          "Black and white in hard-edged blocks with no intermediate tone is a seabird tell: penguins, puffins, gannets, auks. Four penguin species and two puffins are in the pool, and telling them apart is a matter of where exactly the white stops.",
        ],
      },
      {
        heading: 'When the bill arrives',
        body: [
          "The last two rungs are where a beak or an eye usually enters the frame, and for the birds that are mostly beak — toucan, shoebill, hornbill, sword-billed hummingbird, spoonbill — that is effectively the answer arriving. Recognising that a round is one of those early is useful: if the first two rungs are an unremarkable field of one colour, the interesting part of the bird is somewhere else in the picture and you are better off buying rungs quickly than staring.",
          "Bare skin is another shortcut. A patch of unfeathered colour — a wattle, a facial patch, a bill base — is bright, smooth and unlike anything else on a bird, and only a few dozen species have one worth photographing.",
        ],
      },
      {
        heading: 'The ladder and the source',
        body: [
          "5x, 3.4x, 2.4x, 1.7x, 1.2x. The reveal caption gives the bird's name and where it lives, which is the part worth reading if you are playing this to learn rather than to score: the deck spans 61 different range descriptions, from the Arctic to sub-Antarctic islands to whichever city you happen to be in.",
          "Photographs come from Wikipedia species articles, which lead with one clean picture of the bird. Family and genus pages were avoided because they tend to lead with a range map or a plate of nineteenth-century engravings.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds, five rungs, 1000 down to 150. Wrong guesses cost a rung, and with 84 similar-sounding names in the search box that matters — plenty of pairs in this deck differ by one word, and guessing the wrong puffin is as expensive as guessing a duck.",
        ],
      },
    ],
  },
  {
    path: 'games/insect',
    gameSlug: 'insect',
    title: 'Guess the Insect',
    description:
      'Macro photographs cropped closer: 4x down to 1.15x. Counting legs, reading eyes, and telling a beetle from a bug.',
    intro: [
      "This ladder starts gentler than the other zoom games, at 4x rather than 7x or 8x, and there is a reason. These are macro photographs to begin with — a specimen already filling the frame — so magnifying one four times lands you on a single eye or one segment of a leg. Anything deeper is abstract art.",
      "65 species, and the word insect is doing some work: eight spiders and three scorpions are in there too, which is the single most common way a round is lost.",
    ],
    sections: [
      {
        heading: 'Count what you can see',
        body: [
          "Legs are the first check and they are visible at surprising magnification. Six legs and a body in three parts is an insect; eight legs, no antennae and a body in two parts is an arachnid. If you can see a leg joint at all, count what is attached to it before you name anything.",
          "Eyes are the second check. Compound eyes are a dome of hexagonal facets and belong to insects; the facet size itself is informative, because a dragonfly's are tiny and enormous in number. Jumping spiders have a pair of huge forward-facing simple eyes, which at this magnification is unmistakable and is one of the easier rounds in the deck.",
          "Then the wings, if any are in frame. Hard, shining wing cases meeting in a straight line down the back are elytra, which means beetle — ten of the 65 are beetles. Scales that shed colour like dust mean butterfly or moth. Clear, veined, membranous wings mean fly, bee, wasp or dragonfly, and the vein pattern is genuinely diagnostic if you know it.",
        ],
      },
      {
        heading: 'Moth or butterfly, bee or hoverfly',
        body: [
          "The two questions this deck asks most often have reliable answers. Moths tend to have feathered or comb-like antennae and a furry thorax; butterflies have clubbed antennae and a smoother body. The pool holds eight butterflies and four moths, and the Atlas moth and Luna moth are large enough that a crop of wing edge alone gives away the scale.",
          "Bee versus hoverfly is a wing count and an eye check — the marmalade hoverfly in the deck is a fly wearing a wasp's colours, which is the entire point of it. Wasps have a hard, shiny, hairless body; bees are furry. At 4x that difference is the most obvious thing in the frame.",
        ],
      },
      {
        heading: 'The ladder and the deck',
        body: [
          "4x, 2.9x, 2.1x, 1.6x, 1.15x — the shallowest final rung of any of the zoom games, because a macro photograph at 1.15x is still a close-up.",
          "The 65 species break down as ten beetles, eight butterflies, eight spiders, four moths, four true bugs, four flies, three bees, three wasps, three scorpions and a long tail of ants, mantises, stick insects, grasshoppers and lacewings. Species articles were used wherever possible; family pages were only kept where the lead image is still one clear specimen rather than a plate of a dozen.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380, 240 and 150, with up to 160 for speed and a streak multiplier rising to 2×. This is a good game to play slowly: the speed bonus is worth less than a rung, and one careful look at leg count beats three fast guesses.",
        ],
      },
    ],
  },
  {
    path: 'games/plant',
    gameSlug: 'plant',
    title: 'Guess the Plant',
    description:
      'A leaf, a petal or a piece of bark at 7x. Venation, margins and trichomes, and why the flower shows up last.',
    intro: [
      "Seven times into a photograph of a plant is a vein, a thorn, one edge of a petal, or a patch of green with a texture on it. Green is the problem: a large fraction of the 74 plants in the deck are green at the first rung, and telling them apart means reading structure rather than colour.",
      "The good news is that plant structure is unusually legible. Leaf architecture is close to a fingerprint, and it survives magnification better than almost anything else in the zoom games.",
    ],
    sections: [
      {
        heading: 'Read the veins',
        body: [
          "Parallel veins running the length of the leaf mean a monocot: grasses, palms, bamboo, orchids, bulb flowers, banana. Branching veins in a net mean everything else. That single distinction splits the deck almost in half and it is visible in a crop that contains no leaf edge at all.",
          "Then the margin, if you can see one. Smooth-edged leaves, toothed leaves, lobed leaves and needles are four different worlds. A deeply lobed leaf with points is a maple; a compound leaf with leaflets radiating from one point is a horse chestnut; needles in bundles are pines.",
          "Surface texture is the third read. A waxy cuticle that reflects the light in a hard sheen means a plant built for drought — succulents, agave, aloe. Dense hairs, called trichomes, catch light as a soft halo at the leaf edge and belong to sundews, sensitive plants and a lot of the Mediterranean shrubs. Sundew trichomes end in a visible bead of glue, which is one of the prettiest rounds in the game and also one of the easiest.",
        ],
      },
      {
        heading: 'Bark, and the plants that are not leaves',
        body: [
          "Twenty of the 74 are trees, and for a tree the crop often lands on bark rather than foliage. Bark is more distinctive than people assume: birch peels in horizontal papery strips, plane trees shed in irregular plates, baobab is smooth and swollen, and giant sequoia is deeply fibrous and reddish. If you land on bark, stop looking for a leaf.",
          "The deck also holds four carnivorous plants, three cacti, three succulents, two aquatic plants and a handful of oddities — welwitschia, living stones, rafflesia, titan arum. Those are the rounds where the first rung looks like something that should not be a plant at all, which is itself the clue.",
        ],
      },
      {
        heading: 'The ladder',
        body: [
          "7x, 4.5x, 3x, 2x, 1.3x. The flower, when there is one, tends to appear only on the last rung or two, so a round where you can see a petal early is a round where the photograph was of a flower to begin with.",
          "Two rules decided what got into the seed list. The article has to lead with a photograph — a lot of older botany articles lead with a nineteenth-century Köhler engraving, and a 7x crop of an engraving is a guessing game about ink. And the photograph has to be of the living plant rather than the produce, which is why the fruit articles whose lead image is a bowl on a kitchen counter are absent.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds, five rungs, 1000 down to 150. The reveal caption names the plant and what kind it is, which over a few runs teaches the categories the game is actually testing: 20 trees, 8 flowering plants, 7 shrubs, 5 climbing vines and a long tail of everything else.",
        ],
      },
    ],
  },
  {
    path: 'games/landmark',
    gameSlug: 'landmark',
    title: 'Guess the Landmark',
    description:
      'A patch of stone or steel at 7x from a building millions of people have photographed. Reading material, tooling and light.',
    intro: [
      "A place that appears on a hundred million postcards, cropped down to a patch of its surface. At 7x you get masonry, ironwork, glass or rock, and the round is a question about material and craft rather than about travel.",
      "80 landmarks, all chosen for a lead photograph that shows the whole structure in daylight. That constraint matters: a night shot or a detail photograph would make the last rung as unreadable as the first.",
    ],
    sections: [
      {
        heading: 'Stone tells you the century',
        body: [
          "Limestone weathers to a warm sand colour and erodes in soft rounded edges — Giza, the Colosseum, Petra. Marble stays white or grey-blue, holds a crisp arris where two faces meet, and streaks vertically where rain has run down it: the Parthenon, the Taj Mahal, the Washington Monument. Granite is speckled at close range and refuses to erode at all.",
          "Tooling is as informative as the rock. Massive blocks with fine drafted margins and no mortar line are ancient monumental masonry. Regular small courses with visible mortar are medieval or later. Machine-cut ashlar with joints under a millimetre is nineteenth century or newer.",
          "Red sandstone is a small and useful club: Petra, Uluru, the Grand Canyon and the walls of a couple of Indian monuments. If the crop is red rock, decide first whether you are looking at something carved or something natural — the tool marks are usually visible at 7x.",
        ],
      },
      {
        heading: 'Metal, glass and the modern half of the deck',
        body: [
          "Riveted wrought-iron lattice, painted brown, is the Eiffel Tower and essentially nothing else in the deck. Suspension-bridge cable wrapped and painted is the Golden Gate or the Brooklyn Bridge, and the two differ in colour and in what the towers are made of — one steel, one masonry.",
          "Modern glass curtain wall is harder, because a crop of tinted glazing looks the same in Dubai and Kuala Lumpur. Look for the mullion spacing and the shape of the reflection: the Burj Khalifa's facade steps inward, the Petronas Towers have a strongly repeated Islamic geometric motif in the plan, and Marina Bay Sands is horizontal where the others are vertical.",
          "Copper that has gone green is the Statue of Liberty. Polished steel spheres are the Atomium. These are the rounds worth taking at the first rung, because you will not do better by waiting.",
        ],
      },
      {
        heading: 'The ladder and the deck',
        body: [
          "7x, 4.5x, 3x, 2x, 1.3x. Buildings survive a shallower crop than paintings do, because brick reads as brick — the useful information arrives early and the shape arrives late.",
          "The 80 landmarks are weighted towards the ones with a genuinely famous surface: a large European block, a dozen in the United States, and a long run through Mexico, Peru, Brazil, Egypt, Jordan, the Gulf, India, China, South East Asia, Japan, Australia and southern Africa. The reveal names the landmark and where it is.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380, 240 and 150, plus up to 160 for a fast answer. The second rung is usually where a structural edge enters the frame, and an edge is worth more than another 4x of the same wall — if the first rung is featureless, buy immediately rather than studying it.",
        ],
      },
    ],
  },
  {
    path: 'games/skyline',
    gameSlug: 'skyline',
    title: 'Guess the City',
    description:
      'A skyline at 6x, pulled back to 1.2x. Reading glass, air conditioning, water tanks and the mountains behind a city.',
    intro: [
      "Six times into a photograph of a city is a few windows, a bit of roof, and whatever the light is doing that day. The ladder is deliberately shallower than the object or landmark games because city photographs are usually montages, and a deeper crop lands inside a single pane of glass and tells you nothing at all.",
      "61 cities, weighted hard away from Europe and the United States. A deck that is half European capitals is a deck about spires, and this one is mostly Asia, Africa, the Gulf and Latin America — Ulaanbaatar, Accra, Dar es Salaam, Almaty, Caracas, Karachi.",
    ],
    sections: [
      {
        heading: 'What a facade tells you',
        body: [
          "Air conditioning units hanging on the outside of a building are one of the strongest signals available. Where you see them in dense grids across residential blocks you are in South or South East Asia, the Middle East or parts of Latin America; you will almost never see them on a Japanese, Korean or Gulf tower of the same vintage. Rooftop water tanks — black plastic in Brazil, stainless steel in India, dark cylinders in Mexico City — are similarly regional.",
          "Glass tint dates a building. Bronze and heavily mirrored glazing is 1970s and 1980s; the very flat blue-green of low-iron glass is post-2000. A Gulf skyline is mostly the latter, because most of it was built after 2000.",
          "Balconies are the other giveaway. Continuous balconies wrapped around every floor mean a warm climate and residential use; none at all means an office district. A wall of small individual balconies with laundry on them narrows the world down considerably.",
        ],
      },
      {
        heading: 'Look past the towers',
        body: [
          "Most of these cities are more identifiable by what is behind them than by what is in front. Mountains rising straight out of the urban edge belong to a short list: Santiago, Cape Town, Kathmandu, Tehran, Almaty. A single flat-topped mountain is Cape Town and nothing else.",
          "Water is the other frame. A harbour full of ferries, a river bending through the middle, a lagoon, a beach line running into towers — the geometry of the waterfront separates Hong Kong from Singapore from Rio faster than any building does.",
          "Haze is worth reading rather than cursing. A pale, low-contrast, warm-grey atmosphere is characteristic of the big South Asian and Chinese cities in the deck and effectively rules out the Gulf, where the haze is dust-coloured and the light is harder.",
        ],
      },
      {
        heading: 'The ladder and the source',
        body: [
          "6x, 4x, 2.8x, 1.8x, 1.2x. City articles on Wikipedia normally lead with a skyline shot or a montage of one, which is what the zoom crops into — though a few lead with the city's single best-known building instead, so a round can turn on a roofline rather than a river bend.",
          "Two entries do not point at the city's own article. Singapore and Hong Kong are territories as well as cities, and those articles lead with a flag, so the city-centre article is used instead. The answer is still the city.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380, 240 and 150. The reveal gives the city and the country, and playing this deck through twice is a reasonable way to discover how much of the world's urban population lives in places you could not have named.",
        ],
      },
    ],
  },
  {
    path: 'games/outline',
    gameSlug: 'outline',
    title: 'Guess the Country by Outline',
    description:
      'A map of one country behind 24 solid windows, three of them open. Why coastline beats everything inland.',
    intro: [
      "A map sits behind a panel of 24 windows and three are open to start. Usually that is one stretch of border and two of nothing, because two thirds of a map's area is not near an edge and the edges are the entire question.",
      "The unopened area is solid rather than blurred, and that is a deliberate correction. Blur leaves a silhouette perfectly readable, and for a map the silhouette is the answer — the same mistake as blurring a flag and leaving its colour layout intact.",
    ],
    sections: [
      {
        heading: 'Coastline first, always',
        body: [
          "An open window on a coast is worth three inland. Coastlines are irregular in ways that are close to unique: a fjord field is Norway or Chile, a river delta bulging into the sea is Bangladesh or Egypt, a hooked peninsula is Malaysia or Denmark.",
          "Straight borders are the opposite kind of information and just as useful. Long ruler-straight lines mean a border drawn by a colonial administration rather than by a river or a mountain range, which puts you in Africa, the Middle East or western North America. A country made mostly of straight lines with one wiggly edge is a short list.",
          "Islands are the cheapest win in the game. If an opened window contains sea with small land fragments in it, you are looking at an archipelago — the Philippines, Indonesia, Japan, Fiji, the Caribbean — and you can usually name it from the spacing and orientation of the fragments alone.",
        ],
      },
      {
        heading: 'The frame is a clue',
        body: [
          "The frame shape is not decoration. Thirty-eight of the 68 maps are wider than they are tall and thirty are taller than they are wide, and each seed carries its own orientation because the frame crops to fill: a 950 by 2132 map of Chile in a landscape frame shows the middle third of the country and throws the answer away.",
          "Which means a portrait frame has already told you something before a single window opens. Chile, Norway, Sweden, Italy, Vietnam, Japan, Malawi-shaped countries — the tall ones are a distinct set, and so are the wide ones.",
        ],
      },
      {
        heading: 'Where the maps come from',
        body: [
          "Not from the country article. On Chile, Italy, Japan and most of the rest, the lead image on the country's own Wikipedia page is the flag, which would make this the flag game with extra steps. The seeds point at Geography of X instead, which usually leads with a topographic or locator map, and where that fails — Ethiopia and DR Congo lead with landscape photographs — at the administrative-divisions article, which leads with an outline of the country cut into its internal borders. That is just as good a shape to guess from and occasionally better.",
          "Countries whose best available image was a raw satellite photograph with no drawn coastline — Turkey, Thailand, Iceland, Denmark, Estonia — were left out rather than shipped as an unguessable rectangle of terrain.",
        ],
      },
      {
        heading: 'The ladder and scoring',
        body: [
          "3 windows, then 7, 12, 18 and all 24. The cells open in a fixed pseudo-random order seeded by the round, so the same country always reveals itself the same way.",
          "Ten rounds at 1000, 620, 380, 240 and 150. Twelve windows is half the panel and is normally enough for anyone who can picture the shape; if you cannot picture the shape, the last two rungs will not save you, so this is a game where an early skip to salvage 380 is often the right call.",
        ],
      },
    ],
  },
  {
    path: 'games/celebrity',
    gameSlug: 'celebrity',
    title: 'Guess the Celebrity',
    description:
      'A face behind a 9px blur, and only three chances. What survives a blur — and it is not the eyes.',
    intro: [
      "A portrait behind a nine-pixel blur, then four, then one and a half. Three rungs is the shortest ladder in the whole set, which makes this the least forgiving game here: one wrong guess costs a third of your chances.",
      "119 faces — screen actors from the silent era to last year, musicians, athletes and a handful of other public figures. The pool is broader than the name suggests, and expecting only actors is how people lose rounds.",
    ],
    sections: [
      {
        heading: 'What survives a blur',
        body: [
          "Not the eyes. A blur destroys fine detail first, and the features people think they recognise faces by — eye shape, mouth, the details of a nose — are the first things to go. What survives is low-frequency information: the outline of the hair, the width of the jaw, the relationship between the darkness of the hair and the darkness of the skin, and where the shadows fall.",
          "So read the silhouette. Hair volume and hairline shape are the strongest signals at the first rung, followed by facial hair, glasses and the angle of the head. A very high contrast between a pale face and dark hair, with a hard shadow under the jaw, is a studio portrait; a soft even wash is a red-carpet photograph shot with a flash.",
          "The image itself dates the subject. Black and white with heavy contrast and a soft focus is a mid-century studio portrait, which narrows the field to about a dozen people in this deck. A slightly grainy colour photograph with saturated skin tones is 1970s or 1980s. Modern press photography is sharp, cool and evenly lit even under nine pixels of blur.",
        ],
      },
      {
        heading: 'Three rungs, no more',
        body: [
          "9px blur, 4px, 1.5px, and each rung also pulls the image in slightly — 1.26x, 1.14x, 1.05x — because a blur samples beyond the edge of the picture and without that overscan the outer band of the portrait fades into the background.",
          "At 4px most people are recognisable if you already had a candidate in mind, and at 1.5px almost everyone is. The game is therefore really played at the first rung, and the correct instinct is to name the shortlist out loud before buying anything: which four people have that hair.",
        ],
      },
      {
        heading: 'Who is actually in the deck',
        body: [
          "About half the pool is film: Meryl Streep and Tom Hanks through to Lupita Nyong'o and Margot Robbie, with a substantial international section — Toshiro Mifune, Michelle Yeoh, Tony Leung, Shah Rukh Khan, Amitabh Bachchan — and a classical block from Chaplin and Bogart to Sidney Poitier. Then roughly thirty musicians, twenty athletes, and a short tail of Musk, Gates, Jobs, Obama, Attenborough, Hawking and Mandela.",
          "Actor articles turn out to be the most fragile seeds in the project. A bare name is very often a disambiguation page — Chris Evans is a British broadcaster first — and a fair number of working actors have no freely licensed photograph at all. Every title in the list was checked against the live Wikipedia summary API for a real page with a real lead image.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds and three rungs: 1000, 620, 380. That is the whole ladder, so the arithmetic is unusually brutal — two wrong guesses puts you on the last rung with 380 at stake, and a third ends the round at zero.",
          "The compensating factor is the speed bonus. Recognising a face is instantaneous when it happens, and answering inside a couple of seconds is worth an extra 150 or so, which across ten rounds is worth more than a rung.",
        ],
      },
    ],
  },
  {
    path: 'games/videogame',
    gameSlug: 'videogame',
    title: 'Guess the Video Game',
    description:
      'Box art behind 48 tiles, two open to start. Reading platform, era and art direction before the logo appears.',
    intro: [
      "Cover art behind a grid of 48 tiles, of which two are open. The logo is normally the last thing to appear, which means the art has to do the work — and cover art is a more legible historical document than it gets credit for.",
      "62 games spanning 1978 to 2023, from Space Invaders to Baldur's Gate 3. The deck is heavy on the canonical ones, because a tile game only works when the picture underneath is something you have seen before.",
    ],
    sections: [
      {
        heading: 'Date the cover before you name it',
        body: [
          "Early 1980s covers are illustration, usually airbrushed, usually against black, with the title set in a chunky geometric typeface — the art frequently depicts something the game could not render. Mid-1990s covers move to rendered 3D against a gradient, which has aged worse than anything else in the medium. Late 2000s onwards is a photographic composite, desaturated, with the protagonist facing the camera in the lower third.",
          "Platform trade dress is worth learning because it occupies the frame edges, which is where a lot of the tiles land. A coloured band across the top of the box, a rating badge in a bottom corner, a publisher logo in the other one. Two tiles on a flat white ground with a small coloured strip is a different game from two tiles of dark painted sky.",
          "Art direction identifies studios faster than characters do. Bright saturated primaries with clean outlines are Nintendo. Almost monochrome browns and greys with a single light source are FromSoftware. A hand-painted watercolour look is Japanese role-playing. A rubber-hose cartoon in black and white is exactly one game in this deck.",
        ],
      },
      {
        heading: 'How the tiles behave',
        body: [
          "2 tiles, then 6, 13, 24 and 36 out of 48. The unopened area stays blurred rather than solid, so composition and colour mass are visible from the start — that blur is doing more for you than it looks, because the arrangement of light and dark on a cover is often enough by itself.",
          "The frame shapes itself to whatever the round actually loaded. Of the 62 titles, 51 are portrait, four are square and seven are landscape, running from a 0.60:1 box to League of Legends at 2.6:1 and Pokemon Red and Blue as a 3:1 wordmark. A fixed cover frame threw away three quarters of those last two, and the tiles then opened onto blank letterbox bars instead of onto artwork.",
        ],
      },
      {
        heading: 'Where the covers come from',
        body: [
          "The lead image on a Wikipedia game article is almost always the cover, and almost always a non-free file kept deliberately small — a few hundred pixels wide. That resolution is exactly why this deck is played through tiles instead of a zoom: magnifying a 300px cover thirteen times is unreadable mush, whereas tiles work at any resolution and read as a game rather than as an effect.",
          "Franchise articles carry no cover art, so games that redirect to a series page — Minecraft, Fortnite, Undertale, Fall Guys — are absent rather than shipped as a round with no picture.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds, five rungs: 1000, 620, 380, 240, 150. Thirteen tiles is the rung where most rounds are actually decided, and it costs 620 points to get there. Because a wrong guess costs a rung, the cheap move is to open the next rung rather than gamble on a series where you are unsure which entry you are looking at.",
        ],
      },
    ],
  },
  {
    path: 'games/boardgame',
    gameSlug: 'boardgame',
    title: 'Guess the Board Game',
    description:
      'Box art and boards behind 48 windows, two open. Five thousand years of the genre, from backgammon to Wingspan.',
    intro: [
      "Two windows onto a blurred picture, and the picture is either box art or a photograph of a board. Which of those it is happens to be the first useful thing you learn, and it is usually legible through the blur before a single window opens.",
      "56 games, and the range is genuinely five thousand years: backgammon at around 3000 BC, go at about 500 BC, xiangqi, dominoes, checkers, shogi and chess before printing, and then everything from Monopoly in 1935 to Wingspan in 2019.",
    ],
    sections: [
      {
        heading: 'Board or box',
        body: [
          "Anything published since roughly 1990 leads with box art. Everything older leads with a photograph of the board or the pieces, because that is the image its Wikipedia article carries. A wooden board and a cardboard box read very differently through a blur, which is why this game blurs the unopened area instead of blanking it.",
          "If it is a board, count and shape the grid. An 8x8 chequered grid is chess or checkers, and the pieces separate them instantly. A 19x19 grid of intersections with black and white stones is go. A grid with a river across the middle is xiangqi. Points arranged in triangles around a bar is backgammon. A cross-shaped track is ludo, and a ladder painted over squares is exactly what it sounds like.",
          "If it is a box, era-date the graphic design. Mid-century American games have a photograph of a delighted family or a bold flat illustration with a heavy sans-serif logo. Modern European designer games have a painted scene, a logo in the top-left corner, and small icons along one edge — Catan, Carcassonne, Agricola, Wingspan all follow that grammar.",
        ],
      },
      {
        heading: 'The ambiguity is real',
        body: [
          "The old games are where rounds are lost. A wooden grid and a handful of turned pieces could be any of six things, and no number of extra windows resolves it if you have not identified the grid geometry. The move there is to open windows quickly and cheaply until one lands on the pieces rather than the board, since piece shape separates shogi from chess from xiangqi immediately.",
          "The modern games are the opposite: they give up their logo early, and once the typeface is visible the round is over. If two windows land on a corner with lettering in it, commit.",
        ],
      },
      {
        heading: 'The ladder and the deck',
        body: [
          "2 windows, then 6, 13, 24 and 36 out of 48, opened in a fixed order per round. The frame shapes itself to the picture, because box art is not one shape and a fixed frame letterboxes it — after which windows near the edge open onto blank bars instead of onto the game.",
          "The 56 titles were each checked against Wikipedia for a real lead image. Operation, Betrayal at House on the Hill and Clue: The Great Museum Caper were dropped because their articles carry none. The four games older than printing use the conventional approximate date for the game in something like its modern form, rendered as BC in the reveal caption.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380, 240 and 150. This deck rewards breadth over depth: knowing that Hive, Blokus, Dixit and Splendor exist is worth more here than knowing any of them well, because the round is decided by the picture rather than by the rules.",
        ],
      },
    ],
  },
  {
    path: 'games/logo',
    gameSlug: 'logo',
    title: 'Guess the Logo',
    description:
      'A brand mark behind 24 windows, two open. Which companies are identifiable from a single patch of flat colour.',
    intro: [
      "Two windows onto a company logo, which usually means one patch of flat colour and part of one letter. Everything else is solid — not blurred, because blurring a mark leaves its colours and its layout entirely legible, and for a lot of logos that is the whole answer.",
      "42 brands across 25 sectors, from Apple and WhatsApp to Bayer, 3M and Nivea. Wordmarks give themselves up early. The marks that are only a shape can take all five rungs.",
    ],
    sections: [
      {
        heading: 'Brands you can name from one colour',
        body: [
          "A few are genuinely identifiable from a single flat swatch. Brown is UPS — nobody else in commercial branding wants it. A deep flat blue with white on it is Nivea. A specific mid-green is WhatsApp, and the only other green in the deck is the Bayer cross, which is a word written twice, horizontally and vertically, sharing its Y.",
          "Colour pairs are nearly as good. Yellow on red with a curve in it is McDonald's. Blue with a yellow burst is Walmart. Two interlocking circles in red and orange is Mastercard. Concentric red rings on white is Target. Red with white script is Kit Kat, and red with a white slab-serif capital is 3M or Lego depending on whether there is yellow in the frame.",
          "The ones that resist are the monochrome marks: Apple, Nike, X, Wikipedia's grey globe. A black shape on a light ground gives you outline geometry and nothing else, which is why the backing here is light rather than dark — a great many logos are black on transparent, and on a dark backing those reveal nothing at all.",
        ],
      },
      {
        heading: 'Letterforms are the fastest read',
        body: [
          "When a window lands on type, look at the terminals and the weight rather than trying to read a word. A geometric sans with perfectly circular Os is one family of brands; a serif with high contrast between thick and thin strokes is a luxury or heritage mark; a script is a beverage, a cosmetic or a car from before 1970.",
          "Custom letterforms are their own signal. A lowercase letter with an unusual bowl, a ligature between two characters, a letter with a piece cut out of it — these are drawn rather than set, which means a serious brand rather than a small one, and there are only 58 of those here.",
        ],
      },
      {
        heading: 'The ladder',
        body: [
          "2 windows, then 5, 9, 14 and 20 out of 24, in a fixed order per round. Nine windows is where a wordmark usually becomes readable and where an abstract mark usually becomes a shape rather than a fragment.",
          "The frame is landscape and the mark is fitted inside it rather than cropped to fill, because logos range from tall roundels to very wide wordmarks and cropping takes the identifying part off both.",
        ],
      },
      {
        heading: 'Where the images come from',
        body: [
          "Every mark is the lead image of that company's English Wikipedia article, which is less reliable than it sounds: plenty of company articles lead with a photograph of the headquarters, a shop front, a founder or a product. Nike's opens on its Beaverton campus, Microsoft's on an aerial view of Redmond, Coca-Cola's on a bottle. Every title in the list was checked and kept only where the lead image is actually the mark; where a dedicated article for the mark exists, that is used instead, as with Swoosh for Nike. Everything else was dropped rather than fudged.",
          "The second filter is stricter and is why the deck is 42 brands rather than 58. English Wikipedia hosts a great many logos locally under its own fair-use rationale, and that rationale covers an encyclopedia's use, not an ad-supported game hotlinking the same file. Wikimedia Commons accepts only freely licensed or public-domain media, so the rule here is simple: if the file the loader ends up fetching lives on Commons it stays, and if it lives on English Wikipedia it goes. Sixteen entries failed that test, eleven of them outright non-free and four more public domain in the United States alone. Instagram went for a different reason — its article now leads with a screenshot of the app rather than the mark, which made the round unplayable anyway.",
          "Naming a brand from its mark is nominative use. The marks are shown as published, unaltered apart from the reveal, and no endorsement is implied by any of it.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380, 240 and 150. Because the answer list is 42 items and searchable, the useful discipline is to type a sector rather than a guess — seeing that the deck holds exactly three airlines, five car marques and five film and television companies is free, and narrowing three candidates to one before submitting is what separates a 7,000 from a 4,000.",
        ],
      },
    ],
  },
  {
    path: 'games/app',
    gameSlug: 'app',
    title: 'Guess the App',
    description:
      'A phone icon behind an 80-pixel blur, sharpening in four steps. Colour, glyph count and the grammar of icon design.',
    intro: [
      "An app icon under eighty pixels of blur, which is enough to reduce a 512-pixel square to about four colours and a curve. Each rung sharpens it: 42, then 20, then 8, then one and a half.",
      "89 apps, which is to say the home screen almost everyone has, plus the ones that are enormous in a country you may not live in. Icons are designed to be legible at 60 pixels on a shelf of sixty others, and that constraint is exactly what makes them guessable through a blur.",
    ],
    sections: [
      {
        heading: 'The first rung is a colour and a layout',
        body: [
          "At 80px of blur, what survives is the average colour of the icon and the rough position of its mass. That is more than it sounds. A saturated green square with a lighter mass at the centre is a small club: Spotify, WhatsApp, Cash App, Duolingo, Grindr. A yellow ground with a white shape is Snapchat. A vivid magenta-to-orange wash is Instagram. Blue with a white glyph in the middle is the largest family and the hardest.",
          "Where the mass sits matters as much as its colour. An icon with a single centred glyph on a plain ground blurs to a soft blob dead centre; an icon that is a photograph or a scene blurs to something with structure in the corners. A white ground with a small coloured mark floating in the middle of it is the design language of Google's apps, and there are seven of those in the deck.",
          "Count the colours if you can. Four distinct colours in a compact arrangement is Google or Microsoft. Two flat colours with a hard edge between them is a fintech or a utility. A full spectrum gradient is a creative tool.",
        ],
      },
      {
        heading: 'What the sharpening steps give you',
        body: [
          "80, 42, 20, 8, 1.5 pixels of blur. The second rung is where a glyph acquires an outline, and the third is where you can count the strokes in it. By 8px almost any icon is nameable if you have seen it, which means the game is really decided on the first two rungs.",
          "Each rung is also drawn slightly oversized — 1.34x down to 1.02x — because a CSS blur samples transparency beyond the edge of the image, and without that overscan an 80px blur fades the outer band of the icon into the page and the whole thing reads as a vignette rather than as an icon.",
        ],
      },
      {
        heading: 'Where the icons come from',
        body: [
          "The App Store's own search API, keyless, at 512 pixels square. Every name and seller pair in the seed file was checked against it and resolves to a real icon.",
          "The seller field is the interesting part of that list, because it is not always the brand: Venmo is filed under The Delancey Corporation, Amazon under AMZN Mobile, Instacart under Maplebear. Names are trimmed to the part everyone uses, and the lookup accepts a longer store title only when it starts with that — so Telegram finds Telegram Messenger, while Signal never matches Signal Booster Pro. Apps that only exist under a name nobody would type, or that have left the US store, are deliberately absent.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds, five rungs: 1000, 620, 380, 240, 150. Answering at 80px blur is a genuine gamble and worth taking two or three times a run, because the multiplier on a correct first-rung answer with a live streak is the single biggest number in the game.",
        ],
      },
    ],
  },
  {
    path: 'games/car',
    gameSlug: 'car',
    title: 'Guess the Car',
    description:
      'Ninety years of cars behind a 19-pixel blur. Roofline, glasshouse and stance settle it two rungs before the badge does.',
    intro: [
      "A car photograph under nineteen pixels of blur, sharpening to eleven, then five, then two. Blur rather than zoom, because a car is identified by its silhouette and blurring is the one treatment that takes away the badge and the panel gaps while leaving the shape intact.",
      "78 cars, from a 1906 Rolls-Royce Silver Ghost and a Ford Model T to the Tesla Model S and the Nissan Leaf. Most of them are recognisable from across a car park, which is the standard the list was built to.",
    ],
    sections: [
      {
        heading: 'Read the glasshouse',
        body: [
          "The greenhouse — the glazed area above the waistline — is the most distinctive part of a car and the part that survives blur best. Its length, where it starts and stops, and the angle of the pillars at each end will separate almost any two cars in this deck. A long bonnet, a short deck and a cabin pushed right back is a 1960s grand tourer. A cab-forward shape with the windscreen base ahead of the front axle centre is a modern hatchback or a van.",
          "Then the stance. Ride height, the gap between tyre and arch, and wheel diameter relative to body depth date a car within about fifteen years on their own. Pre-war cars sit high on tall thin wheels; 1970s cars sit low with a deep body and small glass; anything after 2005 has wheels that look a size too big.",
          "Roofline is the tiebreaker. A fastback that runs unbroken from the roof to the tail is a small family. A two-box shape with a vertical tailgate is a hatchback. A hard notch behind the rear window is a saloon, which in this deck is mostly the American section.",
        ],
      },
      {
        heading: 'The photograph is dating itself',
        body: [
          "Blur does not hide the era of the picture. Colour film from the 1970s has a warm cast and blooming highlights; modern press photography is neutral and evenly lit. If the car is photographed on grass at what is obviously a classic show, it is old; if it is on a studio sweep, it is a press shot and therefore probably post-1990.",
          "Headlights blur into bright blobs, which is more useful than it sounds — count them and read their shape. Four round lamps across the nose is an American car of the late 1950s or 1960s. A pair of pop-up lamps means a flat nose with no lamps visible at all, which is its own strong signal and covers a specific slice of 1980s and 1990s sports cars.",
        ],
      },
      {
        heading: 'The ladder',
        body: [
          "19, 11, 5 and 2 pixels of blur — four rungs rather than five, because a car that survives being blurred to 19px is usually named by the third one anyway. The image is fitted whole inside a landscape frame rather than cropped, since squeezing a car into a square frame cuts off the nose and the tail, which is most of what identifies it.",
          "Every entry points at a Wikipedia article for a model rather than a marque. That distinction ate a number of candidates while the list was built: marque articles are about companies, and model-range articles sometimes lead with a specification table rather than a photograph.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds on a four-rung ladder: 1000, 620, 380, 240. The reveal gives the model and its production years, which across a few runs is a decent informal history of the industry — the deck includes a Trabant, a Lada, a Hyundai Pony and a Willys Jeep alongside the Ferraris.",
        ],
      },
    ],
  },
  {
    path: 'games/dish',
    gameSlug: 'dish',
    title: 'Guess the Dish',
    description:
      'A plate at 4.2x. What oil colour, garnish, grain and char tell you about which kitchen the food came out of.',
    intro: [
      "A close crop of a plate at 4.2x, pulled back through 2.4x and 1.5x to the whole thing. The ladder is shallower than the other zoom games for a good reason: food is texture all the way down, and a 16x crop of a curry is the same brown for everybody.",
      "67 dishes from 36 places. What you are actually being asked is not so much what is this as whose kitchen is this, and the answer to the second question usually gives you the first.",
    ],
    sections: [
      {
        heading: 'Oil is the fastest cuisine test',
        body: [
          "Fat colour is the single most informative thing in a close crop of food. Bright red chilli oil pooling at the edge is Sichuan or Korean. Deep golden oil with visible spice sediment is South Asian. A clear green sheen is olive oil, which puts you around the Mediterranean. Clarified butter reads as a pale even film; rendered pork fat is white where it has cooled.",
          "Then the garnish, which is close to a signature. Flat-leaf parsley and lemon is European. Coriander leaf is Latin American, South Asian or South East Asian, and if it arrives with lime rather than lemon you are in the first or third of those. Spring onion cut on a bias is East Asian. Sesame seeds, toasted, are Korean or Japanese. A raw herb salad on the side is Vietnamese.",
          "Dairy is a strong negative signal. Cream, cheese and butter sauces essentially do not appear in the East Asian entries in this deck, so a white sauce with a fat sheen sends you to Europe or to the small set of dishes that fuse the two.",
        ],
      },
      {
        heading: 'Grain, char and vessel',
        body: [
          "Rice is worth learning to read. Long separate grains are Indian, Persian or West African; short round sticky grains are Japanese or Korean; a flat pan-crusted layer is paella or bibimbap depending on what else is in frame. Wheat behaves the same way: hand-pulled noodles, extruded pasta and a laminated pastry are three different worlds and all three are in this deck.",
          "Char tells you the equipment. Discrete parallel grill bars mean a grate; irregular blistering means a very hot oven or a tandoor; an even golden crust means a pan. A blistered puffy edge with black spots is a wood-fired pizza and almost nothing else.",
          "When the frame pulls back far enough to show the vessel, use it. A shallow wide steel pan, a stone bowl, a banana leaf, a paper-lined basket, a lacquered tray — the container is often more distinctive than the food in it.",
        ],
      },
      {
        heading: 'The ladder and the deck',
        body: [
          "4.2x, 2.4x, 1.5x, then the full plate. Four rungs, and the last one really is the whole photograph, which makes the fourth rung more valuable here than in the other zoom games — plenty of dishes are unmistakable in wide shot and anonymous in close-up.",
          "The 67 dishes lean French and Italian at six and five respectively, then China and Japan at four each, and then spread out across Mexico, Korea, the United States, Turkey, Greece, India, Indonesia, Peru, Brazil, Morocco, West Africa, Poland, Hungary, Austria, Switzerland, Quebec and a dozen more. Photographs come from Wikipedia, where food photography is mostly high-resolution volunteer work, which is what a zoom round needs.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380 and 240. The reveal names the dish and where it is from. Playing hungry is not recommended and is entirely your own business.",
        ],
      },
    ],
  },
  {
    path: 'games/sport',
    gameSlug: 'sport',
    title: 'Guess the Sport',
    description:
      'One frame of play at 7x. The surface gives it away before the ball does, and 90 sports is more than you think.',
    intro: [
      "A photograph of play cropped to 7x, which lands on a boot, a bit of kit, or a painted line on the ground. Sport photographs are busy enough that even a deep crop hits something, and what it hits is usually more useful than a wide shot would be.",
      "90 sports: the Olympic programme, plus the games that are enormous in one country and unheard of in the next. Sepak takraw, kabaddi, hurling, shinty, pesäpallo, jai alai, buzkashi and tug of war are all in here.",
    ],
    sections: [
      {
        heading: 'The surface is the answer',
        body: [
          "Start under the players. Sprung hardwood with a heavy varnish and multiple sets of painted lines is an indoor court — basketball, handball, netball, badminton, volleyball, futsal — and the line colours separate them, because a hall painted for three sports uses a different colour for each. Ice is unmistakable and then splits by markings: red and blue lines mean hockey, a set of concentric circles means curling, and a bare sheet means figure or speed skating.",
          "Outdoors, read the grass. Mown stripes on close-cut turf mean football, rugby or cricket; long rough grass at the edge of a shorter area means golf. Clay is orange and leaves marks on the players. Sand means beach volleyball or a throwing pit.",
          "Line width and colour are worth more attention than they get. A single thick white line is field sport marking; thin coloured lines in several directions is an indoor multi-court; a solid painted area with a hard boundary is a key, a crease or a service box.",
        ],
      },
      {
        heading: 'Kit and equipment',
        body: [
          "Protective equipment is a fast classifier. Helmets with a face cage mean ice hockey, lacrosse or American football, and the shoulder padding separates the last from the first two. Bare feet in a white uniform with a coloured belt means judo, taekwondo or karate. Wrapped hands mean boxing or muay thai. No padding, no shoes and a rope area means wrestling or sumo.",
          "Then footwear, which is under-used and highly informative. Studs mean grass. Flat soles with a gum rubber edge mean an indoor court. Skates, boots with a stiff cuff, or cleats bolted to a plate each belong to a single small set of sports.",
          "The ball, when it appears, is often the last thing to help rather than the first — it is small, in motion, and frequently blurred. Do not wait for it.",
        ],
      },
      {
        heading: 'The ladder',
        body: [
          "7x, 4x, 2.4x, 1.4x. Four rungs, and the deepest opening crop of any of the zoom games apart from the animal deck. The final rung is still a slight crop, so a round can end with the answer just outside the frame.",
          "Photographs come from Wikipedia's sport articles, which almost always lead with a wide shot of play. That is exactly what a deep crop needs: kit, pitch markings and equipment all survive the zoom even when the players do not.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380 and 240. Because the deck deliberately includes sports most players have never watched, an honest strategy is to spend rungs freely on the unfamiliar ones and bank the points on the ones you can name from a patch of turf.",
        ],
      },
    ],
  },
  {
    path: 'games/recipe',
    gameSlug: 'recipe',
    title: 'Guess the Recipe',
    description:
      'Half an ingredient list, ordered from the things every kitchen has to the one that gives the dish away.',
    intro: [
      "Four ingredients on screen, and they are the four least helpful ones. Every dish in this deck has exactly eight ingredients listed, ordered from least distinctive to most, so the opening rung is salt, oil, onion and garlic — the things half the world's cooking contains.",
      "That ordering is the whole game. Shuffle a list and each round becomes either instant or impossible; keeping the boring half first means the difficulty ramps rather than flips.",
    ],
    sections: [
      {
        heading: 'Where to look in a list of four',
        body: [
          "Ignore the aromatics and read the fat, the acid and the starch. Butter versus olive oil versus a neutral oil versus coconut milk narrows the world immediately. Vinegar, lime, lemon, tamarind and yoghurt each belong to different kitchens. Rice, wheat flour, corn tortillas, potatoes and noodles are the load-bearing carbohydrate, and there is usually one.",
          "Then look for anything unusually specific in the first four, because the ordering means a specific ingredient appearing early is a strong signal — if a dish needs it enough to rank above onion, it is central to what the dish is.",
          "The last two entries are where the answer lives. Saffron. Miso. Achiote-marinated pork with pineapple. Doubanjiang. Those are placed there deliberately, which is also why buying the last rung so often ends the round instantly.",
        ],
      },
      {
        heading: 'The ladder',
        body: [
          "Three rungs and no written clues: four ingredients, then six, then all eight. It is one of only two games here with a three-rung ladder, so the whole round is worth 1000, then 620, then 380.",
          "The steps are computed from the length of the list rather than hardcoded, so a dish with a different number of ingredients would still divide into half, three quarters and the lot.",
        ],
      },
      {
        heading: 'How the lists were built',
        body: [
          "63 dishes, eight ingredients each, and nothing invented. Where a dish has a canonical version — carbonara, paella valenciana, the various pestos — that is the one described, and where the authentic composition was not certain the dish was left out rather than guessed at. A recipe game that teaches you the wrong recipe is worse than no game.",
          "The spread is 36 origins: five each from Italy, France and Japan, four from Mexico, three each from Greece, Korea and China, and then a long tail through Peru, Brazil, Louisiana, Quebec, Ukraine, Ethiopia, West Africa, the Levant and the Philippines. After the round ends you get a note about the dish — that the vertical spit came to Mexico with Lebanese immigrants, for instance, and the pork and the pineapple are local additions.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds, three rungs: 1000, 620, 380, plus up to 160 for speed and a streak multiplier reaching 2×. With only three rungs, two wrong guesses end a round, so it is worth typing a candidate into the search box and reading what comes back before committing — the guess list is every dish in the file, and seeing the neighbours often changes your mind.",
        ],
      },
    ],
  },
  {
    path: 'games/quote',
    gameSlug: 'quote',
    title: 'Guess Who Said It',
    description:
      'A line somebody famous actually said, and four faces to pick from — all four from the same world.',
    intro: [
      "A quotation on screen and four portraits under it. The three wrong answers are always drawn from the same field as the right one, because a physicist sitting among three footballers is not a question, it is a giveaway.",
      "73 quotations from 63 people across six fields: politics and activism, literature and philosophy, science and invention, technology, sport and art. Politics is the largest block at 21 lines, which is worth knowing before you start eliminating.",
    ],
    sections: [
      {
        heading: 'Everything here is actually attributed',
        body: [
          "The internet is full of quotations hung on the wrong famous name. The Einstein line about insanity being doing the same thing twice, the Gandhi line about first they ignore you, most of what Marilyn Monroe supposedly said — none of it is here, because a quiz that teaches misattributions would be worse than no quiz.",
          "That constraint changes how the game plays. If a line sounds like something a famous person said in a motivational graphic rather than in a book, a speech or an interview, it is probably not in this deck at all, and the line you are looking at is more likely to be dry, specific and slightly awkward — which is what real quotations sound like.",
        ],
      },
      {
        heading: 'Reading a line for its speaker',
        body: [
          "Register is the first cut. A formal periodic sentence with subordinate clauses is a nineteenth-century politician or a novelist. A short declarative with a concrete image is twentieth-century American. Something that sounds like a slogan usually is one, which places it in activism or in technology.",
          "Vocabulary dates a line hard. Words like providence, dominion or virtue place you before 1900. Words like disruption, iteration or leverage place you after 1995 and in exactly one of the six fields.",
          "The four faces are also information. Portraits are pulled from Wikipedia at play time, so you can often date the answer from the photographs alone: three modern press photographs and one nineteenth-century engraving means the engraving is either the obvious answer or the obvious trap, and which of those it is depends on how the line is written.",
        ],
      },
      {
        heading: 'The clue ladder',
        body: [
          "Three clues, each costing a rung. The first names their world — science and invention, politics and activism, and so on — which is only useful when the four faces span more than one field, which happens when a small field like art or sport has to be topped up from elsewhere.",
          "The second gives their role in a few words: physicist, civil rights leader, novelist. The third gives their initials, which with four faces in front of you is almost always decisive.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds, four rungs: 1000, 620, 380, 240. A one-in-four guess costs a rung when it fails, so the arithmetic favours guessing early — a blind pick at the first rung wins 1000 a quarter of the time, and losing it still leaves you at 620 with three faces left.",
          "That is the one game here where a cold guess is defensible strategy rather than impatience.",
        ],
      },
    ],
  },
  {
    path: 'games/filmline',
    gameSlug: 'filmline',
    title: 'Guess the Film Line',
    description:
      'A line of dialogue quoted the way it is actually spoken, not the way everybody repeats it.',
    intro: [
      "A line of film dialogue, and the film it came from. What makes this harder than it sounds is that the lines are quoted exactly, and the popular version of a movie line is very often not the line.",
      "Casablanca contains no Play it again, Sam. Star Wars contains no Luke, I am your father. Snow White's queen says Magic mirror on the wall. Where the real wording differs from the one everybody repeats, the real one is what appears on screen.",
    ],
    sections: [
      {
        heading: 'What the exact wording gives away',
        body: [
          "If a line reads slightly wrong to you, that is a clue rather than a mistake. A remembered quotation gets smoothed over the years — contractions get added, names get inserted, syntax gets tidied. Seeing the unsmoothed version is often enough on its own to place the film, because it means you are looking at a famous line rather than a paraphrase of one.",
          "Diction dates the film. Nobody in 1939 speaks in the rhythm of a 1990s screenplay. Mid-century dialogue is more formal and more complete; modern dialogue is clipped, overlapping and full of sentence fragments. Animation is its own register — direct, declarative and written to be understood by a six-year-old, which covers a substantial part of this deck.",
          "Watch for lines that only make sense as an answer to something. A line beginning with No or But is a reply, which usually means a confrontation scene, which usually means the film is a drama or a thriller rather than a comedy.",
        ],
      },
      {
        heading: 'The clue ladder',
        body: [
          "Three clues at a rung each. The decade first, which is the broadest and most useful. Then the setting, written to place you without naming anything — a musical fantasy, just after a tornado — and then the character who says it, which for a famous film is effectively the answer.",
          "Because several films contribute more than one line, the guess list is deduplicated by title: two lines from the same film are both answered by that film. The Wizard of Oz, Casablanca, The Princess Bride, The Lion King, Back to the Future and The Fellowship of the Ring each supply two of the 46 lines.",
        ],
      },
      {
        heading: 'The deck',
        body: [
          "46 lines spanning 1939 to 2014, weighted towards the films whose dialogue entered general conversation. That skews family and adventure — Toy Story, Finding Nemo, Up, Frozen, Lilo and Stitch, Babe — alongside the expected Star Wars, Jaws, Titanic and Back to the Future.",
          "Nothing here needs a network. The whole deck is bundled with the site, so it plays fine with the wifi off.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380 and 240. This is one of the faster games in the set, so the speed bonus is worth chasing: 160 points for an instant answer is two thirds of what the last rung pays.",
        ],
      },
    ],
  },
  {
    path: 'games/openingline',
    gameSlug: 'openingline',
    title: 'Guess the Opening Line',
    description:
      'The first sentence of a famous novel, quoted exactly. Some give the book away in six words and some tell you nothing.',
    intro: [
      "One sentence, the first one, exactly as written. Some of them hand the book over immediately — three words about a name is enough for most readers — and some of them are a description of weather that could belong to two hundred novels.",
      "45 books, from Pride and Prejudice in 1813 to a 1997 Toni Morrison. Where a famous opening runs long it is trimmed with an ellipsis rather than paraphrased, because the wording is the entire clue.",
    ],
    sections: [
      {
        heading: 'What the sentence itself tells you',
        body: [
          "Start with the grammatical person. A first-person opening addressed to the reader is a narrator with a personality, which in this deck usually means American, twentieth century, and often a young narrator. A third-person opening with an omniscient generalisation — a statement about how the world works — is nineteenth-century English and there are half a dozen of those here.",
          "Sentence length and punctuation date a book almost as reliably as vocabulary. Long sentences with semicolons and subordinate clauses are pre-1900. Very short declarative openings are post-1920 and often deliberately flat. A sentence that opens on a concrete physical detail with no context is modernist or later.",
          "Then look at what the sentence assumes you already know. An opening that names a character without introducing them is confident and usually twentieth century; an opening that sets a scene in geography and date is older.",
        ],
      },
      {
        heading: 'The clue ladder',
        body: [
          "Three clues at a rung each. The decade of publication, then a one-line description of what the book is — an English novel of manners and marriage, an American novel about a whaling voyage — and finally the author, which for a famous novelist narrows things to the two or three of their books that a person might name.",
          "The middle clue is the one worth buying. It is written to describe the book without naming anything in it, which means it genuinely narrows the field without ending the round.",
        ],
      },
      {
        heading: 'What is in the deck',
        body: [
          "The 45 titles skew classic and skew English-language, though not entirely — Kafka appears twice, and Tolstoy and García Márquez once each — alongside a strong children's section: Charlotte's Web, The Wind in the Willows, Anne of Green Gables, The Velveteen Rabbit, The Lion, the Witch and the Wardrobe.",
          "That children's block is the part most players underestimate. Those books have some of the most quoted first sentences in English, and several of them are the easiest rounds in the deck once you stop assuming everything here is nineteenth-century literary fiction.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380 and 240, entirely offline. The guess list is every book in the file rather than a shortlist, because the game is recognising the sentence, not narrowing down four options.",
        ],
      },
    ],
  },
  {
    path: 'games/plot',
    gameSlug: 'plot',
    title: 'Guess the Plot',
    description:
      'A famous film described in one flat sentence, with no names and nothing that makes it sound worth watching.',
    intro: [
      "A seaside town keeps its beaches open through the summer season despite a problem with a large fish. That is Jaws, and it is also a fair description of Jaws, which is the joke and the puzzle at the same time.",
      "Every summary here is written from scratch and written badly on purpose: no names, no adjectives, no stakes, and the emotional centre of the film described as an administrative event. Strip the tone out of a story and the plot underneath is usually ridiculous.",
    ],
    sections: [
      {
        heading: 'How to attack a flat summary',
        body: [
          "Count the concrete nouns. The summaries are stripped of everything except what actually happens, so any specific object, job or place in the sentence is load-bearing — it survived a deliberate effort to remove detail, which means the film cannot be described without it.",
          "Then work out what the sentence is refusing to say. A summary that describes a relationship in procedural terms is hiding a romance. One that describes a journey in terms of logistics is hiding a quest. The gap between the register of the sentence and the register of the film is itself the fingerprint.",
          "Beware of the ones that sound like several films. Two of the 52 could plausibly describe half a dozen science fiction films from the same decade, and the genre clue will not separate them — the decade clue will.",
        ],
      },
      {
        heading: 'The rules the summaries follow',
        body: [
          "Two hard rules kept the file honest. Never name a character, an actor or the title. And never describe something that does not actually happen — a dry summary is still a true one, so anything that needed a twist spoiled in order to make sense was rewritten to sit before the twist instead.",
          "The titles and years line up with the film deck used by the trailer and release-year games, so a player who has been through those is guessing from the same shelf of films.",
        ],
      },
      {
        heading: 'The clue ladder',
        body: [
          "Three clues at a rung each: the decade, then the genre, then a fact about how the film was made. That last one is the best-value clue in the game and often the most interesting thing on the page — that the hotel corridor fight was shot in a set mounted on a rotating rig, or that the mechanical animal kept breaking down so most of the film is shot from where it would have been.",
          "The genre clue is less useful than it looks, because 11 of the 52 films are filed as science fiction and several more sit next door in space opera, fantasy and superhero. Knowing it is science fiction rules out less than you would like.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380 and 240, offline. The guess list is all 52 films, so scrolling it is a legitimate way to jog your memory — the summaries are written to be recognisable in hindsight and nearly impossible cold, which means seeing the title is often the whole solve.",
        ],
      },
    ],
  },
  {
    path: 'games/slogan',
    gameSlug: 'slogan',
    title: 'Guess the Slogan',
    description:
      'An advertising line quoted the way it actually ran, with the brand name taken out. Name the company that paid for it.',
    intro: [
      "An advertising line with the brand removed wherever there was one, because Have a break, have a Kit Kat is a fine slogan and a useless question. What remains is the part that had to work on its own.",
      "50 lines across 27 sectors, from 1888 to 2016. Fast food and cars are the largest blocks at five each, then technology at four, and then a long tail through beer, confectionery, banking, delivery, batteries and tourism.",
    ],
    sections: [
      {
        heading: 'Dating a line by how it talks',
        body: [
          "Advertising language moves in decades. Pre-war lines are declarative and slightly formal, often describing a product benefit in plain terms. The 1950s and 1960s bring wit and understatement, particularly the American agency work. The 1980s and early 1990s are the imperative era — two or three words, a verb, and total confidence. After about 2000 the mode shifts to abstract values rather than product claims, and the lines get vaguer as a result.",
          "Spelling and idiom split the Atlantic. A line using the word favourite or the phrasing of a British ad is one of about a dozen entries here. American lines lean on rhythm and repetition; British ones lean on irony.",
          "Sector is often audible in the verb. Eat, taste and melt belong to food. Do, go and think belong to technology and sportswear. A line built around the words worth, deserve or best is grooming, cosmetics or a car.",
        ],
      },
      {
        heading: 'The clue ladder',
        body: [
          "Three clues at a rung each. Sector first, which cuts 50 answers to somewhere between one and five. Then the year the line started running — not the year the company was founded, which is a distinction the file is careful about. Then a fact about the brand, written so it identifies without naming: an Oregon company named after a Greek goddess of victory, or a razor company whose entire business model was giving away the handle.",
          "The era clue is the most useful of the three and the cheapest way out of a stuck round, because a line from 1911 and a line from 2013 have almost nothing in common.",
        ],
      },
      {
        heading: 'How the list was kept honest',
        body: [
          "Two rules. If the attribution was not certain, the line was dropped — plenty of famous slogans get reassigned over time to whichever brand in the category is biggest, and a quiz that teaches the wrong one is worse than a shorter quiz. And nothing in the file contains the brand's own name.",
          "A few entries carry a decade rather than a year, because the campaign ramped up rather than launched. Naming brands and quoting their slogans in a quiz is nominative use, and no logos or artwork appear anywhere in this game.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380 and 240, and it works offline. The guess list is every brand in the file, which is 50 names — small enough that reading the list is a genuine tactic when a line feels familiar but will not resolve.",
        ],
      },
    ],
  },
  {
    path: 'games/language',
    gameSlug: 'language',
    title: 'Guess the Language',
    description:
      'An ordinary sentence in its own script, and four languages to choose from — always four relatives.',
    intro: [
      "Where is the nearest station. I do not understand any of this. Ordinary sentences, written the way a speaker would actually write them, in the script that language actually uses.",
      "The four options are always relatives, so the job is telling Danish from Swedish rather than telling Danish from Thai. Mixing families would hand the answer over: one Romance language sitting among three East Asian ones is a matter of looking at the alphabet, not of knowing anything.",
    ],
    sections: [
      {
        heading: 'Diacritics are the whole game',
        body: [
          "Within a family, the letters that are not in English are what separate the options. Icelandic has þ and ð and nothing else in the deck does. Danish and Norwegian share æ and ø; Swedish uses ä and ö instead, which is the fastest Scandinavian split available. Polish has ł and ą; Czech and Slovak-shaped languages use háčeks, the little wedge over a consonant. Romanian has ș and ț with commas under them. Hungarian has ő and ű with double acutes, and Estonian has õ.",
          "Turkish has a dotless ı, which is the single most recognisable letter in the Turkic group, and Azerbaijani has ə. Maltese has ħ and ġ, and is the only Semitic language in the file written in the Latin alphabet, which makes it a free round once you have seen it. Vietnamese stacks tone marks on top of vowels that already have diacritics, and Yoruba and Igbo put dots under letters.",
          "In Cyrillic, the extra letters do the same job: і, ї and є mean Ukrainian; қ, ң and ұ mean Kazakh; ө and ү mean Mongolian.",
        ],
      },
      {
        heading: 'When the script answers it outright',
        body: [
          "Twenty-five of the 67 languages use a plain Latin alphabet, and those are the hard ones. The rest each carry more information in their script than in their words. The four Dravidian languages — Tamil, Telugu, Kannada and Malayalam — each use a completely different writing system, so a round from that family is decided by shape alone if you can tell the four apart, and by the script clue if you cannot.",
          "The Arabic-script languages separate by style and by added letters: Persian adds four letters to the Arabic set, and Urdu is written in the flowing nastaliq style, which slopes down to the left in a way standard naskh does not. Japanese mixes kanji with two kana syllabaries, so a sentence with simple rounded characters interspersed among complex ones is Japanese rather than Chinese. Thai is written without spaces between words.",
        ],
      },
      {
        heading: 'The clue ladder',
        body: [
          "Three clues at a rung each. The script first, described in the terms above — Latin alphabet, with ł and ą — which is the best-value clue in the game when the four options share a family but not a writing system. Then the family, which is only worth buying when the small families have been topped up from elsewhere. Then where it is spoken, which is usually decisive.",
          "The families in the file are lopsided by design: Germanic has seven members, Romance six, Slavic six, Indo-Aryan six, and then a long tail down to Greek, Georgian, Armenian and Basque, which have no close relatives here at all. Those get three decoys from anywhere, which is the best that can be done for a language with no cousins.",
        ],
      },
      {
        heading: 'How the sentences were written',
        body: [
          "Accuracy was the constraint. A wrong sentence in a language nobody in the room speaks looks fine and teaches nonsense, so nothing went in unless the wording is ordinary, idiomatic and spelled the way a speaker would write it. A dozen candidates were dropped for failing that bar rather than guessed at — mostly languages where the tone marks, diacritics or script are easy to get subtly wrong.",
          "The sentences also avoid naming their own language. I speak a little Norwegian is not a question, it is an answer.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds, four rungs: 1000, 620, 380, 240. It runs entirely offline. With four options in front of you and a wrong guess costing a rung, the same arithmetic as the quote game applies — a cold pick wins outright a quarter of the time and still leaves you at 620 with three options left.",
        ],
      },
    ],
  },
  {
    path: 'games/word',
    gameSlug: 'word',
    title: 'Guess the Word',
    description:
      'A definition with the word missing. Clues buy you the part of speech and the length, then the first letter, then the etymology.',
    intro: [
      "The pleasant smell of rain falling on dry earth. The act of throwing someone or something out of a window. A definition appears and the word is missing from it, and the whole guess list — all 87 words — is sitting in the search box waiting to be scrolled.",
      "Mostly this is vocabulary worth owning, with a handful of rarities that are only here because somebody had to name the smell of rain on dry ground.",
    ],
    sections: [
      {
        heading: 'Play the odds on the part of speech',
        body: [
          "The deck is 56 adjectives, 23 nouns and eight verbs. That imbalance is worth carrying into every round: if the definition describes a quality — a way of being noisy, or reticent, or short-lived — you are in the two thirds of the file that are adjectives, and the search box is much easier to scan when you know which kind of word you are hunting.",
          "The definitions are written from scratch rather than copied, in plain language and short enough to fit on a stage. They also never contain the word itself or an obvious derivative of it, which is checked mechanically rather than by eye — so an unusual word in the definition is genuinely a different word rather than a leak.",
        ],
      },
      {
        heading: 'The clue ladder',
        body: [
          "Three clues at a rung each, and they are deliberately mechanical. First the part of speech and the letter count — noun, 9 letters. That count is measured off the word itself rather than typed into the seed file, because a hand-counted nine that is wrong makes the round unwinnable.",
          "Then the first letter, which with a searchable list is close to decisive. Then the etymology or a usage note, which is usually the thing that finally shakes the word loose: that the Latin for window sits inside defenestration, or that umbrage is Latin for shade, and being put in someone's shadow is what it feels like to be slighted.",
        ],
      },
      {
        heading: 'What is not in here',
        body: [
          "Nothing was included unless both the spelling and the sense were certain. The words that only exist on internet lists of untranslatable words — sonder, and most of that family — are not in a dictionary and are not here either.",
          "That leaves a list that is genuinely useful: petrichor and susurrus at one end, and pragmatic, resilient, meticulous and frugal at the other. A run through this deck is a reasonable vocabulary test rather than a trivia round about invented words.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds at 1000, 620, 380 and 240, entirely offline. The interesting tension is that the answer is always visible — it is somewhere in a list of 87 — so a round is never truly lost, only expensive. Reading the list costs nothing; submitting the wrong entry costs a rung.",
        ],
      },
    ],
  },
  {
    path: 'games/year',
    gameSlug: 'year',
    title: 'Guess the Year',
    description:
      'Name the year a film came out. Exact is full marks, one year off still pays 60 per cent, and four years off costs a rung.',
    intro: [
      "A film title, a poster, and a year to name. This is the only game here that pays partial credit: exact is full marks, one year off is 60 per cent, two years 35 per cent, three years 15 per cent. Four and you have burned a rung for nothing.",
      "That scoring changes how it should be played. In every other game a guess is right or wrong; here a considered near-miss is worth more than a cautious clue purchase, because the clue costs 380 points and being one year out costs 400.",
    ],
    sections: [
      {
        heading: 'Dating a film without the year',
        body: [
          "The poster is the first evidence. Poster design moves in recognisable phases: painted illustration through the 1970s, the airbrushed photographic composite of the 1980s, the floating-heads-over-a-city-skyline of the 1990s, and the desaturated single-figure key art of the 2010s. Typography follows the same arc, from hand-lettered to condensed sans to the very thin modern faces.",
          "Then the description clue, which is Wikipedia's own one-line summary with every year and decade stripped out of it — otherwise the first clue would read 2010 film by Christopher Nolan and end the round on the spot. What remains is usually a director's name or a country, and a director's active period is a decade-sized answer by itself.",
          "The third clue gives the decade, and the fourth a five-year window. That window is deliberately off-centre: a symmetric one would hand over the answer as its midpoint, so the range starts somewhere between zero and four years before the real date. Take the middle of it and you will be one or two out, which still pays.",
        ],
      },
      {
        heading: 'How the near-miss maths works',
        body: [
          "At the first rung a round is worth 1000. Exact pays all of it, one year off pays 600, two years 350 and three years 150. Buying the first clue drops the ceiling to 620, so an exact answer after one clue and a one-year miss with no clues are worth almost exactly the same.",
          "Which means the right instinct is to commit early with your best estimate rather than to buy your way to certainty. The only situation where a clue is clearly worth it is when your uncertainty is wider than about four years, since outside that band a wrong guess scores nothing and costs a rung anyway.",
        ],
      },
      {
        heading: 'The deck',
        body: [
          "The films come from the same 87-title list the trailer game uses, filtered to those released from 1930 onward, and the picker runs from 1930 to the current year. The list spans 1939 to 2023 with a median around 2002, so the deck is weighted towards the modern era — if you have no information at all, the middle of the 1990s is a better blind guess than the middle of the range.",
          "Every year in that file was confirmed against the film's Wikipedia article rather than taken from memory, which matters in a game where being one year out is a scoring event.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds, four rungs: 1000, 620, 380, 240, multiplied by the accuracy fraction and then by the streak multiplier. A near-miss still counts as a won round for streak purposes, so a run of confident one-year misses keeps the multiplier climbing — which over ten rounds is worth more than two exact answers.",
        ],
      },
    ],
  },
  {
    path: 'games/capital',
    gameSlug: 'capital',
    title: 'Guess the Capital',
    description:
      'A country and four capitals, all four from the same part of the world. Official capitals only, which is the whole difficulty.',
    intro: [
      "A country on screen and four cities under it, all four from the same region. A South American capital sitting among three Asian ones answers itself, so the decoys are always neighbours.",
      "The rule that makes this harder than it looks: official capitals only. Where a country separates the constitutional capital from the city everybody has heard of, the constitutional one is the answer.",
    ],
    sections: [
      {
        heading: 'The cities people get wrong',
        body: [
          "The classic error is the largest city standing in for the seat of government: Rio for Brasília, Istanbul for Ankara, Lagos for Abuja, Yangon for Naypyidaw, Abidjan for Yamoussoukro, Sydney for Canberra, Toronto for Ottawa. Every one of those countries is in the deck. The useful thing is that the four buttons are always genuine capitals of countries in the same region, so if the city you were about to pick is not among them, it is usually because it is not a capital at all.",
          "The second family is the purpose-built capital, and this deck has a lot of them. Brasília, Canberra, Abuja, Astana, Naypyidaw, Yamoussoukro and Islamabad were all built or promoted to be capitals, generally to move the seat of government away from a coastal commercial city. Recognising that pattern is worth more than memorising the list: if a country has an obvious famous port, the capital is often somewhere inland you have not thought about.",
          "Then the genuinely contested ones. Bolivia's constitutional capital is Sucre rather than La Paz, where the government actually sits. Tanzania's is Dodoma rather than Dar es Salaam. Benin's is Porto-Novo rather than Cotonou. Sri Lanka's is Sri Jayawardenepura Kotte. Each of those carries a note in the seed file saying so, and where even the official answer is contested the country was left out rather than guessed at.",
        ],
      },
      {
        heading: 'The clue ladder',
        body: [
          "Three clues at a rung each. The region is first and is the weakest of the three, because the four options are already drawn from one region — it only helps when a small region had to be topped up from elsewhere, which does happen in Oceania.",
          "The second clue is a fact about the city, written not to name it: that it sits in a coastal desert where it drizzles but almost never rains, or that its residents are called porteños after the port, or that its metro stations were built like palaces with chandeliers and mosaics. These are the best part of the game and worth reading even when you already know the answer. The third clue is the city's first letter.",
        ],
      },
      {
        heading: 'The atlas behind it',
        body: [
          "124 countries: 28 in Africa, 24 each in Europe and Asia, 14 in North America and the Caribbean, 12 each in South America and the Middle East, and ten in Oceania. That same list is the answer catalog for the Street View game, so the two geography games never disagree about whether the answer is Côte d'Ivoire or Ivory Coast.",
          "No network needed. The whole atlas is bundled with the site.",
        ],
      },
      {
        heading: 'Scoring',
        body: [
          "Ten rounds, four rungs: 1000, 620, 380, 240. With four options and no clue spent, an outright guess is worth a quarter of 1000 on average, which is more than the last rung pays — so on a country you genuinely do not know, guessing immediately and then buying clues with what is left is better than the other way round.",
        ],
      },
    ],
  },
];
