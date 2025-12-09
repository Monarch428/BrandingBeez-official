// shared/schema/coupons.ts
import { z } from "zod";

export const insertCouponSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  discountPercentage: z.number().int().min(0),
  maxUses: z.number().int().min(1).nullable().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.date().optional(),
});

export type InsertCoupon = z.infer<typeof insertCouponSchema>;

export interface Coupon extends Omit<InsertCoupon, "expiresAt"> {
  id: number;
  maxUses: number | null;
  currentUses: number;
  expiresAt?: Date | null;
  createdAt: Date;
}

// Coupon Usage
export const insertCouponUsageSchema = z.object({
  couponId: z.number().int(),
  email: z.string().email(),
});

export type InsertCouponUsage = z.infer<typeof insertCouponUsageSchema>;

export interface CouponUsage extends InsertCouponUsage {
  id: number;
  usedAt: Date;
}
