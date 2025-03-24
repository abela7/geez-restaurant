import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IngredientExpense, MeasurementUnit, RecipeIngredient } from "@/components/admin/menu/ingredients/types";

export const useIngredientExpenses = () => {
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
    if (!confirm("Are you sure you want to delete this expense?")) return;

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

  return {
    expenses,
    ingredients,
    units,
    loading,
    searchQuery,
    setSearchQuery,
    openDialog,
    setOpenDialog,
    viewMode,
    setViewMode,
    editingExpense,
    formData,
    filteredExpenses,
    handleInputChange,
    handleNumberChange,
    handleSelectChange,
    handleEditExpense,
    handleAddExpense,
    saveExpense,
    deleteExpense,
  };
};
