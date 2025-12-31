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
// import Azeez_Stroke from "@assets/Azeez_Stroke.png";
// import VishnuStroke from "@assets/Vishnu Stroke_1753273695214.png";
// import YuvaStroke from "@assets/Yuva Stroke_1753273695215.png";
// import GopalStroke from "@assets/Gopal Stroke_1753273701284.png";
// import AthiraStroke from "@assets/Athira Stroke_1753273701280.png";
// // import Praveen_Stroke from "@assets/Praveen_Stroke.png";
// import NijuStroke from "@assets/Niju Stroke_1753273695212.png";
// import Pradeep_Stroke from "@assets/Pradeep-team-member.png";
// import Jithendran_Stroke from "@assets/Jithen-team-member.png";
// import Raja_Stroke from "@assets/Raja-team-member.png";
// import pranav_Stroke from "@assets/Pranav-team-member.png";


// interface TeamMember {
//   name: string;
//   role: string;
//   image: string;
//   position: { x: number; y: number; size: number };
// }

// const teamMembers: TeamMember[] = [
//   // TOP ROW – closer to collage top
//   { name: "Sathesh Kumar", role: "Full-Stack Developer", image: Sathish_Stroke, position: { x: 7, y: 14, size: 78 }, },
//   { name: "Pradeep", role: "Full-Stack Developer", image: Pradeep_Stroke, position: { x: 24, y: 20, size: 78 }, },
//   { name: "Priya", role: "Automation Specialist", image: PriyaStroke, position: { x: 41, y: 14, size: 78 }, },
//   { name: "Athira", role: "HR", image: AthiraStroke, position: { x: 72, y: 14, size: 78 }, },
//   { name: "Azeez", role: "Graphic Designer", image: Azeez_Stroke, position: { x: 90, y: 14, size: 78 }, },

//   // MIDDLE ROW – key leadership
//   { name: "Vignesh", role: "Founder & CEO", image: VigneshStroke, position: { x: 16, y: 44, size: 96 }, },
//   { name: "Raje", role: "CEO", image: RajeStroke, position: { x: 47, y: 44, size: 104 }, },
//   { name: "Charan", role: "Chief Visionary Officer", image: CharanStroke, position: { x: 80, y: 46, size: 96 }, },

//   // LOWER-MIDDLE ROW – technical leads
//   { name: "Niju", role: "WordPress Developer", image: NijuStroke, position: { x: 7, y: 74, size: 84 }, },
//   { name: "Logu", role: "Full-Stack Developer", image: Logu_Stroke, position: { x: 37, y: 64, size: 84 }, },
//   { name: "Vishnu", role: "WordPress Developer", image: VishnuStroke, position: { x: 59, y: 28, size: 76 }, },
//   { name: "Yuva", role: "SEO Specialist", image: YuvaStroke, position: { x: 67, y: 65, size: 84 }, },
//   { name: "Gopal", role: "Google Ads Expert", image: GopalStroke, position: { x: 91, y: 73, size: 84 }, },

//   // BOTTOM ROW – extra members
//   { name: "Jithendran", role: "Video Editor", image: Jithendran_Stroke, position: { x: 25, y: 78, size: 76 }, },
//   { name: "Raja", role: "AI Specialist", image: Raja_Stroke, position: { x: 55, y: 78, size: 76 }, },
//   { name: "Pranavkumar", role: "Content Manager", image: pranav_Stroke, position: { x: 78, y: 84, size: 76 }, },
// ];

// export function TeamCollageBanner() {
//   return (
//     <div className="w-full bg-gradient-to-br from-brand-purple via-brand-coral to-pink-500 py-10 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Heading */}
//         <div className="text-center mb-8">
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
//             Meet Our Global Team
//           </h2>
//           <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
//             14 passionate professionals from around the world, working together
//             to deliver exceptional results for our clients
//           </p>
//         </div>

//         {/* Collage */}
//         <div className="relative w-full max-w-6xl mx-auto">
//           <div className="relative w-full h-[320px] sm:h-[340px] md:h-[360px] bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
//             {/* Small floating background bubbles */}
//             <div className="absolute top-6 left-6 w-20 h-20 bg-white/8 rounded-full animate-float optimize-animations" />
//             <div className="absolute top-4 right-6 w-14 h-14 bg-white/8 rounded-full animate-float optimize-animations" />
//             <div
//               className="absolute bottom-6 left-1/4 w-16 h-16 bg-white/8 rounded-full animate-float optimize-animations"
//               style={{ animationDelay: "0.4s" }}
//             />
//             <div
//               className="absolute top-1/2 right-8 w-10 h-10 bg-white/8 rounded-full animate-float optimize-animations"
//               style={{ animationDelay: "0.8s" }}
//             />

//             {/* Team member images */}
//             {teamMembers.map((member, index) => {
//               const showBelow = member.position.y < 45;
//               const tooltipBase =
//                 "absolute left-1/2 -translate-x-1/2 px-3 py-2 bg-black/80 text-white text-xs md:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20";
//               const tooltipPos = showBelow
//                 ? "top-full mt-1.5"
//                 : "bottom-full mb-1.5";
//               const arrowBase =
//                 "absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent";
//               const arrowPos = showBelow
//                 ? "bottom-full border-b-4 border-b-black/80"
//                 : "top-full border-t-4 border-t-black/80";

//               return (
//                 <div
//                   key={member.name}
//                   className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer hover:scale-110 transition-all duration-300 z-10"
//                   style={{
//                     left: `${member.position.x}%`,
//                     top: `${member.position.y}%`,
//                     width: `${member.position.size}px`,
//                     height: `${member.position.size}px`,
//                     animationDelay: `${index * 0.08}s`,
//                   }}
//                 >
//                   <div className="relative">
//                     <OptimizedImage
//                       src={member.image}
//                       alt={`${member.name} - ${member.role}`}
//                       className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
//                       loading="lazy"
//                       width={member.position.size}
//                       height={member.position.size}
//                       decoding="async"
//                     />

//                     {/* Tooltip */}
//                     <div className={`${tooltipBase} ${tooltipPos}`}>
//                       <div className="font-semibold">{member.name}</div>
//                       <div className="text-[10px] md:text-xs text-gray-300">
//                         {member.role}
//                       </div>
//                       <div className={`${arrowBase} ${arrowPos}`} />
//                     </div>

//                     {/* Glow ring */}
//                     <div className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-white/40 to-white/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
//                   </div>
//                 </div>
//               );
//             })}

//             {/* Extra small bubbles */}
//             <div
//               className="absolute bottom-4 right-5 w-10 h-10 bg-white/8 rounded-full animate-float optimize-animations"
//               style={{ animationDelay: "1.2s" }}
//             />
//             <div
//               className="absolute top-1/3 left-5 w-6 h-6 bg-white/8 rounded-full animate-float optimize-animations"
//               style={{ animationDelay: "1.6s" }}
//             />
//           </div>
//         </div>

//         {/* Stats section – Smaller Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
//           <Card className="bg-white/10 backdrop-blur-sm border-white/20 py-4 px-3 text-center rounded-xl">
//             <div className="text-2xl font-bold text-white mb-1">20+</div>
//             <div className="text-white/75 text-sm">Team Members</div>
//           </Card>

//           <Card className="bg-white/10 backdrop-blur-sm border-white/20 py-4 px-3 text-center rounded-xl">
//             <div className="text-2xl font-bold text-white mb-1">5+</div>
//             <div className="text-white/75 text-sm">Countries</div>
//           </Card>

//           <Card className="bg-white/10 backdrop-blur-sm border-white/20 py-4 px-3 text-center rounded-xl">
//             <div className="text-2xl font-bold text-white mb-1">24hr</div>
//             <div className="text-white/75 text-sm">Response Time</div>
//           </Card>

//           <Card className="bg-white/10 backdrop-blur-sm border-white/20 py-4 px-3 text-center rounded-xl">
//             <div className="text-2xl font-bold text-white mb-1">99%</div>
//             <div className="text-white/75 text-sm">Client Satisfaction</div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }


import { Card } from "@/components/ui/card";
import { OptimizedImage } from "@/components/optimized-image";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  position: { x: number; y: number; size: number };
}

const teamMembers: TeamMember[] = [
  // TOP ROW
  {
    name: "Sathesh Kumar",
    role: "Full-Stack Developer",
    image: "/images/Sathish_Stroke.webp",
    position: { x: 7, y: 14, size: 78 },
  },
  {
    name: "Pradeep",
    role: "Full-Stack Developer",
    image: "/images/Pradeep-team-member.webp",
    position: { x: 24, y: 20, size: 78 },
  },
  {
    name: "Priya",
    role: "Automation Specialist",
    image: "/images/priya-team-member.webp",
    position: { x: 41, y: 14, size: 78 },
  },
  {
    name: "Athira",
    role: "HR",
    image: "/images/Athira-team-member.webp",
    position: { x: 72, y: 14, size: 78 },
  },
  {
    name: "Azeez",
    role: "Graphic Designer",
    image: "/images/azeez-team-member.webp",
    position: { x: 90, y: 14, size: 78 },
  },

  // MIDDLE ROW – leadership
  {
    name: "Vignesh",
    role: "Founder & CEO",
    image: "/images/vignesh-founder.webp",
    position: { x: 16, y: 44, size: 96 },
  },
  {
    name: "Raje",
    role: "CEO",
    image: "/images/raje-team-member.webp",
    position: { x: 47, y: 44, size: 104 },
  },
  {
    name: "Charan",
    role: "Chief Visionary Officer",
    image: "/images/Charan-team-member.webp",
    position: { x: 80, y: 46, size: 96 },
  },

  // LOWER MIDDLE
  {
    name: "Niju",
    role: "WordPress Developer",
    image: "/images/niju-team-member.webp",
    position: { x: 7, y: 74, size: 84 },
  },
  {
    name: "Logu",
    role: "Full-Stack Developer",
    image: "/images/Logu_Stroke.webp",
    position: { x: 37, y: 64, size: 84 },
  },
  {
    name: "Vishnu",
    role: "WordPress Developer",
    image: "/images/vishnu-team-member.webp",
    position: { x: 59, y: 28, size: 76 },
  },
  {
    name: "Gopal",
    role: "Google Ads Expert",
    image: "/images/gopal-team-member.webp",
    position: { x: 91, y: 73, size: 84 },
  },

  // BOTTOM
  {
    name: "Jithendran",
    role: "Video Editor",
    image: "/images/Jithen-team-member.webp",
    position: { x: 25, y: 78, size: 76 },
  },
  {
    name: "Raja",
    role: "AI Specialist",
    image: "/images/Raja-team-member.webp",
    position: { x: 55, y: 78, size: 76 },
  },
  {
    name: "Pranavkumar",
    role: "Content Manager",
    image: "/images/Pranav-team-member.webp",
    position: { x: 78, y: 84, size: 76 },
  },
];

export function TeamCollageBanner() {
  return (
    <div className="w-full bg-gradient-to-br from-brand-purple via-brand-coral to-pink-500 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Meet Our Global Team
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            A dedicated delivery team working as an extension of your agency
          </p>
        </div>

        {/* Collage */}
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="relative w-full h-[320px] sm:h-[340px] md:h-[360px] bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
            {teamMembers.map((member, index) => {
              const showBelow = member.position.y < 45;

              return (
                <div
                  key={member.name}
                  className="absolute group cursor-pointer animate-float-soft hover:z-20 transition-transform duration-300"
                  style={{
                    left: `${member.position.x}%`,
                    top: `${member.position.y}%`,
                    width: `${member.position.size}px`,
                    height: `${member.position.size}px`,
                    animationDelay: `${index * 0.4}s`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="relative hover:scale-110 transition-transform duration-300 ease-out">
                    {/* IMAGE */}
                    <OptimizedImage
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      width={member.position.size}
                      height={member.position.size}
                      loading="lazy"
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                    />

                    {/* GLOW RING */}
                    <div className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-white/40 to-white/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />

                    {/* TOOLTIP */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap ${showBelow ? "top-full mt-2" : "bottom-full mb-2"
                        }`}
                    >
                      <div className="font-semibold">{member.name}</div>
                      <div className="text-[10px] text-gray-300">
                        {member.role}
                      </div>

                      {/* ARROW */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${showBelow
                            ? "bottom-full border-b-4 border-b-black/80"
                            : "top-full border-t-4 border-t-black/80"
                          }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
          {[
            ["20+", "Team Members"],
            ["5+", "Countries"],
            ["24hr", "Response Time"],
            ["99%", "Client Satisfaction"],
          ].map(([value, label]) => (
            <Card
              key={label}
              className="bg-white/10 backdrop-blur-sm border-white/20 py-4 text-center rounded-xl"
            >
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-white/75 text-sm">{label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
