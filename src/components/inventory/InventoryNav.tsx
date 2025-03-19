
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { 
  Package, 
  Leaf, 
  FileText, 
  Truck, 
  ShoppingCart
} from "lucide-react";

export const InventoryNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // Define the inventory navigation items
  const navItems = [
    { path: "/admin/inventory/stock", label: "Stock Levels", icon: <Package className="h-4 w-4 mr-2" /> },
    { path: "/admin/inventory/ingredients", label: "Ingredients", icon: <Leaf className="h-4 w-4 mr-2" /> },
    { path: "/admin/inventory/recipes", label: "Recipes", icon: <FileText className="h-4 w-4 mr-2" /> },
    { path: "/admin/inventory/suppliers", label: "Suppliers", icon: <Truck className="h-4 w-4 mr-2" /> },
    { path: "/admin/inventory/purchase-orders", label: "Purchase Orders", icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
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
