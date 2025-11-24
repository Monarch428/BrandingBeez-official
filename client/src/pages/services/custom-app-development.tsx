import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SchemaMarkup } from "@/components/schema-markup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useRegion } from "@/hooks/use-region";
import {
    Code,
    Smartphone,
    MonitorSmartphone,
    LayoutTemplate,
    Cloud,
    Shield,
    Clock,
    CheckCircle,
    ArrowRight,
    Cpu,
    Database,
    Globe2,
    Users,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { SEOHead } from "@/components/seo-head";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const applicationTypes = [
    "Mobile App (iOS)",
    "Mobile App (Android)",
    "Cross-platform App",
    "Web Application",
    "Web + Mobile App",
    "Not sure yet",
];

const userTypes = [
    "Customers",
    "Internal team",
    "Vendors / partners",
    "A mix of the above",
];

const mustHaveFeatures = [
    "User accounts / login",
    "Payment gateway",
    "Booking / scheduling",
    "Chat / messaging",
    "Dashboard / reports",
    "Push notifications",
    "Maps / location tracking",
    "API integrations",
    "Something custom (explain)",
];

const buildTypeOptions = [
    "New build",
    "Upgrade / redesign",
    "Migration from another platform",
];

const projectTimelines = [
    "ASAP (1–3 months)",
    "3–6 months",
    "Flexible / not urgent",
];

const budgetRanges = [
    "$5K–$10K",
    "$10K–$20K",
    "$20K–$40K",
    "$40K+",
    "Not sure yet",
];

const techPreferences = [
    "iOS (Swift)",
    "Android (Kotlin)",
    "React Native",
    "Flutter",
    "Web (React / Next.js)",
    "Not sure — need guidance",
];

export default function CustomAppDevelopment() {
    const { regionConfig } = useRegion();

    const redirectToContact = () => {
        window.location.href =
            "/contact?service=Custom Web & Mobile App Development";
    };

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Custom Web & Mobile App Development",
        description:
            "High-performance custom web and mobile applications built for scalability, security, and seamless user experience.",
        provider: {
            "@type": "Organization",
            name: "BrandingBeez",
            url: "https://brandingbeez.co.uk",
        },
        areaServed: ["United Kingdom", "United States", "Europe"],
        serviceType: "Custom Web & Mobile App Development",
        offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
        },
    };

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const totalSteps = 10;

    const [formData, setFormData] = useState({
        applicationTypes: [] as string[],
        appDescription: "",
        userTypes: [] as string[],
        mustHaveFeatures: [] as string[],
        customFeatureDetails: "",
        referenceApps: "",
        buildType: "",
        projectTimeline: "",
        budgetRange: "",
        techPreferences: [] as string[],
        name: "",
        email: "",
        phone: "",
        company: "",
    });

    const toggleArrayValue = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => {
            const current = prev[field] as string[];
            const exists = current.includes(value);
            const next = exists
                ? current.filter((v) => v !== value)
                : [...current, value];
            return { ...prev, [field]: next };
        });
    };

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                service: "custom-app-questionnaire",
                questionnaire: formData,
            };

            const res = await fetch("/api/contacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                console.error("Submission failed", err || res.statusText);
                alert(
                    "Sorry — we couldn't submit your questionnaire. Please try again or email us directly.",
                );
                return;
            }

            setSubmitted(true);
        } catch (error) {
            console.error("Submission error:", error);
            alert("Submission failed. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (step / totalSteps) * 100;

    return (
        <>
            <Helmet>
                <title>
                    Custom Web & Mobile App Development | Branding Beez 2025
                </title>
                <meta
                    name="description"
                    content="Custom web and mobile app development for startups and enterprises. High-performance, scalable, secure applications with modern UI/UX and full-stack engineering."
                />
                <link
                    rel="canonical"
                    href="https://brandingbeez.co.uk/services/custom-app-development"
                />
                <meta name="robots" content="INDEX, FOLLOW" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
                <SEOHead
                    title="Custom Web & Mobile App Development"
                    description="Build fast, reliable, and scalable custom applications for web and mobile. From MVPs to enterprise platforms, we handle full-stack development end-to-end."
                    keywords="custom web app development, mobile app development, full-stack development, UI UX design, API development, react apps, native apps"
                    canonicalUrl="https://brandingbeez.co.uk/services/custom-app-development"
                    ogType="website"
                />
                <SchemaMarkup type="service" data={schemaData} />

                <Header />

                <main>
                    {/* Hero Section */}
                    <section className="py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Badge className="bg-white/20 text-white border-white/30">
                                            💻 Custom Apps
                                        </Badge>
                                        <Badge className="bg-white/20 text-white border-white/30">
                                            Web & Mobile
                                        </Badge>
                                        <Badge className="bg-white/20 text-white border-white/30">
                                            APP20 – 20% Off First Project
                                        </Badge>
                                    </div>

                                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                                        Custom Web & Mobile App Development
                                    </h1>

                                    <p className="text-xl mb-8 text-white/90 leading-relaxed">
                                        We design and build high-performance web and mobile
                                        applications that feel fast, look premium, and scale with
                                        your business. From MVPs to full enterprise platforms, we
                                        handle the complete product lifecycle – strategy, UX, build,
                                        launch, and ongoing support.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            size="lg"
                                            className="bg-white text-brand-purple hover:bg-brand-coral hover:text-white font-bold"
                                            asChild
                                        >
                                            <Link href="/contact#contact-form">
                                                Start Your App Project
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                {/* Right Side: Quick Stats Card */}
                                <div className="relative">
                                    <div className="bg-[rgba(40,20,50,0.6)] backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-[0px_8px_32px_rgba(0,0,0,0.3)]">
                                        <div className="text-center mb-6">
                                            <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                                <MonitorSmartphone className="w-10 h-10 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-white mb-2">
                                                Product-Ready Builds
                                            </h2>
                                            <p className="text-white/80 text-sm">
                                                Web, iOS, Android & dashboards built with modern stacks
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
                                                <div>
                                                    <div className="text-white text-2xl font-bold">
                                                        4–6 weeks
                                                    </div>
                                                    <div className="text-white text-sm">
                                                        Average MVP delivery time
                                                    </div>
                                                </div>
                                                <Clock className="w-8 h-8 text-white" />
                                            </div>

                                            <div className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
                                                <div>
                                                    <div className="text-white text-2xl font-bold">
                                                        20+
                                                    </div>
                                                    <div className="text-white text-sm">
                                                        Web & mobile apps shipped
                                                    </div>
                                                </div>
                                                <Users className="w-8 h-8 text-white" />
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-white/20 text-center text-white/80 text-xs">
                                                From internal tools & CRMs to customer-facing platforms
                                                and native mobile apps.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What We Build */}
                    <section className="py-16 px-4 bg-white">
                        <div className="max-w-7xl mx-auto">
                            {/* HEADER */}
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-brand-purple mb-4">
                                    What We Build
                                </h2>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                    End-to-end product development across web, mobile, and internal tools –
                                    matched to your workflow, users, and growth goals.
                                </p>
                            </div>

                            {/* GRID */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {/* CARD 1 */}
                                <Card className="flex flex-col justify-between h-full text-left hover:shadow-lg transition-shadow rounded-xl border border-gray-100">
                                    <CardHeader className="flex flex-col items-start space-y-4 pb-0">
                                        <div className="w-14 h-14 bg-brand-coral/10 rounded-xl flex items-center justify-center">
                                            <Code className="w-7 h-7 text-brand-coral" />
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-purple leading-snug">
                                            Custom Web Apps
                                        </h3>
                                    </CardHeader>

                                    <CardContent className="mt-4 flex flex-col justify-between flex-1">
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                            High-performance web applications, portals, and dashboards built
                                            with modern frameworks.
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-[2px]" />
                                                <span>Responsive, mobile-friendly UIs</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-[2px]" />
                                                <span>Role-based dashboards & admin panels</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* CARD 2 */}
                                <Card className="flex flex-col justify-between h-full text-left hover:shadow-lg transition-shadow rounded-xl border border-gray-100">
                                    <CardHeader className="flex flex-col items-start space-y-4 pb-0">
                                        <div className="w-14 h-14 bg-brand-coral/10 rounded-xl flex items-center justify-center">
                                            <Smartphone className="w-7 h-7 text-brand-coral" />
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-purple leading-snug">
                                            Mobile Apps (iOS & Android)
                                        </h3>
                                    </CardHeader>

                                    <CardContent className="mt-4 flex flex-col justify-between flex-1">
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                            Native-feel mobile experiences built with modern cross-platform
                                            frameworks.
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-[2px]" />
                                                <span>iOS & Android from a single codebase</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-[2px]" />
                                                <span>App store deployment support</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* CARD 3 */}
                                <Card className="flex flex-col justify-between h-full text-left hover:shadow-lg transition-shadow rounded-xl border border-gray-100">
                                    <CardHeader className="flex flex-col items-start space-y-4 pb-0">
                                        <div className="w-14 h-14 bg-brand-coral/10 rounded-xl flex items-center justify-center">
                                            <LayoutTemplate className="w-7 h-7 text-brand-coral" />
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-purple leading-snug">
                                            Full-Stack Platforms
                                        </h3>
                                    </CardHeader>

                                    <CardContent className="mt-4 flex flex-col justify-between flex-1">
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                            Business-critical platforms with secure backends, APIs, and
                                            integrations.
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-[2px]" />
                                                <span>REST/GraphQL APIs & microservices</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-[2px]" />
                                                <span>Integrations with CRM, ERP & third-party tools</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* CARD 4 */}
                                <Card className="flex flex-col justify-between h-full text-left hover:shadow-lg transition-shadow rounded-xl border border-gray-100">
                                    <CardHeader className="flex flex-col items-start space-y-4 pb-0">
                                        <div className="w-14 h-14 bg-brand-coral/10 rounded-xl flex items-center justify-center">
                                            <Shield className="w-7 h-7 text-brand-coral" />
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-purple leading-snug">
                                            Maintenance & Support
                                        </h3>
                                    </CardHeader>

                                    <CardContent className="mt-4 flex flex-col justify-between flex-1">
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                            Ongoing care for your applications with monitoring, updates, and
                                            enhancements.
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-[2px]" />
                                                <span>Bug fixes & performance tuning</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-[2px]" />
                                                <span>New feature iterations & UX upgrades</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>


                    {/* Process (Lightweight) */}
                    <section className="py-16 px-4 bg-gray-50">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-brand-purple mb-4">
                                    How We Work
                                </h2>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                    A clear delivery process – from idea to launch – designed for
                                    predictable timelines and low friction collaboration.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <Card className="text-center">
                                    <CardHeader>
                                        <Clock className="w-10 h-10 text-brand-coral mx-auto mb-3" />
                                        <h3 className="text-lg font-bold text-brand-purple">
                                            1. Discover
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600">
                                            Workshops to define goals, user flows, core features, and
                                            scope for v1/MVP.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="text-center">
                                    <CardHeader>
                                        <LayoutTemplate className="w-10 h-10 text-brand-coral mx-auto mb-3" />
                                        <h3 className="text-lg font-bold text-brand-purple">
                                            2. UX & UI
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600">
                                            Wireframes, clickable prototypes, and visual design aligned
                                            with your brand.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="text-center">
                                    <CardHeader>
                                        <Code className="w-10 h-10 text-brand-coral mx-auto mb-3" />
                                        <h3 className="text-lg font-bold text-brand-purple">
                                            3. Build
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600">
                                            Full-stack development with weekly demos, QA, and staging
                                            environments.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="text-center">
                                    <CardHeader>
                                        <Shield className="w-10 h-10 text-brand-coral mx-auto mb-3" />
                                        <h3 className="text-lg font-bold text-brand-purple">
                                            4. Launch & Support
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600">
                                            Production deployment, monitoring, and ongoing support or
                                            retainer options.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* === CUSTOM APP PROJECT QUESTIONNAIRE – SAME UI AS AI DEV === */}
                    <section className="py-20 px-4 bg-white">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-4">
                                    Custom Mobile & Web Application – Simple Questionnaire
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Instead of generic pricing tables, answer a few focused
                                    questions and we&apos;ll prepare a{" "}
                                    <span className="font-semibold text-brand-coral">
                                        tailored app scope & investment range
                                    </span>{" "}
                                    for your project.
                                </p>
                            </div>

                            <Card className="shadow-xl">
                                <CardHeader className="border-b border-gray-100 bg-gray-50">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-gray-500">
                                                Step {step} of {totalSteps}
                                            </p>
                                            <h3 className="text-xl font-semibold text-brand-purple">
                                                {step === 1 && "Application Type"}
                                                {step === 2 && "Core Idea"}
                                                {step === 3 && "Who Will Use It?"}
                                                {step === 4 && "Must-Have Features"}
                                                {step === 5 && "Reference Apps / Websites"}
                                                {step === 6 && "New Build or Upgrade?"}
                                                {step === 7 && "Project Timeline"}
                                                {step === 8 && "Estimated Budget Range"}
                                                {step === 9 && "Technical Preferences"}
                                                {step === 10 && "Contact Details"}
                                            </h3>
                                        </div>
                                        <div className="w-40">
                                            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-brand-coral to-brand-purple transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <p className="mt-1 text-[11px] text-right text-gray-500">
                                                {Math.round(progress)}% complete
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 md:p-8">
                                    {submitted ? (
                                        <div className="text-center py-10">
                                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                <CheckCircle className="h-7 w-7 text-green-500" />
                                            </div>
                                            <h4 className="text-2xl font-semibold text-brand-purple mb-2">
                                                Thanks for sharing your project! 🎉
                                            </h4>
                                            <p className="text-gray-600 max-w-md mx-auto">
                                                We&apos;ll review your answers and come back with a
                                                concise scope outline, suggested tech stack, and next
                                                steps for your custom web or mobile app.
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* STEP CONTENTS */}
                                            {step === 1 && (
                                                <div className="space-y-4">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        What type of application do you want to build?
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {applicationTypes.map((type) => (
                                                            <button
                                                                key={type}
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleArrayValue("applicationTypes", type)
                                                                }
                                                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${formData.applicationTypes.includes(type)
                                                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                                                    }`}
                                                            >
                                                                <span className="mr-2">
                                                                    {formData.applicationTypes.includes(type)
                                                                        ? "✅"
                                                                        : "⬜"}
                                                                </span>
                                                                {type}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {step === 2 && (
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="appDescription"
                                                        className="text-base font-medium text-gray-800"
                                                    >
                                                        Briefly describe what the app should do.
                                                    </Label>
                                                    <p className="text-xs text-gray-500">
                                                        1–3 sentences explaining the core idea.
                                                    </p>
                                                    <Textarea
                                                        id="appDescription"
                                                        value={formData.appDescription}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                appDescription: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="For example: A booking app for our clients to schedule services, manage payments, and receive live status updates."
                                                        className="min-h-[140px]"
                                                    />
                                                </div>
                                            )}

                                            {step === 3 && (
                                                <div className="space-y-4">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        Who will use this application?
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {userTypes.map((u) => (
                                                            <button
                                                                key={u}
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleArrayValue("userTypes", u)
                                                                }
                                                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${formData.userTypes.includes(u)
                                                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                                                    : "border-gray-200 hover-border-brand-coral/60 hover:bg-gray-50"
                                                                    }`}
                                                            >
                                                                <span className="mr-2">
                                                                    {formData.userTypes.includes(u)
                                                                        ? "✅"
                                                                        : "⬜"}
                                                                </span>
                                                                {u}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {step === 4 && (
                                                <div className="space-y-3">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        What are the must-have features?
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {mustHaveFeatures.map((f) => (
                                                            <button
                                                                key={f}
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleArrayValue("mustHaveFeatures", f)
                                                                }
                                                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${formData.mustHaveFeatures.includes(f)
                                                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                                                    }`}
                                                            >
                                                                <span className="mr-2">
                                                                    {formData.mustHaveFeatures.includes(f)
                                                                        ? "✅"
                                                                        : "⬜"}
                                                                </span>
                                                                {f}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {formData.mustHaveFeatures.includes(
                                                        "Something custom (explain)"
                                                    ) && (
                                                            <div className="mt-2">
                                                                <Label
                                                                    htmlFor="customFeatureDetails"
                                                                    className="text-sm text-gray-700"
                                                                >
                                                                    Describe any custom or unique features
                                                                </Label>
                                                                <Textarea
                                                                    id="customFeatureDetails"
                                                                    value={formData.customFeatureDetails}
                                                                    onChange={(e) =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            customFeatureDetails: e.target.value,
                                                                        }))
                                                                    }
                                                                    placeholder="For example: offline mode, multi-tenant access, complex pricing rules, multi-role approval workflow..."
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                        )}
                                                </div>
                                            )}

                                            {step === 5 && (
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="referenceApps"
                                                        className="text-base font-medium text-gray-800"
                                                    >
                                                        Do you have any reference apps or websites you like?
                                                    </Label>
                                                    <p className="text-xs text-gray-500">
                                                        Links or names – this helps us understand your taste
                                                        in UX/UI.
                                                    </p>
                                                    <Textarea
                                                        id="referenceApps"
                                                        value={formData.referenceApps}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                referenceApps: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="e.g. Airbnb for UX, Slack for messaging, Xero for dashboards, or links to similar apps."
                                                        className="min-h-[120px]"
                                                    />
                                                </div>
                                            )}

                                            {step === 6 && (
                                                <div className="space-y-3">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        Is this a new build or an upgrade to an existing
                                                        system?
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {buildTypeOptions.map((b) => (
                                                            <button
                                                                key={b}
                                                                type="button"
                                                                onClick={() =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        buildType: b,
                                                                    }))
                                                                }
                                                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${formData.buildType === b
                                                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                                                    }`}
                                                            >
                                                                {b}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {step === 7 && (
                                                <div className="space-y-3">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        What is your project timeline?
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {projectTimelines.map((t) => (
                                                            <button
                                                                key={t}
                                                                type="button"
                                                                onClick={() =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        projectTimeline: t,
                                                                    }))
                                                                }
                                                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${formData.projectTimeline === t
                                                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                                                    }`}
                                                            >
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {step === 8 && (
                                                <div className="space-y-3">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        What is your estimated budget range?
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {budgetRanges.map((b) => (
                                                            <button
                                                                key={b}
                                                                type="button"
                                                                onClick={() =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        budgetRange: b,
                                                                    }))
                                                                }
                                                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${formData.budgetRange === b
                                                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                                                    }`}
                                                            >
                                                                {b}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {step === 9 && (
                                                <div className="space-y-3">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        Any specific technical preferences?
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {techPreferences.map((tech) => (
                                                            <button
                                                                key={tech}
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleArrayValue("techPreferences", tech)
                                                                }
                                                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${formData.techPreferences.includes(tech)
                                                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                                                    }`}
                                                            >
                                                                <span className="mr-2">
                                                                    {formData.techPreferences.includes(tech)
                                                                        ? "✅"
                                                                        : "⬜"}
                                                                </span>
                                                                {tech}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {step === 10 && (
                                                <div className="space-y-4">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        Contact details
                                                    </Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label
                                                                htmlFor="name"
                                                                className="text-sm text-gray-700"
                                                            >
                                                                Name
                                                            </Label>
                                                            <Input
                                                                id="name"
                                                                value={formData.name}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        name: e.target.value,
                                                                    }))
                                                                }
                                                                placeholder="Your name"
                                                                className="mt-1"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label
                                                                htmlFor="company"
                                                                className="text-sm text-gray-700"
                                                            >
                                                                Company (optional)
                                                            </Label>
                                                            <Input
                                                                id="company"
                                                                value={formData.company}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        company: e.target.value,
                                                                    }))
                                                                }
                                                                placeholder="Your company"
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label
                                                                htmlFor="email"
                                                                className="text-sm text-gray-700"
                                                            >
                                                                Email
                                                            </Label>
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                value={formData.email}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        email: e.target.value,
                                                                    }))
                                                                }
                                                                placeholder="you@example.com"
                                                                className="mt-1"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label
                                                                htmlFor="phone"
                                                                className="text-sm text-gray-700"
                                                            >
                                                                Phone (optional)
                                                            </Label>
                                                            <Input
                                                                id="phone"
                                                                value={formData.phone}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        phone: e.target.value,
                                                                    }))
                                                                }
                                                                placeholder="+44 ..."
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Navigation buttons */}
                                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={step === 1}
                                                    onClick={handlePrev}
                                                    className="border-gray-300 text-gray-700"
                                                >
                                                    Back
                                                </Button>

                                                {step < totalSteps ? (
                                                    <Button
                                                        type="button"
                                                        onClick={handleNext}
                                                        className="bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold"
                                                    >
                                                        Next
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="submit"
                                                        className="bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold"
                                                    >
                                                        Submit & Get My App Scope
                                                    </Button>
                                                )}
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Tech Stack */}
                    <section className="py-16 px-4 bg-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-brand-purple mb-4">
                                    Modern Tech Stack
                                </h2>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                    We use proven, modern technologies for web, mobile, and
                                    infrastructure – selected based on your product and team.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {[
                                    { name: "React / Next.js", icon: Code },
                                    { name: "React Native", icon: Smartphone },
                                    { name: "Flutter", icon: MonitorSmartphone },
                                    { name: "Node.js / NestJS", icon: Cpu },
                                    { name: "PostgreSQL", icon: Database },
                                    { name: "MongoDB", icon: Database },
                                    { name: "REST / GraphQL APIs", icon: Globe2 },
                                    { name: "AWS / Azure", icon: Cloud },
                                    { name: "Docker & CI/CD", icon: Cpu },
                                    { name: "Tailwind / SCSS", icon: LayoutTemplate },
                                ].map((tech, index) => {
                                    const Icon = tech.icon;
                                    return (
                                        <div key={index} className="text-center group">
                                            <div className="w-16 h-16 bg-gray-50 rounded-xl shadow-md flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                                                <Icon className="w-8 h-8 text-brand-coral" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {tech.name}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="py-16 px-4 bg-gradient-to-r from-brand-coral to-brand-purple text-white">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                Ready to Build Your Next App?
                            </h2>
                            <p className="text-xl mb-6 text-white/90">
                                Whether you&apos;re validating an MVP or upgrading an existing
                                platform, we&apos;ll help you ship a reliable, scalable product
                                with a polished user experience.
                            </p>
                            <div className="flex flex-row gap-4 justify-center">
                                <Button
                                    onClick={redirectToContact}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm h-11 rounded-md px-8 bg-white text-brand-coral hover:bg-gray-100 font-extrabold"
                                >
                                    Start a Project
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
