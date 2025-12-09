// src/server/storage-blog.ts
import type { BlogPost, InsertBlogPost } from "@shared/schema";

export interface BlogStorage {
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  updateBlogPost(
    id: number,
    data: Partial<InsertBlogPost>,
  ): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
}
