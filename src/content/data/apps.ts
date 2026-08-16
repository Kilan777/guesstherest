/**
 * App Store apps whose icon is recognisable from a corner of it.
 *
 * `name` is the store's own listing name trimmed to the part everybody uses —
 * the lookup accepts a longer store title as long as it *starts* with this, so
 * "Telegram" finds "Telegram Messenger" but "Signal" never matches "Signal
 * Booster Pro". `seller` is the developer exactly as the App Store reports it,
 * which is not always the brand: Venmo is filed under The Delancey Corporation,
 * Amazon under AMZN Mobile, Instacart under Maplebear. Every pair here was run
 * against the live Search API and resolves to a 512px icon.
 *
 * Apps that only exist under a name nobody would type (Deliveroo as ROOFOODS,
 * SHEIN as Roadget) or that have left the US store (Skype, plain Binance) are
 * deliberately absent.
 */
export type AppSeed = { name: string; seller: string };

export const APPS: AppSeed[] = [
  // Social
  { name: 'Instagram', seller: 'Instagram' },
  { name: 'TikTok', seller: 'TikTok' },
  { name: 'Facebook', seller: 'Meta Platforms' },
  { name: 'Snapchat', seller: 'Snap' },
  { name: 'Pinterest', seller: 'Pinterest' },
  { name: 'Reddit', seller: 'Reddit' },
  { name: 'LinkedIn', seller: 'LinkedIn' },
  { name: 'Threads', seller: 'Instagram' },
  { name: 'Discord', seller: 'Discord' },
  { name: 'Twitch', seller: 'Twitch Interactive' },
  { name: 'Tumblr', seller: 'Tumblr' },

  // Messaging and calls
  { name: 'WhatsApp', seller: 'WhatsApp' },
  { name: 'Messenger', seller: 'Meta Platforms' },
  { name: 'Telegram', seller: 'Telegram' },
  { name: 'Signal', seller: 'Signal Messenger' },
  { name: 'WeChat', seller: 'Tencent' },
  { name: 'Rakuten Viber', seller: 'Viber Media' },
  { name: 'Slack', seller: 'Slack Technologies' },
  { name: 'Zoom', seller: 'Zoom Communications' },
  { name: 'Microsoft Teams', seller: 'Microsoft' },

  // Music and video
  { name: 'Spotify', seller: 'Spotify' },
  { name: 'Netflix', seller: 'Netflix' },
  { name: 'YouTube', seller: 'Google' },
  { name: 'Disney+', seller: 'Disney' },
  { name: 'Hulu', seller: 'Hulu' },
  { name: 'SoundCloud', seller: 'SoundCloud' },
  { name: 'Shazam', seller: 'Apple' },
  { name: 'Pandora', seller: 'Pandora Media' },
  { name: 'Plex', seller: 'Plex' },

  // Games
  { name: 'Candy Crush Saga', seller: 'King.com' },
  { name: 'Clash of Clans', seller: 'Supercell' },
  { name: 'Clash Royale', seller: 'Supercell' },
  { name: 'Roblox', seller: 'Roblox' },
  { name: 'Minecraft', seller: 'Mojang' },
  { name: 'Among Us', seller: 'Innersloth' },
  { name: 'Subway Surfers', seller: 'Sybo Games' },
  { name: 'Pokémon GO', seller: 'Scopely' },
  { name: 'Angry Birds 2', seller: 'Rovio' },
  { name: 'Fruit Ninja', seller: 'Halfbrick' },
  { name: 'Genshin Impact', seller: 'Cognosphere' },
  { name: 'Call of Duty: Mobile', seller: 'Activision' },
  { name: 'Chess.com', seller: 'Chess.com' },
  { name: 'Coin Master', seller: 'Moon Active' },

  // Money
  { name: 'PayPal', seller: 'PayPal' },
  { name: 'Venmo', seller: 'The Delancey Corporation' },
  { name: 'Cash App', seller: 'Block' },
  { name: 'Revolut', seller: 'Revolut' },
  { name: 'Coinbase', seller: 'Coinbase' },
  { name: 'Klarna', seller: 'Klarna' },
  { name: 'Chime', seller: 'Chime Financial' },

  // Getting around
  { name: 'Uber', seller: 'Uber Technologies' },
  { name: 'Lyft', seller: 'Lyft' },
  { name: 'Airbnb', seller: 'Airbnb' },
  { name: 'Booking.com', seller: 'Booking.com' },
  { name: 'Tripadvisor', seller: 'Tripadvisor' },
  { name: 'Hopper', seller: 'Hopper' },
  { name: 'Waze', seller: 'waze' },
  { name: 'Google Maps', seller: 'Google' },

  // Work and utilities
  { name: 'Gmail', seller: 'Google' },
  { name: 'Google Drive', seller: 'Google' },
  { name: 'Google Photos', seller: 'Google' },
  { name: 'Google Translate', seller: 'Google' },
  { name: 'Google Chrome', seller: 'Google' },
  { name: 'Dropbox', seller: 'Dropbox' },
  { name: 'Notion', seller: 'Notion Labs' },
  { name: 'Todoist', seller: 'Todoist' },
  { name: 'Microsoft Outlook', seller: 'Microsoft' },
  { name: 'Microsoft Excel', seller: 'Microsoft' },
  { name: 'Firefox', seller: 'Mozilla' },
  { name: 'Canva', seller: 'Canva' },
  { name: 'CapCut', seller: 'ByteDance' },

  // Dating
  { name: 'Tinder', seller: 'Tinder' },
  { name: 'Bumble', seller: 'Bumble' },
  { name: 'Hinge', seller: 'Hinge' },
  { name: 'Grindr', seller: 'Grindr' },

  // Shopping and food
  { name: 'Amazon Shopping', seller: 'AMZN Mobile' },
  { name: 'eBay', seller: 'eBay' },
  { name: 'DoorDash', seller: 'DoorDash' },
  { name: 'Uber Eats', seller: 'Uber Technologies' },
  { name: 'Starbucks', seller: 'Starbucks' },
  { name: "McDonald's", seller: 'McDonalds' },
  { name: 'Walmart', seller: 'Walmart' },
  { name: 'IKEA', seller: 'IKEA' },

  // Health and learning
  { name: 'Strava', seller: 'Strava' },
  { name: 'Nike Run Club', seller: 'Nike' },
  { name: 'MyFitnessPal', seller: 'MyFitnessPal' },
  { name: 'Headspace', seller: 'Headspace' },
  { name: 'Calm', seller: 'Calm.com' },
  { name: 'Duolingo', seller: 'Duolingo' },
];
