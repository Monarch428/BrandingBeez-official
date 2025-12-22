// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   BarChart3,
//   Target,
//   Star,
//   FileText,
//   DollarSign,
//   Briefcase,
//   MessageCircle,
//   PenTool,
//   KeyRound,
// } from "lucide-react";

// interface StatItem {
//   title: string;
//   value: number | string;
//   icon: any;
//   color: string;
//   bgColor: string;
// }

// interface AdminOverviewProps {
//   stats: StatItem[];
//   googleStatus: "Connected" | "Not connected";
//   featuredClients: any[];
//   onNavigate: (tab: string) => void;
//   onConnectGoogle: () => void;
// }

// export function AdminOverview({
//   stats,
//   googleStatus,
//   featuredClients,
//   onNavigate,
//   onConnectGoogle,
// }: AdminOverviewProps) {
//   return (
//     <div className="space-y-6">
//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//         {stats.map((stat, index) => (
//           <Card key={index} className="hover:shadow-md transition-shadow">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
//                 >
//                   <stat.icon className={`w-6 h-6 ${stat.color}`} />
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-brand-purple">
//                     {stat.value}
//                   </div>
//                   <div className="text-sm text-gray-600">{stat.title}</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}

//         {/* Google Calendar Status */}
//         <Card className="hover:shadow-md transition-shadow">
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center">
//                 <KeyRound className="w-6 h-6 text-teal-600" />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-brand-purple">
//                   {googleStatus}
//                 </div>
//                 <div className="text-sm text-gray-600">Google Calendar</div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* ================= CONTENT + ACTIONS ================= */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Content Distribution */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <BarChart3 className="w-5 h-5" />
//               Content Distribution
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-between">
//               <span className="text-gray-600">SEO Services</span>
//               <Badge>
//                 {featuredClients.filter((c) => c.servicePage === "seo").length}
//               </Badge>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-600">Web Development</span>
//               <Badge>
//                 {
//                   featuredClients.filter(
//                     (c) => c.servicePage === "web-development"
//                   ).length
//                 }
//               </Badge>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-600">Google Ads</span>
//               <Badge>
//                 {
//                   featuredClients.filter(
//                     (c) => c.servicePage === "google-ads"
//                   ).length
//                 }
//               </Badge>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-600">Business Automation</span>
//               <Badge>
//                 {
//                   featuredClients.filter(
//                     (c) => c.servicePage === "ai-development"
//                   ).length
//                 }
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Quick Actions */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Target className="w-5 h-5" />
//               Quick Actions
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-3">
//             <Button
//               className="w-full justify-start"
//               variant="outline"
//               onClick={() => onNavigate("seo-case-studies")}
//             >
//               <BarChart3 className="w-4 h-4 mr-2" />
//               Create SEO Case Study
//             </Button>

//             <Button
//               className="w-full justify-start"
//               variant="outline"
//               onClick={() => onNavigate("ppc-case-studies")}
//             >
//               <BarChart3 className="w-4 h-4 mr-2" />
//               Create PPC Case Study
//             </Button>

//             <Button
//               className="w-full justify-start"
//               variant="outline"
//               onClick={() => onNavigate("web-case-studies")}
//             >
//               <BarChart3 className="w-4 h-4 mr-2" />
//               Create Web Case Study
//             </Button>

//             <Button
//               className="w-full justify-start"
//               variant="outline"
//               onClick={() => onNavigate("dr-case-studies")}
//             >
//               <BarChart3 className="w-4 h-4 mr-2" />
//               Create Dedicated Resource Case Study
//             </Button>

//             <Button
//               className="w-full justify-start"
//               variant="outline"
//               onClick={() => onNavigate("contacts")}
//             >
//               <MessageCircle className="w-4 h-4 mr-2" />
//               View Contacts
//             </Button>

//             <Button
//               className="w-full justify-start"
//               variant="outline"
//               onClick={() => onNavigate("blog-posts")}
//             >
//               <PenTool className="w-4 h-4 mr-2" />
//               Manage Blog Posts
//             </Button>

//             <Button
//               className="w-full justify-start"
//               variant="outline"
//               onClick={onConnectGoogle}
//             >
//               <KeyRound className="w-4 h-4 mr-2" />
//               {googleStatus === "Connected"
//                 ? "Reconnect Google Calendar"
//                 : "Connect Google Calendar"}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, MessageCircle, PenTool, KeyRound } from "lucide-react";

interface StatItem {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  bgColor: string;
}

interface AdminOverviewProps {
  stats: StatItem[];
  googleStatus: "Connected" | "Not connected";
  featuredClients: any[];
  onNavigate: (tab: string) => void;
  onConnectGoogle: () => void;
}

export function AdminOverview({
  stats,
  googleStatus,
  featuredClients,
  onNavigate,
  onConnectGoogle,
}: AdminOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-purple">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Google calendar status card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-purple">{googleStatus}</div>
                <div className="text-sm text-gray-600">Google Calendar</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content distribution + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Content Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">SEO Services</span>
                <Badge>
                  {featuredClients?.filter((c: any) => c.servicePage === "seo")?.length || 0}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Web Development</span>
                <Badge>
                  {featuredClients?.filter((c: any) => c.servicePage === "web-development")?.length || 0}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Google Ads</span>
                <Badge>
                  {featuredClients?.filter((c: any) => c.servicePage === "google-ads")?.length || 0}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Business Automation</span>
                <Badge>
                  {featuredClients?.filter((c: any) => c.servicePage === "ai-development")?.length || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onNavigate("seo-case-studies")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Create SEO Case Study
              </Button>

              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onNavigate("ppc-case-studies")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Create PPC Case Study
              </Button>

              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onNavigate("web-case-studies")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Create Web Case Study
              </Button>

              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onNavigate("dr-case-studies")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Create Dedicated Resource Case Study
              </Button>

              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onNavigate("contacts")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                View Contacts
              </Button>

              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onNavigate("blog-posts")}
              >
                <PenTool className="w-4 h-4 mr-2" />
                Manage Blog Posts
              </Button>

              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={onConnectGoogle}
              >
                <KeyRound className="w-4 h-4 mr-2" />
                {googleStatus === "Connected" ? "Reconnect Google Calendar" : "Connect Google Calendar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
