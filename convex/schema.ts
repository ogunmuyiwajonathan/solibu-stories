import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
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
    last_updated: v.optional(v.number()),
    order_index: v.optional(v.number()),
  }),

  banners: defineTable({
    image_url: v.string(),
    label: v.string(),
    title: v.string(),
    author: v.string(),
    description: v.string(),
    character_name: v.string(),
    story: v.string(),
    active: v.boolean(),
    cta_type: v.optional(v.string()),
    order_index: v.optional(v.number()),
  }),

  reviews: defineTable({
    user_id: v.string(),
    book_id: v.id("books"),
    rating: v.number(),
    content: v.optional(v.string()),
  }).index("by_user_book", ["user_id", "book_id"])
    .index("by_book", ["book_id"]),

  favourites: defineTable({
    user_id: v.string(),
    book_id: v.id("books"),
  }).index("by_user", ["user_id"])
    .index("by_user_book", ["user_id", "book_id"]),

  admin_users: defineTable({
    user_id: v.string(),
    email: v.string(),
  }).index("by_user_id", ["user_id"])
    .index("by_email", ["email"]),
});
