import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  Gauge,
  Globe,
  LineChart,
  MapPinned,
  Rocket,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { createSeoSetupLead } from "../lib/seoSetupLeadService";
import { useRef, useState } from "react";
import { ThankYouPopup } from "@/components/thank-you-popup";
import { navigate } from "wouter/use-browser-location";

const includedItems = [
  {
    icon: Wrench,
    title: "Fix Technical Issues",
    description:
      "We fix the basic technical problems that stop your pages from appearing on Google.",
    points: [
      "Broken pages (404 errors)",
      "Pages not indexed on Google",
      "Crawl issues",
    ],
    impact: "Your website can actually be found and read by Google.",
  },
  {
    icon: Gauge,
    title: "Website Speed Fixes",
    description:
      "We fix issues that affect how fast your site loads and how it works on mobile.",
    points: [
      "Basic speed improvements",
      "Mobile usability fixes",
      "Layout or loading issues",
    ],
    impact: "Better performance for both users and search engines.",
  },
  {
    icon: FileText,
    title: "Optimise Your Key Page",
    description:
      "We take one important page and optimise it properly for search.",
    points: [
      "Title and meta description",
      "Heading structure (H1, H2)",
      "Keyword placement",
    ],
    impact: "Your page is set up to rank for the right searches.",
  },
  {
    icon: Search,
    title: "Keyword Discovery",
    description:
      "We identify what your potential customers are already searching.",
    points: [
      "3–5 relevant keywords",
      "Keyword-to-page mapping",
      "Quick win opportunities",
    ],
    impact: "You know exactly what your website should target.",
  },
  {
    icon: BarChart3,
    title: "Competitor Insights",
    description: "We look at your competitors to see what is working for them.",
    points: [
      "What they rank for",
      "What they are doing better",
      "Where you can compete",
    ],
    impact: "You stop guessing and start competing with clarity.",
  },
  {
    icon: Target,
    title: "SEO Action Plan",
    description: "We summarise everything into a simple, actionable plan.",
    points: ["What was improved", "What to do next", "What to avoid"],
    impact: "You have a clear path to start growing traffic.",
  },
];

const portfolioItems = [
  {
    title: "Atlantic Foundation",
    subtitle: "Raleigh, North Carolina, USA",
    industry: "Nonprofit / Community Resource",
    service: "Technical SEO, site structure, service pages",
    result: "+149% organic traffic • +122 keywords ranking • +121% leads",
  },
  {
    title: "Scuba Driving Raleigh",
    subtitle: "Raleigh, North Carolina, USA",
    industry: "Local Service / Training",
    service: "Local SEO, on-page optimisation, page optimisation",
    result: "+41% traffic • 6 top-keyword rankings • +340% enquiries",
  },
  {
    title: "Griffin Group",
    subtitle: "United Kingdom",
    industry: "Property Development / Real Estate",
    service: "Local SEO, technical fixes, ranking optimisation",
    result: "+52.14% traffic • 7 keyword position gains • +23% growth",
  },
];

const whyFreeReasons = [
  "Fix the key issues on your site",
  "Improve one important page",
  "A clear direction for growth",
];

export default function SeoSetupLandingPage() {
  const formSectionRef = useRef<HTMLElement | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    websiteUrl: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // const goToPortfolio = () => {
  //   navigate("/portfolio");
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createSeoSetupLead({
        fullName: form.fullName,
        websiteUrl: form.websiteUrl,
        email: form.email,
      });

      setForm({
        fullName: "",
        websiteUrl: "",
        email: "",
      });

      setShowThankYouPopup(true);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to submit lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4f8] text-[#23162f]">
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid min-h-[720px] grid-cols-1 items-center gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:py-20">
            <div className="relative z-10 max-w-[640px]">
              <div className="mb-5 inline-flex items-center rounded-full bg-[#ffe6ef] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ff3974] sm:text-xs">
                Limited offer • Free SEO audit & setup
              </div>

              <h1 className="max-w-[640px] text-[42px] font-black leading-[0.95] tracking-[-0.04em] text-[#2b1b45] sm:text-[56px] md:text-[68px] lg:text-[72px] xl:text-[84px]">
                Get 1 Month of SEO Done for Your site —
                <span className="text-[#ff3974]"> Free</span>
              </h1>

              <p className="mt-5 max-w-[560px] text-sm leading-7 text-[#6b6277] sm:text-base">
                We fix the core issues, optimise your key pages, and build the
                foundation Google requires for real organic traffic.
              </p>

              <button
                type="button"
                onClick={scrollToForm}
                className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gradient-to-r from-[#ff3974] to-[#ff4f5f] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(255,57,116,0.28)] transition-transform duration-300 hover:scale-[1.02]"
              >
                Get My Free SEO Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="absolute right-[-20%] top-[-6%] h-[340px] w-[340px] rounded-full bg-[#ffd7e3] blur-3xl sm:h-[420px] sm:w-[420px]" />
              <div className="relative w-full max-w-[420px] rounded-[26px] bg-[#2a1450] p-5 text-white shadow-[0_22px_50px_rgba(42,20,80,0.28)] sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#f6d7e2]">
                      #1 Ranking
                    </p>
                    <p className="mt-1 inline-flex rounded-full bg-[#4c2c75] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#ff8bae]">
                      Guaranteed test
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <ArrowUpRight className="h-5 w-5 text-[#8f79bd]" />
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff93b2]">
                    Verified results
                  </p>
                  <div className="mt-2 text-[42px] font-black leading-none sm:text-[54px]">
                    +240%
                  </div>
                  <div className="mt-2 text-sm font-bold uppercase tracking-[0.08em] text-[#ff4f7e]">
                    Organic traffic growth
                  </div>
                  <p className="mt-4 max-w-[300px] text-sm leading-6 text-[#cdbddd]">
                    Average increase in search visibility for sites within the
                    first 90 days of our foundational setup.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <Rocket className="mb-2 h-5 w-5 text-[#ff4f7e]" />
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d7c9e6]">
                      Top 3 Rank
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <TrendingUp className="mb-2 h-5 w-5 text-[#ff4f7e]" />
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d7c9e6]">
                      198% Success
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f0f4] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="text-[28px] font-black leading-tight tracking-[-0.03em] text-[#23162f] sm:text-[36px] lg:text-[48px]">
              What’s Included in Your Free SEO Setup
            </h2>
            <p className="mx-auto mt-4 max-w-[620px] text-sm leading-7 text-[#7b7286] sm:text-base">
              We focus only on what actually improves your website — no
              unnecessary work, no confusion. This is the foundation most
              websites are missing.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {includedItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-[#ece7ef] bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6"
                >
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f5]">
                    <Icon className="h-4 w-4 text-[#ff4a76]" />
                  </div>

                  <h3 className="text-lg font-bold tracking-[-0.02em] text-[#2a1c42]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#746c7e]">
                    {item.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    {item.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-2 text-sm text-[#5f5869]"
                      >
                        <CheckCircle2 className="mt-[2px] h-4 w-4 shrink-0 text-[#ff4a76]" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-[#f1edf3] pt-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff4a76]">
                      Impact
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#5f5869]">
                      {item.impact}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gradient-to-r from-[#ff3974] to-[#ff4f5f] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(255,57,116,0.28)] transition-transform duration-300 hover:scale-[1.02]"
            >
              Get My Free SEO Setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4f8] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="mx-auto max-w-[780px] text-center">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff4a76]">
              Our work
            </div>
            <h2 className="mt-3 text-[28px] font-black leading-tight tracking-[-0.03em] text-[#23162f] sm:text-[36px] lg:text-[48px]">
              Websites We’ve Improved
            </h2>
            <p className="mx-auto mt-4 max-w-[680px] text-sm leading-7 text-[#7b7286] sm:text-base">
              Here are a few examples of websites where we fixed SEO issues and
              improved visibility.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            {portfolioItems.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-[#ece7ef] bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold tracking-[-0.02em] text-[#2a1c42]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#7d7389]">
                      {item.subtitle}
                    </p>
                  </div>
                  <Globe className="h-5 w-5 shrink-0 text-[#6f6290]" />
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8095]">
                      Industry
                    </div>
                    <div className="mt-1 text-[#4f4658]">{item.industry}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8095]">
                      Service
                    </div>
                    <div className="mt-1 text-[#4f4658]">{item.service}</div>
                  </div>

                  <div className="border-t border-[#f0ebf2] pt-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff4a76]">
                      Result
                    </div>
                    <div className="mt-2 font-semibold text-[#ff4a76]">
                      {item.result}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/portfolio")}
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gradient-to-r from-[#ff8a30] to-[#ff5c4c] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(255,102,64,0.22)] transition-transform duration-300 hover:scale-[1.02]"
            >
              View Full Portfolio
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#2a1450] py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-10 xl:px-16">
          <div>
            <h2 className="text-[30px] font-black leading-tight tracking-[-0.03em] sm:text-[38px] lg:text-[50px]">
              Why We Do This for Free
            </h2>
            <p className="mt-4 max-w-[540px] text-base leading-7 text-[#d7cce4]">
              We want you to see the value first before you commit to anything
              long-term.
            </p>
            <p className="mt-5 max-w-[560px] text-sm leading-7 text-[#bfb0d1] sm:text-base">
              Instead of asking you to invest in SEO upfront, we start by fixing
              the important things on your website. This way, you can clearly
              see what was missing and what’s possible next.
            </p>

            <div className="mt-8 rounded-[22px] border border-white/10 bg-white/5 p-5 sm:p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff8eb0]">
                What happens after
              </div>
              <p className="mt-3 text-sm leading-7 text-[#d5c9e2] sm:text-base">
                If you see the value, we continue and help you grow. If not, you
                still walk away with a better website.
              </p>
              <p className="mt-3 text-sm text-[#a692be]">
                No pressure. Just a proper starting point.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              {whyFreeReasons.map((reason) => (
                <div
                  key={reason}
                  className="flex items-center gap-4 rounded-[20px] border border-white/10 bg-white/5 px-5 py-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff3e77]/15">
                    <Sparkles className="h-5 w-5 text-[#ff5f90]" />
                  </div>
                  <div className="text-sm font-medium text-white sm:text-base">
                    {reason}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={scrollToForm}
              className="mt-6 inline-flex min-h-[54px] items-center justify-center rounded-xl bg-gradient-to-r from-[#ff3974] to-[#ff4f5f] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(255,57,116,0.28)] transition-transform duration-300 hover:scale-[1.02]"
            >
              Get My Free SEO Setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4f8] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
            <div>
              <h2 className="max-w-[520px] text-[30px] font-black leading-[1.02] tracking-[-0.03em] text-[#23162f] sm:text-[38px] lg:text-[54px]">
                People Are Already Searching
              </h2>

              <p className="mt-5 max-w-[580px] text-base leading-7 text-[#6f657b]">
                Every day, thousands of people are searching for exactly what
                you offer.
              </p>

              <p className="mt-4 max-w-[560px] text-sm leading-7 text-[#7b7286] sm:text-base">
                In the US, most customers don’t go looking for businesses
                manually anymore. They search.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-[20px] border border-[#ece7ef] bg-white p-5">
                  <h3 className="text-base font-bold text-[#2a1c42]">
                    If you run a local business:
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#6b6277]">
                    People are searching in your city every day. Visibility
                    matters.
                  </p>
                </div>

                <div className="rounded-[20px] border border-[#ece7ef] bg-[#faf8fb] p-5">
                  <p className="text-sm font-semibold leading-7 text-[#4d4358] sm:text-base">
                    “You don’t need more marketing. You need your website to
                    show up when people search.”
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-[#ece7ef] bg-white p-6">
                <div className="text-[34px] font-black leading-none text-[#ff3974] sm:text-[44px]">
                  +500%
                </div>
                <div className="mt-2 text-sm font-semibold text-[#2b1b45]">
                  “near me” searches
                </div>
                <p className="mt-3 text-sm leading-6 text-[#756b80]">
                  Growth in local intent searches over recent years.
                </p>
              </div>

              <div className="rounded-[22px] border border-[#ece7ef] bg-white p-6">
                <div className="text-[34px] font-black leading-none text-[#ff3974] sm:text-[44px]">
                  75%
                </div>
                <div className="mt-2 text-sm font-semibold text-[#2b1b45]">
                  First page only
                </div>
                <p className="mt-3 text-sm leading-6 text-[#756b80]">
                  Percentage of users who never scroll past page one.
                </p>
              </div>

              <div className="sm:col-span-2 rounded-[22px] bg-[#2a1450] p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff3e77]/15">
                    <Clock3 className="h-5 w-5 text-[#ff6a95]" />
                  </div>
                  <div>
                    <div className="text-base font-bold">
                      Action within 24 hours
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#d4c7e3]">
                      Local searches are highly intentional and lead to
                      immediate inquiries.
                    </p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 rounded-[22px] border border-[#ece7ef] bg-[#faf8fb] p-6">
                <div className="mx-auto max-w-[420px] text-center">
                  <h3 className="text-lg font-bold text-[#2a1c42] sm:text-xl">
                    If you’re not showing up, your competitors are getting those
                    leads.
                  </h3>
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="mt-5 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gradient-to-r from-[#ff3974] to-[#ff4f5f] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(255,57,116,0.28)] transition-transform duration-300 hover:scale-[1.02]"
                  >
                    Get My Free SEO Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={formSectionRef}
        className="bg-[#f3f0f4] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="mx-auto max-w-[840px] text-center">
            <h2 className="text-[30px] font-black leading-tight tracking-[-0.03em] text-[#23162f] sm:text-[40px] lg:text-[58px]">
              Ready to transform your search presence?
            </h2>
            <p className="mx-auto mt-4 max-w-[660px] text-sm leading-7 text-[#786f82] sm:text-base">
              Fill out the form below to claim your free website optimisation.
            </p>
          </div>

          <div className="mx-auto mt-10 w-full max-w-[760px] rounded-[26px] border border-white/70 bg-white p-5 shadow-[0_20px_40px_rgba(25,15,40,0.05)] sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#5b5367]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="h-12 w-full rounded-xl border border-[#e8e2ec] bg-[#fcfbfd] px-4 text-sm text-[#23162f] outline-none transition focus:border-[#ff4a76] focus:ring-4 focus:ring-[#ff4a76]/10 sm:h-14 sm:text-base"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#5b5367]">
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={form.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  required
                  className="h-12 w-full rounded-xl border border-[#e8e2ec] bg-[#fcfbfd] px-4 text-sm text-[#23162f] outline-none transition focus:border-[#ff4a76] focus:ring-4 focus:ring-[#ff4a76]/10 sm:h-14 sm:text-base"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#5b5367]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  required
                  className="h-12 w-full rounded-xl border border-[#e8e2ec] bg-[#fcfbfd] px-4 text-sm text-[#23162f] outline-none transition focus:border-[#ff4a76] focus:ring-4 focus:ring-[#ff4a76]/10 sm:h-14 sm:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-[56px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#ff3974] to-[#ff4f5f] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(255,57,116,0.28)] transition-transform duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Get My Free SEO Setup"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-6 text-[#9a92a5]">
              No cold calls required. No hidden commitments.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-[#2a1450] py-10">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-4 px-4 text-center text-sm text-[#d8ccE5] sm:px-6 lg:flex-row lg:px-10 xl:px-16">
          <div className="inline-flex items-center gap-2 font-semibold">
            <BadgeCheck className="h-4 w-4 text-[#ff6c98]" />
            Free SEO Setup
          </div>
          <div className="inline-flex items-center gap-2 text-[#bcaed0]">
            <ShieldAlert className="h-4 w-4" />
            Built to be responsive from 320px to 1440px+
          </div>
          <div className="inline-flex items-center gap-2 text-[#bcaed0]">
            <MapPinned className="h-4 w-4" />
            Search-ready website foundation
          </div>
          <div className="inline-flex items-center gap-2 text-[#bcaed0]">
            <LineChart className="h-4 w-4" />
            Organic growth starts here
          </div>
        </div>
      </footer>

      <ThankYouPopup
        isOpen={showThankYouPopup}
        onClose={() => setShowThankYouPopup(false)}
        title="Thank You!"
        message="Your SEO setup request has been submitted successfully. Our team will get back to you shortly."
        formType="inquiry"
      />
    </div>
  );
}