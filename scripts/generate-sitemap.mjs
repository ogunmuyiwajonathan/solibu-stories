#!/usr/bin/env node

/**
 * generate-sitemap.mjs
 *
 * Queries Convex for all published books and generates public/sitemap.xml
 * combining static routes + dynamic /book/:id pages.
 *
 * Runs as a "prebuild" script so the file is in public/ before Vite copies
 * it to dist/ during build.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Config ──────────────────────────────────────────────────────────────────
const CONVEX_URL =
  process.env.VITE_CONVEX_URL || "https://efficient-antelope-673.convex.cloud";
const SITE_URL = "https://solibu-stories.vercel.app";
const OUTPUT_PATH = path.resolve(__dirname, "..", "public", "sitemap.xml");
const TODAY = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// ── Static routes ───────────────────────────────────────────────────────────
const STATIC_ROUTES = [
  { path: "/",          priority: "1.0",   changefreq: "weekly"  },
  { path: "/library",   priority: "0.8",   changefreq: "weekly"  },
  { path: "/about",     priority: "0.5",   changefreq: "monthly" },
  { path: "/contact",   priority: "0.5",   changefreq: "monthly" },
];

// ── Fetch books from Convex ─────────────────────────────────────────────────
async function fetchBooks() {
  const url = `${CONVEX_URL}/api/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "books:list",
      args: {},
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Convex query failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  // Convex HTTP API returns { status: "success", value: [...] } or
  // { status: "success", value: null } for empty results
  if (data.status !== "success") {
    throw new Error(`Convex query error: ${JSON.stringify(data)}`);
  }

  return data.value || [];
}

// ── Build sitemap XML ───────────────────────────────────────────────────────
function buildSitemap(books) {
  const lines = [];

  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

  // Static routes
  for (const route of STATIC_ROUTES) {
    lines.push(`  <url>`);
    lines.push(`    <loc>${SITE_URL}${route.path}</loc>`);
    lines.push(`    <lastmod>${TODAY}</lastmod>`);
    lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
    lines.push(`    <priority>${route.priority}</priority>`);
    lines.push(`  </url>`);
  }

  // Dynamic book routes
  for (const book of books) {
    // last_updated is epoch ms; fall back to _creationTime, then today
    const lastmod = book.last_updated
      ? new Date(book.last_updated).toISOString().split("T")[0]
      : book._creationTime
        ? new Date(book._creationTime).toISOString().split("T")[0]
        : TODAY;

    lines.push(`  <url>`);
    lines.push(`    <loc>${SITE_URL}/book/${book._id}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push(`    <changefreq>monthly</changefreq>`);
    lines.push(`    <priority>0.6</priority>`);
    lines.push(`  </url>`);
  }

  lines.push(`</urlset>`);
  return lines.join("\n") + "\n";
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Fetching books from ${CONVEX_URL}...`);

  const books = await fetchBooks();
  console.log(`Found ${books.length} book(s)`);

  if (books.length > 0) {
    // Show first 5 as a sanity check
    const preview = books.slice(0, 5);
    for (const b of preview) {
      const lastmod = b.last_updated
        ? new Date(b.last_updated).toISOString().split("T")[0]
        : "(creationTime)";
      console.log(`  - ${b._id}: "${b.title}" (lastmod: ${lastmod})`);
    }
    if (books.length > 5) {
      console.log(`  ... and ${books.length - 5} more`);
    }
  }

  const xml = buildSitemap(books);

  // Ensure public/ directory exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, xml, "utf-8");
  console.log(`\nSitemap written to ${OUTPUT_PATH}`);
  console.log(`  ${STATIC_ROUTES.length} static routes + ${books.length} book URLs = ${STATIC_ROUTES.length + books.length} total`);
}

main().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});