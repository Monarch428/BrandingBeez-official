import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import { Link } from "wouter";
import AcGraph from "../../public/images/AC-Graphics.jpg";
import MyVkard from "../../public/images/myvkard_nfc1.png";
import WellImage from "../../public/images/Wellenpuls_App.png";
import Octupus from "../../public/images/octupus.png";

// Local data
const CASE_STUDIES = [
    {
        title: "AC Graphics CRM",
        industry: "Manufacturing",
        badge: "Phase-Based Implementation",
        investment: "$2.3K Phase 1",
        totalValue: "$7.5K Total Value",
        roi: "226%",
        description:
            "Custom CRM system with lead automation, pipeline tracking, and quote generation for manufacturing business.",
        features: ["Lead automation", "Pipeline tracking", "Quote generation", "Client management"],
        techStack: ["Custom Web App", "API Integrations", "Automated Workflows"],
        timeline: "2 months Phase 1, scalable",
        image: AcGraph,
    },
    {
        title: "MyVKard",
        industry: "SaaS Startup",
        badge: "Rapid MVP Development",
        investment: "$2.3K",
        totalValue: "$12K Market Value",
        roi: "422%",
        description:
            "NFC-enabled digital identity platform with payment processing and customizable profile builder.",
        features: ["NFC integration", "Payment processing", "Profile builder", "QR code generation"],
        techStack: ["React", "Node.js", "Stripe API", "NFC Protocols"],
        timeline: "7 weeks from concept to launch",
        image: MyVkard,
    },
    {
        title: "Wellenpuls Health App",
        industry: "HealthTech",
        badge: "Hardware Integration",
        investment: "$1.3K",
        totalValue: "$10K Market Value",
        roi: "669%",
        description:
            "Mobile health application with Bluetooth hardware integration and AI-powered health coaching.",
        features: ["Bluetooth connectivity", "AI health coach", "Progress tracking", "Personalized insights"],
        techStack: ["React Native", "Bluetooth APIs", "AI Integration"],
        timeline: "6 weeks mobile development",
        image: WellImage,
    },
    // {
    //     title: "E-Commerce Platform",
    //     industry: "Retail",
    //     badge: "Full-Stack Solution",
    //     investment: "$8.5K",
    //     totalValue: "$22K Market Value",
    //     roi: "159%",
    //     description:
    //         "Complete e-commerce platform with inventory management, payment processing, and analytics dashboard.",
    //     features: ["Product management", "Payment gateway", "Order tracking", "Analytics dashboard"],
    //     techStack: ["Next.js", "PostgreSQL", "Stripe", "AWS"],
    //     timeline: "12 weeks full development",
    //     image: "/modern-ecommerce-dashboard-with-products-and-analy.jpg",
    // },
];

// Small, reusable local card (no external imports)
function StudyCard({ cs }: { cs: (typeof CASE_STUDIES)[number] }) {
    return (
        <div className="flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all">
            {/* Image (uniform ratio) */}
            <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
                <img
                    src={cs.image}
                    alt={cs.title}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col p-6">
                {/* Badge + Title */}
                <div className="mb-2">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-brand-purple/10 text-brand-purple">
                        {cs.badge}
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                    {cs.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{cs.industry}</p>

                {/* Description */}
                <p className="mt-3 text-gray-700 leading-relaxed line-clamp-3">
                    {cs.description}
                </p>

                {/* Stats row */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-lg border border-gray-200 p-3 text-center">
                        <div className="font-semibold text-brand-purple">{cs.investment}</div>
                        <div className="text-gray-500">Investment</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3 text-center">
                        <div className="font-semibold text-brand-purple">{cs.totalValue}</div>
                        <div className="text-gray-500">Value</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3 text-center">
                        <div className="font-semibold text-brand-coral">{cs.roi}</div>
                        <div className="text-gray-500">ROI</div>
                    </div>
                </div>

                {/* Tech + Timeline */}
                <div className="mt-4 text-sm text-gray-600">
                    <div>
                        <span className="font-semibold text-gray-800">Tech:</span>{" "}
                        {cs.techStack.join(", ")}
                    </div>
                    <div className="mt-1">
                        <span className="font-semibold text-gray-800">Timeline:</span>{" "}
                        {cs.timeline}
                    </div>
                </div>

                {/* CTA pinned to bottom */}
                <div className="mt-auto pt-5 border-t border-gray-100">
                    <Link href={`/portfolio/${encodeURIComponent(cs.title.toLowerCase().replace(/\s+/g, "-"))}`}>
                        <Button
                            variant="outline"
                            className="w-full h-11 text-sm font-medium border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-all"
                        >
                            Read Full Case Study
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PortfolioPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
                {/* HERO (same palette & feel as your Services hero) */}
                <section className="text-white py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral border-b border-white/10">
                    <div className="max-w-7xl mx-auto p-6">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                                Real AI Solutions We’ve Built{" "}
                                <span className="font-extrabold">with Full Transparency</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-white/90 mt-4">
                                Actual costs, timelines, tech stack, and ROI verified and documented.
                                No fluff. Just results you can trust.
                            </p>

                            {/* Stats (glassy) */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                                {[
                                    { kpi: "15+", label: "Projects Delivered" },
                                    { kpi: "$127K", label: "Total Value Created" },
                                    { kpi: "325%", label: "Average ROI" },
                                ].map((s, i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-6 text-center"
                                    >
                                        <div className="text-3xl font-bold mb-1">{s.kpi}</div>
                                        <div className="text-sm text-white/80">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/">
                                    <Button className="bg-white text-brand-purple hover:bg-brand-purple hover:text-white">
                                        Explore Case Studies
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/pricing-calculator">
                                    <Button
                                        variant="outline"
                                        className="border-2 border-white bg-transparent text-white hover:bg-brand-purple hover:text-white hover:border-brand-purple"
                                    >
                                        Get an Estimate
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CASE STUDIES */}
                <section id="case-studies" className="py-12 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                Transparent, Documented Case Studies
                            </h2>
                            <p className="text-base md:text-lg text-gray-700 mt-2">
                                Each one details the problem, approach, stack, timeline, cost, and business impact.
                            </p>
                        </div>

                        {/* Featured (simple wide card) */}
                        <div className="mb-12 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full">
                                    <img
                                        src={Octupus}
                                        alt="Featured: Octupus.ai"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </div>
                                <div className="p-8 lg:p-10 flex flex-col">
                                    <span className="inline-flex w-fit items-center rounded-full bg-brand-purple/10 text-brand-purple px-3 py-1 text-xs font-semibold">
                                        Featured Case Study
                                    </span>
                                    <h3 className="mt-3 text-3xl font-bold text-gray-900">
                                        Octupus.ai – AI Agent Platform
                                    </h3>
                                    <p className="mt-3 text-gray-700 leading-relaxed">
                                        Multi-agent AI platform with human-in-the-loop review, tool orchestration,
                                        and analytics. Reduced manual ops by 68% in 6 weeks.
                                    </p>

                                    <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                                        <div className="rounded-lg border border-gray-200 p-3 text-center">
                                            <div className="font-semibold text-brand-purple">$6.9K</div>
                                            <div className="text-gray-500">Investment</div>
                                        </div>
                                        <div className="rounded-lg border border-gray-200 p-3 text-center">
                                            <div className="font-semibold text-brand-purple">$24K</div>
                                            <div className="text-gray-500">Value</div>
                                        </div>
                                        <div className="rounded-lg border border-gray-200 p-3 text-center">
                                            <div className="font-semibold text-brand-coral">247%</div>
                                            <div className="text-gray-500">ROI</div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6">
                                        <Link href="/portfolio/octupus-ai">
                                            <Button
                                                variant="outline"
                                                className="w-full h-11 text-sm font-medium border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-all"
                                            >
                                                Read Full Case Study
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {CASE_STUDIES.map((cs) => (
                                <StudyCard key={cs.title} cs={cs} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section className="border-y border-gray-100 bg-white">
                    <div className="max-w-7xl mx-auto px-4 py-16">
                        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                            What Our Clients Say
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    quote: "The ROI was immediate. We saw efficiency gains within the first week.",
                                    who: "AC Graphics",
                                    tag: "Manufacturing",
                                },
                                {
                                    quote: "BrandingBeez delivered exactly what they promised, on time and on budget.",
                                    who: "Wellenpuls",
                                    tag: "HealthTech",
                                },
                                {
                                    quote: "Finally, an agency that shows you the real costs upfront.",
                                    who: "Digital Identity Client",
                                    tag: "SaaS Startup",
                                },
                            ].map((t) => (
                                <div key={t.who} className="rounded-lg border border-gray-200 bg-white p-6">
                                    <p className="text-gray-700 mb-4">“{t.quote}”</p>
                                    <div className="font-semibold text-gray-900">{t.who}</div>
                                    <div className="text-sm text-gray-500">{t.tag}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* BOTTOM CTA (same style as your CTA section) */}
                <section id="estimate" className="py-16 px-4 bg-brand-purple text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Ready to Transform Your Business?
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                            Get transparent timelines, costs, and ROI projections — no surprises, no fluff.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link href="/pricing-calculator">
                                <Button className="bg-brand-coral hover:bg-white hover:text-brand-purple text-white px-8 py-4 font-semibold transition-all duration-300">
                                    Get Your Project Estimate
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>

                            <Link href="/contact?service=AI%20Solutions">
                                <Button
                                    variant="outline"
                                    className="border-2 border-brand-purple text-brand-purple hover:bg-brand-coral hover:text-white bg-white px-8 py-4 font-semibold transition-all duration-300"
                                >
                                    <Users className="mr-2 h-5 w-5" />
                                    Join Our Community
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
