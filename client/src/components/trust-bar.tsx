import { useRegion } from "@/hooks/use-region";

export function TrustBar() {
  const { regionConfig } = useRegion();

  return (
    <section className="bg-white py-12 sm:py-16 border-b border-gray-200 relative overflow-hidden">
      {/* Optimized background elements */}
      <div className="absolute inset-0 gpu-accelerated">
        <div className="absolute top-4 left-1/4 w-20 h-20 bg-brand-yellow/8 rounded-full reduce-blur animate-float optimize-animations"></div>
        <div className="absolute bottom-4 right-1/3 w-16 h-16 bg-brand-coral/8 rounded-full reduce-blur animate-float optimize-animations" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Trust Logos */}
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-gray-600 mb-4 tracking-wider uppercase">
            {regionConfig.code === 'DE' ? 'VERTRAUENSPARTNER' : 'TRUSTED PARTNERS'}
          </p>
          <div className="w-16 h-0.5 bg-brand-coral mx-auto mb-8"></div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {/* Partner Badges */}
            <div className="px-6 py-3 bg-gray-100 border border-gray-200 rounded-md">
              <span className="text-sm font-medium text-gray-700">Microsoft Partner</span>
            </div>
            <div className="px-6 py-3 bg-gray-100 border border-gray-200 rounded-md">
              <span className="text-sm font-medium text-gray-700">AWS Partner</span>
            </div>
          </div>
        </div>
        
        {/* Success Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand-coral mb-2">25+</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">{regionConfig.code === 'DE' ? 'Partner-Agenturen' : 'Partner Agencies'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Global</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">{regionConfig.code === 'DE' ? 'Weltweiter Reach' : 'Worldwide Reach'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">85%</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">{regionConfig.code === 'DE' ? 'Zufriedenheit' : 'Satisfaction'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand-coral mb-2">24hr</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">{regionConfig.code === 'DE' ? 'Antwortzeit' : 'Response Time'}</div>
          </div>
        </div>
        
        {/* Partner Agencies Showcase */}
        <div className="text-center">
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {regionConfig.code === 'DE' ? 'Vertrauensvolle Partner-Agenturen' : 'Trusted Partner Agencies'}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              {regionConfig.code === 'DE' 
                ? 'Führende Agenturen weltweit vertrauen auf unsere Expertenteams für außergewöhnliche Ergebnisse für ihre Kunden.'
                : 'Trusted by leading agencies worldwide who rely on our expert teams to deliver exceptional results for their clients.'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Partner Agency Cards with Enhanced Design */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-brand-coral/20">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                SL
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-brand-coral transition-colors">Social Land</h4>
              <p className="text-xs text-gray-500 mb-2">Essex, UK</p>
              <div className="text-xs text-brand-coral font-medium">Digital Marketing</div>
            </div>
            
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-brand-coral/20">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                WA
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-brand-coral transition-colors">Website Architect</h4>
              <p className="text-xs text-gray-500 mb-2">California, USA</p>
              <div className="text-xs text-brand-coral font-medium">Web Development</div>
            </div>
            
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-brand-coral/20">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                FE
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-brand-coral transition-colors">Focus E-commerce</h4>
              <p className="text-xs text-gray-500 mb-2">London, UK</p>
              <div className="text-xs text-brand-coral font-medium">E-commerce</div>
            </div>
            
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-brand-coral/20">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                SC
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-brand-coral transition-colors">Smart Connecting</h4>
              <p className="text-xs text-gray-500 mb-2">Amsterdam, NL</p>
              <div className="text-xs text-brand-coral font-medium">Tech Solutions</div>
            </div>
            
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-brand-coral/20">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                NV
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-brand-coral transition-colors">New Vision Tech</h4>
              <p className="text-xs text-gray-500 mb-2">Miami, FL</p>
              <div className="text-xs text-brand-coral font-medium">AI Solutions</div>
            </div>
            
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-brand-coral/20">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                CW
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-brand-coral transition-colors">Carolina Web</h4>
              <p className="text-xs text-gray-500 mb-2">Charlotte, NC</p>
              <div className="text-xs text-brand-coral font-medium">Web Consulting</div>
            </div>
            
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-brand-coral/20">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                IN
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-brand-coral transition-colors">Intrinsic</h4>
              <p className="text-xs text-gray-500 mb-2">Toronto, CA</p>
              <div className="text-xs text-brand-coral font-medium">Brand Strategy</div>
            </div>
            
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-brand-coral/20">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
                SB
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-brand-coral transition-colors">Social Brain</h4>
              <p className="text-xs text-gray-500 mb-2">Sydney, AU</p>
              <div className="text-xs text-brand-coral font-medium">Social Media</div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">
              {regionConfig.code === 'DE' 
                ? 'Werden Sie unser nächster Partner und skalieren Sie Ihr Geschäft mit BrandingBeez'
                : 'Become our next partner and scale your business with BrandingBeez'
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
