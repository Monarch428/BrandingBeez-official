import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import compression from "vite-plugin-compression";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const isReplit = process.env.REPL_ID !== undefined;

  return {
    plugins: [
      react(),

      // ✅ only enable overlay in dev + replit
      ...(!isProd && isReplit
        ? [require("@replit/vite-plugin-runtime-error-modal").default()]
        : []),

      compression({ algorithm: "gzip", ext: ".gz", threshold: 1024 }),
      compression({ algorithm: "brotliCompress", ext: ".br", threshold: 1024 }),

      ...(!isProd && isReplit
        ? [
            // cartographer only in dev replit
            require("@replit/vite-plugin-cartographer").cartographer(),
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
  };
});
