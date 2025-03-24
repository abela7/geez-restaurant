
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Ingredient } from "@/services/inventory/types";
import { Edit, History, ArrowUpDown } from "lucide-react";

interface InventoryTableProps {
  inventory: Ingredient[];
  isLoading: boolean;
  onEdit: (item: Ingredient) => void;
  onViewHistory: (item: Ingredient) => void;
  sortOrder: {field: string, direction: 'asc' | 'desc'};
  onSort: (field: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  isLoading,
  onEdit,
  onViewHistory,
  sortOrder,
  onSort
}) => {
  const { t } = useLanguage();

  const getStockStatus = (item: Ingredient) => {
    if (item.stock_quantity === undefined || item.reorder_level === undefined) {
      return "normal";
    }
    
    if (item.stock_quantity === 0) {
      return "critical";
    }
    
    if (item.stock_quantity <= item.reorder_level) {
      return "low";
    }
    
    return "normal";
  };

  const renderSortIcon = (field: string) => {
    if (sortOrder.field !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortOrder.direction === 'asc' ? 
      <ArrowUpDown className="h-4 w-4 ml-1 text-primary" /> : 
      <ArrowUpDown className="h-4 w-4 ml-1 text-primary rotate-180" />;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                <T text="Item Name" />
                {renderSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('category')}
            >
              <div className="flex items-center">
                <T text="Category" />
                {renderSortIcon('category')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('stock_quantity')}
            >
              <div className="flex items-center">
                <T text="Quantity" />
                {renderSortIcon('stock_quantity')}
              </div>
            </TableHead>
            <TableHead><T text="Status" /></TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('reorder_level')}
            >
              <div className="flex items-center">
                <T text="Reorder Level" />
                {renderSortIcon('reorder_level')}
              </div>
            </TableHead>
            <TableHead className="text-right"><T text="Actions" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-muted-foreground"><T text="Loading inventory..." /></p>
                </div>
              </TableCell>
            </TableRow>
          ) : inventory.length > 0 ? (
            inventory.map((item) => {
              const status = getStockStatus(item);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category || "—"}</TableCell>
                  <TableCell>{item.stock_quantity !== undefined ? `${item.stock_quantity} ${item.unit}` : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={
                      status === "normal" ? "default" : 
                      status === "low" ? "outline" : 
                      "destructive"
                    }>
                      {status === "normal" ? t("Normal") : 
                       status === "low" ? t("Low") : 
                       t("Out of Stock")}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.reorder_level !== undefined ? `${item.reorder_level} ${item.unit}` : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                      <Edit className="h-4 w-4 mr-1" />
                      <T text="Update" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onViewHistory(item)}>
                      <History className="h-4 w-4 mr-1" />
                      <T text="History" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <p className="text-muted-foreground"><T text="No inventory items found" /></p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
