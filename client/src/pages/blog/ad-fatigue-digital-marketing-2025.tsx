import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRegion } from "@/hooks/use-region";
import { Link } from "wouter";
import { OptimizedImage } from "@/components/optimized-image";
import adFatigueImage from "@assets/Blog - Ad Fatigue in Digital Marketing_1756535727153.png";
import { 
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Target,
  TrendingUp,
  RefreshCw,
  Zap,
  BarChart3,
  Eye,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Globe,
  Users
} from "lucide-react";

export default function AdFatigueDigitalMarketingBlog() {
  const { regionConfig } = useRegion();
  
  const openCalendly = () => {
    window.open(regionConfig.calendlyUrl, '_blank');
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPostData.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Head */}
      <title>Ad Fatigue in Digital Marketing: Causes & Solutions (2025) | BrandingBeez</title>
      <meta 
        name="description" 
        content="Learn what ad fatigue in digital marketing is, why it happens, and proven strategies to overcome it in 2025 for better campaign performance." 
      />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://brandingbeez.co.uk/blog/ad-fatigue-digital-marketing-2025"
          },
          "headline": "What is Ad Fatigue in Digital Marketing and How to Overcome It",
          "description": "Learn what ad fatigue in digital marketing is, why it happens, and proven strategies to overcome it in 2025 for better campaign performance.",
          "image": "https://brandingbeez.co.uk/images/ad-fatigue-digital-marketing.jpg", 
          "author": {
            "@type": "Organization",
            "name": "BrandingBeez",
            "url": "https://brandingbeez.co.uk"
          },
          "publisher": {
            "@type": "Organization",
            "name": "BrandingBeez",
            "logo": {
              "@type": "ImageObject",
              "url": "https://brandingbeez.co.uk/logo.png"
            }
          },
          "datePublished": "2025-01-28",
          "dateModified": "2025-01-28"
        }`}
      </script>

      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How often should I refresh my ads?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ads should be refreshed every 2–3 weeks depending on your budget and audience size to avoid ad fatigue."
              }
            },
            {
              "@type": "Question",
              "name": "Can small businesses face ad fatigue?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, even small businesses with limited ad budgets can experience ad fatigue if the same ad is shown repeatedly."
              }
            },
            {
              "@type": "Question",
              "name": "Which platforms are most affected by ad fatigue?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ad fatigue is most common on social platforms like Meta (Facebook & Instagram), LinkedIn, and TikTok where users quickly notice repeated ads."
              }
            }
          ]
        }`}
      </script>

      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://brandingbeez.co.uk/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://brandingbeez.co.uk/blog/"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Ad Fatigue in Digital Marketing",
              "item": "https://brandingbeez.co.uk/blog/ad-fatigue-digital-marketing-2025"
            }
          ]
        }`}
      </script>
      
      <Header />
      
      {/* Article Header */}
      <section className="py-8 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-6 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <Badge className="bg-white/20 text-white border-white/30 mb-4">
            <Target className="w-4 h-4 mr-2" />
            Digital Marketing
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            What is Ad Fatigue in Digital Marketing and How to Overcome It
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-white/90 mb-6">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Digital Marketing Team
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              January 28, 2025
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              10 min read
            </div>
          </div>
          
          <Button 
            onClick={shareArticle}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-brand-purple bg-transparent"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Article
          </Button>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="mb-12">
            <OptimizedImage
              src={adFatigueImage}
              alt="Ad Fatigue in Digital Marketing - Professional analyzing campaign performance"
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              width={800}
              height={400}
              loading="lazy"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-brand-purple mb-6 flex items-center">
                <Globe className="w-6 h-6 mr-3" />
                Introduction: What is Ad Fatigue?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ad fatigue in digital marketing happens when your audience sees the same ad too many times. Instead of engaging, they begin to ignore it — leading to lower click-through rates (CTR), higher costs per click (CPC), and wasted ad spend.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>In simple terms:</strong> your ads stop being effective because they've become stale.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This issue is common across platforms like Facebook, Instagram, Google, and LinkedIn. The good news? With the right strategies, you can overcome it and keep your campaigns performing well. If you're already running ads but struggling with performance, our <Link href="/services/google-ads" className="text-brand-coral hover:underline font-semibold">digital marketing services</Link> can help you optimize campaigns for better ROI.
              </p>
            </section>

            {/* Why Ad Fatigue Happens */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-brand-purple mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3" />
                Why Ad Fatigue Happens
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">Ad fatigue typically occurs because:</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
                  <p className="text-gray-700"><strong>Overexposure</strong> – The same audience sees your ad repeatedly.</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
                  <p className="text-gray-700"><strong>Static creatives</strong> – Visuals and copy don't evolve with audience interests.</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
                  <p className="text-gray-700"><strong>Poor targeting</strong> – Ads are shown to the wrong audience segments.</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
                  <p className="text-gray-700"><strong>High frequency</strong> – Ads are displayed more times than necessary.</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A well-structured strategy prevents fatigue by balancing reach, frequency, and creative variety. Partnering with an experienced <Link href="/services/seo" className="text-brand-coral hover:underline font-semibold">SEO agency</Link> ensures your ads stay fresh and targeted.
              </p>
            </section>

            {/* Signs of Ad Fatigue */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-brand-purple mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3" />
                Signs Your Campaign is Suffering from Ad Fatigue
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">Look for these warning signs in your analytics:</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-gray-700">Declining CTR despite consistent impressions.</p>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-gray-700">Rising CPC and CPM.</p>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-gray-700">Falling engagement on social ads.</p>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-gray-700">Lower conversion rates from previously strong campaigns.</p>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-gray-700">Audience feedback (negative comments, ad hides, or spam reports).</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border-l-4 border-red-500">
                <p className="text-gray-700 font-semibold">
                  ⚠️ If these trends show up, it's time to refresh your approach immediately.
                </p>
              </div>
            </section>

            {/* How to Overcome Ad Fatigue */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-brand-purple mb-6 flex items-center">
                <RefreshCw className="w-6 h-6 mr-3" />
                How to Overcome Ad Fatigue in Digital Marketing
              </h2>
              
              {/* Strategy 1 */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-purple mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  1. Rotate Your Creatives Regularly
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Change ad images, colors, and formats every 2–3 weeks.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Use dynamic creative optimization (DCO) to automate testing.</p>
                  </div>
                </div>
              </div>

              {/* Strategy 2 */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-purple mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  2. Refresh Ad Copy and Visuals
                </h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Update headlines, CTAs, and offers.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Try new angles (e.g., benefits-focused vs. problem-solving copy).</p>
                  </div>
                </div>
                <div className="border-l-4 border-brand-coral pl-6">
                  <p className="text-gray-700">
                    👉 Need professional ad copy? Our <Link href="/services" className="text-brand-coral hover:underline font-semibold">social media marketing services</Link> focus on crafting fresh creatives that convert.
                  </p>
                </div>
              </div>

              {/* Strategy 3 */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-purple mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  3. Segment and Personalize Audiences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Group audiences by demographics, behavior, or interests.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Serve tailored creatives that match each segment's intent.</p>
                  </div>
                </div>
              </div>

              {/* Strategy 4 */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-purple mb-3 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  4. Adjust Frequency Caps
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Limit how many times one person sees your ad.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <p className="text-gray-700">A frequency of 3–5 impressions per week works well for most campaigns.</p>
                  </div>
                </div>
              </div>

              {/* Strategy 5 */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-purple mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  5. Test New Channels and Formats
                </h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Expand from Facebook to LinkedIn, TikTok, or YouTube Shorts.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Experiment with video, carousel, or interactive formats.</p>
                  </div>
                </div>
                <div className="border-l-4 border-brand-coral pl-6">
                  <p className="text-gray-700">
                    If you're new to running ads on multiple platforms, our <Link href="/services/google-ads" className="text-brand-coral hover:underline font-semibold">PPC services</Link> can help you diversify while reducing wasted spend.
                  </p>
                </div>
              </div>
            </section>

            {/* Digital Marketing Maturity */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-brand-purple mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3" />
                Evaluating Your Digital Marketing Maturity
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                To sustain long-term performance, you must evaluate the digital marketing maturity of your business. Ask:
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
                  <p className="text-gray-700">Do you have a clear creative rotation plan?</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
                  <p className="text-gray-700">Are you using data-driven audience segmentation?</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
                  <p className="text-gray-700">How often do you test new channels or formats?</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
                  <p className="text-gray-700">Are you measuring success beyond clicks (e.g., lifetime value)?</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A mature digital marketing approach goes beyond one campaign. It integrates strategy, testing, and adaptability at every stage.
              </p>
            </section>

            {/* Latest News */}
            <section className="mb-12 p-6 bg-gradient-to-r from-brand-purple/10 to-brand-coral/10 rounded-lg">
              <h2 className="text-2xl font-bold text-brand-purple mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-3" />
                Latest Digital Marketing News – January 2025 Insights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Staying updated helps prevent ad fatigue. According to latest industry news (January 2025):
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
                  <p className="text-gray-700">AI-powered personalization is now mainstream, allowing real-time creative adjustments.</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
                  <p className="text-gray-700">Short-form video ads (10–15 seconds) outperform static images by up to 40% in engagement.</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-coral flex-shrink-0" />
                  <p className="text-gray-700">Cross-channel retargeting is critical, as users interact across multiple platforms daily.</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                By aligning your campaigns with these trends, you can reduce ad fatigue and stay ahead of competitors.
              </p>
            </section>

            {/* FAQ Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-brand-purple mb-8">
                Frequently Asked Questions About Ad Fatigue
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-brand-coral pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How often should I refresh my ads?
                  </h3>
                  <p className="text-gray-700">
                    Every 2–3 weeks, depending on budget and audience size.
                  </p>
                </div>
                
                <div className="border-l-4 border-brand-coral pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can small businesses face ad fatigue?
                  </h3>
                  <p className="text-gray-700">
                    Yes — even with small budgets, repeating the same ad hurts results.
                  </p>
                </div>
                
                <div className="border-l-4 border-brand-coral pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Which platforms are most affected?
                  </h3>
                  <p className="text-gray-700">
                    Social platforms (Meta, LinkedIn, TikTok) where users scroll quickly and notice repetition.
                  </p>
                </div>
                
                <div className="border-l-4 border-brand-coral pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Does SEO help reduce ad fatigue?
                  </h3>
                  <p className="text-gray-700">
                    Indirectly, yes. Strong SEO strategies reduce reliance on paid ads, giving your audience fresh organic content instead of seeing the same repetitive promotions.
                  </p>
                </div>
                
                <div className="border-l-4 border-brand-coral pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How can I know if my ads are too repetitive?
                  </h3>
                  <p className="text-gray-700">
                    Check analytics for high frequency scores, rising CPC, and low engagement. Audience surveys and feedback also reveal when ads feel "too much."
                  </p>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-brand-purple mb-6">
                Conclusion & Next Steps
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ad fatigue in digital marketing is a natural challenge, but one you can control with creativity, smart targeting, and regular performance checks. By evaluating your digital marketing maturity and staying updated with the latest 2025 trends, you'll keep your campaigns fresh, engaging, and profitable.
              </p>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-brand-coral mb-6">
                <p className="text-gray-700 font-semibold">
                  👉 Next step: Review your current ads today. Refresh one creative, test a new format, and monitor your results over the next two weeks.
                </p>
              </div>
            </section>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-brand-purple to-brand-coral p-8 rounded-lg text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Overcome Ad Fatigue and Boost Your ROI?</h3>
            <p className="text-lg mb-6">
              Contact BrandingBeez today to get expert help with refreshing your campaigns and maximizing performance.
            </p>
            <Button 
              onClick={openCalendly}
              size="lg"
              className="bg-white text-brand-purple hover:bg-gray-100"
            >
              Get Free Marketing Consultation
            </Button>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
}

export const blogPostData = {
  id: 5,
  slug: "ad-fatigue-digital-marketing-2025",
  title: "What is Ad Fatigue in Digital Marketing and How to Overcome It",
  subtitle: "Comprehensive guide to understanding and solving ad fatigue",
  excerpt: "Learn what ad fatigue in digital marketing is, why it happens, and proven strategies to overcome it in 2025 for better campaign performance.",
  imageUrl: "/images/ad-fatigue-digital-marketing.png",
  tags: ["Ad Fatigue", "Digital Marketing", "PPC", "Campaign Optimization"],
  author: "Digital Marketing Team",
  readTime: 10,
  isPublished: true,
  isFeatured: false,
  metaDescription: "Learn what ad fatigue in digital marketing is, why it happens, and proven strategies to overcome it in 2025 for better campaign performance.",
  metaTitle: "What is Ad Fatigue in Digital Marketing and How to Overcome It | BrandingBeez",
  createdAt: "2025-01-28T00:00:00Z",
  updatedAt: "2025-01-28T00:00:00Z",
  publishedAt: "2025-01-28T00:00:00Z",
  category: "Digital Marketing"
};
