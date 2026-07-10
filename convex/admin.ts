import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./helpers";

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) return false;
    const admin = await ctx.db
      .query("admin_users")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .first();
    return admin !== null;
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

export const checkAndRejectNonAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) return { allowed: false };

    const admin = await ctx.db
      .query("admin_users")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .first();

    if (admin) return { allowed: true };

    const clerkSecretKey = (globalThis as any).process?.env?.CLERK_SECRET_KEY;
    if (!clerkSecretKey) return { allowed: false };

    try {
      await fetch(`https://api.clerk.com/v1/users/${identity.subject}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${clerkSecretKey}` },
      });
    } catch (e) {
      console.error("Failed to delete non-admin Clerk user:", e);
    }

    return { allowed: false };
  },
});
