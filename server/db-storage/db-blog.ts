// src/server/db-blog.ts
import type { IStorage } from "../storage";
import type { BlogPost, InsertBlogPost } from "@shared/schema";
import { BlogPostModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const blogStorage = {
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    await ensureConnection();
    const id = await getNextSequence("blog_posts");
    const created = await BlogPostModel.create({ id, ...post });
    return toPlain<BlogPost>(created);
  },

  async getAllBlogPosts(): Promise<BlogPost[]> {
    await ensureConnection();
    const posts = await BlogPostModel.find()
      .sort({ createdAt: -1 })
      .lean<BlogPost[]>();
    return posts;
  },

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    await ensureConnection();
    const post = await BlogPostModel.findOne({
      slug,
      isPublished: true,
    }).lean<BlogPost>();
    return post ?? undefined;
  },

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    await ensureConnection();
    const posts = await BlogPostModel.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean<BlogPost[]>();
    return posts;
  },

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    await ensureConnection();
    const posts = await BlogPostModel.find({
      isPublished: true,
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .lean<BlogPost[]>();
    return posts;
  },

  async updateBlogPost(
    id: number,
    data: Partial<InsertBlogPost>,
  ): Promise<BlogPost> {
    await ensureConnection();
    const updated = await BlogPostModel.findOneAndUpdate(
      { id },
      { ...data },
      { new: true },
    ).lean<BlogPost>();

    if (!updated) {
      throw new Error("Blog post not found");
    }
    return updated;
  },

  async deleteBlogPost(id: number): Promise<void> {
    await ensureConnection();
    await BlogPostModel.deleteOne({ id });
  },

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    await ensureConnection();
    const post = await BlogPostModel.findOne({ id }).lean<BlogPost>();
    return post ?? undefined;
  },
} satisfies Pick<
  IStorage,
  | "createBlogPost"
  | "getAllBlogPosts"
  | "getBlogPost"
  | "getPublishedBlogPosts"
  | "getFeaturedBlogPosts"
  | "updateBlogPost"
  | "deleteBlogPost"
  | "getBlogPostById"
>;
