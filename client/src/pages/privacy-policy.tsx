// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
import { PrivacyPolicy } from "@/components/privacy-policy";
import { SecurityHeadersProvider } from "@/components/security-headers";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { PrivacyPolicySchema } from "@/utils/all-schemas";
import { Helmet } from "react-helmet";

export default function PrivacyPolicyPage() {
  return (
    <SecurityHeadersProvider>
      <Helmet>
        <title>Privacy Policy | Branding Beez GDPR-Compliant Data Protection</title>
        <meta name="description" content="Your privacy is our priority. Learn how Branding Beez collects, uses, and protects your data with AES-256 encryption and full GDPR compliance." />
        <link rel="canonical" href="https://brandingbeez.co.uk/privacy-policy" />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <SEOHead
          title="Privacy Policy"
          description="Learn how Branding Beez protects your data with AES-256 encryption and GDPR-compliant practices."
          keywords="white label digital marketing, white label SEO, white label web development, white label Google Ads, agency growth, digital marketing agency services"
          canonicalUrl="https://brandingbeez.co.uk/privacy-policy"
          ogType="website"
        />
        <SchemaMarkup type="custom" data={PrivacyPolicySchema} />
        {/* <Header /> */}
        <PrivacyPolicy />
        {/* <Footer /> */}
      </div>
    </SecurityHeadersProvider>
  );
}