// shared/schema/blog-posts.ts
import { z } from "zod";

export const insertBlogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  readTime: z.number().int().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaDescription: z.string().optional(),
  metaTitle: z.string().optional(),
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export interface BlogPost extends InsertBlogPost {
  id: number;
  tags?: string[];
  author: string;
  readTime: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
