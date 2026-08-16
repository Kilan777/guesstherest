/**
 * First sentences of well-known novels.
 *
 * These are the real opening lines, quoted exactly. Where a famous opening runs
 * long, it is trimmed with an ellipsis rather than paraphrased — the whole point
 * of the game is that the wording is the clue.
 */
export type OpeningLineSeed = {
  line: string;
  title: string;
  author: string;
  year: number;
  /** Era-agnostic clue about the author or genre, shown on the third rung. */
  about: string;
};

export const OPENING_LINES: OpeningLineSeed[] = [
  { line: 'Call me Ishmael.', title: 'Moby-Dick', author: 'Herman Melville', year: 1851, about: 'An American novel about a whaling voyage' },
  { line: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.', title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, about: 'An English novel of manners and marriage' },
  { line: 'It was the best of times, it was the worst of times…', title: 'A Tale of Two Cities', author: 'Charles Dickens', year: 1859, about: 'An English historical novel set in two capital cities' },
  { line: 'It was a bright cold day in April, and the clocks were striking thirteen.', title: '1984', author: 'George Orwell', year: 1949, about: 'An English dystopia about surveillance' },
  { line: 'All happy families are alike; each unhappy family is unhappy in its own way.', title: 'Anna Karenina', author: 'Leo Tolstoy', year: 1878, about: 'A Russian novel of society and adultery' },
  { line: 'In a hole in the ground there lived a hobbit.', title: 'The Hobbit', author: 'J. R. R. Tolkien', year: 1937, about: 'An English fantasy quest' },
  { line: 'Mr and Mrs Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much.', title: "Harry Potter and the Philosopher's Stone", author: 'J. K. Rowling', year: 1997, about: 'A British fantasy about a boarding school' },
  { line: 'It was a pleasure to burn.', title: 'Fahrenheit 451', author: 'Ray Bradbury', year: 1953, about: 'An American dystopia about censorship' },
  { line: 'Many years later, as he faced the firing squad, Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to discover ice.', title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', year: 1967, about: 'A Colombian novel of magical realism' },
  { line: 'Last night I dreamt I went to Manderley again.', title: 'Rebecca', author: 'Daphne du Maurier', year: 1938, about: 'An English gothic novel set on a great estate' },
  { line: 'There was no possibility of taking a walk that day.', title: 'Jane Eyre', author: 'Charlotte Brontë', year: 1847, about: 'An English novel about a governess' },
  { line: 'In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since.', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, about: 'An American novel of the Jazz Age' },
  { line: 'When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow.', title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, about: 'An American novel set in the segregated South' },
  { line: 'Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do…', title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll', year: 1865, about: 'An English children’s fantasy' },
  { line: "Where's Papa going with that axe?", title: "Charlotte's Web", author: 'E. B. White', year: 1952, about: 'An American children’s novel set on a farm' },
  { line: 'Marley was dead, to begin with.', title: 'A Christmas Carol', author: 'Charles Dickens', year: 1843, about: 'An English ghost story set at Christmas' },
  { line: 'Once there were four children whose names were Peter, Susan, Edmund and Lucy.', title: 'The Lion, the Witch and the Wardrobe', author: 'C. S. Lewis', year: 1950, about: 'A British children’s fantasy' },
  { line: 'All this happened, more or less.', title: 'Slaughterhouse-Five', author: 'Kurt Vonnegut', year: 1969, about: 'An American anti-war novel with time travel' },
  { line: 'It was a dark and stormy night.', title: 'A Wrinkle in Time', author: 'Madeleine L’Engle', year: 1962, about: 'An American children’s science fantasy' },
  { line: 'I am an invisible man.', title: 'Invisible Man', author: 'Ralph Ellison', year: 1952, about: 'An American novel about identity and race' },
  { line: 'As Gregor Samsa awoke one morning from uneasy dreams he found himself transformed in his bed into a gigantic insect.', title: 'The Metamorphosis', author: 'Franz Kafka', year: 1915, about: 'A German-language novella of the absurd' },
  { line: 'Mrs Dalloway said she would buy the flowers herself.', title: 'Mrs Dalloway', author: 'Virginia Woolf', year: 1925, about: 'An English modernist novel set over one day' },
  { line: 'It was love at first sight.', title: 'Catch-22', author: 'Joseph Heller', year: 1961, about: 'An American satirical war novel' },
  { line: 'The past is a foreign country: they do things differently there.', title: 'The Go-Between', author: 'L. P. Hartley', year: 1953, about: 'An English novel remembered from childhood' },
  { line: 'Ships at a distance have every man’s wish on board.', title: 'Their Eyes Were Watching God', author: 'Zora Neale Hurston', year: 1937, about: 'An American novel set in Florida' },
  { line: 'The primroses were over.', title: 'Watership Down', author: 'Richard Adams', year: 1972, about: 'An English adventure novel about rabbits' },
  { line: 'The Mole had been working very hard all the morning, spring-cleaning his little home.', title: 'The Wind in the Willows', author: 'Kenneth Grahame', year: 1908, about: 'An English children’s classic set by a river' },
  { line: 'Christmas won’t be Christmas without any presents.', title: 'Little Women', author: 'Louisa May Alcott', year: 1868, about: 'An American novel about four sisters' },
  { line: 'Squire Trelawney, Dr Livesey, and the rest of these gentlemen having asked me to write down the whole particulars…', title: 'Treasure Island', author: 'Robert Louis Stevenson', year: 1883, about: 'A Scottish adventure novel about pirates' },
  { line: 'Mrs Rachel Lynde lived just where the Avonlea main road dipped down into a little hollow…', title: 'Anne of Green Gables', author: 'L. M. Montgomery', year: 1908, about: 'A Canadian novel about an orphan on a farm' },
  { line: 'Far out in the uncharted backwaters of the unfashionable end of the western spiral arm of the Galaxy lies a small unregarded yellow sun.', title: "The Hitchhiker's Guide to the Galaxy", author: 'Douglas Adams', year: 1979, about: 'A British comic science-fiction novel' },
  { line: 'The boy with fair hair lowered himself down the last few feet of rock and began to pick his way towards the lagoon.', title: 'Lord of the Flies', author: 'William Golding', year: 1954, about: 'An English novel about schoolboys on an island' },
  { line: 'If you really want to hear about it, the first thing you’ll probably want to know is where I was born…', title: 'The Catcher in the Rye', author: 'J. D. Salinger', year: 1951, about: 'An American novel narrated by a teenager' },
  { line: 'There was a boy called Eustace Clarence Scrubb, and he almost deserved it.', title: 'The Voyage of the Dawn Treader', author: 'C. S. Lewis', year: 1952, about: 'A British children’s fantasy voyage' },
  { line: 'It was seven o’clock of a very warm evening in the Seeonee hills.', title: 'The Jungle Book', author: 'Rudyard Kipling', year: 1894, about: 'A British collection of stories set in India' },
  { line: 'Once upon a time and a very good time it was there was a moocow coming down along the road…', title: 'A Portrait of the Artist as a Young Man', author: 'James Joyce', year: 1916, about: 'An Irish modernist coming-of-age novel' },
  { line: 'You don’t know about me without you have read a book by the name of The Adventures of Tom Sawyer; but that ain’t no matter.', title: 'Adventures of Huckleberry Finn', author: 'Mark Twain', year: 1884, about: 'An American novel set on a great river' },
  { line: 'There was once a velveteen rabbit, and in the beginning he was really splendid.', title: 'The Velveteen Rabbit', author: 'Margery Williams', year: 1922, about: 'A children’s story about a toy that wants to be real' },
  { line: 'Someone must have slandered Josef K., for one morning, without having done anything wrong, he was arrested.', title: 'The Trial', author: 'Franz Kafka', year: 1925, about: 'A German-language novel about bureaucracy' },
  { line: 'It is cold at 6.40 in the morning of a March day in Paris, and seems even colder when a man is about to be executed by firing squad.', title: 'The Day of the Jackal', author: 'Frederick Forsyth', year: 1971, about: 'A British thriller about a manhunt' },
  { line: 'The sky above the port was the colour of television, tuned to a dead channel.', title: 'Neuromancer', author: 'William Gibson', year: 1984, about: 'A cyberpunk science-fiction novel' },
  { line: 'A screaming comes across the sky.', title: "Gravity's Rainbow", author: 'Thomas Pynchon', year: 1973, about: 'An American postmodern novel set in wartime' },
  { line: 'They shoot the white girl first.', title: 'Paradise', author: 'Toni Morrison', year: 1997, about: 'An American novel set in an all-Black town' },
  { line: 'The studio was filled with the rich odour of roses.', title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', year: 1890, about: 'An Irish novel about a portrait' },
  { line: 'You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.', title: 'Frankenstein', author: 'Mary Shelley', year: 1818, about: 'An English novel told partly in letters' },
];
