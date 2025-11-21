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

export default function CustomAppDevelopment() {
    const { regionConfig } = useRegion();

    const redirectToContact = () => {
        window.location.href = "/contact?service=Custom Web & Mobile App Development";
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
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-brand-purple mb-4">
                                    What We Build
                                </h2>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                    End-to-end product development across web, mobile, and
                                    internal tools – matched to your workflow, users, and growth
                                    goals.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <Card>
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                                            <Code className="w-6 h-6 text-brand-coral" />
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-purple">
                                            Custom Web Apps
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm mb-3">
                                            High-performance web applications, portals, and dashboards
                                            built with modern front-end frameworks.
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                Responsive, mobile-friendly UIs
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                Role-based dashboards & admin panels
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                                            <Smartphone className="w-6 h-6 text-brand-coral" />
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-purple">
                                            Mobile Apps (iOS & Android)
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm mb-3">
                                            Native-feel mobile experiences built with modern cross-
                                            platform frameworks.
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                iOS & Android from a single codebase
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                App store deployment support
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                                            <LayoutTemplate className="w-6 h-6 text-brand-coral" />
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-purple">
                                            Full-Stack Platforms
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm mb-3">
                                            Business-critical platforms with secure backends, APIs,
                                            and integrations.
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                REST/GraphQL APIs & microservices
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                Integrations with CRM, ERP & third-party tools
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                                            <Shield className="w-6 h-6 text-brand-coral" />
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-purple">
                                            Maintenance & Support
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm mb-3">
                                            Ongoing care for your applications with monitoring,
                                            updates, and enhancements.
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                Bug fixes & performance tuning
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                New feature iterations & UX upgrades
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
                                            Wireframes, clickable prototypes, and visual design
                                            aligned with your brand.
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
                                    //   { name: "Angular", icon: Code },
                                    { name: "React Native", icon: Smartphone },
                                    { name: "Flutter", icon: MonitorSmartphone },
                                    { name: "Node.js / NestJS", icon: Cpu },
                                    //   { name: "Laravel / PHP", icon: Code },
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
                            <p className="text-sm mb-6 text-white/80">
                                Use coupon code <span className="font-semibold">APP20</span> for{" "}
                                <span className="font-semibold">20% off</span> your first app
                                project.
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
