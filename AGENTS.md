# AGENTS.md

## Stack

React 19 + TypeScript + Vite 7 + Tailwind CSS v3 + shadcn/ui.
Backend: Convex (schema, queries, mutations, actions in `convex/`).
3D: Three.js / React Three Fiber / Drei.
Animation: Framer Motion.
Deploy: Vercel (auto-detects Vite, serves `dist/`). `vercel.json` provides the SPA
rewrite and `vite.config.ts` uses `base: '/'` — see **Routing / Deployment** below.

## Two Auth Systems — Do Not Mix

This repo has **two separate auth systems** serving different user groups:

| System | Used for | Package | Where configured |
|--------|----------|---------|-----------------|
| **Clerk** | Reader accounts (signin, signup, favourites, profile) | `@clerk/react`, `convex/react-clerk` | `src/main.tsx` wraps app in `ClerkProvider` |
| **Google OAuth + email whitelist** | Admin panel (add/edit books, banners) | `@react-oauth/google`, plain `fetch` to Google tokeninfo | `convex/admin.ts` validates tokens, `convex/helpers.ts` has `ADMIN_EMAILS` list |

**Critical distinction:**
- `ProtectedRoute` (`src/components/ProtectedRoute.tsx`) — uses `useAuth` from `@clerk/react`. Guards `/favourites`, `/profile`.
- `AdminProtectedRoute` (`src/components/AdminProtectedRoute.tsx`) — checks `admin_session_token` in localStorage against Convex `adminSessions` table. Guards all `/admin/*` routes.

Do not touch Clerk auth to fix admin issues, and vice versa.

### Clerk: only `@clerk/react` may be installed

`@clerk/clerk-react` and `@clerk/react` ship **different** `ClerkProvider` and
`useAuth` implementations. Installing both (transitively or directly) makes
`convex/react-clerk` read auth state from a provider it never receives, and reader
sign-in silently fails — no error, no toast, just a redirect back to sign-in.

- `src/hooks/useAuth.ts` and `src/components/ProtectedRoute.tsx` import from `@clerk/react`.
- If sign-in stops working, run `npm ls @clerk/clerk-react` first. It must be absent.
- The reader entry is `src/lib/ConvexClerkProvider.tsx`, imported by `src/main.tsx`.

## Admin Auth Flow

1. `AdminLogin.tsx` → Google OAuth → gets `id_token`
2. Calls `convex/admin.ts:loginWithGoogle` action with `id_token`
3. Action verifies token via Google tokeninfo endpoint, checks email against `ADMIN_EMAILS` in `convex/helpers.ts`
4. Also validates `payload.aud === process.env.GOOGLE_CLIENT_ID` (audience check — do not remove)
5. Creates session in `adminSessions` table, returns `sessionToken`
6. Client stores `session_token`, `email`, `picture` in localStorage

**To add an admin:** edit the `ADMIN_EMAILS` array in `convex/helpers.ts`.

## Build Commands

```bash
npm run build          # tsc -b && vite build (prebuild runs sitemap generation)
npm run dev            # Vite dev server on port 3000
npm run lint           # eslint .
npm run images         # convert any .jpg/.png in public/images to .webp
node scripts/generate-sitemap.mjs   # manual sitemap regeneration
```

The `prebuild` hook runs `scripts/generate-sitemap.mjs` before every build, which queries Convex for all books and writes `public/sitemap.xml`.

Verification is `npm run build` then `npm run lint`. Baseline for lint is **33 errors**,
all pre-existing in files that are intentionally untouched (admin pages, shadcn `ui/*`,
`ParticleScene`, `migrate.ts`). Do not treat those 33 as a regression.

## Routing / Deployment

Deep links (`/library`, `/book/:id`) must survive a hard refresh and a shared-link
visit. Two settings work together — **changing one without the other breaks the site**:

- `vite.config.ts` → `base: '/'`. This must **not** be `'./'`: with a relative base,
  `./assets/index-abc.js` requested from `/book/:id` resolves to
  `/book/assets/index-abc.js` and 404s.
- `vercel.json` → catch-all `{ "source": "/(.*)", "destination": "/index.html" }`.

Per Vercel's docs, `rewrites` check the filesystem **first** ("precedence is given to
the filesystem prior to rewrites being applied"), so `sitemap.xml`, `robots.txt`,
`favicon.png` and everything under `assets/` and `images/` are served as real files.
Do not add self-referential entries like `{ "source": "/sitemap.xml", "destination":
"/sitemap.xml" }` — an earlier `vercel.json` had those, looped, and was deleted in
commit `b636b68`, which silently left the whole site without SPA fallback.

To verify: `npm run build && npx vite preview`, then request `/library` and
`/book/<any id>` directly. Both must return the app shell (contains
`<div id="root">`), while `/sitemap.xml` returns XML.

## Images

**All raster sources are deleted — only `.webp` remains.** `public/images/` contains
exactly five live files, referenced from `src/`:

`admin.webp`, `book1.webp`, `book2.webp`, `book3.webp`, `logo.webp`

Anything else in `public/images/` is dead. Book covers and banner posters shown at
runtime come from **Convex storage** (`convex.cloud/api/storage/...`), not from
`public/`, so never assume a `poster_*.webp` is needed locally.

- `scripts/convert-images.mjs` **auto-discovers** `.jpg/.jpeg/.png` in `public/images/`
  rather than reading a hardcoded list (the old list referenced `book4`–`book8`, which
  had been deleted). Run `npm run images`, inspect the output, then delete the sources.
- Width caps live in the script's `maxWidthMap` (books 600px, `admin.png` 600px,
  posters uncapped — the Library banner is full-bleed).

### `SmartImage` — use this instead of a raw `<img>`

`src/components/SmartImage.tsx`. Drop-in replacement: it renders a plain `<img>`, so
`className` and parent sizing work unchanged. It adds:

- **Reserved box** — pass `width`/`height` (or an aspect-ratio class on the parent) so
  the layout does not shift when bytes arrive.
- **Shimmer** — `smart-img--loading` paints a gradient as the element's own background,
  cross-fading to `smart-img--loaded`. Defined in `src/index.css`.
- **Lazy by default** — `loading="lazy"`. Pass `priority` for above-the-fold images
  (BookDetail cover, logo) to get `loading="eager"` + `fetchPriority="high"`.
- **Fallback** — a broken URL swaps to an inline SVG placeholder instead of the browser's
  torn-page glyph, and cannot loop (the fallback's own `onLoad` is gated on state).

For images that must stay a framer-motion component (`<motion.img>`), put the
`.img-shimmer` class on the sized **parent** instead — the photo covers it once decoded
(currently used by the Library banner poster).

**The Library banner always renders its `<section>`** with a skeleton inside whenever
`isLoading || activeBanner`. Never re-gate that section on `banners.length > 0` alone —
that is what caused the 80dvh layout jump.

## App Shell & Error Handling

- `src/components/ErrorBoundary.tsx` wraps `<App />` inside `src/main.tsx`. One bad
  component renders a recoverable card instead of a white screen.
- `<MotionConfig reducedMotion="user">` (framer-motion) plus a global
  `@media (prefers-reduced-motion: reduce)` block at the end of `src/index.css`. CSS
  animations are collapsed to their end state; framer-motion is JS-driven and needs the
  `MotionConfig`, so removing it re-enables motion for users who opted out.
- Data-fetching effects use the pattern: `cancelled` flag + `try`/`catch`/`finally` with
  `setIsLoading(false)` in `finally`. Putting `setIsLoading(false)` *after* the awaited
  call (the old shape) left pages spinning forever on any rejection.
- Pages expose per-route titles/descriptions via `src/hooks/useDocumentMeta.ts`. Hook
  calls must stay above every early `return` — hooks may not be conditional.

## TypeScript Gotcha: `convex/` Is Not a Project Reference

Root `tsconfig.json` uses `references` to `tsconfig.app.json` (covers `src/`) and `tsconfig.node.json` (covers `vite.config.ts`). The `convex/` directory has its own `tsconfig.json` but is **not** referenced by the root.

`tsc -b` resolves `convex/_generated/api.d.ts` → `convex/admin.ts` → `process.env.GOOGLE_CLIENT_ID`. This needs `"node"` in the `types` array of `tsconfig.app.json` (already configured). If you see `TS2591: Cannot find name 'process'` during build, check that `"node"` is in `tsconfig.app.json`'s `types` — do not remove the code that uses `process.env`.

## Convex Backend

Schema: `convex/schema.ts` — tables: `books`, `banners`, `reviews`, `favourites`, `admin_users`, `adminSessions`.

Generated code lives in `convex/_generated/` (do not edit manually).

Key files:
- `convex/admin.ts` — Google auth actions, session management
- `convex/helpers.ts` — `requireAuth`, `requireAdmin`, `ADMIN_EMAILS`
- `convex/books.ts` — book queries/mutations
- `convex/banners.ts` — banner queries/mutations

## Environment Variables

`.env` contains local dev values. For Vercel production, set these in the Vercel dashboard:

| Variable | Where used |
|----------|-----------|
| `VITE_CONVEX_URL` | Client — Convex deployment URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | Client — Clerk |
| `CLERK_SECRET_KEY` | Server (Convex) — Clerk |
| `CLERK_JWT_ISSUER_DOMAIN` | Server (Convex) — must be set via `npx convex env set` for production |
| `VITE_GOOGLE_CLIENT_ID` | Client — Google OAuth, also checked server-side in `loginWithGoogle` action |

## Path Alias

`@/*` maps to `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`).

## No CI / No Tests

There are no GitHub Actions workflows and no test framework configured. Verification is `npm run build` (type-check + production build) and `npm run lint`.

## Scripts

- `scripts/generate-sitemap.mjs` — Queries Convex HTTP API for books, builds `public/sitemap.xml` with static routes + `/book/:id` entries. Runs automatically as `prebuild`.
- `scripts/convert-images.mjs` — Auto-discovers raster files in `public/images/`, converts each to `.webp` at the width in `maxWidthMap`, prints an original/WebP/savings table. Exposed as `npm run images`. It does **not** delete sources.
- `scripts/run-migration.ts` — Convex migration runner.