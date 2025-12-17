import mongoose, { Schema, type Model } from "mongoose";
import type { CouponUsage } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface CouponUsageDocument extends mongoose.Document, CouponUsage {}

const couponUsageSchema = new Schema<CouponUsageDocument>(
  {
    id: numericIdField,
    couponId: { type: Number, required: true },
    email: { type: String, required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { collection: "coupon_usage", versionKey: false }
);

export const CouponUsageModel =
  (models.CouponUsage as Model<CouponUsageDocument>) ||
  model<CouponUsageDocument>("CouponUsage", couponUsageSchema);
