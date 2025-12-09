// shared/schema/newsletter.ts
import { z } from "zod";

export const insertNewsletterSubscriberSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export type InsertNewsletterSubscriber = z.infer<
  typeof insertNewsletterSubscriberSchema
>;

export interface NewsletterSubscriber extends InsertNewsletterSubscriber {
  id: number;
  subscribedAt: Date;
}
