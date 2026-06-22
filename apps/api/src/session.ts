import type { FastifyReply, FastifyRequest } from "fastify";
import type { Role } from "@jamroom/shared";
import { auth } from "./auth.js";

export type SessionUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: Role;
};

/** Resolve the Better Auth session from the incoming request headers. */
export async function getSessionUser(req: FastifyRequest): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: toHeaders(req.headers) });
  if (!session?.user) return null;
  const u = session.user as unknown as {
    id: string;
    email: string;
    displayName?: string | null;
    role?: Role;
  };
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName ?? null,
    role: u.role ?? "MUSICIAN",
  };
}

/** Throws a 401/403 reply if no authed user (or wrong role). Returns the user otherwise. */
export async function requireUser(
  req: FastifyRequest,
  reply: FastifyReply,
  role?: Role,
): Promise<SessionUser | null> {
  const user = await getSessionUser(req);
  if (!user) {
    reply.code(401).send({ error: "Not authenticated" });
    return null;
  }
  if (role && user.role !== role) {
    reply.code(403).send({ error: `Requires ${role} role` });
    return null;
  }
  return user;
}

function toHeaders(raw: FastifyRequest["headers"]): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
    else headers.append(key, value);
  }
  return headers;
}
