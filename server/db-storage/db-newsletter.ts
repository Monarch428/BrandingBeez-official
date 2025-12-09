// src/server/db-newsletter.ts
import type { IStorage } from "../storage";
import type {
  NewsletterSubscriber,
  InsertNewsletterSubscriber,
} from "@shared/schema";
import { NewsletterSubscriberModel } from "../models";
import { ensureConnection, getNextSequence, toPlain } from "../helpers/db-helpers";

export const newsletterStorage = {
  async createNewsletterSubscriber(
    subscriber: InsertNewsletterSubscriber,
  ): Promise<NewsletterSubscriber> {
    await ensureConnection();
    const id = await getNextSequence("newsletter_subscribers");
    const created = await NewsletterSubscriberModel.create({
      id,
      ...subscriber,
    });
    return toPlain<NewsletterSubscriber>(created);
  },

  async getNewsletterSubscriberByEmail(
    email: string,
  ): Promise<NewsletterSubscriber | undefined> {
    await ensureConnection();
    const subscriber = await NewsletterSubscriberModel.findOne({
      email,
    }).lean<NewsletterSubscriber>();
    return subscriber ?? undefined;
  },

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    await ensureConnection();
    const subscribers = await NewsletterSubscriberModel.find()
      .sort({ subscribedAt: -1 })
      .lean<NewsletterSubscriber[]>();
    return subscribers;
  },

  async deleteNewsletterSubscriber(id: number): Promise<void> {
    await ensureConnection();
    await NewsletterSubscriberModel.deleteOne({ id });
  },
} satisfies Pick<
  IStorage,
  | "createNewsletterSubscriber"
  | "getNewsletterSubscriberByEmail"
  | "getAllNewsletterSubscribers"
  | "deleteNewsletterSubscriber"
>;
