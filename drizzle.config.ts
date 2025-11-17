import { defineConfig } from "drizzle-kit";

// Get the appropriate database URL based on environment
function getDatabaseUrl(): string {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  if (nodeEnv === 'production') {
    if (!process.env.DATABASE_URL_PRODUCTION) {
      throw new Error("DATABASE_URL_PRODUCTION must be set for production environment");
    }
    return process.env.DATABASE_URL_PRODUCTION;
  } else {
    if (!process.env.DATABASE_URL_DEVELOPMENT) {
      // Fallback to DATABASE_URL for backward compatibility
      if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL_DEVELOPMENT or DATABASE_URL must be set for development environment");
      }
      return process.env.DATABASE_URL;
    }
    return process.env.DATABASE_URL_DEVELOPMENT;
  }
}

const databaseUrl = getDatabaseUrl();

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
