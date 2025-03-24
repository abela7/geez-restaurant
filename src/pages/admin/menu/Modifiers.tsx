
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { Card, CardContent } from "@/components/ui/card";

const Modifiers = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Modifiers Management" />}
        description={<T text="Manage food item modifiers and options" />}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/menu">
              <ChevronLeft className="mr-2 h-4 w-4" />
              <T text="Back to Menu" />
            </Link>
          </Button>
        }
      />

      <MenuNav />

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h3 className="mb-2 text-lg font-medium"><T text="Modifiers Management" /></h3>
            <p className="mb-4 text-muted-foreground">
              <T text="This feature is coming soon. You'll be able to create and manage modifiers for your menu items." />
            </p>
            <Button disabled>
              <T text="Add Modifier" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Modifiers;
