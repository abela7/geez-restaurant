
import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { PlusCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface InventoryFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: {
    category: string;
    status: string;
    sortBy: string;
    view: string;
    pageSize: number;
  }) => void;
  categories: string[];
  initialFilters: {
    category: string;
    status: string;
    sortBy: string;
    view: string;
    pageSize: number;
  };
  onAddCategory?: (category: string) => Promise<void>;
}

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  open,
  onOpenChange,
  onApplyFilters,
  categories,
  initialFilters,
  onAddCategory
}) => {
  const { t } = useLanguage();
  const [category, setCategory] = React.useState(initialFilters.category);
  const [status, setStatus] = React.useState(initialFilters.status);
  const [sortBy, setSortBy] = React.useState(initialFilters.sortBy);
  const [view, setView] = React.useState(initialFilters.view);
  const [pageSize, setPageSize] = React.useState(initialFilters.pageSize);
  const [newCategory, setNewCategory] = React.useState("");
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const handleApply = () => {
    onApplyFilters({
      category,
      status,
      sortBy,
      view,
      pageSize
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setCategory("all");
    setStatus("all");
    setSortBy("name");
    setView("grid");
    setPageSize(10);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error(t("Category name cannot be empty"));
      return;
    }

    if (categories.some(c => c.toLowerCase() === newCategory.trim().toLowerCase())) {
      toast.error(t("Category already exists"));
      return;
    }

    setIsAddingCategory(true);
    try {
      if (onAddCategory) {
        await onAddCategory(newCategory.trim());
        setNewCategory("");
        setPopoverOpen(false);
        toast.success(t("Category added successfully"));
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(t("Failed to add category"));
    } finally {
      setIsAddingCategory(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle><T text="Filter Inventory" /></SheetTitle>
        </SheetHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label><T text="Category" /></Label>
              {onAddCategory && (
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      <T text="Add" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" side="bottom" align="end">
                    <div className="space-y-4">
                      <h4 className="font-medium"><T text="Add New Category" /></h4>
                      <div className="space-y-2">
                        <Label htmlFor="new-category"><T text="Category Name" /></Label>
                        <div className="flex gap-2">
                          <Input 
                            id="new-category"
                            value={newCategory} 
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder={t("Enter category name")}
                          />
                          <Button 
                            onClick={handleAddCategory}
                            disabled={isAddingCategory || !newCategory.trim()}
                          >
                            {isAddingCategory ? 
                              <T text="Adding..." /> : 
                              <T text="Add" />
                            }
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><T text="All Categories" /></SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label><T text="Stock Status" /></Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><T text="All Statuses" /></SelectItem>
                <SelectItem value="normal"><T text="Normal" /></SelectItem>
                <SelectItem value="low"><T text="Low" /></SelectItem>
                <SelectItem value="critical"><T text="Critical" /></SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label><T text="Sort By" /></Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder={t("Sort order")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name"><T text="Name (A-Z)" /></SelectItem>
                <SelectItem value="name-desc"><T text="Name (Z-A)" /></SelectItem>
                <SelectItem value="stock-low"><T text="Stock (Low-High)" /></SelectItem>
                <SelectItem value="stock-high"><T text="Stock (High-Low)" /></SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label><T text="Items Per Page" /></Label>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder={t("Items per page")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label><T text="View" /></Label>
            <RadioGroup value={view} onValueChange={setView} className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grid" id="grid" />
                <Label htmlFor="grid"><T text="Grid" /></Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="list" id="list" />
                <Label htmlFor="list"><T text="List" /></Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <SheetFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleReset}>
            <T text="Reset" />
          </Button>
          <Button onClick={handleApply}>
            <T text="Apply Filters" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
