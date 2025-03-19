
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StatCard } from "@/components/ui/card-stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  FileText, 
  ChefHat, 
  Clock, 
  Users, 
  Leaf,
  FilterX,
  ClipboardList,
  FileDown,
  RefreshCw
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample recipes data
const recipes = [
  {
    id: 1,
    name: "Doro Wat (Chicken Stew)",
    category: "Main Dish",
    ingredients: [
      { name: "Chicken", quantity: 1.5, unit: "kg" },
      { name: "Berbere Spice", quantity: 100, unit: "g" },
      { name: "Onions", quantity: 500, unit: "g" },
      { name: "Garlic", quantity: 50, unit: "g" },
      { name: "Butter", quantity: 100, unit: "g" },
    ],
    cookingTime: 60,
    servings: 4,
    cost: 12.50,
    allergens: [],
    dietary: [],
    author: "Abebe Kebede",
    lastUpdated: "2023-11-10"
  },
  {
    id: 2,
    name: "Tibs (Sautéed Beef)",
    category: "Main Dish",
    ingredients: [
      { name: "Beef", quantity: 1, unit: "kg" },
      { name: "Onions", quantity: 300, unit: "g" },
      { name: "Tomatoes", quantity: 200, unit: "g" },
      { name: "Jalapeño", quantity: 50, unit: "g" },
      { name: "Rosemary", quantity: 10, unit: "g" },
    ],
    cookingTime: 45,
    servings: 4,
    cost: 14.25,
    allergens: [],
    dietary: [],
    author: "Abebe Kebede",
    lastUpdated: "2023-11-12"
  },
  {
    id: 3,
    name: "Shiro (Chickpea Stew)",
    category: "Main Dish",
    ingredients: [
      { name: "Shiro Powder", quantity: 250, unit: "g" },
      { name: "Onions", quantity: 200, unit: "g" },
      { name: "Garlic", quantity: 30, unit: "g" },
      { name: "Berbere Spice", quantity: 30, unit: "g" },
      { name: "Oil", quantity: 50, unit: "ml" },
    ],
    cookingTime: 30,
    servings: 4,
    cost: 8.75,
    allergens: [],
    dietary: ["Vegetarian", "Vegan"],
    author: "Tigist Haile",
    lastUpdated: "2023-11-15"
  },
  {
    id: 4,
    name: "Injera (Sourdough Flatbread)",
    category: "Bread",
    ingredients: [
      { name: "Teff Flour", quantity: 500, unit: "g" },
      { name: "Water", quantity: 750, unit: "ml" },
      { name: "Injera Starter", quantity: 50, unit: "g" },
    ],
    cookingTime: 180,
    servings: 8,
    cost: 4.50,
    allergens: [],
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    author: "Tigist Haile",
    lastUpdated: "2023-11-18"
  },
  {
    id: 5,
    name: "Misir Wat (Lentil Stew)",
    category: "Vegetarian",
    ingredients: [
      { name: "Red Lentils", quantity: 400, unit: "g" },
      { name: "Onions", quantity: 300, unit: "g" },
      { name: "Garlic", quantity: 30, unit: "g" },
      { name: "Berbere Spice", quantity: 40, unit: "g" },
      { name: "Oil", quantity: 60, unit: "ml" },
    ],
    cookingTime: 40,
    servings: 4,
    cost: 7.25,
    allergens: [],
    dietary: ["Vegetarian", "Vegan"],
    author: "Tigist Haile",
    lastUpdated: "2023-11-20"
  },
  {
    id: 6,
    name: "Ethiopian Coffee Ceremony",
    category: "Beverage",
    ingredients: [
      { name: "Coffee Beans", quantity: 100, unit: "g" },
      { name: "Water", quantity: 1, unit: "l" },
    ],
    cookingTime: 25,
    servings: 6,
    cost: 5.00,
    allergens: [],
    dietary: ["Vegetarian", "Vegan"],
    author: "Abebe Kebede",
    lastUpdated: "2023-11-05"
  }
];

const Recipes = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDietary, setSelectedDietary] = useState("all");

  // Unique categories and dietary preferences for filters
  const categories = ["All Categories", ...new Set(recipes.map(recipe => recipe.category))];
  const dietaryOptions = ["All Dietary", "Vegetarian", "Vegan", "Gluten-Free"];

  // Filter recipes based on search, category, and dietary preferences
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || recipe.category === selectedCategory;
    const matchesDietary = selectedDietary === "All Dietary" || recipe.dietary.includes(selectedDietary);
    return matchesSearch && matchesCategory && matchesDietary;
  });

  return (
    <AppLayout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Recipe Management" />}
          description={<T text="Manage recipes and track ingredient usage" />}
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
                <T text="Add Recipe" />
              </Button>
            </>
          }
        />

        <InventoryNav />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title={<T text="Total Recipes" />}
            value={recipes.length.toString()}
            icon={<ChefHat size={18} />}
          />
          <StatCard 
            title={<T text="Vegetarian Options" />}
            value={(recipes.filter(r => r.dietary.includes("Vegetarian"))).length.toString()}
            icon={<Leaf size={18} />}
          />
          <StatCard 
            title={<T text="Average Cost per Serving" />}
            value={`$${(recipes.reduce((sum, recipe) => sum + recipe.cost/recipe.servings, 0) / recipes.length).toFixed(2)}`}
            icon={<Users size={18} />}
          />
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search recipes...")}
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t("Category")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    <T text={category} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDietary} onValueChange={setSelectedDietary}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t("Dietary")} />
              </SelectTrigger>
              <SelectContent>
                {dietaryOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    <T text={option} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <FilterX className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="flex flex-col overflow-hidden">
              <CardContent className="p-6 flex-1">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{recipe.name}</h3>
                  <p className="text-muted-foreground">{recipe.category}</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span><T text="Prep time" />: {recipe.cookingTime} <T text="mins" /></span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{recipe.servings} <T text="servings" /></span>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium mb-2"><T text="Key Ingredients" /></h4>
                <ul className="mb-4 space-y-1 text-sm">
                  {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span>{ingredient.name}</span>
                      <span className="text-muted-foreground">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <li className="text-muted-foreground text-xs italic">
                      <T text="And" /> {recipe.ingredients.length - 3} <T text="more ingredients" />...
                    </li>
                  )}
                </ul>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {recipe.dietary.map((dietType) => (
                    <Badge key={dietType} variant="outline">
                      {dietType}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="px-6 py-4 bg-muted/40 border-t flex justify-between">
                <div>
                  <span className="text-sm font-medium"><T text="Cost" />: ${recipe.cost.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground block">
                    ${(recipe.cost / recipe.servings).toFixed(2)} <T text="per serving" />
                  </span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      <T text="Details" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>{recipe.name}</DialogTitle>
                      <DialogDescription>
                        <Badge className="mr-2">{recipe.category}</Badge>
                        <span className="text-sm">
                          <T text="Last updated" />: {recipe.lastUpdated}
                        </span>
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div>
                        <Label className="text-sm font-medium"><T text="Ingredients" /></Label>
                        <ul className="mt-2 space-y-2">
                          {recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx} className="flex justify-between text-sm">
                              <span>{ingredient.name}</span>
                              <span className="text-muted-foreground">
                                {ingredient.quantity} {ingredient.unit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium"><T text="Cooking Information" /></Label>
                          <div className="mt-2 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span><T text="Prep Time" /></span>
                              <span>{recipe.cookingTime} <T text="mins" /></span>
                            </div>
                            <div className="flex justify-between">
                              <span><T text="Servings" /></span>
                              <span>{recipe.servings}</span>
                            </div>
                            <div className="flex justify-between">
                              <span><T text="Cost" /></span>
                              <span>${recipe.cost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span><T text="Cost Per Serving" /></span>
                              <span>${(recipe.cost / recipe.servings).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium"><T text="Dietary Information" /></Label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {recipe.dietary.length > 0 ? (
                              recipe.dietary.map((diet) => (
                                <Badge key={diet} variant="outline">{diet}</Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                <T text="No special dietary information" />
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium"><T text="Created By" /></Label>
                          <div className="mt-1 text-sm">{recipe.author}</div>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        <T text="Print Recipe" />
                      </Button>
                      <Button>
                        <T text="Edit Recipe" />
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Recipes;
