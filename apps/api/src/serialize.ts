import type { PriceTier as PrismaPriceTier } from "@prisma/client";
import type { GearGroup, PriceTier, Review, RoomCard, RoomDetail, RoomImage } from "@jamroom/shared";

export const tierToString: Record<PrismaPriceTier, PriceTier> = {
  TIER_1: "$",
  TIER_2: "$$",
  TIER_3: "$$$",
};

export const stringToTier: Record<PriceTier, PrismaPriceTier> = {
  $: "TIER_1",
  $$: "TIER_2",
  $$$: "TIER_3",
};

type ImageRow = { id: string; url: string; label: string; order: number };

function toImage(i: ImageRow): RoomImage {
  return { id: i.id, url: i.url, label: i.label, order: i.order };
}

// Loosely typed to avoid coupling to generated Prisma payload types.
type RoomBase = {
  id: string;
  name: string;
  neighborhood: string;
  vip: boolean;
  priceTier: PrismaPriceTier;
  priceNum: number;
  genres: string[];
  open: boolean;
  lat: number;
  lng: number;
  overview: string;
  longOverview: string;
  roomSize: string;
  capacity: string | null;
  soundproof: string;
  hours: string;
  address: string;
  phone: string | null;
  ownerId: string;
  avgRating: number;
  reviewCount: number;
  images: ImageRow[];
};

// Card path reads the denormalized aggregates straight off the Room row.
type RoomCardInput = RoomBase;

type RoomDetailInput = RoomBase & {
  reviews: { id: string; rating: number; text: string; createdAt: Date; author: { name: string | null; displayName: string | null } }[];
  gearGroups: { id: string; title: string; order: number; items: { text: string; order: number }[] }[];
};

export function toRoomCard(r: RoomCardInput): RoomCard {
  const sorted = [...r.images].sort((a, b) => a.order - b.order);
  return {
    id: r.id,
    name: r.name,
    neighborhood: r.neighborhood,
    vip: r.vip,
    rating: r.avgRating,
    reviewCount: r.reviewCount,
    priceTier: tierToString[r.priceTier],
    priceNum: r.priceNum,
    genres: r.genres,
    open: r.open,
    lat: r.lat,
    lng: r.lng,
    overview: r.overview,
    primaryImage: sorted[0] ? toImage(sorted[0]) : null,
  };
}

export function toRoomDetail(r: RoomDetailInput): RoomDetail {
  const card = toRoomCard(r);
  const gear: GearGroup[] = (r.gearGroups ?? [])
    .sort((a, b) => a.order - b.order)
    .map((g) => ({
      id: g.id,
      title: g.title,
      items: [...g.items].sort((a, b) => a.order - b.order).map((i) => i.text),
    }));
  const reviews: Review[] = r.reviews.map((rv) => ({
    id: rv.id,
    authorName: rv.author.displayName ?? rv.author.name ?? "Anonymous",
    rating: rv.rating,
    text: rv.text,
    createdAt: rv.createdAt.toISOString(),
  }));
  return {
    ...card,
    longOverview: r.longOverview,
    roomSize: r.roomSize,
    capacity: r.capacity,
    soundproof: r.soundproof as RoomDetail["soundproof"],
    hours: r.hours,
    address: r.address,
    phone: r.phone,
    ownerId: r.ownerId,
    images: [...r.images].sort((a, b) => a.order - b.order).map(toImage),
    gear,
    reviews,
  };
}
