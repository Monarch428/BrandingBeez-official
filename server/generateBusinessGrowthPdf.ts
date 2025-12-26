// server/generatebusinessGrowthPdf.ts
import PDFDocument from "pdfkit";

// type QuickWin = {
//   title: string;
//   impact: string;
//   time: string;
//   cost: string;
//   details: string;
// };

// type BusinessGrowthReport = {
//   reportMetadata: {
//     reportId: string;
//     companyName: string;
//     website: string;
//     analysisDate: string; // ISO string
//     overallScore: number;
//     subScores?: Record<string, number | undefined>;
//   };
//   executiveSummary: {
//     strengths: string[];
//     weaknesses: string[];
//     biggestOpportunity: string;
//     quickWins: QuickWin[];
//   };
//   // your backend likely has more fields, but we only rely on these safely
// };

// function safeText(v: unknown, fallback = ""): string {
//   if (typeof v === "string") return v;
//   if (v === null || v === undefined) return fallback;
//   return String(v);
import type { BusinessGrowthReport } from "./openai";

function safeText(value: unknown, fallback = "N/A"): string {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "string") return value || fallback;
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : fallback;
    return String(value);
}

function safeNumber(value: unknown, fallback = "N/A"): string {
    if (typeof value === "number" && Number.isFinite(value)) return `${value}`;
    return fallback;
}

function drawFooter(doc: PDFKit.PDFDocument, reportId: string) {
    const page = doc.page;
    const pageNum = doc.page.pageNumber;

    doc.save();
    doc.fontSize(9).fillColor("#6b7280");
    //   doc.text(
    //     `Page ${pageNum} | Report ID: ${reportId} | CONFIDENTIAL`,
    //     page.margins.left,
    //     page.height - page.margins.bottom + 10,
    //     {
    //       width: page.width - page.margins.left - page.margins.right,
    //       align: "center",
    //     },
    //   );
    doc.text(`Page ${pageNum} | Report ID: ${reportId} | CONFIDENTIAL`, page.margins.left, page.height - page.margins.bottom + 10, {
        width: page.width - page.margins.left - page.margins.right,
        align: "center",
    });
    doc.restore();
}

function sectionTitle(doc: PDFKit.PDFDocument, text: string) {
    doc.moveDown(0.8);
    doc.fontSize(14).fillColor("#2563eb").font("Helvetica-Bold").text(text);
    doc.moveDown(0.3);
    doc.moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .strokeColor("#e5e7eb")
        .stroke();
    doc.moveDown(0.6);
}

// function bulletList(doc: PDFKit.PDFDocument, items: string[]) {
function subTitle(doc: PDFKit.PDFDocument, text: string) {
    doc.moveDown(0.4);
    doc.fontSize(12).fillColor("#111827").font("Helvetica-Bold").text(text);
    doc.moveDown(0.2);
}

function normalizeStringList(value: unknown): string[] {
    if (Array.isArray(value)) return value.map((item) => safeText(item)).filter(Boolean);
    if (typeof value === "string") return value ? [value] : [];
    return [];
}

function bulletList(doc: PDFKit.PDFDocument, items: unknown, emptyMessage = "No data provided.") {
    const cleaned = normalizeStringList(items);
    doc.fontSize(11).fillColor("#111827").font("Helvetica");
    //   for (const item of items.filter(Boolean)) {
    if (!cleaned.length) {
        doc.text(emptyMessage);
        return;
    }
    for (const item of cleaned) {
        doc.text(`• ${item}`, { indent: 10 });
        doc.moveDown(0.2);
    }
}

function renderKeyValueBlock(doc: PDFKit.PDFDocument, entries: Array<[string, string]>) {
    for (const [key, value] of entries) {
        keyValueRow(doc, key, value);
    }
}

function renderListSection<T>(
    doc: PDFKit.PDFDocument,
    heading: string,
    list: T[] | undefined,
    renderItem: (item: T, idx: number) => void,
    emptyMessage = "No data provided.",
) {
    subTitle(doc, heading);
    const normalizedList = Array.isArray(list) ? list : [];
    if (normalizedList.length === 0) {
        doc.font("Helvetica").fontSize(11).fillColor("#111827").text(emptyMessage);
        return;
    }
    normalizedList.forEach((item, idx) => {
        renderItem(item, idx);
        doc.moveDown(0.4);
    });
}

function keyValueRow(doc: PDFKit.PDFDocument, key: string, value: string) {
    doc.font("Helvetica-Bold").fillColor("#111827").text(`${key}: `, { continued: true });
    doc.font("Helvetica").fillColor("#111827").text(value);
}

export async function generateBusinessGrowthPdfBuffer(report: BusinessGrowthReport): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margins: { top: 54, left: 54, right: 54, bottom: 54 },
                autoFirstPage: true,
            });

            const chunks: Buffer[] = [];
            doc.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
            doc.on("end", () => resolve(Buffer.concat(chunks)));

            const reportId = safeText(report.reportMetadata?.reportId, "BB-REPORT");
            const companyName = safeText(report.reportMetadata?.companyName, "Company");
            const website = safeText(report.reportMetadata?.website, "");
            const analysisDate = report.reportMetadata?.analysisDate
                ? new Date(report.reportMetadata.analysisDate).toLocaleDateString()
                : "N/A";
            const score = typeof report.reportMetadata?.overallScore === "number" ? report.reportMetadata.overallScore : 0;

            let hasPage = true;
            const newSectionPage = (title: string) => {
                if (hasPage) drawFooter(doc, reportId);
                doc.addPage();
                sectionTitle(doc, title);
                hasPage = true;
            };

            /* =========================
               COVER PAGE (like your sample)
               Sample shows “BUSINESS GROWTH ANALYSIS” + branding + date + report id + score. :contentReference[oaicite:2]{index=2}
            ========================= */
            doc.rect(0, 0, doc.page.width, doc.page.height).fill("#ffffff");
            doc.fillColor("#111827");

            doc.font("Helvetica-Bold").fontSize(30).text("BUSINESS GROWTH", 54, 110);
            doc.font("Helvetica-Bold").fontSize(30).text("ANALYSIS", 54, 145);

            doc.moveDown(1.2);
            doc.font("Helvetica").fontSize(14).fillColor("#111827").text(companyName, 54, 210);
            if (website) {
                doc.fillColor("#2563eb").fontSize(11).text(website, { link: website, underline: true });
            }

            doc.fillColor("#111827").moveDown(1.0);
            doc.fontSize(11);
            keyValueRow(doc, "Analysis Date", analysisDate);
            keyValueRow(doc, "Report ID", reportId);

            doc.moveDown(0.7);
            doc.font("Helvetica-Bold").fontSize(16).fillColor("#111827").text(`Overall Score: ${score}/100`);

            // simple score bar
            const barX = 54;
            const barY = doc.y + 16;
            const barW = doc.page.width - 108;
            const barH = 10;
            const pct = Math.max(0, Math.min(100, score)) / 100;

            doc.roundedRect(barX, barY, barW, barH, 5).fill("#e5e7eb");
            doc.roundedRect(barX, barY, barW * pct, barH, 5).fill(score < 41 ? "#ef4444" : score < 66 ? "#f59e0b" : "#10b981");

            // doc.moveDown(2.2);

            // drawFooter(doc, reportId);

            /* =========================
               PAGE 2: Executive Summary
            ========================= */
            // doc.addPage();
            // sectionTitle(doc, "BUSINESS GROWTH ANALYSIS REPORT");
            newSectionPage("EXECUTIVE SUMMARY");
            renderKeyValueBlock(doc, [
                ["Company Analyzed", companyName],
                ["Website", website || "N/A"],
                ["Analysis Date", analysisDate],
                ["Report ID", reportId],
            ]);

            // keyValueRow(doc, "Company Analyzed", companyName);
            // keyValueRow(doc, "Website", website || "N/A");
            // keyValueRow(doc, "Analysis Date", analysisDate);
            // keyValueRow(doc, "Report ID", reportId);

            // doc.moveDown(0.8);
            // doc.font("Helvetica-Bold").fontSize(13).fillColor("#111827").text("EXECUTIVE SUMMARY");
            doc.moveDown(0.6);

            // doc.font("Helvetica-Bold").fontSize(12).text(`Overall Business Growth Score: ${score}/100`);
            doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text(`Overall Business Growth Score: ${score}/100`);
            doc.moveDown(0.6);

            // const strengths = report.executiveSummary?.strengths ?? [];
            // const weaknesses = report.executiveSummary?.weaknesses ?? [];
            // const biggestOpportunity = safeText(report.executiveSummary?.biggestOpportunity, "");

            // doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("✅ KEY STRENGTHS:");
            // bulletList(doc, strengths.slice(0, 8));

            // doc.moveDown(0.3);
            // doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("⚠ CRITICAL WEAKNESSES:");
            // bulletList(doc, weaknesses.slice(0, 8));

            bulletList(doc, report.executiveSummary?.strengths ?? [], "No strengths provided.");
            doc.moveDown(0.2);
            bulletList(doc, report.executiveSummary?.weaknesses ?? [], "No weaknesses provided.");

            if (report.executiveSummary?.biggestOpportunity) {
                doc.moveDown(0.4);
                // doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("🚀 BIGGEST OPPORTUNITY:");
                doc.font("Helvetica").fontSize(11).fillColor("#111827").text();
                subTitle(doc, "Biggest Opportunity");
                doc.font("Helvetica").fontSize(11).fillColor("#111827").text(safeText(report.executiveSummary.biggestOpportunity));
            }

            // drawFooter(doc, reportId);

            /* =========================
               PAGE 3: Top actions (Quick Wins)
            ========================= */
            // doc.addPage();
            // sectionTitle(doc, "TOP IMMEDIATE ACTIONS (90-Day Plan)");
            newSectionPage("TOP IMMEDIATE ACTIONS (90-DAY PLAN)");
            const quickWins = report.executiveSummary?.quickWins ?? [];
            if (!quickWins.length) {
                doc.font("Helvetica").fontSize(11).fillColor("#111827").text("No quick wins were provided by the analysis engine.");
            } else {
                // quickWins.slice(0, 8).forEach((q, idx) => {
                //     doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text(`${idx + 1}. ${safeText(q.title)}`);
                quickWins.forEach((q, idx) => {
                    doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text(`${idx + 1}. ${safeText(q.title, "Quick win")}`);
                    doc.font("Helvetica").fontSize(11).fillColor("#111827");
                    doc.text(`Impact: ${safeText(q.impact)}`);
                    doc.text(`Time: ${safeText(q.time)}`);
                    doc.text(`Cost: ${safeText(q.cost)}`);
                    if (q.details) doc.text(`Details: ${safeText(q.details)}`);
                    doc.moveDown(0.6);
                });
            }

            // drawFooter(doc, reportId);

            /* =========================
               (Optional) Sub-scores page
            ========================= */
            newSectionPage("SUB-SCORE BREAKDOWN");
            const subScores = report.reportMetadata?.subScores;
            if (subScores && Object.keys(subScores).length) {
                // doc.addPage();
                // sectionTitle(doc, "SUB-SCORE BREAKDOWN");

                doc.font("Helvetica").fontSize(11).fillColor("#111827");
                // for (const [k, v] of Object.entries(subScores)) {
                //     if (typeof v !== "number") continue;
                //     doc.font("Helvetica-Bold").text(`${k}: `, { continued: true });
                //     doc.font("Helvetica").text(`${v}/100`);
                for (const [key, value] of Object.entries(subScores)) {
                    if (typeof value !== "number") continue;
                    doc.font("Helvetica-Bold").text(`${key}: `, { continued: true });
                    doc.font("Helvetica").text(`${value}/100`);
                    doc.moveDown(0.2);
                }
            } else {
                doc.font("Helvetica").fontSize(11).fillColor("#111827").text("No sub-score data provided.");
            }

            /* =========================
               WEBSITE & DIGITAL PRESENCE
            ========================= */
            newSectionPage("WEBSITE & DIGITAL PRESENCE");
            if (report.websiteDigitalPresence?.technicalSEO) {
                subTitle(doc, "Technical SEO");
                keyValueRow(doc, "Score", safeNumber(report.websiteDigitalPresence.technicalSEO.score));
                bulletList(doc, report.websiteDigitalPresence.technicalSEO.strengths ?? [], "No strengths provided.");
                bulletList(doc, report.websiteDigitalPresence.technicalSEO.issues ?? [], "No issues provided.");
            }
            if (report.websiteDigitalPresence?.contentQuality) {
                subTitle(doc, "Content Quality");
                keyValueRow(doc, "Score", safeNumber(report.websiteDigitalPresence.contentQuality.score));
                bulletList(doc, report.websiteDigitalPresence.contentQuality.strengths ?? [], "No strengths provided.");
                bulletList(doc, report.websiteDigitalPresence.contentQuality.gaps ?? [], "No gaps provided.");
                bulletList(doc, report.websiteDigitalPresence.contentQuality.recommendations ?? [], "No recommendations provided.");
            }
            if (report.websiteDigitalPresence?.uxConversion) {
                subTitle(doc, "UX & Conversion");
                keyValueRow(doc, "Score", safeNumber(report.websiteDigitalPresence.uxConversion.score));
                bulletList(doc, report.websiteDigitalPresence.uxConversion.highlights ?? [], "No highlights provided.");
                bulletList(doc, report.websiteDigitalPresence.uxConversion.issues ?? [], "No issues provided.");
                keyValueRow(doc, "Estimated Uplift", safeText(report.websiteDigitalPresence.uxConversion.estimatedUplift));
            }
            if (report.websiteDigitalPresence?.contentGaps) {
                subTitle(doc, "Content Gaps");
                bulletList(doc, report.websiteDigitalPresence.contentGaps, "No content gaps provided.");
            }

            // drawFooter(doc, reportId);
            /* =========================
         SEO VISIBILITY
      ========================= */
            newSectionPage("SEO VISIBILITY");
            if (report.seoVisibility?.domainAuthority) {
                subTitle(doc, "Domain Authority");
                renderKeyValueBlock(doc, [
                    ["Score", safeNumber(report.seoVisibility.domainAuthority.score)],
                    ["Rationale", safeText(report.seoVisibility.domainAuthority.rationale)],
                ]);
                doc.moveDown(0.2);
                subTitle(doc, "Benchmark");
                renderKeyValueBlock(doc, [
                    ["You", safeNumber(report.seoVisibility.domainAuthority.benchmark?.you)],
                    ["Competitor A", safeNumber(report.seoVisibility.domainAuthority.benchmark?.competitorA)],
                    ["Competitor B", safeNumber(report.seoVisibility.domainAuthority.benchmark?.competitorB)],
                    ["Competitor C", safeNumber(report.seoVisibility.domainAuthority.benchmark?.competitorC)],
                    ["Industry Avg", safeNumber(report.seoVisibility.domainAuthority.benchmark?.industryAverage)],
                ]);
            }
            if (report.seoVisibility?.backlinkProfile) {
                subTitle(doc, "Backlink Profile");
                renderKeyValueBlock(doc, [
                    ["Total Backlinks", safeNumber(report.seoVisibility.backlinkProfile.totalBacklinks)],
                    ["Referring Domains", safeNumber(report.seoVisibility.backlinkProfile.referringDomains)],
                    ["Average DA", safeNumber(report.seoVisibility.backlinkProfile.averageDA)],
                ]);
                bulletList(doc, report.seoVisibility.backlinkProfile.issues ?? [], "No issues provided.");
            }
            if (report.seoVisibility?.keywordRankings) {
                subTitle(doc, "Keyword Rankings");
                renderKeyValueBlock(doc, [
                    ["Total", safeNumber(report.seoVisibility.keywordRankings.total)],
                    ["Top 10", safeNumber(report.seoVisibility.keywordRankings.top10)],
                    ["Top 50", safeNumber(report.seoVisibility.keywordRankings.top50)],
                    ["Top 100", safeNumber(report.seoVisibility.keywordRankings.top100)],
                ]);
            }
            renderListSection(
                doc,
                "Top Performing Keywords",
                report.seoVisibility?.topPerformingKeywords,
                (item, idx) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${idx + 1}. ${safeText(item.keyword)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Position: ${safeNumber(item.position)}`);
                    doc.text(`Monthly Volume: ${safeNumber(item.monthlyVolume)}`);
                    doc.text(`Current Traffic: ${safeText(item.currentTraffic)}`);
                },
            );
            renderListSection(
                doc,
                "Keyword Gap Analysis",
                report.seoVisibility?.keywordGapAnalysis,
                (item, idx) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${idx + 1}. ${safeText(item.keyword)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Monthly Searches: ${safeNumber(item.monthlySearches)}`);
                    doc.text(`Your Rank: ${safeText(item.yourRank)}`);
                    doc.text(`Top Competitor: ${safeText(item.topCompetitor)}`);
                    doc.text(`Opportunity: ${safeText(item.opportunity)}`);
                },
            );
            renderListSection(
                doc,
                "Content Recommendations",
                report.seoVisibility?.contentRecommendations,
                (item, idx) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${idx + 1}. ${safeText(item.keyword)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Content Type: ${safeText(item.contentType)}`);
                    doc.text(`Target Word Count: ${safeNumber(item.targetWordCount)}`);
                    doc.text(`Subtopics: ${(item.subtopics ?? []).join(", ") || "N/A"}`);
                    doc.text(`Traffic Potential: ${safeText(item.trafficPotential)}`);
                },
            );

            /* =========================
         REPUTATION
      ========================= */
            newSectionPage("REPUTATION & SOCIAL PROOF");
            if (report.reputation) {
                renderKeyValueBlock(doc, [
                    ["Review Score", safeNumber(report.reputation.reviewScore)],
                    ["Total Reviews", safeNumber(report.reputation.totalReviews)],
                    ["Industry Standard Range", safeText(report.reputation.industryStandardRange)],
                    ["Your Gap", safeText(report.reputation.yourGap)],
                ]);

                renderListSection(
                    doc,
                    "Review Summary Table",
                    report.reputation.summaryTable,
                    (item) => {
                        doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.platform)}`);
                        doc.font("Helvetica").fontSize(11);
                        doc.text(`Reviews: ${safeNumber(item.reviews)}`);
                        doc.text(`Rating: ${safeText(item.rating)}`);
                        doc.text(`Industry Benchmark: ${safeText(item.industryBenchmark)}`);
                        doc.text(`Gap: ${safeText(item.gap)}`);
                    },
                );

                if (report.reputation.sentimentThemes) {
                    subTitle(doc, "Sentiment Themes");
                    bulletList(doc, report.reputation.sentimentThemes.positive ?? [], "No positive themes provided.");
                    bulletList(doc, report.reputation.sentimentThemes.negative ?? [], "No negative themes provided.");
                    keyValueRow(doc, "Response Rate", safeText(report.reputation.sentimentThemes.responseRate));
                    keyValueRow(doc, "Average Response Time", safeText(report.reputation.sentimentThemes.averageResponseTime));
                }
            }

            /* =========================
               SERVICES & POSITIONING
            ========================= */
            newSectionPage("SERVICES & POSITIONING");
            renderListSection(
                doc,
                "Services Offered",
                report.servicesPositioning?.services,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.name)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Starting Price: ${safeText(item.startingPrice)}`);
                    doc.text(`Description: ${safeText(item.description)}`);
                    doc.text(`Target Market: ${safeText(item.targetMarket)}`);
                },
            );
            renderListSection(
                doc,
                "Service Gaps",
                report.servicesPositioning?.serviceGaps,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.service)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`You Offer: ${safeText(item.youOffer)}`);
                    doc.text(`Competitor A: ${safeText(item.competitorA)}`);
                    doc.text(`Competitor B: ${safeText(item.competitorB)}`);
                    doc.text(`Market Demand: ${safeText(item.marketDemand)}`);
                },
            );
            if (report.servicesPositioning?.industriesServed) {
                subTitle(doc, "Industries Served");
                bulletList(doc, report.servicesPositioning.industriesServed.current ?? [], "No industries provided.");
                keyValueRow(doc, "Concentration Note", safeText(report.servicesPositioning.industriesServed.concentrationNote));
                renderListSection(
                    doc,
                    "High-Value Targets",
                    report.servicesPositioning.industriesServed.highValueTargets,
                    (item) => {
                        doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.industry)}`);
                        doc.font("Helvetica").fontSize(11);
                        doc.text(`Why High Value: ${safeText(item.whyHighValue)}`);
                        doc.text(`Avg Deal Size: ${safeText(item.avgDealSize)}`);
                        doc.text(`Readiness: ${safeText(item.readiness)}`);
                    },
                );
            }
            if (report.servicesPositioning?.positioning) {
                subTitle(doc, "Positioning Summary");
                renderKeyValueBlock(doc, [
                    ["Current Statement", safeText(report.servicesPositioning.positioning.currentStatement)],
                    ["Competitor Comparison", safeText(report.servicesPositioning.positioning.competitorComparison)],
                    ["Differentiation", safeText(report.servicesPositioning.positioning.differentiation)],
                ]);
            }

            /* =========================
               LEAD GENERATION
            ========================= */
            newSectionPage("LEAD GENERATION");
            renderListSection(
                doc,
                "Current Channels",
                report.leadGeneration?.channels,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.channel)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Leads/Month: ${safeText(item.leadsPerMonth)}`);
                    doc.text(`Quality: ${safeText(item.quality)}`);
                    doc.text(`Status: ${safeText(item.status)}`);
                },
            );
            renderListSection(
                doc,
                "Missing High-ROI Channels",
                report.leadGeneration?.missingHighROIChannels,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.channel)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Status: ${safeText(item.status)}`);
                    doc.text(`Estimated Leads: ${safeText(item.estimatedLeads)}`);
                    doc.text(`Setup Time: ${safeText(item.setupTime)}`);
                    doc.text(`Monthly Cost: ${safeText(item.monthlyCost)}`);
                    doc.text(`Priority: ${safeText(item.priority)}`);
                },
            );
            if (report.leadGeneration?.leadMagnets) {
                subTitle(doc, "Lead Magnets");
                bulletList(doc, report.leadGeneration.leadMagnets.current ?? [], "No current lead magnets provided.");
                renderListSection(
                    doc,
                    "Lead Magnet Recommendations",
                    report.leadGeneration.leadMagnets.recommendations,
                    (item) => {
                        doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.name)}`);
                        doc.font("Helvetica").fontSize(11);
                        doc.text(`Format: ${safeText(item.format)}`);
                        doc.text(`Target Audience: ${safeText(item.targetAudience)}`);
                        doc.text(`Estimated Conversion: ${safeText(item.estimatedConversion)}`);
                    },
                );
            }
            renderListSection(
                doc,
                "Directory Optimization",
                report.leadGeneration?.directoryOptimization,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.directory)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Listed: ${safeText(item.listed)}`);
                    doc.text(`Optimized: ${safeText(item.optimized)}`);
                    doc.text(`Reviews: ${safeNumber(item.reviews)}`);
                    doc.text(`Action Needed: ${safeText(item.actionNeeded)}`);
                },
            );

            /* =========================
               COMPETITIVE ANALYSIS
            ========================= */
            newSectionPage("COMPETITIVE ANALYSIS");
            renderListSection(
                doc,
                "Key Competitors",
                report.competitiveAnalysis?.competitors,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.name)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Location: ${safeText(item.location)}`);
                    doc.text(`Team Size: ${safeText(item.teamSize)}`);
                    doc.text(`Years in Business: ${safeText(item.yearsInBusiness)}`);
                    doc.text(`Services: ${(item.services ?? []).join(", ") || "N/A"}`);
                    doc.text(`Strengths vs You: ${(item.strengthsVsYou ?? []).join(", ") || "N/A"}`);
                    doc.text(`Your Advantages: ${(item.yourAdvantages ?? []).join(", ") || "N/A"}`);
                    doc.text(`Market Overlap: ${safeText(item.marketOverlap)}`);
                },
            );
            renderListSection(
                doc,
                "Competitive Matrix",
                report.competitiveAnalysis?.competitiveMatrix,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.factor)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`You: ${safeText(item.you)}`);
                    doc.text(`Competitor A: ${safeText(item.compA)}`);
                    doc.text(`Competitor B: ${safeText(item.compB)}`);
                    doc.text(`Competitor C: ${safeText(item.compC)}`);
                    doc.text(`Winner: ${safeText(item.winner)}`);
                },
            );
            if (report.competitiveAnalysis?.positioningGap) {
                subTitle(doc, "Positioning Gap");
                renderKeyValueBlock(doc, [
                    ["Price Positioning", safeText(report.competitiveAnalysis.positioningGap.pricePositioning)],
                    ["Quality Positioning", safeText(report.competitiveAnalysis.positioningGap.qualityPositioning)],
                    ["Visibility", safeText(report.competitiveAnalysis.positioningGap.visibility)],
                    ["Differentiation", safeText(report.competitiveAnalysis.positioningGap.differentiation)],
                    ["Recommendation", safeText(report.competitiveAnalysis.positioningGap.recommendation)],
                ]);
            }

            /* =========================
               COST OPTIMIZATION
            ========================= */
            newSectionPage("COST OPTIMIZATION");
            renderListSection(
                doc,
                "Estimated Cost Structure",
                report.costOptimization?.estimatedCostStructure,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.category)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Monthly: ${safeText(item.monthly)}`);
                    doc.text(`Annual: ${safeText(item.annual)}`);
                    doc.text(`Percent of Total: ${safeText(item.percentOfTotal)}`);
                },
            );
            if (report.costOptimization?.revenueEstimate) {
                subTitle(doc, "Revenue Estimate");
                renderKeyValueBlock(doc, [
                    ["Estimated Range", safeText(report.costOptimization.revenueEstimate.estimatedRange)],
                    ["Revenue per Employee", safeText(report.costOptimization.revenueEstimate.revenuePerEmployee)],
                    ["Industry Benchmark", safeText(report.costOptimization.revenueEstimate.industryBenchmark)],
                    ["Gap Analysis", safeText(report.costOptimization.revenueEstimate.gapAnalysis)],
                ]);
            }
            renderListSection(
                doc,
                "Cost Saving Opportunities",
                report.costOptimization?.costSavingOpportunities,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.opportunity)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Current Cost: ${safeText(item.currentCost)}`);
                    doc.text(`Potential Savings: ${safeText(item.potentialSavings)}`);
                    doc.text(`Implementation Difficulty: ${safeText(item.implementationDifficulty)}`);
                    doc.text(`Details: ${safeText(item.details)}`);
                },
            );
            if (report.costOptimization?.pricingAnalysis) {
                subTitle(doc, "Pricing Analysis");
                renderKeyValueBlock(doc, [
                    ["Positioning", safeText(report.costOptimization.pricingAnalysis.positioning)],
                    ["Overall Recommendation", safeText(report.costOptimization.pricingAnalysis.overallRecommendation)],
                    ["Premium Tier Opportunity", safeText(report.costOptimization.pricingAnalysis.premiumTierOpportunity)],
                    ["Packaging Optimization", safeText(report.costOptimization.pricingAnalysis.packagingOptimization)],
                ]);
                renderListSection(
                    doc,
                    "Service Comparisons",
                    report.costOptimization.pricingAnalysis.serviceComparisons,
                    (item) => {
                        doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.service)}`);
                        doc.font("Helvetica").fontSize(11);
                        doc.text(`Your Price: ${safeText(item.yourPrice)}`);
                        doc.text(`Market Range: ${safeText(item.marketRange)}`);
                        doc.text(`Positioning: ${safeText(item.positioning)}`);
                        doc.text(`Recommendation: ${safeText(item.recommendation)}`);
                    },
                );
            }

            /* =========================
               TARGET MARKET
            ========================= */
            newSectionPage("TARGET MARKET");
            if (report.targetMarket?.currentClientProfile) {
                subTitle(doc, "Current Client Profile");
                renderKeyValueBlock(doc, [
                    ["US", safeText(report.targetMarket.currentClientProfile.geographicMix?.us)],
                    ["UK", safeText(report.targetMarket.currentClientProfile.geographicMix?.uk)],
                    ["Other", safeText(report.targetMarket.currentClientProfile.geographicMix?.other)],
                    ["Small Clients", safeText(report.targetMarket.currentClientProfile.clientSize?.small)],
                    ["Medium Clients", safeText(report.targetMarket.currentClientProfile.clientSize?.medium)],
                    ["Large Clients", safeText(report.targetMarket.currentClientProfile.clientSize?.large)],
                ]);
                renderListSection(
                    doc,
                    "Industry Concentration",
                    report.targetMarket.currentClientProfile.industries,
                    (item) => {
                        doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.industry)}`);
                        doc.font("Helvetica").fontSize(11).text(`Concentration: ${safeText(item.concentration)}`);
                    },
                );
            }
            if (report.targetMarket?.geographicExpansion) {
                subTitle(doc, "Geographic Expansion");
                bulletList(doc, report.targetMarket.geographicExpansion.currentStrongPresence ?? [], "No strong presence data.");
                renderListSection(
                    doc,
                    "Underpenetrated Markets",
                    report.targetMarket.geographicExpansion.underpenetratedMarkets,
                    (item) => {
                        doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.region)}`);
                        doc.font("Helvetica").fontSize(11);
                        doc.text(`Reason: ${safeText(item.reason)}`);
                        doc.text(`Estimated Opportunity: ${safeText(item.estimatedOpportunity)}`);
                        doc.text(`Entry Plan: ${safeText(item.entryPlan)}`);
                    },
                );
            }
            if (report.targetMarket?.idealClientProfile) {
                subTitle(doc, "Ideal Client Profile");
                renderKeyValueBlock(doc, [
                    ["Industry", safeText(report.targetMarket.idealClientProfile.industry)],
                    ["Company Size", safeText(report.targetMarket.idealClientProfile.companySize)],
                    ["Revenue Range", safeText(report.targetMarket.idealClientProfile.revenueRange)],
                    ["Budget", safeText(report.targetMarket.idealClientProfile.budget)],
                ]);
                bulletList(doc, report.targetMarket.idealClientProfile.painPoints ?? [], "No pain points provided.");
                bulletList(doc, report.targetMarket.idealClientProfile.decisionMakers ?? [], "No decision makers provided.");
                bulletList(doc, report.targetMarket.idealClientProfile.whereToFind ?? [], "No sourcing channels provided.");
            }

            /* =========================
               FINANCIAL IMPACT
            ========================= */
            newSectionPage("FINANCIAL IMPACT");
            renderListSection(
                doc,
                "Revenue Opportunities",
                report.financialImpact?.revenueOpportunities,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.opportunity)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Monthly Impact: ${safeText(item.monthlyImpact)}`);
                    doc.text(`Annual Impact: ${safeText(item.annualImpact)}`);
                    doc.text(`Confidence: ${safeText(item.confidence)}`);
                    doc.text(`Effort: ${safeText(item.effort)}`);
                },
            );
            renderListSection(
                doc,
                "Cost Savings",
                report.financialImpact?.costSavings,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.initiative)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Annual Savings: ${safeText(item.annualSavings)}`);
                    doc.text(`Implementation Cost: ${safeText(item.implementationCost)}`);
                    doc.text(`Net Savings: ${safeText(item.netSavings)}`);
                },
            );
            if (report.financialImpact?.netImpact) {
                subTitle(doc, "Net Impact");
                renderKeyValueBlock(doc, [
                    ["Revenue Growth", safeText(report.financialImpact.netImpact.revenueGrowth)],
                    ["Cost Savings", safeText(report.financialImpact.netImpact.costSavings)],
                    ["Total Impact", safeText(report.financialImpact.netImpact.totalImpact)],
                    ["Investment Needed", safeText(report.financialImpact.netImpact.investmentNeeded)],
                    ["Expected Return", safeText(report.financialImpact.netImpact.expectedReturn)],
                    ["ROI", safeText(report.financialImpact.netImpact.roi)],
                ]);
            }
            renderListSection(
                doc,
                "Scenarios",
                report.financialImpact?.scenarios,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.scenario)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Implementation Level: ${safeText(item.implementationLevel)}`);
                    doc.text(`Impact: ${safeText(item.impact)}`);
                },
            );

            /* =========================
               90-DAY ACTION PLAN
            ========================= */
            newSectionPage("90-DAY ACTION PLAN");
            const actionPlan = report.actionPlan90Days ?? [];
            if (!actionPlan.length) {
                doc.font("Helvetica").fontSize(11).fillColor("#111827").text("No action plan provided.");
            } else {
                actionPlan.forEach((phase, idx) => {
                    subTitle(doc, `${idx + 1}. ${safeText(phase.phase)}`);
                    phase.weeks?.forEach((week) => {
                        doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(week.week)}`);
                        bulletList(doc, week.tasks ?? [], "No tasks provided.");
                    });
                    if (phase.expectedImpact?.length) {
                        subTitle(doc, "Expected Impact");
                        phase.expectedImpact.forEach((impact) => {
                            doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(impact.metric)}`);
                            doc.font("Helvetica").fontSize(11).text(`Improvement: ${safeText(impact.improvement)}`);
                            doc.moveDown(0.2);
                        });
                    }
                });
            }

            /* =========================
               COMPETITIVE ADVANTAGES
            ========================= */
            newSectionPage("COMPETITIVE ADVANTAGES");
            renderListSection(
                doc,
                "Hidden Strengths",
                report.competitiveAdvantages?.hiddenStrengths,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.strength)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Evidence: ${safeText(item.evidence)}`);
                    doc.text(`Why It Matters: ${safeText(item.whyItMatters)}`);
                    doc.text(`How to Leverage: ${safeText(item.howToLeverage)}`);
                },
            );
            if (report.competitiveAdvantages?.prerequisites) {
                subTitle(doc, "Prerequisites");
                bulletList(doc, report.competitiveAdvantages.prerequisites ?? [], "No prerequisites provided.");
            }

            /* =========================
               RISK ASSESSMENT
            ========================= */
            newSectionPage("RISK ASSESSMENT");
            renderListSection(
                doc,
                "Risks",
                report.riskAssessment?.risks,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.name)} (${safeText(item.priority)})`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Description: ${safeText(item.description)}`);
                    doc.text(`Impact: ${safeText(item.impact)}`);
                    doc.text(`Likelihood: ${safeText(item.likelihood)}`);
                    doc.text(`Mitigation: ${(item.mitigation ?? []).join(", ") || "N/A"}`);
                    doc.text(`Timeline: ${safeText(item.timeline)}`);
                },
            );

            /* =========================
               APPENDICES
            ========================= */
            newSectionPage("APPENDICES");
            renderListSection(
                doc,
                "Keyword Tiers",
                report.appendices?.keywords,
                (tier) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(tier.tier)}`);
                    tier.keywords?.forEach((keyword) => {
                        doc.font("Helvetica").fontSize(11);
                        doc.text(
                            `${safeText(keyword.keyword)} | Searches: ${safeText(keyword.monthlySearches)} | Difficulty: ${safeText(
                                keyword.difficulty,
                            )} | Intent: ${safeText(keyword.intent)} | Rank: ${safeText(keyword.currentRank)}`,
                        );
                    });
                },
            );
            renderListSection(
                doc,
                "Review Templates",
                report.appendices?.reviewTemplates,
                (item) => {
                    doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.name)}`);
                    doc.font("Helvetica").fontSize(11);
                    doc.text(`Subject: ${safeText(item.subject)}`);
                    doc.text(`Body: ${safeText(item.body)}`);
                },
            );
            if (report.appendices?.caseStudyTemplate) {
                subTitle(doc, "Case Study Template");
                renderKeyValueBlock(doc, [
                    ["Title", safeText(report.appendices.caseStudyTemplate.title)],
                    ["Industry", safeText(report.appendices.caseStudyTemplate.industry)],
                    ["Services", safeText(report.appendices.caseStudyTemplate.services)],
                    ["Duration", safeText(report.appendices.caseStudyTemplate.duration)],
                    ["Budget", safeText(report.appendices.caseStudyTemplate.budget)],
                    ["Challenge", safeText(report.appendices.caseStudyTemplate.challenge)],
                    ["Solution", safeText(report.appendices.caseStudyTemplate.solution)],
                    ["Client Quote", safeText(report.appendices.caseStudyTemplate.clientQuote)],
                    ["CTA", safeText(report.appendices.caseStudyTemplate.cta)],
                ]);
                bulletList(doc, report.appendices.caseStudyTemplate.results ?? [], "No results provided.");
            }
            if (report.appendices?.finalRecommendations) {
                subTitle(doc, "Final Recommendations");
                renderListSection(
                    doc,
                    "Top Actions",
                    report.appendices.finalRecommendations.topActions,
                    (item) => {
                        doc.font("Helvetica-Bold").fontSize(11).text(`${safeText(item.action)}`);
                        doc.font("Helvetica").fontSize(11);
                        doc.text(`Impact: ${safeText(item.impact)}`);
                        doc.text(`Effort: ${safeText(item.effort)}`);
                        doc.text(`Rationale: ${safeText(item.rationale)}`);
                    },
                );
                bulletList(doc, report.appendices.finalRecommendations.nextSteps ?? [], "No next steps provided.");
            }

            drawFooter(doc, reportId);
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
