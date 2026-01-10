// src/pages/AppointmentPage.tsx
import React from "react";
import { AppointmentCalendar } from "@/components/book-appoinment";
// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
import { Helmet } from "react-helmet";
import RajeImage from "../../public/images/raje-team-member.png";

export default function AppointmentPage() {
  return (
    <>
      <Helmet>
        <title>Book a Strategy Call | BrandingBeez</title>
        <meta
          name="description"
          content="Schedule your free 30–45 minute strategy session with BrandingBeez to discuss your website, SEO, or AI automation goals."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Optional Header */}
        {/* <Header /> */}

        {/* Page padding tuned for 320px -> desktop */}
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <div className="mx-auto w-full max-w-5xl space-y-8 sm:space-y-10">
            {/* Header block */}
            <section className="text-center">
              <h1 className="text-[24px] leading-tight sm:text-4xl lg:text-[36px] font-bold text-brand-coral">
                Book Your Appointment with BrandingBeez
              </h1>

              <div className="mt-4 sm:mt-4 mx-auto w-full max-w-3xl">
                {/* Card-style info area */}
                <div
                  className="px-4 py-2 sm:px-3 sm:py-4 backdrop-blur">
                  {/*  shadow-[0_10px_30px_rgba(0,0,0,0.35)] rounded-2xl border border-white/10 bg-white/5 */}
                  {/* Mobile: stack; Tablet/Desktop: row */}
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5 text-left">
                    {/* Profile image */}
                    <div className="shrink-0">
                      <div className="rounded-full overflow-hidden border-2 border-brand-coral shadow-md">
                        <img
                          src={RajeImage}
                          alt="Raje"
                          className="
                            block object-cover
                            w-[64px] h-[64px]
                            sm:w-[72px] sm:h-[72px]
                            lg:w-[80px] lg:h-[80px]
                          "
                        />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="w-full">
                      <span className="block text-[12px] sm:text-sm text-slate-400">
                        Schedule a one-on-one strategy call with our CEO, Raje.
                      </span>

                      <p className="mt-2 text-[13px] sm:text-[14px] lg:text-[15px] text-slate-300 leading-relaxed">
                        Choose a time that works for you a focused one-to-one call where we break down your goals,
                        explore solutions, and map the next steps for your agency’s growth.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Calendar wrapper for consistent spacing on all screens */}
            <section className="w-full">
              <div className="py-2 sm:py-3 lg:py-4 backdrop-blur">
                <AppointmentCalendar />
              </div>
            </section>
          </div>
        </main>

        {/* Optional Footer */}
        {/* <Footer /> */}
      </div>
    </>
  );
}
