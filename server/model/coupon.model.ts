import mongoose, { Schema, type Model } from "mongoose";
import type { Coupon } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface CouponDocument extends mongoose.Document, Coupon {}

const couponSchema = new Schema<CouponDocument>(
  {
    id: numericIdField,
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    maxUses: { type: Number, default: null },
    currentUses: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "coupons", versionKey: false }
);

export const CouponModel =
  (models.Coupon as Model<CouponDocument>) || model<CouponDocument>("Coupon", couponSchema);
