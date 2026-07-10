# Solibu Stories

A digital story-reading platform for discovering, browsing, and reading books. Built with React, TypeScript, and Convex.

## Features

- **Browse Library** — Explore a curated collection of books with search and filtering
- **Read Books** — In-browser reading experience with page navigation
- **3D Book Animations** — Immersive Three.js / React Three Fiber visualizations
- **Dark / Sepia Themes** — Comfortable reading in any lighting condition
- **Admin Panel** — Manage books, users, and platform content
- **Favorites & Reviews** — Save books and share your thoughts

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Backend + Database | Convex |
| Authentication | Clerk |
| Styling | Tailwind CSS v3, shadcn/ui |
| 3D Graphics | Three.js, React Three Fiber, Drei |
| Animation | Framer Motion |

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Required Setup

Before running the app, you'll need to configure:

1. **Clerk** — Create an application at [clerk.com](https://clerk.com) and add your publishable key as `VITE_CLERK_PUBLISHABLE_KEY`.
2. **Convex** — Deploy a project at [convex.dev](https://convex.dev) and set `VITE_CONVEX_URL` to your deployment URL. Then run `npx convex dev` to sync schema and functions.

## Project Structure

```
src/          — Application source code (components, pages, routes, hooks)
convex/       — Convex backend schema, queries, mutations, and actions
public/       — Static assets including book cover images
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CLERK_SECRET_KEY` | Clerk API secret key (server-side) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (client-side) |
| `CONVEX_DEPLOYMENT` | Convex deployment identifier |
| `VITE_CONVEX_URL` | Convex deployment URL |

## Scripts

| Script | Command |
|--------|---------|
| `dev` | `vite` — Start dev server |
| `build` | `tsc -b && vite build` — Type-check and build |
| `lint` | `eslint .` — Run ESLint |
| `preview` | `vite preview` — Preview production build locally |
