
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Search, X, SlidersHorizontal, Filter } from "lucide-react";

interface InventoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
  onClearFilters: () => void;
  onOpenAdvancedFilters?: () => void;
  categories: string[];
  showStatus?: boolean;
}

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter = "all",
  onStatusChange,
  onClearFilters,
  onOpenAdvancedFilters,
  categories,
  showStatus = true
}) => {
  const { t } = useLanguage();

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("Search inventory...")}
          className="w-full pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("All Categories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"><T text="All Categories" /></SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {showStatus && onStatusChange && (
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t("Status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Status" /></SelectItem>
              <SelectItem value="normal"><T text="Normal" /></SelectItem>
              <SelectItem value="low"><T text="Low" /></SelectItem>
              <SelectItem value="critical"><T text="Critical" /></SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          <X className="mr-2 h-4 w-4" />
          <T text="Clear" />
        </Button>
        
        {onOpenAdvancedFilters && (
          <Button variant="outline" size="sm" onClick={onOpenAdvancedFilters}>
            <Filter className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline"><T text="More Filters" /></span>
          </Button>
        )}
      </div>
    </div>
  );
};
