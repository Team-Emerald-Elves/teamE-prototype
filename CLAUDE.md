# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CS3733-D26 Team E — a course project intranet portal for Hanover Insurance employees. Not in production use.

## Monorepo Structure

pnpm workspace with three packages:
- `apps/frontend` — React 19 SPA (uses npm, not pnpm)
- `apps/backend` — Express 5 API server
- `packages/database` — Shared Prisma schema and generated client (used by both apps)

## Commands

### Frontend (`apps/frontend`)
```bash
npm install
npm run dev       # Vite dev server
npm run build     # tsc + vite build
npm run lint      # ESLint
```

### Backend (`apps/backend`)
```bash
pnpm install
pnpm run dev      # nodemon + tsx
pnpm run start    # tsx src/index.ts (no watch)
pnpm run dk:start # Start PostgreSQL via Docker Compose
pnpm run seed     # Seed database
```

### Database (`packages/database` or via backend shortcuts)
```bash
# From apps/backend:
pnpm run db:migrate    # Run migrations
pnpm run db:push       # Push schema changes
pnpm run db:studio     # Open Prisma Studio
pnpm run db:generate   # Regenerate Prisma client

# Or directly in packages/database (reads .env from apps/backend)
```

### Running Both
Start the PostgreSQL Docker container first, then run frontend and backend in separate terminals.

## Architecture

### Authentication
Clerk handles auth on both ends. Frontend uses Clerk React hooks/components. Backend uses `@clerk/express` middleware to protect routes. Each `Employee` record links to a Clerk user via `clerkUserId`.

### Database
Prisma schema lives in `packages/database/prisma/schematics/schema.prisma`. The generated client is output to `packages/database/prisma/generated/` and imported by both the frontend (for types) and backend (for queries). Schema changes require running `db:migrate` then `db:generate`.

Key models:
- `Employee` — users with roles (`UserRoles[]`), favorites arrays, and an optional `BucketMeta` (Supabase storage bucket)
- `documentContent` — uploaded files with status (`not_started`, `in_progress`, `needs_review`, `done`, `expired`), assigned role, lock state
- `Links` — bookmark-style links with owner and lock
- `CalendarEvents` — calendar entries optionally linked to a document
- `ServiceRequests` — assignable tasks between employees

### File Storage
Supabase is used for file storage. Each employee has a personal bucket (`BucketMeta`). The `supabase.routes.ts` backend routes handle uploads/downloads; the backend also has check-in/check-out logic for document locking (`lock` field on `documentContent` and `Links`).

### Frontend Pages
Pages live in `apps/frontend/src/pages/`. Key sections:
- Documents — file management with filtering by status/type/role
- Links — bookmark management
- Calendar — FullCalendar integration, events can link to documents
- Statistics — Recharts dashboards
- User Management — admin CRUD for employees
- Favorites — favorited documents and links per employee

### Backend Routes
All routes are in `apps/backend/src/routes/`. Request validation uses Zod schemas from `apps/backend/src/lib/zod/`. The `filters.ts` utility handles query-parameter-based filtering for list endpoints.

### Path Alias
Frontend uses `@` as an alias for `apps/frontend/src/` (configured in `vite.config.ts` and `tsconfig`).

## Environment

- `apps/backend/.env` — `DATABASE_URL`, Clerk secret, Supabase URL/key
- `apps/frontend/.env` — Clerk publishable key, backend API URL (`VITE_BACKEND_URL`)
- `.env` files are committed (test credentials for course project)
