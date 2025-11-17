import { Router, Request, Response, NextFunction } from "express";
import { sendEmailViaGmail } from "../email-service";
import { storage } from "../storage";
import { insertNewsletterSubscriberSchema } from "@shared/schema";

const router = Router();

// Authentication middleware for admin routes
const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      authenticated: false,
      message: "Missing or invalid authorization header",
    });
  }

  const token = authHeader.split(" ")[1];
  const ADMIN_EMAIL = "info@brandingbeez.co.uk";
  const ADMIN_PASSWORD = "Vignesh@95";

  // Simple token validation (in production, use proper JWT)
  if (
    token !==
    Buffer.from(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`).toString("base64")
  ) {
    return res.status(401).json({
      authenticated: false,
      message: "Invalid token",
    });
  }

  req.user = { id: "admin", name: "Admin User" };
  next();
};

// Get all newsletter subscribers (for admin purposes)
router.get("/subscribers", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const subscribers = await storage.getAllNewsletterSubscribers();
    return res.status(200).json(subscribers);
  } catch (error) {
    console.error("Failed to fetch newsletter subscribers:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch newsletter subscribers" });
  }
});

// Delete newsletter subscriber (for admin purposes)
router.delete("/subscribers/:id", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscriberId = parseInt(id, 10);

    if (isNaN(subscriberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscriber ID",
      });
    }

    // Find and delete the subscriber
    await storage.deleteNewsletterSubscriber(subscriberId);

    return res.status(200).json({
      success: true,
      message: "Newsletter subscriber deleted successfully",
    });
  } catch (error) {
    console.error("Delete newsletter subscriber error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete newsletter subscriber",
    });
  }
});

router.post("/subscribe", async (req: Request, res: Response) => {
  const parseResult = insertNewsletterSubscriberSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid subscriber data",
      errors: parseResult.error.issues,
    });
  }

  const { email, name } = parseResult.data;

  try {
    const existing = await storage.getNewsletterSubscriberByEmail(email);

    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already subscribed" });
    }

    await storage.createNewsletterSubscriber({ email, name });

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
    console.error(
      "Subscription error:",
      err instanceof Error ? err.message : err,
    );
    return res
      .status(500)
      .json({ success: false, message: "Failed to subscribe" });
  }
});

export default router;
