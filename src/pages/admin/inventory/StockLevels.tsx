
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/card-stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge-extended";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  AlertTriangle, 
  Package, 
  Truck, 
  BarChart2,
  RefreshCw, 
  FileDown,
  Filter
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import AppLayout from "@/components/Layout";
import { InventoryNav } from "@/components/inventory/InventoryNav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const stockItems = [
  { id: 1, name: "Teff Flour", category: "Dry Goods", quantity: 45, unit: "kg", status: "Normal", reorder: 20, lastUpdated: "2023-11-15" },
  { id: 2, name: "Berbere Spice", category: "Spices", quantity: 12, unit: "kg", status: "Normal", reorder: 5, lastUpdated: "2023-11-20" },
  { id: 3, name: "Chicken", category: "Meat", quantity: 15, unit: "kg", status: "Normal", reorder: 10, lastUpdated: "2023-11-21" },
  { id: 4, name: "Beef", category: "Meat", quantity: 8, unit: "kg", status: "Low", reorder: 10, lastUpdated: "2023-11-22" },
  { id: 5, name: "Onions", category: "Vegetables", quantity: 7, unit: "kg", status: "Low", reorder: 10, lastUpdated: "2023-11-22" },
  { id: 6, name: "Tomatoes", category: "Vegetables", quantity: 3, unit: "kg", status: "Critical", reorder: 8, lastUpdated: "2023-11-23" },
  { id: 7, name: "Butter", category: "Dairy", quantity: 6, unit: "kg", status: "Normal", reorder: 4, lastUpdated: "2023-11-23" },
  { id: 8, name: "Cardamom", category: "Spices", quantity: 2, unit: "kg", status: "Low", reorder: 3, lastUpdated: "2023-11-24" },
  { id: 9, name: "Lentils", category: "Legumes", quantity: 30, unit: "kg", status: "Normal", reorder: 15, lastUpdated: "2023-11-24" },
];

const StockLevels = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["All Categories", "Dry Goods", "Spices", "Meat", "Vegetables", "Dairy", "Legumes"];

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = stockItems.filter(item => item.status === "Low" || item.status === "Critical").length;

  return (
    <AppLayout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Stock Levels" />}
          description={<T text="Monitor and manage inventory stock levels" />}
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
                <T text="Add Item" />
              </Button>
            </>
          }
        />

        <InventoryNav />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Total Items"
            value={stockItems.length.toString()}
            icon={<Package size={18} />}
          />
          <StatCard 
            title="Low Stock Items"
            value={lowStockCount.toString()}
            change={"+2"} 
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
              placeholder={t("Search inventory...")}
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("All Categories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><T text="All Categories" /></SelectItem>
                {categories.slice(1).map(category => (
                  <SelectItem key={category} value={category}><T text={category} /></SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline"><T text="Filters" /></span>
            </Button>
            <Button variant="outline" size="sm">
              <BarChart2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline"><T text="Analytics" /></span>
            </Button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Item Name" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead><T text="Quantity" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Reorder Level" /></TableHead>
                  <TableHead><T text="Last Updated" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === "Normal" ? "success" : 
                        item.status === "Low" ? "warning" : 
                        "destructive"
                      }>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.reorder} {item.unit}</TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
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
          </div>
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default StockLevels;
