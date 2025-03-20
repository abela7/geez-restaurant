
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { NavSectionType } from "@/utils/navigationHelpers";
import { useLocation } from "react-router-dom";

interface NavItemProps {
  section: NavSectionType;
}

export const NavItem: React.FC<NavItemProps> = ({ section }) => {
  const location = useLocation();
  
  return (
    <div className="py-1">
      <Link
        to={section.href}
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
          section.active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        <span className="mr-3 h-4 w-4">{section.icon}</span>
        <span>{section.title}</span>
        {section.routes && (
          <ChevronDown className="ml-auto h-4 w-4" />
        )}
      </Link>
      
      {section.routes && section.active && (
        <div className="mt-1 ml-6 space-y-1">
          {section.routes.map((route, routeIndex) => (
            <Link
              key={routeIndex}
              to={route.href}
              className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                location.pathname === route.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              }`}
            >
              {route.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
