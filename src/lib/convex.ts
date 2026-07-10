import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
export const convex = new ConvexReactClient(convexUrl);
