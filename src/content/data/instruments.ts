/**
 * Musical instruments, keyed to their English Wikipedia articles. The lead image
 * on an instrument article is a studio photograph of the instrument itself,
 * which is what the zoom crops into.
 *
 * `family` is the Hornbostel-Sachs-ish grouping the caption prints once the
 * round is over — broad enough to be useful, not so fine that "chordophone"
 * appears on screen. Lip-reed aerophones are filed under Brass, so the
 * didgeridoo sits next to the tuba.
 *
 * Every title here was checked against the summary API: HTTP 200, not a
 * disambiguation page, and an `originalimage` present. Banjo and Electric
 * guitar were dropped because neither article carries a lead image.
 */
export type InstrumentFamily =
  | 'Woodwind'
  | 'Brass'
  | 'String'
  | 'Percussion'
  | 'Keyboard'
  | 'Free reed'
  | 'Electronic';

export type InstrumentSeed = { wiki: string; label: string; family: InstrumentFamily };

export const INSTRUMENTS: InstrumentSeed[] = [
  // Woodwind
  { wiki: 'Bassoon', label: 'Bassoon', family: 'Woodwind' },
  { wiki: 'Oboe', label: 'Oboe', family: 'Woodwind' },
  { wiki: 'Clarinet', label: 'Clarinet', family: 'Woodwind' },
  { wiki: 'Western_concert_flute', label: 'Flute', family: 'Woodwind' },
  { wiki: 'Saxophone', label: 'Saxophone', family: 'Woodwind' },
  { wiki: 'Recorder_(musical_instrument)', label: 'Recorder', family: 'Woodwind' },
  { wiki: 'Bagpipes', label: 'Bagpipes', family: 'Woodwind' },
  { wiki: 'Duduk', label: 'Duduk', family: 'Woodwind' },
  { wiki: 'Shakuhachi', label: 'Shakuhachi', family: 'Woodwind' },
  { wiki: 'Ney', label: 'Ney', family: 'Woodwind' },
  { wiki: 'Bansuri', label: 'Bansuri', family: 'Woodwind' },
  { wiki: 'Dizi_(instrument)', label: 'Dizi', family: 'Woodwind' },
  { wiki: 'Pan_flute', label: 'Pan flute', family: 'Woodwind' },

  // Brass
  { wiki: 'Trumpet', label: 'Trumpet', family: 'Brass' },
  { wiki: 'Trombone', label: 'Trombone', family: 'Brass' },
  { wiki: 'French_horn', label: 'French horn', family: 'Brass' },
  { wiki: 'Tuba', label: 'Tuba', family: 'Brass' },
  { wiki: 'Sousaphone', label: 'Sousaphone', family: 'Brass' },
  { wiki: 'Flugelhorn', label: 'Flugelhorn', family: 'Brass' },
  { wiki: 'Didgeridoo', label: 'Didgeridoo', family: 'Brass' },

  // Strings
  { wiki: 'Violin', label: 'Violin', family: 'String' },
  { wiki: 'Cello', label: 'Cello', family: 'String' },
  { wiki: 'Double_bass', label: 'Double bass', family: 'String' },
  { wiki: 'Harp', label: 'Harp', family: 'String' },
  { wiki: 'Ukulele', label: 'Ukulele', family: 'String' },
  { wiki: 'Mandolin', label: 'Mandolin', family: 'String' },
  { wiki: 'Sitar', label: 'Sitar', family: 'String' },
  { wiki: 'Balalaika', label: 'Balalaika', family: 'String' },
  { wiki: 'Oud', label: 'Oud', family: 'String' },
  { wiki: 'Erhu', label: 'Erhu', family: 'String' },
  { wiki: 'Guzheng', label: 'Guzheng', family: 'String' },
  { wiki: 'Pipa', label: 'Pipa', family: 'String' },
  { wiki: 'Koto_(instrument)', label: 'Koto', family: 'String' },
  { wiki: 'Shamisen', label: 'Shamisen', family: 'String' },
  { wiki: 'Kora_(instrument)', label: 'Kora', family: 'String' },
  { wiki: 'Bouzouki', label: 'Bouzouki', family: 'String' },
  { wiki: 'Charango', label: 'Charango', family: 'String' },
  { wiki: 'Sarod', label: 'Sarod', family: 'String' },
  { wiki: 'Sarangi', label: 'Sarangi', family: 'String' },
  { wiki: 'Hurdy-gurdy', label: 'Hurdy-gurdy', family: 'String' },
  { wiki: 'Nyckelharpa', label: 'Nyckelharpa', family: 'String' },
  { wiki: 'Berimbau', label: 'Berimbau', family: 'String' },
  { wiki: 'Zither', label: 'Zither', family: 'String' },
  { wiki: 'Qanun_(instrument)', label: 'Qanun', family: 'String' },
  { wiki: 'Cimbalom', label: 'Cimbalom', family: 'String' },

  // Percussion
  { wiki: 'Djembe', label: 'Djembe', family: 'Percussion' },
  { wiki: 'Marimba', label: 'Marimba', family: 'Percussion' },
  { wiki: 'Xylophone', label: 'Xylophone', family: 'Percussion' },
  { wiki: 'Vibraphone', label: 'Vibraphone', family: 'Percussion' },
  { wiki: 'Timpani', label: 'Timpani', family: 'Percussion' },
  { wiki: 'Steelpan', label: 'Steelpan', family: 'Percussion' },
  { wiki: 'Tabla', label: 'Tabla', family: 'Percussion' },
  { wiki: 'Taiko', label: 'Taiko', family: 'Percussion' },
  { wiki: 'Cajón', label: 'Cajón', family: 'Percussion' },
  { wiki: 'Bodhrán', label: 'Bodhrán', family: 'Percussion' },
  { wiki: 'Mbira', label: 'Mbira', family: 'Percussion' },
  { wiki: 'Talking_drum', label: 'Talking drum', family: 'Percussion' },
  { wiki: 'Gong', label: 'Gong', family: 'Percussion' },

  // Keyboards
  { wiki: 'Piano', label: 'Piano', family: 'Keyboard' },
  { wiki: 'Harpsichord', label: 'Harpsichord', family: 'Keyboard' },
  { wiki: 'Pipe_organ', label: 'Pipe organ', family: 'Keyboard' },
  { wiki: 'Celesta', label: 'Celesta', family: 'Keyboard' },

  // Free reed
  { wiki: 'Accordion', label: 'Accordion', family: 'Free reed' },
  { wiki: 'Bandoneon', label: 'Bandoneon', family: 'Free reed' },
  { wiki: 'Harmonica', label: 'Harmonica', family: 'Free reed' },
  { wiki: 'Sheng_(instrument)', label: 'Sheng', family: 'Free reed' },

  // Electronic
  { wiki: 'Theremin', label: 'Theremin', family: 'Electronic' },
  { wiki: 'Synthesizer', label: 'Synthesizer', family: 'Electronic' },
];
