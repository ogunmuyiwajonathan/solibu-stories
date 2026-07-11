import type { QueryCtx, MutationCtx } from "./_generated/server";

export const ADMIN_EMAILS = [
  "abodunrinoluwanifemi116@gmail.com",
  "ogunmuyiwajonathan@gmail.com",
];

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

export async function requireAdmin(ctx: MutationCtx) {
  const identity = await requireAuth(ctx);
  const email = identity.email?.toLowerCase();
  if (!email || !ADMIN_EMAILS.includes(email)) {
    throw new Error("Not authorized — admin only");
  }
  return { identity };
}
