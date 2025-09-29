import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Get the appropriate database URL based on environment
function getDatabaseUrl(): string {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  if (nodeEnv === 'production') {
    if (!process.env.DATABASE_URL_PRODUCTION) {
      throw new Error(
        "DATABASE_URL_PRODUCTION must be set for production environment. Did you forget to provision a production database?"
      );
    }
    console.log('🚀 Connecting to PRODUCTION database');
    return process.env.DATABASE_URL_PRODUCTION;
  } else {
    if (!process.env.DATABASE_URL_DEVELOPMENT) {
      // Fallback to DATABASE_URL for backward compatibility
      if (!process.env.DATABASE_URL) {
        throw new Error(
          "DATABASE_URL_DEVELOPMENT or DATABASE_URL must be set for development environment. Did you forget to provision a development database?"
        );
      }
      console.log('🔧 Connecting to DEVELOPMENT database (using fallback DATABASE_URL)');
      return process.env.DATABASE_URL;
    }
    console.log('🔧 Connecting to DEVELOPMENT database');
    return process.env.DATABASE_URL_DEVELOPMENT;
  }
}

const databaseUrl = getDatabaseUrl();
export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });
