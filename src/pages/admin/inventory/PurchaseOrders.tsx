import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge-extended";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Filter, 
  ClipboardList, 
  Clock, 
  ShoppingCart, 
  CheckCircle, 
  TruckIcon,
  ReceiptText,
  FileDown,
  RefreshCw
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import AppLayout from "@/components/Layout";
import { InventoryNav } from "@/components/inventory/InventoryNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample purchase orders data
const purchaseOrders = [
  { 
    id: "PO-2023-001", 
    date: "2023-11-10", 
    supplier: { name: "Local Farm Supply", abbr: "LF" }, 
    items: 12, 
    total: 580.25, 
    status: "Delivered", 
    paymentStatus: "Paid",
    deliveryDate: "2023-11-15",
    assignedTo: "Abebe Kebede"
  },
  { 
    id: "PO-2023-002", 
    date: "2023-11-15", 
    supplier: { name: "Spice Imports Ltd", abbr: "SI" }, 
    items: 8, 
    total: 425.50, 
    status: "In Transit", 
    paymentStatus: "Paid",
    deliveryDate: "2023-11-25",
    assignedTo: "Abebe Kebede"
  },
  { 
    id: "PO-2023-003", 
    date: "2023-11-18", 
    supplier: { name: "Green Valley Farms", abbr: "GV" }, 
    items: 10, 
    total: 750.00, 
    status: "Ordered", 
    paymentStatus: "Pending",
    deliveryDate: "2023-11-28",
    assignedTo: "Tigist Haile"
  },
  { 
    id: "PO-2023-004", 
    date: "2023-11-20", 
    supplier: { name: "Authentic Cultures", abbr: "AC" }, 
    items: 5, 
    total: 325.75, 
    status: "Ordered", 
    paymentStatus: "Pending",
    deliveryDate: "2023-11-30",
    assignedTo: "Tigist Haile"
  },
  { 
    id: "PO-2023-005", 
    date: "2023-10-25", 
    supplier: { name: "Local Farm Supply", abbr: "LF" }, 
    items: 15, 
    total: 645.50, 
    status: "Delivered", 
    paymentStatus: "Paid",
    deliveryDate: "2023-10-30",
    assignedTo: "Abebe Kebede"
  },
  { 
    id: "PO-2023-006", 
    date: "2023-10-30", 
    supplier: { name: "Green Valley Farms", abbr: "GV" }, 
    items: 7, 
    total: 520.25, 
    status: "Delivered", 
    paymentStatus: "Paid",
    deliveryDate: "2023-11-05",
    assignedTo: "Abebe Kebede"
  }
];

const PurchaseOrders = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter purchase orders based on search, tab, and status filter
  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
      
    let matchesTab = true;
    if (activeTab === "pending") {
      matchesTab = order.status === "Ordered" || order.status === "In Transit";
    } else if (activeTab === "delivered") {
      matchesTab = order.status === "Delivered";
    } else if (activeTab === "pastDue") {
      // Simplified for this example - would compare dates in real system
      matchesTab = false;
    }
    
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesTab && matchesStatus;
  });

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return { variant: "success", icon: <CheckCircle className="h-3 w-3 mr-1" /> };
      case "In Transit":
        return { variant: "warning", icon: <TruckIcon className="h-3 w-3 mr-1" /> };
      case "Ordered":
        return { variant: "default", icon: <Clock className="h-3 w-3 mr-1" /> };
      default:
        return { variant: "outline", icon: null };
    }
  };

  // Get payment status badge variant
  const getPaymentBadge = (status: string) => {
    return status === "Paid" 
      ? { variant: "outline", className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800" }
      : { variant: "outline", className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800" };
  };

  return (
    <AppLayout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Purchase Orders" />}
          description={<T text="Track and manage orders from suppliers" />}
          actions={
            <>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <RefreshCw className="mr-2 h-4 w-4" />
                <T text="Refresh" />
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <FileDown className="mr-2 h-4 w-4" />
                <T text="Export" />
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                <T text="New Order" />
              </Button>
            </>
          }
        />

        <InventoryNav />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">
                <ClipboardList className="h-4 w-4 mr-2" />
                <T text="All Orders" />
              </TabsTrigger>
              <TabsTrigger value="pending">
                <Clock className="h-4 w-4 mr-2" />
                <T text="Pending" />
              </TabsTrigger>
              <TabsTrigger value="delivered">
                <CheckCircle className="h-4 w-4 mr-2" />
                <T text="Delivered" />
              </TabsTrigger>
              <TabsTrigger value="pastDue">
                <ReceiptText className="h-4 w-4 mr-2" />
                <T text="Past Due" />
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("Search orders...")}
                  className="w-full pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t("Status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T text="All Statuses" /></SelectItem>
                  <SelectItem value="ordered"><T text="Ordered" /></SelectItem>
                  <SelectItem value="in transit"><T text="In Transit" /></SelectItem>
                  <SelectItem value="delivered"><T text="Delivered" /></SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline"><T text="Filter" /></span>
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="m-0">
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Order ID" /></TableHead>
                      <TableHead><T text="Date" /></TableHead>
                      <TableHead><T text="Supplier" /></TableHead>
                      <TableHead><T text="Items" /></TableHead>
                      <TableHead><T text="Total" /></TableHead>
                      <TableHead><T text="Status" /></TableHead>
                      <TableHead><T text="Payment" /></TableHead>
                      <TableHead><T text="Expected Delivery" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => {
                      const statusBadge = getStatusBadge(order.status);
                      const paymentBadge = getPaymentBadge(order.paymentStatus);
                      
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {order.supplier.abbr}
                                </AvatarFallback>
                              </Avatar>
                              <span>{order.supplier.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={statusBadge.variant as any} className="flex items-center">
                              {statusBadge.icon}
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={paymentBadge.variant as any} className={paymentBadge.className}>
                              {order.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.deliveryDate}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <T text="View" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <T text="Receive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="m-0">
            <Card>
              <div className="p-6 text-center text-muted-foreground">
                <T text="Pending orders will be displayed here" />
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="delivered" className="m-0">
            <Card>
              <div className="p-6 text-center text-muted-foreground">
                <T text="Delivered orders will be displayed here" />
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="pastDue" className="m-0">
            <Card>
              <div className="p-6 text-center text-muted-foreground">
                <T text="Past due orders will be displayed here" />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default PurchaseOrders;
