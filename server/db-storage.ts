// src/server/db-storage.ts
import type { IStorage } from "./storage";

import { userStorage } from "./db-storage/db-users";
import { contactStorage } from "./db-storage/db-contacts";
import { clientStorage } from "./db-storage/db-clients";
import { seoAuditStorage } from "./db-storage/db-seo-audits";
import { chatStorage } from "./db-storage/db-chat-sessions";
import { featuredClientStorage } from "./db-storage/db-featured-clients";
import { caseStudyStorage } from "./db-storage/db-case-studies";
import { pricingStorage } from "./db-storage/db-pricing-packages";
import { servicePageStorage } from "./db-storage/db-service-pages";
import { couponStorage } from "./db-storage/db-coupons";
import { dedicatedResourcesStorage } from "./db-storage/db-dedicated-resources";
import { blogStorage } from "./db-storage/db-blog";
import { newsletterStorage } from "./db-storage/db-newsletter";
import { portfolioStorage } from "./db-storage/db-portfolio";
import { appointmentStorage } from "./db-storage/db-appointments";
import { seoCaseStudyStorage } from "./db-storage/db-seo-case-study";

export const storage: IStorage = {
  ...userStorage,
  ...contactStorage,
  ...clientStorage,
  ...seoAuditStorage,
  ...chatStorage,
  ...featuredClientStorage,
  ...caseStudyStorage,
  ...pricingStorage,
  ...servicePageStorage,
  ...couponStorage,
  ...dedicatedResourcesStorage,
  ...blogStorage,
  ...newsletterStorage,
  ...portfolioStorage,
  ...appointmentStorage,
  ...seoCaseStudyStorage,
};
