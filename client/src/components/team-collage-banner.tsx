// import { Card } from "@/components/ui/card";
// import { OptimizedImage } from "@/components/optimized-image";

// // Import team member images
// import VigneshStroke from "@assets/Vignesh Stroke_1753273695214.png";
// import RajeStroke from "@assets/Raje Stroke_1753273695213.png";
// import CharanStroke from "@assets/Charan Stroke_1753273701283.png";
// import PriyaStroke from "@assets/Priya Stroke_1753273695213.png";
// import Mathavan_Stroke from "@assets/Mathavan_Stroke.png";
// import Logu_Stroke from "@assets/Logu_Stroke.png";
// import Sathish_Stroke from "@assets/Sathish_Stroke.png";
// import Azeez_Stroke from "@assets/Azeez_Stroke.png"
// import VishnuStroke from "@assets/Vishnu Stroke_1753273695214.png";
// import YuvaStroke from "@assets/Yuva Stroke_1753273695215.png";
// import GopalStroke from "@assets/Gopal Stroke_1753273701284.png";
// import AthiraStroke from "@assets/Athira Stroke_1753273701280.png";
// // import Praveen_Stroke from "@assets/Praveen_Stroke.png";
// import NijuStroke from "@assets/Niju Stroke_1753273695212.png";
// import Pradeep_Stroke from "../../public/images/Pradeep-team-member.png";
// import Jithendran_Stroke from "../../public/images/Jithen-team-member.png";
// import Raja_Stroke from "../../public/images/Raja-team-member.png";


// interface TeamMember {
//   name: string;
//   role: string;
//   image: string;
//   position: { x: number; y: number; size: number };
// }

// const teamMembers: TeamMember[] = [
//   // Front row - larger images for key leadership
//   { name: "Vignesh", role: "Founder & CEO", image: VigneshStroke, position: { x: 15, y: 25, size: 120 } },
//   { name: "Raje", role: "CEO", image: RajeStroke, position: { x: 45, y: 25, size: 120 } },
//   { name: "Charan", role: "Chief Visionary Officer", image: CharanStroke, position: { x: 75, y: 25, size: 120 } },

//   // Second row - technical leads
//   { name: "Mathavan", role: "AI Developer", image: Mathavan_Stroke, position: { x: 10, y: 65, size: 100 } },
//   { name: "Logu", role: "Full-Stack Developer", image: Logu_Stroke, position: { x: 30, y: 65, size: 100 } },
//   { name: "Vishnu", role: "WordPress Developer", image: VishnuStroke, position: { x: 50, y: 65, size: 100 } },
//   { name: "Yuva", role: "SEO Specialist", image: YuvaStroke, position: { x: 70, y: 65, size: 100 } },
//   { name: "Gopal", role: "Google Ads Expert", image: GopalStroke, position: { x: 90, y: 65, size: 100 } },
//   { name: "Raja", role: "AI Specialist", image: Raja_Stroke, position: { x: 25, y: 85, size: 90 } },
//   { name: "Jithendran", role: "Video Editor", image: Jithendran_Stroke, position: { x: 5, y: 85, size: 90 } },


//   // Third row - creative and support team
//   { name: "Sathesh", role: "Full-Stack Developer", image: Sathish_Stroke, position: { x: 5, y: 5, size: 90 } },
//   { name: "Pradeep", role: "Full-Stack Developer", image: Pradeep_Stroke, position: { x: 25, y: 5, size: 90 } },
//   { name: "Priya", role: "Automation Specialist", image: PriyaStroke, position: { x: 55, y: 5, size: 90 } },
//   { name: "Athira", role: "HR", image: AthiraStroke, position: { x: 75, y: 5, size: 90 } },
//   { name: "Azeez", role: "Graphic Designer", image: Azeez_Stroke, position: { x: 95, y: 5, size: 90 } },
//   { name: "Niju", role: "WordPress Developer", image: NijuStroke, position: { x: 85, y: 85, size: 90 } },
// ];

// export function TeamCollageBanner() {
//   return (
//     <div className="w-full bg-gradient-to-br from-brand-purple via-brand-coral to-pink-500 py-16 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
//             Meet Our Global Team
//           </h2>
//           <p className="text-xl text-white/90 max-w-3xl mx-auto">
//             14 passionate professionals from around the world, working together to deliver exceptional results for our clients
//           </p>
//         </div>

//         <div className="relative w-full max-w-6xl mx-auto">
//           {/* Interactive team collage using CSS Grid */}
//           <div className="relative aspect-video w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 overflow-hidden">
//             {/* Animated background elements */}
//             <div className="absolute top-8 left-8 w-32 h-32 bg-white/8 rounded-full animate-float optimize-animations"></div>
//             <div className="absolute top-4 right-4 w-20 h-20 bg-white/8 rounded-full animate-float optimize-animations"></div>
//             <div className="absolute bottom-8 left-1/4 w-24 h-24 bg-white/8 rounded-full animate-float optimize-animations" style={{ animationDelay: '0.5s' }}></div>
//             <div className="absolute top-1/2 right-8 w-12 h-12 bg-white/8 rounded-full animate-float optimize-animations" style={{ animationDelay: '1s' }}></div>

//             {/* Team member images positioned absolutely */}
//             {teamMembers.map((member, index) => (
//               <div
//                 key={member.name}
//                 className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer hover:scale-110 transition-all duration-300 z-10"
//                 style={{
//                   left: `${member.position.x}%`,
//                   top: `${member.position.y}%`,
//                   width: `${member.position.size}px`,
//                   height: `${member.position.size}px`,
//                   animationDelay: `${index * 0.1}s`
//                 }}
//               >
//                 <div className="relative">
//                   <OptimizedImage
//                     src={member.image}
//                     alt={`${member.name} - ${member.role}`}
//                     className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
//                     loading="lazy"
//                     width={member.position.size}
//                     height={member.position.size}
//                     decoding="async"
//                   />

//                   {/* Tooltip on hover */}
//                   <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
//                     <div className="font-semibold">{member.name}</div>
//                     <div className="text-xs text-gray-300">{member.role}</div>
//                     <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
//                   </div>

//                   {/* Animated ring around image */}
//                   <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/40 to-white/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
//                 </div>
//               </div>
//             ))}

//             {/* Floating decoration elements */}
//             <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/8 rounded-full animate-float optimize-animations" style={{ animationDelay: '1.5s' }}></div>
//             <div className="absolute top-1/3 left-4 w-8 h-8 bg-white/8 rounded-full animate-float optimize-animations" style={{ animationDelay: '2s' }}></div>
//           </div>
//         </div>

//         {/* Stats section */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
//           <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
//             <div className="text-3xl font-bold text-white mb-2">20+</div>
//             <div className="text-white/80">Team Members</div>
//           </Card>
//           <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
//             <div className="text-3xl font-bold text-white mb-2">5+</div>
//             <div className="text-white/80">Countries</div>
//           </Card>
//           <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
//             <div className="text-3xl font-bold text-white mb-2">24hr</div>
//             <div className="text-white/80">Response Time</div>
//           </Card>
//           <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
//             <div className="text-3xl font-bold text-white mb-2">99%</div>
//             <div className="text-white/80">Client Satisfaction</div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }






import { Card } from "@/components/ui/card";
import { OptimizedImage } from "@/components/optimized-image";

// Import team member images
import VigneshStroke from "@assets/Vignesh Stroke_1753273695214.png";
import RajeStroke from "@assets/Raje Stroke_1753273695213.png";
import CharanStroke from "@assets/Charan Stroke_1753273701283.png";
import PriyaStroke from "@assets/Priya Stroke_1753273695213.png";
import Mathavan_Stroke from "@assets/Mathavan_Stroke.png";
import Logu_Stroke from "@assets/Logu_Stroke.png";
import Sathish_Stroke from "@assets/Sathish_Stroke.png";
import Azeez_Stroke from "@assets/Azeez_Stroke.png";
import VishnuStroke from "@assets/Vishnu Stroke_1753273695214.png";
import YuvaStroke from "@assets/Yuva Stroke_1753273695215.png";
import GopalStroke from "@assets/Gopal Stroke_1753273701284.png";
import AthiraStroke from "@assets/Athira Stroke_1753273701280.png";
// import Praveen_Stroke from "@assets/Praveen_Stroke.png";
import NijuStroke from "@assets/Niju Stroke_1753273695212.png";
import Pradeep_Stroke from "../../public/images/Pradeep-team-member.png";
import Jithendran_Stroke from "../../public/images/Jithen-team-member.png";
import Raja_Stroke from "../../public/images/Raja-team-member.png";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  position: { x: number; y: number; size: number };
}

const teamMembers: TeamMember[] = [
  // Front row - larger images for key leadership
  { name: "Vignesh", role: "Founder & CEO", image: VigneshStroke, position: { x: 15, y: 25, size: 120 } },
  { name: "Raje", role: "CEO", image: RajeStroke, position: { x: 45, y: 25, size: 120 } },
  { name: "Charan", role: "Chief Visionary Officer", image: CharanStroke, position: { x: 75, y: 25, size: 120 } },

  // Second row - technical leads
  { name: "Mathavan", role: "AI Developer", image: Mathavan_Stroke, position: { x: 10, y: 65, size: 100 } },
  { name: "Logu", role: "Full-Stack Developer", image: Logu_Stroke, position: { x: 30, y: 65, size: 100 } },
  { name: "Vishnu", role: "WordPress Developer", image: VishnuStroke, position: { x: 50, y: 65, size: 100 } },
  { name: "Yuva", role: "SEO Specialist", image: YuvaStroke, position: { x: 70, y: 65, size: 100 } },
  { name: "Gopal", role: "Google Ads Expert", image: GopalStroke, position: { x: 90, y: 65, size: 100 } },
  { name: "Raja", role: "AI Specialist", image: Raja_Stroke, position: { x: 25, y: 85, size: 90 } },
  { name: "Jithendran", role: "Video Editor", image: Jithendran_Stroke, position: { x: 5, y: 85, size: 90 } },

  // Third row - creative and support team
  { name: "Sathesh Kumar", role: "Full-Stack Developer", image: Sathish_Stroke, position: { x: 5, y: 5, size: 90 } },
  { name: "Pradeep", role: "Full-Stack Developer", image: Pradeep_Stroke, position: { x: 25, y: 5, size: 90 } },
  { name: "Priya", role: "Automation Specialist", image: PriyaStroke, position: { x: 55, y: 5, size: 90 } },
  { name: "Athira", role: "HR", image: AthiraStroke, position: { x: 75, y: 5, size: 90 } },
  { name: "Azeez", role: "Graphic Designer", image: Azeez_Stroke, position: { x: 95, y: 5, size: 90 } },
  { name: "Niju", role: "WordPress Developer", image: NijuStroke, position: { x: 85, y: 85, size: 90 } },
];

export function TeamCollageBanner() {
  return (
    <div className="w-full bg-gradient-to-br from-brand-purple via-brand-coral to-pink-500 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet Our Global Team
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            14 passionate professionals from around the world, working together to deliver exceptional results for our clients
          </p>
        </div>

        <div className="relative w-full max-w-6xl mx-auto">
          {/* Interactive team collage using CSS Grid */}
          <div className="relative aspect-video w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-8 left-8 w-32 h-32 bg-white/8 rounded-full animate-float optimize-animations"></div>
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/8 rounded-full animate-float optimize-animations"></div>
            <div className="absolute bottom-8 left-1/4 w-24 h-24 bg-white/8 rounded-full animate-float optimize-animations" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 right-8 w-12 h-12 bg-white/8 rounded-full animate-float optimize-animations" style={{ animationDelay: '1s' }}></div>

            {/* Team member images positioned absolutely */}
            {teamMembers.map((member, index) => {
              const showBelow = member.position.y < 35; 
              const tooltipBase =
                "absolute left-1/2 -translate-x-1/2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20";
              const tooltipPos = showBelow
                ? "top-full mt-2"
                : "bottom-full mb-2";
              const arrowBase =
                "absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent";
              const arrowPos = showBelow
                ? "bottom-full border-b-4 border-b-black/80"
                : "top-full border-t-4 border-t-black/80";

              return (
                <div
                  key={member.name}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer hover:scale-110 transition-all duration-300 z-10"
                  style={{
                    left: `${member.position.x}%`,
                    top: `${member.position.y}%`,
                    width: `${member.position.size}px`,
                    height: `${member.position.size}px`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="relative">
                    <OptimizedImage
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                      loading="lazy"
                      width={member.position.size}
                      height={member.position.size}
                      decoding="async"
                    />

                    {/* Tooltip on hover (dynamic placement) */}
                    <div className={`${tooltipBase} ${tooltipPos}`}>
                      <div className="font-semibold">{member.name}</div>
                      <div className="text-xs text-gray-300">{member.role}</div>
                      <div className={`${arrowBase} ${arrowPos}`}></div>
                    </div>

                    {/* Animated ring around image */}
                    <div className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-white/40 to-white/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                  </div>
                </div>
              );
            })}

            {/* Floating decoration elements */}
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/8 rounded-full animate-float optimize-animations" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/3 left-4 w-8 h-8 bg-white/8 rounded-full animate-float optimize-animations" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">20+</div>
            <div className="text-white/80">Team Members</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">5+</div>
            <div className="text-white/80">Countries</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">24hr</div>
            <div className="text-white/80">Response Time</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">99%</div>
            <div className="text-white/80">Client Satisfaction</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
