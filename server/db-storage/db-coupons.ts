// src/server/db-coupons.ts
import type { IStorage } from "../storage";
import type { Coupon, CouponUsage } from "@shared/schema";
import { CouponModel, CouponUsageModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const couponStorage = {
  async createCoupon(coupon: any): Promise<Coupon> {
    await ensureConnection();
    const id = await getNextSequence("coupons");
    const created = await CouponModel.create({ id, ...coupon });
    return toPlain<Coupon>(created);
  },

  async getCoupon(code: string): Promise<Coupon | undefined> {
    await ensureConnection();
    const coupon = await CouponModel.findOne({ code }).lean<Coupon>();
    return coupon ?? undefined;
  },

  async validateCouponForEmail(
    code: string,
    email: string,
  ): Promise<{ valid: boolean; message: string; coupon?: Coupon }> {
    await ensureConnection();
    const coupon = await this.getCoupon(code);

    if (!coupon) {
      return { valid: false, message: "Coupon code not found" };
    }

    if (!coupon.isActive) {
      return { valid: false, message: "Coupon is no longer active" };
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return { valid: false, message: "Coupon has expired" };
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return { valid: false, message: "Coupon usage limit reached" };
    }

    const existingUsage = await CouponUsageModel.findOne({
      couponId: coupon.id,
      email,
    }).lean<CouponUsage>();

    if (existingUsage) {
      return {
        valid: false,
        message: "You have already used this coupon code",
      };
    }

    return { valid: true, message: "Coupon is valid", coupon };
  },

  async useCoupon(code: string, email: string): Promise<void> {
    await ensureConnection();
    const coupon = await this.getCoupon(code);
    if (!coupon) return;

    const usageId = await getNextSequence("coupon_usage");
    await CouponUsageModel.create({
      id: usageId,
      couponId: coupon.id,
      email,
    });

    await CouponModel.updateOne(
      { id: coupon.id },
      { $inc: { currentUses: 1 } },
    );
  },

  async getAllCoupons(): Promise<Coupon[]> {
    await ensureConnection();
    const coupons = await CouponModel.find().lean<Coupon[]>();
    return coupons;
  },
} satisfies Pick<
  IStorage,
  "createCoupon" | "getCoupon" | "validateCouponForEmail" | "useCoupon" | "getAllCoupons"
>;
