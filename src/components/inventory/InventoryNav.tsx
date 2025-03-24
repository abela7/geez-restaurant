
import React from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useLocation, Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, BarChart2, Truck, ShoppingCart, FileText } from "lucide-react";
import { SampleIngredientsButton } from "./SampleIngredientsButton";

export const InventoryNav = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const currentPath = location.pathname;

  const getTabValue = () => {
    if (currentPath.includes("/admin/inventory/stock")) return "stock";
    if (currentPath.includes("/admin/inventory/ingredients")) return "ingredients";
    if (currentPath.includes("/admin/inventory/recipes")) return "recipes";
    return "stock";
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <Tabs value={getTabValue()} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="stock" asChild>
              <Link to="/admin/inventory/stock" className="flex items-center gap-1.5">
                <Package className="h-4 w-4" />
                <span><T text="Stock Levels" /></span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="ingredients" asChild>
              <Link to="/admin/inventory/ingredients" className="flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4" />
                <span><T text="Ingredients" /></span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="recipes" asChild>
              <Link to="/admin/inventory/recipes" className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span><T text="Recipes" /></span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="suppliers" disabled className="flex items-center gap-1.5">
              <Truck className="h-4 w-4" />
              <span><T text="Suppliers" /></span>
              <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                <T text="Soon" />
              </span>
            </TabsTrigger>
            <TabsTrigger value="purchase-orders" disabled className="flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4" />
              <span><T text="Purchase Orders" /></span>
              <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                <T text="Soon" />
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {getTabValue() === "stock" && <SampleIngredientsButton />}
      </div>
    </div>
  );
};
