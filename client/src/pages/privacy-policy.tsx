// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
import { PrivacyPolicy } from "@/components/privacy-policy";
import { SecurityHeadersProvider } from "@/components/security-headers";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
import { PrivacyPolicySchema } from "@/utils/all-schemas";
import { Helmet } from "react-helmet";
import { SEO } from "@/hooks/SEO";

export default function PrivacyPolicyPage() {
  return (
    <SecurityHeadersProvider>
      <SEO
        title="Privacy Policy | BrandingBeez GDPR-Compliant Data Protection"
        description="Your privacy is our priority. Learn how BrandingBeez collects, uses, and protects your data with AES-256 encryption and full GDPR compliance."
      />

      <SchemaMarkup type="custom" data={PrivacyPolicySchema} />
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        {/* <Header /> */}
        <PrivacyPolicy />
        {/* <Footer /> */}
      </div>
    </SecurityHeadersProvider>
  );
}