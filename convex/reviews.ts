import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./helpers";

async function recalcBookRating(ctx: any, bookId: any) {
  const reviews = await ctx.db
    .query("reviews")
    .withIndex("by_book", (q: any) => q.eq("book_id", bookId))
    .collect();
  if (reviews.length === 0) return;
  const avg = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;
  const rounded = Math.round(avg * 10) / 10;
  await ctx.db.patch(bookId, { rating: rounded, last_updated: Date.now() });
}

export const listByBook = query({
  args: { book_id: v.id("books") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_book", (q) => q.eq("book_id", args.book_id))
      .collect();

    return reviews.sort(
      (a, b) => b._creationTime - a._creationTime
    );
  },
});

export const getByUserAndBook = query({
  args: { user_id: v.string(), book_id: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_user_book", (q) =>
        q.eq("user_id", args.user_id).eq("book_id", args.book_id)
      )
      .first();
  },
});

export const listByUser = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_user_book", (q) => q.eq("user_id", args.user_id))
      .collect();
  },
});

export const create = mutation({
  args: {
    book_id: v.id("books"),
    rating: v.number(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const id = await ctx.db.insert("reviews", {
      user_id: identity.subject,
      book_id: args.book_id,
      rating: args.rating,
      content: args.content,
    });
    await recalcBookRating(ctx, args.book_id);
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("reviews"),
    rating: v.optional(v.number()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const review = await ctx.db.get(args.id);
    if (!review) throw new Error("Review not found");
    if (review.user_id !== identity.subject) {
      throw new Error("Not authorized — you can only edit your own reviews");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    const updated = await ctx.db.get(id);
    if (updated) await recalcBookRating(ctx, updated.book_id);
    return updated;
  },
});

export const remove = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const review = await ctx.db.get(args.id);
    if (!review) throw new Error("Review not found");
    if (review.user_id !== identity.subject) {
      throw new Error("Not authorized — you can only delete your own reviews");
    }

    const bookId = review.book_id;
    await ctx.db.delete(args.id);
    await recalcBookRating(ctx, bookId);
  },
});
