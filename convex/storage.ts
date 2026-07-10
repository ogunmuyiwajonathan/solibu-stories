import { action } from "./_generated/server";
import { v } from "convex/values";

export const uploadFile = action({
  args: {
    data: v.string(),
    mimeType: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const byteString = atob(args.data.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: args.mimeType });
    const file = new File([blob], args.name, { type: args.mimeType });

    const storageId = await ctx.storage.store(file);
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw new Error("Failed to get URL for uploaded file");
    return url;
  },
});
