import { z } from "zod";
import { GENRES, PRICE_TIERS, ROOM_SORTS, SOUNDPROOFING } from "./enums.js";

/** A single review left on a room. */
export const reviewSchema = z.object({
  id: z.string(),
  authorName: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string(),
  createdAt: z.string(),
});
export type Review = z.infer<typeof reviewSchema>;

/** One labelled photo of a room (hosted on uploadthing). */
export const roomImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  label: z.string(),
  order: z.number().int(),
});
export type RoomImage = z.infer<typeof roomImageSchema>;

/** A category of gear ("DRUMS") with its line items. */
export const gearGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(z.string()),
});
export type GearGroup = z.infer<typeof gearGroupSchema>;

/** Compact shape used on list/grid cards. */
export const roomCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  neighborhood: z.string(),
  vip: z.boolean(),
  rating: z.number(),
  reviewCount: z.number().int(),
  priceTier: z.enum(PRICE_TIERS),
  priceNum: z.number().int(),
  genres: z.array(z.string()),
  open: z.boolean(),
  lat: z.number(),
  lng: z.number(),
  overview: z.string(),
  primaryImage: roomImageSchema.nullable(),
});
export type RoomCard = z.infer<typeof roomCardSchema>;

/** Full room detail. */
export const roomDetailSchema = roomCardSchema.extend({
  longOverview: z.string(),
  roomSize: z.string(),
  capacity: z.string().nullable(),
  soundproof: z.enum(SOUNDPROOFING),
  hours: z.string(),
  address: z.string(),
  ownerId: z.string(),
  images: z.array(roomImageSchema),
  gear: z.array(gearGroupSchema),
  reviews: z.array(reviewSchema),
});
export type RoomDetail = z.infer<typeof roomDetailSchema>;

/** Query params accepted by GET /rooms (mirrors the design's filters). */
export const roomListQuerySchema = z.object({
  q: z.string().optional(),
  genre: z.enum(GENRES).optional(),
  priceTier: z.enum(PRICE_TIERS).optional(),
  openNow: z.coerce.boolean().optional(),
  sort: z.enum(ROOM_SORTS).default("rating"),
});
export type RoomListQuery = z.infer<typeof roomListQuerySchema>;

/** Payload for creating / updating a room (provider only). */
export const roomInputSchema = z.object({
  name: z.string().min(1),
  neighborhood: z.string().min(1),
  address: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  priceTier: z.enum(PRICE_TIERS),
  priceNum: z.number().int().positive(),
  capacity: z.string().optional(),
  roomSize: z.string().min(1),
  soundproof: z.enum(SOUNDPROOFING),
  hours: z.string().min(1),
  open: z.boolean().default(true),
  genres: z.array(z.enum(GENRES)).default([]),
  overview: z.string().min(1),
  longOverview: z.string().default(""),
  gear: z
    .array(z.object({ title: z.string().min(1), items: z.array(z.string()) }))
    .default([]),
  images: z
    .array(z.object({ url: z.string().url(), key: z.string(), label: z.string().default("") }))
    .default([]),
});
export type RoomInput = z.infer<typeof roomInputSchema>;

export const reviewInputSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1),
});
export type ReviewInput = z.infer<typeof reviewInputSchema>;
