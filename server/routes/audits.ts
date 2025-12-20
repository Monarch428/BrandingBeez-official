// server/routes/audits.ts
import type { Express } from "express";
import { storage } from "../storage";
import { analyzeSEOAudit, analyzeWebsiteSEO, analyzeWebsiteSecurity, calculatePricing, analyzeGoogleAds, analyzeAutomation } from "../openai";
import { sendContactNotification } from "../email-service";

export function registerAuditRoutes(app: Express) {
  app.post("/api/pricing-calculator", async (req, res) => {
    const pricingResult = await calculatePricing(req.body);
    res.json(pricingResult);
  });

  // OLD: /api/seo-audit
  app.post("/api/seo-audit", async (req, res) => {
    const { websiteUrl } = req.body;
    const auditResult = await analyzeSEOAudit(websiteUrl);

    const client = await storage.createClient({
      name: req.body.name || "Anonymous User",
      email: req.body.email || "anonymous@audit.com",
      company: req.body.company || "Website Audit",
      phone: req.body.phone || "",
      website: req.body.websiteUrl || "",
      region: "US",
    });

    const audit = await storage.createSeoAudit({ websiteUrl, clientId: client.id, status: "completed" });

    const updatedAudit = await storage.updateAuditData(
      audit.id,
      auditResult.auditData,
      auditResult.score,
      auditResult.recommendations,
    );

    res.json({ success: true, audit: updatedAudit });
  });

  // NEW: /api/seo-audits
  app.post("/api/seo-audits", async (req, res) => {
    const { websiteUrl, clientId, email, name, company } = req.body;

    const audit = await storage.createSeoAudit({ websiteUrl, clientId: clientId || 1, status: "processing" });
    const auditResult = await analyzeSEOAudit(websiteUrl);

    const updatedAudit = await storage.updateAuditData(
      audit.id,
      auditResult.auditData,
      auditResult.score,
      auditResult.recommendations,
    );

    if (email && name) {
      try {
        await sendContactNotification({
          name,
          email,
          company: company || undefined,
          phone: undefined,
          message: `SEO AUDIT REQUEST: Website ${websiteUrl}. Audit Score: ${auditResult.score}/100`,
          submittedAt: new Date(),
        });
      } catch {}
    }

    res.json({ success: true, audit: updatedAudit });
  });

  app.get("/api/seo-audits/:id", async (req, res) => {
    const audit = await storage.getSeoAudit(parseInt(req.params.id));
    res.json(audit);
  });

  app.post("/api/seo-analyzer", async (req, res) => {
    const { websiteUrl, email, name, company } = req.body;
    const analysis = await analyzeWebsiteSEO(websiteUrl);

    if (email && name) {
      try {
        await sendContactNotification({
          name,
          email,
          company: company || undefined,
          phone: undefined,
          message: `SEO ANALYSIS REQUEST: Website ${websiteUrl}. Analysis completed with score: ${analysis.overallScore}/100`,
          submittedAt: new Date(),
        });
      } catch {}
    }

    res.json({ success: true, analysis });
  });

  app.post("/api/seo-analyzer/download", async (req, res) => {
    const { analysis, websiteUrl } = req.body;
    const reportData = {
      website: websiteUrl,
      generatedAt: new Date().toISOString(),
      overallScore: analysis.overallScore,
      summary: `Comprehensive SEO analysis for ${websiteUrl} showing an overall score of ${analysis.overallScore}/100.`,
      recommendations: analysis.recommendations,
      metrics: analysis.metrics,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="seo-analysis-${websiteUrl.replace(/[^a-zA-Z0-9]/g, "-")}.json"`,
    );
    res.json(reportData);
  });

  app.post("/api/website-audit", async (req, res) => {
    const { websiteUrl } = req.body;
    const auditResult = await analyzeWebsiteSecurity(websiteUrl);
    res.json({ success: true, audit: auditResult });
  });

  app.post("/api/google-ads-audit", async (req, res) => {
    const { monthlySpend, industry, currentCTR, currentCPC, goals, email, name, company } = req.body;

    const auditResult = await analyzeGoogleAds({
      monthlySpend,
      industry,
      currentCTR: currentCTR || 2.5,
      currentCPC: currentCPC || 3.5,
      goals: goals || [],
    });

    if (email && name) {
      try {
        await sendContactNotification({
          name,
          email,
          company: company || undefined,
          phone: undefined,
          message: `GOOGLE ADS AUDIT REQUEST: Monthly Spend: $${monthlySpend}, Industry: ${industry}, Current Performance: CTR ${currentCTR}%, CPC $${currentCPC}`,
          submittedAt: new Date(),
        });
      } catch {}
    }

    res.json({ success: true, audit: auditResult });
  });

  app.post("/api/automation-analysis", async (req, res) => {
    const auditResult = await analyzeAutomation(req.body);
    res.json({ success: true, audit: auditResult });
  });
}
