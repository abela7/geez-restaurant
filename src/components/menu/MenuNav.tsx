
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
    { path: "/admin/menu/food", label: "Food Management", icon: <Utensils className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/recipes", label: "Recipe Management", icon: <FileText className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/categories", label: "Categories", icon: <LayoutGrid className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/modifiers", label: "Modifiers", icon: <Settings className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/pricing", label: "Pricing", icon: <DollarSign className="h-4 w-4 mr-2" /> },
    { path: "/admin/menu/design", label: "Menu Design", icon: <Palette className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="w-full overflow-auto mb-6">
      <div className="inline-flex items-center space-x-1 p-1 bg-muted/50 rounded-lg">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to={item.path}>
              {item.icon}
              <span className="hidden sm:inline"><T text={item.label} /></span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};
