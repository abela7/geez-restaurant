
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { 
  Utensils, 
  LayoutGrid, 
  Palette,
  Settings,
  MenuSquare,
  Calculator,
  BadgePoundSterling
} from "lucide-react";

export const MenuNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // Define the menu navigation items
  const navItems = [
    { path: "/admin/menu/food", label: "Food Items", icon: <Utensils className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/dishes", label: "Dishes", icon: <MenuSquare className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/categories", label: "Categories", icon: <LayoutGrid className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/dish-cost", label: "Dish Cost", icon: <Calculator className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/modifiers", label: "Modifiers", icon: <Settings className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/pricing", label: "Pricing", icon: <BadgePoundSterling className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/design", label: "Menu Design", icon: <Palette className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="w-full overflow-x-auto mb-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="flex" style={{ minWidth: 'max-content' }}>
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`px-6 py-4 flex items-center text-base font-medium transition-all ${
              location.pathname === item.path 
                ? "bg-amber-500 text-white border-b-2 border-amber-600" 
                : "hover:bg-amber-100/50 text-gray-800 dark:text-gray-200 border-b-2 border-transparent hover:border-amber-300 dark:hover:bg-gray-700"
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
