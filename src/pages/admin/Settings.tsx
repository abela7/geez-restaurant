
import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Link as LinkIcon } from 'lucide-react';
import { SettingsNav } from '@/components/settings/SettingsNav';
import { Link } from 'react-router-dom';

const AdminSettings: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <PageHeader
        heading={<T text="System Settings" />}
        description={<T text="Configure your restaurant profile, user access, and system settings" />}
        icon={<Settings className="h-6 w-6" />}
      />
      
      <SettingsNav />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/settings/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle><T text="Restaurant Profile" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <T text="Manage your restaurant details and branding" />
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/settings/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle><T text="User Access" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <T text="Configure user permissions and access levels" />
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/settings/printers">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle><T text="Printers & Devices" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <T text="Manage connected printers and devices" />
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/settings/system-logs">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle><T text="System Logs" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <T text="View system logs and debug information" />
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/settings/integrations">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle><T text="Integrations" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <T text="Connect with third-party services and APIs" />
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/settings/themes">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle><T text="Theme Settings" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <T text="Customize application appearance and colors" />
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AdminSettings;
