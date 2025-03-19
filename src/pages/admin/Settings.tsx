
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="System Settings" />}
        description={<T text="Configure your restaurant profile, user access, and system settings" />}
        icon={<Settings className="h-6 w-6" />}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle><T text="Restaurant Profile" /></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <T text="Manage your restaurant details and branding" />
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle><T text="User Access" /></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <T text="Configure user permissions and access levels" />
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle><T text="Printers & Devices" /></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <T text="Manage connected printers and devices" />
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle><T text="System Logs" /></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <T text="View system logs and debug information" />
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle><T text="Integrations" /></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <T text="Connect with third-party services and APIs" />
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminSettings;
