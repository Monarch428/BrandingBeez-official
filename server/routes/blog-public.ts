// server/routes/blog-public.ts
import type { RequestHandler } from "express";
import express from "express";
import { storage } from "../storage";
import { connectToDatabase, getMongooseConnection } from "../db";

/**
 * Blog Content Builder V1 (stored as JSON string in BlogPost.content)
 */
type StructuredBlogContentV1 = {
  version: 1;
  sections: Array<{
    id: string;
    type?: "content" | "process";
    heading?: string;
    subHeading?: string;
    content?: string; // allow html/markdown text
    images?: string[]; // single or multiple
    links?: Array<{ label?: string; url: string }>; // ✅ NEW: hyperlinks per section
    steps?: Array<{
      id: string;
      title?: string;
      description?: string;
      links?: Array<{ label?: string; url: string }>; // optional refs inside steps too
    }>;
    cta?: {
      enabled?: boolean;
      heading?: string;
      description?: string;
      buttonText?: string;
      buttonLink?: string;
    };
  }>;
  // ✅ NEW: draggable TOC order (list of section ids / step ids)
  tocOrder?: string[];
};

function safeJsonParse<T = any>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function stripHtml(html: string) {
  return (html || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isProbablyJson(value: string) {
  const v = (value || "").trim();
  if (!v) return false;
  if (!(v.startsWith("{") || v.startsWith("["))) return false;
  return !!safeJsonParse(v);
}

function slugifyAnchor(input: string) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ensureId(prefix = "sec") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

/**
 * ✅ Fallback: Convert “generated markdown like # .. ## .. ### ..” into V1 sections
 * This keeps your old posts compatible and also fixes the “single blob” problem.
 */
function markdownToStructuredV1(markdown: string): StructuredBlogContentV1 {
  const text = (markdown || "").trim();
  const lines = text.split(/\r?\n/);

  let titleFromH1 = "";
  const sections: StructuredBlogContentV1["sections"] = [];

  // Parser: treat "## " as section heading, "### " as subHeading/step, everything else as content
  let current: any = null;

  const flush = () => {
    if (!current) return;
    // cleanup empty
    const hasAny =
      (current.heading && current.heading.trim()) ||
      (current.subHeading && current.subHeading.trim()) ||
      (current.content && stripHtml(current.content).trim()) ||
      (Array.isArray(current.images) && current.images.length) ||
      (Array.isArray(current.steps) && current.steps.length);

    if (hasAny) {
      sections.push(current);
    }
    current = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      // keep paragraph spacing
      if (current?.content) current.content += "\n\n";
      continue;
    }

    // H1
    if (/^#\s+/.test(line)) {
      titleFromH1 = line.replace(/^#\s+/, "").trim();
      continue;
    }

    // H2 => new section
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

    // H3 => treat as subHeading OR process step depending on content style
    if (/^###\s+/.test(line)) {
      const h3 = line.replace(/^###\s+/, "").trim();
      if (!current) {
        // create section if missing
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

      // If h3 looks like “1.” / “Step 1” / “Actionable Tips” etc we can store as steps only if current is process
      // For simplicity: store first h3 as subHeading; subsequent h3 become steps if we detect numbered style
      const isStepLike = /^(step\s*\d+|\d+[\).:-])\s*/i.test(h3);

      if (isStepLike) {
        current.type = "process";
        current.steps = Array.isArray(current.steps) ? current.steps : [];
        current.steps.push({
          id: ensureId("step"),
          title: h3,
          description: "",
          links: [],
        });
      } else if (!current.subHeading) {
        current.subHeading = h3;
      } else {
        // if already has subHeading, treat as a step heading anyway
        current.type = current.type || "content";
        current.steps = Array.isArray(current.steps) ? current.steps : [];
        current.steps.push({
          id: ensureId("step"),
          title: h3,
          description: "",
          links: [],
        });
      }
      continue;
    }

    // CTA detection (simple): "## Call to Action" or line starts with "Call to Action"
    if (/^call to action[:]?/i.test(line)) {
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
          cta: { enabled: true },
        };
      }
      current.cta = current.cta || {};
      current.cta.enabled = true;
      current.cta.heading = "Call to Action";
      continue;
    }

    // Link detection inside markdown: [label](url) OR bare http(s)://...
    // We keep the text in content AND add a clean refs list so UI can show "References" nicely.
    const mdLinkMatch = raw.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
    if (mdLinkMatch) {
      const label = mdLinkMatch[1]?.trim();
      const url = mdLinkMatch[2]?.trim();
      if (url) {
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
            heading: "",
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

    // Add line to content or latest step description if we are in process with steps
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

    const steps = Array.isArray(current.steps) ? current.steps : [];
    const lastStep = steps.length ? steps[steps.length - 1] : null;

    if (current.type === "process" && lastStep) {
      lastStep.description = (lastStep.description || "") + (lastStep.description ? "\n" : "") + raw;
    } else {
      current.content = (current.content || "") + (current.content ? "\n" : "") + raw;
    }
  }

  flush();

  // If still empty, make one section
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

  // default toc order = section ids + step ids (stable)
  const tocOrder: string[] = [];
  for (const s of sections) {
    tocOrder.push(s.id);
    const st = Array.isArray(s.steps) ? s.steps : [];
    for (const step of st) tocOrder.push(step.id);
  }

  return { version: 1, sections, tocOrder };
}

function deriveExcerptFromContent(content: string, maxLen = 180): string {
  if (!content) return "";

  if (isProbablyJson(content)) {
    const parsed = safeJsonParse<StructuredBlogContentV1>(content);
    if (parsed?.version === 1 && Array.isArray(parsed.sections)) {
      for (const sec of parsed.sections) {
        const c = (sec?.content || "").trim();
        if (c) {
          const text = stripHtml(c);
          if (text) return text.length > maxLen ? text.slice(0, maxLen).trim() + "…" : text;
        }
        const steps = Array.isArray(sec?.steps) ? sec.steps : [];
        for (const st of steps) {
          const d = (st?.description || "").trim();
          if (d) {
            const text = stripHtml(d);
            if (text) return text.length > maxLen ? text.slice(0, maxLen).trim() + "…" : text;
          }
        }
      }
    }
  }

  const text = stripHtml(content);
  if (!text) return "";
  return text.length > maxLen ? text.slice(0, maxLen).trim() + "…" : text;
}

function normalizeTags(tags: any): string[] {
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (typeof tags === "string" && tags.trim()) {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }
  return [];
}

/**
 * ✅ Always return a "contentStructured" in API response (frontend uses it for perfect UI)
 * - If DB has JSON => parse it
 * - Else => derive from markdown
 */
function getStructured(content: string): StructuredBlogContentV1 {
  if (isProbablyJson(content)) {
    const parsed = safeJsonParse<StructuredBlogContentV1>(content);
    if (parsed?.version === 1 && Array.isArray(parsed.sections)) return parsed;
  }
  return markdownToStructuredV1(content || "");
}

export function blogPublicRouter(publicContentRateLimit: RequestHandler) {
  const router = express.Router();

  // Public blog list
  router.get("/blog", publicContentRateLimit, async (req, res) => {
    try {
      console.log("\n=== BLOG API DEBUG START ===");
      console.log("🚀 Blog API endpoint called - Environment:", process.env.NODE_ENV || "development");
      console.log(
        "📊 Database connection status:",
        process.env.MONGODB_URI || process.env.MONGODB_URI_DEVELOPMENT ? "URL Present" : "URL Missing",
      );
      console.log("🌐 Request origin:", req.get("origin") || "No origin header");
      console.log("🔗 Request URL:", req.url);
      console.log("🔗 Request method:", req.method);

      await connectToDatabase();
      const connection = getMongooseConnection();
      const database = connection.db;
      if (!database) throw new Error("Database connection not initialized");
      await database.admin().command({ ping: 1 });

      const blogPosts = await storage.getPublishedBlogPosts();

      if (blogPosts.length === 0) {
        console.log("⚠️ No published blog posts found - checking all posts...");
        const allPosts = await storage.getAllBlogPosts();
        console.log(`📊 Total posts in database: ${allPosts.length}`);
      }

      const formatted = blogPosts.map((post: any) => {
        const formattedTags = normalizeTags(post.tags);

        const excerpt =
          post.excerpt?.trim() ||
          deriveExcerptFromContent(post.content || "") ||
          post.title ||
          "No excerpt available";

        return {
          ...post,
          tags: formattedTags,
          imageUrl: post.imageUrl || "/images/Industry-Specific_Digital_Marketing_1.png",
          excerpt,
          // ✅ lightweight structured for list UI (optional)
          contentStructured: undefined,
        };
      });

      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Access-Control-Allow-Origin", "*");

      console.log(`✅ Returning ${formatted.length} blog posts`);
      console.log("=== BLOG API DEBUG END ===\n");

      res.json(formatted);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Public featured posts
  router.get("/blog/featured", publicContentRateLimit, async (_req, res) => {
    try {
      const featuredPosts = await storage.getFeaturedBlogPosts();

      const formatted = featuredPosts.map((post: any) => {
        const formattedTags = normalizeTags(post.tags);
        const excerpt =
          post.excerpt?.trim() ||
          deriveExcerptFromContent(post.content || "") ||
          post.title ||
          "No excerpt available";

        return {
          ...post,
          tags: formattedTags,
          imageUrl: post.imageUrl || "/images/Industry-Specific_Digital_Marketing_1.png",
          excerpt,
          contentStructured: undefined,
        };
      });

      res.json(formatted);
    } catch (error) {
      console.error("Error fetching featured blog posts:", error);
      res.status(500).json({ message: "Failed to fetch featured blog posts" });
    }
  });

  // Public detail by slug
  router.get("/blog/:slug", publicContentRateLimit, async (req, res) => {
    try {
      const slug = req.params.slug;
      const blogPost = await storage.getBlogPost(slug);

      if (!blogPost) return res.status(404).json({ message: "Blog post not found" });

      const formattedTags = normalizeTags((blogPost as any).tags);
      const excerpt =
        (blogPost as any).excerpt?.trim() ||
        deriveExcerptFromContent((blogPost as any).content || "") ||
        (blogPost as any).title ||
        "No excerpt available";

      const structured = getStructured((blogPost as any).content || "");

      res.json({
        ...blogPost,
        tags: formattedTags,
        imageUrl: (blogPost as any).imageUrl || "/images/Industry-Specific_Digital_Marketing_1.png",
        excerpt,
        // ✅ NEW: frontend uses this to render perfect UI (TOC + sections + process + links + CTA)
        contentStructured: structured,
      });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  return router;
}
