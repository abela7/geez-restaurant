
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { T } from "@/contexts/LanguageContext";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title={<T text="Admin Dashboard" />}
        description={<T text="Overview of restaurant operations" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2"><T text="Today's Sales" /></h3>
          <p className="text-2xl font-bold">£0.00</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2"><T text="Active Orders" /></h3>
          <p className="text-2xl font-bold">0</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2"><T text="Staff Present" /></h3>
          <p className="text-2xl font-bold">0</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4"><T text="Recent Orders" /></h3>
          <p className="text-muted-foreground"><T text="No recent orders" /></p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4"><T text="Inventory Alerts" /></h3>
          <p className="text-muted-foreground"><T text="No inventory alerts" /></p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
