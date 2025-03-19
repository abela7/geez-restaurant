
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Download, AlertTriangle, Info, Shield, Search, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge-extended';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Sample log data
const LOG_DATA = [
  {
    id: 1,
    timestamp: "2023-06-10 14:32:15",
    level: "error",
    source: "payment-system",
    message: "Failed to process payment for order #12345",
    user: "waiter1"
  },
  {
    id: 2,
    timestamp: "2023-06-10 14:30:22",
    level: "warning",
    source: "inventory",
    message: "Low stock alert: Berbere spice (5 units remaining)",
    user: "system"
  },
  {
    id: 3,
    timestamp: "2023-06-10 14:25:18",
    level: "info",
    source: "user-auth",
    message: "User 'manager1' logged in successfully",
    user: "manager1"
  },
  {
    id: 4,
    timestamp: "2023-06-10 14:20:05",
    level: "error",
    source: "printer",
    message: "Kitchen printer connection failed",
    user: "system"
  },
  {
    id: 5,
    timestamp: "2023-06-10 14:15:30",
    level: "info",
    source: "orders",
    message: "New order #12345 created",
    user: "waiter2"
  },
  {
    id: 6,
    timestamp: "2023-06-10 14:10:12",
    level: "warning",
    source: "kitchen",
    message: "Order #12340 preparation time exceeded",
    user: "kitchen1"
  },
  {
    id: 7,
    timestamp: "2023-06-10 14:05:55",
    level: "info",
    source: "system",
    message: "Database backup completed successfully",
    user: "system"
  },
];

const SYSTEM_STATUS = [
  { name: "Database", status: "operational" },
  { name: "Web Server", status: "operational" },
  { name: "Payment Gateway", status: "operational" },
  { name: "Receipt Printer", status: "operational" },
  { name: "Kitchen Printer", status: "degraded" }
];

const SystemLogs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="System Logs" />}
        description={<T text="View system logs and monitor application health" />}
        icon={<Terminal className="h-6 w-6" />}
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            <T text="Export Logs" />
          </Button>
        }
      />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-5 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle><T text="System Status" /></CardTitle>
            <CardDescription><T text="Current health of system components" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {SYSTEM_STATUS.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div className="font-medium">{item.name}</div>
                  <Badge
                    variant={
                      item.status === "operational" ? "success" :
                      item.status === "degraded" ? "warning" :
                      "destructive"
                    }
                  >
                    {item.status === "operational" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : item.status === "degraded" ? (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    <T text={item.status} />
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle><T text="Log Summary" /></CardTitle>
            <CardDescription><T text="Overview of recent system activities" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <div className="p-2 bg-red-100 rounded-full mb-2">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground text-center"><T text="Errors" /></div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-full mb-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground text-center"><T text="Warnings" /></div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full mb-2">
                  <Info className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground text-center"><T text="Info" /></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle><T text="System Logs" /></CardTitle>
          <CardDescription><T text="Detailed log entries from all system components" /></CardDescription>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("Search logs...")} className="pl-10" />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder={t("Log Level")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><T text="All Levels" /></SelectItem>
                <SelectItem value="error"><T text="Error" /></SelectItem>
                <SelectItem value="warning"><T text="Warning" /></SelectItem>
                <SelectItem value="info"><T text="Info" /></SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              <T text="Refresh" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="Time" /></TableHead>
                <TableHead><T text="Level" /></TableHead>
                <TableHead className="hidden md:table-cell"><T text="Source" /></TableHead>
                <TableHead><T text="Message" /></TableHead>
                <TableHead className="hidden md:table-cell"><T text="User" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LOG_DATA.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        log.level === "error" ? "destructive" :
                        log.level === "warning" ? "warning" :
                        "secondary"
                      }
                    >
                      {log.level === "error" ? (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      ) : log.level === "warning" ? (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      ) : (
                        <Info className="h-3 w-3 mr-1" />
                      )}
                      <T text={log.level} />
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="px-2 py-1 bg-muted rounded text-xs">
                      {log.source}
                    </span>
                  </TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-1 text-muted-foreground" />
                      {log.user}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SystemLogs;
