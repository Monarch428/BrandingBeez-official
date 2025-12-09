// src/server/db-users.ts
import type { IStorage } from "../storage";
import type { User, InsertUser } from "@shared/schema";
import { UserModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const userStorage = {
  async getUser(id: number): Promise<User | undefined> {
    await ensureConnection();
    const user = await UserModel.findOne({ id }).lean<User>();
    return user ?? undefined;
  },

  async getUserByUsername(username: string): Promise<User | undefined> {
    await ensureConnection();
    const user = await UserModel.findOne({ username }).lean<User>();
    return user ?? undefined;
  },

  async createUser(user: InsertUser): Promise<User> {
    await ensureConnection();
    const id = await getNextSequence("users");
    const created = await UserModel.create({ id, ...user });
    return toPlain<User>(created);
  },
} satisfies Pick<IStorage, "getUser" | "getUserByUsername" | "createUser">;
