import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TermsOfService } from "@/components/terms-of-service";
import { SecurityHeadersProvider } from "@/components/security-headers";

export default function TermsOfServicePage() {
  return (
    <SecurityHeadersProvider>
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <Header />
        <TermsOfService />
        <Footer />
      </div>
    </SecurityHeadersProvider>
  );
}