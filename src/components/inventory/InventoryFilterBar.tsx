
import React from "react";
import { Search, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface InventoryFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stockFilter: "all" | "normal" | "low" | "out-of-stock";
  setStockFilter: (filter: "all" | "normal" | "low" | "out-of-stock") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onRefresh: () => void;
  onRequestItem: () => void;
}

const InventoryFilterBar: React.FC<InventoryFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  stockFilter,
  setStockFilter,
  viewMode,
  setViewMode,
  onRefresh,
  onRequestItem
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("Search inventory...")}
          className="pl-9 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={stockFilter} onValueChange={(value) => setStockFilter(value as any)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={t("All stock")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"><T text="All stock" /></SelectItem>
            <SelectItem value="normal"><T text="In stock" /></SelectItem>
            <SelectItem value="low"><T text="Low stock" /></SelectItem>
            <SelectItem value="out-of-stock"><T text="Out of stock" /></SelectItem>
          </SelectContent>
        </Select>
        
        <div className="border rounded-md flex">
          <Button 
            variant={viewMode === "grid" ? "default" : "ghost"} 
            size="icon" 
            className="h-9 w-9 rounded-r-none"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "ghost"} 
            size="icon" 
            className="h-9 w-9 rounded-l-none"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="flex items-center gap-1"
        >
          <span className={isMobile ? "hidden" : "inline"}><T text="Refresh" /></span>
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onRequestItem}
          className="flex items-center gap-1"
        >
          <span className={isMobile ? "hidden" : "inline"}><T text="Request Item" /></span>
        </Button>
      </div>
    </div>
  );
};

export default InventoryFilterBar;
