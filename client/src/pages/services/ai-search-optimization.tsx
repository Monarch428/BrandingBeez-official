import { Header } from "@/components/header";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// Questionnaire fields
const initialForm = {
    businessType: "",
    website: "",
    mainGoal: "",
    currentVisibility: "",
    aiPlatforms: [] as string[],
    locations: "",
    competitors: "",
    name: "",
    email: "",
    phone: "",
    company: "",
};
    // Questionnaire state
    const [form, setForm] = useState(initialForm);
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const totalSteps = 6;

    const aiPlatformOptions = [
        "Google SGE",
        "Perplexity",
        "Copilot",
        "ChatGPT Search",
        "Other",
    ];

    function togglePlatform(platform: string) {
        setForm((prev) => {
            const exists = prev.aiPlatforms.includes(platform);
            return {
                ...prev,
                aiPlatforms: exists
                    ? prev.aiPlatforms.filter((p) => p !== platform)
                    : [...prev.aiPlatforms, platform],
            };
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                company: form.company,
                service: "ai-search-optimization-questionnaire",
                questionnaire: form,
            };
            const res = await fetch("/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                alert("Sorry — we couldn't submit your questionnaire. Please try again or email us directly.");
                return;
            }
            setSubmitted(true);
        } catch (err) {
            alert("Submission failed. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    }
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
    Users,
    Shield,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Zap,
    Target,
    Calculator,
    Star,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";

const AiSearchOptimizationSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Search Optimization (AIO)",
    description:
        "AI Search Optimization (AIO) services to rank brands inside AI-generated results like Google SGE, Perplexity, Copilot & ChatGPT Search.",
    provider: {
        "@type": "Organization",
        name: "Branding Beez",
        url: "https://brandingbeez.co.uk",
    },
    serviceType: "AI Search Optimization",
    areaServed: {
        "@type": "Place",
        name: "Global",
    },
};

export default function AiSearchOptimization() {
    return (
        <>
            <Helmet>
                <title>
                    AI Search Optimization (AIO) Packages | Branding Beez Services 2025
                </title>
                <meta
                    name="description"
                    content="Get your brand ranked inside AI-generated results like Google SGE, Perplexity, Copilot & ChatGPT Search with our AI Search Optimization (AIO) packages."
                />
                <link
                    rel="canonical"
                    href="https://brandingbeez.co.uk/services/ai-search-optimization"
                />
                <meta name="robots" content="INDEX, FOLLOW" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
                <SEOHead
                    title="AI Search Optimization (AIO) — Rank in AI Answer Engines"
                    description="Get your brand ranked inside AI-generated results on Google SGE, Perplexity, Copilot & ChatGPT Search with structured AIO packages."
                    keywords="AI search optimization, AIO, Google SGE optimization, Perplexity SEO, ChatGPT search visibility, AI answer engine, Branding Beez"
                    canonicalUrl="https://brandingbeez.co.uk/services/ai-search-optimization"
                    ogType="website"
                />
                <SchemaMarkup type="custom" data={AiSearchOptimizationSchema} />

                <Header />
                <main>
                    {/* === AI SEARCH OPTIMIZATION QUESTIONNAIRE === */}
                    <section className="py-20 px-4 bg-white">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-4">
                                    AI Search Optimization — Quick Questionnaire
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Answer a few focused questions and we’ll prepare a custom AIO scope & pricing for your brand.
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
                                                {step === 1 && "Business Type & Website"}
                                                {step === 2 && "Main Goal"}
                                                {step === 3 && "Current AI Visibility"}
                                                {step === 4 && "AI Platforms & Locations"}
                                                {step === 5 && "Competitors"}
                                                {step === 6 && "Contact Details"}
                                            </h3>
                                        </div>
                                        <div className="w-40">
                                            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-brand-coral to-brand-purple transition-all duration-300"
                                                    style={{ width: `${(step / totalSteps) * 100}%` }}
                                                />
                                            </div>
                                            <p className="mt-1 text-[11px] text-right text-gray-500">
                                                {Math.round((step / totalSteps) * 100)}% complete
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
                                                Thanks for sharing your AIO needs! 🎉
                                            </h4>
                                            <p className="text-gray-600 max-w-md mx-auto">
                                                We’ll review your answers and come back with a tailored AIO scope, pricing, and next steps for your brand.
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {step === 1 && (
                                                <div className="space-y-4">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        What type of business/brand is this for?
                                                    </Label>
                                                    <Input
                                                        value={form.businessType}
                                                        onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))}
                                                        placeholder="e.g. Local business, SaaS, e-commerce, agency, etc."
                                                        required
                                                    />
                                                    <Label className="text-base font-medium text-gray-800">
                                                        Website URL
                                                    </Label>
                                                    <Input
                                                        value={form.website}
                                                        onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                                                        placeholder="https://yourwebsite.com"
                                                        required
                                                    />
                                                </div>
                                            )}
                                            {step === 2 && (
                                                <div className="space-y-4">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        What’s your main goal with AI Search Optimization?
                                                    </Label>
                                                    <Textarea
                                                        value={form.mainGoal}
                                                        onChange={e => setForm(f => ({ ...f, mainGoal: e.target.value }))}
                                                        placeholder="e.g. Get quoted in SGE, increase AI answer visibility, improve entity recognition, etc."
                                                        required
                                                    />
                                                </div>
                                            )}
                                            {step === 3 && (
                                                <div className="space-y-4">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        How visible is your brand in AI-generated results right now?
                                                    </Label>
                                                    <Textarea
                                                        value={form.currentVisibility}
                                                        onChange={e => setForm(f => ({ ...f, currentVisibility: e.target.value }))}
                                                        placeholder="e.g. We rarely show up, we sometimes appear, we’re quoted often, etc."
                                                        required
                                                    />
                                                </div>
                                            )}
                                            {step === 4 && (
                                                <div className="space-y-4">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        Which AI platforms matter most for you?
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {aiPlatformOptions.map((p) => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => togglePlatform(p)}
                                                                className={`text-left border rounded-xl px-4 py-3 text-sm transition-all ${form.aiPlatforms.includes(p)
                                                                    ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                                                                    : "border-gray-200 hover:border-brand-coral/60 hover:bg-gray-50"
                                                                    }`}
                                                            >
                                                                <span className="mr-2">
                                                                    {form.aiPlatforms.includes(p) ? "✅" : "⬜"}
                                                                </span>
                                                                {p}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <Label className="text-base font-medium text-gray-800 mt-4">
                                                        Main locations or markets you serve
                                                    </Label>
                                                    <Input
                                                        value={form.locations}
                                                        onChange={e => setForm(f => ({ ...f, locations: e.target.value }))}
                                                        placeholder="e.g. London, UK; New York, US; Europe-wide, etc."
                                                        required
                                                    />
                                                </div>
                                            )}
                                            {step === 5 && (
                                                <div className="space-y-4">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        Who are your main competitors (if any)?
                                                    </Label>
                                                    <Textarea
                                                        value={form.competitors}
                                                        onChange={e => setForm(f => ({ ...f, competitors: e.target.value }))}
                                                        placeholder="List a few competitors or similar brands (optional)"
                                                    />
                                                </div>
                                            )}
                                            {step === 6 && (
                                                <div className="space-y-4">
                                                    <Label className="text-base font-medium text-gray-800">
                                                        Contact details
                                                    </Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="name" className="text-sm text-gray-700">Name</Label>
                                                            <Input
                                                                id="name"
                                                                value={form.name}
                                                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                                                placeholder="Your name"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="company" className="text-sm text-gray-700">Company (optional)</Label>
                                                            <Input
                                                                id="company"
                                                                value={form.company}
                                                                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                                                                placeholder="Your company"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="email" className="text-sm text-gray-700">Email</Label>
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                value={form.email}
                                                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                                                placeholder="you@example.com"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="phone" className="text-sm text-gray-700">Phone (optional)</Label>
                                                            <Input
                                                                id="phone"
                                                                value={form.phone}
                                                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                                                placeholder="+44 ..."
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
                                                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                                                    className="border-gray-300 text-gray-700"
                                                >
                                                    Back
                                                </Button>
                                                {step < totalSteps ? (
                                                    <Button
                                                        type="button"
                                                        onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
                                                        className="bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold"
                                                    >
                                                        Next
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="submit"
                                                        className="bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? "Submitting..." : "Submit & Get My AIO Scope"}
                                                    </Button>
                                                )}
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                    {/* Hero Section */}
                    <section className="pt-20 pb-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <Badge className="bg-white/20 text-white border-white/30 mb-6 flex items-center gap-2 w-fit font-bold">
                                        <Zap className="w-4 h-4" />
                                        AI Search Optimization (AIO)
                                    </Badge>

                                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                        Get Ranked Inside <span className="underline">AI Answers</span>,
                                        Not Just Blue Links
                                    </h1>

                                    <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                                        Position your brand inside AI-generated results across{" "}
                                        <span className="font-semibold">
                                            Google SGE, Perplexity, Copilot & ChatGPT Search
                                        </span>
                                        . Structured AIO packages for local brands, fast-growing companies,
                                        and enterprise teams.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-white/10 rounded-lg p-4">
                                            <div className="text-sm text-white/70 mb-1">
                                                AI Platforms Covered
                                            </div>
                                            <div className="text-lg font-semibold leading-snug">
                                                SGE • Perplexity • Copilot • ChatGPT
                                            </div>
                                        </div>
                                        <div className="bg-white/10 rounded-lg p-4">
                                            <div className="text-sm text-white/70 mb-1">Ideal For</div>
                                            <div className="text-lg font-semibold leading-snug">
                                                Local, Growth & Enterprise Brands
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link href="/pricing-calculator">
                                            <Button
                                                className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
                                                size="lg"
                                            >
                                                Get AIO Pricing
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="lg"
                                            className="border-white text-white hover:border-white px-8"
                                            asChild
                                        >
                                            <a
                                                href="https://calendar.app.google/Y8XZq71qtvPRhktH9"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Book AIO Strategy Call
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                        {/* <Link href="https://calendar.app.google/Y8XZq71qtvPRhktH9">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className=""
                                            >
                                                Book AIO Strategy Call
                                            </Button>
                                        </Link> */}
                                    </div>
                                </div>

                                {/* Right Side: AIO Snapshot */}
                                <div className="bg-[rgba(40,20,50,0.6)] backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-[0px_8px_32px_rgba(0,0,0,0.3)]">
                                    <p className="text-xl font-bold mb-4">
                                        What AIO Actually Optimizes For:
                                    </p>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-white/80 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-base">
                                                    Entity Recognition
                                                </p>
                                                <p className="text-sm md:text-base text-white/80 leading-relaxed">
                                                    Structured brand, service, and location entities that AI
                                                    engines can reliably understand.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <TrendingUp className="w-5 h-5 text-white/80 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-base">
                                                    AI Answer Extraction
                                                </p>
                                                <p className="text-sm md:text-base text-white/80 leading-relaxed">
                                                    Page structures, blocks, and schemas built to be “quoted”
                                                    by AI as the best answer.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Users className="w-5 h-5 text-white/80 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-base">
                                                    Conversational Keywords
                                                </p>
                                                <p className="text-sm md:text-base text-white/80 leading-relaxed">
                                                    Real questions people ask AI tools—and your brand
                                                    appearing in the responses.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                                        <div className="bg-white/10 rounded-lg p-4">
                                            <div className="text-xs md:text-sm text-white/70 uppercase tracking-wide">
                                                Measured By
                                            </div>
                                            <div className="mt-2 space-y-1 leading-relaxed">
                                                <p>• SGE impressions</p>
                                                <p>• Entity recognition score</p>
                                                <p>• AI answer frequency</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/10 rounded-lg p-4">
                                            <div className="text-xs md:text-sm text-white/70 uppercase tracking-wide">
                                                For AI-First Brands
                                            </div>
                                            <div className="mt-2 space-y-1 leading-relaxed">
                                                <p>• Local businesses</p>
                                                <p>• Scaling SaaS & agencies</p>
                                                <p>• E-commerce & enterprise</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Who AIO Is For */}
                    <section className="py-16 px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-brand-purple mb-4">
                                    Who Is AI Search Optimization For?
                                </h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    Whether you’re a local brand, scaling company, or enterprise,
                                    each AIO package is designed around how AI answer engines
                                    actually read, understand, and surface your website.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <Card className="h-full">
                                    <CardContent className="p-6">
                                        <Badge className="mb-4 bg-purple-50 text-brand-purple border-purple-100">
                                            Starter AIO
                                        </Badge>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            Local Businesses & Early-Stage Brands
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                                            Get AI engines to correctly recognize who you are, what you
                                            do, and where you operate.
                                        </p>
                                        <ul className="space-y-2 text-sm md:text-base text-gray-700">
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                <span>Establish entity & schema foundations</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                <span>Optimize 5 key service/location pages</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                <span>Capture early SGE visibility</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="h-full border-brand-coral/60 border-2 shadow-sm scale-[1.02]">
                                    <CardContent className="p-6">
                                        <Badge className="mb-4 bg-brand-coral text-white">
                                            Growth AIO (Most Popular)
                                        </Badge>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            Growing Companies & Agencies
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                                            Grow topic authority and secure repeated inclusion inside AI
                                            answer summaries and snippets.
                                        </p>
                                        <ul className="space-y-2 text-sm md:text-base text-gray-700">
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                <span>AI topic graph & internal linking</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                <span>10 pages rewritten for AI extraction</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                <span>Multi-location & competitor mapping</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="h-full">
                                    <CardContent className="p-6">
                                        <Badge className="mb-4 bg-slate-900 text-white">
                                            Pro AIO
                                        </Badge>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            E-Commerce & Enterprise Teams
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                                            Dominate AI-driven ecosystems with advanced technical work,
                                            topic clusters, and predictive ranking.
                                        </p>
                                        <ul className="space-y-2 text-sm md:text-base text-gray-700">
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                <span>20+ pages with predictive ranking signals</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                <span>Core Web Vitals, JS SEO & semantic upgrades</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                <span>Dedicated dashboard & strategy calls</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* AIO Packages Section */}
                    <section className="py-16 px-4 bg-gray-50">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-brand-purple mb-4">
                                    AI Search Optimization (AIO) Packages
                                </h2>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Three focused packages built for different growth stages—same
                                    AIO foundation, different depth.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Starter AIO */}
                                <Card className="relative flex flex-col h-full border border-brand-purple/10 hover:border-brand-purple/40 transition-all">
                                    <CardHeader className="text-center pb-4 flex-shrink-0">
                                        <Badge className="mb-3 bg-purple-50 text-brand-purple border-purple-100 w-fit mx-auto font-bold">
                                            Starter AIO
                                        </Badge>
                                        <CardTitle className="text-2xl font-bold text-brand-purple">
                                            $650 / month
                                        </CardTitle>
                                        <p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
                                            Perfect for local businesses and early-stage brands entering
                                            AI search visibility.
                                        </p>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-grow px-6 pb-6">
                                        <ul className="space-y-2 mb-6 text-sm md:text-base text-gray-800 leading-relaxed">
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    AIO baseline audit (entities, schema, AI crawlability)
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>10 AI-intent conversational keywords</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>5 pages optimized for AI answer extraction</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>Entity setup (Brand, Services, Locations)</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>Speed, mobile & semantic structure fixes</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>AIO Answer Blocks added to key pages</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>Basic schema (LocalBusiness, FAQ, WebPage)</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>1 AIO-optimized blog (1000 words)</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>2 authority links/month (DA 30+)</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>1 Google Business Profile optimization</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>Basic AI competitor scan</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>Monthly AIO Visibility Report (SGE & Perplexity)</span>
                                            </li>
                                        </ul>

                                        <div className="mt-auto pt-4 border-t border-gray-200">
                                            <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-2 tracking-wide">
                                                Measured By
                                            </p>
                                            <ul className="text-xs md:text-sm text-gray-600 space-y-2 mb-4 leading-relaxed">
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>SGE impressions</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>Entity recognition score (NLP)</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>AI answer extraction frequency</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>Conversational keyword ranking</span>
                                                </li>
                                            </ul>
                                            <Link href="/contact">
                                                <Button className="w-full h-11 bg-brand-purple hover:bg-brand-purple/90">
                                                    Choose Starter AIO
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Growth AIO */}
                                <Card className="relative flex flex-col h-full border-2 border-brand-coral shadow-sm scale-[1.02]">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-brand-coral text-white px-4 py-1 rounded-full flex items-center gap-1">
                                            <Star className="w-4 h-4" />
                                            Most Popular
                                        </Badge>
                                    </div>
                                    <CardHeader className="text-center pb-4 flex-shrink-0 mt-2">
                                        <Badge className="mb-3 bg-orange-50 text-brand-coral border-orange-100 w-fit mx-auto font-bold">
                                            Growth AIO
                                        </Badge>
                                        <CardTitle className="text-2xl font-bold text-brand-purple">
                                            $900 / month
                                        </CardTitle>
                                        <p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
                                            Ideal for growing companies who want stronger ranking in AI
                                            answer engines.
                                        </p>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-grow px-6 pb-6">
                                        <ul className="space-y-2 mb-6 text-sm md:text-base text-gray-800 leading-relaxed">
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>Full technical + semantic AIO audit</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>25 AI-intent keywords + query clustering</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    10 pages rewritten using extractable AIO formatting
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    Enhanced schema: Entity, About, Services, FAQ
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>AI Topic Graph + semantic internal linking</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    2 AIO-optimized blogs/month (1000–1200 words)
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>5 authority links/month (DA 40+)</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>3-location AIO optimization + citations</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    Answer Engine blocks, summary snippets & definition boxes
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    Deep AI search competitor mapping (5 competitors)
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>Monthly report + strategy call</span>
                                            </li>
                                        </ul>

                                        <div className="mt-auto pt-4 border-t border-gray-200">
                                            <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-2 tracking-wide">
                                                Measured By
                                            </p>
                                            <ul className="text-xs md:text-sm text-gray-600 space-y-2 mb-4 leading-relaxed">
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>Topic authority score</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>AI snippet inclusion rate</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>Structured data indexing rate</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>SGE/Perplexity visibility</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>Entity relationship graph growth</span>
                                                </li>
                                            </ul>
                                            <Link href="/contact">
                                                <Button className="w-full h-11 bg-brand-coral hover:bg-brand-coral/90">
                                                    Choose Growth AIO
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Pro AIO */}
                                <Card className="relative flex flex-col h-full border border-brand-purple/10 hover:border-brand-purple/40 transition-all">
                                    <CardHeader className="text-center pb-4 flex-shrink-0">
                                        <Badge className="mb-3 bg-slate-900 text-white w-fit mx-auto font-bold">
                                            Pro AIO
                                        </Badge>
                                        <CardTitle className="text-2xl font-bold text-brand-purple">
                                            $1,200 / month
                                        </CardTitle>
                                        <p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
                                            For e-commerce & enterprise websites ready to dominate
                                            AI-driven search ecosystems.
                                        </p>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-grow px-6 pb-6">
                                        <ul className="space-y-2 mb-6 text-sm md:text-base text-gray-800 leading-relaxed">
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>Deep AIO crawl + advanced technical plan</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    50+ AI-intent keywords + semantic segmentation
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    20 pages optimized with predictive ranking signals
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    Core Web Vitals, JS SEO & semantic markup upgrades
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    Full Topic Graph + Cluster Authority build-out
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    Multi-location AI search optimization (5+ areas)
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    4 AIO-optimized blogs/month (1500+ words)
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>10 high-authority links/month (DA 50+)</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>
                                                    AI content gap analysis + predictive ranking model
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>Quarterly landscape report (AIO + SEO)</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                <span>Dedicated dashboard + bi-weekly strategy calls</span>
                                            </li>
                                        </ul>

                                        <div className="mt-auto pt-4 border-t border-gray-200">
                                            <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-2 tracking-wide">
                                                Measured By
                                            </p>
                                            <ul className="text-xs md:text-sm text-gray-600 space-y-2 mb-4 leading-relaxed">
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>Cluster authority dominance</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>
                                                        AI Answer engine frequency (SGE, Perplexity, Copilot)
                                                    </span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>Conversational search impressions</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>Entity & schema depth</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                                    <span>E-E-A-T & brand authority growth</span>
                                                </li>
                                            </ul>
                                            <Link href="/contact">
                                                <Button className="w-full h-11 bg-brand-purple hover:bg-brand-purple/90">
                                                    Choose Pro AIO
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* Measurement & Process Section */}
                    <section className="py-16 px-4 bg-white">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-brand-purple mb-4">
                                    How We Measure AIO Success
                                </h2>
                                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    Every package comes with clear measurement frameworks—so you’re
                                    not guessing whether AI sees your brand or not.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Target className="w-7 h-7 text-brand-purple" />
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            Entity & Schema
                                        </h3>
                                    </div>
                                    <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                                        We track how AI engines understand and map your brand,
                                        services, and locations as structured entities.
                                    </p>
                                    <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
                                        <li className="flex gap-2">
                                            <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                            <span>Entity recognition score (NLP)</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                            <span>Schema coverage & indexing</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                            <span>Entity relationship graph growth</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <TrendingUp className="w-7 h-7 text-brand-purple" />
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            AI Visibility
                                        </h3>
                                    </div>
                                    <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                                        We don’t just track traditional SEO—we monitor AI-first
                                        surfaces directly where users actually see answers.
                                    </p>
                                    <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
                                        <li className="flex gap-2">
                                            <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                            <span>SGE impressions & answer blocks</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                            <span>Perplexity / Copilot visibility</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                            <span>Conversational search impressions</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-7 h-7 text-brand-purple" />
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            Content & Clusters
                                        </h3>
                                    </div>
                                    <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                                        Topic authority is earned with structured content, supporting
                                        pages, and smart internal linking patterns.
                                    </p>
                                    <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
                                        <li className="flex gap-2">
                                            <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                            <span>Cluster authority dominance</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                            <span>AI snippet inclusion rate</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5" />
                                            <span>AIO content gap closures</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-16 px-4 bg-gradient-to-r from-[#CF4163] to-[#552265] text-white">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Get Your Brand Quoted by AI?
                            </h2>
                            <p className="text-xl text-white/90 mb-8 leading-relaxed">
                                Choose an AIO package or talk to us about a custom AI search
                                roadmap. We’ll help your brand move from “indexed” to
                                “answer-worthy.”
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple px-8"
                                    asChild
                                >
                                    <a
                                        href="https://calendar.app.google/Y8XZq71qtvPRhktH9"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Book AIO Strategy Call
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>

                                <Link href="/pricing-calculator">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="bg-white/10 text-white hover:border-white"
                                    >
                                        Explore AIO Pricing
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
