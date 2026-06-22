import type { FastifyInstance } from "fastify";
import { reviewInputSchema } from "@jamroom/shared";
import { prisma } from "../prisma.js";
import { requireUser } from "../session.js";

export async function reviewRoutes(app: FastifyInstance) {
  app.post<{ Params: { id: string } }>("/rooms/:id/reviews", async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const room = await prisma.room.findUnique({ where: { id: req.params.id } });
    if (!room) return reply.code(404).send({ error: "Room not found" });

    const parsed = reviewInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid review", details: parsed.error.flatten() });
    }

    const review = await prisma.review.create({
      data: {
        roomId: room.id,
        authorId: user.id,
        rating: parsed.data.rating,
        text: parsed.data.text,
      },
      include: { author: { select: { name: true, displayName: true } } },
    });

    // Refresh the denormalized aggregates the list endpoint sorts/filters on.
    const agg = await prisma.review.aggregate({
      where: { roomId: room.id },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.room.update({
      where: { id: room.id },
      data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count },
    });

    return reply.code(201).send({
      review: {
        id: review.id,
        authorName: review.author.displayName ?? review.author.name ?? "Anonymous",
        rating: review.rating,
        text: review.text,
        createdAt: review.createdAt.toISOString(),
      },
    });
  });
}
