// server/routes/health.ts
import type { Express } from "express";
import { connectToDatabase, getMongooseConnection } from "../db";
import { storage } from "../storage";

export function registerHealthRoutes(app: Express) {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  app.get("/api/environment", (_req, res) => {
    res.json({
      environment: process.env.NODE_ENV || "development",
      isProduction: process.env.NODE_ENV === "production",
      isDevelopment: process.env.NODE_ENV !== "production",
    });
  });

  app.get("/api/health/database", async (_req, res) => {
    try {
      await connectToDatabase();
      const connection = getMongooseConnection();
      const database = connection.db;
      if (!database) throw new Error("Database connection not initialized");
      await database.admin().command({ ping: 1 });

      const blogCount = await storage.getAllBlogPosts();
      const publishedCount = await storage.getPublishedBlogPosts();

      res.json({
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
        stats: {
          totalBlogPosts: blogCount.length,
          publishedBlogPosts: publishedCount.length,
          healthCheck: "passed",
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "unhealthy",
        database: "disconnected",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  });
}
