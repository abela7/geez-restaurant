
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface InventoryFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: {
    category: string;
    status: string;
    sortBy: string;
    view: string;
  }) => void;
  categories: string[];
  initialFilters: {
    category: string;
    status: string;
    sortBy: string;
    view: string;
  };
}

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  open,
  onOpenChange,
  onApplyFilters,
  categories,
  initialFilters
}) => {
  const { t } = useLanguage();
  const [category, setCategory] = React.useState(initialFilters.category);
  const [status, setStatus] = React.useState(initialFilters.status);
  const [sortBy, setSortBy] = React.useState(initialFilters.sortBy);
  const [view, setView] = React.useState(initialFilters.view);

  const handleApply = () => {
    onApplyFilters({
      category,
      status,
      sortBy,
      view
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setCategory("all");
    setStatus("all");
    setSortBy("name");
    setView("grid");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle><T text="Filter Inventory" /></SheetTitle>
        </SheetHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label><T text="Category" /></Label>
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
