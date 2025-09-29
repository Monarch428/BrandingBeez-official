import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import team member images
import VigneshStroke from "@assets/Vignesh Stroke_1753273695214.png";
import RajeStroke from "@assets/Raje Stroke_1753273695213.png";
import CharanStroke from "@assets/Charan Stroke_1753273701283.png";
import PriyaStroke from "@assets/Priya Stroke_1753273695213.png";
import Mathavan_Stroke from "@assets/Mathavan_Stroke.png";
import LoguStroke from "@assets/Logu Stroke_1753273695209.png";
import MohanStroke from "@assets/Mohan Stroke_1753273695211.png";
import AzeezStroke from "@assets/Azeez Stroke_1753273701283.png";
import VishnuStroke from "@assets/Vishnu Stroke_1753273695214.png";
import YuvaStroke from "@assets/Yuva Stroke_1753273695215.png";
import GopalStroke from "@assets/Gopal Stroke_1753273701284.png";
import AthiraStroke from "@assets/Athira Stroke_1753273701280.png";
import PrabhaStroke from "@assets/Prabha Stroke_1753273695212.png";
import NijuStroke from "@assets/Niju Stroke_1753273695212.png";

interface TeamMember {
  name: string;
  role: string;
  department: string;
  image: string;
  color: string;
}

const teamMembers: TeamMember[] = [
  // Leadership
  { name: "Vignesh", role: "Founder", department: "Leadership", image: VigneshStroke, color: "from-yellow-400 to-orange-500" },
  { name: "Raje", role: "CEO", department: "Leadership", image: RajeStroke, color: "from-orange-400 to-red-500" },
  { name: "Charan", role: "Chief Visionary Officer", department: "Leadership", image: CharanStroke, color: "from-red-400 to-pink-500" },
  
  // Development
  { name: "Mathavan", role: "AI Developer", department: "Development", image: Mathavan_Stroke, color: "from-blue-400 to-blue-600" },
  { name: "Logu", role: "Full-Stack Developer", department: "Development", image: LoguStroke, color: "from-blue-500 to-indigo-600" },
  { name: "Vishnu", role: "WordPress Developer", department: "Development", image: VishnuStroke, color: "from-indigo-400 to-purple-600" },
  { name: "Prabha", role: "Web Developer", department: "Development", image: PrabhaStroke, color: "from-purple-400 to-pink-600" },
  { name: "Niju", role: "WordPress Developer", department: "Development", image: NijuStroke, color: "from-cyan-400 to-blue-600" },
  
  // Marketing
  { name: "Yuva", role: "SEO Specialist", department: "Marketing", image: YuvaStroke, color: "from-green-400 to-green-600" },
  { name: "Gopal", role: "Google Ads Expert", department: "Marketing", image: GopalStroke, color: "from-emerald-400 to-green-600" },
  
  // Design
  { name: "Mohan", role: "Graphic Designer", department: "Design", image: MohanStroke, color: "from-pink-400 to-rose-600" },
  { name: "Azeez", role: "Graphic Designer", department: "Design", image: AzeezStroke, color: "from-rose-400 to-pink-600" },
  
  // Operations
  { name: "Priya", role: "Automation Specialist", department: "Operations", image: PriyaStroke, color: "from-teal-400 to-cyan-600" },
  { name: "Athira", role: "HR", department: "Operations", image: AthiraStroke, color: "from-amber-400 to-orange-600" },
];

const departments = [
  { name: "Leadership", color: "border-yellow-400 bg-yellow-50", members: teamMembers.filter(m => m.department === "Leadership") },
  { name: "Development", color: "border-blue-400 bg-blue-50", members: teamMembers.filter(m => m.department === "Development") },
  { name: "Marketing", color: "border-green-400 bg-green-50", members: teamMembers.filter(m => m.department === "Marketing") },
  { name: "Design", color: "border-pink-400 bg-pink-50", members: teamMembers.filter(m => m.department === "Design") },
  { name: "Operations", color: "border-teal-400 bg-teal-50", members: teamMembers.filter(m => m.department === "Operations") },
];

export function HomeTeamBannerAlt() {
  return (
    <div className="relative">
      <div className="text-center mb-8">
        <Badge className="bg-white/20 text-white mb-4 text-sm">
          🎯 Organized Excellence
        </Badge>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Your Specialized Teams
        </h3>
        <p className="text-white/90 text-lg">
          14 experts organized by expertise, ready to deliver
        </p>
      </div>
      
      {/* Department-based layout */}
      <div className="space-y-4">
        {departments.map((dept, deptIndex) => (
          <div key={deptIndex} className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 ${dept.color.includes('yellow') ? 'ring-2 ring-yellow-400/30' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${dept.members[0]?.color || 'from-white to-gray-300'}`}></div>
                <h4 className="text-white font-bold text-sm">{dept.name}</h4>
                <span className="text-white/60 text-xs">({dept.members.length})</span>
              </div>
              <div className="text-white/40 text-xs">
                {dept.name === "Leadership" ? "Strategic Direction" : 
                 dept.name === "Development" ? "Technical Execution" :
                 dept.name === "Marketing" ? "Growth & Visibility" :
                 dept.name === "Design" ? "Creative Solutions" : "Operations & Support"}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {dept.members.map((member, index) => (
                <div key={index} className="group flex items-center gap-2 bg-white/10 rounded-xl p-2 hite/20 ">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${member.color} rounded-full blur-sm opacity-50  transition-opacity`}></div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative w-8 h-8 object-cover rounded-full border-2 border-white shadow-md group- "
                    />
                  </div>
                  <div className="text-white">
                    <p className="font-medium text-xs">{member.name}</p>
                    <p className="text-[10px] opacity-70">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick stats */}
      <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4">
        <div className="grid grid-cols-5 gap-3 text-center text-white">
          <div>
            <div className="text-lg font-bold">3</div>
            <div className="text-xs opacity-80">Leaders</div>
          </div>
          <div>
            <div className="text-lg font-bold">5</div>
            <div className="text-xs opacity-80">Developers</div>
          </div>
          <div>
            <div className="text-lg font-bold">2</div>
            <div className="text-xs opacity-80">Marketing</div>
          </div>
          <div>
            <div className="text-lg font-bold">2</div>
            <div className="text-xs opacity-80">Designers</div>
          </div>
          <div>
            <div className="text-lg font-bold">2</div>
            <div className="text-xs opacity-80">Operations</div>
          </div>
        </div>
      </div>
    </div>
  );
}