// components/admin/AdminSidebar.tsx
import {
  BarChart3,
  MessageCircle,
  Mail,
  PenTool,
  ImageIcon,
  CalendarClock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  active: string;
  onChange: (key: string) => void;
}

const navItems = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "contacts", label: "Contacts", icon: MessageCircle },
  { key: "newsletter", label: "Newsletter", icon: Mail },
  { key: "seo-case-studies", label: "SEO Case Studies", icon: FileText },
  { key: "ppc-case-studies", label: "PPC Case Studies", icon: FileText },
  { key: "web-case-studies", label: "Web Case Studies", icon: FileText },
  { key: "dr-case-studies", label: "Dedicated Resources", icon: FileText },
  { key: "blog-posts", label: "Blog Posts", icon: PenTool },
  { key: "portfolio-items", label: "Portfolio", icon: ImageIcon },
  { key: "appointments", label: "Appointments", icon: CalendarClock },
];

export function AdminSidebar({ active, onChange }: SidebarProps) {
  return (
    <nav className="p-4 space-y-1">
      <h2 className="text-xs font-semibold text-gray-500 mb-3 uppercase">
        Admin Panel
      </h2>

      {navItems.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
            active === key
              ? "bg-brand-purple text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </nav>
  );
}
