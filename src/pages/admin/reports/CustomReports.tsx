
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const CustomReports: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Custom Reports" />}
        description={<T text="Create and view customized reports" />}
        icon={<FileText className="h-6 w-6" />}
      />
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle><T text="Report Builder" /></CardTitle>
            <CardDescription><T text="Create custom reports based on your specific needs" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p><T text="Custom report builder interface would be displayed here" /></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomReports;
