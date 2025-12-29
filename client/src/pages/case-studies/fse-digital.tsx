import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Target,
  CheckCircle,
  Calendar,
  Monitor,
  MessageSquare,
  Zap,
  Building,
  Quote,
  Video,
  Clock,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { SEOHead } from "@/components/seo-head";
import { SchemaMarkup } from "@/components/schema-markup";
// TODO: create this schema in your all-schemas file
// import { FSEDigitalPpcSchema } from "@/utils/all-schemas";
import FSELogo from "../../../public/images/FSE-Digital-Logo.jpg";
import { BookCallButtonWithModal } from "@/components/book-appoinment";

export default function FSEDigitalPpcCaseStudy() {
  return (
    <>
      <Helmet>
        <title>FSE Digital PPC Case Study | Dedicated Specialist & CPL Drop</title>
        <meta
          name="description"
          content="See how BrandingBeez provided a dedicated PPC specialist to FSE Digital, reducing CPL by 20–35%, improving Quality Scores, and saving 15–20 hours per week."
        />
        <link
          rel="canonical"
          href="https://brandingbeez.co.uk/case-studies/fse-digital-dedicated-ppc-specialist"
        />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <SEOHead
          title="FSE Digital x BrandingBeez – Dedicated PPC Specialist"
          description="A full-time, white-label PPC specialist helped FSE Digital expand capacity, reduce CPL by 20–35%, and increase profitability without adding internal headcount."
          keywords="white label PPC, dedicated PPC specialist, Google Ads outsourcing, agency capacity, performance marketing, white-label digital services"
          canonicalUrl="https://brandingbeez.co.uk/case-studies/fse-digital-dedicated-ppc-specialist"
          ogType="website"
        />
        {/* <SchemaMarkup type="custom" data={FSEDigitalPpcSchema} /> */}

        <Header />
        <main className="pt-0">
          {/* Hero Section */}
          <section className="pt-20 pb-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center justify-center">
                    <Badge className="bg-brand-coral text-white text-md font-medium px-4 py-1 mb-6">
                      Dedicated PPC Specialist Case Study
                    </Badge>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    FSE Digital: Dedicated PPC Specialist Under Full White-Label
                  </h1>
                  <p className="text-xl text-white/90 mb-8">
                    How a full-time PPC specialist embedded into FSE Digital’s
                    team reduced Cost per Lead by 20–35%, improved Quality
                    Scores, and freed up 15–20 hours per week — all under their
                    brand.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">20–35%</div>
                      <div className="text-sm text-white/80">
                        Lower Cost per Lead
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">15–20 hrs</div>
                      <div className="text-sm text-white/80">
                        Weekly Time Saved
                      </div>
                    </div>
                  </div>

                  {/* Hero CTAs (updated) */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* <Button
                      size="lg"
                      className="bg-white text-brand-purple hover:bg-gray-100"
                      onClick={() =>
                        window.open(
                          "/book-appointment",
                          "_blank"
                        )
                      }
                    >
                      <Calendar className="w-5 h-5 mr-1" />
                      Book Your Strategy Call
                    </Button> */}

                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-white text-white hover:bg-white hover:text-brand-purple"
                      asChild
                    >
                      <Link href="/pricing-calculator?service=dedicated-resources">
                        Hire Your Team
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex items-center justify-center text-brand-purple font-bold text-xl p-1">
                      <img src={FSELogo} alt="FSE Digital Logo" />
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      Performance Marketing Agency
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Client Profile</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-white/80" />
                      <span>FSE Digital – United Kingdom</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-white/80" />
                      <span>Performance &amp; PPC-focused digital agency</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-white/80" />
                      <span>
                        Google Ads, Search, Display, Shopping &amp; Remarketing
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-white/80" />
                      <span>Works fully under FSE Digital’s brand</span>
                    </div>
                  </div>
                </div> */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 mt-8 lg:mt-0">
                  {/* VIDEO ALWAYS SHOWN */}
                  <div className="mb-0">
                    <div className="w-full h-52 md:h-76 lg:h-[350px] rounded-xl overflow-hidden shadow-lg">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/RkP9jTtCVhE"
                        title="FSE Digital Case Study | Branding Beez"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dedicated Resource Snapshot */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Dedicated PPC Resource Snapshot
                </h2>
                <p className="text-gray-600 text-lg">
                  A full-time PPC specialist working exclusively for FSE Digital,
                  managing multiple client accounts under a 100% white-label
                  model.
                </p>
              </div>

              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-brand-purple to-brand-coral text-white p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white/90 text-sm">
                          1 Dedicated PPC Specialist Embedded into FSE Digital
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-green-300 text-sm font-medium">
                          Active White-Label Partnership
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specialist & Metrics */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-brand-coral/10 flex items-center justify-center">
                          <Target className="w-8 h-8 text-brand-coral" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Dedicated PPC Specialist
                        </h4>
                        <p className="text-xs text-brand-coral">
                          Full-time | Google Ads
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-brand-purple/10 flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-brand-purple" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Daily Optimisation
                        </h4>
                        <p className="text-xs text-brand-coral">
                          Bids, keywords, negatives
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center">
                          <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Performance Focus
                        </h4>
                        <p className="text-xs text-brand-coral">
                          CPL, QS, CTR improvements
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center">
                          <Users className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          White-Label Integration
                        </h4>
                        <p className="text-xs text-brand-coral">
                          Works with FSE account managers
                        </p>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            20–35%
                          </div>
                          <div className="text-xs text-gray-600">
                            CPL Reduction
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            7–9
                          </div>
                          <div className="text-xs text-gray-600">
                            Quality Scores
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            15–20
                          </div>
                          <div className="text-xs text-gray-600">
                            Hours Saved / Week
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            More
                          </div>
                          <div className="text-xs text-gray-600">
                            Accounts Handled
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Challenge Section */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-lg text-gray-600 mb-6">
                    FSE Digital wanted to grow their PPC capacity without
                    increasing in-house costs or diluting their brand. They
                    needed a dedicated specialist who would behave like an
                    internal hire — but with the flexibility and cost benefits of
                    an offshore model.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">
                    The Challenge
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-bold">!</span>
                      </div>
                      <span className="text-gray-600">
                        Expand PPC delivery across Search, Display, Shopping, and
                        Remarketing without hiring internally
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-bold">!</span>
                      </div>
                      <span className="text-gray-600">
                        Maintain consistent, weekly account improvements and
                        daily optimisation
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-bold">!</span>
                      </div>
                      <span className="text-gray-600">
                        Work fully behind their brand with complete white-label
                        confidentiality
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-bold">!</span>
                      </div>
                      <span className="text-gray-600">
                        Improve campaign efficiency (CPL, Quality Scores, CTR)
                        while keeping delivery costs efficient
                      </span>
                    </li>
                  </ul>
                </div>

                <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-700">
                      Pre-Partnership Snapshot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Internal PPC Capacity
                        </span>
                        <span className="text-red-600 font-semibold">
                          Stretched
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Cost per Lead</span>
                        <span className="text-red-600 font-semibold">
                          Higher &amp; Fluctuating
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Weekly Optimisation Time
                        </span>
                        <span className="text-red-600 font-semibold">
                          High (in-house)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Accounts Capacity</span>
                        <span className="text-red-600 font-semibold">
                          Limited Scaling Room
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Partnership Evolution / Our Solution */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-brand-purple mb-4">
                  How the Dedicated PPC Partnership Worked
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  A trained PPC specialist from BrandingBeez, working full-time
                  for FSE Digital, embedded into their workflows and client
                  processes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Badge className="bg-purple-100 text-purple-800">
                      Foundation Done Right
                    </Badge>
                  </div>
                  <CardHeader className="pt-4">
                    <CardTitle className="text-center">
                      <h3 className="text-xl font-bold text-gray-900">
                        Campaign Management
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          Setup of Search, Display, Remarketing &amp; Performance
                          Max
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          Structured ad groups, keywords &amp; ad extensions
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          Proper conversion tracking and budget structures
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Badge className="bg-blue-100 text-blue-800">
                      Always-On Improvement
                    </Badge>
                  </div>
                  <CardHeader className="pt-4">
                    <CardTitle className="text-center">
                      <h3 className="text-xl font-bold text-gray-900">
                        Daily Optimisation
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          Bid adjustments &amp; budget pacing
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          Adding/removing keywords &amp; negative lists
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          New ad copy tests and audience refinement
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Badge className="bg-green-100 text-green-800">
                      Seamless White-Label Fit
                    </Badge>
                  </div>
                  <CardHeader className="pt-4">
                    <CardTitle className="text-center">
                      <h3 className="text-xl font-bold text-gray-900">
                        Reporting &amp; White-Label Integration
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          Weekly optimisation summaries &amp; monthly dashboards
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          Joined FSE internal stand-ups &amp; workflows
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          All work delivered under FSE Digital’s brand
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Mid-funnel CTA Section (earlier CTA pattern added) */}
          <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Want a Dedicated PPC Specialist Under Your Brand?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Plug a full-time, white-label PPC specialist into your agency so
                your team can focus on client relationships, strategy, and upsells.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <Button
                  size="lg"
                  className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
                  onClick={() =>
                    window.open(
                      "/book-appointment",
                      "_blank"
                    )
                  }
                >
                  <Calendar className="w-5 h-5 mr-1" />
                  Book Your Strategy Call
                </Button> */}
                <BookCallButtonWithModal
                  buttonLabel="Book Your Strategy Call"
                  className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
                  buttonSize="lg"
                  buttonVariant="default"
                  defaultServiceType="Dedicated Resources"
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-brand-purple"
                  asChild
                >
                  <Link href="/pricing-calculator?service=dedicated-resources">
                    Get Pricing
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <Card className="text-center bg-white">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      20–35%
                    </div>
                    <div className="text-gray-600">Lower Cost per Lead</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Wasteful spend cut via low-intent keyword control
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center bg-white">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      15–20 hrs
                    </div>
                    <div className="text-gray-600">
                      Internal Time Saved / Week
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      FSE team able to focus on strategy &amp; client
                      relationships
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center bg-white">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      7–9
                    </div>
                    <div className="text-gray-600">Quality Score Range</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Better ad relevance &amp; CTR across key campaigns
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white border-2 border-purple-200">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Why This Partnership Worked
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>
                            Dedicated, full-time PPC specialist with no split
                            focus
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>
                            Complete white-label confidentiality — all work under
                            FSE Digital’s brand
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>
                            Consistent performance improvement and predictable
                            reporting rhythm
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>
                            Zero HR, hiring, or overhead costs for FSE Digital
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Future Scope
                      </h4>
                      <div className="space-y-3 text-sm text-gray-600">
                        <p>
                          BrandingBeez continues to support FSE Digital with PPC
                          resources as they add new client accounts and expand
                          paid media services.
                        </p>
                        <p>
                          The dedicated specialist model scales with their
                          portfolio, allowing them to take on more retainers
                          without worrying about capacity or hiring lead time.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-brand-purple mb-4">
                  Client Feedback
                </h2>
                <p className="text-xl text-gray-600">
                  A specialist that feels in-house with the flexibility of an
                  offshore model.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                  <CardContent className="p-8">
                    <Quote className="w-8 h-8 mb-4 opacity-80" />
                    <blockquote className="text-lg font-light mb-6 leading-relaxed">
                      &quot;Our dedicated PPC specialist operates just like an
                      internal team member — proactive, data-led, and fully in
                      tune with our clients. We’ve been able to grow accounts
                      without worrying about capacity.&quot;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold">F</span>
                      </div>
                      <div>
                        <div className="font-semibold">
                          Head of Paid Media, FSE Digital
                        </div>
                        <div className="text-white/80 text-sm">
                          FSE Digital, UK
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                  <CardContent className="p-8">
                    <Quote className="w-8 h-8 mb-4 opacity-80" />
                    <blockquote className="text-lg font-light mb-6 leading-relaxed">
                      &quot;The white-label setup is seamless. Our clients see
                      faster improvements and better performance, while we keep
                      our delivery lean and profitable.&quot;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold">M</span>
                      </div>
                      <div>
                        <div className="font-semibold">
                          Agency Leadership, FSE Digital
                        </div>
                        <div className="text-white/80 text-sm">
                          Performance Agency Partner
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Add a Dedicated PPC Specialist to Your Agency?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Scale your PPC delivery like FSE Digital with a full-time,
                white-label specialist who works as part of your team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <Button
                  size="lg"
                  className="bg-white text-brand-purple hover:bg-white/90 hover:text-brand-purple"
                  onClick={() =>
                    window.open(
                      "/book-appointment",
                      "_blank"
                    )
                  }
                >
                  <Calendar className="w-5 h-5 mr-1" />
                  Book Your Strategy Call
                </Button>
                 */}
                <BookCallButtonWithModal
                  buttonLabel="Book Your Strategy Call"
                  className="bg-white text-brand-purple hover:bg-gray-100 hover:text-brand-purple"
                  buttonSize="lg"
                  buttonVariant="default"
                  defaultServiceType="Dedicated Resources"
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-brand-purple"
                  asChild
                >
                  <Link href="/services/dedicated-resources">
                    View Other Dedicated Resources
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
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
