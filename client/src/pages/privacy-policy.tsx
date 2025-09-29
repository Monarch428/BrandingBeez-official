import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PrivacyPolicy } from "@/components/privacy-policy";
import { SecurityHeadersProvider } from "@/components/security-headers";

export default function PrivacyPolicyPage() {
  return (
    <SecurityHeadersProvider>
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <Header />
        <PrivacyPolicy />
        <Footer />
      </div>
    </SecurityHeadersProvider>
  );
}