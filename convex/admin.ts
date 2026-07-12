import { query, mutation, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, ADMIN_EMAILS } from "./helpers";
import { internal } from "./_generated/api";

export const loginWithGoogle = action({
  args: {
    idToken: v.string(),
  },
  handler: async (ctx, args) => {
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${args.idToken}`
    );
    if (!res.ok) throw new Error("Invalid Google token");

    const payload: Record<string, any> = await res.json();
    const email: string | undefined = payload.email?.toLowerCase();
    const picture: string | undefined = payload.picture;

    if (!email || payload.email_verified !== "true" || !ADMIN_EMAILS.includes(email)) {
      throw new Error("Not authorized - admin only");
    }

    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new Error("Token was not issued for this application");
    }

    const sessionToken = crypto.randomUUID();
    const now = Date.now();
    await ctx.runMutation(internal.admin._createSession, {
      session_token: sessionToken,
      email,
      created_at: now,
      expires_at: now + 7 * 24 * 60 * 60 * 1000,
    });

    return { sessionToken, email, picture };
  },
});

export const _createSession = internalMutation({
  args: {
    session_token: v.string(),
    email: v.string(),
    created_at: v.number(),
    expires_at: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("adminSessions", {
      session_token: args.session_token,
      email: args.email,
      created_at: args.created_at,
      expires_at: args.expires_at,
    });
  },
});

export const isAdmin = query({
  args: { session_token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_session_token", (q) => q.eq("session_token", args.session_token))
      .first();

    if (!session || session.expires_at < Date.now()) {
      return { isAdmin: false, email: null };
    }

    return { isAdmin: true, email: session.email };
  },
});

export const logout = mutation({
  args: { session_token: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.session_token);

    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_session_token", (q) => q.eq("session_token", args.session_token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});