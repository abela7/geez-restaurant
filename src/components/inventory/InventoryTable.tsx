
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
import { Edit, History, ArrowUpDown, AlertCircle } from "lucide-react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface InventoryTableProps {
  inventory: Ingredient[];
  isLoading: boolean;
  onEdit: (item: Ingredient) => void;
  onViewHistory: (item: Ingredient) => void;
  sortOrder: {field: string, direction: 'asc' | 'desc'};
  onSort: (field: string) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  isLoading,
  onEdit,
  onViewHistory,
  sortOrder,
  onSort,
  pagination
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

  const renderPagination = () => {
    if (!pagination) return null;
    
    const { currentPage, totalPages, onPageChange } = pagination;
    
    const pageItems = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      pageItems.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        pageItems.push(
          <PaginationItem key="ellipsis-start">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageItems.push(
          <PaginationItem key="ellipsis-end">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
      
      pageItems.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {pageItems}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div>
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
                  <TableRow 
                    key={item.id}
                    className={
                      status === "critical" ? "bg-red-50 dark:bg-red-950/20" : 
                      status === "low" ? "bg-amber-50 dark:bg-amber-950/20" : 
                      ""
                    }
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {(status === "critical" || status === "low") && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </TableCell>
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
      
      {renderPagination()}
    </div>
  );
};
