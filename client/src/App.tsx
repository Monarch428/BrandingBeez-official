import { Switch, Route, useLocation } from "wouter";
import React, { useEffect, Suspense, lazy } from "react";
import { apiRequest, queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppToastProvider } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PerformanceOptimizer } from "@/components/performance-optimizer";
import { CriticalPathOptimizer } from "@/components/critical-path-optimizer";
import { CookieConsent } from "@/components/cookie-consent";
import { SecurityHeadersProvider } from "@/components/security-headers";
import { ExitIntentPopup } from "@/components/exit-intent-popup";
import { EntryPopup } from "@/components/entry-popup";
import { MobilePopup } from "@/components/mobile-popup";
import BlogPage from "@/pages/blog";
import DynamicBlogPostPage from "@/pages/blog/[slug]";

import { usePopupManager } from "@/hooks/use-popup-manager";
import ErrorBoundary from "@/components/error-boundary";

// CRITICAL: Only import home page immediately (above the fold)
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import BeeLoadingScreen from "./components/BeeLoadingScreen";
import { ThankYouProvider } from "./context/thank-you-context";
import { SeoCaseStudyPage } from "./pages/case-studies/seo-case-studies/[slug]";
import { CaseStudyCardsPage } from "./pages/case-studies/seo-case-studies/SeoCaseStudiesSection";
import PpcCaseStudySlugPage from "./pages/case-studies/ppc-case-studies/[slug]";
import WebCaseStudySlugPage from "./pages/case-studies/web-case-studies/[slug]";
import DedicatedResourceCaseStudySlugPage from "./pages/case-studies/dr-case-studies/[slug]";

// LAZY LOAD: All other pages split into separate bundles
const Services = lazy(() => import("@/pages/services"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact-optimized"));
const Blog = lazy(() => import("@/pages/blog"));
const Portfolio = lazy(() => import("@/pages/portfolio"));
const BookApiontment = lazy(() => import("@/pages/AppointmentPage"));

// Service pages - lazy loaded
const SEOServices = lazy(() => import("@/pages/services/seo"));
const WebDevelopment = lazy(() => import("@/pages/services/web-development"));
const GoogleAds = lazy(() => import("@/pages/services/google-ads"));
const DedicatedResources = lazy(
  () => import("@/pages/services/dedicated-resources"),
);
const AIDevelopment = lazy(() => import("@/pages/services/ai-development"));
const N8NAutomations = lazy(() => import("@/pages/services/n8n-automations"));
const AIO = lazy(() => import("@/pages/services/ai-search-optimization"));
const custApp = lazy(() => import("@/pages/services/custom-app-development"));

// Tools and utilities - lazy loaded
const SEOAudit = lazy(() => import("@/pages/seo-audit"));
const PricingCalculator = lazy(() => import("@/pages/pricing-calculator"));
const OnboardingWizard = lazy(() => import("@/pages/onboarding-wizard"));
const AIBusinessGrowthAnalyzer = lazy(() => import("@/pages/ai-business-growth-analyzer"));

// Admin - separate bundle (heavy component)
const Admin = lazy(() => import("@/pages/admin"));

// Case studies - lazy loaded as separate chunks
const CaseStudies = lazy(() => import("@/pages/case-studies"));
const SEOCaseStudy = lazy(() => import("@/pages/case-studies/seo-case-study"));
const ScubaDivingCaseStudy = lazy(
  () => import("@/pages/case-studies/scuba-diving-case-study"),
);
const StatPlanningCaseStudy = lazy(
  () => import("@/pages/case-studies/stat-planning-case-study"),
);
const UBUDesignCaseStudy = lazy(
  () => import("@/pages/case-studies/ubu-design-case-study"),
);
const WebDevelopmentCaseStudy = lazy(
  () => import("@/pages/case-studies/web-development-case-study"),
);
const GoogleAdsCaseStudy = lazy(
  () => import("@/pages/case-studies/google-ads-case-study"),
);
const SocialLandCaseStudy = lazy(
  () => import("@/pages/case-studies/social-land"),
);
const SocialLandWebsiteCaseStudy = lazy(
  () => import("@/pages/case-studies/socialland-website-case-study"),
);
const TSLandscapingWebsiteCaseStudy = lazy(
  () => import("@/pages/case-studies/ts-landscaping-website"),
);
const VelluLaserLandingPageCaseStudy = lazy(
  () => import("@/pages/case-studies/vellu-laser-landing-page"),
);
const GreenParadiseBrandingWebsiteCaseStudy = lazy(
  () => import("@/pages/case-studies/green-paradise-branding-website"),
);
const KoalaDigitalCaseStudy = lazy(
  () => import("@/pages/case-studies/koala-digital"),
);
const WebsiteArchitectCaseStudy = lazy(
  () => import("@/pages/case-studies/website-architect"),
);
const DedicatedResourcesFintechCaseStudy = lazy(
  () => import("@/pages/case-studies/dedicated-resources-fintech"),
);
const CitypatCaseStudy = lazy(
  () => import("@/pages/case-studies/citypat-case-study"),
);
const ArlingsworthSolicitorsCaseStudy = lazy(
  () => import("@/pages/case-studies/arlingsworth-solicitors-case-study"),
);
const JunksAwayCaseStudy = lazy(
  () => import("@/pages/case-studies/junksaway-case-study"),
);
const TheDogGuyCaseStudy = lazy(
  () => import("@/pages/case-studies/the-dog-guy-case-study"),
);
const GriffinGroupCaseStudy = lazy(
  () => import("@/pages/case-studies/griffin-group-case-study"),
);

const FSEDigital = lazy(() => import("@/pages/case-studies/fse-digital"));

// Legal pages - lazy loaded
const PrivacyPolicyPage = lazy(() => import("@/pages/privacy-policy"));
const TermsOfServicePage = lazy(() => import("@/pages/terms-of-service"));
const SecurityPage = lazy(() => import("@/pages/security"));
const ComingSoon = lazy(() => import("@/pages/coming-soon"));

// Newsletter page - lazy loaded
const Newsletter = lazy(() => import("@/pages/newsletter"));

// Blog posts - handled by dynamic route
const DynamicBlogPost = lazy(() => import("@/pages/blog/[slug]"));

// Loading component for lazy routes
const PageLoader = () => <BeeLoadingScreen />;

// Wrap lazy components with Suspense
const LazyRoute = ({
  component: Component,
}: {
  component: React.ComponentType;
}) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

class SafePopupBoundary extends React.Component<
  { children: React.ReactNode; name: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; name: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn(`[SafePopupBoundary] ${this.props.name} crashed (isolated).`, error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

import Header from "@/components/header";
import Footer from "@/components/footer";
import CaseStudyScrollHandler from "./utils/CaseStudyScrollHandler ";

function Router() {
  const [location] = useLocation();

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_load", {
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.search,
        page_title: document.title,
      });
    }
  }, [location]);

  // routes that should NOT show header/footer
  const hideChrome =
    location === "/loader" ||
    location.startsWith("/admin");

  const Content = (
    <Switch>
      {/* CRITICAL: Home page loads immediately */}
      <Route
        path="/book-appointment"
        component={() => <LazyRoute component={BookApiontment} />}
      />
      <Route path="/" component={Home} />
      {/* <Route path="/loader" component={BeeLoadingScreen} /> */}
      <Route path="/admin/case-studies" component={CaseStudyCardsPage} />
      <Route path="/seo-case-study/:slug" component={SeoCaseStudyPage} />
      <Route path="/ppc-case-study/:slug" component={PpcCaseStudySlugPage} />
      <Route path="/web-case-study/:slug" component={WebCaseStudySlugPage} />
      <Route
        path="/dedicated-resource-case-study/:slug"
        component={DedicatedResourceCaseStudySlugPage}
      />

      {/* LAZY: All other routes load on demand */}
      <Route path="/services" component={() => <LazyRoute component={Services} />} />
      <Route path="/services/seo" component={() => <LazyRoute component={SEOServices} />} />
      <Route path="/services/web-development" component={() => <LazyRoute component={WebDevelopment} />} />
      <Route path="/services/google-ads" component={() => <LazyRoute component={GoogleAds} />} />
      <Route path="/services/ai-development" component={() => <LazyRoute component={AIDevelopment} />} />
      <Route path="/services/dedicated-resources" component={() => <LazyRoute component={DedicatedResources} />} />
      <Route path="/services/n8n-automations" component={() => <LazyRoute component={N8NAutomations} />} />
      <Route path="/services/ai-search-optimization" component={() => <LazyRoute component={AIO} />} />
      <Route path="/services/custom-app-development" component={() => <LazyRoute component={custApp} />} />

      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={DynamicBlogPostPage} />

      {/* Case Studies */}
      {/* <Route path="/case-studies" component={() => <LazyRoute component={CaseStudies} />} /> */}
      <Route path="/case-studies/seo-case-study" component={() => <LazyRoute component={SEOCaseStudy} />} />
      <Route path="/case-studies/scuba-diving-case-study" component={() => <LazyRoute component={ScubaDivingCaseStudy} />} />
      <Route path="/case-studies/stat-planning-case-study" component={() => <LazyRoute component={StatPlanningCaseStudy} />} />
      <Route path="/case-studies/ubu-design-case-study" component={() => <LazyRoute component={UBUDesignCaseStudy} />} />
      <Route path="/case-studies/ubu-design" component={() => <LazyRoute component={UBUDesignCaseStudy} />} />
      <Route path="/case-studies/citypat-case-study" component={() => <LazyRoute component={CitypatCaseStudy} />} />
      <Route path="/case-studies/citypat" component={() => <LazyRoute component={CitypatCaseStudy} />} />
      <Route path="/case-studies/griffin-group-case-study" component={() => <LazyRoute component={GriffinGroupCaseStudy} />} />
      <Route path="/case-studies/arlingsworth-solicitors-case-study" component={() => (<LazyRoute component={ArlingsworthSolicitorsCaseStudy} />)} />
      <Route path="/case-studies/junksaway-case-study" component={() => <LazyRoute component={JunksAwayCaseStudy} />} />
      <Route path="/case-studies/junksaway" component={() => <LazyRoute component={JunksAwayCaseStudy} />} />
      <Route path="/case-studies/the-dog-guy-case-study" component={() => <LazyRoute component={TheDogGuyCaseStudy} />} />
      <Route path="/case-studies/web-development" component={() => <LazyRoute component={WebDevelopmentCaseStudy} />} />
      <Route path="/case-studies/google-ads" component={() => <LazyRoute component={GoogleAdsCaseStudy} />} />
      <Route path="/case-studies/social-land" component={() => <LazyRoute component={SocialLandCaseStudy} />} />
      <Route path="/case-studies/socialland-website" component={() => <LazyRoute component={SocialLandWebsiteCaseStudy} />} />
      <Route path="/case-studies/socialland-website-case-study" component={() => <LazyRoute component={SocialLandWebsiteCaseStudy} />} />
      <Route path="/case-studies/ts-landscaping-website" component={() => (<LazyRoute component={TSLandscapingWebsiteCaseStudy} />)} />
      <Route path="/case-studies/vellu-laser-landing-page" component={() => (<LazyRoute component={VelluLaserLandingPageCaseStudy} />)} />
      <Route path="/case-studies/green-paradise-branding-website" component={() => (<LazyRoute component={GreenParadiseBrandingWebsiteCaseStudy} />)} />
      <Route path="/case-studies/koala-digital" component={() => <LazyRoute component={KoalaDigitalCaseStudy} />} />
      <Route path="/case-studies/website-architect" component={() => <LazyRoute component={WebsiteArchitectCaseStudy} />} />
      <Route path="/case-studies/payflow-systems" component={() => (<LazyRoute component={DedicatedResourcesFintechCaseStudy} />)} />
      <Route path="/case-studies/fse-digital" component={() => <LazyRoute component={FSEDigital} />} />

      {/* Tools and utilities */}
      <Route path="/seo-audit" component={() => <LazyRoute component={SEOAudit} />} />
      <Route path="/pricing-calculator" component={() => <LazyRoute component={PricingCalculator} />} />
      <Route path="/onboarding-wizard" component={() => <LazyRoute component={OnboardingWizard} />} />
      <Route
        path="/ai-business-growth-analyzer"
        component={() => <LazyRoute component={AIBusinessGrowthAnalyzer} />}
      />

      {/* Admin - heavy component, separate bundle */}
      <Route path="/admin" component={() => <LazyRoute component={Admin} />} />

      {/* Other pages */}
      <Route path="/about" component={() => <LazyRoute component={About} />} />
      <Route path="/contact" component={() => <LazyRoute component={Contact} />} />
      <Route path="/newsletter" component={() => <LazyRoute component={Newsletter} />} />
      <Route path="/portfolio" component={() => <LazyRoute component={Portfolio} />} />

      {/* Legal pages */}
      <Route path="/privacy-policy" component={() => <LazyRoute component={PrivacyPolicyPage} />} />
      <Route path="/terms-of-service" component={() => <LazyRoute component={TermsOfServicePage} />} />
      <Route path="/security" component={() => <LazyRoute component={SecurityPage} />} />

      {/* 404 - This catches all unmatched routes */}
      <Route component={NotFound} />
    </Switch>
  );

  if (hideChrome) return Content;

  return (
    <>
      <Header />
      <main>{Content}</main>
      <Footer />
    </>
  );
}


function App() {
  const {
    entryPopupOpen,
    exitPopupOpen,
    mobilePopupOpen,
    closeEntryPopup,
    closeExitPopup,
    closeMobilePopup,
  } = usePopupManager();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const gclid = params.get("gclid");

    if (gclid && !sessionStorage.getItem("bb_gclid")) {
      sessionStorage.setItem("bb_gclid", gclid);
    }
  }, []);

  // Add global error handling
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
    };

    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <ErrorBoundary>
      <SecurityHeadersProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AppToastProvider>
              <ThankYouProvider>
                <CriticalPathOptimizer />

                <PerformanceOptimizer />

                <Router />
                <CookieConsent />

                {/* ✅ Isolated so popup crashes can't white-screen the site */}
                {/* <SafePopupBoundary name="EntryPopup">
                  <EntryPopup isOpen={entryPopupOpen} onClose={closeEntryPopup} />
                </SafePopupBoundary> */}

                {/* <SafePopupBoundary name="ExitIntentPopup">
                  <ExitIntentPopup isOpen={exitPopupOpen} onClose={closeExitPopup} />
                </SafePopupBoundary> */}

                {/* <SafePopupBoundary name="MobilePopup">
                  <MobilePopup isOpen={mobilePopupOpen} onClose={closeMobilePopup} />
                </SafePopupBoundary> */}
              </ThankYouProvider>
            </AppToastProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </SecurityHeadersProvider>
    </ErrorBoundary>
  );
}

export default App;
