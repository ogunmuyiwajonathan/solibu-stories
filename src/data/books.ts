import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { convex } from '../lib/convex';
import type { Id } from '../../convex/_generated/dataModel';

export type Book = {
  _id: Id<"books">;
  title: string;
  author: string;
  genre: string;
  synopsis: string;
  cover_url: string;
  pdf_url: string;
  rating: number;
  featured: boolean;
  _creationTime: number;
  reading_time?: string;
  chapters?: number;
  last_updated?: number;
};

export function useBooks() {
  return useQuery(api.books.listSorted) ?? [];
}

export function useBook(id: Id<"books"> | undefined) {
  return useQuery(api.books.get, id ? { id } : "skip");
}

export function useFeaturedBooks() {
  return useQuery(api.books.getFeatured) ?? [];
}

export function useCreateBook() {
  return useMutation(api.books.create);
}

export function useUpdateBook() {
  return useMutation(api.books.update);
}

export function useDeleteBook() {
  return useMutation(api.books.remove);
}

// Legacy compatibility exports (imperative wrappers for admin pages)
export async function fetchBooks(): Promise<Book[]> {
  return convex.query(api.books.listSorted);
}

export async function getFeaturedBooks(): Promise<Book[]> {
  const all = await fetchBooks();
  return all.filter((b) => b.featured);
}

export async function fetchBookById(id: string): Promise<Book | null> {
  return convex.query(api.books.get, { id: id as Id<"books"> });
}

export async function getRelatedBooks(book: Book): Promise<Book[]> {
  const all = await fetchBooks();
  return all.filter((b) => b._id !== book._id).slice(0, 4);
}

export async function getBookById(id: string): Promise<Book | null> {
  return convex.query(api.books.get, { id: id as Id<"books"> });
}

export async function addBook(book: Omit<Book, '_id' | '_creationTime'>, session_token: string): Promise<string> {
  return convex.mutation(api.books.create, { ...book, session_token });
}

export async function updateBook(id: Id<"books">, updates: Partial<Book>, session_token: string): Promise<Book | null> {
  return convex.mutation(api.books.update, { id, ...updates, session_token });
}

export async function deleteBook(id: Id<"books">, session_token: string): Promise<void> {
  await convex.mutation(api.books.remove, { id, session_token });
}

export async function uploadCover(file: File): Promise<string> {
  return uploadFileToConvex(file);
}

async function uploadFileToConvex(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return convex.action(api.storage.uploadFile, {
    data: dataUrl,
    mimeType: file.type,
    name: file.name,
  });
}
