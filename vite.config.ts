import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  // Absolute, not './': with a relative base, `./assets/index-abc.js` on a deep
  // link like `/book/:id` resolves to `/book/assets/index-abc.js` and 404s. The
  // SPA rewrite in vercel.json returns index.html there, which then fails to load
  // as a module — so a shared book link or a hard refresh would show a blank page.
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // three.js (via ParticleScene/Book3D) is ~600kB of the ~919kB Home chunk.
        // Bundling it inline meant any Home code change re-downloaded all of it.
        // Named chunks keep three and framer-motion in stable, long-cached files.
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
