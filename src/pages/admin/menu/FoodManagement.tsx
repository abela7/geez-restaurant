
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, FilePen, DollarSign, ChevronLeft, Trash2, Calculator } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MenuNav } from "@/components/menu/MenuNav";
import Layout from "@/components/Layout";
import { useDatabase } from "@/contexts/DatabaseContext";
import { MenuItem } from "@/lib/database";
import { useToast } from "@/components/ui/use-toast";

const FoodManagement = () => {
  const { t } = useLanguage();
  const { menuItems, menuCategories, ingredients, recipes } = useDatabase();
  const { toast } = useToast();
  
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);
  const [showAddIngredientDialog, setShowAddIngredientDialog] = useState(false);
  const [showAddFoodDialog, setShowAddFoodDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredFoodItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    menuCategories.find(cat => cat.id === item.categoryId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (categoryId: string) => {
    return menuCategories.find(cat => cat.id === categoryId)?.name || '';
  };

  const getItemIngredients = (ingredientIds: string[]) => {
    return ingredientIds.map(id => ingredients.find(ing => ing.id === id)).filter(Boolean);
  };

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Food Management" />}
          description={<T text="Create and manage dishes with recipes, ingredients, and costs" />}
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
                  <Calculator className="mr-2 h-4 w-4" />
                  <T text="Recipe Management" />
                </Link>
              </Button>
              <Dialog open={showAddFoodDialog} onOpenChange={setShowAddFoodDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    <T text="Add Food Item" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle><T text="Add New Food Item" /></DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name"><T text="Food Name" /></Label>
                        <Input id="name" placeholder={t("Enter food name")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category"><T text="Category" /></Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select category")} />
                          </SelectTrigger>
                          <SelectContent>
                            {menuCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price"><T text="Price" /></Label>
                        <Input id="price" type="number" step="0.01" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image"><T text="Image URL" /></Label>
                        <Input id="image" placeholder="/placeholder.svg" />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="description"><T text="Description" /></Label>
                        <Textarea 
                          id="description" 
                          placeholder={t("Enter food description")}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Not implemented",
                          description: "The add food feature is not implemented yet.",
                        });
                        setShowAddFoodDialog(false);
                      }}
                    >
                      <T text="Create Food Item" />
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          }
        />

        <MenuNav />

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search food items...")}
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSearchQuery("")}
            >
              <T text="All Categories" />
            </Button>
            {menuCategories.map((category) => (
              <Button 
                key={category.id} 
                variant="outline" 
                size="sm"
                onClick={() => setSearchQuery(category.name)}
              >
                <T text={category.name} />
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoodItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                <img 
                  src={item.image || "/placeholder.svg"} 
                  alt={item.name} 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <Badge variant="outline">{getCategoryName(item.categoryId)}</Badge>
                  </div>
                  <div className="text-lg font-bold">${item.price.toFixed(2)}</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium"><T text="Ingredients" /></h4>
                  <div className="flex flex-wrap gap-1">
                    {getItemIngredients(item.ingredients).map((ingredient, index) => (
                      ingredient && (
                        <Badge key={ingredient.id} variant="secondary" className="text-xs">
                          {ingredient.name}
                        </Badge>
                      )
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <T text="Cost" />: ${item.cost.toFixed(2)} | 
                    {item.price > 0 && (
                      <>
                        <T text="Margin" />: {Math.round((1 - (item.cost / item.price)) * 100)}%
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/menu/recipes?foodId=${item.id}`}>
                      <FilePen className="h-4 w-4 mr-2" />
                      <T text="Edit Recipe" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FoodManagement;
