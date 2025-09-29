import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SecurityHeaders } from "@/components/security-headers";
import { SecurityHeadersProvider } from "@/components/security-headers";

export default function SecurityPage() {
  return (
    <SecurityHeadersProvider>
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <Header />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <SecurityHeaders />
          </div>
        </main>
        <Footer />
      </div>
    </SecurityHeadersProvider>
  );
}