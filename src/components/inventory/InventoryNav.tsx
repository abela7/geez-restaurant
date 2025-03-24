
import React from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TruckIcon, BarChart2, Warehouse, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const InventoryNav = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const currentPath = location.pathname;

  const getActiveTab = () => {
    if (currentPath.includes("/stock")) return "stock";
    if (currentPath.includes("/ingredients")) return "ingredients";
    if (currentPath.includes("/suppliers")) return "suppliers";
    if (currentPath.includes("/purchase-orders")) return "purchase-orders";
    if (currentPath.includes("/reports")) return "reports";
    return "stock";
  };

  return (
    <div className="mb-6">
      <Tabs value={getActiveTab()} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="stock" asChild>
            <Link to="/admin/inventory/stock" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline"><T text="Stock Levels" /></span>
              <span className="sm:hidden"><T text="Stock" /></span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="ingredients" asChild>
            <Link to="/admin/inventory/ingredients" className="flex items-center">
              <Warehouse className="mr-2 h-4 w-4" />
              <span><T text="Ingredients" /></span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="suppliers" asChild>
            <Link to="/admin/inventory/suppliers" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span><T text="Suppliers" /></span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="purchase-orders" asChild>
            <Link to="/admin/inventory/purchase-orders" className="flex items-center">
              <TruckIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline"><T text="Purchase Orders" /></span>
              <span className="sm:hidden"><T text="Orders" /></span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="reports" asChild>
            <Link to="/admin/inventory/reports" className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" />
              <span><T text="Reports" /></span>
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
