
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Plus, ClipboardList, Clock, AlertCircle, CheckCircle, Filter } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample orders data
const orders = [
  { id: 1, table: "Table 5", items: 4, total: "$86.50", status: "Pending", time: "5 mins ago", special: false },
  { id: 2, table: "Table 8", items: 3, total: "$52.75", status: "Preparing", time: "12 mins ago", special: true },
  { id: 3, table: "Table 2", items: 6, total: "$124.90", status: "Ready", time: "18 mins ago", special: false },
  { id: 4, table: "Table 10", items: 2, total: "$35.25", status: "Delivered", time: "25 mins ago", special: false },
  { id: 5, table: "Takeout #45", items: 1, total: "$18.50", status: "Ready", time: "8 mins ago", special: false },
  { id: 6, table: "Table 7", items: 5, total: "$96.25", status: "Preparing", time: "15 mins ago", special: true },
];

const OrderManagement = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Order Management" 
        description="Track and manage customer orders"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <T text="New Order" />
          </Button>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-9 w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            <T text="Filter" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all"><T text="All Orders" /></TabsTrigger>
          <TabsTrigger value="pending"><T text="Pending" /></TabsTrigger>
          <TabsTrigger value="preparing"><T text="Preparing" /></TabsTrigger>
          <TabsTrigger value="ready"><T text="Ready" /></TabsTrigger>
          <TabsTrigger value="delivered"><T text="Delivered" /></TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Order #" /></TableHead>
                  <TableHead><T text="Table" /></TableHead>
                  <TableHead><T text="Items" /></TableHead>
                  <TableHead><T text="Total" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Time" /></TableHead>
                  <TableHead><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.table}
                        {order.special && (
                          <AlertCircle className="h-4 w-4 text-amber-500" title="Special requests" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          order.status === "Pending" ? "secondary" : 
                          order.status === "Preparing" ? "outline" : 
                          order.status === "Ready" ? "default" : 
                          "default"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{order.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          <T text="Details" />
                        </Button>
                        {order.status === "Ready" && (
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <T text="Deliver" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* The other tabs would show filtered views */}
        <TabsContent value="pending">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of pending orders would appear here" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preparing">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of orders being prepared would appear here" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ready">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of ready orders would appear here" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="delivered">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of delivered orders would appear here" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagement;
