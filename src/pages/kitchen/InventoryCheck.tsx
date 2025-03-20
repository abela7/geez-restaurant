
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, RefreshCw, AlertCircle, AlertTriangle, Ban } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample inventory data
const inventoryItems = [
  { id: 1, name: "Teff Flour", category: "Dry Goods", quantity: 45, unit: "kg", status: "Normal", lastUpdated: "Today, 8:30 AM" },
  { id: 2, name: "Berbere Spice", category: "Spices", quantity: 12, unit: "kg", status: "Normal", lastUpdated: "Yesterday" },
  { id: 3, name: "Chicken", category: "Meat", quantity: 15, unit: "kg", status: "Normal", lastUpdated: "Today, 9:15 AM" },
  { id: 4, name: "Beef", category: "Meat", quantity: 8, unit: "kg", status: "Low", lastUpdated: "Today, 9:15 AM" },
  { id: 5, name: "Onions", category: "Vegetables", quantity: 7, unit: "kg", status: "Low", lastUpdated: "Today, 7:45 AM" },
  { id: 6, name: "Tomatoes", category: "Vegetables", quantity: 3, unit: "kg", status: "Critical", lastUpdated: "Yesterday" },
  { id: 7, name: "Butter", category: "Dairy", quantity: 6, unit: "kg", status: "Normal", lastUpdated: "Today, 8:30 AM" },
  { id: 8, name: "Eggs", category: "Dairy", quantity: 85, unit: "pcs", status: "Normal", lastUpdated: "Yesterday" },
  { id: 9, name: "Lentils", category: "Dry Goods", quantity: 28, unit: "kg", status: "Normal", lastUpdated: "Last Week" },
  { id: 10, name: "Injera Bread", category: "Bread", quantity: 0, unit: "pcs", status: "Out of Stock", lastUpdated: "Today, 10:30 AM" },
];

// Sample categories for tabs
const categories = ["All", "Meat", "Vegetables", "Dry Goods", "Spices", "Dairy", "Bread"];

const InventoryCheck = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Kitchen Inventory" 
        description="Check and manage current inventory levels"
        actions={
          <Button size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            <T text="Refresh Data" />
          </Button>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-9 w-full"
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category.toLowerCase().replace(' ', '-')}>
              <T text={category} />
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Item" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead><T text="Quantity" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Last Updated" /></TableHead>
                  <TableHead><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {item.status === "Critical" && <AlertCircle className="h-4 w-4 text-destructive" />}
                        {item.status === "Low" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        {item.status === "Out of Stock" && <Ban className="h-4 w-4 text-destructive" />}
                        <Badge 
                          variant={
                            item.status === "Normal" ? "default" : 
                            item.status === "Low" ? "outline" : 
                            "destructive"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                    <TableCell>
                      {(item.status === "Low" || item.status === "Critical" || item.status === "Out of Stock") && (
                        <Button variant="outline" size="sm">
                          <T text="Report to Admin" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <T text="Update" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Filter tabs for other categories */}
        {categories.slice(1).map((category) => (
          <TabsContent key={category} value={category.toLowerCase().replace(' ', '-')}>
            <Card className="p-4">
              <div className="text-center p-8 text-muted-foreground">
                <T text={`Filtered view of ${category} inventory would appear here`} />
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4"><T text="Inventory Alerts" /></h3>
          <div className="space-y-4">
            {inventoryItems.filter(item => item.status !== "Normal").map((item) => (
              <div key={item.id} className={`p-4 rounded-md border ${
                item.status === "Critical" || item.status === "Out of Stock" ? 'border-destructive bg-destructive/10' : 'border-amber-500 bg-amber-500/10'
              }`}>
                <div className="flex items-start gap-3">
                  {item.status === "Critical" || item.status === "Out of Stock" ? (
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-medium">{item.name} - {item.status}</h4>
                    <p className="text-sm mt-1">
                      {item.status === "Out of Stock" 
                        ? <T text={`${item.name} is currently out of stock. This may affect menu availability.`} />
                        : <T text={`${item.name} is running low (${item.quantity} ${item.unit} remaining). Consider reordering soon.`} />
                      }
                    </p>
                    <div className="mt-3">
                      <Button size="sm" variant={item.status === "Critical" || item.status === "Out of Stock" ? "destructive" : "outline"}>
                        <T text="Report to Admin" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InventoryCheck;
