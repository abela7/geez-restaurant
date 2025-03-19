
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, ChevronLeft, DollarSign, Percent } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Sample menu items
const menuItems = [
  { id: 1, name: "Doro Wat", category: "Main Dishes", cost: 7.45, price: 18.99, margin: 61 },
  { id: 2, name: "Kitfo", category: "Main Dishes", cost: 8.75, price: 19.99, margin: 56 },
  { id: 3, name: "Tibs", category: "Main Dishes", cost: 7.25, price: 17.99, margin: 60 },
  { id: 4, name: "Shiro", category: "Vegetarian", cost: 4.25, price: 14.99, margin: 72 },
  { id: 5, name: "Misir Wat", category: "Vegetarian", cost: 3.75, price: 13.99, margin: 73 },
  { id: 6, name: "Sambusa", category: "Appetizers", cost: 2.55, price: 8.99, margin: 72 },
];

// Sample pricing strategies
const pricingStrategies = [
  { id: 1, name: "Regular Menu", description: "Standard pricing for dine-in service" },
  { id: 2, name: "Happy Hour", description: "Discounted prices for drinks and appetizers (4-6 PM)", discount: 15 },
  { id: 3, name: "Weekend Special", description: "Premium pricing for weekends with special items", modifier: 5 },
  { id: 4, name: "Delivery Menu", description: "Adjusted prices for delivery orders", modifier: 10 },
];

const Pricing = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("items");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Menu Pricing" />}
        description={<T text="Manage prices, profit margins, and special pricing strategies" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <ChevronLeft className="mr-2 h-4 w-4" />
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/menu/recipes">
                <DollarSign className="mr-2 h-4 w-4" />
                <T text="Recipe Costing" />
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  <T text="Pricing Strategy" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle><T text="Create Pricing Strategy" /></DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name"><T text="Strategy Name" /></Label>
                    <Input id="name" placeholder={t("Enter strategy name")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description"><T text="Description" /></Label>
                    <Input id="description" placeholder={t("Enter description")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modifier"><T text="Price Modifier (%)" /></Label>
                    <div className="flex items-center">
                      <Select>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder={t("Type")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="increase"><T text="Increase" /></SelectItem>
                          <SelectItem value="decrease"><T text="Decrease" /></SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        id="modifier" 
                        type="number" 
                        className="ml-2" 
                        placeholder="0" 
                        min="0" 
                        max="100" 
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button><T text="Create Strategy" /></Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="items"><T text="Menu Items" /></TabsTrigger>
          <TabsTrigger value="strategies"><T text="Pricing Strategies" /></TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <div className="mb-6 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search menu items...")}
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Item" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead><T text="Cost" /></TableHead>
                  <TableHead><T text="Price" /></TableHead>
                  <TableHead><T text="Margin" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>${item.cost.toFixed(2)}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.margin}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        <T text="Adjust Price" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="strategies">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pricingStrategies.map((strategy) => (
              <Card key={strategy.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium">{strategy.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
                    {strategy.discount && (
                      <Badge variant="destructive" className="mt-1">
                        <Percent className="h-3 w-3 mr-1" />
                        <T text="Discount" />: {strategy.discount}%
                      </Badge>
                    )}
                    {strategy.modifier && !strategy.discount && (
                      <Badge variant="secondary" className="mt-1">
                        <Percent className="h-3 w-3 mr-1" />
                        <T text="Modifier" />: +{strategy.modifier}%
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    <T text="Edit" />
                  </Button>
                </div>
              </Card>
            ))}
            <Card className="p-4 border-dashed flex justify-center items-center h-32">
              <Button variant="ghost">
                <Plus className="h-5 w-5 mr-2" />
                <T text="Add Pricing Strategy" />
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pricing;
