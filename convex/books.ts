import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./helpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("books").collect();
  },
});

export const listSorted = query({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.db.query("books").collect();
    return books.sort((a, b) => (b.last_updated ?? b._creationTime) - (a.last_updated ?? a._creationTime));
  },
});

export const get = query({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.db.query("books").collect();
    return books
      .filter((b) => b.featured)
      .sort((a, b) => (b.last_updated ?? b._creationTime) - (a.last_updated ?? a._creationTime));
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    genre: v.string(),
    synopsis: v.string(),
    cover_url: v.string(),
    pdf_url: v.string(),
    rating: v.number(),
    featured: v.boolean(),
    reading_time: v.optional(v.string()),
    chapters: v.optional(v.number()),
    session_token: v.string(),
  },
  handler: async (ctx, args) => {
    const { session_token, ...bookData } = args;
    await requireAdmin(ctx, session_token);
    return await ctx.db.insert("books", bookData);
  },
});

export const update = mutation({
  args: {
    id: v.id("books"),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    synopsis: v.optional(v.string()),
    cover_url: v.optional(v.string()),
    pdf_url: v.optional(v.string()),
    rating: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    reading_time: v.optional(v.string()),
    chapters: v.optional(v.number()),
    session_token: v.string(),
  },
  handler: async (ctx, args) => {
    const { session_token, id, ...updates } = args;
    await requireAdmin(ctx, session_token);
    await ctx.db.patch(id, { ...updates, last_updated: Date.now() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("books"), session_token: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.session_token);
    await ctx.db.delete(args.id);
  },
});
