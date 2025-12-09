// src/server/storage-newsletter.ts
import type {
  NewsletterSubscriber,
  InsertNewsletterSubscriber,
} from "@shared/schema";

export interface NewsletterStorage {
  createNewsletterSubscriber(
    subscriber: InsertNewsletterSubscriber,
  ): Promise<NewsletterSubscriber>;
  getNewsletterSubscriberByEmail(
    email: string,
  ): Promise<NewsletterSubscriber | undefined>;
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  deleteNewsletterSubscriber(id: number): Promise<void>;
}
