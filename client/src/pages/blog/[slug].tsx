// import React, { useMemo } from "react";
// import { useLocation } from "wouter";
// import { useQuery } from "@tanstack/react-query";
// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Helmet } from "react-helmet";
// import { BookCallButtonWithModal } from "@/components/book-appoinment";

// interface BlogPost {
//   id: number;
//   slug: string;
//   title: string;
//   subtitle?: string;
//   excerpt?: string;
//   content: string;
//   imageUrl?: string;
//   tags?: string[];
//   author?: string;
//   readTime?: number;
//   isPublished?: boolean;
//   isFeatured?: boolean;
//   metaDescription?: string;
//   metaTitle?: string;
//   createdAt: string;
//   updatedAt: string;
//   publishedAt?: string;
//   category?: string;
// }

// // Loading component
// const PageLoader = () => (
//   <div className="min-h-screen bg-white">
//     <Header />
//     <div className="flex items-center justify-center py-20">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
//         <p className="text-lg font-semibold">Loading Article...</p>
//         <p className="text-sm text-gray-500 mt-2">
//           Please wait while we load the blog post
//         </p>
//       </div>
//     </div>
//     <Footer />
//   </div>
// );

// export default function DynamicBlogPost() {
//   const [location] = useLocation();
//   const slug = location.replace(/^\/blog\/?/, "").split("?")[0];

//   const {
//     data: blogPost,
//     isLoading,
//     isError,
//     error,
//   } = useQuery<BlogPost | null>({
//     queryKey: ["blog-post", slug],
//     enabled: !!slug,
//     queryFn: async () => {
//       if (!slug) {
//         throw new Error("Missing blog slug");
//       }

//       const res = await fetch(`/api/blog/${slug}`, {
//         headers: { "Content-Type": "application/json" },
//         cache: "no-store",
//       });

//       if (res.status === 404) {
//         return null;
//       }

//       if (!res.ok) {
//         const message = await res.text();
//         throw new Error(
//           message || `Failed to load article (status ${res.status})`,
//         );
//       }

//       const data = await res.json();
//       return data as BlogPost;
//     },
//     retry: 1,
//     staleTime: 1000 * 60 * 10,
//   });

//   const htmlContent = useMemo(() => {
//     const rawContent = blogPost?.content?.trim();
//     if (!rawContent) return "";

//     // If the content already contains HTML tags, trust it and return as-is
//     const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(rawContent);
//     if (hasHtmlTags) return rawContent;

//     // Normalize newlines
//     let normalized = rawContent.replace(/\r\n/g, "\n");

//     // 1) Turn any occurrence of heading markers (inline or at line start)
//     //    into paragraph breaks so heading text becomes its own paragraph.
//     //    e.g. "Success ## Introduction" -> "Success\n\nIntroduction"
//     normalized = normalized.replace(/#{1,6}\s*/g, "\n\n");

//     // 2) Remove any remaining leading # (defensive) at the start of lines
//     normalized = normalized.replace(/^\s*#{1,6}\s*/gm, "");

//     // Split into paragraphs on one-or-more blank lines
//     const paragraphs = normalized
//       .split(/\n\s*\n+/)
//       .map((p) => p.trim())
//       .filter(Boolean)
//       .map((p) => {
//         // Preserve single line breaks inside a paragraph as <br/>
//         const withLineBreaks = p.replace(/\n/g, "<br/>");

//         // Inline formatting: bold and italic
//         const withFormatting = withLineBreaks
//           .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
//           .replace(/\*(.*?)\*/g, "<em>$1</em>");

//         return `<p>${withFormatting}</p>`;
//       })
//       .join("");

//     return paragraphs;
//   }, [blogPost?.content]);

//   const publishDate = blogPost?.publishedAt || blogPost?.createdAt;
//   const formattedPublishDate = publishDate
//     ? new Date(publishDate).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//     : "Recent";
//   const author = blogPost?.author || "BrandingBeez Team";
//   const readTime = blogPost?.readTime || 5;

//   // ✅ Resolve relative / absolute URLs into a proper absolute URL (Safari friendly)
//   const resolvedImageUrl = useMemo(() => {
//     if (!blogPost?.imageUrl) return undefined;

//     const raw = blogPost.imageUrl.trim();

//     // Already absolute (Cloudinary etc.)
//     if (/^https?:\/\//i.test(raw)) {
//       return raw;
//     }

//     try {
//       // Handles "/images/foo.png" or "images/foo.png"
//       return new URL(raw, window.location.origin).toString();
//     } catch {
//       return raw;
//     }
//   }, [blogPost?.imageUrl]);

//   if (isLoading) return <PageLoader />;

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-white">
//         <Header />
//         <div className="max-w-4xl mx-auto px-4 py-16 text-center">
//           <div className="text-4xl mb-4">⚠️</div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Unable to load blog post
//           </h1>
//           <p className="text-xl text-gray-600 mb-8">
//             {(error as Error)?.message || "Please try again later."}
//           </p>
//           <Button onClick={() => window.location.reload()}>Retry</Button>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (!blogPost) {
//     return (
//       <div className="min-h-screen bg-white">
//         <Header />
//         <div className="max-w-4xl mx-auto px-4 py-16 text-center">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Blog Post Not Found
//           </h1>
//           <p className="text-xl text-gray-600 mb-8">
//             The blog post you're looking for doesn't exist or has been moved.
//           </p>
//           <Button onClick={() => (window.location.href = "/blog")}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Blog
//           </Button>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // Share article
//   const shareArticle = () => {
//     if (navigator.share) {
//       navigator.share({ title: blogPost.title, url: window.location.href });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert("Article link copied to clipboard!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* SEO */}
//       <Helmet>
//         <title>
//           {blogPost.metaTitle || `${blogPost.title} | BrandingBeez`}
//         </title>
//         <meta
//           name="description"
//           content={blogPost.metaDescription || blogPost.excerpt || ""}
//         />
//         <meta
//           name="keywords"
//           content={
//             Array.isArray(blogPost.tags) ? blogPost.tags.join(", ") : ""
//           }
//         />
//         <meta
//           property="og:title"
//           content={blogPost.metaTitle || blogPost.title}
//         />
//         <meta
//           property="og:description"
//           content={blogPost.metaDescription || blogPost.excerpt || ""}
//         />
//         <meta
//           property="og:image"
//           content={resolvedImageUrl || "/api/placeholder/800/600"}
//         />
//         <meta property="article:author" content={author} />
//         <meta property="article:published_time" content={publishDate} />
//       </Helmet>

//       <Header />

//       {/* Article Header */}
//       <section className="py-8 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
//         <div className="max-w-4xl mx-auto">
//           <Button
//             onClick={() => (window.location.href = "/blog")}
//             variant="ghost"
//             className="text-white hover:bg-white/20 mb-6 bg-transparent"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Blog
//           </Button>

//           <h1 className="text-4xl md:text-5xl font-bold mb-6">
//             {blogPost.title}
//           </h1>
//           {blogPost.subtitle && (
//             <h2 className="text-xl md:text-2xl text-white/90 mb-6">
//               {blogPost.subtitle}
//             </h2>
//           )}

//           <div className="flex flex-wrap items-center gap-6 text-white/90 mb-6">
//             <div className="flex items-center">
//               <User className="w-4 h-4 mr-2" />
//               {author}
//             </div>
//             <div className="flex items-center">
//               <Calendar className="w-4 h-4 mr-2" />
//               {formattedPublishDate}
//             </div>
//             <div className="flex items-center">
//               <Clock className="w-4 h-4 mr-2" />
//               {readTime} min read
//             </div>
//           </div>

//           <Button
//             onClick={shareArticle}
//             variant="outline"
//             className="border-white text-white hover:bg-white hover:text-brand-purple bg-transparent"
//           >
//             <Share2 className="w-4 h-4 mr-2" />
//             Share Article
//           </Button>
//         </div>
//       </section>

//       {/* Article Content */}
//       <article className="py-16 px-4">
//         <div className="max-w-4xl mx-auto">
//           {resolvedImageUrl && (
//             <div className="mb-12">
//               <img
//                 src={resolvedImageUrl}
//                 alt={blogPost.title}
//                 className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
//                 // Safari sometimes behaves better without lazy for key hero image
//                 loading="eager"
//                 onError={(e) => {
//                   console.warn(
//                     "❌ Blog hero image failed to load:",
//                     resolvedImageUrl,
//                   );
//                   e.currentTarget.onerror = null;
//                   e.currentTarget.src = "/images/blog-fallback.png"; // make sure this exists in /public/images
//                 }}
//               />
//             </div>
//           )}

//           {blogPost.excerpt && (
//             <div className="mb-8 p-6 bg-blue-50 border-l-4 border-brand-coral rounded-r-lg">
//               <h3 className="font-semibold text-brand-purple mb-2">
//                 Article Summary:
//               </h3>
//               <p className="text-gray-700 text-lg leading-relaxed">
//                 {blogPost.excerpt}
//               </p>
//             </div>
//           )}

//           {Array.isArray(blogPost.tags) && blogPost.tags.length > 0 && (
//             <div className="mb-8">
//               <h3 className="font-semibold mb-3 text-brand-purple">
//                 Topics Covered:
//               </h3>
//               <div className="flex gap-2 flex-wrap">
//                 {blogPost.tags.map((tag, index) => (
//                   <Badge
//                     key={index}
//                     variant="outline"
//                     className="text-brand-coral border-brand-coral"
//                   >
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div
//             className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-justify"
//             style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: "18px" }}
//             dangerouslySetInnerHTML={{
//               __html: htmlContent,
//             }}
//           />

//           <div className="mt-16 p-8 bg-gradient-to-r from-brand-purple to-brand-coral rounded-2xl text-white text-center">
//             <h2 className="text-2xl font-bold mb-4">
//               Ready to Get Started?
//             </h2>
//             <p className="text-lg mb-6 opacity-90">
//               Contact our expert team to discuss how we can help grow your
//               business with proven digital marketing strategies.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <BookCallButtonWithModal
//                 buttonLabel="Get Free Consultation"
//                 className="bg-white text-brand-purple hover:bg-gray-100"
//                 buttonSize="lg"
//               // defaultServiceType="Website Development"
//               />
//               <p className="text-lg">
//                 📞 Call us at{" "}
//                 <a href="tel:+917871990263" className="text-white underline font-semibold">
//                   +91 78719 90263
//                 </a>
//               </p>
//             </div>

//           </div>
//         </div>
//       </article>
//       <Footer />
//     </div>
//   );
// }





import React, { useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Share2, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { BookCallButtonWithModal } from "@/components/book-appoinment";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
  author?: string;
  readTime?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  metaDescription?: string;
  metaTitle?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  category?: string;
}

type SectionType = "content" | "process";

type SectionLink = {
  id: string;
  label: string;
  url: string;
};

type ProcessStep = {
  id: string;
  title: string;
  description: string;

  // ✅ NEW (Separated)
  // References list shown under the step
  links?: SectionLink[];

  // ✅ NEW (Separated)
  // Inline word links applied only inside this step description
  inlineLinks?: SectionLink[];
};

type SectionCTA = {
  enabled: boolean;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
};

type BlogSection = {
  id: string;
  type: SectionType;
  heading: string;
  subHeading: string;
  content: string;
  images: string[];
  steps: ProcessStep[];
  cta: SectionCTA;

  // ✅ NEW (Separated)
  // References list shown under the section
  links?: SectionLink[];

  // ✅ NEW (Separated)
  // Inline word links applied only inside section content
  inlineLinks?: SectionLink[];
};

type StructuredBlogContentV1 = {
  version: 1;
  sections: BlogSection[];
  tocOrder?: string[];
};

type TocItem = {
  id: string; // stable id for ordering
  label: string;
  anchor: string;
};

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-900">Loading Article...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we load the blog post</p>
      </div>
    </div>
    <Footer />
  </div>
);

const safeJsonParse = <T,>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const slugify = (s: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const stripHtml = (html: string) =>
  (html || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hasHtmlTags = (raw: string) => /<\/?[a-z][\s\S]*>/i.test(raw || "");

function extractTocItemsFromSections(sections: BlogSection[]): TocItem[] {
  const items: TocItem[] = [];

  sections.forEach((sec, sIdx) => {
    const h = sec.heading?.trim();
    if (h) {
      items.push({
        id: `sec:${sec.id}`,
        label: h,
        anchor: `sec-${slugify(h)}-${sIdx + 1}`,
      });
    }

    if (sec.type === "process" && Array.isArray(sec.steps)) {
      sec.steps.forEach((st, stIdx) => {
        const t = st.title?.trim();
        if (t) {
          items.push({
            id: `step:${sec.id}:${st.id}`,
            label: t,
            anchor: `step-${slugify(t)}-${sIdx + 1}-${stIdx + 1}`,
          });
        }
      });
    }
  });

  return items;
}

function syncTocOrder(prevOrder: string[] | undefined, items: TocItem[]): string[] {
  const prev = Array.isArray(prevOrder) ? prevOrder : [];
  const set = new Set(items.map((i) => i.id));
  const kept = prev.filter((id) => set.has(id));
  const missing = items.map((i) => i.id).filter((id) => !kept.includes(id));
  return [...kept, ...missing];
}

function deriveExcerptFromContent(content: string, maxLen = 185) {
  if (!content) return "";

  const parsed = safeJsonParse<StructuredBlogContentV1>(content);
  if (parsed?.version === 1 && Array.isArray(parsed.sections)) {
    for (const sec of parsed.sections) {
      const c = (sec?.content || "").trim();
      if (c) {
        const text = stripHtml(c);
        if (text) return text.length > maxLen ? text.slice(0, maxLen).trim() + "…" : text;
      }
      if (sec?.type === "process") {
        for (const st of sec.steps || []) {
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
  return text.length > maxLen ? text.slice(0, maxLen).trim() + "…" : text;
}

function scrollToAnchor(anchor: string) {
  const el = document.getElementById(anchor);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 90; // header offset
  window.scrollTo({ top: y, behavior: "smooth" });
}

export default function DynamicBlogPost() {
  const [location] = useLocation();
  const slug = location.replace(/^\/blog\/?/, "").split("?")[0];

  const { data: blogPost, isLoading, isError, error } = useQuery<BlogPost | null>({
    queryKey: ["blog-post", slug],
    enabled: !!slug,
    queryFn: async () => {
      if (!slug) throw new Error("Missing blog slug");

      const res = await fetch(`/api/blog/${slug}`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.status === 404) return null;

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `Failed to load article (status ${res.status})`);
      }

      return (await res.json()) as BlogPost;
    },
    retry: 1,
    staleTime: 1000 * 60 * 10,
  });

  const publishDate = blogPost?.publishedAt || blogPost?.createdAt;
  const formattedPublishDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Recent";
  const author = blogPost?.author || "BrandingBeez Team";
  const readTime = blogPost?.readTime || 5;

  const resolvedImageUrl = useMemo(() => {
    if (!blogPost?.imageUrl) return undefined;
    const raw = blogPost.imageUrl.trim();
    if (/^https?:\/\//i.test(raw)) return raw;
    try {
      return new URL(raw, window.location.origin).toString();
    } catch {
      return raw;
    }
  }, [blogPost?.imageUrl]);

  const structured = useMemo(() => {
    const raw = blogPost?.content?.trim() || "";
    const parsed = safeJsonParse<StructuredBlogContentV1>(raw);
    if (parsed?.version === 1 && Array.isArray(parsed.sections)) return parsed;
    return null;
  }, [blogPost?.content]);

  const toc = useMemo(() => {
    if (!structured) return [];
    const items = extractTocItemsFromSections(structured.sections);
    const order = syncTocOrder(structured.tocOrder, items);
    const map = new Map(items.map((i) => [i.id, i]));
    return order.map((id) => map.get(id)).filter(Boolean) as TocItem[];
  }, [structured]);

  const htmlContent = useMemo(() => {
    const rawContent = blogPost?.content?.trim();
    if (!rawContent) return "";

    const asJson = safeJsonParse<any>(rawContent);
    if (asJson?.version === 1 && Array.isArray(asJson?.sections)) return "";

    if (hasHtmlTags(rawContent)) return rawContent;

    let normalized = rawContent.replace(/\r\n/g, "\n");
    normalized = normalized.replace(/#{1,6}\s*/g, "\n\n");
    normalized = normalized.replace(/^\s*#{1,6}\s*/gm, "");

    const paragraphs = normalized
      .split(/\n\s*\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        const withLineBreaks = p.replace(/\n/g, "<br/>");
        const withFormatting = withLineBreaks
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>");
        return `<p>${withFormatting}</p>`;
      })
      .join("");

    return paragraphs;
  }, [blogPost?.content]);

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Unable to load blog post</h1>
          <p className="text-xl text-gray-600 mb-8">{(error as Error)?.message || "Please try again later."}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
          <Button onClick={() => (window.location.href = "/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({ title: blogPost.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  const summaryText = blogPost.excerpt?.trim() || deriveExcerptFromContent(blogPost.content || "");

  function escapeHtml(text: string) {
    return (text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeRegExp(text: string) {
    return (text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function sanitizeUrl(url: string) {
    const u = (url || "").trim();
    if (!u) return "";
    if (u.startsWith("/")) return u;
    if (/^https?:\/\//i.test(u)) return u;
    return "";
  }

  /**
   * Apply inline word → href replacement (NO MERGE)
   * - Section content uses sec.inlineLinks only
   * - Step description uses st.inlineLinks only
   */
  function applyInlineLinks(html: string, links?: SectionLink[]) {
    if (!html || !Array.isArray(links) || links.length === 0) return html;

    const valid = links
      .map((l) => ({
        label: (l.label || "").trim(),
        url: sanitizeUrl(l.url),
      }))
      .filter((l) => l.label && l.url)
      .sort((a, b) => b.label.length - a.label.length);

    if (!valid.length) return html;

    // avoid touching existing <a> tags
    const anchorRe = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
    const parts: { type: "a" | "t"; v: string }[] = [];
    let last = 0;
    let m: RegExpExecArray | null;

    while ((m = anchorRe.exec(html))) {
      if (m.index > last) parts.push({ type: "t", v: html.slice(last, m.index) });
      parts.push({ type: "a", v: m[0] });
      last = m.index + m[0].length;
    }
    if (last < html.length) parts.push({ type: "t", v: html.slice(last) });

    const linkify = (txt: string) => {
      let out = txt;
      for (const l of valid) {
        const re = new RegExp(`(^|[^\\w])(${escapeRegExp(l.label)})(?=[^\\w]|$)`, "g");
        const attrs = l.url.startsWith("/")
          ? `href="${l.url}"`
          : `href="${l.url}" target="_blank" rel="noopener noreferrer"`;
        out = out.replace(re, `$1<a ${attrs} class="text-brand-purple font-semibold underline">$2</a>`);
      }
      return out;
    };

    return parts.map((p) => (p.type === "a" ? p.v : linkify(p.v))).join("");
  }

  function renderTextWithInlineLinks(text: string, links?: SectionLink[]) {
    if (!text?.trim()) return "";

    if (hasHtmlTags(text)) {
      return applyInlineLinks(text, links);
    }

    const escaped = escapeHtml(text).replace(/\n/g, "<br/>");
    return applyInlineLinks(escaped, links);
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{blogPost.metaTitle || `${blogPost.title} | BrandingBeez`}</title>
        <meta name="description" content={blogPost.metaDescription || blogPost.excerpt || ""} />
        <meta name="keywords" content={Array.isArray(blogPost.tags) ? blogPost.tags.join(", ") : ""} />
        <meta property="og:title" content={blogPost.metaTitle || blogPost.title} />
        <meta property="og:description" content={blogPost.metaDescription || blogPost.excerpt || ""} />
        <meta property="og:image" content={resolvedImageUrl || "/api/placeholder/800/600"} />
        <meta property="article:author" content={author} />
        <meta property="article:published_time" content={publishDate} />
      </Helmet>

      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-purple to-brand-coral text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
          <Button
            onClick={() => (window.location.href = "/blog")}
            variant="ghost"
            className="text-white hover:bg-white/20 mb-6 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">{blogPost.title}</h1>

            {blogPost.subtitle && <p className="text-base md:text-xl text-white/90 max-w-3xl">{blogPost.subtitle}</p>}

            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="inline-flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{author}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formattedPublishDate}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readTime} min read</span>
              </div>

              <div className="ml-auto">
                <Button
                  onClick={shareArticle}
                  variant="outline"
                  className="border-white/70 text-white hover:bg-white hover:text-brand-purple bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {Array.isArray(blogPost.tags) && blogPost.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap pt-2">
                {blogPost.tags.slice(0, 8).map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-white/10 border-white/40 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BODY */}
      <article className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          {resolvedImageUrl && (
            <div className="mb-10">
              <div className="rounded-2xl overflow-hidden shadow-lg border bg-gray-50">
                <img
                  src={resolvedImageUrl}
                  alt={blogPost.title}
                  className="w-full h-60 md:h-[420px] object-cover"
                  loading="eager"
                  onError={(e) => {
                    console.warn("❌ Blog hero image failed to load:", resolvedImageUrl);
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/blog-fallback.png";
                  }}
                />
              </div>
            </div>
          )}

          {summaryText && (
            <div className="mb-10 rounded-2xl border bg-gradient-to-r from-blue-50 to-white p-6 md:p-7">
              <div className="text-sm font-semibold text-brand-purple mb-2">Quick Summary</div>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">{summaryText}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* MAIN */}
            <div className="lg:col-span-8">
              {structured ? (
                <div className="space-y-10">
                  {structured.sections.map((sec, sIdx) => {
                    const secAnchor = sec.heading?.trim()
                      ? `sec-${slugify(sec.heading)}-${sIdx + 1}`
                      : undefined;

                    // ✅ NO MERGE:
                    // - Inline word links use inlineLinks only
                    // - Reference list uses links only
                    const sectionInlineLinks = sec.inlineLinks || [];
                    const sectionReferences = sec.links || [];

                    return (
                      <section key={sec.id} className="scroll-mt-24">
                        {sec.heading?.trim() && (
                          <h2
                            id={secAnchor}
                            className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3"
                          >
                            {sec.heading}
                          </h2>
                        )}

                        {sec.subHeading?.trim() && (
                          <p className="text-gray-600 text-lg leading-relaxed mb-5">{sec.subHeading}</p>
                        )}

                        {sec.type === "content" ? (
                          <div
                            className={[
                              "prose prose-lg max-w-none",
                              "prose-headings:font-extrabold prose-headings:text-gray-900",
                              "prose-h2:text-2xl prose-h3:text-xl",
                              "prose-p:text-gray-700 prose-p:leading-8",
                              "prose-strong:text-gray-900",
                              "prose-a:text-brand-purple prose-a:font-semibold",
                              "prose-li:leading-8",
                            ].join(" ")}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                // ✅ CHANGE: section content uses ONLY sec.inlineLinks
                                __html: renderTextWithInlineLinks(sec.content, sectionInlineLinks),
                              }}
                            />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {(sec.steps || []).map((st, stIdx) => {
                              const stepAnchor = st.title?.trim()
                                ? `step-${slugify(st.title)}-${sIdx + 1}-${stIdx + 1}`
                                : undefined;

                              // ✅ NO MERGE:
                              // Step inline links only from st.inlineLinks
                              // Step references only from st.links
                              const stepInlineLinks = st.inlineLinks || [];
                              const stepReferences = st.links || [];

                              return (
                                <div key={st.id} className="rounded-2xl border bg-white shadow-sm p-5 md:p-6">
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 text-gray-900 font-bold flex items-center justify-center">
                                      {stIdx + 1}
                                    </div>
                                    <div className="min-w-0 w-full">
                                      {st.title?.trim() && (
                                        <h3
                                          id={stepAnchor}
                                          className="text-lg md:text-xl font-bold text-gray-900 mb-1"
                                        >
                                          {st.title}
                                        </h3>
                                      )}

                                      {st.description?.trim() && (
                                        <div
                                          className="text-gray-700 leading-8"
                                          dangerouslySetInnerHTML={{
                                            // ✅ CHANGE: step description uses ONLY st.inlineLinks
                                            __html: renderTextWithInlineLinks(st.description, stepInlineLinks),
                                          }}
                                        />
                                      )}

                                      {/* ✅ NEW: Step References block (separate from inline links) */}
                                      {Array.isArray(stepReferences) && stepReferences.length > 0 && (
                                        <div className="mt-4 rounded-2xl border bg-gray-50 p-4">
                                          <div className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4 text-gray-500" />
                                            Step References
                                          </div>
                                          <ul className="space-y-2">
                                            {stepReferences.map((link) => (
                                              <li key={link.id} className="flex items-start gap-2">
                                                <span className="text-brand-purple font-bold">•</span>
                                                <a
                                                  href={link.url}
                                                  target={link.url?.startsWith("/") ? "_self" : "_blank"}
                                                  rel="noreferrer noopener"
                                                  className="text-sm font-semibold text-brand-purple hover:underline break-all"
                                                >
                                                  {link.label?.trim() || link.url}
                                                </a>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {Array.isArray(sec.images) && sec.images.length > 0 && (
                          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {sec.images.map((url) => (
                              <div
                                key={url}
                                className="rounded-2xl overflow-hidden border bg-gray-50 shadow-sm"
                              >
                                <img
                                  src={url}
                                  alt="Section visual"
                                  className="w-full h-56 object-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/images/blog-fallback.png";
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ✅ Section References block (separate from inline links) */}
                        {Array.isArray(sectionReferences) && sectionReferences.length > 0 && (
                          <div className="mt-6 rounded-2xl border bg-gray-50 p-5">
                            <div className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                              <LinkIcon className="w-4 h-4 text-gray-500" />
                              References
                            </div>

                            <ul className="space-y-2">
                              {sectionReferences.map((link) => (
                                <li key={link.id} className="flex items-start gap-2">
                                  <span className="text-brand-purple font-bold">•</span>
                                  <a
                                    href={link.url}
                                    target={link.url?.startsWith("/") ? "_self" : "_blank"}
                                    rel="noreferrer noopener"
                                    className="text-sm font-semibold text-brand-purple hover:underline break-all"
                                  >
                                    {link.label?.trim() || link.url}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {sec.cta?.enabled && (
                          <div className="mt-8 rounded-2xl overflow-hidden border shadow-sm">
                            <div className="bg-gradient-to-r from-brand-purple to-brand-coral text-white p-6 md:p-8 text-center">
                              {sec.cta.heading?.trim() && (
                                <div className="text-xl md:text-2xl font-extrabold mb-2">{sec.cta.heading}</div>
                              )}
                              {sec.cta.description?.trim() && (
                                <p className="text-white/90 text-base md:text-lg leading-relaxed mb-5">
                                  {sec.cta.description}
                                </p>
                              )}

                              {sec.cta.buttonText?.trim() && sec.cta.buttonLink?.trim() && (
                                <a
                                  href={sec.cta.buttonLink}
                                  target={sec.cta.buttonLink.startsWith("/") ? "_self" : "_blank"}
                                  rel="noreferrer noopener"
                                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-brand-purple font-bold hover:bg-gray-100 transition"
                                >
                                  {sec.cta.buttonText}
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </section>
                    );
                  })}

                  <div className="mt-12 p-8 bg-gradient-to-r from-brand-purple to-brand-coral rounded-2xl text-white text-center">
                    <h2 className="text-2xl font-extrabold mb-3">Ready to Get Started?</h2>
                    <p className="text-lg mb-6 opacity-90 leading-relaxed">
                      Contact our expert team to discuss how we can help grow your business with proven digital marketing
                      strategies.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <BookCallButtonWithModal
                        buttonLabel="Get Free Consultation"
                        className="bg-white text-brand-purple hover:bg-gray-100"
                        buttonSize="lg"
                      />
                      {/* <p className="text-lg">
                        📞 Call us at{" "}
                        <a href="tel:+917871990263" className="text-white underline font-semibold">
                          +91 78719 90263
                        </a>
                      </p> */}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  <div
                    className={[
                      "prose prose-lg max-w-none",
                      "prose-headings:font-extrabold prose-headings:text-gray-900",
                      "prose-h2:text-2xl prose-h3:text-xl",
                      "prose-p:text-gray-700 prose-p:leading-8",
                      "prose-strong:text-gray-900",
                      "prose-a:text-brand-purple prose-a:font-semibold",
                      "prose-li:leading-8",
                    ].join(" ")}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />

                  <div className="mt-12 p-8 bg-gradient-to-r from-brand-purple to-brand-coral rounded-2xl text-white text-center">
                    <h2 className="text-2xl font-extrabold mb-3">Ready to Get Started?</h2>
                    <p className="text-lg mb-6 opacity-90 leading-relaxed">
                      Contact our expert team to discuss how we can help grow your business with proven digital marketing
                      strategies.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <BookCallButtonWithModal
                        buttonLabel="Get Free Consultation"
                        className="bg-white text-brand-purple hover:bg-gray-100"
                        buttonSize="lg"
                      />
                      {/* <p className="text-lg">
                        📞 Call us at{" "}
                        <a href="tel:+917871990263" className="text-white underline font-semibold">
                          +91 78719 90263
                        </a>
                      </p> */}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TOC SIDEBAR */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                {structured && toc.length > 0 && (
                  <div className="rounded-2xl border bg-white shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-extrabold text-gray-900">Table of Contents</div>
                      <div className="text-xs text-gray-500">Click to jump</div>
                    </div>

                    <div className="space-y-2">
                      {toc.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => scrollToAnchor(item.anchor)}
                          className="w-full text-left rounded-xl px-3 py-2 hover:bg-gray-50 transition flex items-start gap-2"
                        >
                          <LinkIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-800 leading-6">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border bg-gradient-to-b from-gray-50 to-white p-5 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Written by</div>
                  <div className="text-lg font-extrabold text-gray-900">{author}</div>
                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedPublishDate}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{readTime} min read</span>
                  </div>

                  <div className="mt-5">
                    <Button onClick={shareArticle} variant="outline" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Article
                    </Button>
                  </div>
                </div>

                {Array.isArray(blogPost.tags) && blogPost.tags.length > 0 && (
                  <div className="rounded-2xl border bg-white shadow-sm p-5">
                    <div className="font-extrabold text-gray-900 mb-3">Topics</div>
                    <div className="flex gap-2 flex-wrap">
                      {blogPost.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="border-brand-coral text-brand-coral">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
