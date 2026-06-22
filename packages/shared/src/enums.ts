export const ROLES = ["MUSICIAN", "PROVIDER"] as const;
export type Role = (typeof ROLES)[number];

export const PRICE_TIERS = ["$", "$$", "$$$"] as const;
export type PriceTier = (typeof PRICE_TIERS)[number];

export const SOUNDPROOFING = [
  "Full isolation",
  "Double-wall",
  "Floated floor",
  "Foam treated",
  "Basic",
] as const;
export type Soundproofing = (typeof SOUNDPROOFING)[number];

export const GENRES = [
  "PUNK",
  "METAL",
  "HARDCORE",
  "INDIE",
  "ROCK",
  "GARAGE",
  "HIP-HOP",
  "NOISE",
  "JAZZ",
  "EXPERIMENTAL",
  "SHOEGAZE",
  "POP-PUNK",
  "R&B",
  "SOUL",
  "BEDROOM-POP",
  "COVER BANDS",
] as const;
export type Genre = (typeof GENRES)[number];

export const ROOM_SORTS = ["rating", "price", "name"] as const;
export type RoomSort = (typeof ROOM_SORTS)[number];
