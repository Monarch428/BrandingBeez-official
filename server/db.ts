import mongoose from "mongoose";
import { CounterModel } from "./models";

mongoose.set("strictQuery", true);

let connectionPromise: Promise<typeof mongoose> | null = null;

function getDatabaseUrl(): string {
  const nodeEnv = process.env.NODE_ENV || "development";

  console.log("NODE_ENV:", nodeEnv);
  console.log("MONGODB_URI:", process.env.MONGODB_URI);
  console.log("MONGODB_URI_DEVELOPMENT:", process.env.MONGODB_URI_DEVELOPMENT);
  console.log("MONGODB_URI_PRODUCTION:", process.env.MONGODB_URI_PRODUCTION);

  const uri =
    nodeEnv === "production"
      ? process.env.MONGODB_URI_PRODUCTION || process.env.MONGODB_URI || ""
      : process.env.MONGODB_URI_DEVELOPMENT || process.env.MONGODB_URI || "";

  console.log("FINAL URI USED:", uri);

  if (!uri) {
    throw new Error(`MongoDB URI is missing for ${nodeEnv} environment.`);
  }

  return uri;
}

function getDatabaseName(): string | undefined {
  return process.env.MONGODB_DB_NAME || undefined;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return mongoose;
  }

  if (!connectionPromise) {
    const uri = getDatabaseUrl();
    connectionPromise = mongoose
      .connect(uri, {
        dbName: getDatabaseName(),
      })
      .then((conn) => {
        console.log("✅ MongoDB connected");
        return conn;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error("❌ MongoDB connection failed", error);
        throw error;
      });
  }

  return connectionPromise;
}

export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    connectionPromise = null;
  }
}

export function getMongooseConnection(): mongoose.Connection {
  return mongoose.connection;
}

export async function getNextSequence(collection: string): Promise<number> {
  await connectToDatabase();

  const counter = await CounterModel.findOneAndUpdate(
    { collection },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  ).lean();

  if (!counter) {
    throw new Error(`Unable to generate sequence for ${collection}`);
  }

  return counter.seq;
}
