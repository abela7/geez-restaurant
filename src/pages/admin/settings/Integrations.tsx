import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Link2, CheckCircle2, XCircle, ExternalLink, Plus, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge-extended';

const INTEGRATIONS_DATA = [
  {
    id: 1,
    name: "Payment Gateway",
    provider: "Stripe",
    description: "Process credit card payments securely",
    status: "connected",
    lastSync: "10 minutes ago",
    category: "finance"
  },
  {
    id: 2,
    name: "Accounting Software",
    provider: "QuickBooks",
    description: "Sync financial data with accounting system",
    status: "connected",
    lastSync: "1 hour ago",
    category: "finance"
  },
  {
    id: 3,
    name: "Online Ordering",
    provider: "UberEats",
    description: "Receive orders from third-party delivery service",
    status: "connected",
    lastSync: "25 minutes ago",
    category: "ordering"
  },
  {
    id: 4,
    name: "Reservation System",
    provider: "OpenTable",
    description: "Manage table reservations and waitlists",
    status: "disconnected",
    lastSync: "Never",
    category: "ordering"
  },
  {
    id: 5,
    name: "Email Marketing",
    provider: "Mailchimp",
    description: "Send newsletters and promotional emails",
    status: "connected",
    lastSync: "2 days ago",
    category: "marketing"
  },
  {
    id: 6,
    name: "Inventory Management",
    provider: "RestockPro",
    description: "Track inventory and automate ordering",
    status: "disconnected",
    lastSync: "Never",
    category: "inventory"
  },
];

const Integrations: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader
        heading={<T text="Integrations" />}
        description={<T text="Connect and manage third-party services" />}
        icon={<Link2 className="h-6 w-6" />}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            <T text="Add Integration" />
          </Button>
        }
      />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Connected Services" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Active integrations" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Available Integrations" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15+</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Compatible services" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="API Health" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="size-3 rounded-full bg-green-500 mr-2"></div>
              <div className="text-xl font-medium"><T text="All Systems Operational" /></div>
            </div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Last checked: 5 minutes ago" /></p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {INTEGRATIONS_DATA.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <CardTitle>{integration.name}</CardTitle>
                    <Badge 
                      variant={integration.status === "connected" ? "success" : "outline"}
                      className="ml-2"
                    >
                      {integration.status === "connected" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      <T text={integration.status} />
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">{integration.provider}</CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch id={`enabled-${integration.id}`} defaultChecked={integration.status === "connected"} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{integration.description}</p>
              
              {integration.status === "connected" && (
                <div className="text-xs text-muted-foreground mt-2">
                  <T text="Last sync:" /> {integration.lastSync}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Badge variant="secondary">
                <T text={
                  integration.category === "finance" ? "Finance" : 
                  integration.category === "ordering" ? "Ordering" : 
                  integration.category === "marketing" ? "Marketing" : 
                  "Inventory"
                } />
              </Badge>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  <T text="Configure" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <T text="View" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Integrations;
