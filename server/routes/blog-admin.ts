// server/routes/blog-admin.ts
import type { RequestHandler } from "express";
import express from "express";
import { storage } from "../storage";

type StructuredBlogContentV1 = {
    version: 1;
    sections: Array<{
        id: string;
        type?: "content" | "process";
        heading?: string;
        subHeading?: string;
        content?: string;
        images?: string[];
        links?: Array<{ label?: string; url: string }>;
        steps?: Array<{ id: string; title?: string; description?: string; links?: Array<{ label?: string; url: string }> }>;
        cta?: {
            enabled?: boolean;
            heading?: string;
            description?: string;
            buttonText?: string;
            buttonLink?: string;
        };
    }>;
    tocOrder?: string[];
};

function safeJsonParse<T = any>(value: string): T | null {
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

function isProbablyJson(value: string) {
    const v = (value || "").trim();
    if (!v) return false;
    if (!(v.startsWith("{") || v.startsWith("["))) return false;
    return !!safeJsonParse(v);
}

function ensureId(prefix = "sec") {
    return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function stripHtml(html: string) {
    return (html || "")
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function markdownToStructuredV1(markdown: string): StructuredBlogContentV1 {
    const text = (markdown || "").trim();
    const lines = text.split(/\r?\n/);

    let titleFromH1 = "";
    const sections: StructuredBlogContentV1["sections"] = [];
    let current: any = null;

    const flush = () => {
        if (!current) return;
        const hasAny =
            (current.heading && current.heading.trim()) ||
            (current.subHeading && current.subHeading.trim()) ||
            (current.content && stripHtml(current.content).trim()) ||
            (Array.isArray(current.images) && current.images.length) ||
            (Array.isArray(current.steps) && current.steps.length);

        if (hasAny) sections.push(current);
        current = null;
    };

    for (const raw of lines) {
        const line = raw.trim();

        if (!line) {
            if (current?.content) current.content += "\n\n";
            continue;
        }

        if (/^#\s+/.test(line)) {
            titleFromH1 = line.replace(/^#\s+/, "").trim();
            continue;
        }

        if (/^##\s+/.test(line)) {
            flush();
            current = {
                id: ensureId("sec"),
                type: "content",
                heading: line.replace(/^##\s+/, "").trim(),
                subHeading: "",
                content: "",
                images: [],
                links: [],
                steps: [],
                cta: { enabled: false },
            };
            continue;
        }

        if (/^###\s+/.test(line)) {
            const h3 = line.replace(/^###\s+/, "").trim();
            if (!current) {
                current = {
                    id: ensureId("sec"),
                    type: "content",
                    heading: "",
                    subHeading: "",
                    content: "",
                    images: [],
                    links: [],
                    steps: [],
                    cta: { enabled: false },
                };
            }

            const isStepLike = /^(step\s*\d+|\d+[\).:-])\s*/i.test(h3);
            if (isStepLike) {
                current.type = "process";
                current.steps = Array.isArray(current.steps) ? current.steps : [];
                current.steps.push({ id: ensureId("step"), title: h3, description: "", links: [] });
            } else if (!current.subHeading) {
                current.subHeading = h3;
            } else {
                current.steps = Array.isArray(current.steps) ? current.steps : [];
                current.steps.push({ id: ensureId("step"), title: h3, description: "", links: [] });
            }
            continue;
        }

        // extract references links
        const mdLinkMatch = raw.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
        if (mdLinkMatch) {
            const label = mdLinkMatch[1]?.trim();
            const url = mdLinkMatch[2]?.trim();
            if (url) {
                if (!current) {
                    current = {
                        id: ensureId("sec"),
                        type: "content",
                        heading: titleFromH1 || "",
                        subHeading: "",
                        content: "",
                        images: [],
                        links: [],
                        steps: [],
                        cta: { enabled: false },
                    };
                }
                current.links = Array.isArray(current.links) ? current.links : [];
                current.links.push({ label, url });
            }
        } else {
            const bareUrlMatch = raw.match(/(https?:\/\/[^\s]+)/);
            if (bareUrlMatch?.[1]) {
                const url = bareUrlMatch[1].trim();
                if (!current) {
                    current = {
                        id: ensureId("sec"),
                        type: "content",
                        heading: titleFromH1 || "",
                        subHeading: "",
                        content: "",
                        images: [],
                        links: [],
                        steps: [],
                        cta: { enabled: false },
                    };
                }
                current.links = Array.isArray(current.links) ? current.links : [];
                current.links.push({ url });
            }
        }

        if (!current) {
            current = {
                id: ensureId("sec"),
                type: "content",
                heading: titleFromH1 || "Blog Content",
                subHeading: "",
                content: "",
                images: [],
                links: [],
                steps: [],
                cta: { enabled: false },
            };
        }

        const steps = Array.isArray(current.steps) ? current.steps : [];
        const lastStep = steps.length ? steps[steps.length - 1] : null;

        if (current.type === "process" && lastStep) {
            lastStep.description = (lastStep.description || "") + (lastStep.description ? "\n" : "") + raw;
        } else {
            current.content = (current.content || "") + (current.content ? "\n" : "") + raw;
        }
    }

    flush();

    if (!sections.length && text) {
        sections.push({
            id: ensureId("sec"),
            type: "content",
            heading: titleFromH1 || "Blog Content",
            subHeading: "",
            content: text,
            images: [],
            links: [],
            steps: [],
            cta: { enabled: false },
        });
    }

    const tocOrder: string[] = [];
    for (const s of sections) {
        tocOrder.push(s.id);
        const st = Array.isArray(s.steps) ? s.steps : [];
        for (const step of st) tocOrder.push(step.id);
    }

    return { version: 1, sections, tocOrder };
}

function normalizeContentToStoredString(content: any): string {
    // If admin already sends JSON object -> stringify
    if (content && typeof content === "object") {
        return JSON.stringify(content);
    }

    const c = String(content || "").trim();
    if (!c) return JSON.stringify({ version: 1, sections: [], tocOrder: [] });

    // If it's already valid builder JSON -> store as-is
    if (isProbablyJson(c)) {
        const parsed = safeJsonParse<any>(c);
        if (parsed?.version === 1 && Array.isArray(parsed.sections)) return c;
    }

    // Else it’s markdown/plain text => convert into builder JSON
    const structured = markdownToStructuredV1(c);
    return JSON.stringify(structured);
}

export function blogAdminRouter(authenticateAdmin: RequestHandler) {
    const router = express.Router();

    // Generate blogs (admin)
    router.post("/admin/generate-blogs", authenticateAdmin, async (req, res) => {
        try {
            const { count = 120 } = req.body;
            const { generateMonthlyBlogs } = await import("../blog-generator");

            generateMonthlyBlogs(count).catch((error) => {
                console.error("Blog generation failed:", error);
            });

            res.json({
                success: true,
                message: `Started generating ${count} blogs. Check server logs for progress.`,
            });
        } catch (error) {
            console.error("Error starting blog generation:", error);
            res.status(500).json({ message: "Failed to start blog generation" });
        }
    });

    // List all blog posts (admin)
    router.get("/admin/blog-posts", authenticateAdmin, async (_req, res) => {
        try {
            const blogPosts = await storage.getAllBlogPosts();
            res.json(blogPosts);
        } catch (error) {
            console.error("Error fetching blog posts:", error);
            res.status(500).json({ message: "Failed to fetch blog posts" });
        }
    });

    // Create blog post (admin)
    router.post("/admin/blog-posts", authenticateAdmin, async (req, res) => {
        try {
            const {
                slug,
                title,
                subtitle,
                excerpt,
                content,
                imageUrl,
                tags,
                author,
                readTime,
                isPublished,
                isFeatured,
                metaDescription,
                metaTitle,
            } = req.body;

            let processedTags: string[] = [];
            if (Array.isArray(tags)) processedTags = tags;
            else if (typeof tags === "string" && tags.trim()) {
                processedTags = tags
                    .split(",")
                    .map((t: string) => t.trim())
                    .filter((t: string) => t.length > 0);
            }

            const payload = {
                slug,
                title,
                subtitle,
                excerpt,
                // ✅ IMPORTANT: store builder JSON string (no model change)
                content: normalizeContentToStoredString(content),
                imageUrl,
                tags: processedTags,
                author,
                readTime: parseInt(readTime) || 5,
                isPublished: Boolean(isPublished),
                isFeatured: Boolean(isFeatured),
                metaDescription,
                metaTitle,
            };

            const blogPost = await storage.createBlogPost(payload as any);
            res.json(blogPost);
        } catch (error) {
            console.error("Error creating blog post:", error);
            res.status(500).json({ message: "Failed to create blog post" });
        }
    });

    // Update blog post (admin)
    router.put("/admin/blog-posts/:id", authenticateAdmin, async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            const {
                slug,
                title,
                subtitle,
                excerpt,
                content,
                imageUrl,
                tags,
                author,
                readTime,
                isPublished,
                isFeatured,
                metaDescription,
                metaTitle,
            } = req.body;

            let processedTags: string[] = [];
            if (Array.isArray(tags)) processedTags = tags;
            else if (typeof tags === "string" && tags.trim()) {
                processedTags = tags
                    .split(",")
                    .map((t: string) => t.trim())
                    .filter((t: string) => t.length > 0);
            }

            const updateData = {
                slug,
                title,
                subtitle,
                excerpt,
                // ✅ IMPORTANT: store builder JSON string (no model change)
                content: normalizeContentToStoredString(content),
                imageUrl,
                tags: processedTags,
                author,
                readTime: parseInt(readTime) || 5,
                isPublished: Boolean(isPublished),
                isFeatured: Boolean(isFeatured),
                metaDescription,
                metaTitle,
            };

            const blogPost = await storage.updateBlogPost(id, updateData as any);
            res.json(blogPost);
        } catch (error) {
            console.error("Error updating blog post:", error);
            res.status(500).json({
                message: "Failed to update blog post",
                error: (error as Error).message,
            });
        }
    });

    // Delete blog post (admin)
    router.delete("/admin/blog-posts/:id", authenticateAdmin, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await storage.deleteBlogPost(id);
            res.json({ success: true });
        } catch (error) {
            console.error("Error deleting blog post:", error);
            res.status(500).json({ message: "Failed to delete blog post" });
        }
    });

    // Get blog post by ID (admin)
    router.get("/admin/blog-posts/:id", authenticateAdmin, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const blogPost = await storage.getBlogPostById(id);

            if (!blogPost) return res.status(404).json({ message: "Blog post not found" });

            res.json(blogPost);
        } catch (error) {
            console.error("Error fetching blog post by ID:", error);
            res.status(500).json({ message: "Failed to fetch blog post" });
        }
    });

    router.post("/admin/generate-daily-blogs", authenticateAdmin, async (_req, res) => {
        try {
            const { scheduleDailyBlogGeneration } = await import("../blog-generator");

            scheduleDailyBlogGeneration().catch((error: any) => {
                console.error("Daily blog generation failed:", error);
            });

            res.json({
                success: true,
                message: "Started daily blog generation schedule (4 blogs/day for 30 days)",
            });
        } catch (error) {
            console.error("Error starting daily generation:", error);
            res.status(500).json({ message: "Failed to start daily generation" });
        }
    });

    // ✅ Generate a SINGLE blog (admin)
    router.post("/admin/generate-single-blog", authenticateAdmin, async (req, res) => {
        try {
            const { title, keywords = [], category, targetAudience } = req.body || {};

            if (!title || !String(title).trim()) {
                return res.status(400).json({ message: "title is required" });
            }

            const kw =
                Array.isArray(keywords)
                    ? keywords.map((k: any) => String(k).trim()).filter(Boolean)
                    : String(keywords || "")
                        .split(",")
                        .map((k) => k.trim())
                        .filter(Boolean);

            const { generateSingleBlog } = await import("../blog-generator");

            const blog = await generateSingleBlog({
                title: String(title).trim(),
                keywords: kw.length ? kw : [String(title).trim()],
                category: category ? String(category) : "Digital Marketing",
                targetAudience: targetAudience ? String(targetAudience) : "business owners",
            });

            // ✅ IMPORTANT:
            // We return it to the admin UI for "auto fill into fields".
            // Your UI will split it and populate builder fields.
            res.json({ success: true, blog });
        } catch (error) {
            console.error("Error generating single blog:", error);
            res.status(500).json({
                message: "Failed to generate blog",
                error: (error as Error).message,
            });
        }
    });


    return router;
}
