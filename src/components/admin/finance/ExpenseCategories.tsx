
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample expense categories data
const expenseCategoriesData = [
  { id: 1, name: "Staff Wages", type: "operational", description: "All staff-related costs including salaries, bonuses, and benefits" },
  { id: 2, name: "Rent", type: "fixed", description: "Monthly rental payment for restaurant premises" },
  { id: 3, name: "Ingredients", type: "variable", description: "Food ingredients for menu preparation" },
  { id: 4, name: "Utilities", type: "operational", description: "Electricity, water, gas, internet, etc." },
  { id: 5, name: "Maintenance", type: "operational", description: "Equipment maintenance and repairs" },
  { id: 6, name: "Marketing", type: "discretionary", description: "Advertising, promotions, and marketing campaigns" },
  { id: 7, name: "Licenses & Insurance", type: "fixed", description: "Business licenses, permits, and insurance premiums" },
  { id: 8, name: "Kitchen Supplies", type: "variable", description: "Non-food items used in food preparation" },
  { id: 9, name: "Transport", type: "variable", description: "Delivery, staff transport, and other vehicle expenses" },
];

interface ExpenseCategoriesProps {
  editMode?: boolean;
}

const ExpenseCategories: React.FC<ExpenseCategoriesProps> = ({ editMode = false }) => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState(expenseCategoriesData);
  const [newCategory, setNewCategory] = useState({ name: "", type: "operational", description: "" });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<null | typeof categories[0]>(null);

  const handleAddCategory = () => {
    setCategories([...categories, { ...newCategory, id: categories.length + 1 }]);
    setNewCategory({ name: "", type: "operational", description: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditCategory = () => {
    if (editingCategory) {
      setCategories(categories.map(cat => cat.id === editingCategory.id ? editingCategory : cat));
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
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

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium"><T text="Expense Categories" /></h3>
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
                    <SelectItem value="fixed"><T text="Fixed" /></SelectItem>
                    <SelectItem value="variable"><T text="Variable" /></SelectItem>
                    <SelectItem value="operational"><T text="Operational" /></SelectItem>
                    <SelectItem value="discretionary"><T text="Discretionary" /></SelectItem>
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
      </div>

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
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <Badge variant={getCategoryTypeBadgeColor(category.type)}>
                  {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{category.description}</TableCell>
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
                                  <SelectItem value="fixed"><T text="Fixed" /></SelectItem>
                                  <SelectItem value="variable"><T text="Variable" /></SelectItem>
                                  <SelectItem value="operational"><T text="Operational" /></SelectItem>
                                  <SelectItem value="discretionary"><T text="Discretionary" /></SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-description"><T text="Description" /></Label>
                              <Input
                                id="edit-description"
                                value={editingCategory.description}
                                onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
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
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ExpenseCategories;
