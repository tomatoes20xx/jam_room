# Jam Room

Find rehearsal / jam-session rooms across **Tbilisi**. Book by the hour.

A pnpm + Turborepo monorepo:

| Package            | What                                              | Deploy  |
| ------------------ | ------------------------------------------------- | ------- |
| `apps/web`         | Next.js 15 (App Router) + Tailwind v4 frontend    | Vercel  |
| `apps/api`         | Fastify + Prisma + Better Auth + uploadthing API  | Railway |
| `packages/shared`  | Shared TypeScript types + zod schemas             | —       |

Stack: PostgreSQL · Better Auth (email/password + Google) · uploadthing (images).

## Prerequisites

- Node 20+
- pnpm 9 (`corepack enable`)
- A PostgreSQL database (local Docker, or a Railway Postgres URL)

## Local setup

```bash
pnpm install

# API env
cp apps/api/.env.example apps/api/.env
#   set DATABASE_URL, BETTER_AUTH_SECRET (openssl rand -base64 32),
#   and optionally GOOGLE_* + UPLOADTHING_TOKEN

# Web env
cp apps/web/.env.example apps/web/.env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000

# DB
pnpm db:migrate     # create tables
pnpm db:seed        # load the Tbilisi demo rooms

# Run both apps (web :3000, api :4000)
pnpm dev
```

Open http://localhost:3000.

## Environment variables

**API (`apps/api/.env`)**

| Var                     | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `DATABASE_URL`          | Postgres connection string                           |
| `BETTER_AUTH_SECRET`    | Session signing secret                               |
| `BETTER_AUTH_URL`       | Public URL of the API (OAuth callbacks)              |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth (optional; email/password works without) |
| `UPLOADTHING_TOKEN`     | uploadthing app token (optional until you upload)    |
| `WEB_ORIGIN`            | Allowed CORS origin (the web URL)                    |
| `PORT`                  | API port (default 4000)                              |

**Web (`apps/web/.env.local`)**

| Var                  | Purpose                       |
| -------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_URL`| Base URL of the API           |

## Deploy

**API → Railway**

1. New project → add a PostgreSQL plugin (gives `DATABASE_URL`).
2. New service from this repo. Railway reads `apps/api/railway.json`:
   build runs `pnpm install` + `prisma generate`; deploy runs `prisma migrate deploy` then starts the server; health check at `/health`.
3. Set env vars: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (the Railway URL), `WEB_ORIGIN` (the Vercel URL), and optionally `GOOGLE_*` / `UPLOADTHING_TOKEN`. `DATABASE_URL` and `PORT` are provided by Railway.
4. After first deploy, run `pnpm db:seed` once (Railway shell) if you want demo data.

**Web → Vercel**

1. Import the repo; set **Root Directory** to `apps/web`.
2. Build is auto-detected (Next.js). Set `NEXT_PUBLIC_API_URL` to the Railway API URL.

**Google OAuth**: add `<BETTER_AUTH_URL>/api/auth/callback/google` as an authorized redirect URI in the Google Cloud console.

## Design

UI ported from the Claude Design project *"Jam Room Finder"* — a punk gig-poster aesthetic
(Anton / Special Elite / Permanent Marker, cream paper + red + acid-yellow on near-black ink,
film grain, hard offset shadows). The original `.dc.html` prototypes are design-only; the live
app reimplements them as React components wired to the API.
