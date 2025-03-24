
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuNav } from "@/components/menu/MenuNav";

const RecipeManagement = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Recipe Management" />}
        description={<T text="Manage food recipes" />}
      />
      
      <MenuNav />
      
      <Card className="mt-6">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            <T text="Recipe management coming soon" />
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeManagement;
