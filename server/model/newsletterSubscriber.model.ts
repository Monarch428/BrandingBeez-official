import mongoose, { Schema, type Model } from "mongoose";
import type { NewsletterSubscriber } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface NewsletterSubscriberDocument
  extends mongoose.Document,
    NewsletterSubscriber {}

const newsletterSubscriberSchema = new Schema<NewsletterSubscriberDocument>(
  {
    id: numericIdField,
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { collection: "newsletter_subscribers", versionKey: false }
);

export const NewsletterSubscriberModel =
  (models.NewsletterSubscriber as Model<NewsletterSubscriberDocument>) ||
  model<NewsletterSubscriberDocument>("NewsletterSubscriber", newsletterSubscriberSchema);
