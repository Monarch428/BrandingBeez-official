import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Zap } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-brand-coral/10 rounded-full flex items-center justify-center mb-8 mx-auto">
            <Clock className="w-12 h-12 text-brand-coral" />
          </div>
          
          {/* Main Content */}
          <h1 className="text-4xl md:text-5xl font-bold text-brand-purple mb-6">
            N8N Automations
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Coming Soon
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We're working hard to bring you powerful automation solutions that will streamline your business operations.
          </p>
          
          {/* Features Preview */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-brand-coral" />
              <h3 className="text-lg font-semibold text-brand-purple">What to Expect</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>• HR workflows</div>
              <div>• Email workflows</div>
              <div>• Marketing Workflows</div>
              <div>• Chat bot workflow</div>
            </div>
            <p className="text-sm text-brand-coral font-semibold mt-4">& More coming soon...</p>
          </div>
          
          {/* CTA */}
          <div className="space-y-4">
            <p className="text-gray-600">
              Want to be notified when N8N Automations launches?
            </p>
            <Link href="/contact">
              <Button className="bg-brand-coral rand-coral/90 text-white font-semibold px-6 py-3 mb-4">
                Get Notified
              </Button>
            </Link>
            <br />
            <Link href="/services">
              <Button variant="outline" className="border-brand-coral text-brand-coral rand-coral hite">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Services
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}