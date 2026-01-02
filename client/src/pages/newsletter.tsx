// import { useState } from "react";
// import { Helmet } from "react-helmet";

// export default function Newsletter() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubscribe = async () => {
//     if (!name.trim() || !email.trim()) {
//       setStatus("❌ Please enter both name and email");
//       return;
//     }

//     setLoading(true);
//     setStatus("");

//     try {
//       const response = await fetch(
//         "/api/newsletter/subscribe",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name, email }),
//         }
//       );

//       const data = await response.json();
//       setStatus(
//         data.success
//           ? "✅ Subscription successful! Check your email."
//           : `❌ ${data.message}`
//       );

//       if (data.success) {
//         setName("");
//         setEmail("");
//       }
//     } catch (err) {
//       console.error(err);
//       setStatus("❌ Server error. Try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* SEO */}
//       <Helmet>
//         <title>Newsletter Subscription</title>
//         <meta
//           name="description"
//           content="Subscribe to our newsletter - Agency Growth, Made Simple"
//         />
//       </Helmet>

//       <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-[#CF4163] to-[#552265] font-['Inter'] text-white">
//         <div className="max-w-4xl w-full">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
//               Your 1-Minute Read to Grow Your Agency
//             </h1>
//             <p className="text-lg text-gray-200">Agency Growth, Made Simple</p>
//           </div>

//           {/* Card */}
//           <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-white/20">
//             <div className="grid md:grid-cols-1 gap-8 items-center text-center">
//               {/* What’s inside */}
//               <div>
//                 <h2 className="text-3xl font-bold mb-3 text-white">
//                   Practical tips, tools, and trends — in a 1-minute read.
//                 </h2>
//                 <p className="text-gray-200 mb-6">What’s Inside</p>
//                 <div className="inline-block text-left">
//                   <ul className="space-y-4 text-gray-100">
//                     {[
//                       "Fast client-winning strategies",
//                       "Pricing & proposal hacks",
//                       "AI & automation tips",
//                       "Real stories from agencies like yours",
//                     ].map((item) => (
//                       <li className="flex items-start" key={item}>
//                         <span className="mr-3 text-white text-xl">✔️</span>
//                         <span>{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               {/* Subscription form */}
//               <div className="text-center">
//                 <h2 className="text-2xl font-semibold mb-4 text-white">
//                   Subscribe to our Newsletter
//                 </h2>
//                 <p className="text-gray-200 mb-6">
//                   Stay ahead of the curve with our 1-minute reports.
//                 </p>

//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     handleSubscribe();
//                   }}
//                   className="flex flex-col items-center gap-4 w-full md:w-1/2 mx-auto"
//                 >
//                   <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="Your Name"
//                     aria-label="Your Name"
//                     required
//                     className="w-full bg-white/20 border border-white/30 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
//                   />
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Your Email"
//                     aria-label="Your Email"
//                     required
//                     className="w-full bg-white/20 border border-white/30 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
//                   />
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`bg-white text-[#552265] font-semibold px-6 py-3 rounded-md transition-colors duration-300 w-full hover:bg-white/90 ${
//                       loading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {loading ? "Subscribing..." : "Subscribe Now"}
//                   </button>
//                 </form>
//                 {status && <p className="mt-4">{status}</p>}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


// import Footer from "@/components/footer";
// import Header from "@/components/header";
import { SchemaMarkup } from "@/components/schema-markup";
import { SEOHead } from "@/components/seo-head";
import { ThankYouPopup } from "@/components/thank-you-popup";
import { useState } from "react";
import { Helmet } from "react-helmet";

export default function Newsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  const handleSubscribe = async () => {
    if (!name.trim() || !email.trim()) {
      setStatus("❌ Please enter both name and email");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (data.success) {
        setShowThankYouPopup(true);
        setName("");
        setEmail("");
      } else {
        setStatus(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Subscribe to Branding Beez 1-Minute Agency Growth Tips</title>
        <meta
          name="description"
          content="Get weekly 1-minute reads packed with client-winning strategies, pricing hacks, AI tips, and success stories from real agencies. Subscribe free today."
        />
        <link rel="canonical" href="https://brandingbeez.co.uk/newsletter" />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>

      {/* <Header /> */}
      <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-r from-[#CF4163] to-[#552265] text-white font-['Inter']">
        <SEOHead
          title="Subscribe to Branding Beez 1-Minute Agency Growth Tips"
          description="Stay ahead with quick, actionable marketing insights — from client strategies to AI tools. Subscribe free in 1 minute."
          keywords="white label digital marketing, white label SEO, white label web development, white label Google Ads, agency growth, digital marketing agency services"
          canonicalUrl="https://brandingbeez.co.uk/newsletter"
          ogType="website"
        />
        <SchemaMarkup type="custom" />
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Your Weekly 1-Minute Agency Growth Insights
            </h1>

            <p className="text-gray-200 mb-8 leading-relaxed text-justify">
              Get actionable tips, pricing tricks, and automation tactics that
              help modern agencies grow faster — delivered in clean 1-minute reads.
            </p>

            <h2 className="text-xl font-semibold mb-3">What’s Inside</h2>

            <ul className="space-y-3 text-gray-100">
              {[
                "Fast client-winning strategies",
                "Pricing & proposal hacks",
                "AI & automation workflows",
                "Real stories from growing agencies",
              ].map((item) => (
                <li className="flex items-center gap-2" key={item}>
                  <span className="text-green-300 text-lg">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Form - Updated to Match Hero Section Form */}
          <div className="bg-[rgba(40,20,50,0.6)] backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 shadow-[0px_8px_32px_rgba(0,0,0,0.3)] max-w-md mx-auto w-full">

            {/* Header */}
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-white">
              Subscribe Free
            </h2>
            <p className="text-gray-200 text-center text-sm sm:text-base mb-6">
              Join 3,000+ agency owners — no spam.
            </p>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubscribe();
              }}
              className="flex flex-col h-full space-y-4"
            >
              {/* Scrollable Fields (Mobile friendly) */}
              <div className="space-y-4 max-h-[55vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-2 py-3 rounded-lg bg-white/25 text-white placeholder-gray-300
          border border-white/30 shadow-inner
          focus:border-white/60 focus:ring-1 focus:ring-white/40 
          focus:shadow-lg focus:scale-[1.01] transition-all duration-200"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-2 py-3 rounded-lg bg-white/25 text-white placeholder-gray-300
          border border-white/30 shadow-inner
          focus:border-white/60 focus:ring-1 focus:ring-white/40 
          focus:shadow-lg focus:scale-[1.01] transition-all duration-200"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                        w-full bg-white text-brand-purple font-bold py-3 rounded-lg
                        shadow-lg transition-colors duration-200
                        hover:bg-brand-coral hover:text-white
                        ${loading ? "opacity-60 cursor-not-allowed hover:bg-white hover:text-brand-purple" : ""}
                      `}
              >
                {loading ? "Subscribing..." : "Subscribe Now"}
              </button>



              {/* Confirmation Text */}
              {status && (
                <p className="text-sm text-gray-300 text-center mt-4">
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
      <ThankYouPopup
        isOpen={showThankYouPopup}
        onClose={() => setShowThankYouPopup(false)}
        title="Thanks for Subscribing!"
        message="You're all set! Check your email for exclusive agency growth tips and strategies. Welcome to the 3,000+ agency owners in our community!"
        formType="inquiry"
      />
      {/* <Footer /> */}
    </>
  );
}
