import { storage as dbStorage } from "./db-storage";

import type { UserStorage } from "./Istorage/storage-users";
import type { ContactStorage } from "./Istorage/storage-contacts";
import type { ClientStorage } from "./Istorage/storage-clients";
import type { SeoAuditStorage } from "./Istorage/storage-seo-audits";
import type { ChatStorage } from "./Istorage/storage-chat-sessions";
import type { FeaturedClientStorage } from "./Istorage/storage-featured-clients";
import type { CaseStudyStorage } from "./Istorage/storage-case-studies";
import type { PricingStorage } from "./Istorage/storage-pricing-packages";
import type { ServicePageStorage } from "./Istorage/storage-service-pages";
import type { CouponStorage } from "./Istorage/storage-coupons";
import type { DedicatedResourcesStorage } from "./Istorage/storage-dedicated-resources";
import type { BlogStorage } from "./Istorage/storage-blog";
import type { NewsletterStorage } from "./Istorage/storage-newsletter";
import type { PortfolioStorage } from "./Istorage/storage-portfolio";
import type { AppointmentStorage } from "./Istorage/storage-appointments";
import type { GoogleAuthStorage } from "./Istorage/storage-google-auth";
import type { SeoCaseStudyStorage } from "./Istorage/storage-seo-case-study";
import { PpcCaseStudyStorage } from "./Istorage/storage-ppc-case-study";
import { WebCaseStudyStorage } from "./Istorage/storage-web-case-study";
import { DedicatedResourceCaseStudyStorage } from "./Istorage/dedicated-resource-case-study-storage";

export interface IStorage
  extends UserStorage,
    ContactStorage,
    ClientStorage,
    SeoAuditStorage,
    ChatStorage,
    FeaturedClientStorage,
    CaseStudyStorage,
    PricingStorage,
    ServicePageStorage,
    CouponStorage,
    DedicatedResourcesStorage,
    BlogStorage,
    NewsletterStorage,
    PortfolioStorage,
    AppointmentStorage,
    SeoCaseStudyStorage,
    PpcCaseStudyStorage,
    WebCaseStudyStorage,
    DedicatedResourceCaseStudyStorage,
    GoogleAuthStorage {}  

// Hook the composed db-storage into this module
export const storage: IStorage = dbStorage;



