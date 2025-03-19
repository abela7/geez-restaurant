
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const CustomerInsights: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Customer Insights" />}
        description={<T text="Analysis of customer behavior and preferences" />}
        icon={<Users className="h-6 w-6" />}
      />
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle><T text="Customer Analytics" /></CardTitle>
            <CardDescription><T text="Detailed customer behavior data" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p><T text="Customer analytics and visualizations would be displayed here" /></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerInsights;
