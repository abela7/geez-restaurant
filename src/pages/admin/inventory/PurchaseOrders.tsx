
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
      matchesTab = false;
    }
    
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesTab && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return { variant: "success" };
      case "In Transit":
        return { variant: "warning" };
      case "Ordered":
        return { variant: "default" };
      default:
        return { variant: "outline" };
    }
  };

  const getPaymentBadge = (status: string) => {
    return status === "Paid" 
      ? { variant: "outline", className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800" }
      : { variant: "outline", className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800" };
  };

  return (
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

        <TabsContent value="all" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Payment</TableHead>
                  <TableHead className="hidden lg:table-cell">Delivery Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs">
                            {order.supplier.abbr}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline">{order.supplier.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{order.items}</TableCell>
                    <TableCell>£{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(order.status).variant as any}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={getPaymentBadge(order.paymentStatus).variant as any}
                        className={getPaymentBadge(order.paymentStatus).className}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{order.deliveryDate}</TableCell>
                    <TableCell className="hidden lg:table-cell">{order.assignedTo}</TableCell>
                  </TableRow>
                ))}
                
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center">
                      No purchase orders found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          {/* Pending orders content would go here */}
        </TabsContent>
        
        <TabsContent value="delivered">
          {/* Delivered orders content would go here */}
        </TabsContent>
        
        <TabsContent value="pastDue">
          {/* Past due orders content would go here */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseOrders;
