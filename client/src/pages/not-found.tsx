import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      
      <main className="pt-16 pb-16">
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="w-full max-w-2xl mx-auto shadow-xl border-0">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-brand-purple to-brand-coral rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="h-12 w-12 text-white" />
              </div>

              <h1 className="text-4xl font-bold text-brand-purple mb-4">
                Page Not Found
              </h1>
              
              <h2 className="text-xl text-gray-600 mb-6">
                We can't seem to find the page you're looking for
              </h2>

              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                The page you requested may have been moved, deleted, or doesn't exist. 
                Let's get you back on track with our services.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="bg-gradient-to-r from-brand-purple to-brand-coral text-white">
                    <Home className="w-5 h-5 mr-2" />
                    Go to Homepage
                  </Button>
                </Link>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go Back
                </Button>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/services/website-development">
                    <Button variant="ghost" size="sm" className="text-brand-purple hover:bg-brand-wings">
                      Website Development
                    </Button>
                  </Link>
                  <Link href="/services/seo">
                    <Button variant="ghost" size="sm" className="text-brand-purple hover:bg-brand-wings">
                      SEO Services
                    </Button>
                  </Link>
                  <Link href="/services/google-ads">
                    <Button variant="ghost" size="sm" className="text-brand-purple hover:bg-brand-wings">
                      Google Ads
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="ghost" size="sm" className="text-brand-purple hover:bg-brand-wings">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
