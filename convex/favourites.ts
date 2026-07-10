import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./helpers";

export const listByUser = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const favs = await ctx.db
      .query("favourites")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();

    const favsWithBooks = await Promise.all(
      favs.map(async (fav) => {
        const book = await ctx.db.get(fav.book_id);
        return { ...fav, book };
      })
    );

    return favsWithBooks.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const getBookIds = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const favs = await ctx.db
      .query("favourites")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();
    return favs.map((f) => f.book_id);
  },
});

export const isFavourited = query({
  args: { user_id: v.string(), book_id: v.id("books") },
  handler: async (ctx, args) => {
    const fav = await ctx.db
      .query("favourites")
      .withIndex("by_user_book", (q) =>
        q.eq("user_id", args.user_id).eq("book_id", args.book_id)
      )
      .first();
    return fav !== null;
  },
});

export const add = mutation({
  args: {
    book_id: v.id("books"),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const existing = await ctx.db
      .query("favourites")
      .withIndex("by_user_book", (q) =>
        q.eq("user_id", identity.subject).eq("book_id", args.book_id)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("favourites", {
      user_id: identity.subject,
      book_id: args.book_id,
    });
  },
});

export const remove = mutation({
  args: {
    book_id: v.id("books"),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const fav = await ctx.db
      .query("favourites")
      .withIndex("by_user_book", (q) =>
        q.eq("user_id", identity.subject).eq("book_id", args.book_id)
      )
      .first();

    if (fav) {
      await ctx.db.delete(fav._id);
    }
  },
});
