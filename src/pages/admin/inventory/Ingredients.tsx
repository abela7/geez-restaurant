
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Filter, 
  FileDown, 
  Leaf,
  EggFried,
  Wheat,
  RefreshCw
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import AppLayout from "@/components/Layout";
import { InventoryNav } from "@/components/inventory/InventoryNav";
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

// Sample ingredients data
const ingredients = [
  { id: 1, name: "Teff Flour", category: "Grain", type: "Dry", cost: 5.75, unit: "kg", supplier: "Local Farm Supply", allergens: [], dietary: ["Gluten-Free"], origin: "Ethiopia" },
  { id: 2, name: "Berbere Spice", category: "Spice", type: "Dry", cost: 12.50, unit: "kg", supplier: "Spice Imports Ltd", allergens: [], dietary: ["Vegan"], origin: "Ethiopia" },
  { id: 3, name: "Chicken", category: "Protein", type: "Refrigerated", cost: 8.25, unit: "kg", supplier: "Green Valley Farms", allergens: [], dietary: [], origin: "Local" },
  { id: 4, name: "Beef", category: "Protein", type: "Refrigerated", cost: 12.75, unit: "kg", supplier: "Green Valley Farms", allergens: [], dietary: [], origin: "Local" },
  { id: 5, name: "Onions", category: "Vegetable", type: "Fresh", cost: 2.50, unit: "kg", supplier: "Local Farm Supply", allergens: [], dietary: ["Vegan"], origin: "Local" },
  { id: 6, name: "Tomatoes", category: "Vegetable", type: "Fresh", cost: 4.25, unit: "kg", supplier: "Local Farm Supply", allergens: [], dietary: ["Vegan"], origin: "Local" },
  { id: 7, name: "Butter", category: "Dairy", type: "Refrigerated", cost: 9.50, unit: "kg", supplier: "Green Valley Farms", allergens: ["Milk"], dietary: ["Vegetarian"], origin: "Local" },
  { id: 8, name: "Lentils", category: "Legume", type: "Dry", cost: 3.75, unit: "kg", supplier: "Spice Imports Ltd", allergens: [], dietary: ["Vegan"], origin: "Ethiopia" },
  { id: 9, name: "Injera Starter", category: "Culture", type: "Refrigerated", cost: 8.25, unit: "kg", supplier: "Authentic Cultures", allergens: [], dietary: ["Vegan"], origin: "Ethiopia" },
];

// Ingredient categories with their respective icons
const categories = [
  { name: "All", icon: <Leaf className="h-4 w-4" /> },
  { name: "Grain", icon: <Wheat className="h-4 w-4" /> },
  { name: "Protein", icon: <EggFried className="h-4 w-4" /> },
  { name: "Vegetable", icon: <Leaf className="h-4 w-4" /> },
  { name: "Spice", icon: <Leaf className="h-4 w-4" /> },
  { name: "Dairy", icon: <Leaf className="h-4 w-4" /> },
  { name: "Legume", icon: <Leaf className="h-4 w-4" /> },
];

const Ingredients = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === "All" || ingredient.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Ingredients" />}
          description={<T text="Manage ingredients used in recipes" />}
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
                <T text="Add Ingredient" />
              </Button>
            </>
          }
        />

        <InventoryNav />

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search ingredients...")}
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("Filter by category")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.name} value={category.name}>
                    <div className="flex items-center">
                      {category.icon}
                      <span className="ml-2"><T text={category.name} /></span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline"><T text="More Filters" /></span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all"><T text="All Ingredients" /></TabsTrigger>
            <TabsTrigger value="dry"><T text="Dry" /></TabsTrigger>
            <TabsTrigger value="fresh"><T text="Fresh" /></TabsTrigger>
            <TabsTrigger value="refrigerated"><T text="Refrigerated" /></TabsTrigger>
            <TabsTrigger value="imported"><T text="Imported" /></TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Name" /></TableHead>
                      <TableHead><T text="Category" /></TableHead>
                      <TableHead><T text="Type" /></TableHead>
                      <TableHead><T text="Cost" /></TableHead>
                      <TableHead><T text="Supplier" /></TableHead>
                      <TableHead><T text="Allergens" /></TableHead>
                      <TableHead><T text="Origin" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIngredients.map((ingredient) => (
                      <TableRow key={ingredient.id}>
                        <TableCell className="font-medium">{ingredient.name}</TableCell>
                        <TableCell>{ingredient.category}</TableCell>
                        <TableCell>{ingredient.type}</TableCell>
                        <TableCell>${ingredient.cost.toFixed(2)}/{ingredient.unit}</TableCell>
                        <TableCell>{ingredient.supplier}</TableCell>
                        <TableCell>
                          {ingredient.allergens.length > 0 ? (
                            ingredient.allergens.map(allergen => (
                              <Badge key={allergen} variant="outline" className="mr-1">
                                {allergen}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell>{ingredient.origin}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <T text="Edit" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <T text="Details" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="dry" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <p><T text="Filtered dry ingredients will appear here" /></p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fresh" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <p><T text="Filtered fresh ingredients will appear here" /></p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="refrigerated" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <p><T text="Filtered refrigerated ingredients will appear here" /></p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="imported" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <p><T text="Filtered imported ingredients will appear here" /></p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Ingredients;
