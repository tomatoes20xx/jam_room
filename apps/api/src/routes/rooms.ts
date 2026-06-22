import type { FastifyInstance } from "fastify";
import { Prisma } from "@prisma/client";
import { roomInputSchema, roomListQuerySchema } from "@jamroom/shared";
import { prisma } from "../prisma.js";
import { requireUser } from "../session.js";
import { stringToTier, toRoomCard, toRoomDetail } from "../serialize.js";

const cardInclude = {
  images: true,
  reviews: { select: { rating: true } },
} satisfies Prisma.RoomInclude;

const detailInclude = {
  images: true,
  gearGroups: { include: { items: true } },
  reviews: { include: { author: { select: { name: true, displayName: true } } }, orderBy: { createdAt: "desc" } },
} satisfies Prisma.RoomInclude;

export async function roomRoutes(app: FastifyInstance) {
  // List + filter + sort
  app.get("/rooms", async (req, reply) => {
    const parsed = roomListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid query", details: parsed.error.flatten() });
    }
    const { q, genre, priceTier, openNow, sort } = parsed.data;

    const where: Prisma.RoomWhereInput = {};
    if (genre) where.genres = { has: genre };
    if (priceTier) where.priceTier = stringToTier[priceTier];
    if (openNow) where.open = true;
    if (q && q.trim()) {
      const term = q.trim();
      where.OR = [
        { name: { contains: term, mode: "insensitive" } },
        { neighborhood: { contains: term, mode: "insensitive" } },
        { overview: { contains: term, mode: "insensitive" } },
        { genres: { has: term.toUpperCase() } },
      ];
    }

    const rooms = await prisma.room.findMany({ where, include: cardInclude });
    let cards = rooms.map(toRoomCard);

    cards.sort((a, b) => {
      if (sort === "price") return a.priceNum - b.priceNum;
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.rating - a.rating;
    });

    return { rooms: cards };
  });

  // Detail
  app.get<{ Params: { id: string } }>("/rooms/:id", async (req, reply) => {
    const room = await prisma.room.findUnique({
      where: { id: req.params.id },
      include: detailInclude,
    });
    if (!room) return reply.code(404).send({ error: "Room not found" });
    return { room: toRoomDetail(room) };
  });

  // Create (provider only)
  app.post("/rooms", async (req, reply) => {
    const user = await requireUser(req, reply, "PROVIDER");
    if (!user) return;
    const parsed = roomInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid room", details: parsed.error.flatten() });
    }
    const d = parsed.data;
    const room = await prisma.room.create({
      data: {
        ownerId: user.id,
        name: d.name,
        neighborhood: d.neighborhood,
        address: d.address,
        lat: d.lat,
        lng: d.lng,
        priceTier: stringToTier[d.priceTier],
        priceNum: d.priceNum,
        capacity: d.capacity ?? null,
        roomSize: d.roomSize,
        soundproof: d.soundproof,
        hours: d.hours,
        open: d.open,
        genres: d.genres,
        overview: d.overview,
        longOverview: d.longOverview,
        images: { create: d.images.map((img, i) => ({ url: img.url, key: img.key, label: img.label, order: i })) },
        gearGroups: {
          create: d.gear.map((g, gi) => ({
            title: g.title,
            order: gi,
            items: { create: g.items.map((text, ii) => ({ text, order: ii })) },
          })),
        },
      },
      include: detailInclude,
    });
    return reply.code(201).send({ room: toRoomDetail(room) });
  });

  // Update (owner only)
  app.patch<{ Params: { id: string } }>("/rooms/:id", async (req, reply) => {
    const user = await requireUser(req, reply, "PROVIDER");
    if (!user) return;
    const existing = await prisma.room.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.code(404).send({ error: "Room not found" });
    if (existing.ownerId !== user.id) return reply.code(403).send({ error: "Not your room" });

    const parsed = roomInputSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid room", details: parsed.error.flatten() });
    }
    const d = parsed.data;

    const room = await prisma.room.update({
      where: { id: req.params.id },
      data: {
        name: d.name,
        neighborhood: d.neighborhood,
        address: d.address,
        lat: d.lat,
        lng: d.lng,
        priceTier: d.priceTier ? stringToTier[d.priceTier] : undefined,
        priceNum: d.priceNum,
        capacity: d.capacity,
        roomSize: d.roomSize,
        soundproof: d.soundproof,
        hours: d.hours,
        open: d.open,
        genres: d.genres,
        overview: d.overview,
        longOverview: d.longOverview,
      },
      include: detailInclude,
    });
    return { room: toRoomDetail(room) };
  });

  // Delete (owner only)
  app.delete<{ Params: { id: string } }>("/rooms/:id", async (req, reply) => {
    const user = await requireUser(req, reply, "PROVIDER");
    if (!user) return;
    const existing = await prisma.room.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.code(404).send({ error: "Room not found" });
    if (existing.ownerId !== user.id) return reply.code(403).send({ error: "Not your room" });
    await prisma.room.delete({ where: { id: req.params.id } });
    return reply.code(204).send();
  });

  // Rooms owned by the current provider
  app.get("/my/rooms", async (req, reply) => {
    const user = await requireUser(req, reply, "PROVIDER");
    if (!user) return;
    const rooms = await prisma.room.findMany({
      where: { ownerId: user.id },
      include: cardInclude,
    });
    return { rooms: rooms.map(toRoomCard) };
  });
}
