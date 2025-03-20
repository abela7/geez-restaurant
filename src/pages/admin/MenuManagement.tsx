
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilePen, Utensils, LayoutGrid, Settings, DollarSign, Palette, MenuSquare } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { MenuNav } from "@/components/menu/MenuNav";

const MenuManagement = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Menu Management" />}
          description={<T text="Manage your restaurant's menu items, recipes, and pricing" />}
        />
        
        <MenuNav />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-amber-300">
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <Utensils className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-medium text-lg mb-2"><T text="Food Management" /></h3>
            <p className="text-sm text-muted-foreground mb-4">
              <T text="Create and manage food items in your menu" />
            </p>
            <Button className="mt-auto bg-amber-500 hover:bg-amber-600" asChild>
              <Link to="/admin/menu/food">
                <T text="Manage Food Items" />
              </Link>
            </Button>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-amber-300">
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <MenuSquare className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-medium text-lg mb-2"><T text="Dishes" /></h3>
            <p className="text-sm text-muted-foreground mb-4">
              <T text="View dishes as they appear to customers and waiters" />
            </p>
            <Button className="mt-auto bg-amber-500 hover:bg-amber-600" asChild>
              <Link to="/admin/menu/dishes">
                <T text="View Dishes" />
              </Link>
            </Button>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-amber-300">
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <FilePen className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-medium text-lg mb-2"><T text="Recipe Management" /></h3>
            <p className="text-sm text-muted-foreground mb-4">
              <T text="Define ingredients and quantities for each dish" />
            </p>
            <Button className="mt-auto bg-amber-500 hover:bg-amber-600" asChild>
              <Link to="/admin/menu/recipes">
                <T text="Manage Recipes" />
              </Link>
            </Button>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-amber-300">
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <LayoutGrid className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-medium text-lg mb-2"><T text="Categories" /></h3>
            <p className="text-sm text-muted-foreground mb-4">
              <T text="Organize your menu with categories" />
            </p>
            <Button className="mt-auto bg-amber-500 hover:bg-amber-600" asChild>
              <Link to="/admin/menu/categories">
                <T text="Manage Categories" />
              </Link>
            </Button>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-amber-300">
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-medium text-lg mb-2"><T text="Modifiers & Options" /></h3>
            <p className="text-sm text-muted-foreground mb-4">
              <T text="Create customization options for menu items" />
            </p>
            <Button className="mt-auto bg-amber-500 hover:bg-amber-600" asChild>
              <Link to="/admin/menu/modifiers">
                <T text="Manage Modifiers" />
              </Link>
            </Button>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-amber-300">
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-medium text-lg mb-2"><T text="Pricing" /></h3>
            <p className="text-sm text-muted-foreground mb-4">
              <T text="Set prices and manage special pricing strategies" />
            </p>
            <Button className="mt-auto bg-amber-500 hover:bg-amber-600" asChild>
              <Link to="/admin/menu/pricing">
                <T text="Manage Pricing" />
              </Link>
            </Button>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-amber-300">
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <Palette className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-medium text-lg mb-2"><T text="Menu Design" /></h3>
            <p className="text-sm text-muted-foreground mb-4">
              <T text="Design the layout and appearance of your menus" />
            </p>
            <Button className="mt-auto bg-amber-500 hover:bg-amber-600" asChild>
              <Link to="/admin/menu/design">
                <T text="Manage Design" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MenuManagement;
