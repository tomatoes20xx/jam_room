import type { FastifyInstance } from "fastify";
import { getSessionUser } from "../session.js";

export async function meRoutes(app: FastifyInstance) {
  app.get("/me", async (req) => {
    const user = await getSessionUser(req);
    return { user };
  });
}
