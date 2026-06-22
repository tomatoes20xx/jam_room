import type { FastifyInstance } from "fastify";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";
import { requireUser } from "../session.js";
import { toRoomCard } from "../serialize.js";

export async function savedRoutes(app: FastifyInstance) {
  // List the current user's saved rooms
  app.get("/saved", async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const saved = await prisma.savedRoom.findMany({
      where: { userId: user.id },
      include: { room: { include: { images: true, reviews: { select: { rating: true } } } } },
    });
    return { rooms: saved.map((s) => toRoomCard(s.room)) };
  });

  // Save a room
  app.post<{ Params: { roomId: string } }>("/saved/:roomId", async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const room = await prisma.room.findUnique({ where: { id: req.params.roomId } });
    if (!room) return reply.code(404).send({ error: "Room not found" });
    try {
      await prisma.savedRoom.create({ data: { userId: user.id, roomId: room.id } });
    } catch (err) {
      // Already saved (unique constraint) — idempotent success.
      if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002")) {
        throw err;
      }
    }
    return reply.code(201).send({ ok: true });
  });

  // Unsave a room
  app.delete<{ Params: { roomId: string } }>("/saved/:roomId", async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    await prisma.savedRoom.deleteMany({ where: { userId: user.id, roomId: req.params.roomId } });
    return reply.code(204).send();
  });
}
