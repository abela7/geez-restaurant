
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { 
  Building, 
  Users, 
  Printer, 
  FileText,
  Link as LinkIcon,
  Palette
} from "lucide-react";

export const SettingsNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // Define the settings navigation items
  const navItems = [
    { path: "/admin/settings/profile", label: "Restaurant Profile", icon: <Building className="h-4 w-4 mr-2" /> },
    { path: "/admin/settings/users", label: "User Access", icon: <Users className="h-4 w-4 mr-2" /> },
    { path: "/admin/settings/printers", label: "Printers & Devices", icon: <Printer className="h-4 w-4 mr-2" /> },
    { path: "/admin/settings/system-logs", label: "System Logs", icon: <FileText className="h-4 w-4 mr-2" /> },
    { path: "/admin/settings/integrations", label: "Integrations", icon: <LinkIcon className="h-4 w-4 mr-2" /> },
    { path: "/admin/settings/themes", label: "Theme Settings", icon: <Palette className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="w-full overflow-x-auto mb-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="flex" style={{ minWidth: 'max-content' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path}
              className={`px-6 py-4 flex items-center text-base font-medium transition-all ${
                isActive 
                  ? "bg-amber-500 text-white border-b-2 border-amber-600" 
                  : "hover:bg-amber-100/50 text-gray-800 dark:text-gray-200 border-b-2 border-transparent hover:border-amber-300 dark:hover:bg-gray-700"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              <span><T text={item.label} /></span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
