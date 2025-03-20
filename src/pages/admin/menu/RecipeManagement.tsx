
import React, { useState, useEffect } from "react";
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
import { useDatabase } from "@/contexts/DatabaseContext";
import { Recipe, Ingredient } from "@/lib/database";
import { useToast } from "@/components/ui/use-toast";

const RecipeManagement = () => {
  const { t } = useLanguage();
  const { recipes, ingredients, menuItems } = useDatabase();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("recipes");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const foodId = searchParams.get("foodId");
  
  // If a foodId is provided, find the corresponding recipe and select it
  useEffect(() => {
    if (foodId) {
      const recipe = recipes.find(r => r.menuItemId === foodId);
      if (recipe) {
        setSelectedRecipe(recipe);
        setActiveTab("ingredients");
      }
    }
  }, [foodId, recipes]);
  
  const filteredRecipes = recipes.filter(recipe => {
    const menuItem = menuItems.find(item => item.id === recipe.menuItemId);
    return recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (menuItem && menuItem.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const getMenuItemName = (menuItemId: string) => {
    return menuItems.find(item => item.id === menuItemId)?.name || '';
  };

  const getMenuItemCategory = (menuItemId: string) => {
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (!menuItem) return '';
    return menuItem.categoryId;
  };

  const getIngredientById = (id: string): Ingredient | undefined => {
    return ingredients.find(ing => ing.id === id);
  };

  const calculateTotalCost = (recipe: Recipe): number => {
    return recipe.ingredients.reduce((total, ingredient) => {
      const ing = getIngredientById(ingredient.ingredientId);
      if (!ing) return total;
      return total + (ing.unitCost * ingredient.quantity);
    }, 0);
  };

  const calculateCostPerServing = (recipe: Recipe): number => {
    if (!recipe.servingSize || recipe.servingSize <= 0) return 0;
    return calculateTotalCost(recipe) / recipe.servingSize;
  };

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
                        <Label htmlFor="menuItem"><T text="Menu Item" /></Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select menu item")} />
                          </SelectTrigger>
                          <SelectContent>
                            {menuItems.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
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
                    <Button onClick={() => {
                      toast({
                        title: "Not implemented",
                        description: "The add recipe feature is not implemented yet.",
                      });
                    }}>
                      <T text="Create Recipe" />
                    </Button>
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
                    <TableHead><T text="Menu Item" /></TableHead>
                    <TableHead><T text="Total Cost" /></TableHead>
                    <TableHead><T text="Cost per Serving" /></TableHead>
                    <TableHead className="text-right"><T text="Actions" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell className="font-medium">{recipe.name}</TableCell>
                      <TableCell>{getMenuItemName(recipe.menuItemId)}</TableCell>
                      <TableCell>${calculateTotalCost(recipe).toFixed(2)}</TableCell>
                      <TableCell>${calculateCostPerServing(recipe).toFixed(2)}</TableCell>
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
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("Select ingredient")} />
                            </SelectTrigger>
                            <SelectContent>
                              {ingredients.map((ingredient) => (
                                <SelectItem key={ingredient.id} value={ingredient.id}>
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
                      </div>
                      <DialogFooter>
                        <Button onClick={() => {
                          toast({
                            title: "Not implemented",
                            description: "The add ingredient feature is not implemented yet.",
                          });
                        }}>
                          <T text="Add Ingredient" />
                        </Button>
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
                      {selectedRecipe.ingredients.map((recipeIngredient) => {
                        const ingredient = getIngredientById(recipeIngredient.ingredientId);
                        if (!ingredient) return null;
                        
                        const cost = ingredient.unitCost * recipeIngredient.quantity;
                        
                        return (
                          <TableRow key={recipeIngredient.ingredientId}>
                            <TableCell className="font-medium">{ingredient.name}</TableCell>
                            <TableCell>{recipeIngredient.quantity}</TableCell>
                            <TableCell>{ingredient.unit}</TableCell>
                            <TableCell>${cost.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => {
                                  toast({
                                    title: "Not implemented",
                                    description: "The edit ingredient feature is not implemented yet.",
                                  });
                                }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => {
                                  toast({
                                    title: "Not implemented",
                                    description: "The delete ingredient feature is not implemented yet.",
                                  });
                                }}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
