// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
import { SchemaMarkup } from "@/components/schema-markup";
import { Card, CardContent } from "@/components/ui/card";
import { ContactFormOptimized } from "@/components/contact-form-optimized";
import { useRegion } from "@/hooks/use-region";
import {
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Headphones,
  Users,
  Calendar,
} from "lucide-react";
import { BookCallButtonWithModal } from "@/components/book-appoinment";
import { SEO } from "@/hooks/SEO";

export default function Contact() {
  const { regionConfig } = useRegion();

  const openCalendly = () => {
    window.open("/book-appointment", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <SEO
        title="Contact BrandingBeez - Get Your Free Consultation | White-Label Agency Partner"
        description="Ready to scale your agency? Contact our global team for white-label digital services. Free consultation, UK/US/Germany offices. Get started today with professional white-label solutions."
      />

      <SchemaMarkup
        type="webpage"
        data={{
          title: "Contact BrandingBeez - Get Your Free Consultation",
          description:
            "Ready to scale your agency? Contact our global team for white-label digital services. Free consultation available.",
          url: "https://brandingbeez.co.uk/contact",
          breadcrumbs: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://brandingbeez.co.uk",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Contact",
              item: "https://brandingbeez.co.uk/contact",
            },
          ],
        }}
      />

      {/* <Header /> */}
      <main className="min-w-0">
        {/* ---------------- HERO SECTION ---------------- */}
        <section className="bg-white">
          <div className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-10 sm:pb-12">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-purple mb-4 sm:mb-6">
                Contact Our{" "}
                {regionConfig.code === "DE" ? "Deutsche" : "Global"} Team
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-1 sm:px-0">
                {regionConfig.code === "DE"
                  ? "Bereit für deutsche Qualität? Sprechen Sie mit unserem Team."
                  : "Ready to scale your agency? Let's talk about your project."}
              </p>

              {/* Primary CTA */}
              <div className="flex justify-center mb-6">
                <div className="w-full sm:w-auto">
                  <BookCallButtonWithModal
                    buttonLabel="Book a strategy call"
                    className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base touch-manipulation"
                    buttonSize="lg"
                  />
                </div>
              </div>

              {/* Quick Contact Bar (stacked on mobile) */}
              <div className="mx-auto max-w-3xl">
                <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-start sm:items-center gap-3 sm:gap-4 md:gap-8 text-sm md:text-base">
                  <a
                    href="tel:+19792717552"
                    className="w-full sm:w-auto flex items-center gap-2 text-gray-700 hover:text-brand-coral transition-colors break-words"
                  >
                    <Phone className="w-4 h-4 text-brand-coral shrink-0" />
                    <span className="font-semibold">+1 979 271 7552</span>
                  </a>

                  <div className="hidden md:block h-4 w-px bg-gray-300" />

                  <a
                    href={`mailto:${regionConfig.email}`}
                    className="w-full sm:w-auto flex items-center gap-2 text-gray-700 hover:text-brand-coral transition-colors break-words"
                  >
                    <Mail className="w-4 h-4 text-brand-coral shrink-0" />
                    <span className="font-semibold break-words">
                      {regionConfig.email}
                    </span>
                  </a>

                  <div className="hidden md:block h-4 w-px bg-gray-300" />

                  <div className="w-full sm:w-auto flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-brand-coral shrink-0" />
                    <span className="font-semibold whitespace-nowrap">
                      Mon – Fri 9AM – 6PM EST
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards Row */}
            <div className="max-w-5xl mx-auto mt-8 sm:mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Email Card */}
                <Card className="text-center h-full shadow-sm">
                  <CardContent className="p-5 sm:p-6 h-full flex flex-col items-center justify-center">
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <div className="w-10 h-10 bg-brand-coral/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-brand-coral" />
                      </div>
                      <h3 className="font-bold text-lg text-brand-purple">
                        {regionConfig.code === "DE" ? "E-Mail" : "Email"}
                      </h3>
                    </div>

                    <a
                      href={`mailto:${regionConfig.email}`}
                      className="text-brand-purple font-semibold hover:text-brand-coral transition-colors mb-2 break-words"
                    >
                      {regionConfig.email}
                    </a>

                    <p className="text-xs text-gray-500 text-center">
                      {regionConfig.code === "DE"
                        ? "Antwort innerhalb von 24 Stunden"
                        : "Response within 24 hours"}
                    </p>
                  </CardContent>
                </Card>

                {/* Book Call Card */}
                <Card className="text-center h-full shadow-sm">
                  <CardContent className="p-5 sm:p-6 h-full flex flex-col items-center justify-center">
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <div className="w-10 h-10 bg-brand-coral/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-brand-coral" />
                      </div>
                      <h3 className="font-bold text-lg text-brand-purple">
                        {regionConfig.code === "DE"
                          ? "Termin buchen"
                          : "Book Call"}
                      </h3>
                    </div>

                    <p className="text-gray-600 mb-4 text-base text-center">
                      {regionConfig.code === "DE"
                        ? "Kostenloses Strategiegespräch"
                        : "Free strategy consultation"}
                    </p>

                    <div className="w-full sm:w-auto">
                      <BookCallButtonWithModal
                        buttonLabel="Book Now"
                        className="w-full sm:w-auto bg-brand-coral hover:bg-brand-coral/90 text-white"
                        buttonSize="lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- CONTACT FORM ---------------- */}
        <section className="bg-gray-50">
          <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-purple mb-3 sm:mb-4">
                  {regionConfig.code === "DE"
                    ? "Projekt starten"
                    : "Start Your Project Today"}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600">
                  {regionConfig.code === "DE"
                    ? "Erzählen Sie uns von Ihrem Projekt und wir melden uns innerhalb von 24 Stunden"
                    : "Tell us about your project and we'll get back to you within 24 hours"}
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <ContactFormOptimized />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- OTHER METHODS ---------------- */}
        <section className="bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4">
                  {regionConfig.code === "DE"
                    ? "Weitere Kontaktmöglichkeiten"
                    : "Other Ways to Reach Us"}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-white/90">
                  {regionConfig.code === "DE"
                    ? "Wählen Sie die Methode, die am besten zu Ihnen passt"
                    : "Choose the method that works best for you"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* Sales */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-5 sm:p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      {regionConfig.code === "DE"
                        ? "Verkaufsanfragen"
                        : "Sales Inquiries"}
                    </h3>

                    <div className="space-y-2 text-sm text-white/80 break-words">
                      <p>
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:raje@brandingbeez.co.uk"
                          className="hover:text-white transition-colors break-words"
                        >
                          raje@brandingbeez.co.uk
                        </a>
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        <a
                          href="tel:+19792717552"
                          className="hover:text-white transition-colors"
                        >
                          +1 979 271 7552
                        </a>
                      </p>
                      <p>
                        <strong>
                          {regionConfig.code === "DE"
                            ? "Ideal für:"
                            : "Best for:"}
                        </strong>{" "}
                        {regionConfig.code === "DE"
                          ? "Neue Projekte, Preisfragen"
                          : "New project discussions, pricing questions"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Careers */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-5 sm:p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Headphones className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      {regionConfig.code === "DE" ? "Karriere" : "Careers"}
                    </h3>

                    <div className="space-y-2 text-sm text-white/80 break-words">
                      <p>
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:hr@brandingbeez.co.uk"
                          className="hover:text-white transition-colors break-words"
                        >
                          hr@brandingbeez.co.uk
                        </a>
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        <a
                          href="tel:+917200626556"
                          className="hover:text-white transition-colors"
                        >
                          +91 72006 26556
                        </a>
                      </p>
                      <p>
                        <strong>
                          {regionConfig.code === "DE"
                            ? "Ideal für:"
                            : "Best for:"}
                        </strong>{" "}
                        {regionConfig.code === "DE"
                          ? "Stellenbewerbungen"
                          : "Job applications & career opportunities"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Partnerships */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-5 sm:p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      {regionConfig.code === "DE"
                        ? "Partnerschaften"
                        : "Partnerships"}
                    </h3>

                    <div className="space-y-2 text-sm text-white/80 break-words">
                      <p>
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:info@brandingbeez.co.uk"
                          className="hover:text-white transition-colors break-words"
                        >
                          info@brandingbeez.co.uk
                        </a>
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        <a
                          href="tel:+19792717552"
                          className="hover:text-white transition-colors"
                        >
                          +1 979 271 7552
                        </a>
                      </p>
                      <p>
                        <strong>
                          {regionConfig.code === "DE"
                            ? "Ideal für:"
                            : "Best for:"}
                        </strong>{" "}
                        {regionConfig.code === "DE"
                          ? "Agentur-Partnerschaften"
                          : "Agency partnerships"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
