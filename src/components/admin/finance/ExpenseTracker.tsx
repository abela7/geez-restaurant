
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, Search, Package, ShoppingCart, Calendar, Download, Edit as EditIcon, List, Grid2X2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { 
  ExpenseCategory, 
  ExpenseWithCategory,
  Ingredient,
  fetchExpenses, 
  fetchExpenseCategories, 
  addExpense,
  updateExpense,
  deleteExpense,
} from "@/services/finance";
import { 
  fetchIngredients,
  updateIngredientQuantity,
  getCategoryIngredientMapping,
} from "@/services/finance/inventoryService";
import { formatExpensesForExport, exportToCSV } from "@/services/finance/exportService";
import { DateRangePicker } from "./DateRangePicker";
import ExpenseGridView from "./ExpenseGridView";
import ViewToggle from "./ViewToggle";

const paymentMethods = ["Cash", "Credit Card", "Bank Transfer", "Cheque", "Direct Debit"];

interface ExpenseTrackerProps {
  onExpenseAdded?: (expense: any) => void;
}

type ViewMode = "list" | "grid";

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ onExpenseAdded }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined } | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const categoryIngredientMapping = getCategoryIngredientMapping();
  
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category_id: "",
    amount: 0,
    payee: "",
    payment_method: "Bank Transfer",
    reference: "",
    description: "",
    ingredient_id: "",
    quantity: 0,
    unit: ""
  });

  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | null>(null);

  useEffect(() => {
    loadData();
  }, [searchTerm, categoryFilter, dateFilter, dateRange]);
  
  useEffect(() => {
    if (newExpense.category_id) {
      const selectedCategory = categories.find(cat => cat.id === newExpense.category_id);
      if (selectedCategory) {
        const ingredientCategory = categoryIngredientMapping[selectedCategory.name];
        if (ingredientCategory) {
          const filtered = ingredients.filter(ing => ing.category === ingredientCategory);
          setFilteredIngredients(filtered);
        } else {
          setFilteredIngredients([]);
        }
      }
    } else {
      setFilteredIngredients([]);
    }
  }, [newExpense.category_id, ingredients, categories]);

  useEffect(() => {
    if (newExpense.ingredient_id && ingredients.length > 0) {
      const ingredient = ingredients.find(ing => ing.id === newExpense.ingredient_id);
      if (ingredient) {
        setSelectedIngredient(ingredient);
        setNewExpense(prev => ({
          ...prev,
          unit: ingredient.unit
        }));
      }
    } else {
      setSelectedIngredient(null);
    }
  }, [newExpense.ingredient_id, ingredients]);

  // Similar effect for editing expense
  useEffect(() => {
    if (editingExpense?.category_id) {
      const selectedCategory = categories.find(cat => cat.id === editingExpense.category_id);
      if (selectedCategory) {
        const ingredientCategory = categoryIngredientMapping[selectedCategory.name];
        if (ingredientCategory) {
          const filtered = ingredients.filter(ing => ing.category === ingredientCategory);
          setFilteredIngredients(filtered);
        } else {
          setFilteredIngredients([]);
        }
      }
    }
  }, [editingExpense?.category_id, ingredients, categories]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Prepare date filters for the API
      let dateRangeFilter = undefined;
      if (dateRange?.from && dateRange?.to) {
        const fromDate = format(dateRange.from, "yyyy-MM-dd");
        const toDate = format(dateRange.to, "yyyy-MM-dd");
        dateRangeFilter = { from: fromDate, to: toDate };
      }

      const [fetchedExpenses, fetchedCategories, fetchedIngredients] = await Promise.all([
        fetchExpenses(searchTerm, categoryFilter, dateFilter, dateRangeFilter),
        fetchExpenseCategories(),
        fetchIngredients()
      ]);
      setExpenses(fetchedExpenses);
      setCategories(fetchedCategories);
      setIngredients(fetchedIngredients);
    } catch (error) {
      console.error("Error loading expense data:", error);
      toast({
        title: "Error",
        description: "Failed to load expense data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async () => {
    try {
      if (!newExpense.category_id || newExpense.amount <= 0 || !newExpense.payee) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      const dateWithTime = new Date(newExpense.date);
      
      const expenseData = {
        ...newExpense,
        date: dateWithTime.toISOString(),
        ingredient_id: newExpense.ingredient_id || null,
        quantity: newExpense.quantity || null,
        unit: newExpense.unit || null
      };
      
      const addedExpense = await addExpense(expenseData);
      
      if (addedExpense.ingredient_id && addedExpense.quantity) {
        await updateIngredientQuantity(addedExpense.ingredient_id, addedExpense.quantity);
        toast({
          title: "Inventory Updated",
          description: `Added ${addedExpense.quantity} ${addedExpense.unit} to inventory.`
        });
      }
      
      toast({
        title: "Success",
        description: "Expense added successfully."
      });
      
      await loadData();
      
      if (onExpenseAdded) {
        onExpenseAdded(addedExpense);
      }
      
      resetExpenseForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditExpense = async () => {
    try {
      if (!editingExpense || !editingExpense.category_id || editingExpense.amount <= 0 || !editingExpense.payee) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      // Create a copy without the 'category' field since it's not part of the DB table schema
      const { category, ...expenseToUpdate } = editingExpense;
      
      const updatedExpense = await updateExpense(editingExpense.id, expenseToUpdate);
      
      toast({
        title: "Success",
        description: "Expense updated successfully."
      });
      
      await loadData();
      
      setEditingExpense(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      toast({
        title: "Success",
        description: "Expense deleted successfully."
      });
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setDateFilter("All");
    setDateRange(undefined);
  };

  const handleExportData = () => {
    const csvData = formatExpensesForExport(expenses);
    const filename = `expenses_export_${format(new Date(), "yyyy-MM-dd")}.csv`;
    exportToCSV(csvData, filename);
    
    toast({
      title: "Export Complete",
      description: "Expense data has been exported to CSV."
    });
  };

  const resetExpenseForm = () => {
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category_id: "",
      amount: 0,
      payee: "",
      payment_method: "Bank Transfer",
      reference: "",
      description: "",
      ingredient_id: "",
      quantity: 0,
      unit: ""
    });
    setSelectedIngredient(null);
  };

  const handleEditClick = (expense: ExpenseWithCategory) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);

  const showIngredientFields = (categoryId?: string): boolean => {
    const catId = categoryId || newExpense.category_id;
    if (!catId) return false;
    
    const selectedCategory = categories.find(cat => cat.id === catId);
    if (!selectedCategory) return false;
    
    return categoryIngredientMapping[selectedCategory.name] !== undefined;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search expenses...")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("All Categories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All"><T text="All Categories" /></SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={t("Date Range")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All"><T text="All Time" /></SelectItem>
              <SelectItem value="Today"><T text="Today" /></SelectItem>
              <SelectItem value="This Week"><T text="This Week" /></SelectItem>
              <SelectItem value="This Month"><T text="This Month" /></SelectItem>
            </SelectContent>
          </Select>
          
          <DateRangePicker onDateRangeChange={setDateRange} className="w-[200px]" />
          
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-2" />
            <T text="Clear" />
          </Button>
          
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          
          <Button variant="outline" onClick={handleExportData} disabled={expenses.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            <T text="Export" />
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              <T text="Add Expense" />
            </Button>
            <DialogContent className="max-w-md h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle><T text="Add New Expense" /></DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="flex-1 pr-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date"><T text="Date" /></Label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="date"
                          type="date"
                          className="pl-8"
                          value={newExpense.date}
                          onChange={(e) => {
                            setNewExpense({
                              ...newExpense, 
                              date: e.target.value
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount"><T text="Amount (£)" /></Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={newExpense.amount === 0 ? "" : newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category"><T text="Category" /></Label>
                    <Select 
                      value={newExpense.category_id} 
                      onValueChange={(value) => setNewExpense({...newExpense, category_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a category")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="payee"><T text="Payee" /></Label>
                    <Input
                      id="payee"
                      placeholder={t("Who was paid")}
                      value={newExpense.payee}
                      onChange={(e) => setNewExpense({...newExpense, payee: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="payment-method"><T text="Payment Method" /></Label>
                    <Select 
                      value={newExpense.payment_method} 
                      onValueChange={(value) => setNewExpense({...newExpense, payment_method: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {showIngredientFields() && (
                    <>
                      <div className="mt-2 mb-1">
                        <h3 className="font-medium flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          <T text="Inventory Information" />
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          <T text="Link this expense to inventory items" />
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="ingredient"><T text="Ingredient" /></Label>
                        <Select 
                          value={newExpense.ingredient_id} 
                          onValueChange={(value) => setNewExpense({...newExpense, ingredient_id: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select an ingredient")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=""><T text="None" /></SelectItem>
                            {filteredIngredients.map((ingredient) => (
                              <SelectItem key={ingredient.id} value={ingredient.id}>
                                {ingredient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedIngredient && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="quantity"><T text="Quantity" /></Label>
                            <Input
                              id="quantity"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={newExpense.quantity === 0 ? "" : newExpense.quantity}
                              onChange={(e) => setNewExpense({
                                ...newExpense, 
                                quantity: parseFloat(e.target.value) || 0
                              })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="unit"><T text="Unit" /></Label>
                            <Input
                              id="unit"
                              value={newExpense.unit}
                              readOnly
                              className="bg-muted"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="grid gap-2">
                    <Label htmlFor="reference"><T text="Reference" /></Label>
                    <Input
                      id="reference"
                      placeholder={t("Invoice or reference number")}
                      value={newExpense.reference}
                      onChange={(e) => setNewExpense({...newExpense, reference: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description"><T text="Description" /></Label>
                    <Textarea
                      id="description"
                      placeholder={t("Expense details")}
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    />
                  </div>
                </div>
              </ScrollArea>
              
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  <T text="Cancel" />
                </Button>
                <Button 
                  onClick={handleAddExpense} 
                  disabled={!newExpense.category_id || newExpense.amount <= 0 || !newExpense.payee}
                >
                  <T text="Add Expense" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Expense Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle><T text="Edit Expense" /></DialogTitle>
              </DialogHeader>
              
              {editingExpense && (
                <ScrollArea className="flex-1 pr-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-date"><T text="Date" /></Label>
                        <div className="relative">
                          <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="edit-date"
                            type="date"
                            className="pl-8"
                            value={new Date(editingExpense.date).toISOString().split('T')[0]}
                            onChange={(e) => {
                              setEditingExpense({
                                ...editingExpense, 
                                date: new Date(e.target.value).toISOString()
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-amount"><T text="Amount (£)" /></Label>
                        <Input
                          id="edit-amount"
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          value={editingExpense.amount}
                          onChange={(e) => setEditingExpense({
                            ...editingExpense, 
                            amount: parseFloat(e.target.value) || 0
                          })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-category"><T text="Category" /></Label>
                      <Select 
                        value={editingExpense.category_id} 
                        onValueChange={(value) => setEditingExpense({...editingExpense, category_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select a category")} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-payee"><T text="Payee" /></Label>
                      <Input
                        id="edit-payee"
                        placeholder={t("Who was paid")}
                        value={editingExpense.payee}
                        onChange={(e) => setEditingExpense({...editingExpense, payee: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-payment-method"><T text="Payment Method" /></Label>
                      <Select 
                        value={editingExpense.payment_method} 
                        onValueChange={(value) => setEditingExpense({...editingExpense, payment_method: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-reference"><T text="Reference" /></Label>
                      <Input
                        id="edit-reference"
                        placeholder={t("Invoice or reference number")}
                        value={editingExpense.reference || ""}
                        onChange={(e) => setEditingExpense({...editingExpense, reference: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-description"><T text="Description" /></Label>
                      <Textarea
                        id="edit-description"
                        placeholder={t("Expense details")}
                        value={editingExpense.description || ""}
                        onChange={(e) => setEditingExpense({...editingExpense, description: e.target.value})}
                      />
                    </div>
                  </div>
                </ScrollArea>
              )}
              
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  <T text="Cancel" />
                </Button>
                <Button 
                  onClick={handleEditExpense} 
                  disabled={!editingExpense?.category_id || (editingExpense?.amount || 0) <= 0 || !editingExpense?.payee}
                >
                  <T text="Save Changes" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground"><T text="Loading expenses..." /></p>
          </div>
        ) : (
          <>
            {viewMode === "list" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Date" /></TableHead>
                    <TableHead><T text="Category" /></TableHead>
                    <TableHead><T text="Amount" /></TableHead>
                    <TableHead className="hidden md:table-cell"><T text="Payee" /></TableHead>
                    <TableHead className="hidden md:table-cell"><T text="Payment Method" /></TableHead>
                    <TableHead className="hidden lg:table-cell"><T text="Inventory Item" /></TableHead>
                    <TableHead className="hidden lg:table-cell"><T text="Description" /></TableHead>
                    <TableHead className="text-right"><T text="Actions" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.length > 0 ? (
                    expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{format(parseISO(expense.date), "dd MMM yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category?.name || "Uncategorized"}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">£{parseFloat(expense.amount.toString()).toFixed(2)}</TableCell>
                        <TableCell className="hidden md:table-cell">{expense.payee}</TableCell>
                        <TableCell className="hidden md:table-cell">{expense.payment_method}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {expense.ingredient_id ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              {expense.quantity} {expense.unit}
                            </Badge>
                          ) : "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell max-w-[200px] truncate">{expense.description || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(expense)}>
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <p><T text="No expenses found" /></p>
                          <p className="text-sm"><T text="Try adjusting your filters or add a new expense" /></p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={2} className="text-right font-bold"><T text="Total:" /></TableHead>
                    <TableHead className="font-bold">£{totalExpenses.toFixed(2)}</TableHead>
                    <TableHead colSpan={5}></TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            ) : (
              expenses.length > 0 ? (
                <ExpenseGridView 
                  expenses={expenses} 
                  onEdit={handleEditClick} 
                  onDelete={handleDeleteExpense} 
                />
              ) : (
                <div className="h-32 text-center flex flex-col items-center justify-center">
                  <p className="text-muted-foreground"><T text="No expenses found" /></p>
                  <p className="text-sm text-muted-foreground"><T text="Try adjusting your filters or add a new expense" /></p>
                </div>
              )
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default ExpenseTracker;
