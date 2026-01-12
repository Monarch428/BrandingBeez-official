// import express, { type Express } from "express";
// import fs from "fs";
// import path from "path";
// import { createServer as createViteServer, createLogger } from "vite";
// import { type Server } from "http";
// import viteConfig from "../vite.config";
// import { nanoid } from "nanoid";
// import cors from "cors";
// import expressStaticGzip from "express-static-gzip";

// const viteLogger = createLogger();

// export function log(message: string, source = "express") {
//   const formattedTime = new Date().toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: true,
//   });

//   console.log(`${formattedTime} [${source}] ${message}`);
// }

// export async function setupVite(app: Express, server: Server) {
//   const serverOptions = {
//     middlewareMode: true,
//     hmr: { server },
//     allowedHosts: true as const,
//   };

//   const vite = await createViteServer({
//     ...viteConfig,
//     configFile: false,
//     customLogger: {
//       ...viteLogger,
//       error: (msg, options) => {
//         viteLogger.error(msg, options);
//         process.exit(1);
//       },
//     },
//     server: serverOptions,
//     appType: "custom",
//   });

//   app.use(cors({
//     origin: [
//       "https://brandingbeez-official.onrender.com",
//       "http://localhost:5173",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   }));

//   app.use(vite.middlewares);
//   app.use("*", async (req, res, next) => {
//     const url = req.originalUrl;

//     // Skip API routes and static assets
//     if (url.startsWith('/api/') || url.startsWith('/assets/') || url.startsWith('/src/') || url.includes('.')) {
//       return next();
//     }

//     try {
//       const clientTemplate = path.resolve(
//         import.meta.dirname,
//         "..",
//         "client",
//         "index.html",
//       );

//       let template = await fs.promises.readFile(clientTemplate, "utf-8");
//       template = template.replace(
//         `src="/src/main.tsx"`,
//         `src="/src/main.tsx?v=${nanoid()}"`,
//       );
//       const page = await vite.transformIndexHtml(url, template);
//       res.status(200).set({ "Content-Type": "text/html" }).end(page);
//     } catch (e) {
//       vite.ssrFixStacktrace(e as Error);
//       next(e);
//     }
//   });
// }

// export function serveStatic(app: Express) {
//   const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

//   if (!fs.existsSync(distPath)) {
//     throw new Error(
//       `Could not find the build directory: ${distPath}, make sure to build the client first`,
//     );
//   }

//   app.use(cors({
//     origin: [
//       "https://brandingbeez-official.onrender.com",
//       "http://localhost:5173",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   }));

//   // ✅ Serve precompressed files (.br then .gz) + correct caching rules
//   // - /assets/* (hashed) => 1 year immutable
//   // - index.html => no-cache
//   // - others => 1 hour
//   app.use(
//     "/",
//     expressStaticGzip(distPath, {
//       enableBrotli: true,
//       orderPreference: ["br", "gz"],
//       serveStatic: {
//         setHeaders: (res, filePath) => {
//           // Cache Vite hashed assets forever (safe)
//           if (filePath.includes(`${path.sep}assets${path.sep}`)) {
//             res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
//             return;
//           }

//           // Never cache index.html
//           if (filePath.endsWith(`${path.sep}index.html`)) {
//             res.setHeader("Cache-Control", "no-cache");
//             return;
//           }

//           // Reasonable cache for other files
//           res.setHeader("Cache-Control", "public, max-age=3600");
//         },
//       },
//     })
//   );

//   app.use("*", (_req, res) => {
//     res.sendFile(path.resolve(distPath, "index.html"));
//   });
// }











// server/vite.ts
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import {
  createServer as createViteServer,
  createLogger,
  type InlineConfig,
} from "vite";
import { type Server } from "http";
import viteConfigExport from "../vite.config";
import cors from "cors";
import expressStaticGzip from "express-static-gzip";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * ✅ Important fix:
 * Your vite.config.ts exports a FUNCTION (defineConfig(({mode})=>...)).
 * We must CALL it to get the real config object (so root="client" is applied).
 */
async function getResolvedViteConfig(): Promise<InlineConfig> {
  const mode = process.env.NODE_ENV === "production" ? "production" : "development";

  const cfg =
    typeof viteConfigExport === "function"
      ? await (viteConfigExport as any)({ command: "serve", mode })
      : (viteConfigExport as any);

  return cfg as InlineConfig;
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const resolvedConfig = await getResolvedViteConfig();

  const vite = await createViteServer({
    ...resolvedConfig,
    // We already resolved config ourselves
    configFile: false,
    appType: "custom",
    server: {
      ...(resolvedConfig.server || {}),
      ...serverOptions,
    },
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
  });

  app.use(
    cors({
      origin: [
        "https://brandingbeez-official.onrender.com",
        "http://localhost:5173",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  // ✅ Vite handles /src/* module requests + HMR
  app.use(vite.middlewares);

  // ✅ Serve index.html for SPA routes
  // (but NOT for /src, /assets, /api, or file requests)
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    if (
      url.startsWith("/api/") ||
      url.startsWith("/assets/") ||
      url.startsWith("/src/") ||
      url.includes(".")
    ) {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );

      const template = await fs.promises.readFile(clientTemplate, "utf-8");

      // ✅ Do NOT inject cache-busting querystrings in dev.
      // Vite HMR already handles caching and module resolution.
      const page = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(
    cors({
      origin: [
        "https://brandingbeez-official.onrender.com",
        "http://localhost:5173",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  // ✅ Serve precompressed files (.br then .gz) + correct caching rules
  // - /assets/* (hashed) => 1 year immutable
  // - index.html => no-cache
  // - others => 1 hour
  app.use(
    "/",
    expressStaticGzip(distPath, {
      enableBrotli: true,
      orderPreference: ["br", "gz"],
      serveStatic: {
        setHeaders: (res, filePath) => {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
            return;
          }

          if (filePath.endsWith(`${path.sep}index.html`)) {
            res.setHeader("Cache-Control", "no-cache");
            return;
          }

          res.setHeader("Cache-Control", "public, max-age=3600");
        },
      },
    })
  );

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
