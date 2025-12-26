import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),

    // ✅ Precompress assets during build (dist/public/assets/*)
    // Gzip
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024,
    }),

    // Brotli
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024,
    }),

    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
