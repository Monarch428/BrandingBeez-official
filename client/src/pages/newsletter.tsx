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


import { useState } from "react";
import { Helmet } from "react-helmet";

export default function Newsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

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
      setStatus(
        data.success
          ? "✅ Subscription successful! Check your email."
          : `❌ ${data.message}`
      );

      if (data.success) {
        setName("");
        setEmail("");
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
        <title>Newsletter Subscription</title>
        <meta
          name="description"
          content="Subscribe to our newsletter - Agency Growth, Made Simple"
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-r from-[#CF4163] to-[#552265] text-white font-['Inter']">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

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

          {/* Right Form Card */}
          <div className="bg-white/15 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-center mb-2">
              Subscribe Free
            </h2>
            <p className="text-gray-200 text-center mb-6">
              Join 3,000+ agency owners — no spam.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubscribe();
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full bg-white/20 border border-white/30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:ring-2 focus:ring-white/40 outline-none"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
                className="w-full bg-white/20 border border-white/30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:ring-2 focus:ring-white/40 outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className={`bg-white text-[#552265] font-semibold py-3 rounded-lg hover:bg-gray-100 transition ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>

            {status && <p className="mt-4 text-center text-sm">{status}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
