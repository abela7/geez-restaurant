import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, ChevronLeft, Calculator } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link, useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuNav } from "@/components/menu/MenuNav";
import Layout from "@/components/Layout";

// Sample ingredients for recipes
const ingredients = [
  { id: 1, name: "Chicken", category: "Meat", cost: 5.99, unit: "kg", stock: 25 },
  { id: 2, name: "Berbere Spice", category: "Spices", cost: 12.99, unit: "kg", stock: 5 },
  { id: 3, name: "Onions", category: "Vegetables", cost: 1.99, unit: "kg", stock: 15 },
  { id: 4, name: "Garlic", category: "Vegetables", cost: 8.99, unit: "kg", stock: 3 },
  { id: 5, name: "Niter Kibbeh", category: "Dairy", cost: 9.99, unit: "kg", stock: 8 },
  { id: 6, name: "Red Lentils", category: "Legumes", cost: 4.99, unit: "kg", stock: 20 },
];

// Sample recipes
const recipes = [
  { 
    id: 1, 
    name: "Doro Wat", 
    category: "Main Dishes", 
    totalCost: 7.45, 
    serves: 2,
    costPerServing: 3.73,
    ingredients: [
      { id: 1, ingredientId: 1, name: "Chicken", quantity: 0.5, unit: "kg", cost: 3.00 },
      { id: 2, ingredientId: 2, name: "Berbere Spice", quantity: 0.03, unit: "kg", cost: 0.39 },
      { id: 3, ingredientId: 3, name: "Onions", quantity: 0.2, unit: "kg", cost: 0.40 },
      { id: 4, ingredientId: 5, name: "Niter Kibbeh", quantity: 0.05, unit: "kg", cost: 0.50 },
    ]
  },
  { 
    id: 2, 
    name: "Misir Wat", 
    category: "Vegetarian", 
    totalCost: 3.75, 
    serves: 4,
    costPerServing: 0.94,
    ingredients: [
      { id: 5, ingredientId: 6, name: "Red Lentils", quantity: 0.3, unit: "kg", cost: 1.50 },
      { id: 6, ingredientId: 2, name: "Berbere Spice", quantity: 0.02, unit: "kg", cost: 0.26 },
      { id: 7, ingredientId: 3, name: "Onions", quantity: 0.25, unit: "kg", cost: 0.50 },
      { id: 8, ingredientId: 4, name: "Garlic", quantity: 0.02, unit: "kg", cost: 0.18 },
    ]
  },
];

const RecipeManagement = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("recipes");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const foodId = searchParams.get("foodId");
  
  // If a foodId is provided, find the corresponding recipe and select it
  React.useEffect(() => {
    if (foodId) {
      const recipe = recipes.find(r => r.id === parseInt(foodId));
      if (recipe) {
        setSelectedRecipe(recipe);
        setActiveTab("ingredients");
      }
    }
  }, [foodId]);
  
  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Recipe Management" />}
          description={<T text="Manage recipes, ingredients, and portion costs" />}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link to="/admin/menu">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <T text="Back to Menu" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/menu/food">
                  <Calculator className="mr-2 h-4 w-4" />
                  <T text="Food Management" />
                </Link>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    <T text="Add Recipe" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle><T text="Add New Recipe" /></DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name"><T text="Recipe Name" /></Label>
                        <Input id="name" placeholder={t("Enter recipe name")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category"><T text="Category" /></Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select category")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Main Dishes">Main Dishes</SelectItem>
                            <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="Appetizers">Appetizers</SelectItem>
                            <SelectItem value="Beverages">Beverages</SelectItem>
                            <SelectItem value="Desserts">Desserts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serves"><T text="Serves" /></Label>
                        <Input id="serves" type="number" placeholder="2" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button><T text="Create Recipe" /></Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          }
        />

        <MenuNav />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 mt-6">
          <TabsList>
            <TabsTrigger value="recipes"><T text="Recipes" /></TabsTrigger>
            <TabsTrigger value="ingredients" disabled={!selectedRecipe}><T text="Ingredients" /></TabsTrigger>
          </TabsList>
          <TabsContent value="recipes">
            <div className="mb-6 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("Search recipes...")}
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Recipe" /></TableHead>
                    <TableHead><T text="Category" /></TableHead>
                    <TableHead><T text="Total Cost" /></TableHead>
                    <TableHead><T text="Cost per Serving" /></TableHead>
                    <TableHead className="text-right"><T text="Actions" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell className="font-medium">{recipe.name}</TableCell>
                      <TableCell>{recipe.category}</TableCell>
                      <TableCell>${recipe.totalCost.toFixed(2)}</TableCell>
                      <TableCell>${recipe.costPerServing.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedRecipe(recipe);
                            setActiveTab("ingredients");
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
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
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedRecipe.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      <T text="Manage ingredients for this recipe" />
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        <T text="Add Ingredient" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle><T text="Add New Ingredient" /></DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="ingredient"><T text="Ingredient" /></Label>
                          <Select>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder={t("Select ingredient")} />
                            </SelectTrigger>
                            <SelectContent>
                              {ingredients.map((ingredient) => (
                                <SelectItem key={ingredient.id} value={ingredient.name}>
                                  {ingredient.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity"><T text="Quantity" /></Label>
                          <Input id="quantity" type="number" step="0.01" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="unit"><T text="Unit" /></Label>
                          <Select>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder={t("Select unit")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="g">g</SelectItem>
                              <SelectItem value="l">l</SelectItem>
                              <SelectItem value="ml">ml</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button><T text="Add Ingredient" /></Button>
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
                        <TableHead><T text="Unit" /></TableHead>
                        <TableHead><T text="Cost" /></TableHead>
                        <TableHead className="text-right"><T text="Actions" /></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRecipe.ingredients.map((ingredient) => (
                        <TableRow key={ingredient.id}>
                          <TableCell className="font-medium">{ingredient.name}</TableCell>
                          <TableCell>{ingredient.quantity}</TableCell>
                          <TableCell>{ingredient.unit}</TableCell>
                          <TableCell>${ingredient.cost.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RecipeManagement;
