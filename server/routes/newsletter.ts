import { Router, Request, Response } from "express";
import { sendEmailViaGmail } from "../email-service";
import { db } from "../db";
import { newsletterSubscribers } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/subscribe", async (req: Request, res: Response) => {
  const { email, name } = req.body;

  // Validate required fields
  if (!email || !name) {
    return res
      .status(400)
      .json({ success: false, message: "Name and email are required" });
  }

  // Simple email regex (can replace with a library like validator.js)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  try {
    // Check if already subscribed
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email));

    if (existing.length) {
      return res
        .status(409)
        .json({ success: false, message: "Email already subscribed" });
    }

    // Save to DB
    await db.insert(newsletterSubscribers).values({
      email,
      name,
      subscribedAt: new Date(),
    });

    // Send confirmation email (non-blocking but awaited here)
    await sendEmailViaGmail({
      email,
      name,
      message: "Thanks for subscribing!",
      submittedAt: new Date(),
    });

    return res
      .status(201)
      .json({ success: true, message: "Subscribed successfully!" });
  } catch (err) {
    console.error("Subscription error:", err instanceof Error ? err.message : err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to subscribe" });
  }
});

export default router;
