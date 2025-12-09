// src/server/storage-coupons.ts
import type { Coupon } from "@shared/schema";

export interface CouponStorage {
  createCoupon(coupon: any): Promise<Coupon>;
  getCoupon(code: string): Promise<Coupon | undefined>;
  validateCouponForEmail(
    code: string,
    email: string,
  ): Promise<{ valid: boolean; message: string; coupon?: Coupon }>;
  useCoupon(code: string, email: string): Promise<void>;
  getAllCoupons(): Promise<Coupon[]>;
}
