import { mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Direct insert mutations (no auth required - migration only)
export const insertBook = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    genre: v.string(),
    synopsis: v.string(),
    cover_url: v.string(),
    pdf_url: v.string(),
    rating: v.number(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("books", args);
  },
});

export const insertBanner = mutation({
  args: {
    image_url: v.string(),
    label: v.string(),
    title: v.string(),
    author: v.string(),
    description: v.string(),
    character_name: v.string(),
    story: v.string(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("banners", args);
  },
});

export const insertAdmin = mutation({
  args: {
    user_id: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("admin_users")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("admin_users", { ...args, email: args.email.toLowerCase() });
  },
});

// Helper: decode base64 data URL to Blob
function dataUrlToBlob(dataUrl: string, mimeType: string): Blob {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

// Action to download file and upload to Convex storage
async function downloadAsDataUrl(url: string): Promise<{ dataUrl: string; mimeType: string; name: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  const mimeType = blob.type || "application/octet-stream";
  const name = url.split("/").pop() || "file";
  return { dataUrl: `data:${mimeType};base64,${base64}`, mimeType, name };
}

export const migrateAll = action({
  args: {},
  handler: async (ctx) => {
    const results: string[] = [];

    // ===== BOOKS =====
    const books = [
      {
        title: "Raised in Storms",
        author: "Abodunrin Ibukunoluwa",
        synopsis: "In an enchanted forest where ancient trees whisper forgotten secrets, a young wanderer discovers a path lit by golden fireflies that leads to a realm where magic is not just real—it is alive. As darkness threatens to consume both worlds, she must learn to harness the light within before the final shadow falls.",
        coverUrl: "https://cxbxrefumqcuoptcuxww.supabase.co/storage/v1/object/public/covers/covers/book1.jpg",
        pdfUrl: "https://cxbxrefumqcuoptcuxww.supabase.co/storage/v1/object/public/pdfs/pdfs/1781127129612_OV_7094_Mod__PM_Java_Programming_I_v1.0.pdf",
        rating: 4.8,
        featured: true,
      },
      {
        title: "Salt, Sugar and Me",
        author: "Abodunrin Ibukunoluwa",
        synopsis: "Two souls, separated by centuries, find themselves bound by an ancient promise written in the stars. As their lives intertwine across time, they must overcome the forces that seek to tear them apart—proving that true love transcends even death itself.",
        coverUrl: "https://cxbxrefumqcuoptcuxww.supabase.co/storage/v1/object/public/covers/covers/book2.jpg",
        pdfUrl: "",
        rating: 4.6,
        featured: true,
      },
      {
        title: "The End of The End",
        author: "Abodunrin Ibukunoluwa",
        synopsis: "A reclusive family. A mansion shrouded in fog. When the youngest heir inherits an estate filled with dark secrets, they uncover a conspiracy that spans generations.",
        coverUrl: "https://cxbxrefumqcuoptcuxww.supabase.co/storage/v1/object/public/covers/covers/book3.jpg",
        pdfUrl: "",
        rating: 4.9,
        featured: true,
      },
    ];

    results.push(`=== Migrating ${books.length} books ===`);
    for (const book of books) {
      try {
        // Download cover
        const cover = await downloadAsDataUrl(book.coverUrl);
        const coverBlob = dataUrlToBlob(cover.dataUrl, cover.mimeType);
        const coverId = await ctx.storage.store(coverBlob);
        const newCoverUrl = await ctx.storage.getUrl(coverId);
        if (!newCoverUrl) throw new Error("Failed to get cover URL");

        // Download PDF if exists
        let newPdfUrl = "";
        if (book.pdfUrl) {
          try {
            const pdf = await downloadAsDataUrl(book.pdfUrl);
            const pdfBlob = dataUrlToBlob(pdf.dataUrl, pdf.mimeType);
            const pdfId = await ctx.storage.store(pdfBlob);
            newPdfUrl = await ctx.storage.getUrl(pdfId) || "";
          } catch (e: any) {
            results.push(`  WARN: PDF failed for "${book.title}": ${e.message}`);
          }
        }

        // Insert into Convex
        await ctx.runMutation(api.migrate.insertBook, {
          title: book.title,
          author: book.author,
          synopsis: book.synopsis,
          cover_url: newCoverUrl,
          pdf_url: newPdfUrl,
          rating: book.rating,
          featured: book.featured,
          genre: "Fiction",
        });
        results.push(`  ✓ "${book.title}"`);
      } catch (e: any) {
        results.push(`  ✗ "${book.title}": ${e.message}`);
      }
    }

    // ===== BANNERS =====
    const banners = [
      {
        imageUrl: "https://cxbxrefumqcuoptcuxww.supabase.co/storage/v1/object/public/covers/covers/book2.jpg",
        label: "CHARACTER REVEAL",
        title: "Salt Sugar and Me",
        author: "Ibukun Abodunrin",
        description: "Mr Falana is a dangerous teacher",
        character_name: "Mr Falana",
        story: "LIFE",
        active: true,
      },
      {
        imageUrl: "https://cxbxrefumqcuoptcuxww.supabase.co/storage/v1/object/public/covers/covers/book1.jpg",
        label: "FEATURED",
        title: "Salt Sugar and Me",
        author: "Ibukun Abodunrin",
        description: "A cinematic journey into memory, power, and the whispers that shape a hidden empire.",
        character_name: "Morounkeji",
        story: "In a city where memories are currency, Sera possesses the rare gift to steal, restore, and rewrite them. When a faction of forgotten memories threatens to collapse reality itself, she must choose between preserving her identity or saving her world.",
        active: true,
      },
      {
        imageUrl: "https://cxbxrefumqcuoptcuxww.supabase.co/storage/v1/object/public/covers/covers/book3.jpg",
        label: "CHARACTER REVEAL",
        title: "Salt Sugar and Me",
        author: "Ibukun Abodunrin",
        description: "A cinematic journey of insurgents, secrets, and the pulse of a city burning with forbidden light.",
        character_name: "Adewale",
        story: "A former soldier finds sanctuary in the underground resistance, where humans have learned to harness forbidden light. As he rises through their ranks, he uncovers a truth that forces him to question everything he has been fighting for.",
        active: true,
      },
    ];

    results.push(`\n=== Migrating ${banners.length} banners ===`);
    for (const banner of banners) {
      try {
        const img = await downloadAsDataUrl(banner.imageUrl);
        const imgBlob = dataUrlToBlob(img.dataUrl, img.mimeType);
        const imgId = await ctx.storage.store(imgBlob);
        const newImgUrl = await ctx.storage.getUrl(imgId);
        if (!newImgUrl) throw new Error("Failed to get image URL");

        await ctx.runMutation(api.migrate.insertBanner, {
          image_url: newImgUrl,
          label: banner.label,
          title: banner.title,
          author: banner.author,
          description: banner.description,
          character_name: banner.character_name,
            story: banner.story,
            active: banner.active,
        });
        results.push(`  ✓ "${banner.character_name}"`);
      } catch (e: any) {
        results.push(`  ✗ "${banner.character_name}": ${e.message}`);
      }
    }

    // ===== ADMIN USERS =====
    const admins = [
      { user_id: "16db67d5-bcb6-465a-a37d-5bec3b0d1056", email: "abodunrinoluwanifemi116@gmail.com" },
      { user_id: "f475ba3a-1c3a-4c80-98b3-dd16bc48c190", email: "ogunmuyiwajonathan@gmail.com" },
    ];

    results.push(`\n=== Migrating ${admins.length} admin users ===`);
    for (const admin of admins) {
      try {
        await ctx.runMutation(api.migrate.insertAdmin, admin);
        results.push(`  ✓ "${admin.email}"`);
      } catch (e: any) {
        results.push(`  ✗ "${admin.email}": ${e.message}`);
      }
    }

    results.push("\n=== Migration complete ===");
    return results.join("\n");
  },
});
