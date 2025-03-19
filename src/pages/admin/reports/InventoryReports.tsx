
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

const InventoryReports: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Inventory Reports" />}
        description={<T text="Analysis of inventory levels, usage, and costs" />}
        icon={<Package className="h-6 w-6" />}
      />
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle><T text="Inventory Overview" /></CardTitle>
            <CardDescription><T text="Comprehensive view of inventory status" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
              <div className="text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p><T text="Inventory charts and analysis would be displayed here" /></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default InventoryReports;
