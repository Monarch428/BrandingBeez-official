// src/server/db-helpers.ts
import { connectToDatabase, getNextSequence as baseGetNextSequence } from "../db";

export async function ensureConnection(): Promise<void> {
  await connectToDatabase();
}

export function toPlain<T>(doc: any): T {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete (obj as any)._id;
  return obj as T;
}

export const getNextSequence = baseGetNextSequence;
