
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TableProperties, Building2, Settings, FileText, Globe, Bell } from 'lucide-react';

const General: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const generalSettings = [
    {
      title: "Table Management",
      description: "Manage restaurant tables, rooms, and guest tables",
      icon: <TableProperties className="h-12 w-12 text-primary mb-2" />,
      path: "/admin/general/tables",
      action: "Manage Tables",
    },
    {
      title: "Restaurant Settings",
      description: "Configure restaurant basic information and settings",
      icon: <Settings className="h-12 w-12 text-primary mb-2" />,
      path: "/admin/settings/profile",
      action: "Configure",
    },
    {
      title: "Notification Settings",
      description: "Configure alerts and notification settings",
      icon: <Bell className="h-12 w-12 text-primary mb-2" />,
      path: "/admin/general/notifications",
      action: "Configure",
      disabled: true
    },
    {
      title: "Terms and Policies",
      description: "Manage terms of service and privacy policies",
      icon: <FileText className="h-12 w-12 text-primary mb-2" />,
      path: "/admin/general/terms",
      action: "Manage Documents",
      disabled: true
    },
    {
      title: "Location Settings",
      description: "Configure restaurant locations and branches",
      icon: <Globe className="h-12 w-12 text-primary mb-2" />,
      path: "/admin/general/locations",
      action: "Manage Locations",
      disabled: true
    },
  ];
  
  return (
    <Layout interface="admin">
      <PageHeader
        title={t("General Settings")}
        description={t("Configure restaurant settings and manage tables")}
      />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {generalSettings.map((setting, index) => (
          <Card key={index} className={setting.disabled ? "opacity-70" : ""}>
            <CardHeader className="text-center">
              <div className="flex justify-center">
                {setting.icon}
              </div>
              <CardTitle>{t(setting.title)}</CardTitle>
              <CardDescription>{t(setting.description)}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Additional content can go here if needed */}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                disabled={setting.disabled} 
                onClick={() => navigate(setting.path)}
              >
                {t(setting.action)}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default General;
