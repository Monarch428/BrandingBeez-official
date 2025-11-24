import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}>
      <Link href="/">
        <span className="flex items-center hover:text-brand-purple transition-colors cursor-pointer">
          <Home className="w-4 h-4 mr-1" />
          Home
        </span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          {item.href && index < items.length - 1 ? (
            <Link href={item.href}>
              <span className="hover:text-brand-purple transition-colors cursor-pointer">
                {item.label}
              </span>
            </Link>
          ) : (
            <span className={index === items.length - 1 ? "text-gray-900 font-medium" : ""}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}