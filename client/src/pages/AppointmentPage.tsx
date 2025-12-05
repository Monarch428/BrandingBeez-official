// src/pages/AppointmentPage.tsx
import React from "react";
import { AppointmentCalendar } from "@/components/book-appoinment";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Helmet } from "react-helmet";
import RajeImage from "../../public/images/raje-team-member.png"

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
            <div className="text-center mb-4">
              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl font-bold text-brand-coral mb-6">
                Book Your Appointment with BrandingBeez
              </h1>

              {/* Image + Text Row */}
              <div className="max-w-2xl mx-auto flex items-center justify-start gap-4 text-left">

                {/* Profile Image */}
                <div className=" rounded-full overflow-hidden border-2 border-brand-coral shadow-md">
                  <img
                    src={RajeImage}
                    alt="Raje"
                    className="w-20 h-22 object-cover"
                  />
                </div>

                {/* Text Column */}
                <div className="flex flex-col gap-2">
                  {/* Caption */}
                  <span className="text-xs sm:text-sm text-slate-400">
                    Schedule a one-on-one strategy call with our CEO, Raje.
                  </span>

                  {/* Main Description */}
                  <p className="text-[14px]  text-slate-300 leading-relaxed">
                    Choose a time that works for you, A focused one-to-one call where we break down your goals,
                    explore solutions, and map the next steps for your agency’s growth.
                  </p>
                </div>

              </div>
            </div>


            {/* Embedded Appointment Calendar */}
            <AppointmentCalendar />
          </div>
        </main >

        {/* Optional Footer */}
        {/* <Footer /> */}
      </div >
    </>
  );
}
