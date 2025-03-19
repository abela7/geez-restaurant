
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, BookOpen, FileText, Coffee, BarChart2, ChefHat, Download, Star } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

const Documentation = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Documentation" 
        description="Access system guides, tutorials and troubleshooting information"
      />

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documentation..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-medium mb-4"><T text="Documentation Categories" /></h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                <T text="Getting Started" />
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Coffee className="mr-2 h-4 w-4" />
                <T text="Admin Portal" />
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                <T text="Waiter Interface" />
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ChefHat className="mr-2 h-4 w-4" />
                <T text="Kitchen Interface" />
              </Button>
              <Button variant="ghost" className="w-full justify-start bg-muted">
                <BarChart2 className="mr-2 h-4 w-4" />
                <T text="System Administration" />
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                <T text="Best Practices" />
              </Button>
            </div>
            
            <h3 className="font-medium mt-6 mb-4"><T text="Popular Guides" /></h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center rounded-md p-2 hover:bg-muted cursor-pointer">
                <span className="text-muted-foreground mr-2">1.</span>
                <T text="Setting up your first menu" />
              </div>
              <div className="flex items-center rounded-md p-2 hover:bg-muted cursor-pointer">
                <span className="text-muted-foreground mr-2">2.</span>
                <T text="Managing table reservations" />
              </div>
              <div className="flex items-center rounded-md p-2 hover:bg-muted cursor-pointer">
                <span className="text-muted-foreground mr-2">3.</span>
                <T text="Taking and managing orders" />
              </div>
              <div className="flex items-center rounded-md p-2 hover:bg-muted cursor-pointer">
                <span className="text-muted-foreground mr-2">4.</span>
                <T text="Staff training guide" />
              </div>
              <div className="flex items-center rounded-md p-2 hover:bg-muted cursor-pointer">
                <span className="text-muted-foreground mr-2">5.</span>
                <T text="Troubleshooting common issues" />
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">
                  <T text="System Administration Guide" />
                </h2>
                <p className="text-sm text-muted-foreground">
                  <T text="Last updated: July 10, 2023" />
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                <T text="Download PDF" />
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2"><T text="Table of Contents" /></h3>
                <ol className="list-decimal pl-5 space-y-1">
                  <li><a href="#" className="text-primary hover:underline">Introduction to System Administration</a></li>
                  <li><a href="#" className="text-primary hover:underline">Dashboard Overview</a></li>
                  <li><a href="#" className="text-primary hover:underline">Monitoring System Health</a></li>
                  <li><a href="#" className="text-primary hover:underline">Managing User Accounts</a></li>
                  <li><a href="#" className="text-primary hover:underline">Error Logs & Troubleshooting</a></li>
                  <li><a href="#" className="text-primary hover:underline">Backup & Recovery</a></li>
                  <li><a href="#" className="text-primary hover:underline">System Updates</a></li>
                  <li><a href="#" className="text-primary hover:underline">Security Best Practices</a></li>
                </ol>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-350px)] pr-4">
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-medium mb-3"><T text="1. Introduction to System Administration" /></h3>
                  <p className="mb-4">
                    <T text="This guide provides a comprehensive overview of managing and maintaining your restaurant management system. System administrators are responsible for ensuring the system runs smoothly, securely, and efficiently." />
                  </p>
                  <p>
                    <T text="As a system administrator, you'll be handling user account management, monitoring system performance, reviewing error logs, managing backups, and applying system updates. This guide will walk you through each of these responsibilities in detail." />
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-medium mb-3"><T text="2. Dashboard Overview" /></h3>
                  <p className="mb-4">
                    <T text="The System Dashboard provides a real-time overview of your system's health and performance. Here you can monitor key metrics such as server status, active users, response times, and resource utilization." />
                  </p>
                  <div className="border rounded-md p-4 mb-4">
                    <h4 className="font-medium mb-2"><T text="Key Dashboard Components" /></h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><T text="Server Status Indicator: Shows whether your server is online and functioning normally." /></li>
                      <li><T text="Active Users Count: Displays the number of users currently logged into the system." /></li>
                      <li><T text="Response Time Graph: Shows average system response times over the day." /></li>
                      <li><T text="Resource Usage Charts: Displays CPU, memory, disk, and network utilization." /></li>
                      <li><T text="System Notifications: Alerts about important system events or issues." /></li>
                    </ul>
                  </div>
                  <p>
                    <T text="The dashboard is designed to give you a quick overview of system health. For more detailed information, you can navigate to specific sections like Error Logs or User Management." />
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-medium mb-3"><T text="3. Monitoring System Health" /></h3>
                  <p className="mb-4">
                    <T text="Regular monitoring of system health is essential to prevent issues before they impact restaurant operations. The System Health section provides detailed information about various system components." />
                  </p>
                  <div className="border rounded-md p-4 mb-4">
                    <h4 className="font-medium mb-2"><T text="Regular Monitoring Tasks" /></h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><T text="Check server response times during peak hours" /></li>
                      <li><T text="Monitor database performance and optimize if necessary" /></li>
                      <li><T text="Review storage usage and ensure sufficient free space" /></li>
                      <li><T text="Check backup completion status daily" /></li>
                      <li><T text="Monitor for unusual login attempts or security alerts" /></li>
                    </ul>
                  </div>
                  <p>
                    <T text="We recommend setting up a daily monitoring routine to ensure all system components are functioning optimally. This is particularly important before busy shifts to avoid any disruptions during service hours." />
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-medium mb-3"><T text="4. Managing User Accounts" /></h3>
                  <p>
                    <T text="User account management is a critical responsibility that includes creating new accounts, assigning appropriate roles, resetting passwords, and monitoring user activity for security purposes." />
                  </p>
                  {/* Additional content would continue here */}
                </section>

                {/* Additional sections would continue here */}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
