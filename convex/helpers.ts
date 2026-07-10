import type { QueryCtx, MutationCtx } from "./_generated/server";

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

export async function requireAdmin(ctx: MutationCtx) {
  const identity = await requireAuth(ctx);
  const email = identity.email;
  if (!email) {
    throw new Error("Email not available — cannot verify admin");
  }
  const admin = await ctx.db
    .query("admin_users")
    .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
    .first();
  if (!admin) {
    throw new Error("Not authorized — admin only");
  }
  return { identity, admin };
}
