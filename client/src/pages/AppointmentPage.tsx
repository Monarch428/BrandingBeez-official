// src/pages/AppointmentPage.tsx
import React from "react";
import { AppointmentCalendar } from "@/components/book-appoinment";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Helmet } from "react-helmet";

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

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
        {/* Optional Header */}
        {/* <Header /> */}

        <main className="flex-1 container mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-brand-coral mb-3">
                Book a Strategy Call
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
                Select a date and time that works best for you. We’ll discuss your business goals, current digital setup, and how our AI-powered solutions can help.
              </p>
            </div>

            {/* Embedded Appointment Calendar */}
            <AppointmentCalendar />
          </div>
        </main>

        {/* Optional Footer */}
        {/* <Footer /> */}
      </div>
    </>
  );
}
