
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/card-stat";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, ResponsiveContainer } from "recharts";
import { ArrowDownUp, Server, Users, Shield, Database, RefreshCw, HardDrive, Clock } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample performance data
const performanceData = [
  { time: '08:00', responseTime: 120, users: 5 },
  { time: '09:00', responseTime: 150, users: 15 },
  { time: '10:00', responseTime: 180, users: 25 },
  { time: '11:00', responseTime: 220, users: 32 },
  { time: '12:00', responseTime: 250, users: 45 },
  { time: '13:00', responseTime: 230, users: 50 },
  { time: '14:00', responseTime: 210, users: 42 },
  { time: '15:00', responseTime: 190, users: 35 },
  { time: '16:00', responseTime: 170, users: 30 },
  { time: '17:00', responseTime: 160, users: 25 },
];

// Sample resource usage data
const resourceData = [
  { name: 'CPU', usage: 45 },
  { name: 'Memory', usage: 72 },
  { name: 'Disk', usage: 58 },
  { name: 'Network', usage: 32 },
];

const SystemDashboard = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="System Dashboard" 
        description="Monitor performance and health of your restaurant management system"
        actions={
          <Button size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            <T text="Refresh Data" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Server Status" 
          value="Online" 
          isPositive={true}
          icon={<Server size={18} />}
        />
        <StatCard 
          title="Active Users" 
          value="42" 
          change="+8" 
          isPositive={true}
          icon={<Users size={18} />}
        />
        <StatCard 
          title="Avg Response Time" 
          value="180ms" 
          change="-12ms" 
          isPositive={true}
          icon={<Clock size={18} />}
        />
        <StatCard 
          title="Database Size" 
          value="2.4 GB" 
          change="+0.2 GB" 
          isPositive={false}
          icon={<Database size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          <h3 className="text-lg font-medium mb-4"><T text="System Performance (Today)" /></h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#DAA520" name="Response Time (ms)" />
                <Line yAxisId="right" type="monotone" dataKey="users" stroke="#4D4052" name="Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4"><T text="Resource Usage" /></h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                <Bar dataKey="usage" fill="#DAA520" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4"><T text="System Health" /></h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium"><T text="Web Server" /></h4>
                  <p className="text-sm text-muted-foreground"><T text="AWS EC2 Instance" /></p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <T text="Details" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium"><T text="Database" /></h4>
                  <p className="text-sm text-muted-foreground"><T text="Last backup: Today, 03:00 AM" /></p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <T text="Details" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium"><T text="Storage" /></h4>
                  <p className="text-sm text-muted-foreground"><T text="58% used of 100 GB" /></p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <T text="Details" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium"><T text="Security" /></h4>
                  <p className="text-sm text-muted-foreground"><T text="Last scan: Today, 02:00 AM" /></p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <T text="Details" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium"><T text="API Services" /></h4>
                  <p className="text-sm text-muted-foreground"><T text="All services operational" /></p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <T text="Details" />
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4"><T text="System Notifications" /></h3>
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-3 py-2">
              <h4 className="font-medium"><T text="Database Optimization Recommended" /></h4>
              <p className="text-sm text-muted-foreground"><T text="Performance could be improved by running optimization." /></p>
              <div className="flex justify-end mt-2">
                <Button size="sm">
                  <T text="Run Optimization" />
                </Button>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-3 py-2">
              <h4 className="font-medium"><T text="Backup Completed Successfully" /></h4>
              <p className="text-sm text-muted-foreground"><T text="Daily backup completed at 03:00 AM." /></p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-3 py-2">
              <h4 className="font-medium"><T text="System Update Available" /></h4>
              <p className="text-sm text-muted-foreground"><T text="Version 2.5.3 is available for installation." /></p>
              <div className="flex justify-end mt-2">
                <Button size="sm">
                  <T text="Install Update" />
                </Button>
              </div>
            </div>
            
            <div className="border-l-4 border-red-500 pl-3 py-2">
              <h4 className="font-medium"><T text="High CPU Usage Detected" /></h4>
              <p className="text-sm text-muted-foreground"><T text="CPU usage peaked at 85% at 12:15 PM." /></p>
              <div className="flex justify-end mt-2">
                <Button size="sm">
                  <T text="Investigate" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemDashboard;
