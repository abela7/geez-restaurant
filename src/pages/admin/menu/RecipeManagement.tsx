
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, FilePen, DollarSign, ChevronLeft, Trash2, Calculator } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

// Sample menu items with recipes
const menuItems = [
  { 
    id: 1, 
    name: "Doro Wat", 
    category: "Main Dishes", 
    price: 18.99, 
    cost: 7.45, 
    profit: 11.54, 
    margin: 61, 
    image: "/placeholder.svg", 
    ingredients: [
      { id: 1, name: "Chicken", quantity: 0.5, unit: "kg", cost: 4.00, total: 2.00 },
      { id: 2, name: "Berbere Spice", quantity: 0.03, unit: "kg", cost: 45.00, total: 1.35 },
      { id: 3, name: "Onions", quantity: 0.2, unit: "kg", cost: 1.80, total: 0.36 },
      { id: 4, name: "Eggs", quantity: 3, unit: "pcs", cost: 0.35, total: 1.05 },
      { id: 5, name: "Niter Kibbeh", quantity: 0.05, unit: "kg", cost: 22.00, total: 1.10 },
      { id: 6, name: "Garlic", quantity: 0.03, unit: "kg", cost: 6.00, total: 0.18 },
      { id: 7, name: "Ginger", quantity: 0.02, unit: "kg", cost: 8.00, total: 0.16 },
      { id: 8, name: "Other Spices", quantity: 1, unit: "set", cost: 0.75, total: 0.75 },
    ],
    laborCost: 0.50,
    laborTime: 30,
  },
  { 
    id: 2, 
    name: "Kitfo", 
    category: "Main Dishes", 
    price: 19.99, 
    cost: 8.75, 
    profit: 11.24, 
    margin: 56, 
    image: "/placeholder.svg",
    ingredients: [
      { id: 9, name: "Lean Beef", quantity: 0.3, unit: "kg", cost: 22.00, total: 6.60 },
      { id: 10, name: "Mitmita", quantity: 0.02, unit: "kg", cost: 40.00, total: 0.80 },
      { id: 11, name: "Niter Kibbeh", quantity: 0.05, unit: "kg", cost: 22.00, total: 1.10 },
      { id: 12, name: "Other Spices", quantity: 1, unit: "set", cost: 0.25, total: 0.25 },
    ],
    laborCost: 0.50,
    laborTime: 20,
  },
];

// Sample ingredients for the inventory
const ingredients = [
  { id: 1, name: "Chicken", stock: 25, unit: "kg", cost: 4.00, category: "Meat" },
  { id: 2, name: "Berbere Spice", stock: 5.2, unit: "kg", cost: 45.00, category: "Spices" },
  { id: 3, name: "Onions", stock: 18.5, unit: "kg", cost: 1.80, category: "Vegetables" },
  { id: 4, name: "Eggs", stock: 120, unit: "pcs", cost: 0.35, category: "Dairy" },
  { id: 5, name: "Niter Kibbeh", stock: 8.4, unit: "kg", cost: 22.00, category: "Dairy" },
  { id: 6, name: "Garlic", stock: 4.2, unit: "kg", cost: 6.00, category: "Vegetables" },
  { id: 7, name: "Ginger", stock: 3.5, unit: "kg", cost: 8.00, category: "Vegetables" },
  { id: 8, name: "Other Spices", stock: 100, unit: "set", cost: 0.75, category: "Spices" },
  { id: 9, name: "Lean Beef", stock: 22, unit: "kg", cost: 22.00, category: "Meat" },
  { id: 10, name: "Mitmita", stock: 3.8, unit: "kg", cost: 40.00, category: "Spices" },
];

const RecipeManagement = () => {
  const { t } = useLanguage();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddIngredientDialog, setShowAddIngredientDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("recipes");

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setActiveTab("ingredients");
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Recipe Management" />}
        description={<T text="Track ingredients, costs, and profitability for your menu items" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <ChevronLeft className="mr-2 h-4 w-4" />
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button variant="outline">
              <Calculator className="mr-2 h-4 w-4" />
              <T text="Batch Calculator" />
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Add Recipe" />
            </Button>
          </>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search recipes...")}
            className="w-full pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="mb-4">
          <TabsTrigger value="recipes"><T text="Recipes" /></TabsTrigger>
          <TabsTrigger value="ingredients" disabled={!selectedRecipe}>
            <T text="Recipe Ingredients" />
          </TabsTrigger>
          <TabsTrigger value="inventory"><T text="Ingredient Inventory" /></TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Item" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead className="hidden md:table-cell"><T text="Recipe Cost" /></TableHead>
                  <TableHead className="hidden md:table-cell"><T text="Selling Price" /></TableHead>
                  <TableHead className="hidden md:table-cell"><T text="Profit" /></TableHead>
                  <TableHead className="hidden md:table-cell"><T text="Margin %" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="hidden md:table-cell">${item.cost.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell">${item.profit.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell">{item.margin}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleSelectRecipe(item)}>
                        <FilePen className="h-4 w-4 mr-2" />
                        <T text="Edit Recipe" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="ingredients">
          {selectedRecipe && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedRecipe.name}</h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline">{selectedRecipe.category}</Badge>
                    <Badge variant="outline">
                      <T text="Preparation Time" />: {selectedRecipe.laborTime} <T text="min" />
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Card className="p-4 bg-muted/30">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1"><T text="Recipe Cost" /></h3>
                      <p className="text-2xl font-bold">${selectedRecipe.cost.toFixed(2)}</p>
                    </Card>
                    <Card className="p-4 bg-muted/30">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1"><T text="Selling Price" /></h3>
                      <p className="text-2xl font-bold">${selectedRecipe.price.toFixed(2)}</p>
                    </Card>
                    <Card className="p-4 bg-muted/30">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1"><T text="Profit Margin" /></h3>
                      <p className="text-2xl font-bold">{selectedRecipe.margin}%</p>
                    </Card>
                  </div>
                </div>
                <Card className="w-full md:w-64 overflow-hidden">
                  <AspectRatio ratio={4/3}>
                    <img 
                      src={selectedRecipe.image} 
                      alt={selectedRecipe.name}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </Card>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium"><T text="Recipe Ingredients" /></h3>
                <Dialog open={showAddIngredientDialog} onOpenChange={setShowAddIngredientDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      <T text="Add Ingredient" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle><T text="Add Ingredient to Recipe" /></DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="ingredient"><T text="Ingredient" /></Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select ingredient")} />
                          </SelectTrigger>
                          <SelectContent>
                            {ingredients.map((ingredient) => (
                              <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
                                {ingredient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantity"><T text="Quantity" /></Label>
                          <Input id="quantity" type="number" step="0.01" min="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="unit"><T text="Unit" /></Label>
                          <Input id="unit" disabled />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button><T text="Add to Recipe" /></Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Ingredient" /></TableHead>
                      <TableHead><T text="Quantity" /></TableHead>
                      <TableHead className="hidden md:table-cell"><T text="Unit Cost" /></TableHead>
                      <TableHead><T text="Total Cost" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRecipe.ingredients.map((ingredient) => (
                      <TableRow key={ingredient.id}>
                        <TableCell className="font-medium">{ingredient.name}</TableCell>
                        <TableCell>
                          {ingredient.quantity} {ingredient.unit}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">${ingredient.cost.toFixed(2)}/{ingredient.unit}</TableCell>
                        <TableCell>${ingredient.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} className="font-bold">
                        <T text="Labor Cost" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        ${selectedRecipe.laborCost.toFixed(2)}/min
                      </TableCell>
                      <TableCell>
                        ${(selectedRecipe.laborCost * selectedRecipe.laborTime).toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="font-bold text-lg">
                        <T text="Total Cost" />
                      </TableCell>
                      <TableCell className="font-bold text-lg">
                        ${selectedRecipe.cost.toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="inventory">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium"><T text="Ingredient Inventory" /></h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              <T text="Add Ingredient" />
            </Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Ingredient" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead><T text="Stock Amount" /></TableHead>
                  <TableHead className="hidden md:table-cell"><T text="Unit" /></TableHead>
                  <TableHead><T text="Cost per Unit" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell>{ingredient.category}</TableCell>
                    <TableCell>{ingredient.stock}</TableCell>
                    <TableCell className="hidden md:table-cell">{ingredient.unit}</TableCell>
                    <TableCell>${ingredient.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
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
      </Tabs>
    </div>
  );
};

export default RecipeManagement;
