import Fastify from "fastify";
import cors from "@fastify/cors";
import { createRouteHandler } from "uploadthing/fastify";
import { env } from "./env.js";
import { auth } from "./auth.js";
import { uploadRouter } from "./uploadthing.js";
import { roomRoutes } from "./routes/rooms.js";
import { reviewRoutes } from "./routes/reviews.js";
import { savedRoutes } from "./routes/saved.js";
import { meRoutes } from "./routes/me.js";

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV === "development" ? { level: "info" } : true,
  });

  await app.register(cors, {
    origin: env.WEB_ORIGIN,
    credentials: true,
  });

  // Health check for Railway
  app.get("/health", async () => ({ status: "ok" }));

  // ---- Better Auth: mount its web-standard handler on /api/auth/* ----
  app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(req, reply) {
      const url = new URL(req.url, env.BETTER_AUTH_URL);
      const headers = new Headers();
      for (const [k, v] of Object.entries(req.headers)) {
        if (v === undefined) continue;
        if (Array.isArray(v)) v.forEach((val) => headers.append(k, val));
        else headers.append(k, v);
      }
      const request = new Request(url, {
        method: req.method,
        headers,
        body: req.method === "GET" || req.method === "HEAD" ? undefined : JSON.stringify(req.body),
      });

      const response = await auth.handler(request);
      reply.status(response.status);
      // set-cookie must be sent as an array, not merged into one comma-joined header.
      const setCookies = response.headers.getSetCookie?.() ?? [];
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") return;
        reply.header(key, value);
      });
      if (setCookies.length > 0) reply.header("set-cookie", setCookies);
      const text = await response.text();
      reply.send(text.length > 0 ? text : null);
    },
  });

  // ---- uploadthing ----
  await app.register(createRouteHandler, {
    router: uploadRouter,
    config: { token: env.UPLOADTHING_TOKEN || undefined },
  });

  // ---- domain routes ----
  await app.register(roomRoutes);
  await app.register(reviewRoutes);
  await app.register(savedRoutes);
  await app.register(meRoutes);

  return app;
}
