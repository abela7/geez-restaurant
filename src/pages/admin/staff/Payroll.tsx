
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Download, Plus, Filter, DollarSign, Clock, CreditCard } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Payroll = () => {
  const { t } = useLanguage();
  const [payPeriod, setPayPeriod] = useState("current");

  return (
    <>
      <PageHeader 
        heading={<T text="Staff Payroll" />}
        description={<T text="Manage staff payroll and compensation" />}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              <T text="Filter" />
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              <T text="Export Report" />
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Run Payroll" />
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                <T text="Current Pay Period" />
              </p>
              <div className="text-2xl font-bold">£12,540.50</div>
            </div>
            <DollarSign className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                <T text="Total Hours" />
              </p>
              <div className="text-2xl font-bold">854</div>
            </div>
            <Clock className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                <T text="Next Payment Date" />
              </p>
              <div className="text-2xl font-bold">15 April</div>
            </div>
            <CreditCard className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" onValueChange={setPayPeriod} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="current">
            <T text="Current Period" />
          </TabsTrigger>
          <TabsTrigger value="previous">
            <T text="Previous Periods" />
          </TabsTrigger>
          <TabsTrigger value="staff">
            <T text="By Staff Member" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle><T text="Current Pay Period" /> (1-15 April, 2025)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Staff Member" /></TableHead>
                    <TableHead><T text="Department" /></TableHead>
                    <TableHead><T text="Hours" /></TableHead>
                    <TableHead><T text="Rate (£)" /></TableHead>
                    <TableHead><T text="Gross Pay (£)" /></TableHead>
                    <TableHead><T text="Status" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Smith</TableCell>
                    <TableCell>Kitchen</TableCell>
                    <TableCell>42</TableCell>
                    <TableCell>11.50</TableCell>
                    <TableCell>483.00</TableCell>
                    <TableCell><Badge>Pending</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sarah Johnson</TableCell>
                    <TableCell>Front of House</TableCell>
                    <TableCell>38</TableCell>
                    <TableCell>10.25</TableCell>
                    <TableCell>389.50</TableCell>
                    <TableCell><Badge>Pending</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Michael Brown</TableCell>
                    <TableCell>Management</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>15.00</TableCell>
                    <TableCell>675.00</TableCell>
                    <TableCell><Badge>Pending</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="previous">
          <Card>
            <CardHeader>
              <CardTitle><T text="Previous Pay Periods" /></CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Period" /></TableHead>
                    <TableHead><T text="Start Date" /></TableHead>
                    <TableHead><T text="End Date" /></TableHead>
                    <TableHead><T text="Total Hours" /></TableHead>
                    <TableHead><T text="Total Amount (£)" /></TableHead>
                    <TableHead><T text="Status" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">March P2</TableCell>
                    <TableCell>16 Mar 2025</TableCell>
                    <TableCell>31 Mar 2025</TableCell>
                    <TableCell>860</TableCell>
                    <TableCell>12,340.75</TableCell>
                    <TableCell><Badge variant="default" className="bg-green-500 hover:bg-green-600">Paid</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">March P1</TableCell>
                    <TableCell>1 Mar 2025</TableCell>
                    <TableCell>15 Mar 2025</TableCell>
                    <TableCell>842</TableCell>
                    <TableCell>11,980.50</TableCell>
                    <TableCell><Badge variant="default" className="bg-green-500 hover:bg-green-600">Paid</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">February P2</TableCell>
                    <TableCell>16 Feb 2025</TableCell>
                    <TableCell>28 Feb 2025</TableCell>
                    <TableCell>756</TableCell>
                    <TableCell>10,830.25</TableCell>
                    <TableCell><Badge variant="default" className="bg-green-500 hover:bg-green-600">Paid</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle><T text="Payroll by Staff Member" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-6">
                <T text="Select a staff member to view their payroll history." />
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Payroll;
