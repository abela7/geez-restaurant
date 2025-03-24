
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuNav } from "@/components/menu/MenuNav";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Pencil, Trash2, AlertCircle, Calendar, Download, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import ViewToggle from "@/components/admin/finance/ViewToggle";
import { format, parseISO } from "date-fns";

// Interface for measurement unit
export interface MeasurementUnit {
  id: string;
  name: string;
  abbreviation: string;
  type: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Interface for recipe ingredient
interface RecipeIngredient {
  id: string;
  name: string;
  category: string;
  unit_id: string;
  cost_per_unit: number;
  stock_quantity?: number;
  reorder_level?: number;
  is_allergen?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Interface for Ingredient Expense
interface IngredientExpense {
  id: string;
  ingredient_id: string;
  ingredient_name?: string;
  unit_id: string;
  unit_name?: string;
  unit_abbreviation?: string;
  quantity: number;
  price_per_unit: number;
  total_cost: number;
  supplier: string;
  purchase_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const IngredientExpenses = () => {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState<IngredientExpense[]>([]);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editingExpense, setEditingExpense] = useState<IngredientExpense | null>(null);
  const [formData, setFormData] = useState({
    ingredient_id: "",
    unit_id: "",
    quantity: 1,
    price_per_unit: 0,
    total_cost: 0,
    supplier: "",
    purchase_date: new Date().toISOString().split('T')[0],
    notes: "",
  });

  useEffect(() => {
    loadUnits();
    loadIngredients();
    loadExpenses();
  }, []);

  useEffect(() => {
    // Calculate total cost when quantity or price changes
    const total = formData.quantity * formData.price_per_unit;
    setFormData(prev => ({
      ...prev,
      total_cost: parseFloat(total.toFixed(2))
    }));
  }, [formData.quantity, formData.price_per_unit]);

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
    }
  };

  const loadIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from("recipe_ingredients")
        .select("id, name, category, unit_id, cost_per_unit, stock_quantity, reorder_level, is_allergen, created_at, updated_at");

      if (error) throw error;
      
      // Ensure the data matches our RecipeIngredient interface
      const formattedIngredients = data?.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category || '',
        unit_id: item.unit_id,
        cost_per_unit: item.cost_per_unit || 0,
        stock_quantity: item.stock_quantity,
        reorder_level: item.reorder_level,
        is_allergen: item.is_allergen,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [];
      
      setIngredients(formattedIngredients);
    } catch (error) {
      console.error("Error loading ingredients:", error);
      toast.error("Failed to load ingredients");
    }
  };

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ingredient_expenses")
        .select(`
          *,
          recipe_ingredients!ingredient_id(id, name, category),
          measurement_units!unit_id(id, name, abbreviation, type)
        `)
        .order("purchase_date", { ascending: false });

      if (error) throw error;
      
      // Format the data for display
      const formattedData = data.map(expense => ({
        ...expense,
        ingredient_name: expense.recipe_ingredients?.name || "Unknown",
        unit_name: expense.measurement_units?.name || "Unknown",
        unit_abbreviation: expense.measurement_units?.abbreviation || "",
      })) as IngredientExpense[];
      
      setExpenses(formattedData);
    } catch (error) {
      console.error("Error loading ingredient expenses:", error);
      toast.error("Failed to load ingredient expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value ? parseFloat(e.target.value) : 0;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If changing ingredient, update the unit and price
    if (name === "ingredient_id") {
      const selectedIngredient = ingredients.find(i => i.id === value);
      if (selectedIngredient) {
        setFormData(prev => ({
          ...prev,
          unit_id: selectedIngredient.unit_id,
          price_per_unit: selectedIngredient.cost_per_unit
        }));
      }
    }
  };

  const handleEditExpense = (expense: IngredientExpense) => {
    setEditingExpense(expense);
    setFormData({
      ingredient_id: expense.ingredient_id,
      unit_id: expense.unit_id,
      quantity: expense.quantity,
      price_per_unit: expense.price_per_unit,
      total_cost: expense.total_cost,
      supplier: expense.supplier,
      purchase_date: expense.purchase_date.split('T')[0],
      notes: expense.notes || "",
    });
    setOpenDialog(true);
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setFormData({
      ingredient_id: "",
      unit_id: "",
      quantity: 1,
      price_per_unit: 0,
      total_cost: 0,
      supplier: "",
      purchase_date: new Date().toISOString().split('T')[0],
      notes: "",
    });
    setOpenDialog(true);
  };

  const saveExpense = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!formData.ingredient_id || !formData.unit_id || !formData.purchase_date || !formData.supplier) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (formData.quantity <= 0 || formData.price_per_unit < 0) {
        toast.error("Please enter valid quantity and price values");
        return;
      }

      if (editingExpense) {
        // Update existing expense
        const { error } = await supabase
          .from("ingredient_expenses")
          .update({
            ingredient_id: formData.ingredient_id,
            unit_id: formData.unit_id,
            quantity: formData.quantity,
            price_per_unit: formData.price_per_unit,
            total_cost: formData.total_cost,
            supplier: formData.supplier,
            purchase_date: formData.purchase_date,
            notes: formData.notes || null,
          })
          .eq("id", editingExpense.id);

        if (error) throw error;
        
        // Also update the ingredient cost_per_unit to keep it up to date
        const { error: updateError } = await supabase
          .from("recipe_ingredients")
          .update({
            cost_per_unit: formData.price_per_unit
          })
          .eq("id", formData.ingredient_id);
          
        if (updateError) console.error("Error updating ingredient cost:", updateError);
        
        toast.success("Expense updated successfully");
      } else {
        // Create new expense
        const { error } = await supabase
          .from("ingredient_expenses")
          .insert([{
            ingredient_id: formData.ingredient_id,
            unit_id: formData.unit_id,
            quantity: formData.quantity,
            price_per_unit: formData.price_per_unit,
            total_cost: formData.total_cost,
            supplier: formData.supplier,
            purchase_date: formData.purchase_date,
            notes: formData.notes || null,
          }]);

        if (error) throw error;
        
        // Also update the ingredient cost_per_unit to keep it up to date
        const { error: updateError } = await supabase
          .from("recipe_ingredients")
          .update({
            cost_per_unit: formData.price_per_unit
          })
          .eq("id", formData.ingredient_id);
          
        if (updateError) console.error("Error updating ingredient cost:", updateError);
        
        toast.success("Expense added successfully");
      }

      // Reload expenses and close dialog
      await loadExpenses();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm(t("Are you sure you want to delete this expense?"))) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("ingredient_expenses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Expense deleted successfully");
      await loadExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  // Filter expenses based on search query
  const filteredExpenses = expenses.filter(
    expense =>
      expense.ingredient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (expense.notes && expense.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Ingredient Expenses" />}
        description={<T text="Track expenses for all recipe ingredients" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button onClick={handleAddExpense}>
              <Plus className="h-4 w-4 mr-2" />
              <T text="Add Expense" />
            </Button>
          </>
        }
      />

      <MenuNav />

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 mt-6">
        <div className="relative flex-1">
          <Input
            placeholder={t("Search expenses...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={filteredExpenses.length === 0}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <T text="Date Range" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            disabled={filteredExpenses.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            <T text="Export" />
          </Button>
          
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          
          {searchQuery && (
            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
              <Filter className="mr-2 h-4 w-4" />
              <T text="Clear Filter" />
            </Button>
          )}
        </div>
      </div>

      {loading && !expenses.length ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {filteredExpenses.length === 0 ? (
            <Card className="bg-muted/40">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  <T text="No Expenses Found" />
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  <T text="You haven't added any ingredient expenses yet. Tracking ingredient expenses helps calculate accurate recipe costs." />
                </p>
                <Button onClick={handleAddExpense}>
                  <Plus className="h-4 w-4 mr-2" />
                  <T text="Add Your First Expense" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              {viewMode === "list" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Ingredient" /></TableHead>
                      <TableHead><T text="Quantity" /></TableHead>
                      <TableHead><T text="Price/Unit" /></TableHead>
                      <TableHead><T text="Total Cost" /></TableHead>
                      <TableHead><T text="Supplier" /></TableHead>
                      <TableHead><T text="Date" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.ingredient_name}</TableCell>
                        <TableCell>
                          {expense.quantity} {expense.unit_abbreviation}
                        </TableCell>
                        <TableCell>£{expense.price_per_unit.toFixed(2)}/{expense.unit_abbreviation}</TableCell>
                        <TableCell>£{expense.total_cost.toFixed(2)}</TableCell>
                        <TableCell>{expense.supplier}</TableCell>
                        <TableCell>{format(parseISO(expense.purchase_date), "dd MMM yyyy")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditExpense(expense)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteExpense(expense.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {filteredExpenses.map(expense => (
                    <Card key={expense.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base font-medium">{expense.ingredient_name}</CardTitle>
                          <Badge variant="outline">{format(parseISO(expense.purchase_date), "dd MMM yyyy")}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-2xl font-bold">£{expense.total_cost.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground">{expense.supplier}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{expense.quantity} {expense.unit_abbreviation}</span>
                          <span>@ £{expense.price_per_unit.toFixed(2)}/{expense.unit_abbreviation}</span>
                        </div>
                        {expense.notes && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {expense.notes}
                          </p>
                        )}
                      </CardContent>
                      <div className="p-4 pt-0 flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditExpense(expense)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          <T text="Edit" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <T text="Delete" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          )}
        </>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? <T text="Edit Expense" /> : <T text="Add Ingredient Expense" />}
            </DialogTitle>
            <DialogDescription>
              <T text="Track expenses for ingredients to calculate accurate recipe costs" />
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ingredient_id"><T text="Ingredient" /></Label>
              <Select
                value={formData.ingredient_id}
                onValueChange={handleSelectChange("ingredient_id")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Select an ingredient")} />
                </SelectTrigger>
                <SelectContent>
                  {ingredients.map(ingredient => (
                    <SelectItem key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity"><T text="Quantity" /></Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.quantity}
                  onChange={handleNumberChange("quantity")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit_id"><T text="Unit" /></Label>
                <Select
                  value={formData.unit_id}
                  onValueChange={handleSelectChange("unit_id")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select a unit")} />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} ({unit.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_per_unit"><T text="Price per Unit (£)" /></Label>
                <Input
                  id="price_per_unit"
                  name="price_per_unit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_per_unit}
                  onChange={handleNumberChange("price_per_unit")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_cost"><T text="Total Cost (£)" /></Label>
                <Input
                  id="total_cost"
                  name="total_cost"
                  type="number"
                  value={formData.total_cost}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier"><T text="Supplier" /></Label>
                <Input
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder={t("Enter supplier name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_date"><T text="Purchase Date" /></Label>
                <Input
                  id="purchase_date"
                  name="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes"><T text="Notes (Optional)" /></Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder={t("Enter any additional notes")}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={saveExpense} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingExpense ? <T text="Update Expense" /> : <T text="Add Expense" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IngredientExpenses;
