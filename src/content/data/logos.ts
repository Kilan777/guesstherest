/**
 * Company logos, keyed to their English Wikipedia articles.
 *
 * The catch with this source is that a company article does not reliably lead
 * with the company's mark. Plenty lead with a photograph of the headquarters,
 * a shop front, a founder or a product — `Nike, Inc.` opens on its Beaverton
 * campus, `Microsoft` on an aerial shot of Redmond, `Coca-Cola` on a bottle —
 * and a round showing an office block is both unguessable and looks broken.
 *
 * So every title below was checked against the summary API and kept only if the
 * lead image file is actually the mark. Where the company article failed and a
 * dedicated article for the mark exists, that is used instead: `Swoosh` for
 * Nike. Everything else was dropped rather than fudged. The accepted filename
 * is noted against each entry so the next person can re-check without
 * re-deriving the list; Wikimedia does rename files, and a title that stops
 * resolving is dropped by the loader at runtime.
 *
 * Titles are stored decoded — `McDonald's`, not `McDonald%27s`. `pageInfo`
 * encodes them itself, and encoding an already-encoded title yields a 403.
 *
 * Naming a brand from its mark is nominative use; the marks are shown as
 * published, unaltered apart from the reveal, and no endorsement is implied.
 *
 * ── FREE FILES ONLY ────────────────────────────────────────────────────────
 * Every entry has additionally been checked for where its file is *hosted*,
 * which is what decides whether this site may show it at all.
 *
 * English Wikipedia hosts a large number of logos locally, under its own
 * fair-use rationale. That rationale covers en.wikipedia's encyclopedic use and
 * nobody else's — it does not extend to an ad-supported game hotlinking the
 * same file. Wikimedia Commons, by contrast, accepts only freely licensed or
 * public-domain media, so a file that lives there is one we may use.
 *
 * The signal is in the URL the loader ends up fetching:
 *
 *   upload.wikimedia.org/wikipedia/commons/…  → free, keep
 *   upload.wikimedia.org/wikipedia/en/…       → local en upload, drop
 *
 * Sixteen entries were removed on that basis. Eleven were outright non-free
 * (Starbucks, Red Bull, Nestlé, Pringles, Guinness, Jack Daniel's, Ferrari,
 * Puma, Shell, BP, TotalEnergies — all categorised "All non-free logos" with a
 * fair-use rationale attached). Four more (Huawei, Chanel, Carrefour, Xbox) are
 * tagged public domain *in the United States only* and sit in "Wikipedia files
 * not suitable for Commons" — Commons rejects them because they are still
 * copyrighted in their country of origin, which is not a bet worth taking for a
 * commercial site with a worldwide audience. Instagram was dropped for a
 * different reason: its article's lead image is now a screenshot of the app,
 * not the mark, so the round was unplayable anyway.
 *
 * Wikipedia's own globe survives the cut and is not an oversight: the file is
 * CC BY-SA 3.0, exists on Commons, and is kept locally only because the page is
 * upload-protected.
 *
 * Adding an entry means re-running that check. A title whose lead image quietly
 * moves to a non-free file will keep working and stop being allowed.
 */
export type LogoSeed = { wiki: string; label: string; sector: string };

export const LOGOS: LogoSeed[] = [
  // ── technology and internet ────────────────────────────────────────────────
  { wiki: 'Apple Inc.', label: 'Apple', sector: 'Technology' }, // Apple_logo_black.svg
  { wiki: 'WhatsApp', label: 'WhatsApp', sector: 'Messaging' }, // WhatsApp_Logo_green.svg
  { wiki: 'X (social network)', label: 'X', sector: 'Social media' }, // X_(formerly_Twitter)_logo_late_2025.svg
  { wiki: 'Firefox', label: 'Firefox', sector: 'Software' }, // Firefox_logo,_2019.svg
  { wiki: 'Wikipedia', label: 'Wikipedia', sector: 'Internet' }, // Wikipedia-logo-v2.svg

  // ── food and drink ─────────────────────────────────────────────────────────
  { wiki: "McDonald's", label: "McDonald's", sector: 'Fast food' }, // McDonald's_Golden_Arches.svg
  { wiki: 'Burger King', label: 'Burger King', sector: 'Fast food' }, // Burger_King_2020.svg
  { wiki: 'Pepsi', label: 'Pepsi', sector: 'Soft drinks' }, // Pepsi_2023.svg
  { wiki: "Lay's", label: "Lay's", sector: 'Snacks' }, // Lay's_2025.svg
  { wiki: 'Kit Kat', label: 'Kit Kat', sector: 'Confectionery' }, // Logo_of_the_KitKat.svg

  // ── cars and motoring ──────────────────────────────────────────────────────
  { wiki: 'Volkswagen', label: 'Volkswagen', sector: 'Cars' }, // Volkswagen_logo_2019.svg
  { wiki: 'BMW', label: 'BMW', sector: 'Cars' }, // Logo_BMW_Group_2021.svg
  { wiki: 'Mercedes-Benz', label: 'Mercedes-Benz', sector: 'Cars' }, // Mercedes-Benz_Star_(1969-1986,_2025-).svg
  { wiki: 'Volvo Cars', label: 'Volvo', sector: 'Cars' }, // Volvo-Iron-Mark-Black.svg
  { wiki: 'Tesla, Inc.', label: 'Tesla', sector: 'Cars' }, // Tesla_Motors.svg
  { wiki: 'Harley-Davidson', label: 'Harley-Davidson', sector: 'Motorcycles' }, // Harley_Davidson_orange_logo.svg

  // ── fashion and sport ──────────────────────────────────────────────────────
  // The Nike article leads with a photo of the Beaverton campus; `Swoosh` is
  // the article about the mark itself.
  { wiki: 'Swoosh', label: 'Nike', sector: 'Sportswear' }, // Logo_NIKE.svg
  { wiki: 'Adidas', label: 'Adidas', sector: 'Sportswear' }, // Adidas_2022_logo.svg
  { wiki: 'H&M', label: 'H&M', sector: 'Clothing retail' }, // H&M-Logo.svg
  { wiki: 'Rolex', label: 'Rolex', sector: 'Watches' }, // Logo_da_Rolex.png
  { wiki: 'Ray-Ban', label: 'Ray-Ban', sector: 'Eyewear' }, // Ray-Ban_logo.svg

  // ── airlines ───────────────────────────────────────────────────────────────
  // Thin on purpose: almost every airline article leads with a photograph of an
  // aircraft, which is a different game entirely. These three lead with the mark.
  { wiki: 'Emirates (airline)', label: 'Emirates', sector: 'Airlines' }, // Emirates_Logo.svg
  { wiki: 'KLM', label: 'KLM', sector: 'Airlines' }, // KLM_logo.svg
  { wiki: 'AirAsia', label: 'AirAsia', sector: 'Airlines' }, // AirAsia_New_Logo.svg

  // ── banking and payments ───────────────────────────────────────────────────
  { wiki: 'Mastercard', label: 'Mastercard', sector: 'Payments' }, // Mastercard_2019_logo.svg
  { wiki: 'American Express', label: 'American Express', sector: 'Payments' }, // American_Express_logo_(2018).svg
  // The article is Citigroup; the mark reads "citi", which is what a player types.
  { wiki: 'Citigroup', label: 'Citi', sector: 'Banking' }, // Citi_logo_March_2023.svg
  { wiki: 'Wells Fargo', label: 'Wells Fargo', sector: 'Banking' }, // Wells_Fargo_Logo_(2020).svg

  // ── retail ─────────────────────────────────────────────────────────────────
  { wiki: 'Walmart', label: 'Walmart', sector: 'Retail' }, // Walmart_spark_(2025).svg
  { wiki: 'Target Corporation', label: 'Target', sector: 'Retail' }, // Target_2004_bullseye.svg
  { wiki: 'Lidl', label: 'Lidl', sector: 'Retail' }, // Lidl-Logo.svg
  { wiki: 'eBay', label: 'eBay', sector: 'Retail' }, // EBay_logo.svg

  // ── media ──────────────────────────────────────────────────────────────────
  { wiki: 'Disney', label: 'Disney', sector: 'Media' }, // The_Walt_Disney_company_logo.svg
  { wiki: 'Warner Bros.', label: 'Warner Bros.', sector: 'Media' }, // Warner_Bros._Discovery_(symbol).svg
  { wiki: 'Universal Pictures', label: 'Universal Pictures', sector: 'Media' }, // Universal_Pictures_logo.svg
  { wiki: 'Paramount Pictures', label: 'Paramount Pictures', sector: 'Media' }, // Paramount_Pictures_with_Skydance_byline.svg
  { wiki: 'HBO', label: 'HBO', sector: 'Media' }, // HBO_logo.svg

  // ── games and toys ─────────────────────────────────────────────────────────
  { wiki: 'Lego', label: 'Lego', sector: 'Toys' }, // LEGO_logo.svg

  // ── everything else ────────────────────────────────────────────────────────
  { wiki: 'United Parcel Service', label: 'UPS', sector: 'Logistics' }, // United_Parcel_Service_logo_2014.svg
  { wiki: '3M', label: '3M', sector: 'Industry' }, // 3M_wordmark.svg
  { wiki: 'Bayer', label: 'Bayer', sector: 'Pharmaceuticals' }, // Logo_Bayer.svg
  { wiki: 'Nivea', label: 'Nivea', sector: 'Personal care' }, // NIVEA_logo_2021.svg
];
