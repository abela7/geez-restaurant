
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuNav } from "@/components/menu/MenuNav";
import { Link } from "react-router-dom";

const MenuManagement = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Menu Management" />}
        description={<T text="Manage your restaurant menu" />}
      />
      
      <MenuNav />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2"><T text="Food Items" /></h3>
            <p className="text-muted-foreground mb-4"><T text="Manage food items on your menu" /></p>
            <Button asChild>
              <Link to="/admin/menu/food">
                <T text="Manage Food Items" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2"><T text="Categories" /></h3>
            <p className="text-muted-foreground mb-4"><T text="Organize menu with categories" /></p>
            <Button asChild>
              <Link to="/admin/menu/categories">
                <T text="Manage Categories" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2"><T text="Ingredients" /></h3>
            <p className="text-muted-foreground mb-4"><T text="Manage ingredients for recipes" /></p>
            <Button asChild>
              <Link to="/admin/menu/ingredients">
                <T text="Manage Ingredients" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MenuManagement;
