import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { convex } from '../lib/convex';
import type { Id } from '../../convex/_generated/dataModel';

export type Favourite = {
  _id: Id<"favourites">;
  user_id: string;
  book_id: Id<"books">;
  _creationTime: number;
  book?: {
    _id: Id<"books">;
    title: string;
    author: string;
    synopsis: string;
    cover_url: string;
    pdf_url: string;
    rating: number;
    featured: boolean;
  } | null;
};

export function useFavourites(userId: string | undefined) {
  return useQuery(
    api.favourites.listByUser,
    userId ? { user_id: userId } : "skip"
  ) ?? [];
}

export function useFavouriteBookIds(userId: string | undefined) {
  return useQuery(
    api.favourites.getBookIds,
    userId ? { user_id: userId } : "skip"
  ) ?? [];
}

export function useIsFavourited(userId: string | undefined, bookId: Id<"books"> | undefined) {
  return useQuery(
    api.favourites.isFavourited,
    userId && bookId ? { user_id: userId, book_id: bookId } : "skip"
  );
}

export function useAddFavourite() {
  return useMutation(api.favourites.add);
}

export function useRemoveFavourite() {
  return useMutation(api.favourites.remove);
}

// Legacy compatibility exports
export async function fetchFavouriteBookIds(userId: string): Promise<string[]> {
  const ids = await convex.query(api.favourites.getBookIds, { user_id: userId });
  return ids.map((id) => id as unknown as string);
}

export async function addFavourite(_userId: string, bookId: Id<"books">): Promise<string> {
  return convex.mutation(api.favourites.add, { book_id: bookId });
}

export async function removeFavourite(_userId: string, bookId: Id<"books">): Promise<void> {
  await convex.mutation(api.favourites.remove, { book_id: bookId });
}
