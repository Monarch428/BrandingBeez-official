import mongoose, { Schema, type Model } from "mongoose";
import type { User } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers"; 

const { model, models } = mongoose;

export interface UserDocument extends mongoose.Document, User {}

const userSchema = new Schema<UserDocument>(
  {
    id: numericIdField,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "users", versionKey: false }
);

export const UserModel =
  (models.User as Model<UserDocument>) || model<UserDocument>("User", userSchema);
