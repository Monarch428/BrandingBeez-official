import mongoose, { Schema, type Model } from "mongoose";

const { model, models } = mongoose;

// Counter schema for auto-increment support
export interface CounterDocument extends mongoose.Document {
  collection: string;
  seq: number;
}

const counterSchema = new Schema<CounterDocument>(
  {
    collection: { type: String, required: true, unique: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { collection: "counters", versionKey: false }
);

export const CounterModel =
  (models.Counter as Model<CounterDocument>) ||
  model<CounterDocument>("Counter", counterSchema);
