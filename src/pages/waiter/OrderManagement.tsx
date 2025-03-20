
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  ClipboardList, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Filter,
  ShoppingBag,
  Package,
  UtensilsCrossed
} from "lucide-react";
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

interface OrderManagementProps {
  newOrder?: boolean;
  search?: boolean;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ newOrder = false, search = false }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const [orderType, setOrderType] = useState<string>("dine-in");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  useEffect(() => {
    // Check URL params for order type
    const queryParams = new URLSearchParams(location.search);
    const typeParam = queryParams.get('type');
    if (typeParam) {
      setOrderType(typeParam);
    }
  }, [location]);
  
  // Render the new order interface
  if (newOrder) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={t("New Order")} 
          description={
            orderType === "takeout" ? t("Create a new takeout order") : 
            orderType === "delivery" ? t("Create a new delivery order") : 
            t("Create a new table order")
          }
        />
        
        <Card className="mb-6">
          <div className="p-4 border-b">
            <Tabs value={orderType} onValueChange={setOrderType}>
              <TabsList>
                <TabsTrigger value="dine-in">
                  <UtensilsCrossed className="h-4 w-4 mr-2" />
                  <T text="Dine-in" />
                </TabsTrigger>
                <TabsTrigger value="takeout">
                  <Package className="h-4 w-4 mr-2" />
                  <T text="Takeout" />
                </TabsTrigger>
                <TabsTrigger value="delivery">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  <T text="Delivery" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {orderType === "dine-in" && (
            <div className="p-4">
              <h3 className="font-medium mb-4"><T text="Select a Table" /></h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.from({ length: 12 }, (_, i) => (
                  <Card key={i} className={`p-3 cursor-pointer hover:bg-primary/5 ${i === 4 || i === 7 ? 'bg-amber-100/50 border-amber-500' : ''}`}>
                    <div className="text-center">
                      <p className="font-medium">Table {i + 1}</p>
                      {(i === 4 || i === 7) && (
                        <p className="text-xs text-muted-foreground mt-1"><T text="Occupied" /></p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {orderType === "takeout" && (
            <div className="p-4">
              <h3 className="font-medium mb-4"><T text="Takeout Information" /></h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block"><T text="Customer Name" /></label>
                  <Input placeholder={t("Enter customer name")} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block"><T text="Phone Number" /></label>
                  <Input placeholder={t("Enter phone number")} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block"><T text="Pickup Time" /></label>
                  <Input type="time" defaultValue={new Date().toTimeString().slice(0, 5)} />
                </div>
              </div>
            </div>
          )}
          
          {orderType === "delivery" && (
            <div className="p-4">
              <h3 className="font-medium mb-4"><T text="Delivery Information" /></h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block"><T text="Customer Name" /></label>
                  <Input placeholder={t("Enter customer name")} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block"><T text="Phone Number" /></label>
                  <Input placeholder={t("Enter phone number")} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block"><T text="Delivery Address" /></label>
                  <Input placeholder={t("Enter delivery address")} />
                </div>
              </div>
            </div>
          )}
        </Card>
        
        {/* Menu selection section would go here */}
        <Card>
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium text-lg"><T text="Menu Items" /></h3>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("Search menu...")} 
                className="pl-9 w-full"
              />
            </div>
          </div>
          <div className="p-4 text-center text-muted-foreground">
            <T text="Select menu items to add to the order" />
          </div>
        </Card>
      </div>
    );
  }
  
  // Render the search interface
  if (search) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={t("Search Orders")} 
          description={t("Find and manage existing orders")}
        />
        
        <Card className="mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("Search by order #, table, or customer...")}
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  <T text="Filter" />
                </Button>
                <Button size="sm">
                  <Search className="mr-2 h-4 w-4" />
                  <T text="Search" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          {searchQuery ? (
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
                {orders
                  .filter(order => order.table.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{t(order.table)}</TableCell>
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
                          {t(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{order.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          <T text="Details" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <T text="Enter search terms to find orders" />
            </div>
          )}
        </Card>
      </div>
    );
  }
  
  // Render the main order management interface
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={t("Order Management")} 
        description={t("Track and manage customer orders")}
        actions={
          <Button onClick={() => window.location.href = '/waiter/orders/new'}>
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
            placeholder={t("Search orders...")}
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
                        {t(order.table)}
                        {order.special && (
                          <div className="flex items-center" title={t("Special requests")}>
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <span className="sr-only">{t("Special requests")}</span>
                          </div>
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
                        {t(order.status)}
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
