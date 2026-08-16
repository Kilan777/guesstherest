/**
 * Board and card games, keyed to their English Wikipedia articles. The lead
 * image is box art for anything published since about 1990 and a photograph of
 * the board or pieces for everything older, which is why this game blurs rather
 * than blanks the unopened tiles — a wooden board and a cardboard box read very
 * differently through a smudge.
 *
 * Box art is non-free media, so Wikipedia hosts it at whatever size the uploader
 * gave it and the /thumb/ render is often missing. The loader asks for
 * `imageFull` first for that reason.
 *
 * `year` is first publication. The four games older than printing use the
 * conventional approximate date for the game in something like its modern form,
 * and negative years are rendered as BC in the caption.
 *
 * Every title here was checked against the summary API: HTTP 200, not a
 * disambiguation page, and an `originalimage` present. Operation, Betrayal at
 * House on the Hill and Clue: The Great Museum Caper were dropped because their
 * articles carry no lead image.
 */
export type BoardGameSeed = { wiki: string; label: string; year: number };

export const BOARDGAMES: BoardGameSeed[] = [
  // Ancient and classical
  { wiki: 'Backgammon', label: 'Backgammon', year: -3000 },
  { wiki: 'Go_(game)', label: 'Go', year: -500 },
  { wiki: 'Xiangqi', label: 'Xiangqi', year: 1100 },
  { wiki: 'Dominoes', label: 'Dominoes', year: 1120 },
  { wiki: 'Checkers', label: 'Checkers', year: 1150 },
  { wiki: 'Shogi', label: 'Shogi', year: 1210 },
  { wiki: 'Chess', label: 'Chess', year: 1475 },
  { wiki: 'Mahjong', label: 'Mahjong', year: 1875 },

  // Victorian parlour to mid-century living room
  { wiki: 'Poker', label: 'Poker', year: 1829 },
  { wiki: 'Othello_(board_game)', label: 'Othello', year: 1883 },
  { wiki: 'Chinese_checkers', label: 'Chinese Checkers', year: 1892 },
  { wiki: 'Snakes_and_ladders', label: 'Snakes and Ladders', year: 1892 },
  { wiki: 'Ludo', label: 'Ludo', year: 1896 },
  { wiki: 'Bridge_(card_game)', label: 'Contract Bridge', year: 1925 },
  { wiki: 'Battleship_(game)', label: 'Battleship', year: 1931 },
  { wiki: 'Monopoly_(game)', label: 'Monopoly', year: 1935 },
  { wiki: 'Stratego', label: 'Stratego', year: 1942 },
  { wiki: 'Scrabble', label: 'Scrabble', year: 1948 },
  { wiki: 'Cluedo', label: 'Cluedo', year: 1949 },
  { wiki: 'Rummikub', label: 'Rummikub', year: 1950 },
  { wiki: 'Yahtzee', label: 'Yahtzee', year: 1956 },
  { wiki: 'Risk_(game)', label: 'Risk', year: 1957 },
  { wiki: 'Diplomacy_(game)', label: 'Diplomacy', year: 1959 },
  { wiki: 'The_Game_of_Life', label: 'The Game of Life', year: 1960 },
  { wiki: 'Mouse_Trap_(board_game)', label: 'Mouse Trap', year: 1963 },
  { wiki: 'Twister_(game)', label: 'Twister', year: 1966 },
  { wiki: 'Mastermind_(board_game)', label: 'Mastermind', year: 1970 },
  { wiki: 'Uno_(card_game)', label: 'Uno', year: 1971 },
  { wiki: 'Boggle', label: 'Boggle', year: 1972 },
  { wiki: 'Connect_Four', label: 'Connect Four', year: 1974 },
  { wiki: 'Set_(card_game)', label: 'Set', year: 1974 },
  { wiki: 'Guess_Who?', label: 'Guess Who?', year: 1979 },
  { wiki: 'Trivial_Pursuit', label: 'Trivial Pursuit', year: 1981 },
  { wiki: 'Jenga', label: 'Jenga', year: 1983 },
  { wiki: 'Pictionary', label: 'Pictionary', year: 1985 },
  { wiki: 'Magic:_The_Gathering', label: 'Magic: The Gathering', year: 1993 },

  // The German-style wave and after
  { wiki: 'Catan', label: 'Catan', year: 1995 },
  { wiki: 'Blokus', label: 'Blokus', year: 2000 },
  { wiki: 'Carcassonne_(board_game)', label: 'Carcassonne', year: 2000 },
  { wiki: 'Hive_(game)', label: 'Hive', year: 2001 },
  { wiki: 'Puerto_Rico_(board_game)', label: 'Puerto Rico', year: 2002 },
  { wiki: 'Ticket_to_Ride_(board_game)', label: 'Ticket to Ride', year: 2004 },
  { wiki: 'Agricola_(board_game)', label: 'Agricola', year: 2007 },
  { wiki: 'Dixit_(board_game)', label: 'Dixit', year: 2008 },
  { wiki: 'Dominion_(card_game)', label: 'Dominion', year: 2008 },
  { wiki: 'Pandemic_(board_game)', label: 'Pandemic', year: 2008 },
  { wiki: 'Dobble', label: 'Dobble', year: 2009 },
  { wiki: '7_Wonders_(board_game)', label: '7 Wonders', year: 2010 },
  { wiki: 'Cards_Against_Humanity', label: 'Cards Against Humanity', year: 2011 },
  { wiki: 'Splendor_(game)', label: 'Splendor', year: 2014 },
  { wiki: 'Codenames_(board_game)', label: 'Codenames', year: 2015 },
  { wiki: 'Exploding_Kittens', label: 'Exploding Kittens', year: 2015 },
  { wiki: 'Terraforming_Mars_(board_game)', label: 'Terraforming Mars', year: 2016 },
  { wiki: 'Azul_(board_game)', label: 'Azul', year: 2017 },
  { wiki: 'Gloomhaven', label: 'Gloomhaven', year: 2017 },
  { wiki: 'Wingspan_(board_game)', label: 'Wingspan', year: 2019 },
];
