import type { Express } from "express";
import { generateBusinessGrowthAnalysis } from "../openai";
import { sendContactNotification } from "../email-service";

export function registerBusinessGrowthRoutes(app: Express) {
  app.post("/api/ai-business-growth/analyze", async (req, res) => {
    const { companyName, website, industry, contact } = req.body || {};

    if (!website || typeof website !== "string") {
      return res.status(400).json({ success: false, message: "Website is required" });
    }

    try {
      const analysis = await generateBusinessGrowthAnalysis({
        companyName: companyName || "Marketing Agency",
        website,
        industry,
      });

      if (contact?.email && contact?.name) {
        try {
          await sendContactNotification({
            name: contact.name,
            email: contact.email,
            company: companyName || undefined,
            phone: contact.phone,
            message: `AI BUSINESS GROWTH ANALYZER: ${website} | Score ${analysis.reportMetadata.overallScore}/100`,
            submittedAt: new Date(),
          });
        } catch (error) {
          console.error("Failed to send notification for business growth analysis", error);
        }
      }

      res.json({ success: true, analysis });
    } catch (error) {
      console.error("Business growth analysis route error:", error);
      res.status(500).json({ success: false, message: "Failed to generate analysis" });
    }
  });
}
