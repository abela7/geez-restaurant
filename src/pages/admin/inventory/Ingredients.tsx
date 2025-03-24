
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";

const Ingredients = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Ingredients" />}
        description={<T text="Manage inventory ingredients" />}
      />
      
      <Card className="mt-6">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            <T text="Ingredient management coming soon" />
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ingredients;
