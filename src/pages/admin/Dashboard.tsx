
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Admin Dashboard" />}
        description={<T text="Overview of restaurant operations" />}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2"><T text="Orders" /></h3>
            <p className="text-muted-foreground"><T text="Manage customer orders" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2"><T text="Menu" /></h3>
            <p className="text-muted-foreground"><T text="Manage food items and categories" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2"><T text="Staff" /></h3>
            <p className="text-muted-foreground"><T text="Manage staff members and roles" /></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
