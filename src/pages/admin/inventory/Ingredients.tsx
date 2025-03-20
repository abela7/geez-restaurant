import React, { useState, useEffect } from "react";
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
  RefreshCw,
  Edit,
  Eye
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IngredientForm } from "@/components/inventory/IngredientForm";
import { useToast } from "@/components/ui/use-toast";
import { fetchStock, addStockItem, updateStockItem } from "@/services/inventory";
import { Ingredient } from "@/services/inventory/types";

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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Load ingredients data
  const loadIngredients = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStock();
      setIngredients(data);
    } catch (error) {
      console.error("Error loading ingredients:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load ingredients"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load ingredients on mount
  useEffect(() => {
    loadIngredients();
  }, []);

  // Handle adding a new ingredient
  const handleAddIngredient = async (data: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addStockItem(data);
      setIsAddDialogOpen(false);
      loadIngredients(); // Reload ingredients after adding
    } catch (error) {
      console.error("Error adding ingredient:", error);
      toast({
        title: t("Error"),
        description: t("Failed to add ingredient"),
        variant: "destructive",
      });
    }
  };

  // Handle updating an ingredient
  const handleUpdateIngredient = async (data: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>) => {
    if (!selectedIngredient) return;
    
    try {
      await updateStockItem(selectedIngredient.id, data);
      setIsEditDialogOpen(false);
      loadIngredients(); // Reload ingredients after updating
    } catch (error) {
      console.error("Error updating ingredient:", error);
      toast({
        title: t("Error"),
        description: t("Failed to update ingredient"),
        variant: "destructive",
      });
    }
  };

  // Open edit dialog for an ingredient
  const handleEditClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsEditDialogOpen(true);
  };

  // Open details dialog for an ingredient
  const handleDetailsClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsDetailsDialogOpen(true);
  };

  // Filter ingredients based on search term and category
  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === "All" || ingredient.category === selectedCategoryFilter;
    const matchesType = activeTab === "all" || 
                        (activeTab === "dry" && ingredient.type === "Dry") ||
                        (activeTab === "fresh" && ingredient.type === "Fresh") ||
                        (activeTab === "refrigerated" && ingredient.type === "Refrigerated") ||
                        (activeTab === "imported" && ingredient.origin !== "Local");
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <AppLayout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Ingredients" />}
          description={<T text="Manage ingredients used in recipes" />}
          actions={
            <>
              <Button variant="outline" size="sm" className="hidden md:flex" onClick={loadIngredients}>
                <RefreshCw className="mr-2 h-4 w-4" />
                <T text="Refresh" />
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <FileDown className="mr-2 h-4 w-4" />
                <T text="Export" />
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)}>
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
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3"><T text="Loading ingredients..." /></span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead><T text="Name" /></TableHead>
                        <TableHead><T text="Category" /></TableHead>
                        <TableHead><T text="Type" /></TableHead>
                        <TableHead><T text="Stock" /></TableHead>
                        <TableHead><T text="Cost" /></TableHead>
                        <TableHead className="text-right"><T text="Actions" /></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIngredients.length > 0 ? (
                        filteredIngredients.map((ingredient) => (
                          <TableRow key={ingredient.id}>
                            <TableCell className="font-medium">{ingredient.name}</TableCell>
                            <TableCell>{ingredient.category || "—"}</TableCell>
                            <TableCell>{ingredient.type || "—"}</TableCell>
                            <TableCell>
                              {ingredient.stock_quantity} {ingredient.unit}
                              {ingredient.reorder_level && ingredient.stock_quantity !== undefined && 
                               ingredient.stock_quantity <= (ingredient.reorder_level || 0) && (
                                <Badge variant="destructive" className="ml-2 text-xs">
                                  <T text="Low Stock" />
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {ingredient.cost ? `$${ingredient.cost.toFixed(2)}/${ingredient.unit}` : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditClick(ingredient)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                <T text="Edit" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDetailsClick(ingredient)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                <T text="Details" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            <T text="No ingredients found" />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="dry" className="mt-0">
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Name" /></TableHead>
                      <TableHead><T text="Category" /></TableHead>
                      <TableHead><T text="Stock" /></TableHead>
                      <TableHead><T text="Cost" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIngredients.length ? (
                      filteredIngredients.map((ingredient) => (
                        <TableRow key={ingredient.id}>
                          <TableCell className="font-medium">{ingredient.name}</TableCell>
                          <TableCell>{ingredient.category || "—"}</TableCell>
                          <TableCell>{ingredient.stock_quantity} {ingredient.unit}</TableCell>
                          <TableCell>{ingredient.cost ? `$${ingredient.cost.toFixed(2)}/${ingredient.unit}` : "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditClick(ingredient)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              <T text="Edit" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDetailsClick(ingredient)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              <T text="Details" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          <T text="No dry ingredients found" />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
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

      {/* Add Ingredient Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle><T text="Add New Ingredient" /></DialogTitle>
          </DialogHeader>
          <IngredientForm
            onSubmit={handleAddIngredient}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Ingredient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle><T text="Edit Ingredient" /></DialogTitle>
          </DialogHeader>
          {selectedIngredient && (
            <IngredientForm
              initialData={selectedIngredient}
              onSubmit={handleUpdateIngredient}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Ingredient Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle><T text="Ingredient Details" /></DialogTitle>
          </DialogHeader>
          {selectedIngredient && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground"><T text="Name" /></h3>
                  <p>{selectedIngredient.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground"><T text="Category" /></h3>
                  <p>{selectedIngredient.category || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground"><T text="Type" /></h3>
                  <p>{selectedIngredient.type || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground"><T text="Origin" /></h3>
                  <p>{selectedIngredient.origin || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground"><T text="Stock Quantity" /></h3>
                  <p>{selectedIngredient.stock_quantity} {selectedIngredient.unit}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground"><T text="Reorder Level" /></h3>
                  <p>{selectedIngredient.reorder_level || "—"} {selectedIngredient.unit}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground"><T text="Cost" /></h3>
                  <p>{selectedIngredient.cost ? `$${selectedIngredient.cost.toFixed(2)}/${selectedIngredient.unit}` : "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground"><T text="Supplier" /></h3>
                  <p>{selectedIngredient.supplier || "—"}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground"><T text="Allergens" /></h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedIngredient.allergens && selectedIngredient.allergens.length > 0 ? (
                    selectedIngredient.allergens.map(allergen => (
                      <Badge key={allergen} variant="outline">
                        {allergen}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground"><T text="None" /></p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground"><T text="Dietary Information" /></h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedIngredient.dietary && selectedIngredient.dietary.length > 0 ? (
                    selectedIngredient.dietary.map(diet => (
                      <Badge key={diet} variant="secondary">
                        {diet}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground"><T text="None" /></p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  onClick={() => handleEditClick(selectedIngredient)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <T text="Edit" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailsDialogOpen(false)}
                >
                  <T text="Close" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Ingredients;
