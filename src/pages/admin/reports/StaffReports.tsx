
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const StaffReports: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Staff Reports" />}
        description={<T text="Performance metrics and analysis for staff members" />}
        icon={<Users className="h-6 w-6" />}
      />
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle><T text="Staff Performance" /></CardTitle>
            <CardDescription><T text="Performance metrics for all staff members" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p><T text="Staff performance charts and metrics would be displayed here" /></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StaffReports;
