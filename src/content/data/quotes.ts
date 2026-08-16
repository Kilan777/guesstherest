/**
 * Only well-sourced attributions here. The internet is full of quotes hung on
 * the wrong famous name (the Einstein "insanity" line, the Gandhi "first they
 * ignore you" line, most of what Marilyn Monroe supposedly said) — a guessing
 * game that teaches misattributions would be worse than no game.
 *
 * `field` groups people so the three decoys come from the same world as the
 * real speaker; picking a physicist out of three rappers is not a game.
 */
export type QuoteSeed = {
  q: string;
  who: string;
  wiki: string;
  role: string;
  field: 'science' | 'politics' | 'letters' | 'tech' | 'sport' | 'art';
};

export const QUOTES: QuoteSeed[] = [
  // ── science ───────────────────────────────────────────────────────────────
  { q: 'Imagination is more important than knowledge.', who: 'Albert Einstein', wiki: 'Albert_Einstein', role: 'Physicist', field: 'science' },
  { q: 'I have no special talent. I am only passionately curious.', who: 'Albert Einstein', wiki: 'Albert_Einstein', role: 'Physicist', field: 'science' },
  { q: 'If I have seen further it is by standing on the shoulders of giants.', who: 'Isaac Newton', wiki: 'Isaac_Newton', role: 'Physicist & mathematician', field: 'science' },
  { q: 'Nothing in life is to be feared, it is only to be understood.', who: 'Marie Curie', wiki: 'Marie_Curie', role: 'Physicist & chemist', field: 'science' },
  { q: 'What I cannot create, I do not understand.', who: 'Richard Feynman', wiki: 'Richard_Feynman', role: 'Physicist', field: 'science' },
  { q: 'We are made of star stuff.', who: 'Carl Sagan', wiki: 'Carl_Sagan', role: 'Astronomer', field: 'science' },
  { q: 'Give me a place to stand and I will move the Earth.', who: 'Archimedes', wiki: 'Archimedes', role: 'Ancient Greek mathematician', field: 'science' },
  { q: "I have not failed. I've just found 10,000 ways that won't work.", who: 'Thomas Edison', wiki: 'Thomas_Edison', role: 'Inventor', field: 'science' },
  { q: 'Genius is one percent inspiration and ninety-nine percent perspiration.', who: 'Thomas Edison', wiki: 'Thomas_Edison', role: 'Inventor', field: 'science' },
  { q: "That's one small step for man, one giant leap for mankind.", who: 'Neil Armstrong', wiki: 'Neil_Armstrong', role: 'Astronaut', field: 'science' },
  { q: 'Nature uses only the longest threads to weave her patterns.', who: 'Richard Feynman', wiki: 'Richard_Feynman', role: 'Physicist', field: 'science' },
  { q: 'Knowledge is power.', who: 'Francis Bacon', wiki: 'Francis_Bacon', role: 'Philosopher of science', field: 'science' },

  // ── politics & activism ───────────────────────────────────────────────────
  { q: 'I have a dream.', who: 'Martin Luther King Jr.', wiki: 'Martin_Luther_King_Jr.', role: 'Civil rights leader', field: 'politics' },
  { q: 'Injustice anywhere is a threat to justice everywhere.', who: 'Martin Luther King Jr.', wiki: 'Martin_Luther_King_Jr.', role: 'Civil rights leader', field: 'politics' },
  { q: 'Ask not what your country can do for you — ask what you can do for your country.', who: 'John F. Kennedy', wiki: 'John_F._Kennedy', role: '35th US President', field: 'politics' },
  { q: 'Ich bin ein Berliner.', who: 'John F. Kennedy', wiki: 'John_F._Kennedy', role: '35th US President', field: 'politics' },
  { q: 'The only thing we have to fear is fear itself.', who: 'Franklin D. Roosevelt', wiki: 'Franklin_D._Roosevelt', role: '32nd US President', field: 'politics' },
  { q: 'We shall fight on the beaches. We shall never surrender.', who: 'Winston Churchill', wiki: 'Winston_Churchill', role: 'British Prime Minister', field: 'politics' },
  { q: 'I have nothing to offer but blood, toil, tears and sweat.', who: 'Winston Churchill', wiki: 'Winston_Churchill', role: 'British Prime Minister', field: 'politics' },
  { q: 'Four score and seven years ago…', who: 'Abraham Lincoln', wiki: 'Abraham_Lincoln', role: '16th US President', field: 'politics' },
  { q: 'Give me liberty, or give me death!', who: 'Patrick Henry', wiki: 'Patrick_Henry', role: 'American revolutionary', field: 'politics' },
  { q: 'Speak softly and carry a big stick.', who: 'Theodore Roosevelt', wiki: 'Theodore_Roosevelt', role: '26th US President', field: 'politics' },
  { q: 'Mr. Gorbachev, tear down this wall!', who: 'Ronald Reagan', wiki: 'Ronald_Reagan', role: '40th US President', field: 'politics' },
  { q: 'The buck stops here.', who: 'Harry S. Truman', wiki: 'Harry_S._Truman', role: '33rd US President', field: 'politics' },
  { q: 'It always seems impossible until it is done.', who: 'Nelson Mandela', wiki: 'Nelson_Mandela', role: 'South African President', field: 'politics' },
  { q: 'Education is the most powerful weapon which you can use to change the world.', who: 'Nelson Mandela', wiki: 'Nelson_Mandela', role: 'South African President', field: 'politics' },
  { q: 'One child, one teacher, one book and one pen can change the world.', who: 'Malala Yousafzai', wiki: 'Malala_Yousafzai', role: 'Education activist', field: 'politics' },
  { q: 'The weak can never forgive. Forgiveness is the attribute of the strong.', who: 'Mahatma Gandhi', wiki: 'Mahatma_Gandhi', role: 'Indian independence leader', field: 'politics' },
  { q: 'No one can make you feel inferior without your consent.', who: 'Eleanor Roosevelt', wiki: 'Eleanor_Roosevelt', role: 'Diplomat & First Lady', field: 'politics' },
  { q: 'I am not free while any woman is unfree, even when her shackles are very different from my own.', who: 'Audre Lorde', wiki: 'Audre_Lorde', role: 'Poet & civil rights activist', field: 'politics' },
  { q: 'I came, I saw, I conquered.', who: 'Julius Caesar', wiki: 'Julius_Caesar', role: 'Roman general & statesman', field: 'politics' },
  { q: 'Power tends to corrupt, and absolute power corrupts absolutely.', who: 'Lord Acton', wiki: 'John_Dalberg-Acton,_1st_Baron_Acton', role: 'Historian', field: 'politics' },
  { q: 'Workers of the world, unite!', who: 'Karl Marx', wiki: 'Karl_Marx', role: 'Philosopher & economist', field: 'politics' },

  // ── letters & philosophy ──────────────────────────────────────────────────
  { q: 'To be, or not to be, that is the question.', who: 'William Shakespeare', wiki: 'William_Shakespeare', role: 'Playwright', field: 'letters' },
  { q: "All the world's a stage, and all the men and women merely players.", who: 'William Shakespeare', wiki: 'William_Shakespeare', role: 'Playwright', field: 'letters' },
  { q: 'It was the best of times, it was the worst of times.', who: 'Charles Dickens', wiki: 'Charles_Dickens', role: 'Novelist', field: 'letters' },
  { q: 'Call me Ishmael.', who: 'Herman Melville', wiki: 'Herman_Melville', role: 'Novelist', field: 'letters' },
  { q: 'All animals are equal, but some animals are more equal than others.', who: 'George Orwell', wiki: 'George_Orwell', role: 'Novelist & essayist', field: 'letters' },
  { q: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.', who: 'Jane Austen', wiki: 'Jane_Austen', role: 'Novelist', field: 'letters' },
  { q: 'Two roads diverged in a wood, and I — I took the one less traveled by.', who: 'Robert Frost', wiki: 'Robert_Frost', role: 'Poet', field: 'letters' },
  { q: 'Do not go gentle into that good night.', who: 'Dylan Thomas', wiki: 'Dylan_Thomas', role: 'Poet', field: 'letters' },
  { q: 'I think, therefore I am.', who: 'René Descartes', wiki: 'René_Descartes', role: 'Philosopher', field: 'letters' },
  { q: 'The unexamined life is not worth living.', who: 'Socrates', wiki: 'Socrates', role: 'Ancient Greek philosopher', field: 'letters' },
  { q: 'God is dead.', who: 'Friedrich Nietzsche', wiki: 'Friedrich_Nietzsche', role: 'Philosopher', field: 'letters' },
  { q: 'Hell is other people.', who: 'Jean-Paul Sartre', wiki: 'Jean-Paul_Sartre', role: 'Philosopher & playwright', field: 'letters' },
  { q: 'The limits of my language mean the limits of my world.', who: 'Ludwig Wittgenstein', wiki: 'Ludwig_Wittgenstein', role: 'Philosopher', field: 'letters' },
  { q: 'The life of man is solitary, poor, nasty, brutish, and short.', who: 'Thomas Hobbes', wiki: 'Thomas_Hobbes', role: 'Philosopher', field: 'letters' },
  { q: 'Well-behaved women seldom make history.', who: 'Laurel Thatcher Ulrich', wiki: 'Laurel_Thatcher_Ulrich', role: 'Historian', field: 'letters' },
  { q: 'I am no bird; and no net ensnares me: I am a free human being with an independent will.', who: 'Charlotte Brontë', wiki: 'Charlotte_Brontë', role: 'Novelist', field: 'letters' },

  // ── tech ──────────────────────────────────────────────────────────────────
  { q: 'Stay hungry. Stay foolish.', who: 'Steve Jobs', wiki: 'Steve_Jobs', role: 'Apple co-founder', field: 'tech' },
  { q: "Design is not just what it looks like and feels like. Design is how it works.", who: 'Steve Jobs', wiki: 'Steve_Jobs', role: 'Apple co-founder', field: 'tech' },
  { q: 'Talk is cheap. Show me the code.', who: 'Linus Torvalds', wiki: 'Linus_Torvalds', role: 'Creator of Linux', field: 'tech' },
  { q: 'Premature optimization is the root of all evil.', who: 'Donald Knuth', wiki: 'Donald_Knuth', role: 'Computer scientist', field: 'tech' },
  { q: 'The best way to predict the future is to invent it.', who: 'Alan Kay', wiki: 'Alan_Kay', role: 'Computer scientist', field: 'tech' },
  { q: 'Any sufficiently advanced technology is indistinguishable from magic.', who: 'Arthur C. Clarke', wiki: 'Arthur_C._Clarke', role: 'Science-fiction author', field: 'tech' },
  { q: 'The medium is the message.', who: 'Marshall McLuhan', wiki: 'Marshall_McLuhan', role: 'Media theorist', field: 'tech' },
  { q: 'Software is eating the world.', who: 'Marc Andreessen', wiki: 'Marc_Andreessen', role: 'Netscape co-founder & investor', field: 'tech' },
  { q: 'Your margin is my opportunity.', who: 'Jeff Bezos', wiki: 'Jeff_Bezos', role: 'Amazon founder', field: 'tech' },
  { q: 'Move fast and break things.', who: 'Mark Zuckerberg', wiki: 'Mark_Zuckerberg', role: 'Facebook co-founder', field: 'tech' },
  { q: 'When something is important enough, you do it even if the odds are not in your favor.', who: 'Elon Musk', wiki: 'Elon_Musk', role: 'Tesla & SpaceX CEO', field: 'tech' },
  { q: 'It is the ability to think, rather than the ability to calculate, that matters.', who: 'Ada Lovelace', wiki: 'Ada_Lovelace', role: 'Mathematician, first programmer', field: 'tech' },

  // ── sport ─────────────────────────────────────────────────────────────────
  { q: 'Float like a butterfly, sting like a bee.', who: 'Muhammad Ali', wiki: 'Muhammad_Ali', role: 'Heavyweight boxer', field: 'sport' },
  { q: "You miss 100% of the shots you don't take.", who: 'Wayne Gretzky', wiki: 'Wayne_Gretzky', role: 'Ice hockey player', field: 'sport' },
  { q: "It ain't over till it's over.", who: 'Yogi Berra', wiki: 'Yogi_Berra', role: 'Baseball catcher & manager', field: 'sport' },
  { q: "I've failed over and over and over again in my life. And that is why I succeed.", who: 'Michael Jordan', wiki: 'Michael_Jordan', role: 'Basketball player', field: 'sport' },
  { q: 'The more difficult the victory, the greater the happiness in winning.', who: 'Pelé', wiki: 'Pelé', role: 'Footballer', field: 'sport' },
  { q: 'You have to believe in yourself when no one else does.', who: 'Serena Williams', wiki: 'Serena_Williams', role: 'Tennis player', field: 'sport' },

  // ── art ───────────────────────────────────────────────────────────────────
  { q: 'Art is the lie that enables us to realize the truth.', who: 'Pablo Picasso', wiki: 'Pablo_Picasso', role: 'Painter', field: 'art' },
  { q: 'Every child is an artist. The problem is how to remain an artist once we grow up.', who: 'Pablo Picasso', wiki: 'Pablo_Picasso', role: 'Painter', field: 'art' },
  { q: 'I paint flowers so they will not die.', who: 'Frida Kahlo', wiki: 'Frida_Kahlo', role: 'Painter', field: 'art' },
  { q: 'I dream my painting and I paint my dream.', who: 'Vincent van Gogh', wiki: 'Vincent_van_Gogh', role: 'Painter', field: 'art' },
  { q: 'Simplicity is the ultimate sophistication.', who: 'Leonardo da Vinci', wiki: 'Leonardo_da_Vinci', role: 'Painter & polymath', field: 'art' },
  { q: 'In the future everyone will be world-famous for 15 minutes.', who: 'Andy Warhol', wiki: 'Andy_Warhol', role: 'Pop artist', field: 'art' },
];
