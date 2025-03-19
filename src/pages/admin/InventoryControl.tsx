
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/card-stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Plus, AlertTriangle, Package, Truck, BarChart2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample inventory data
const inventoryItems = [
  { id: 1, name: "Teff Flour", category: "Dry Goods", quantity: 45, unit: "kg", status: "Normal", reorder: 20 },
  { id: 2, name: "Berbere Spice", category: "Spices", quantity: 12, unit: "kg", status: "Normal", reorder: 5 },
  { id: 3, name: "Chicken", category: "Meat", quantity: 15, unit: "kg", status: "Normal", reorder: 10 },
  { id: 4, name: "Beef", category: "Meat", quantity: 8, unit: "kg", status: "Low", reorder: 10 },
  { id: 5, name: "Onions", category: "Vegetables", quantity: 7, unit: "kg", status: "Low", reorder: 10 },
  { id: 6, name: "Tomatoes", category: "Vegetables", quantity: 3, unit: "kg", status: "Critical", reorder: 8 },
  { id: 7, name: "Butter", category: "Dairy", quantity: 6, unit: "kg", status: "Normal", reorder: 4 },
];

const InventoryControl = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Inventory Control" 
        description="Track and manage your restaurant inventory"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <T text="Add Item" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Items" 
          value="124" 
          icon={<Package size={18} />}
        />
        <StatCard 
          title="Low Stock Items" 
          value="8" 
          change="+2" 
          isPositive={false}
          icon={<AlertTriangle size={18} />}
        />
        <StatCard 
          title="Pending Orders" 
          value="3" 
          icon={<Truck size={18} />}
        />
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="w-full pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <T text="All Categories" />
          </Button>
          <Button variant="outline" size="sm">
            <BarChart2 className="mr-2 h-4 w-4" />
            <T text="Usage Analytics" />
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><T text="Item Name" /></TableHead>
              <TableHead><T text="Category" /></TableHead>
              <TableHead><T text="Quantity" /></TableHead>
              <TableHead><T text="Status" /></TableHead>
              <TableHead><T text="Reorder Level" /></TableHead>
              <TableHead className="text-right"><T text="Actions" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.quantity} {item.unit}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "Normal" ? "default" : 
                              item.status === "Low" ? "outline" : 
                              "destructive"}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.reorder} {item.unit}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <T text="Update" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <T text="History" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default InventoryControl;
