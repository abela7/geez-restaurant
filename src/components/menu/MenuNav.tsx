
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link, useLocation } from "react-router-dom";
import { Beef, Calculator, LayoutGrid, Menu, Settings, Utensils } from "lucide-react";

export const MenuNav = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuNavLinks = [
    {
      href: "/admin/menu",
      label: "Overview",
      icon: <Menu className="h-4 w-4 mr-2" />
    },
    {
      href: "/admin/menu/food",
      label: "Food Items",
      icon: <Utensils className="h-4 w-4 mr-2" />
    },
    {
      href: "/admin/menu/categories",
      label: "Categories",
      icon: <LayoutGrid className="h-4 w-4 mr-2" />
    },
    {
      href: "/admin/menu/ingredients",
      label: "Ingredients",
      icon: <Beef className="h-4 w-4 mr-2" />
    },
    {
      href: "/admin/menu/recipe-costs",
      label: "Recipe Costs",
      icon: <Calculator className="h-4 w-4 mr-2" />
    },
    {
      href: "/admin/menu/units",
      label: "Units",
      icon: <Settings className="h-4 w-4 mr-2" />
    }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
      {menuNavLinks.map((link) => (
        <Button
          key={link.href}
          variant={isActive(link.href) ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link to={link.href}>
            {link.icon}
            <T text={link.label} />
          </Link>
        </Button>
      ))}
    </div>
  );
};
