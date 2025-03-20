
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { 
  Utensils, 
  FileText, 
  LayoutGrid, 
  DollarSign, 
  Palette,
  Settings
} from "lucide-react";

export const MenuNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // Define the menu navigation items
  const navItems = [
    { path: "/admin/menu/food", label: "Food Items", icon: <Utensils className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/categories", label: "Categories", icon: <LayoutGrid className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/recipes", label: "Recipes", icon: <FileText className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/modifiers", label: "Modifiers", icon: <Settings className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/pricing", label: "Pricing", icon: <DollarSign className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/design", label: "Menu Design", icon: <Palette className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="w-full overflow-auto mb-6">
      <div className="flex flex-col bg-white rounded-lg shadow">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`px-6 py-3 flex items-center text-base font-medium transition-colors ${
              location.pathname === item.path 
                ? "bg-amber-400 text-white" 
                : "hover:bg-amber-100/50 text-gray-800"
            }`}
          >
            {item.icon}
            <span><T text={item.label} /></span>
          </Link>
        ))}
      </div>
    </div>
  );
};
