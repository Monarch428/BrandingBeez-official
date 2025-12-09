// src/server/storage-users.ts
import type { User, InsertUser } from "@shared/schema";

export interface UserStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}
