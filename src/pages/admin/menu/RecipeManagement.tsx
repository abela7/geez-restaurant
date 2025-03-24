import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";

const RecipeManagement = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Recipe Management" />}
        description={<T text="Define ingredients and quantities for each dish" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <T text="Back to Menu" />
              </Link>
            </Button>
          </>
        }
      />

      <MenuNav />

      <div className="mt-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-medium mb-2"><T text="Recipe Management" /></h3>
          <p className="text-muted-foreground mb-4">
            <T text="This feature is coming soon. You'll be able to define ingredients and quantities for each dish." />
          </p>
          <Button asChild>
            <Link to="/admin/menu/food">
              <T text="Manage Food Items" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeManagement;
