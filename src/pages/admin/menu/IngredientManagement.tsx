
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuNav } from "@/components/menu/MenuNav";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  Plus, 
  Filter, 
  Search, 
  Edit, 
  Trash2, 
  ShoppingCart,
  AlertCircle,
  Beef,
  Carrot,
  Egg
} from "lucide-react";
import { Link } from "react-router-dom";
import ViewToggle from "@/components/admin/finance/ViewToggle";
import { MeasurementUnit } from "./UnitManagement";

interface Ingredient {
  id: string;
  name: string;
  description: string | null;
  category: string;
  unit_id: string;
  cost_per_unit: number;
  stock_quantity: number;
  reorder_level: number | null;
  is_allergen: boolean;
  created_at: string;
  updated_at: string;
  units?: MeasurementUnit;
}

const IngredientManagement = () => {
  const { t } = useLanguage();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "protein",
    unit_id: "",
    cost_per_unit: 0,
    stock_quantity: 0,
    reorder_level: 0,
    is_allergen: false
  });

  // Categories for ingredients
  const categories = [
    { value: "protein", label: "Protein", icon: <Beef className="h-4 w-4 mr-2" /> },
    { value: "produce", label: "Produce", icon: <Carrot className="h-4 w-4 mr-2" /> },
    { value: "dairy", label: "Dairy", icon: <Egg className="h-4 w-4 mr-2" /> },
    { value: "grain", label: "Grain" },
    { value: "seasoning", label: "Seasoning" },
    { value: "sauce", label: "Sauce" },
    { value: "oil", label: "Oil" },
    { value: "misc", label: "Miscellaneous" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadIngredients(), loadUnits()]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load ingredient data");
    } finally {
      setLoading(false);
    }
  };

  const loadIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from("recipe_ingredients_extended")
        .select("*");

      if (error) throw error;
      setIngredients(data || []);
    } catch (error) {
      console.error("Error loading ingredients:", error);
      toast.error("Failed to load ingredients");
      throw error;
    }
  };

  const loadUnits = async () => {
    try {
      const { data, error } = await supabase
        .from("measurement_units")
        .select("*")
        .order("type")
        .order("name");

      if (error) throw error;
      setUnits(data || []);
    } catch (error) {
      console.error("Error loading measurement units:", error);
      toast.error("Failed to load measurement units");
      throw error;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIngredient = () => {
    setEditingIngredient(null);
    setFormData({
      name: "",
      description: "",
      category: "protein",
      unit_id: "",
      cost_per_unit: 0,
      stock_quantity: 0,
      reorder_level: 0,
      is_allergen: false
    });
    setOpenDialog(true);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      description: ingredient.description || "",
      category: ingredient.category,
      unit_id: ingredient.unit_id,
      cost_per_unit: ingredient.cost_per_unit,
      stock_quantity: ingredient.stock_quantity,
      reorder_level: ingredient.reorder_level || 0,
      is_allergen: ingredient.is_allergen
    });
    setOpenDialog(true);
  };

  const saveIngredient = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!formData.name || !formData.unit_id) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (formData.cost_per_unit < 0) {
        toast.error("Cost cannot be negative");
        return;
      }

      if (editingIngredient) {
        // Update existing ingredient
        const { error } = await supabase
          .from("recipe_ingredients")
          .update({
            name: formData.name,
            description: formData.description || null,
            category: formData.category,
            unit_id: formData.unit_id,
            cost_per_unit: formData.cost_per_unit,
            stock_quantity: formData.stock_quantity,
            reorder_level: formData.reorder_level || null,
            is_allergen: formData.is_allergen
          })
          .eq("id", editingIngredient.id);

        if (error) throw error;
        toast.success("Ingredient updated successfully");
      } else {
        // Create new ingredient
        const { error } = await supabase
          .from("recipe_ingredients")
          .insert([
            {
              name: formData.name,
              description: formData.description || null,
              category: formData.category,
              unit_id: formData.unit_id,
              cost_per_unit: formData.cost_per_unit,
              stock_quantity: formData.stock_quantity,
              reorder_level: formData.reorder_level || null,
              is_allergen: formData.is_allergen
            }
          ]);

        if (error) throw error;
        toast.success("Ingredient added successfully");
      }

      // Reload ingredients and close dialog
      await loadIngredients();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving ingredient:", error);
      toast.error("Failed to save ingredient");
    } finally {
      setLoading(false);
    }
  };

  const deleteIngredient = async (id: string) => {
    if (!confirm(t("Are you sure you want to delete this ingredient?"))) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("recipe_ingredients")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Ingredient deleted successfully");
      await loadIngredients();
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      toast.error("Failed to delete ingredient. It may be in use by recipes.");
    } finally {
      setLoading(false);
    }
  };

  // Filter ingredients based on search query and active category
  const filteredIngredients = ingredients.filter(
    ingredient =>
      (activeCategory === "all" || ingredient.category === activeCategory) &&
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get unit name by ID
  const getUnitName = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    return unit ? `${unit.name} (${unit.abbreviation})` : "Unknown";
  };

  // Get unit abbreviation by ID
  const getUnitAbbreviation = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.abbreviation : "";
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Ingredient Management" />}
        description={<T text="Manage ingredients for recipes and track costs" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/menu/units">
                <T text="Manage Units" />
              </Link>
            </Button>
            <Button onClick={handleAddIngredient}>
              <Plus className="h-4 w-4 mr-2" />
              <T text="Add Ingredient" />
            </Button>
          </>
        }
      />

      <MenuNav />

      <div className="mb-6 mt-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search ingredients...")}
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle
            currentView={viewMode}
            onViewChange={setViewMode}
          />
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        value={activeCategory}
        onValueChange={setActiveCategory} 
        className="mb-6"
      >
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="all">
            <T text="All Ingredients" />
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.icon}
              <T text={category.label} />
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory}>
          {loading && !ingredients.length ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {filteredIngredients.length === 0 ? (
                <Card className="bg-muted/40">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      <T text="No Ingredients Found" />
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      {activeCategory === "all" ? (
                        <T text="You haven't added any ingredients yet. Add ingredients to track costs for your recipes." />
                      ) : (
                        <T text="No ingredients found in this category. Try another category or add a new ingredient." />
                      )}
                    </p>
                    <Button onClick={handleAddIngredient}>
                      <Plus className="h-4 w-4 mr-2" />
                      <T text="Add Ingredient" />
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIngredients.map(ingredient => (
                      <Card key={ingredient.id} className="flex flex-col overflow-hidden">
                        <CardContent className="p-6 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{ingredient.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {categories.find(cat => cat.value === ingredient.category)?.label || ingredient.category}
                              </p>
                            </div>
                            {ingredient.is_allergen && (
                              <Badge variant="destructive">
                                <T text="Allergen" />
                              </Badge>
                            )}
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground"><T text="Unit" /></span>
                              <span className="font-medium">{getUnitName(ingredient.unit_id)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground"><T text="Cost" /></span>
                              <span className="font-medium">£{ingredient.cost_per_unit.toFixed(2)}/{getUnitAbbreviation(ingredient.unit_id)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground"><T text="Stock" /></span>
                              <span className="font-medium">{ingredient.stock_quantity} {getUnitAbbreviation(ingredient.unit_id)}</span>
                            </div>
                            {ingredient.reorder_level && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground"><T text="Reorder Level" /></span>
                                <span className="font-medium">{ingredient.reorder_level} {getUnitAbbreviation(ingredient.unit_id)}</span>
                              </div>
                            )}
                          </div>
                          
                          {ingredient.description && (
                            <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                              {ingredient.description}
                            </p>
                          )}
                          
                          <div className="mt-4 flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditIngredient(ingredient)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              <T text="Edit" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteIngredient(ingredient.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <T text="Delete" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <div className="rounded-md border">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              <T text="Name" />
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              <T text="Category" />
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              <T text="Unit" />
                            </th>
                            <th className="h-12 px-4 text-right align-middle font-medium">
                              <T text="Cost per Unit" />
                            </th>
                            <th className="h-12 px-4 text-right align-middle font-medium">
                              <T text="Stock" />
                            </th>
                            <th className="h-12 px-4 text-right align-middle font-medium">
                              <T text="Actions" />
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {filteredIngredients.map(ingredient => (
                            <tr 
                              key={ingredient.id} 
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              <td className="p-4 align-middle">
                                <div className="flex items-center">
                                  <span className="font-medium">{ingredient.name}</span>
                                  {ingredient.is_allergen && (
                                    <Badge variant="destructive" className="ml-2">
                                      <T text="Allergen" />
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 align-middle">
                                {categories.find(cat => cat.value === ingredient.category)?.label || ingredient.category}
                              </td>
                              <td className="p-4 align-middle">
                                {getUnitName(ingredient.unit_id)}
                              </td>
                              <td className="p-4 align-middle text-right">
                                £{ingredient.cost_per_unit.toFixed(2)}/{getUnitAbbreviation(ingredient.unit_id)}
                              </td>
                              <td className="p-4 align-middle text-right">
                                {ingredient.stock_quantity} {getUnitAbbreviation(ingredient.unit_id)}
                                {ingredient.reorder_level && ingredient.stock_quantity <= ingredient.reorder_level && (
                                  <Badge variant="outline" className="ml-2 text-amber-500 border-amber-500">
                                    <T text="Low" />
                                  </Badge>
                                )}
                              </td>
                              <td className="p-4 align-middle text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleEditIngredient(ingredient)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => deleteIngredient(ingredient.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingIngredient ? <T text="Edit Ingredient" /> : <T text="Add New Ingredient" />}
            </DialogTitle>
            <DialogDescription>
              <T text="Add ingredient details including cost for accurate recipe pricing." />
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name"><T text="Ingredient Name" /> *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t("e.g., Beef, Tomato")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category"><T text="Category" /> *</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleSelectChange("category")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select a category")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {t(category.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit_id"><T text="Measurement Unit" /> *</Label>
                <Select
                  value={formData.unit_id}
                  onValueChange={handleSelectChange("unit_id")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select a unit")} />
                  </SelectTrigger>
                  <SelectContent>
                    {units.length === 0 ? (
                      <SelectItem value="no-units" disabled>
                        <T text="No units available. Please add units first." />
                      </SelectItem>
                    ) : (
                      units.map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} ({unit.abbreviation})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost_per_unit"><T text="Cost per Unit" /> *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">£</span>
                  <Input
                    id="cost_per_unit"
                    name="cost_per_unit"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost_per_unit}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock_quantity"><T text="Current Stock" /></Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorder_level"><T text="Reorder Level" /></Label>
                <Input
                  id="reorder_level"
                  name="reorder_level"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.reorder_level}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description"><T text="Description (Optional)" /></Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t("Additional details about this ingredient")}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="is_allergen"
                checked={formData.is_allergen}
                onChange={(e) => handleSwitchChange("is_allergen")(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="is_allergen">
                <T text="This is an allergen (requires special handling)" />
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={saveIngredient} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingIngredient ? <T text="Update Ingredient" /> : <T text="Add Ingredient" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IngredientManagement;
