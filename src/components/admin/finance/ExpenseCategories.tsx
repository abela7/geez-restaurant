
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Filter, Download, Calendar } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchExpenseCategories, 
  addExpenseCategory, 
  updateExpenseCategory, 
  deleteExpenseCategory,
  ExpenseCategory
} from "@/services/finance";
import { formatCategoriesForExport, exportToCSV } from "@/services/finance/exportService";
import { DateRangePicker } from "./DateRangePicker";
import CategoryGridView from "./CategoryGridView";
import ViewToggle from "./ViewToggle";

const categoryTypes = ["fixed", "variable", "operational", "discretionary"];

interface ExpenseCategoriesProps {
  editMode?: boolean;
}

type ViewMode = "list" | "grid";

const ExpenseCategories: React.FC<ExpenseCategoriesProps> = ({ editMode = false }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ExpenseCategory[]>([]);
  const [newCategory, setNewCategory] = useState<{ name: string; type: string; description: string }>({ 
    name: "", 
    type: "operational", 
    description: "" 
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined } | undefined>();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      applyFilters();
    }
  }, [categories, searchTerm, typeFilter, dateRange]);

  const applyFilters = () => {
    let filtered = [...categories];
    
    if (searchTerm) {
      filtered = filtered.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(cat => cat.type === typeFilter);
    }
    
    // Apply date range filter if set
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(cat => {
        const createdAt = cat.created_at ? new Date(cat.created_at) : null;
        if (!createdAt) return true;
        
        return createdAt >= dateRange.from && createdAt <= dateRange.to;
      });
    }
    
    setFilteredCategories(filtered);
  };

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchExpenseCategories();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "Failed to load expense categories. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name || !newCategory.type) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      await addExpenseCategory(newCategory);
      
      toast({
        title: "Success",
        description: "Category added successfully."
      });
      
      // Reload categories
      await loadCategories();
      
      // Reset form
      setNewCategory({ name: "", type: "operational", description: "" });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditCategory = async () => {
    try {
      if (editingCategory) {
        const { id, name, type, description } = editingCategory;
        
        if (!name || !type) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields.",
            variant: "destructive"
          });
          return;
        }

        await updateExpenseCategory(id, { name, type, description });
        
        toast({
          title: "Success",
          description: "Category updated successfully."
        });
        
        // Reload categories
        await loadCategories();
        setEditingCategory(null);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteExpenseCategory(id);
      
      toast({
        title: "Success",
        description: "Category deleted successfully."
      });
      
      // Update local state
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category. This category may be in use by existing expenses.",
        variant: "destructive"
      });
    }
  };

  const getCategoryTypeBadgeColor = (type: string) => {
    switch (type) {
      case "fixed": return "secondary";
      case "variable": return "default";
      case "operational": return "outline";
      case "discretionary": return "destructive";
      default: return "default";
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setDateRange(undefined);
  };

  const handleExportData = () => {
    const csvData = formatCategoriesForExport(filteredCategories);
    const filename = `expense_categories_${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCSV(csvData, filename);
    
    toast({
      title: "Export Complete",
      description: "Category data has been exported to CSV."
    });
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium"><T text="Expense Categories" /></h3>
        <div className="flex gap-2">
          {editMode && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  <T text="Add Category" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle><T text="Add Expense Category" /></DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name"><T text="Category Name" /></Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder={t("Enter category name")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type"><T text="Category Type" /></Label>
                    <Select 
                      value={newCategory.type} 
                      onValueChange={(value) => setNewCategory({...newCategory, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a type")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            <T text={type.charAt(0).toUpperCase() + type.slice(1)} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description"><T text="Description" /></Label>
                    <Input
                      id="description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      placeholder={t("Enter description")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    <T text="Cancel" />
                  </Button>
                  <Button onClick={handleAddCategory}>
                    <T text="Add Category" />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder={t("Search categories...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("All Types")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Types" /></SelectItem>
              {categoryTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  <T text={type.charAt(0).toUpperCase() + type.slice(1)} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DateRangePicker onDateRangeChange={setDateRange} className="w-[200px]" />
          
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData}
            disabled={filteredCategories.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            <T text="Export" />
          </Button>
          
          {(searchTerm || typeFilter !== "all" || dateRange) && (
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              <Filter className="mr-2 h-4 w-4" />
              <T text="Clear Filters" />
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-muted-foreground"><T text="Loading categories..." /></p>
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Category Name" /></TableHead>
                  <TableHead><T text="Type" /></TableHead>
                  <TableHead className="hidden md:table-cell"><T text="Description" /></TableHead>
                  {editMode && <TableHead className="text-right"><T text="Actions" /></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <Badge variant={getCategoryTypeBadgeColor(category.type)}>
                          {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{category.description || "-"}</TableCell>
                      {editMode && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setEditingCategory(category)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle><T text="Edit Expense Category" /></DialogTitle>
                                </DialogHeader>
                                {editingCategory && (
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-name"><T text="Category Name" /></Label>
                                      <Input
                                        id="edit-name"
                                        value={editingCategory.name}
                                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-type"><T text="Category Type" /></Label>
                                      <Select 
                                        value={editingCategory.type} 
                                        onValueChange={(value) => setEditingCategory({...editingCategory, type: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {categoryTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                              <T text={type.charAt(0).toUpperCase() + type.slice(1)} />
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-description"><T text="Description" /></Label>
                                      <Input
                                        id="edit-description"
                                        value={editingCategory.description || ""}
                                        onChange={(e) => setEditingCategory({
                                          ...editingCategory, 
                                          description: e.target.value
                                        })}
                                      />
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setEditingCategory(null)}>
                                    <T text="Cancel" />
                                  </Button>
                                  <Button onClick={handleEditCategory}>
                                    <T text="Save Changes" />
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={editMode ? 4 : 3} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p><T text="No categories found" /></p>
                        <p className="text-sm">
                          {searchTerm || typeFilter !== "all" || dateRange
                            ? <T text="Try adjusting your filters" />
                            : <T text="Add a new category to get started" />
                          }
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <CategoryGridView 
              categories={filteredCategories} 
              editMode={editMode} 
              onEdit={setEditingCategory} 
              onDelete={handleDeleteCategory} 
            />
          )}
        </>
      )}
    </Card>
  );
};

export default ExpenseCategories;
