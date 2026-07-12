import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./helpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("banners").collect();
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const banners = await ctx.db.query("banners").collect();
    return banners
      .filter((b) => b.active)
      .sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const get = query({
  args: { id: v.id("banners") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    image_url: v.string(),
    label: v.string(),
    title: v.string(),
    author: v.string(),
    description: v.string(),
    character_name: v.string(),
    story: v.string(),
    active: v.boolean(),
    cta_type: v.optional(v.string()),
    session_token: v.string(),
  },
  handler: async (ctx, args) => {
    const { session_token, ...bannerData } = args;
    await requireAdmin(ctx, session_token);
    return await ctx.db.insert("banners", bannerData);
  },
});

export const update = mutation({
  args: {
    id: v.id("banners"),
    image_url: v.optional(v.string()),
    label: v.optional(v.string()),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    description: v.optional(v.string()),
    character_name: v.optional(v.string()),
    story: v.optional(v.string()),
    cta_type: v.optional(v.string()),
    active: v.optional(v.boolean()),
    session_token: v.string(),
  },
  handler: async (ctx, args) => {
    const { session_token, id, ...updates } = args;
    await requireAdmin(ctx, session_token);
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("banners"), session_token: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.session_token);
    await ctx.db.delete(args.id);
  },
});
