import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { convex } from '../lib/convex';
import type { Id } from '../../convex/_generated/dataModel';

export type Banner = {
  _id: Id<"banners">;
  title: string;
  author: string;
  label: string;
  description: string;
  character_name: string;
  story: string;
  image_url: string;
  book_id?: string;
  active: boolean;
  cta_type?: string;
  _creationTime: number;
};

export function useBanners() {
  return useQuery(api.banners.list) ?? [];
}

export function useActiveBanners() {
  return useQuery(api.banners.listActive) ?? [];
}

export function useBanner(id: Id<"banners"> | undefined) {
  return useQuery(api.banners.get, id ? { id } : "skip");
}

export function useCreateBanner() {
  return useMutation(api.banners.create);
}

export function useUpdateBanner() {
  return useMutation(api.banners.update);
}

export function useDeleteBanner() {
  return useMutation(api.banners.remove);
}

// Legacy compatibility exports
export async function fetchBanners(): Promise<Banner[]> {
  return convex.query(api.banners.list);
}

export async function fetchActiveBanners(): Promise<Banner[]> {
  return convex.query(api.banners.listActive);
}

export async function fetchBannerById(id: string): Promise<Banner | null> {
  return convex.query(api.banners.get, { id: id as Id<"banners"> });
}

export async function addBanner(banner: Omit<Banner, '_id' | '_creationTime'>, session_token: string): Promise<string> {
  return convex.mutation(api.banners.create, { ...banner, session_token });
}

export async function updateBanner(id: Id<"banners">, updates: Partial<Banner>, session_token: string): Promise<Banner | null> {
  return convex.mutation(api.banners.update, { id, ...updates, session_token });
}

export async function deleteBanner(id: Id<"banners">, session_token: string): Promise<void> {
  await convex.mutation(api.banners.remove, { id, session_token });
}

export async function uploadBannerImage(file: File): Promise<string> {
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
