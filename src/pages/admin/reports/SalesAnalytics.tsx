
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, DollarSign } from 'lucide-react';

const SalesAnalytics: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Sales Analytics" />}
        description={<T text="Detailed analysis of restaurant sales performance" />}
        icon={<BarChart className="h-6 w-6" />}
      />
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle><T text="Sales Overview" /></CardTitle>
            <CardDescription><T text="Visual representation of sales data" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
              <div className="text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p><T text="Sales charts and graphs would be displayed here" /></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SalesAnalytics;
