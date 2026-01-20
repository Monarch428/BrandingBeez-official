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
      setStatus("Please enter both name and email");
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
        setStatus(data.message);
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>A Weekly Newsletter for Business Owners</title>
        <meta
          name="description"
          content="2-minute weekly reads for business owners who want to earn more by making better decisions. No noise. No motivation talk."
        />
        <link rel="canonical" href="https://brandingbeez.co.uk/newsletter" />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>

      <div
        className="
      min-h-screen
      bg-gradient-to-br from-[#CF4163] via-[#7B2C5C] to-[#552265]
      text-white font-['Inter']
      md:h-screen md:overflow-hidden
    "
      >
        <SEOHead
          title="Weekly Insights for Business Owners"
          description="Short, practical insights on how businesses actually grow."
          canonicalUrl="https://brandingbeez.co.uk/newsletter"
          ogType="website"
        />
        <SchemaMarkup type="custom" />

        <div
          className="
        max-w-7xl mx-auto
        px-4 sm:px-6 lg:px-8
        py-12 md:py-0
        md:h-full
        grid
        grid-cols-1
        md:grid-cols-12
        gap-10
        items-center
      "
        >

          {/* LEFT CONTENT */}
          <div className="md:col-span-7 space-y-4 sm:space-y-5">

            <h1
              className="
            text-2xl
            sm:text-3xl
            lg:text-4xl
            xl:text-5xl
            font-bold
            leading-tight
          "
            >
              A weekly newsletter for business owners
              <span className="text-brand-yellow"> who want to earn more</span>
            </h1>

            <p className="text-gray-200 text-sm sm:text-base">
              Most businesses don’t fail. They just make slow, expensive decisions.
            </p>

            <p className="text-gray-200 text-sm sm:text-base">
              2-minute reads on how businesses actually grow.
              What’s working. What’s not. And what to focus on next.
            </p>

            <p className="text-gray-300 text-xs sm:text-sm italic font-medium">
              No noise. No motivation talk.
            </p>

            {/* LEFT FORM — MOBILE ONLY (≤ 480px) */}
            <div className="block max-[480px]:block min-[481px]:hidden mt-6">
              <div className="relative w-full max-w-sm mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-coral to-purple-500 rounded-2xl blur opacity-30" />

                <div
                  className="
                relative
                bg-[#1B0F22]/85
                backdrop-blur-xl
                border border-white/10
                rounded-2xl
                p-5
                shadow-xl
              "
                >
                  <h2 className="text-base font-bold text-center mb-1">
                    Join the newsletter
                  </h2>

                  <p className="text-gray-300 text-[11px] text-center mb-4">
                    Join 1,000+ business owners reading this every week.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubscribe();
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="
                    w-full px-3 py-2
                    rounded-lg
                    bg-white/10
                    border border-white/20
                    text-sm
                    text-white
                    placeholder-gray-400
                    focus:outline-none focus:ring-1 focus:ring-brand-coral
                  "
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      required
                      className="
                    w-full px-3 py-2
                    rounded-lg
                    bg-white/10
                    border border-white/20
                    text-sm
                    text-white
                    placeholder-gray-400
                    focus:outline-none focus:ring-1 focus:ring-brand-coral
                  "
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className={`
                    w-full py-2 rounded-lg
                    text-sm font-semibold
                    transition
                    ${loading
                          ? "bg-white/40 text-gray-700 cursor-not-allowed"
                          : "bg-white text-[#552265] hover:bg-brand-coral hover:text-white"
                        }
                  `}
                    >
                      {loading ? "Joining..." : "Join"}
                    </button>

                    {status && (
                      <p className="text-[11px] text-center text-gray-300">
                        {status}
                      </p>
                    )}
                  </form>

                  <p className="text-[11px] text-gray-400 text-center mt-3">
                    One email per week. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Compact bullets */}
            <div
              className="
    grid
    grid-cols-1
    sm:grid-cols-2
    gap-0 sm:gap-3
    pt-2
  "
            >
              {[
                "What’s working across real businesses",
                "What’s quietly failing and hurting growth",
                "How experienced owners think about scaling",
                "What’s changing and why it matters",
              ].map((item) => (
                <div
                  key={item}
                  className="
        flex items-start gap-2
        pl-2 py-2 pr-2
        rounded-xl
        md:bg-white/5
        md:border md:border-white/10
        md:backdrop-blur-sm
      "
                >
                  <span className="text-green-300 text-sm font-bold">✓</span>
                  <span className="text-sm text-gray-100 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>


            {/* Who it’s for */}
            <div className="pt-3">
              <h3 className="text-sm sm:text-base font-medium mb-2">
                This is for you if:
              </h3>

              <ul
                className="
      grid
      grid-cols-1
      sm:grid-cols-2
      gap-x-4 gap-0 sm:gap-3
      text-xs sm:text-sm
      text-gray-200
    "
              >
                {[
                  "You run a business or an agency",
                  "You want growth without added chaos",
                  "You care about margins, not busyness",
                  "You want clearer decisions as you scale",
                ].map((item) => (
                  <li
                    key={item}
                    className="
          flex items-start gap-2
          px-3 py-2
          rounded-xl
          md:bg-white/5
          md:border md:border-white/10
          md:backdrop-blur-sm
        "
                  >
                    <span className="text-green-300">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* RIGHT FORM — TABLET / DESKTOP ONLY (≥ 481px) */}
          <div className="hidden max-[480px]:hidden min-[481px]:flex md:col-span-5 justify-center md:justify-end">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-coral to-purple-500 rounded-2xl blur opacity-30" />

              <div
                className="
              relative
              bg-[#1B0F22]/85
              backdrop-blur-xl
              border border-white/10
              rounded-2xl
              p-5 sm:p-6
              shadow-xl
            "
              >
                <h2 className="text-base sm:text-lg font-bold text-center mb-1">
                  Join the newsletter
                </h2>

                <p className="text-gray-300 text-[11px] sm:text-xs text-center mb-4">
                  Join 1,000+ business owners reading this every week.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubscribe();
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="
                  w-full px-3 py-2
                  rounded-lg
                  bg-white/10
                  border border-white/20
                  text-sm
                  text-white
                  placeholder-gray-400
                  focus:outline-none focus:ring-1 focus:ring-brand-coral
                "
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="
                  w-full px-3 py-2
                  rounded-lg
                  bg-white/10
                  border border-white/20
                  text-sm
                  text-white
                  placeholder-gray-400
                  focus:outline-none focus:ring-1 focus:ring-brand-coral
                "
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className={`
                  w-full py-2 rounded-lg
                  text-sm font-semibold
                  transition
                  ${loading
                        ? "bg-white/40 text-gray-700 cursor-not-allowed"
                        : "bg-white text-[#552265] hover:bg-brand-coral hover:text-white"
                      }
                `}
                  >
                    {loading ? "Joining..." : "Join"}
                  </button>

                  {status && (
                    <p className="text-[11px] text-center text-gray-300">
                      {status}
                    </p>
                  )}
                </form>

                <p className="text-[11px] text-gray-400 text-center mt-3">
                  One email per week. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ThankYouPopup
        isOpen={showThankYouPopup}
        onClose={() => setShowThankYouPopup(false)}
        title="Thanks for Subscribing!"
        message="Your first issue will arrive soon. Each edition focuses on how business owners think, decide, and adjust as they scale so growth feels more intentional and less like guesswork."
        formType="newsletter"
      />
    </>
  );
}
