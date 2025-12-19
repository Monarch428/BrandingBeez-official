import { openai } from "./openai";
import { storage } from "./storage";

interface BlogTopic {
  title: string;
  slug: string;
  category: string;
  keywords: string[];
  targetAudience: string;
}

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

function ensureId(prefix = "sec") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

// Predefined blog topics for digital marketing agency
const blogTopics: BlogTopic[] = [
  { title: "Local SEO Best Practices for Small Businesses in 2025", slug: "local-seo-best-practices-2025", category: "SEO", keywords: ["local SEO", "small business", "Google My Business"], targetAudience: "small business owners" },
  { title: "Technical SEO Audit Checklist: 50 Points Every Website Needs", slug: "technical-seo-audit-checklist-2025", category: "SEO", keywords: ["technical SEO", "audit", "website optimization"], targetAudience: "website owners" },
  { title: "Voice Search Optimization: Preparing for the Future", slug: "voice-search-optimization-guide", category: "SEO", keywords: ["voice search", "SEO", "Alexa", "Google Assistant"], targetAudience: "digital marketers" },

  { title: "Google Ads Budget Optimization: Maximize ROI in 2025", slug: "google-ads-budget-optimization-2025", category: "Google Ads", keywords: ["Google Ads", "PPC", "budget optimization", "ROI"], targetAudience: "business owners" },
  { title: "Shopping Ads vs Search Ads: Which Converts Better?", slug: "shopping-ads-vs-search-ads-comparison", category: "Google Ads", keywords: ["Shopping Ads", "Search Ads", "conversion"], targetAudience: "e-commerce businesses" },
  { title: "Google Ads Quality Score: Complete Optimization Guide", slug: "google-ads-quality-score-optimization", category: "Google Ads", keywords: ["Quality Score", "Google Ads", "optimization"], targetAudience: "PPC managers" },

  { title: "Website Speed Optimization: Core Web Vitals Guide", slug: "website-speed-optimization-core-web-vitals", category: "Web Development", keywords: ["website speed", "Core Web Vitals", "performance"], targetAudience: "website developers" },
  { title: "Mobile-First Design: Best Practices for 2025", slug: "mobile-first-design-best-practices-2025", category: "Web Development", keywords: ["mobile-first", "responsive design", "UX"], targetAudience: "web designers" },
  { title: "E-commerce Website Conversion Optimization", slug: "ecommerce-conversion-optimization-guide", category: "Web Development", keywords: ["e-commerce", "conversion", "CRO"], targetAudience: "e-commerce owners" },

  { title: "AI Chatbots for Customer Service: Implementation Guide", slug: "ai-chatbots-customer-service-guide", category: "AI & Technology", keywords: ["AI chatbots", "customer service", "automation"], targetAudience: "business owners" },
  { title: "Marketing Automation Workflows That Convert", slug: "marketing-automation-workflows-guide", category: "AI & Technology", keywords: ["marketing automation", "workflows", "email marketing"], targetAudience: "marketing managers" },
  { title: "AI Content Generation: Tools and Best Practices", slug: "ai-content-generation-tools-guide", category: "AI & Technology", keywords: ["AI content", "content generation", "copywriting"], targetAudience: "content creators" },

  { title: "Healthcare Digital Marketing: Compliance and Strategy", slug: "healthcare-digital-marketing-compliance", category: "Industry Marketing", keywords: ["healthcare marketing", "HIPAA", "medical SEO"], targetAudience: "healthcare providers" },
  { title: "Real Estate Lead Generation: Digital Marketing Tactics", slug: "real-estate-lead-generation-tactics", category: "Industry Marketing", keywords: ["real estate marketing", "lead generation", "property marketing"], targetAudience: "real estate agents" },
  { title: "Restaurant Marketing: From Local to Viral", slug: "restaurant-marketing-local-to-viral", category: "Industry Marketing", keywords: ["restaurant marketing", "local business", "food marketing"], targetAudience: "restaurant owners" },

  { title: "Small Business Digital Transformation in 2025", slug: "small-business-digital-transformation-2025", category: "Business Growth", keywords: ["digital transformation", "small business", "technology"], targetAudience: "business owners" },
  { title: "Customer Retention Strategies for Digital Businesses", slug: "customer-retention-strategies-digital", category: "Business Growth", keywords: ["customer retention", "loyalty", "digital business"], targetAudience: "business managers" },
  { title: "Scaling Your Agency: From Solo to Team", slug: "scaling-agency-solo-to-team", category: "Business Growth", keywords: ["agency growth", "scaling", "team building"], targetAudience: "agency owners" }
];

export async function generateBlogContent(topic: BlogTopic): Promise<{
  title: string;
  content: string; // ✅ will store JSON string
  excerpt: string;
  metaDescription: string;
  tags: string[];
}> {
  const prompt = `
You are writing a high-quality blog post for BrandingBeez.

Topic: "${topic.title}"
Target Audience: ${topic.targetAudience}
Category: ${topic.category}
Keywords: ${topic.keywords.join(", ")}

IMPORTANT OUTPUT FORMAT:
Return VALID JSON with:
{
  "title": string,
  "excerpt": string (150-180 chars),
  "metaDescription": string (150-180 chars),
  "tags": string[],
  "contentStructured": {
    "version": 1,
    "sections": [
      {
        "id": "sec_...",
        "type": "content" | "process",
        "heading": "string",
        "subHeading": "string",
        "content": "string (markdown allowed)",
        "images": ["url1","url2"],
        "links": [{"label":"string","url":"https://..."}],
        "steps": [{"id":"step_...","title":"string","description":"string","links":[{"label":"string","url":"https://..."}]}],
        "cta": {"enabled": true|false, "heading":"string","description":"string","buttonText":"string","buttonLink":"string"}
      }
    ],
    "tocOrder": ["sec_id_1","step_id_1","sec_id_2"]
  }
}

RULES:
- Use multiple sections (at least 6 sections).
- Include at least one "process" section with 4-7 steps (Step 1, Step 2...).
- Each section MUST have a heading.
- Add "links" arrays ONLY when relevant (credible references or tools). Minimum 2 reference links across the full article.
- CTA should be OPTIONAL, but include a final CTA section with BrandingBeez mention.
- Do NOT include raw HTML. Markdown is OK in "content".
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert content writer for BrandingBeez. Return only valid JSON as requested. No extra commentary.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    const structured: StructuredBlogContentV1 =
      result.contentStructured && result.contentStructured.version === 1
        ? result.contentStructured
        : {
          version: 1,
          sections: [],
          tocOrder: [],
        };

    // Ensure ids exist (safety)
    structured.sections = (structured.sections || []).map((s: any) => ({
      id: s?.id || ensureId("sec"),
      type: s?.type || "content",
      heading: s?.heading || "",
      subHeading: s?.subHeading || "",
      content: s?.content || "",
      images: Array.isArray(s?.images) ? s.images : [],
      links: Array.isArray(s?.links) ? s.links : [],
      steps: Array.isArray(s?.steps)
        ? s.steps.map((st: any) => ({
          id: st?.id || ensureId("step"),
          title: st?.title || "",
          description: st?.description || "",
          links: Array.isArray(st?.links) ? st.links : [],
        }))
        : [],
      cta: s?.cta || { enabled: false },
    }));

    // default tocOrder if missing
    if (!Array.isArray(structured.tocOrder) || structured.tocOrder.length === 0) {
      const toc: string[] = [];
      for (const sec of structured.sections) {
        toc.push(sec.id);
        for (const st of sec.steps || []) toc.push(st.id);
      }
      structured.tocOrder = toc;
    }

    return {
      title: result.title || topic.title,
      content: JSON.stringify(structured), // ✅ store as JSON string in DB
      excerpt: result.excerpt || "",
      metaDescription: result.metaDescription || "",
      tags: Array.isArray(result.tags) ? result.tags : topic.keywords,
    };
  } catch (error) {
    console.error("Error generating blog content:", error);
    throw new Error("Failed to generate blog content");
  }
}

// Single blog generation with custom topic and keywords
export async function generateSingleBlog(customTopic: {
  title: string;
  keywords: string[];
  category?: string;
  targetAudience?: string;
}): Promise<{
  title: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  tags: string[];
  slug: string;
}> {
  console.log(`Generating single blog: ${customTopic.title}`);

  const slug = customTopic.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const topic: BlogTopic = {
    title: customTopic.title,
    slug,
    category: customTopic.category || "Digital Marketing",
    keywords: customTopic.keywords,
    targetAudience: customTopic.targetAudience || "business owners",
  };

  try {
    const blogContent = await generateBlogContent(topic);
    return { ...blogContent, slug };
  } catch (error) {
    console.error("Error generating single blog:", error);
    throw new Error("Failed to generate blog content");
  }
}

export async function generateMonthlyBlogs(count: number = 120): Promise<void> {
  console.log(`Starting generation of ${count} blog posts...`);

  const expandedTopics: BlogTopic[] = [];

  const variations = [
    "2025 Guide",
    "Complete Guide",
    "Best Practices",
    "Expert Tips",
    "Case Study",
    "Step-by-Step Guide",
    "Advanced Strategies",
    "Beginner's Guide",
    "Industry Trends",
    "Success Stories",
  ];

  for (let i = 0; i < Math.ceil(count / blogTopics.length); i++) {
    blogTopics.forEach((topic) => {
      if (expandedTopics.length < count) {
        const variation = variations[i % variations.length];
        const newTopic = {
          ...topic,
          title: i === 0 ? topic.title : `${topic.title.split(":")[0]}: ${variation}`,
          slug: i === 0 ? topic.slug : `${topic.slug}-${variation.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        };
        expandedTopics.push(newTopic);
      }
    });
  }

  let successful = 0;
  let failed = 0;

  for (const topic of expandedTopics.slice(0, count)) {
    try {
      console.log(`Generating blog: ${topic.title}`);

      const existingPost = await storage.getBlogPost(topic.slug);
      if (existingPost) {
        console.log(`Blog already exists: ${topic.slug}, skipping...`);
        continue;
      }

      const blogContent = await generateBlogContent(topic);

      await storage.createBlogPost({
        slug: topic.slug,
        title: blogContent.title,
        excerpt: blogContent.excerpt,
        content: blogContent.content, // ✅ JSON string builder format
        author: "BrandingBeez Team",
        readTime: Math.ceil(blogContent.content.length / 1200) || 5,
        isPublished: true,
        isFeatured: false,
        metaDescription: blogContent.metaDescription,
        tags: blogContent.tags,
        imageUrl: getDefaultImageForCategory(topic.category),
      } as any);

      successful++;
      console.log(`✅ Successfully created blog: ${topic.title}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      failed++;
      console.error(`❌ Failed to create blog: ${topic.title}`, error);
    }
  }

  console.log(`\n📊 Blog generation completed:`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total: ${successful + failed}`);
}

function getDefaultImageForCategory(category: string): string {
  const imageMap: { [key: string]: string } = {
    SEO: "/ai-software-development.webp",
    "Google Ads": "/seo-ppc-blog.webp",
    "Web Development": "/enhanced-operational-efficiency.webp",
    "AI & Technology": "/ai-software-development.webp",
    "Industry Marketing": "/industry-digital-marketing.png",
    "Business Growth": "/enhanced-operational-efficiency.webp",
  };

  return imageMap[category] || "/ai-software-development.webp";
}

// Function to generate daily blogs (4 per day for 30 days = 120)
export async function scheduleDailyBlogGeneration(): Promise<void> {
  const blogsPerDay = 4;
  const daysInMonth = 30;

  console.log("🚀 Starting scheduled daily blog generation...");

  for (let day = 1; day <= daysInMonth; day++) {
    console.log(`\n📅 Day ${day} - Generating ${blogsPerDay} blogs...`);

    const startIndex = (day - 1) * blogsPerDay;
    const endIndex = startIndex + blogsPerDay;

    const topicsForToday = blogTopics.slice(startIndex, endIndex);

    for (const topic of topicsForToday) {
      try {
        const blogContent = await generateBlogContent(topic);

        await storage.createBlogPost({
          slug: `${topic.slug}-day${day}`,
          title: blogContent.title,
          excerpt: blogContent.excerpt,
          content: blogContent.content, // ✅ JSON string builder format
          author: "BrandingBeez Team",
          readTime: Math.ceil(blogContent.content.length / 1200) || 5,
          isPublished: true,
          isFeatured: day <= 5,
          metaDescription: blogContent.metaDescription,
          tags: blogContent.tags,
          imageUrl: getDefaultImageForCategory(topic.category),
        } as any);

        console.log(`✅ Created: ${blogContent.title}`);
      } catch (error) {
        console.error(`❌ Failed to create blog for day ${day}:`, error);
      }
    }

    console.log(`📝 Day ${day} complete. Blogs created: ${blogsPerDay}`);
  }

  console.log("\n🎉 Monthly blog generation completed! 120 blogs created.");
}
