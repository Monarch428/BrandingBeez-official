import React from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDot,
  CircleHelp,
  Clock,
  Handshake,
  Laptop,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import dental_hero_image from "../../public/images/Modern_Dental_Clinic.png";

const getItems = [
  {
    icon: <Laptop className="h-4 w-4" />,
    title: "Landing Page That Converts",
    desc: "Turn casual visitors into treatment-ready enquiries with a clear, conversion-focused page.",
    tint: "bg-[#fff0f5] text-[#f03f7d]",
  },
  {
    icon: <CalendarDays className="h-4 w-4" />,
    title: "Built-In Booking System",
    desc: "Let patients book directly or submit appointment requests with a guided experience.",
    tint: "bg-[#f3eefe] text-[#6b46a6]",
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    title: "Lead Capture Ready",
    desc: "Inquiry forms are structured to capture names, needs, and treatment intent together.",
    tint: "bg-[#fff4ea] text-[#dc8b2d]",
  },
];

const clinicCards = [
  {
    tag: "HIGH VALUE",
    title: "Dental Implants Landing Page",
    description:
      "Designed to capture implant enquiries and increase treatment acceptance.",
    preview: (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-[5px] w-[34px] rounded-full bg-[#e8a4b8]" />
            <div className="mt-3 h-[8px] w-[134px] rounded-full bg-[#342453]" />
            <div className="mt-2 h-[4px] w-[170px] rounded-full bg-[#dbd6e5]" />
          </div>

          <div className="mt-1 flex gap-1.5">
            <div className="h-[4px] w-[10px] rounded-full bg-[#dde2ee]" />
            <div className="h-[4px] w-[10px] rounded-full bg-[#dde2ee]" />
          </div>
        </div>

        <div className="flex h-[56px] items-center justify-center rounded-[10px] border border-[#edf1f6] bg-[#f7f8fb]">
          <div className="h-5 w-5 rounded-[4px] border border-[#dfe4ee]" />
        </div>

        <div className="rounded-[8px] bg-gradient-to-r from-[#cb0d4f] to-[#f45c78] py-[9px] text-center text-[9px] font-bold text-white">
          Book Free Consultation
        </div>
      </div>
    ),
  },
  {
    tag: "COSMETIC",
    title: "Cosmetic Dentistry Landing Page",
    description:
      "Built for cosmetic bookings and showcasing elite smile transformations.",
    preview: (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-[5px] w-[34px] rounded-full bg-[#e8a4b8]" />
            <div className="mt-3 h-[8px] w-[116px] rounded-full bg-[#342453]" />
            <div className="mt-2 h-[4px] w-[176px] rounded-full bg-[#dbd6e5]" />
          </div>

          <div className="mt-1 flex gap-1.5">
            <div className="h-[4px] w-[10px] rounded-full bg-[#dde2ee]" />
            <div className="h-[4px] w-[10px] rounded-full bg-[#dde2ee]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex h-[48px] items-center justify-center rounded-[10px] border border-[#edf1f6] bg-[#f7f8fb]">
            <div className="h-4 w-4 rounded-full bg-[#d5d2df]" />
          </div>
          <div className="flex h-[48px] items-center justify-center rounded-[10px] border border-[#edf1f6] bg-[#f7f8fb]">
            <div className="h-4 w-4 rounded-full bg-[#d5d2df]" />
          </div>
        </div>

        <div className="rounded-[8px] bg-[#59417f] py-[9px] text-center text-[9px] font-bold text-white">
          Claim New Smile Offer
        </div>
      </div>
    ),
  },
  {
    tag: "URGENT CARE",
    title: "Emergency Dentist Landing Page",
    description:
      "Optimised for urgent patient calls and immediate booking conversion.",
    preview: (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-[5px] w-[34px] rounded-full bg-[#e8a4b8]" />
            <div className="mt-3 h-[8px] w-[108px] rounded-full bg-[#342453]" />
            <div className="mt-2 h-[4px] w-[126px] rounded-full bg-[#ff4f78]" />
          </div>

          <div className="rounded-full bg-[#ffe8ee] px-2 py-[3px] text-[6px] font-bold text-[#d4145a]">
            OPEN NOW
          </div>
        </div>

        <div className="rounded-[10px] border border-[#edf1f6] bg-[#f7f8fb] p-3">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="h-[5px] w-[5px] rounded-full bg-[#ff4f78]" />
              <div className="h-[4px] w-[58px] rounded-full bg-[#d7dcea]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="h-[5px] w-[5px] rounded-full bg-[#ff4f78]" />
              <div className="h-[4px] w-[46px] rounded-full bg-[#d7dcea]" />
            </div>
          </div>
        </div>

        <div className="rounded-[8px] bg-[#c91521] py-[9px] text-center text-[9px] font-bold text-white">
          Call Now / Book Online
        </div>
      </div>
    ),
  },
];

const searchCards = [
  {
    title: "Dental implants\nnear me",
    sub: "HIGH-VALUE PATIENTS",
    dark: false,
    outline: false,
    decor: "chart",
  },
  {
    title: "Cosmetic dentist\nnear me",
    sub: "READY-TO-BOOK INTENT",
    dark: true,
    outline: false,
    decor: "face",
  },
  {
    title: "Emergency\ndentist near me",
    sub: "URGENT DEMAND",
    dark: false,
    outline: true,
    decor: "medical",
  },
  {
    title: "Teeth whitening\nnear me",
    sub: "MASS MARKET DEMAND",
    dark: false,
    outline: false,
    decor: "sparkle",
  },
];

const treatmentTags = [
  {
    label: "Dental implants near me",
    icon: <Search className="h-3.5 w-3.5" />,
    tone: "text-[#e33a73]",
  },
  {
    label: "Cosmetic dentist near me",
    icon: <Sparkles className="h-3.5 w-3.5" />,
    tone: "text-[#5b3c83]",
  },
  {
    label: "Emergency dentist near me",
    icon: <Plus className="h-3.5 w-3.5" />,
    tone: "text-[#e23b55]",
  },
  {
    label: "Invisalign provider",
    icon: <Stethoscope className="h-3.5 w-3.5" />,
    tone: "text-[#d18a2d]",
  },
];

const steps = [
  {
    no: "1",
    title: "Understand Goals",
    text: "Short discovery call to see your clinic's needs.",
  },
  {
    no: "2",
    title: "Build Page",
    text: "We build your patient-focused landing page.",
  },
  {
    no: "3",
    title: "Set Up Booking",
    text: "We connect your form or booking flow.",
  },
  {
    no: "4",
    title: "Get Booked",
    text: "Patients get a smoother appointment path.",
  },
];

function Section({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`w-full ${className}`}>
      <div className="mx-auto w-full max-w-[1180px] px-3 max-[374px]:px-2 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        {children}
      </div>
    </section>
  );
}

function PillLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-full border border-[#f7bfd2] bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#ef4b84] shadow-sm sm:px-4 sm:py-1.5 sm:text-[10px]">
      {children}
    </div>
  );
}

function CtaButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff3f80] to-[#ff6b63] px-4 text-[13px] font-semibold text-white shadow-[0_14px_25px_rgba(255,77,125,0.34)] transition-transform duration-300 hover:scale-[1.02] max-[374px]:min-h-[46px] max-[374px]:px-3 max-[374px]:text-[12px] sm:w-auto sm:min-h-[52px] sm:px-6 sm:text-[13px] md:min-h-[54px] md:px-7 md:text-[14px] ${className}`}
    >
      {children}
      <ArrowRight className="ml-2 h-4 w-4" />
    </button>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] max-[374px]:max-w-full lg:mx-0">
      <div className="pointer-events-none absolute -left-4 -top-4 h-28 w-28 rounded-full bg-[#ff5c9f]/20 blur-3xl max-[374px]:h-24 max-[374px]:w-24 sm:-left-8 sm:-top-8 sm:h-40 sm:w-40 md:h-48 md:w-48" />
      <div className="pointer-events-none absolute -bottom-4 right-1 h-24 w-24 rounded-full bg-[#c79bff]/20 blur-3xl max-[374px]:h-20 max-[374px]:w-20 sm:-bottom-8 sm:right-2 sm:h-32 sm:w-32 md:h-40 md:w-40" />

      <div className="relative rotate-[1.5deg] overflow-visible rounded-[22px] bg-transparent max-[374px]:rotate-0 sm:rotate-[2deg] sm:rounded-[30px]">
        <div className="overflow-hidden rounded-[20px] border border-white/40 bg-[#ddd5e8] p-[7px] shadow-[0_20px_40px_rgba(45,24,79,0.18)] max-[374px]:rounded-[16px] max-[374px]:p-[6px] sm:rounded-[24px] sm:p-[8px] md:rounded-[28px] md:p-[10px] lg:rounded-[30px] lg:shadow-[0_28px_60px_rgba(45,24,79,0.22)]">
          <div className="relative overflow-hidden rounded-[16px] bg-[#efeaf4] max-[374px]:rounded-[14px] sm:rounded-[20px] md:rounded-[22px] lg:rounded-[24px]">
            <img
              src={dental_hero_image}
              alt="Modern dental clinic"
              className="block h-[220px] w-full object-cover max-[374px]:h-[190px] sm:h-[280px] md:h-[340px] lg:h-[390px] xl:h-[430px]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(34,18,58,0.08)_100%)]" />
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-10 rounded-[14px] border border-white/70 bg-white p-2.5 shadow-[0_14px_30px_rgba(38,20,66,0.18)] backdrop-blur-md max-[374px]:bottom-2 max-[374px]:left-2 max-[374px]:right-2 max-[374px]:p-2 sm:bottom-5 sm:left-5 sm:right-5 sm:rounded-[18px] sm:p-4 lg:bottom-6 lg:left-6 lg:right-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ea3678] to-[#ff6a84] text-white shadow-md sm:h-12 sm:w-12">
              <CalendarDays className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </div>
            <p className="max-w-[320px] text-[13px] font-semibold leading-5 text-[#2c2046] max-[374px]:text-[12px] max-[374px]:leading-4 sm:text-[14px] sm:leading-6 lg:max-w-[360px]">
              Patients book appointments directly through your page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowserCard({ accent }: { accent: string }) {
  return (
    <div className="rounded-[14px] border border-[#f1edf4] bg-white p-2.5 shadow-sm">
      <div className="mb-2 flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff8a8a]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#f4c96b]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#8dd786]" />
      </div>
      <div className="rounded-[10px] border border-[#f4f0f7] bg-[#fbf9fd] p-3">
        <div className="mb-2 h-2 w-20 rounded-full bg-[#eee9f3]" />
        <div className="space-y-2">
          <div className="h-7 rounded-md bg-[#f3eef7]" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-5 rounded-md bg-[#f6f2fa]" />
            <div className="h-5 rounded-md bg-[#f6f2fa]" />
          </div>
          <div className={`h-2.5 rounded-full bg-gradient-to-r ${accent}`} />
        </div>
      </div>
    </div>
  );
}

function DemoCard({
  badge,
  title,
  desc,
  accent,
  button,
}: {
  badge: string;
  title: string;
  desc: string;
  accent: string;
  button: string;
}) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#ede6f4] bg-white shadow-[0_12px_30px_rgba(54,37,88,0.08)]">
      <div className="p-3 sm:p-4">
        <BrowserCard accent={accent} />
      </div>
      <div className="space-y-4 px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="inline-flex rounded-md bg-[#fbe7ef] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#d62d68]">
          {badge}
        </div>
        <div>
          <h3 className="text-[20px] font-extrabold leading-[1.2] text-[#2f2148]">
            {title}
          </h3>
          <p className="mt-2 text-[14px] leading-6 text-[#6d6680]">{desc}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex min-h-[46px] items-center justify-center rounded-xl bg-[#2d1c4e] px-4 text-[14px] font-bold text-white">
            {button}
          </button>
          <button className="flex min-h-[46px] items-center justify-center rounded-xl border border-[#ddd2ea] bg-white px-4 text-[14px] font-bold text-[#2d1c4e]">
            View Demo
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientBookingLandingPage() {
  return (
    <div className="min-h-screen bg-[#f6eff8] text-[#2d1f46]">
      <Section className="overflow-hidden bg-[#f3edf7] pb-12 pt-8 max-[374px]:pb-10 max-[374px]:pt-6 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-14">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_540px] xl:gap-14">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#efe3f6] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#d4145a] shadow-[0_4px_12px_rgba(212,20,90,0.08)]">
              <span className="h-2 w-2 rounded-full bg-[#d4145a]" />
              Built for clinics focused on patient growth
            </div>

            <h1 className="mt-5 max-w-[520px] text-[30px] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#2f1f4a] max-[374px]:text-[26px] max-[374px]:leading-[1.06] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[54px]">
              We Build Your Patient
              <br />
              Booking System–
              <br />
              <span className="text-[#d4145a]">Free</span>
            </h1>

            <p className="mt-5 max-w-[470px] text-[14px] leading-[1.7] text-[#4f4168] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
              Landing page + booking system designed to help your clinic get
              more dental implant and cosmetic patients from Google.
            </p>

            <div className="mt-5 max-w-[520px] rounded-[14px] border border-[#eadff0] bg-[#f1e7f5] px-4 py-3 text-[13px] leading-[1.65] text-[#5b4b76] max-[374px]:px-3 max-[374px]:py-2.5 max-[374px]:text-[12px] sm:text-[14px]">
              Built for searches like:
              <span className="font-medium text-[#d4145a]">
                {" "}
                dental implants near me, cosmetic dentist near me, teeth
                whitening near me.
              </span>
            </div>

            <div className="mt-7">
              <button className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#cb0d4f] to-[#f5657b] px-5 text-[14px] font-extrabold text-white shadow-[0_14px_26px_rgba(212,20,90,0.26)] transition-transform duration-300 hover:scale-[1.02] max-[374px]:min-h-[48px] max-[374px]:px-4 max-[374px]:text-[13px] sm:w-auto sm:min-h-[56px] sm:px-7 sm:text-[15px] lg:min-h-[58px] lg:px-8 lg:text-[16px]">
                Get My Free Booking System
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <HeroVisual />
          </div>
        </div>
      </Section>

      <Section className="rounded-t-[34px] bg-[#f2eaf8] py-14 sm:py-16 lg:rounded-t-[42px] lg:py-20">
        <div className="text-center">
          <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#30204b] max-[374px]:text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px]">
            What You Get (Free Setup)
          </h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-[#8a8197] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
            Everything set up so patients can book directly.
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {getItems.map((item) => (
            <div
              key={item.title}
              className="rounded-[18px] border border-white/60 bg-white p-5 text-center shadow-sm sm:p-6"
            >
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${item.tint}`}
              >
                {item.icon}
              </div>
              <h3 className="mt-4 text-[17px] font-extrabold leading-6 text-[#30204b]">
                {item.title}
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-[#7b7487]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-[#f3f3f4] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto">
          <div className="text-center">
            <h2 className="text-[26px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#322055] max-[374px]:text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px]">
              See What We Build for Your Clinic
            </h2>

            <p className="mx-auto mt-4 max-w-[700px] text-[14px] leading-[1.7] text-[#6d5a8b] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
              Premium, conversion-focused landing pages designed for the most
              profitable dental treatments.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {clinicCards.map((card) => (
              <div
                key={card.title}
                className="overflow-hidden rounded-[18px] border border-[#ebe7ef] bg-white shadow-[0_10px_30px_rgba(37,22,63,0.04)]"
              >
                <div className="border-b border-[#edeaf1] bg-[#f4f6f9] p-4">
                  <div className="overflow-hidden rounded-[12px] border border-[#ece8f1] bg-white">
                    <div className="flex items-center gap-1.5 border-b border-[#eff1f5] bg-[#f6f7fa] px-4 py-2.5">
                      <span className="h-[6px] w-[6px] rounded-full bg-[#ff6e78]" />
                      <span className="h-[6px] w-[6px] rounded-full bg-[#f4be4f]" />
                      <span className="h-[6px] w-[6px] rounded-full bg-[#57c26d]" />
                    </div>

                    <div className="bg-white p-4">{card.preview}</div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="inline-flex rounded-[7px] bg-[#f8dfe7] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#c61a56]">
                    {card.tag}
                  </div>

                  <h3 className="mt-5 text-[20px] font-extrabold leading-[1.28] tracking-[-0.02em] text-[#30204b]">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-[15px] leading-[1.6] text-[#6e6185]">
                    {card.description}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 rounded-[12px] bg-[#402a69] px-5 py-3.5 text-[15px] font-bold text-white shadow-[0_5px_12px_rgba(64,42,105,0.18)] transition-all duration-300 hover:translate-y-[-1px]">
                      Preview
                    </button>

                    <button className="rounded-[12px] border border-[#e4dced] bg-white px-5 py-3.5 text-[15px] font-bold text-[#3c2a64] transition-all duration-300 hover:bg-[#faf8fd]">
                      View Demo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <button className="inline-flex min-h-[68px] items-center gap-2 rounded-full bg-gradient-to-r from-[#cb0d4f] to-[#f5657b] px-10 text-[16px] font-extrabold text-white shadow-[0_16px_30px_rgba(212,20,90,0.22)] transition-transform duration-300 hover:scale-[1.02]">
              Get My Free Patient Booking System
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Section>

      <Section className="bg-[radial-gradient(circle_at_18%_50%,rgba(214,44,106,0.22),transparent_28%),linear-gradient(135deg,#261545_0%,#3b2564_100%)] py-0">
        <div className="mx-auto overflow-hidden px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
            <div>
              <h2 className="text-[26px] font-extrabold leading-[1.06] tracking-[-0.03em] text-white max-[374px]:text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px]">
                Most Dental Websites
                <br />
                Don’t Turn Visitors into
                <br />
                Booked Appointments
              </h2>
            </div>

            <div className="rounded-[22px] border border-white/12 bg-white/[0.06] p-6 text-[#e9dff7] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[2px] sm:p-7 lg:p-8">
              <p className="text-[14px] italic leading-[1.7] text-[#f4ecff] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                “Which means you’re losing potential patients every day.”
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#ff3f6f]"
                    strokeWidth={2.4}
                  />
                  <p className="text-[14px] leading-[1.7] text-[#ddd1ee] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                    Outdated contact forms that people ignore.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#ff3f6f]"
                    strokeWidth={2.4}
                  />
                  <p className="text-[14px] leading-[1.7] text-[#ddd1ee] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                    No direct way to see available slots.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#ff3f6f]"
                    strokeWidth={2.4}
                  />
                  <p className="text-[14px] leading-[1.7] text-[#ddd1ee] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                    Mobile experience that makes booking impossible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-[#f3edf7] py-14 sm:py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#2f1f4a] max-[374px]:text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px]">
            Patients Are Already Searching
          </h2>

          <p className="mx-auto mt-4 max-w-[760px] text-[14px] leading-[1.7] text-[#5c4d79] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
            These are high-intent searches patients ready to book, not just
            browse.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {searchCards.map((card) => (
            <div
              key={card.title}
              className={[
                "relative overflow-hidden rounded-[18px] px-8 pb-8 pt-9",
                "min-h-[166px]",
                card.dark
                  ? "bg-[#3b2661] text-white"
                  : "bg-[#e8daf7] text-[#d4145a]",
                card.outline
                  ? "border border-[#e5a0c0]"
                  : "border border-transparent",
              ].join(" ")}
            >
              {card.decor === "chart" && (
                <img
                  src="/icons/search-chart.png"
                  alt=""
                  className="pointer-events-none absolute right-0 top-0 h-[74px] w-[74px] opacity-[0.16]"
                />
              )}

              {card.decor === "face" && (
                <img
                  src="/icons/search-face.png"
                  alt=""
                  className="pointer-events-none absolute right-0 top-0 h-[84px] w-[84px] opacity-[0.16]"
                />
              )}

              {card.decor === "medical" && (
                <img
                  src="/icons/search-medical.png"
                  alt=""
                  className="pointer-events-none absolute right-0 top-0 h-[82px] w-[82px] opacity-[0.16]"
                />
              )}

              {card.decor === "sparkle" && (
                <img
                  src="/icons/search-sparkle.png"
                  alt=""
                  className="pointer-events-none absolute right-0 top-0 h-[84px] w-[84px] opacity-[0.16]"
                />
              )}

              <div className="relative z-10 flex min-h-[72px] items-start">
                <h3
                  className={`whitespace-pre-line text-[23px] font-extrabold leading-[1.05] tracking-[-0.02em] ${
                    card.dark ? "text-[#e5ccff]" : "text-[#d4145a]"
                  }`}
                >
                  {card.title}
                </h3>
              </div>

              <div
                className={`relative z-10 mt-7 h-[3px] rounded-full ${
                  card.dark ? "bg-[#715890]" : "bg-[#d8c9ea]"
                }`}
              >
                <div
                  className={`h-[3px] rounded-full ${
                    card.dark
                      ? "w-[88%] bg-[#efe3ff]"
                      : "w-[72%] bg-gradient-to-r from-[#d4145a] to-[#ff6479]"
                  }`}
                />
              </div>

              <div
                className={`relative z-10 mt-4 text-[12px] font-semibold uppercase tracking-[0.16em] ${
                  card.dark ? "text-[#efe3ff]" : "text-[#35245a]"
                }`}
              >
                {card.sub}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-[#efe4f8] py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-[560px]">
            <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#2f1f4a] max-[374px]:text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px]">
              Turn Your Website into a Patient Booking System
            </h2>

            <p className="mt-5 max-w-[560px] text-[14px] leading-[1.7] text-[#4f4168] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
              Built specifically to turn visitors into booked appointments.
              Optimised for local search so your clinic shows up when patients
              search for treatments in your area.
            </p>

            <div className="mt-10 space-y-9">
              <div className="flex items-start gap-5">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ea2d72] to-[#ff5d74] shadow-[0_10px_24px_rgba(234,45,114,0.22)]">
                  <Laptop className="h-[18px] w-[18px] text-white" />
                </div>

                <div>
                  <h3 className="text-[20px] font-extrabold leading-none text-[#2f1f4a] sm:text-[21px]">
                    High-Speed Landing Page
                  </h3>
                  <p className="mt-3 max-w-[430px] text-[14px] leading-[1.7] text-[#43355c] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                    Optimised for Google and local SEO so you show up where
                    patients search.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#4a356f] shadow-[0_10px_24px_rgba(74,53,111,0.18)]">
                  <CalendarDays className="h-[18px] w-[18px] text-white" />
                </div>

                <div>
                  <h3 className="text-[20px] font-extrabold leading-none text-[#2f1f4a] sm:text-[21px]">
                    One-Click Booking Interface
                  </h3>
                  <p className="mt-3 max-w-[470px] text-[14px] leading-[1.7] text-[#43355c] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                    Simple, intuitive calendar that integrates with your current
                    software.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ea2d72] to-[#ff5d74] shadow-[0_10px_24px_rgba(234,45,114,0.22)]">
                  <Check className="h-[18px] w-[18px] text-white" />
                </div>

                <div>
                  <h3 className="text-[20px] font-extrabold leading-none text-[#2f1f4a] sm:text-[21px]">
                    Strategic Lead Capture
                  </h3>
                  <p className="mt-3 max-w-[480px] text-[14px] leading-[1.7] text-[#43355c] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                    Optimized forms and CTAs designed to secure patient details
                    immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[560px] lg:mx-0">
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-3 rounded-full bg-[#f4edf9] px-4 py-2.5 text-[13px] font-bold text-[#4a356f] shadow-[0_6px_18px_rgba(88,62,122,0.05)] max-[374px]:px-3 max-[374px]:text-[12px] sm:px-5 sm:py-3 sm:text-[15px]">
                <span>We transform this</span>
                <span className="text-[#ff4a73]">→</span>
                <span>into this</span>
              </div>
            </div>

            <div className="relative mt-6 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-5">
              <div className="relative w-[255px] rounded-[20px] border border-[#ddd3ea] bg-[#f1ecf5]/70 px-5 pb-5 pt-4 opacity-90 shadow-[0_10px_30px_rgba(61,41,88,0.04)] backdrop-blur-[2px] sm:w-[270px]">
                <div className="inline-flex rounded-full bg-[#d8d0e3] px-4 py-[6px] text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#7c7390]">
                  Before
                </div>

                <div className="mt-5">
                  <div className="h-[14px] w-[76%] rounded-full bg-[#dfd7e8]" />

                  <div className="mt-4 space-y-3">
                    <div className="h-[6px] w-[90%] rounded-full bg-[#e6deee]" />
                    <div className="h-[6px] w-[86%] rounded-full bg-[#e6deee]" />
                    <div className="h-[6px] w-[79%] rounded-full bg-[#e6deee]" />
                  </div>

                  <div className="mt-6 rounded-[14px] border border-dashed border-[#ded4ea] px-4 py-4">
                    <div className="space-y-3 text-[11px] leading-none text-[#a49bb5]">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px]">×</span>
                        <span>No clear booking option</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px]">×</span>
                        <span>Visitors leave without contacting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px]">×</span>
                        <span>No strong call-to-action</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-16 text-center text-[16px] leading-none text-[#8f84a3]">
                    Visitors come... but don&apos;t book
                  </p>
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 z-10 flex h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#e53b73] shadow-[0_14px_30px_rgba(61,41,88,0.14)] max-[767px]:static max-[767px]:translate-x-0 max-[767px]:translate-y-0">
                <ArrowRight className="h-[20px] w-[20px]" />
              </div>

              <div className="relative w-[255px] rounded-[22px] border border-[#efbfd0] bg-[#fffdfd] px-5 pb-5 pt-4 shadow-[0_0_0_6px_rgba(247,194,209,0.16),0_18px_34px_rgba(227,57,114,0.08)] sm:w-[270px]">
                <div className="inline-flex rounded-full bg-[#c60d4e] px-4 py-[6px] text-[10px] font-extrabold uppercase tracking-[0.14em] text-white">
                  After
                </div>

                <div className="mt-6">
                  <h3 className="text-[16px] font-extrabold text-[#2f1f4a] sm:text-[17px]">
                    Dental Implants
                  </h3>

                  <div className="mt-4 grid grid-cols-4 gap-[10px]">
                    <div className="rounded-[10px] bg-[#f2eafb] py-4 text-center text-[11px] font-bold text-[#4d3d67]">
                      Mon
                    </div>
                    <div className="rounded-[10px] bg-[#f2eafb] py-4 text-center text-[11px] font-bold text-[#4d3d67]">
                      Tue
                    </div>
                    <div className="rounded-[10px] border border-[#f3b7c8] bg-[#fff0f5] py-4 text-center text-[11px] font-bold text-[#d51d5f]">
                      Wed
                    </div>
                    <div className="rounded-[10px] bg-[#f2eafb] py-4 text-center text-[11px] font-bold text-[#4d3d67]">
                      Thu
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-[10px]">
                    <div className="rounded-[10px] bg-[#f5eefc] py-3 text-center text-[11px] font-medium text-[#2f1f4a]">
                      09:00 AM
                    </div>
                    <div className="rounded-[10px] border border-[#f3b7c8] bg-white py-3 text-center text-[11px] font-extrabold text-[#d51d5f]">
                      10:30 AM
                    </div>
                  </div>

                  <button className="mt-4 w-full rounded-[12px] bg-gradient-to-r from-[#d71258] to-[#ff5f74] py-[15px] text-[13px] font-extrabold text-white shadow-[0_12px_24px_rgba(231,52,109,0.22)]">
                    Book Appointment
                  </button>

                  <p className="mt-3 text-center text-[10px] font-medium text-[#e33972]">
                    Patients book instantly — no follow-up needed
                  </p>

                  <div className="mt-7 flex items-center justify-center gap-1 text-center text-[12px] font-extrabold text-[#d51d5f]">
                    <span>↗</span>
                    <span>Consistent daily enquiries</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-7 text-center text-[15px] text-[#6d5e84]">
              This is the exact system we set up for your clinic
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="text-center">
          <div className="inline-flex rounded-full border border-[#efe3f7] bg-[#faf7fd] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8d829c]">
            Hyper-local patient targeting
          </div>
          <h2 className="mt-5 text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#30204b] max-[374px]:text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px]">
            Show Up When Patients Search for Treatments
          </h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[14px] leading-[1.7] text-[#807889] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
            We structure your page around how patients actually search:
          </p>
        </div>

        <div className="mx-auto mt-7 grid max-w-[920px] gap-4 sm:grid-cols-2">
          {treatmentTags.map((tag) => (
            <div
              key={tag.label}
              className="flex items-center justify-center gap-3 rounded-2xl border border-[#eee5f5] bg-[#f8f2fc] px-5 py-4 text-center"
            >
              <span className={tag.tone}>{tag.icon}</span>
              <span className="text-[15px] font-bold text-[#30204b]">
                {tag.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <div className="rounded-2xl border border-[#f6d2dc] bg-[#fff4f7] px-6 py-4 text-center text-[16px] font-extrabold text-[#e33972] sm:text-[20px]">
            So your clinic appears when patients are ready to book.
          </div>
        </div>
      </Section>

      <Section className="bg-[#f5eef8] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1120px]">
          <div className="text-center">
            <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#2f1f4a] max-[374px]:text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px]">
              How It Works
            </h2>
          </div>

          <div className="relative mt-14 sm:mt-16">
            <div className="absolute left-[6%] right-[6%] top-[24px] hidden h-px bg-[#e2d8ea] lg:block" />

            <div className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-6">
              {steps.map((step, index) => {
                const isSecond = index === 1;
                const isLast = index === 3;

                return (
                  <div key={step.no} className="relative text-center">
                    <div
                      className={[
                        "relative z-10 mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full text-[16px] font-extrabold transition-all",
                        isLast
                          ? "border border-[#ef4c7b] bg-gradient-to-br from-[#ff5b86] to-[#e62e69] text-white shadow-[0_12px_24px_rgba(239,76,123,0.35)]"
                          : isSecond
                            ? "border-[3px] border-[#ceb5f3] bg-[#f7f1fd] text-[#2f1f4a]"
                            : "border-[3px] border-[#f06283] bg-[#f9f4fb] text-[#2f1f4a]",
                      ].join(" ")}
                    >
                      {step.no}
                    </div>

                    <h3 className="mt-6 text-[18px] font-extrabold leading-[1.2] text-[#2f1f4a] sm:text-[19px]">
                      {step.title}
                    </h3>

                    <p className="mx-auto mt-3 max-w-[235px] text-[14px] leading-[1.7] text-[#4a3b66] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                      {step.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-[#f3e9fb] py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-[640px] rounded-[20px] border border-[#ece7f1] bg-[#f8f8f8] px-6 py-10 text-center shadow-[0_20px_40px_rgba(47,31,74,0.12)] sm:px-10 sm:py-12">
            <div className="mx-auto flex items-center justify-center text-[#d4145a]">
              <Handshake
                className="h-9 w-9 sm:h-10 sm:w-10"
                strokeWidth={2.2}
              />
            </div>

            <h2 className="mt-6 text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#2f1f4a] max-[374px]:text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px]">
              Why Free?
            </h2>

            <p className="mx-auto mt-5 max-w-[540px] text-[14px] leading-[1.7] text-[#4b3a69] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
              "We believe in results-first relationships. We build the
              infrastructure for free because we know once you see the bookings
              coming in, you'll want to grow with us long-term."
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-4 text-[16px] font-extrabold text-[#2f1f4a] sm:flex-row sm:gap-8">
              <div className="flex items-center gap-2.5">
                <BadgeCheck
                  className="h-5 w-5 text-[#e0326a]"
                  strokeWidth={2.2}
                />
                <span>No hidden costs</span>
              </div>

              <div className="flex items-center gap-2.5">
                <BadgeCheck
                  className="h-5 w-5 text-[#e0326a]"
                  strokeWidth={2.2}
                />
                <span>No long-term commitment</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-[#f4edf8] py-14 sm:py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#2f1f4a] max-[374px]:text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px]">
            What Changes Once This Is Set Up
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[20px] bg-[#eadcf7] px-7 py-7 sm:px-8 sm:py-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center text-[#d4145a]">
                <TrendingUp className="h-6 w-6" strokeWidth={2.3} />
              </div>

              <div>
                <h3 className="text-[18px] font-extrabold leading-none text-[#2f1f4a] sm:text-[19px]">
                  Direct Online Bookings
                </h3>

                <p className="mt-3 max-w-[420px] text-[14px] leading-[1.7] text-[#342452] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                  Stop sending people to a phone number. 60% of patients prefer
                  booking online after hours.
                </p>

                <div className="mt-5 flex items-start gap-2.5">
                  <div className="mt-[2px] text-[#d4145a]">
                    <CircleDot className="h-4 w-4" strokeWidth={2.3} />
                  </div>
                  <p className="max-w-[420px] text-[14px] font-extrabold leading-[1.7] text-[#d4145a] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                    More high-value treatments like implants and cosmetic
                    procedures
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] bg-[#eadcf7] px-7 py-7 sm:px-8 sm:py-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center text-[#d4145a]">
                <Users className="h-6 w-6" strokeWidth={2.3} />
              </div>

              <div>
                <h3 className="text-[18px] font-extrabold leading-none text-[#2f1f4a] sm:text-[19px]">
                  Consistent Enquiries
                </h3>

                <p className="mt-3 max-w-[430px] text-[14px] leading-[1.7] text-[#342452] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                  A predictable flow of new patients instead of relying on
                  unpredictable word-of-mouth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="rounded-b-[42px] bg-[#35235d] py-0">
        <div className="mx-auto max-w-[1120px] overflow-hidden px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-10">
            <div>
              <h2 className="text-[26px] font-extrabold leading-[1.06] tracking-[-0.03em] text-white max-[374px]:text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px]">
                This Is For You If:
              </h2>

              <div className="mt-7 space-y-6">
                <div className="flex items-start gap-4 text-[#f2ebfb]">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#d8c7f4]"
                    strokeWidth={2.2}
                  />
                  <p className="text-[14px] leading-[1.7] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                    You want more dental implant or cosmetic patients.
                  </p>
                </div>

                <div className="flex items-start gap-4 text-[#f2ebfb]">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#d8c7f4]"
                    strokeWidth={2.2}
                  />
                  <p className="text-[14px] leading-[1.7] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                    Your current website is not converting visitors.
                  </p>
                </div>

                <div className="flex items-start gap-4 text-[#f2ebfb]">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#d8c7f4]"
                    strokeWidth={2.2}
                  />
                  <p className="text-[14px] leading-[1.7] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                    You rely heavily on ads or referrals.
                  </p>
                </div>

                <div className="flex items-start gap-4 text-[#f2ebfb]">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#d8c7f4]"
                    strokeWidth={2.2}
                  />
                  <p className="text-[14px] leading-[1.7] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                    You want a consistent, automated flow of patients.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/14 bg-white/[0.10] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[2px] sm:p-8 lg:p-9">
              <h3 className="max-w-[420px] text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#eadcf9] sm:text-[34px]">
                Built for Clinics Serious About Growth
              </h3>

              <p className="mt-5 max-w-[460px] text-[14px] leading-[1.7] text-[#e1d4f0] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
                We work with a limited number of clinics to ensure proper setup
                and quality delivery. Each system is custom-built based on your
                treatments and patient flow.
              </p>

              <div className="mt-7 rounded-[16px] border border-white/12 bg-white/[0.07] px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3 text-[#f4ecff]">
                  <ShieldCheck
                    className="h-5 w-5 shrink-0 text-[#e6d8fa]"
                    strokeWidth={2.1}
                  />
                  <span className="text-[15px] font-medium sm:text-[16px]">
                    Quality-Focused Custom Infrastructure
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-[#f3edf7] py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#2f1f4a] max-[374px]:text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px]">
            Get Your Free Patient Booking System
          </h2>

          <p className="mx-auto mt-4 max-w-[680px] text-[14px] leading-[1.7] text-[#5e4f79] max-[374px]:text-[13px] sm:text-[15px] md:text-[16px]">
            Perfect for dental clinics looking to grow implant and cosmetic
            cases.
          </p>

          {/* CTA */}
          <div className="mt-10">
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4145a] to-[#ff5f74] px-8 py-4 text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(212,20,90,0.35)] transition-transform duration-300 hover:scale-[1.03]">
              Get My Free Patient Booking System
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Micro info row */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-6 text-[14px] text-[#5e4f79]">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#2f1f4a]" />
              <span>Setup takes 7–10 days</span>
            </div>

            <span className="hidden sm:block text-[#b7a8cc]">•</span>

            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-[#2f1f4a]" />
              <span>Custom built for your clinic</span>
            </div>
          </div>

          {/* Bottom line */}
          <p className="mt-10 text-[12px] uppercase tracking-[0.22em] text-[#8e7ea3]">
            Serving dental clinics across the US — New York, Texas, Florida,
            California
          </p>
        </div>
      </Section>
    </div>
  );
}
