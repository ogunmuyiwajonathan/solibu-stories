import { supabase } from '../lib/supabase';

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  synopsis: string;
  cover_url: string;
  pdf_url: string;
  rating: number;
  featured: boolean;
  order_index: number;
  created_at: string;
}

function mapBook(row: any): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.Genre || row.genre || '',
    synopsis: row.synopsis,
    cover_url: row.cover_url,
    pdf_url: row.pdf_url,
    rating: row.rating,
    featured: row.featured,
    order_index: row.order_index,
    created_at: row.created_at,
  };
}

export async function fetchBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('order_index', { ascending: true });
  if (error || !data) return [];
  return data.map(mapBook);
}

export async function fetchBookById(id: number): Promise<Book | null> {
  const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapBook(data);
}

export async function fetchFeaturedBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('featured', true)
    .order('order_index', { ascending: true });
  if (error || !data) return [];
  return data.map(mapBook);
}

export async function addBook(book: Omit<Book, 'id' | 'created_at'>): Promise<Book | null> {
  const { data, error } = await supabase.from('books').insert({
    title: book.title,
    author: book.author,
    Genre: book.genre,
    synopsis: book.synopsis,
    cover_url: book.cover_url,
    pdf_url: book.pdf_url,
    rating: book.rating,
    featured: book.featured,
    order_index: book.order_index,
  }).select().single();
  if (error) {
    console.error('Add book error:', error);
    return null;
  }
  if (!data) return null;
  return mapBook(data);
}

export async function updateBook(id: number, book: Partial<Book>): Promise<Book | null> {
  const updateData: any = { ...book };
  delete updateData.id;
  delete updateData.created_at;
  if (updateData.genre) {
    updateData.Genre = updateData.genre;
    delete updateData.genre;
  }
  const { data, error } = await supabase.from('books').update(updateData).eq('id', id).select().single();
  if (error || !data) return null;
  return mapBook(data);
}

export async function deleteBook(id: number): Promise<boolean> {
  const { error } = await supabase.from('books').delete().eq('id', id);
  return !error;
}

const EDGE_FUNCTION_URL = 'https://cxbxrefumqcuoptcuxww.supabase.co/functions/v1/upload-file';

async function uploadViaEdgeFunction(file: File, bucket: string, path: string): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);
  formData.append('path', path);

  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    console.error(`Upload to ${bucket} failed:`, result);
    return null;
  }
  return result.url;
}

export async function uploadCover(file: File): Promise<string | null> {
  const fileName = `covers/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  return uploadViaEdgeFunction(file, 'covers', fileName);
}

export async function uploadPdf(file: File): Promise<string | null> {
  const fileName = `pdfs/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  return uploadViaEdgeFunction(file, 'pdfs', fileName);
}

export const genres = ['All', 'Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Action'];

export function getFeaturedBooks(books: Book[]): Book[] {
  return books.filter(b => b.featured).sort((a, b) => a.order_index - b.order_index);
}

export function getBooksByGenre(books: Book[], genre: string): Book[] {
  if (genre === 'All' || !genre) return books;
  return books.filter(b => b.genre === genre);
}

export function getBookById(books: Book[], id: number): Book | undefined {
  return books.find(b => b.id === id);
}

export function getRelatedBooks(books: Book[], currentId: number, genre: string): Book[] {
  return books.filter(b => b.genre === genre && b.id !== currentId).slice(0, 4);
}
