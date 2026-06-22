import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env, hasGoogleOAuth } from "./env.js";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  // FE on Vercel + API on Railway live on different domains.
  trustedOrigins: [env.WEB_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: hasGoogleOAuth
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined,
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "MUSICIAN", input: true },
      displayName: { type: "string", required: false, input: true },
    },
  },
  advanced: {
    // Prod: FE (Vercel) and API (Railway) are cross-site → cookies need SameSite=None; Secure.
    // Dev: localhost over http rejects None-without-Secure, so fall back to Lax.
    defaultCookieAttributes:
      env.NODE_ENV === "production"
        ? { sameSite: "none", secure: true }
        : { sameSite: "lax", secure: false },
  },
});

export type Auth = typeof auth;
