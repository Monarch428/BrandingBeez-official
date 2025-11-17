import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import team member images
import VigneshStroke from "@assets/Vignesh Stroke_1753273695214.png";
import RajeStroke from "@assets/Raje Stroke_1753273695213.png";
import CharanStroke from "@assets/Charan Stroke_1753273701283.png";
import PriyaStroke from "@assets/Priya Stroke_1753273695213.png";
import Mathavan_Stroke from "../../public/images/Mathavan-team-member.png";
import Logu_Stroke from "@assets/Logu_Stroke.png";
import Sathish_Stroke from "@assets/Sathish_Stroke.png";
import Azeez_Stroke from "@assets/Azeez_Stroke.png";
import VishnuStroke from "@assets/Vishnu Stroke_1753273695214.png";
import YuvaStroke from "@assets/Yuva Stroke_1753273695215.png";
import GopalStroke from "@assets/Gopal Stroke_1753273701284.png";
import AthiraStroke from "@assets/Athira Stroke_1753273701280.png";
import Raja_Stroke from "../../public/images/Raja-team-member.png";
import NijuStroke from "@assets/Niju Stroke_1753273695212.png";
import Pradeep_Stroke from "../../public/images/Pradeep-team-member.png";
import Jithendran_Stroke from "../../public/images/Jithen-team-member.png";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  position: { x: number; y: number; scale: number; delay: number };
}

const teamMembers: TeamMember[] = [
  // Leadership tier
  { name: "Vignesh", role: "Founder", image: VigneshStroke, position: { x: 20, y: 15, scale: 1.1, delay: 0 } },
  { name: "Raje", role: "CEO", image: RajeStroke, position: { x: 75, y: 20, scale: 1.0, delay: 0.2 } },
  { name: "Charan", role: "CVO", image: CharanStroke, position: { x: 50, y: 10, scale: 0.9, delay: 0.4 } },

  // Core specialists
  { name: "Vishnu", role: "WordPress Dev", image: VishnuStroke, position: { x: 30, y: 65, scale: 0.9, delay: 1.0 } },
  { name: "Yuva", role: "SEO Expert", image: YuvaStroke, position: { x: 65, y: 70, scale: 0.8, delay: 1.2 } },
  { name: "Gopal", role: "Ads Expert", image: GopalStroke, position: { x: 40, y: 85, scale: 0.85, delay: 1.4 } },
  { name: "Mathavan", role: "AI Developer", image: Mathavan_Stroke, position: { x: 10, y: 50, scale: 0.8, delay: 0.6 } },
  { name: "Logu", role: "Full-Stack Dev", image: Logu_Stroke, position: { x: 85, y: 55, scale: 0.85, delay: 0.8 } },
  { name: "Sathesh", role: "Full-Stack Dev", image: Sathish_Stroke, position: { x: 5, y: 80, scale: 0.7, delay: 1.6 } },
  { name: "Raja", role: "AI Specialist", image: Raja_Stroke, position: { x: 60, y: 45, scale: 0.7, delay: 2.4 } },
  { name: "Pradeep", role: "Full-Stack Dev", image: Pradeep_Stroke, position: { x: 60, y: 45, scale: 0.7, delay: 2.4 } },


  // Support team
  { name: "Azeez", role: "Designer", image: Azeez_Stroke, position: { x: 90, y: 85, scale: 0.75, delay: 1.8 } },
  { name: "Jithendran", role: "Video Editor", image: Jithendran_Stroke, position: { x: 90, y: 85, scale: 0.75, delay: 1.8 } },
  { name: "Priya", role: "Automation", image: PriyaStroke, position: { x: 80, y: 35, scale: 0.7, delay: 2.0 } },
  { name: "Athira", role: "HR", image: AthiraStroke, position: { x: 15, y: 85, scale: 0.65, delay: 2.2 } },
  { name: "Niju", role: "WordPress Dev", image: NijuStroke, position: { x: 95, y: 15, scale: 0.65, delay: 2.6 } },
];

export function HomeTeamBanner() {
  return (
    <div className="relative">
      <div className="text-center mb-8">
        <Badge className="bg-white/20 text-white mb-4 text-sm">
          👥 Our Expert Team
        </Badge>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">A Team of 20+ Ready to Help</h3>
        <p className="text-white/90 text-base sm:text-lg">
          Development, design, marketing & operations experts
        </p>
      </div>
      {/* Equal Treatment Grid Layout */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 p-4 sm:p-6 md:p-8">
        {/* Uniform Grid - All Members Equal */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-6 sm:gap-5 mb-4 sm:mb-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="group text-center">
              <div className="relative mb-3">
                <div className="w-14 sm:w-14 md:w-14 lg:w-16 h-14 sm:h-12 md:h-14 lg:h-16 mx-auto relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-full h-full object-cover rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform touch-manipulation"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
              </div>
              <div className="text-white">
                <p className="font-medium text-xs truncate">{member.name}</p>
                <p className="text-[10px] sm:text-xs opacity-70 truncate hidden sm:block">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Team Summary */}
        <div className="text-center pt-4 sm:pt-6 border-t border-white/20">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-white justify-items-center">
            <div className="bg-white/10 rounded-lg p-2 sm:p-3 w-full max-w-20 sm:max-w-24">
              <div className="text-sm sm:text-lg font-bold">20+</div>
              <div className="text-[10px] sm:text-xs opacity-80">Team Members</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 sm:p-3 w-full max-w-20 sm:max-w-24">
              <div className="text-sm sm:text-lg font-bold">6</div>
              <div className="text-[10px] sm:text-xs opacity-80">Departments</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 sm:p-3 w-full max-w-20 sm:max-w-24">
              <div className="text-sm sm:text-lg font-bold">Global</div>
              <div className="text-[10px] sm:text-xs opacity-80">Reach</div>
            </div>
          </div>
        </div>
      </div>
      {/* Minimal decorative elements */}
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-white/15 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}