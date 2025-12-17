import mongoose, { Schema, type Model } from "mongoose";
import type { BlogPost } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface BlogPostDocument extends mongoose.Document, BlogPost {}

const blogPostSchema = new Schema<BlogPostDocument>(
  {
    id: numericIdField,
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: String,
    excerpt: String,
    content: { type: String, required: true },
    imageUrl: String,
    tags: { type: [String], default: [] },
    author: { type: String, default: "BrandingBeez Team" },
    readTime: { type: Number, default: 5 },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    metaDescription: String,
    metaTitle: String,
  },
  {
    collection: "blog_posts",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const BlogPostModel =
  (models.BlogPost as Model<BlogPostDocument>) ||
  model<BlogPostDocument>("BlogPost", blogPostSchema);
