<!-- Service portfoilio old -->
 <!-- <section className="py-16 px-4 bg-white">

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Complete Service Portfolio
              </h2>
              <p className="text-xl text-gray-700">
                Comprehensive digital solutions delivered under your brand
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCategories.slice(0, 6).map((service) => {
                const Icon = service.icon;
                const hasCoupon = service.couponCode;
                return (
                  <Card key={service.id} className="relative overflow-hidden flex flex-col h-full">
                    {hasCoupon && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-brand-coral text-white text-xs font-bold animate-pulse">
                          {service.discount}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-brand-coral" />
                      </div>
                      <CardTitle className="text-xl font-bold text-brand-purple min-h-[3.5rem] flex items-center">
                        <h3>{service.title}</h3>
                      </CardTitle>
                      <p className="text-gray-700 min-h-[3rem] flex items-start">{service.description}</p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="space-y-4 flex-1">
                        <div className="text-2xl font-bold text-brand-purple">
                          {service.pricing}
                        </div>
                        {service.id === "dedicated-resources" ? (
                          <div className="space-y-2 min-h-[2.5rem]">
                            <div className="text-sm text-brand-coral font-semibold">
                              Average 60% cost savings vs. in-house team
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-brand-coral font-semibold min-h-[2.5rem] flex items-start">
                            {service.metrics}
                          </div>
                        )}
                        <ul className="space-y-2 flex-1 min-h-[8rem]">
                          {service.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 text-brand-coral mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-6 space-y-6">
                        {service.id === "n8n-automations" ? (
                          <>
                            <div className="text-center py-3 mb-2">
                              <span className="text-brand-coral font-semibold text-lg">
                                Coming Soon
                              </span>
                            </div>
                            <Link href={service.href}>
                              <Button
                                variant="outline"
                                className="w-full h-11 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
                              >
                                Learn More
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </>
                        ) : hasCoupon ? (
  <div className="space-y-4">
    {!showCoupons[service.id] ? (
      <Button
        onClick={() => handleRevealCoupon(service.id)}
        className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold transition-colors"
      >
        <Gift className="w-4 h-4 mr-2" />
        Get {service.discount} - {service.discountDescription}
      </Button>
    ) : (
      <div className="space-y-4">
        <div className="p-4 bg-brand-coral/10 border border-brand-coral/20 rounded-lg">
          <div className="text-sm font-medium text-brand-purple mb-3">
            Your coupon code:
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded border">
            <code className="font-mono text-sm font-bold text-brand-purple flex-1">
              {service.couponCode}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleCopyCoupon(service.couponCode, service.id)
              }
              className="h-8 px-3 text-xs border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
            >
              <Copy className="w-3 h-3 mr-1" />
              {couponCopied[service.id] ? "✓" : "Copy"}
            </Button>
          </div>
        </div>
        <Link
          href={`/contact?coupon=${service.couponCode}&service=${service.id}`}
        >
          <Button className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold transition-colors">
            Use Coupon in Contact Form
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    )}

    <Link href={service.href}>
      <Button
        variant="outline"
        className="w-full h-11 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
      >
        Learn More
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Link>
  </div>
)
 : (
                          <Link href={service.href}>
                            <Button className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white transition-colors">
                              Learn More
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>  -->

<!--  -->





db.getCollection("portfolio_items").insertMany([
  {
    _id: ObjectId("6915af858bce42ae65cb93cb"),
    id: 1,
    slug: "ac-graphics-arm",
    title: "AC Graphics CRM",
    industry: "Manufacturing",
    client: "Mathew",
    badge: "Phase-Based Implementation",
    investment: "$2.3K",
    totalValue: "$7.5K",
    roi: "226%",
    description: "Custom CRM system with lead automation, pipeline tracking, and quote generation.",
    features: [
      "Lead automation",
      "Pipeline tracking",
      "Quote generation",
      "Client management"
    ],
    techStack: [
      "Typescript",
      "MongoDB"
    ],
    timeline: "2 months Phase 1, scalable",
    imageUrl: "/upload_image/portfolio_images/ac-graphics-1763030982614-320181973.jpg",
    isFeatured: true,
    orderIndex: 1,
    isActive: true,
    createdAt: ISODate("2025-11-13T10:14:29.994Z"),
    updatedAt: ISODate("2025-11-17T09:38:34.569Z"),
    image: "/upload_image/portfolio_images/ac-graphics-1763030982614-320181973.jpg",
    serviceCategory: "custom-app-development"
  },

  {
    _id: ObjectId("6915b6e58bce42ae65cb9407"),
    id: 2,
    slug: "myvkard",
    title: "MyVKard",
    industry: "SaaS Startup",
    client: "MyVKard",
    badge: "Rapid MVP Development",
    investment: "$2.3k",
    totalValue: "$12k",
    roi: "422%",
    description: "NFC-enabled digital identity platform with payment processing and customer dashboard.",
    features: [
      "NFC integration",
      "Payment processing",
      "Profile builder",
      "QR code generation"
    ],
    techStack: [
      "React JS Vite",
      "Node.js",
      "Stripe API",
      "NFC Protocols"
    ],
    timeline: "7 weeks from concept to launch",
    imageUrl: "/upload_image/portfolio_images/myvkard-nfc1-1763030755477-346132474.png",
    isFeatured: true,
    orderIndex: 2,
    isActive: true,
    createdAt: ISODate("2025-11-13T10:45:57.634Z"),
    updatedAt: ISODate("2025-11-17T09:38:18.668Z"),
    image: "/upload_image/portfolio_images/myvkard-nfc1-1763030755477-346132474.png",
    serviceCategory: "custom-app-development"
  },

  {
    _id: ObjectId("6915b79a8bce42ae65cb940d"),
    id: 3,
    slug: "wellenplus-health-app",
    title: "Wellenpuls Health App",
    industry: "HealthTech",
    client: "Wellenpuls Health App",
    badge: "Hardware Integration",
    investment: "$1.3K",
    totalValue: "$10K",
    roi: "669%",
    description: "Mobile health application with Bluetooth hardware integration and AI-powered insights.",
    features: [
      "Bluetooth connectivity",
      "AI health coach",
      "Progress tracking",
      "Personalized insights"
    ],
    techStack: [
      "React Native",
      "Bluetooth APIs",
      "AI Integration"
    ],
    timeline: "6 weeks mobile development",
    imageUrl: "/upload_image/portfolio_images/wellenpuls-app-1763030959964-27829571.png",
    isFeatured: true,
    orderIndex: 3,
    isActive: true,
    createdAt: ISODate("2025-11-13T10:48:58.210Z"),
    updatedAt: ISODate("2025-11-17T09:38:08.127Z"),
    image: "/upload_image/portfolio_images/wellenpuls-app-1763030959964-27829571.png",
    serviceCategory: "custom-app-development"
  },

  {
    _id: ObjectId("6915bdc08bce42ae65cb945b"),
    id: 4,
    slug: "octupus-ai",
    title: "Octupus.ai – AI Agent Platform",
    industry: "Telecom Industry",
    client: "Octupus.ai",
    badge: "AI Agent Featured Platform",
    investment: "$6.9K",
    totalValue: "$24K",
    roi: "247%",
    description: "Multi-agent AI platform with human-in-the-loop review, tool orchestration, and workflow automation.",
    features: [],
    techStack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Express",
      "PostgreSQL",
      "OpenAI",
      "GPT-4",
      "LinkedIn API",
      "Facebook API",
      "Instagram API",
      "AWS",
      "Docker",
      "Redis"
    ],
    timeline: "6 weeks",
    imageUrl: "/upload_image/portfolio_images/octupus-1763032358282-852385614.png",
    isFeatured: true,
    orderIndex: 0,
    isActive: true,
    createdAt: ISODate("2025-11-13T11:15:12.536Z"),
    updatedAt: ISODate("2025-11-17T09:52:40.773Z"),
    image: "/upload_image/portfolio_images/octupus-1763032358282-852385614.png",
    serviceCategory: "custom-app-development"
  }
])



<section className="py-20 px-6 bg-gradient-to-br from-[#2B0A3D] via-[#4D1A59] to-[#8A2E70] text-white">
            <div className="max-w-7xl mx-auto">

              {/* SECTION HEADER */}
              <div className="text-center mb-12">
                <h2 className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  🚀 NEW: AI Search Optimization (AIO)
                </h2>
                <h3 className="text-4xl font-bold mb-4">Rank Inside AI Search Results</h3>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Get your brand ranked in Google SGE, Perplexity, Copilot, ChatGPT Search
                  — the future of search visibility.
                </p>
              </div>

              {/* 3 PACKAGE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* STARTER AIO */}
                <div className="rounded-2xl bg-white/10 border border-white/20 p-7 backdrop-blur-xl shadow-xl">
                  <h4 className="text-2xl font-bold mb-2">Starter AIO</h4>
                  <p className="text-3xl font-extrabold text-brand-yellow mb-4">$650 <span className="text-lg text-white/90">/mo</span></p>
                  <ul className="space-y-2 text-white/90 mb-6">
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> AIO baseline audit</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 10 AI-intent keywords</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 5 pages AI-formatted</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> Basic schema + entity setup</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 1 AIO blog / month</li>
                  </ul>
                  <Link href="/services/ai-search-optimization">
                    <Button className="w-full bg-white text-brand-purple hover:bg-brand-coral hover:text-white">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* GROWTH AIO */}
                <div className="rounded-2xl bg-white/20 border-2 border-brand-yellow p-7 shadow-2xl backdrop-blur-xl scale-[1.03]">
                  <Badge className="bg-brand-yellow text-black mb-3 px-3 py-1">Most Popular</Badge>
                  <h4 className="text-2xl font-bold mb-2">Growth AIO</     h4>
                  <p className="text-3xl font-extrabold text-brand-yellow mb-4">$900 <span className="text-lg text-white/90">/mo</span></p>
                  <ul className="space-y-2 text-white/90 mb-6">
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> Full semantic AIO audit</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 25 AI-intent keywords</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 10 pages rewritten</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> Enhanced schema & topic graph</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 2 blogs + 5 links / month</li>
                  </ul>
                  <Link href="/services/ai-search-optimization">
                    <Button className="w-full bg-brand-purple text-white hover:bg-brand-coral hover:text-white">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* PRO AIO */}
                <div className="rounded-2xl bg-white/10 border border-white/20 p-7 backdrop-blur-xl shadow-xl">
                  <h4 className="text-2xl font-bold mb-2">Pro AIO</h4>
                  <p className="text-3xl font-extrabold text-brand-yellow mb-4">$1,200 <span className="text-lg text-white/90">/mo</span></p>
                  <ul className="space-y-2 text-white/90 mb-6">
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> Deep AIO crawl</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 50+ AI-intent keywords</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 20 predictive-optimized pages</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> Advanced schema + topic clusters</li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> 4 blogs + 10 links / month</li>
                  </ul>
                  <Link href="/services/ai-search-optimization">
                    <Button className="w-full bg-white text-brand-purple hover:bg-brand-coral hover:text-white">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

              </div>

              {/* BOTTOM CTA */}
              <div className="text-center mt-14">
                <Link href="/services/ai-search-optimization">
                  <Button className="bg-brand-coral text-white font-bold px-8 py-4 hover:bg-brand-purple hover:text-white">
                    Explore Full AIO Service
                    {/* <ArrowRight className="ml-2 w-4 h-4" /> */}
                  </Button>
                </Link>
              </div>

            </div>
          </section>