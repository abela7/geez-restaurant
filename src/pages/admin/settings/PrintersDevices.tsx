import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, Smartphone, Laptop, Tablet, Plus, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge-extended';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const PRINTERS_DATA = [
  {
    id: 1,
    name: "Main Receipt Printer",
    type: "receipt",
    model: "Epson TM-T88VI",
    status: "connected",
    lastPrint: "10 minutes ago",
    location: "Front Counter"
  },
  {
    id: 2,
    name: "Kitchen Order Printer",
    type: "kitchen",
    model: "Star Micronics TSP143III",
    status: "connected",
    lastPrint: "5 minutes ago",
    location: "Kitchen Area"
  },
  {
    id: 3,
    name: "Bar Order Printer",
    type: "bar",
    model: "Epson TM-m30II",
    status: "disconnected",
    lastPrint: "2 hours ago",
    location: "Bar Counter"
  },
];

const DEVICES_DATA = [
  {
    id: 1,
    name: "Front Counter Tablet",
    type: "tablet",
    model: "iPad Pro 12.9\"",
    status: "online",
    lastActive: "Just now",
    assignedTo: "Manager"
  },
  {
    id: 2,
    name: "Waiter Tablet 1",
    type: "tablet",
    model: "Samsung Galaxy Tab S7",
    status: "online",
    lastActive: "2 minutes ago",
    assignedTo: "Waiter"
  },
  {
    id: 3,
    name: "Kitchen Display",
    type: "display",
    model: "Dell 24\" Touchscreen",
    status: "online",
    lastActive: "Just now",
    assignedTo: "Kitchen Staff"
  },
  {
    id: 4,
    name: "Manager Laptop",
    type: "laptop",
    model: "MacBook Pro 14\"",
    status: "offline",
    lastActive: "Yesterday",
    assignedTo: "Manager"
  },
];

const PrintersDevices: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader
        heading={<T text="Printers & Devices" />}
        description={<T text="Manage connected hardware and peripherals" />}
        icon={<Printer className="h-6 w-6" />}
      />
      
      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle><T text="Receipt & Order Printers" /></CardTitle>
                <CardDescription><T text="Configure your printing devices" /></CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <T text="Refresh" />
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  <T text="Add Printer" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {PRINTERS_DATA.map((printer) => (
                <div key={printer.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start mb-4 md:mb-0">
                    <Printer className="h-8 w-8 mr-3 text-primary" />
                    <div>
                      <div className="font-medium">{printer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {printer.model} • {printer.location}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <T text="Last print:" /> {printer.lastPrint}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 md:items-end">
                    <Badge 
                      variant={printer.status === "connected" ? "success" : "destructive"}
                      className="self-start md:self-auto"
                    >
                      {printer.status === "connected" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      <T text={printer.status} />
                    </Badge>
                    
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm">
                        <T text="Test Print" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <T text="Configure" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle><T text="Connected Devices" /></CardTitle>
                <CardDescription><T text="Tablets, displays and other devices" /></CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                <T text="Add Device" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {DEVICES_DATA.map((device) => (
                <div key={device.id} className="flex items-start p-4 border rounded-lg">
                  <div className="mr-3">
                    {device.type === "tablet" ? (
                      <Tablet className="h-8 w-8 text-primary" />
                    ) : device.type === "laptop" ? (
                      <Laptop className="h-8 w-8 text-primary" />
                    ) : (
                      <Smartphone className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium">{device.name}</div>
                      <Badge 
                        variant={device.status === "online" ? "success" : "warning"}
                        className="ml-2"
                      >
                        <T text={device.status} />
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {device.model} • <T text="Assigned to" />: {device.assignedTo}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-muted-foreground">
                        <T text="Last active:" /> {device.lastActive}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch id={`enabled-${device.id}`} defaultChecked={device.status === "online"} />
                        <Label htmlFor={`enabled-${device.id}`} className="text-xs cursor-pointer">
                          <T text="Enabled" />
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PrintersDevices;
