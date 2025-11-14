import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./db-init";
import dotenv from "dotenv";
dotenv.config({ path: ".env" }); 
const app = express();

// Set environment from NODE_ENV
app.set('env', process.env.NODE_ENV || 'development');

// Enable compression for faster response times (fixes PageSpeed 'No compression applied')
app.use(compression({
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Balanced compression
  threshold: 1024, // Only compress files > 1KB
}));

// Trust proxy for proper rate limiting and forwarded headers
// Configure trust proxy more securely for Replit environment
if (process.env.NODE_ENV === 'production') {
  // In production, trust first proxy (Replit's load balancer)
  app.set('trust proxy', 1);
} else {
  // In development, trust all proxies for testing
  app.set('trust proxy', true);
}

// Security and performance headers
app.use((req: Request, res: Response, next: NextFunction) => {
  // Performance headers (helmet handles most security headers via security.ts)
  res.setHeader('X-DNS-Prefetch-Control', 'on');

  // Proper MIME types to fix PageSpeed errors
  if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  } else if (req.path.endsWith('.js') || req.path.endsWith('.mjs')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  } else if (req.path.endsWith('.tsx') || req.path.endsWith('.ts')) {
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
  } else if (req.path.endsWith('.json')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }

  // Enable server push for HTTP/2
  if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
    res.setHeader('Link', '</src/main.tsx>; rel=modulepreload, </src/index.css>; rel=preload; as=style');
  }
  
  next();
});

app.use(express.json({ limit: '50mb' }));

// Explicit robots.txt serving with proper headers
app.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  res.send(`User-agent: *
Disallow: /src/
Disallow: /_next/
Disallow: /api/
Disallow: /api/admin/
Disallow: /admin/
Disallow: /.well-known/
Disallow: /__vite/

Sitemap: https://brandingbeez.co.uk/sitemap.xml`);
});

// Explicit sitemap.xml serving  
app.get('/sitemap.xml', (req: Request, res: Response) => {
  res.type('application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://brandingbeez.co.uk/</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://brandingbeez.co.uk/services</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://brandingbeez.co.uk/services/ai-development</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://brandingbeez.co.uk/services/web-development</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://brandingbeez.co.uk/services/google-ads</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://brandingbeez.co.uk/services/seo</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://brandingbeez.co.uk/services/dedicated-resources</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://brandingbeez.co.uk/about</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://brandingbeez.co.uk/contact</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://brandingbeez.co.uk/blog</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://brandingbeez.co.uk/case-studies</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://brandingbeez.co.uk/pricing</loc>
    <lastmod>2025-08-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`);
});
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Optimized static file serving with caching headers
app.use('/attached_assets', express.static('attached_assets', {
  maxAge: '1y', // Cache for 1 year
  etag: true,
  lastModified: true
}));

// Serve static files from public directory with optimized caching
app.use(express.static('public', {
  maxAge: '30d', 
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Set specific cache headers for different file types
    if (path.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000'); 
    } else if (path.match(/\.(css|js)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); 
    }
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database with sample data
  await initializeDatabase();

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error but don't throw to prevent crashes
    console.error('Server Error:', err);
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === 'production') {
    try {
      console.log('Setting up static file serving for production...');
      serveStatic(app);
      console.log('Static file serving setup completed');
    } catch (error) {
      console.error('Error setting up static file serving:', error);
      throw error;
    }
  } else {
    try {
      console.log('Setting up Vite development server...');
      const { setupVite } = await import('./vite');
      await setupVite(app, server);
      console.log('Vite development server setup completed');
    } catch (error) {
      console.error('Error setting up Vite development server:', error);
      throw error;
    }
  }

  // Use the port assigned by Replit or fallback to 5000 for local development
  // this serves both the API and the client.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
      port,
      host: process.env.NODE_ENV === 'production' ? "0.0.0.0" : "127.0.0.1",
  }, () => {
      log(`serving on port ${port}`);
  });
})();