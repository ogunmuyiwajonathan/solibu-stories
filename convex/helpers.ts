import type { QueryCtx, MutationCtx } from "./_generated/server";

export const ADMIN_EMAILS = [
  "abodunrinoluwanifemi116@gmail.com",
  "ogunmuyiwajonathan@gmail.com",
];

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity;
}

export async function requireAdmin(
  ctx: MutationCtx,
  sessionToken: string
): Promise<string> {
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_session_token", (q) => q.eq("session_token", sessionToken))
    .first();

  if (!session) {
    throw new Error("Invalid session - not authenticated");
  }

  if (session.expires_at < Date.now()) {
    // Clean up expired session
    await ctx.db.delete(session._id);
    throw new Error("Session expired - please sign in again");
  }

  return session.email;
}