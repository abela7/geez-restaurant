
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BarChart, Users, Package, User, FileText } from 'lucide-react';
import { useLanguage, T } from '@/contexts/LanguageContext';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, icon, href }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(href)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium"><T text={title} /></CardTitle>
        <div className="h-8 w-8 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground"><T text={description} /></p>
      </CardContent>
    </Card>
  );
};

const Reports: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const reportCards = [
    {
      title: "Sales Analytics",
      description: "View detailed sales data and performance metrics",
      icon: <BarChart className="h-6 w-6" />,
      href: "/admin/reports/sales"
    },
    {
      title: "Staff Reports",
      description: "Staff performance and productivity analytics",
      icon: <Users className="h-6 w-6" />,
      href: "/admin/reports/staff"
    },
    {
      title: "Inventory Reports",
      description: "Stock levels, usage, and cost analysis",
      icon: <Package className="h-6 w-6" />,
      href: "/admin/reports/inventory"
    },
    {
      title: "Customer Insights",
      description: "Customer behavior and satisfaction metrics",
      icon: <User className="h-6 w-6" />,
      href: "/admin/reports/customers"
    },
    {
      title: "Custom Reports",
      description: "Build your own custom reports",
      icon: <FileText className="h-6 w-6" />,
      href: "/admin/reports/custom"
    }
  ];

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Reports" />}
        description={<T text="View and analyze restaurant data" />}
        actions={
          <Button onClick={() => navigate("/admin/reports/custom")}>
            <Plus className="h-4 w-4 mr-2" />
            <T text="New Report" />
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((card, index) => (
          <ReportCard 
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            href={card.href}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Reports;
