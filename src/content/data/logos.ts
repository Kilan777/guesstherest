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
 */
export type LogoSeed = { wiki: string; label: string; sector: string };

export const LOGOS: LogoSeed[] = [
  // ── technology and internet ────────────────────────────────────────────────
  { wiki: 'Apple Inc.', label: 'Apple', sector: 'Technology' }, // Apple_logo_black.svg
  { wiki: 'Huawei', label: 'Huawei', sector: 'Electronics' }, // Huawei_Standard_logo.svg
  { wiki: 'Instagram', label: 'Instagram', sector: 'Social media' }, // Instagram_logo_2022.svg
  { wiki: 'WhatsApp', label: 'WhatsApp', sector: 'Messaging' }, // WhatsApp_Logo_green.svg
  { wiki: 'X (social network)', label: 'X', sector: 'Social media' }, // X_(formerly_Twitter)_logo_late_2025.svg
  { wiki: 'Firefox', label: 'Firefox', sector: 'Software' }, // Firefox_logo,_2019.svg
  { wiki: 'Wikipedia', label: 'Wikipedia', sector: 'Internet' }, // Wikipedia-logo-v2.svg

  // ── food and drink ─────────────────────────────────────────────────────────
  { wiki: "McDonald's", label: "McDonald's", sector: 'Fast food' }, // McDonald's_Golden_Arches.svg
  { wiki: 'Burger King', label: 'Burger King', sector: 'Fast food' }, // Burger_King_2020.svg
  { wiki: 'Starbucks', label: 'Starbucks', sector: 'Coffee' }, // Starbucks_Corporation_Logo_2011.svg
  { wiki: 'Pepsi', label: 'Pepsi', sector: 'Soft drinks' }, // Pepsi_2023.svg
  { wiki: 'Red Bull', label: 'Red Bull', sector: 'Energy drinks' }, // RedBullEnergyDrink.svg
  { wiki: 'Nestlé', label: 'Nestlé', sector: 'Food' }, // Nestlé.svg
  { wiki: "Lay's", label: "Lay's", sector: 'Snacks' }, // Lay's_2025.svg
  { wiki: 'Pringles', label: 'Pringles', sector: 'Snacks' }, // Pringles_2021.svg
  { wiki: 'Kit Kat', label: 'Kit Kat', sector: 'Confectionery' }, // Logo_of_the_KitKat.svg
  { wiki: 'Guinness', label: 'Guinness', sector: 'Beer' }, // Guinness_logo_dark_text.svg
  { wiki: "Jack Daniel's", label: "Jack Daniel's", sector: 'Whiskey' }, // Jack_Daniels_Logo.svg

  // ── cars and motoring ──────────────────────────────────────────────────────
  { wiki: 'Volkswagen', label: 'Volkswagen', sector: 'Cars' }, // Volkswagen_logo_2019.svg
  { wiki: 'BMW', label: 'BMW', sector: 'Cars' }, // Logo_BMW_Group_2021.svg
  { wiki: 'Mercedes-Benz', label: 'Mercedes-Benz', sector: 'Cars' }, // Mercedes-Benz_Star_(1969-1986,_2025-).svg
  { wiki: 'Ferrari', label: 'Ferrari', sector: 'Cars' }, // Prancing_horse.svg
  { wiki: 'Volvo Cars', label: 'Volvo', sector: 'Cars' }, // Volvo-Iron-Mark-Black.svg
  { wiki: 'Tesla, Inc.', label: 'Tesla', sector: 'Cars' }, // Tesla_Motors.svg
  { wiki: 'Harley-Davidson', label: 'Harley-Davidson', sector: 'Motorcycles' }, // Harley_Davidson_orange_logo.svg

  // ── fashion and sport ──────────────────────────────────────────────────────
  // The Nike article leads with a photo of the Beaverton campus; `Swoosh` is
  // the article about the mark itself.
  { wiki: 'Swoosh', label: 'Nike', sector: 'Sportswear' }, // Logo_NIKE.svg
  { wiki: 'Adidas', label: 'Adidas', sector: 'Sportswear' }, // Adidas_2022_logo.svg
  { wiki: 'Puma (brand)', label: 'Puma', sector: 'Sportswear' }, // Puma_complete_logo.svg
  { wiki: 'Chanel', label: 'Chanel', sector: 'Fashion' }, // Chanel_logo_interlocking_cs.svg
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
  { wiki: 'Carrefour', label: 'Carrefour', sector: 'Retail' }, // Carrefour_Groupe.svg
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
  { wiki: 'Xbox', label: 'Xbox', sector: 'Video games' }, // XBOX_logo_(2026).png

  // ── energy ─────────────────────────────────────────────────────────────────
  { wiki: 'Shell plc', label: 'Shell', sector: 'Oil and gas' }, // Shell_logo.svg
  { wiki: 'BP', label: 'BP', sector: 'Oil and gas' }, // BP_Helios_logo.svg
  { wiki: 'TotalEnergies', label: 'TotalEnergies', sector: 'Oil and gas' }, // TotalEnergies_logo.svg

  // ── everything else ────────────────────────────────────────────────────────
  { wiki: 'United Parcel Service', label: 'UPS', sector: 'Logistics' }, // United_Parcel_Service_logo_2014.svg
  { wiki: '3M', label: '3M', sector: 'Industry' }, // 3M_wordmark.svg
  { wiki: 'Bayer', label: 'Bayer', sector: 'Pharmaceuticals' }, // Logo_Bayer.svg
  { wiki: 'Nivea', label: 'Nivea', sector: 'Personal care' }, // NIVEA_logo_2021.svg
];
