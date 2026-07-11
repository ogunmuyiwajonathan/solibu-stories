import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, ADMIN_EMAILS } from "./helpers";

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email?.toLowerCase();
    return email ? ADMIN_EMAILS.includes(email) : false;
  },
});

export const getAdminByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("admin_users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();
  },
});

export const addAdmin = mutation({
  args: {
    user_id: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existing = await ctx.db
      .query("admin_users")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("admin_users", {
      user_id: args.user_id,
      email: args.email.toLowerCase(),
    });
  },
});

export const removeAdmin = mutation({
  args: { id: v.id("admin_users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
