
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Building, Users, Printer, FileText, Boxes, ArrowRight } from 'lucide-react';
import { useCreateStorageBucket } from '@/hooks/useCreateStorageBucket';

const AdminSettings: React.FC = () => {
  const { t } = useLanguage();
  // Initialize the storage bucket when the component loads
  const { isCreating } = useCreateStorageBucket();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="System Settings" />}
        description={<T text="Configure your restaurant profile, user access, and system settings" />}
        icon={<Settings className="h-6 w-6" />}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/settings/profile">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle><T text="Restaurant Profile" /></CardTitle>
              <Building className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <p className="text-sm text-muted-foreground">
                <T text="Manage your restaurant details and branding" />
              </p>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/settings/users">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle><T text="User Access" /></CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <p className="text-sm text-muted-foreground">
                <T text="Configure user permissions and access levels" />
              </p>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/settings/devices">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle><T text="Printers & Devices" /></CardTitle>
              <Printer className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <p className="text-sm text-muted-foreground">
                <T text="Manage connected printers and devices" />
              </p>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/settings/logs">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle><T text="System Logs" /></CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <p className="text-sm text-muted-foreground">
                <T text="View system logs and debug information" />
              </p>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/settings/integrations">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle><T text="Integrations" /></CardTitle>
              <Boxes className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <p className="text-sm text-muted-foreground">
                <T text="Connect with third-party services and APIs" />
              </p>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </Layout>
  );
};

export default AdminSettings;
