import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { convex } from '../lib/convex';
import type { Id } from '../../convex/_generated/dataModel';

export type Review = {
  _id: Id<"reviews">;
  user_id: string;
  book_id: Id<"books">;
  rating: number;
  content?: string;
  _creationTime: number;
};

export function useReviews(bookId: Id<"books"> | undefined) {
  return useQuery(
    api.reviews.listByBook,
    bookId ? { book_id: bookId } : "skip"
  ) ?? [];
}

export function useUserReview(userId: string | undefined, bookId: Id<"books"> | undefined) {
  return useQuery(
    api.reviews.getByUserAndBook,
    userId && bookId ? { user_id: userId, book_id: bookId } : "skip"
  );
}

export function useCreateReview() {
  return useMutation(api.reviews.create);
}

export function useUpdateReview() {
  return useMutation(api.reviews.update);
}

export function useDeleteReview() {
  return useMutation(api.reviews.remove);
}

// Legacy compatibility exports
export async function fetchReviews(bookId: string): Promise<Review[]> {
  return convex.query(api.reviews.listByBook, { book_id: bookId as Id<"books"> });
}

export async function fetchReviewsByUser(userId: string): Promise<Review[]> {
  return convex.query(api.reviews.listByUser, { user_id: userId });
}

export async function fetchUserReview(userId: string, bookId: string): Promise<Review | null> {
  return convex.query(api.reviews.getByUserAndBook, { user_id: userId, book_id: bookId as Id<"books"> });
}

export async function addReview(review: { book_id: string; rating: number; content?: string }): Promise<string> {
  return convex.mutation(api.reviews.create, { book_id: review.book_id as Id<"books">, rating: review.rating, content: review.content });
}

export async function updateReview(id: Id<"reviews">, updates: { rating?: number; content?: string }): Promise<Review | null> {
  return convex.mutation(api.reviews.update, { id, ...updates });
}

export async function deleteReview(id: Id<"reviews">): Promise<void> {
  await convex.mutation(api.reviews.remove, { id });
}
