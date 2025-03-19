
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Download, Filter, AlertTriangle, AlertCircle, Info, CheckCircle, ArrowDown, ArrowUp } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample error logs data
const errorLogs = [
  { id: 1, timestamp: "Jul 12, 2023 15:45:22", level: "Error", source: "Database", message: "Connection timeout while executing query", status: "Open" },
  { id: 2, timestamp: "Jul 12, 2023 14:32:10", level: "Warning", source: "API", message: "Rate limit exceeded for endpoint /orders", status: "Open" },
  { id: 3, timestamp: "Jul 12, 2023 12:15:47", level: "Error", source: "Authentication", message: "Failed login attempt for user admin", status: "Resolved" },
  { id: 4, timestamp: "Jul 11, 2023 23:05:33", level: "Warning", source: "Storage", message: "Disk space below 20% threshold", status: "Open" },
  { id: 5, timestamp: "Jul 11, 2023 19:22:18", level: "Info", source: "System", message: "Scheduled backup completed successfully", status: "Resolved" },
  { id: 6, timestamp: "Jul 11, 2023 17:50:05", level: "Error", source: "Payment Gateway", message: "Failed to process card payment", status: "Resolved" },
  { id: 7, timestamp: "Jul 11, 2023 15:12:40", level: "Info", source: "System", message: "System update applied successfully", status: "Resolved" },
  { id: 8, timestamp: "Jul 11, 2023 12:40:19", level: "Error", source: "Web Server", message: "503 Service Unavailable during peak load", status: "Open" },
  { id: 9, timestamp: "Jul 10, 2023 22:15:07", level: "Warning", source: "Security", message: "Multiple failed login attempts detected", status: "Investigating" },
  { id: 10, timestamp: "Jul 10, 2023 20:05:44", level: "Error", source: "Database", message: "Failed to create backup due to insufficient space", status: "Resolved" },
];

// Sample error details data
const sampleErrorDetails = {
  id: 1,
  timestamp: "Jul 12, 2023 15:45:22",
  level: "Error",
  source: "Database",
  message: "Connection timeout while executing query",
  status: "Open",
  details: `
Error: Connection timeout while executing query
Source: Database Connection Pool
Component: OrderRepository.findOrdersByDate
SQL Query: SELECT * FROM orders WHERE order_date BETWEEN ? AND ?
Parameters: ['2023-07-10', '2023-07-12']

Stack Trace:
- at ConnectionPool.getConnection (database.js:145)
- at OrderRepository.findOrdersByDate (orderrepository.js:87)
- at OrderService.getRecentOrders (orderservice.js:52)
- at DashboardController.loadDashboard (dashboardcontroller.js:28)

Number of occurrences: 3 in the last 24 hours
Last resolved: Never
  `,
  steps: [
    "Check database server connectivity",
    "Verify connection pool settings",
    "Analyze query performance",
    "Check for database locks",
    "Review server resource utilization during error occurrence"
  ]
};

const ErrorLogs = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Error Logs" 
        description="Monitor and troubleshoot system errors"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              <T text="Export Logs" />
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              <T text="Filter" />
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search error logs..."
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex gap-2">
                <Badge variant="outline" className="cursor-pointer">
                  <T text="All Logs" />
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  <T text="Errors" />
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  <T text="Warnings" />
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  <T text="Info" />
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  <T text="Newest" />
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Timestamp" /></TableHead>
                  <TableHead><T text="Level" /></TableHead>
                  <TableHead><T text="Source" /></TableHead>
                  <TableHead><T text="Message" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorLogs.map((log) => (
                  <TableRow key={log.id} className="cursor-pointer">
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant={
                        log.level === "Error" ? "destructive" : 
                        log.level === "Warning" ? "outline" : 
                        "secondary"
                      }>
                        {log.level === "Error" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {log.level === "Warning" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {log.level === "Info" && <Info className="h-3 w-3 mr-1" />}
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.message}</TableCell>
                    <TableCell>
                      <Badge variant={
                        log.status === "Open" ? "destructive" : 
                        log.status === "Investigating" ? "outline" : 
                        "default"
                      }>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <h3 className="font-medium"><T text="Error Details" /></h3>
              </div>
              <Badge>ID: {sampleErrorDetails.id}</Badge>
            </div>
            
            <div className="p-4 border-b">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium"><T text="Timestamp" /></span>
                <span className="text-sm">{sampleErrorDetails.timestamp}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium"><T text="Level" /></span>
                <Badge variant="destructive">{sampleErrorDetails.level}</Badge>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium"><T text="Source" /></span>
                <span className="text-sm">{sampleErrorDetails.source}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium"><T text="Status" /></span>
                <Badge variant="destructive">{sampleErrorDetails.status}</Badge>
              </div>
            </div>
            
            <div className="p-4 border-b">
              <h4 className="text-sm font-medium mb-2"><T text="Error Message" /></h4>
              <p className="text-sm">{sampleErrorDetails.message}</p>
            </div>
            
            <div className="p-4 border-b">
              <h4 className="text-sm font-medium mb-2"><T text="Error Details" /></h4>
              <ScrollArea className="h-40">
                <pre className="text-xs whitespace-pre-wrap bg-muted p-2 rounded">
                  {sampleErrorDetails.details}
                </pre>
              </ScrollArea>
            </div>
            
            <div className="p-4">
              <h4 className="text-sm font-medium mb-2"><T text="Resolution Steps" /></h4>
              <ul className="text-sm space-y-1 list-disc pl-5">
                {sampleErrorDetails.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 border-t flex justify-between">
              <Button variant="outline" size="sm">
                <T text="Mark as Resolved" />
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
              <Button size="sm">
                <T text="Assign to Developer" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ErrorLogs;
