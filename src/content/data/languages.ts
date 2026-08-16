/**
 * One short everyday sentence per language, written in the script that language
 * actually uses — not romanised, because the alphabet is half the puzzle.
 *
 * Accuracy is the whole point here. A wrong sentence in a language nobody in the
 * room speaks looks fine and teaches nonsense, so nothing went in unless the
 * wording is ordinary, idiomatic and spelled the way a speaker would write it.
 * A dozen candidates were dropped for failing that bar rather than guessed at —
 * mostly languages where the tone marks, diacritics or script are easy to get
 * subtly wrong (Lao, Khmer, Burmese, Sinhala, Pashto, Tajik, Somali).
 *
 * Sentences also avoid naming their own language: "I speak a little Norwegian"
 * is not a question, it is an answer.
 *
 * `family` groups languages so the three decoys are relatives. Spanish among
 * three Romance languages is a real question; Spanish among three Asian
 * languages answers itself. Small families get topped up from anywhere.
 */
export type LanguageFamily =
  | 'Albanian'
  | 'Armenian'
  | 'Austroasiatic'
  | 'Austronesian'
  | 'Baltic'
  | 'Celtic'
  | 'Dravidian'
  | 'Germanic'
  | 'Hellenic'
  | 'Indo-Aryan'
  | 'Iranian'
  | 'Japonic'
  | 'Kartvelian'
  | 'Koreanic'
  | 'Kra-Dai'
  | 'Language isolate'
  | 'Mongolic'
  | 'Niger-Congo'
  | 'Romance'
  | 'Semitic'
  | 'Sino-Tibetan'
  | 'Slavic'
  | 'Turkic'
  | 'Uralic';

export type LanguageSeed = {
  /** One everyday sentence, in the language's own script. */
  text: string;
  language: string;
  family: LanguageFamily;
  /** Writing system — the first and weakest rung, since the text already shows it. */
  script: string;
  /** Where it is spoken — the last rung. */
  hint: string;
};

export const LANGUAGES: LanguageSeed[] = [
  // ── Germanic ──────────────────────────────────────────────────────────────
  { text: 'Ik begrijp er niets van.', language: 'Dutch', family: 'Germanic', script: 'Latin alphabet', hint: 'Spoken in the Netherlands and in the north of Belgium' },
  { text: 'Wo ist der nächste Bahnhof?', language: 'German', family: 'Germanic', script: 'Latin alphabet', hint: 'Official in Germany, Austria and most of Switzerland' },
  { text: 'Jag förstår inte vad du säger.', language: 'Swedish', family: 'Germanic', script: 'Latin alphabet', hint: 'Spoken in Sweden and by a minority along the Finnish coast' },
  { text: 'Kan du hjelpe meg?', language: 'Norwegian', family: 'Germanic', script: 'Latin alphabet', hint: 'Spoken in Norway, which keeps two competing written standards' },
  { text: 'Hvad koster en billet til byen?', language: 'Danish', family: 'Germanic', script: 'Latin alphabet', hint: 'Spoken in Denmark, and still taught in Greenland and the Faroes' },
  { text: 'Hvað heitir þú?', language: 'Icelandic', family: 'Germanic', script: 'Latin alphabet, with þ and ð', hint: 'Spoken by about 350,000 people on one North Atlantic island' },
  { text: 'Ek weet nie waar my sleutels is nie.', language: 'Afrikaans', family: 'Germanic', script: 'Latin alphabet', hint: 'Spoken in South Africa and Namibia' },

  // ── Romance ───────────────────────────────────────────────────────────────
  { text: '¿Dónde está la estación de tren?', language: 'Spanish', family: 'Romance', script: 'Latin alphabet', hint: 'Spoken in Spain and across most of Latin America' },
  { text: 'Amanhã vou trabalhar mais cedo.', language: 'Portuguese', family: 'Romance', script: 'Latin alphabet', hint: 'Spoken in Portugal, Brazil, Angola and Mozambique' },
  { text: 'Je ne sais pas où sont mes clés.', language: 'French', family: 'Romance', script: 'Latin alphabet', hint: 'Official in France, part of Canada and much of West Africa' },
  { text: 'Che ore sono, per favore?', language: 'Italian', family: 'Romance', script: 'Latin alphabet', hint: 'Spoken in Italy, San Marino and the south of Switzerland' },
  { text: 'Nu știu unde este gara.', language: 'Romanian', family: 'Romance', script: 'Latin alphabet, with ș and ț', hint: 'Spoken in Romania and Moldova' },
  { text: 'No sé on he deixat les claus.', language: 'Catalan', family: 'Romance', script: 'Latin alphabet', hint: 'Spoken in eastern Spain, Andorra and a strip of southern France' },

  // ── Slavic ────────────────────────────────────────────────────────────────
  { text: 'Я не понимаю, что вы говорите.', language: 'Russian', family: 'Slavic', script: 'Cyrillic alphabet', hint: 'Spoken across Russia and widely as a second language in Central Asia' },
  { text: 'Я не розумію, що ви кажете.', language: 'Ukrainian', family: 'Slavic', script: 'Cyrillic alphabet, with і, ї and є', hint: 'Spoken in Ukraine' },
  { text: 'Nie wiem, gdzie są moje klucze.', language: 'Polish', family: 'Slavic', script: 'Latin alphabet, with ł and ą', hint: 'Spoken in Poland' },
  { text: 'Nevím, kde jsou moje klíče.', language: 'Czech', family: 'Slavic', script: 'Latin alphabet, with háčeks', hint: 'Spoken in Czechia' },
  { text: 'Не разбирам какво казвате.', language: 'Bulgarian', family: 'Slavic', script: 'Cyrillic alphabet', hint: 'Spoken in Bulgaria, whose medieval ancestor was the first Slavic language written down' },
  { text: 'Не знам где су моји кључеви.', language: 'Serbian', family: 'Slavic', script: 'Cyrillic alphabet, though Latin is used just as often', hint: 'Spoken in Serbia, Bosnia and Montenegro' },

  // ── Celtic ────────────────────────────────────────────────────────────────
  { text: 'Tá ocras orm.', language: 'Irish', family: 'Celtic', script: 'Latin alphabet', hint: 'The first official language of Ireland, spoken daily by a small minority' },
  { text: 'Dw i ddim yn deall.', language: 'Welsh', family: 'Celtic', script: 'Latin alphabet', hint: 'Spoken in Wales' },
  { text: 'Tha mi sgìth.', language: 'Scottish Gaelic', family: 'Celtic', script: 'Latin alphabet', hint: 'Spoken in the Highlands and the Western Isles of Scotland' },

  // ── Baltic ────────────────────────────────────────────────────────────────
  { text: 'Kiek tai kainuoja?', language: 'Lithuanian', family: 'Baltic', script: 'Latin alphabet', hint: 'Spoken in Lithuania' },
  { text: 'Cik tas maksā?', language: 'Latvian', family: 'Baltic', script: 'Latin alphabet, with macrons', hint: 'Spoken in Latvia' },

  // ── Uralic ────────────────────────────────────────────────────────────────
  { text: 'En tiedä, missä avaimeni ovat.', language: 'Finnish', family: 'Uralic', script: 'Latin alphabet', hint: 'Spoken in Finland' },
  { text: 'Nem tudom, hol vannak a kulcsaim.', language: 'Hungarian', family: 'Uralic', script: 'Latin alphabet, with ő and ű', hint: 'Spoken in Hungary and by minorities in Romania and Slovakia' },
  { text: 'Ma ei tea, kus mu võtmed on.', language: 'Estonian', family: 'Uralic', script: 'Latin alphabet, with õ', hint: 'Spoken in Estonia' },

  // ── Other branches of Indo-European, and one isolate ───────────────────────
  { text: 'Δεν καταλαβαίνω τίποτα.', language: 'Greek', family: 'Hellenic', script: 'Greek alphabet', hint: 'Spoken in Greece and Cyprus' },
  { text: 'Nuk e di se ku janë çelësat e mi.', language: 'Albanian', family: 'Albanian', script: 'Latin alphabet', hint: 'Spoken in Albania, Kosovo and North Macedonia' },
  { text: 'Ես չեմ հասկանում։', language: 'Armenian', family: 'Armenian', script: 'Armenian alphabet', hint: 'Spoken in Armenia and across a very large diaspora' },
  { text: 'მე არ მესმის.', language: 'Georgian', family: 'Kartvelian', script: 'Georgian (Mkhedruli)', hint: 'Spoken in Georgia, in the Caucasus' },
  { text: 'Ez dakit non dauden nire giltzak.', language: 'Basque', family: 'Language isolate', script: 'Latin alphabet', hint: 'Spoken in northern Spain and south-west France, and related to nothing else' },

  // ── Indo-Aryan ────────────────────────────────────────────────────────────
  { text: 'मुझे नहीं पता वह कहाँ है।', language: 'Hindi', family: 'Indo-Aryan', script: 'Devanagari', hint: 'Spoken across northern India' },
  { text: 'আমি তোমার কথা বুঝতে পারছি না।', language: 'Bengali', family: 'Indo-Aryan', script: 'Bengali script', hint: 'Spoken in Bangladesh and in West Bengal' },
  { text: 'مجھے نہیں معلوم وہ کہاں ہے۔', language: 'Urdu', family: 'Indo-Aryan', script: 'Arabic script, in the flowing nastaliq style', hint: 'The national language of Pakistan' },
  { text: 'ਮੈਨੂੰ ਨਹੀਂ ਪਤਾ ਉਹ ਕਿੱਥੇ ਹੈ।', language: 'Punjabi', family: 'Indo-Aryan', script: 'Gurmukhi', hint: 'Spoken in the Punjab, on both sides of the India–Pakistan border' },
  { text: 'मला भूक लागली आहे.', language: 'Marathi', family: 'Indo-Aryan', script: 'Devanagari', hint: 'Spoken in Maharashtra, the state around Mumbai' },
  { text: 'મને ભૂખ લાગી છે.', language: 'Gujarati', family: 'Indo-Aryan', script: 'Gujarati script', hint: 'Spoken in Gujarat, in western India' },

  // ── Iranian ───────────────────────────────────────────────────────────────
  { text: 'کتاب روی میز است.', language: 'Persian', family: 'Iranian', script: 'Arabic script, with four extra letters', hint: 'Spoken in Iran; close relatives are spoken in Afghanistan and Tajikistan' },
  { text: 'Ez ji te hez dikim.', language: 'Kurdish', family: 'Iranian', script: 'Latin alphabet in Turkey and Syria, Arabic script in Iraq and Iran', hint: 'Spoken across parts of Turkey, Iraq, Iran and Syria' },

  // ── Dravidian ─────────────────────────────────────────────────────────────
  { text: 'எனக்குப் புரியவில்லை.', language: 'Tamil', family: 'Dravidian', script: 'Tamil script', hint: 'Spoken in Tamil Nadu, Sri Lanka and Singapore' },
  { text: 'నాకు అర్థం కావడం లేదు.', language: 'Telugu', family: 'Dravidian', script: 'Telugu script', hint: 'Spoken in Andhra Pradesh and Telangana' },
  { text: 'ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ.', language: 'Kannada', family: 'Dravidian', script: 'Kannada script', hint: 'Spoken in Karnataka, the state around Bengaluru' },
  { text: 'എനിക്ക് മനസ്സിലാകുന്നില്ല.', language: 'Malayalam', family: 'Dravidian', script: 'Malayalam script', hint: 'Spoken in Kerala, on the south-west coast of India' },

  // ── Turkic ────────────────────────────────────────────────────────────────
  { text: 'Ne dediğini anlamıyorum.', language: 'Turkish', family: 'Turkic', script: 'Latin alphabet, with a dotless ı', hint: 'Spoken in Turkey and northern Cyprus' },
  { text: 'Mən səni başa düşmürəm.', language: 'Azerbaijani', family: 'Turkic', script: 'Latin alphabet, with ə', hint: 'Spoken in Azerbaijan and in north-western Iran' },
  { text: 'Men sizni tushunmadim.', language: 'Uzbek', family: 'Turkic', script: 'Latin alphabet', hint: 'Spoken in Uzbekistan, the most populous country in Central Asia' },
  { text: 'Сіз қалайсыз?', language: 'Kazakh', family: 'Turkic', script: 'Cyrillic alphabet, with қ, ң and ұ', hint: 'Spoken in Kazakhstan' },

  // ── Mongolic ──────────────────────────────────────────────────────────────
  { text: 'Би ойлгохгүй байна.', language: 'Mongolian', family: 'Mongolic', script: 'Cyrillic alphabet, with ө and ү', hint: 'Spoken in Mongolia and in Inner Mongolia, in China' },

  // ── Semitic ───────────────────────────────────────────────────────────────
  { text: 'أين محطة القطار؟', language: 'Arabic', family: 'Semitic', script: 'Arabic script', hint: 'Official across North Africa and the Middle East' },
  { text: 'אני לא מבין מה אתה אומר.', language: 'Hebrew', family: 'Semitic', script: 'Hebrew alphabet', hint: 'Spoken in Israel, having been revived as an everyday language about a century ago' },
  { text: 'ይቅርታ፣ አልገባኝም።', language: 'Amharic', family: 'Semitic', script: 'Ethiopic (Geʽez) script', hint: 'The working language of Ethiopia' },
  { text: 'Kif int illum?', language: 'Maltese', family: 'Semitic', script: 'Latin alphabet, with ħ and ġ', hint: 'Spoken in Malta, and the only Semitic language written in Latin letters' },

  // ── Niger-Congo ───────────────────────────────────────────────────────────
  { text: 'Sielewi unachosema.', language: 'Swahili', family: 'Niger-Congo', script: 'Latin alphabet', hint: 'A lingua franca across Kenya, Tanzania and the eastern Congo' },
  { text: 'Angazi ukuthi uphi.', language: 'Zulu', family: 'Niger-Congo', script: 'Latin alphabet', hint: 'The most widely spoken home language in South Africa' },
  { text: 'Mo fẹ́ràn oúnjẹ yìí.', language: 'Yoruba', family: 'Niger-Congo', script: 'Latin alphabet, with tone marks and dots below', hint: 'Spoken in south-western Nigeria and in Benin' },
  { text: 'Aha m bụ Chidi.', language: 'Igbo', family: 'Niger-Congo', script: 'Latin alphabet, with dots below', hint: 'Spoken in south-eastern Nigeria' },

  // ── Austronesian ──────────────────────────────────────────────────────────
  { text: 'Saya tidak tahu di mana kunci saya.', language: 'Indonesian', family: 'Austronesian', script: 'Latin alphabet', hint: 'The national language of Indonesia, learned as a second language by most of its speakers' },
  { text: 'Hindi ko alam kung nasaan siya.', language: 'Tagalog', family: 'Austronesian', script: 'Latin alphabet', hint: 'Spoken around Manila, and the basis of Filipino' },
  { text: 'Aku ora ngerti.', language: 'Javanese', family: 'Austronesian', script: 'Latin alphabet', hint: 'Spoken on Java by more people than speak Italian' },
  { text: 'Manao ahoana ianao?', language: 'Malagasy', family: 'Austronesian', script: 'Latin alphabet', hint: 'Spoken in Madagascar, though its closest relatives are in Borneo' },

  // ── East and South-East Asia ──────────────────────────────────────────────
  { text: '我不知道他在哪里。', language: 'Mandarin Chinese', family: 'Sino-Tibetan', script: 'Chinese characters', hint: 'The official spoken language of China, Taiwan and Singapore' },
  { text: '我唔知佢喺邊度。', language: 'Cantonese', family: 'Sino-Tibetan', script: 'Chinese characters, including some used only for this language', hint: 'Spoken in Guangdong, Hong Kong and Macau' },
  { text: '駅はどこですか。', language: 'Japanese', family: 'Japonic', script: 'Kanji mixed with two kana syllabaries', hint: 'Spoken in Japan' },
  { text: '무슨 말인지 모르겠어요.', language: 'Korean', family: 'Koreanic', script: 'Hangul', hint: 'Spoken in North and South Korea' },
  { text: 'ผมไม่เข้าใจครับ', language: 'Thai', family: 'Kra-Dai', script: 'Thai script, written without spaces between words', hint: 'Spoken in Thailand' },
  { text: 'Tôi không hiểu bạn nói gì.', language: 'Vietnamese', family: 'Austroasiatic', script: 'Latin alphabet, with stacked tone marks', hint: 'Spoken in Vietnam' },
];
