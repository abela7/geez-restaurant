
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { getStockHistory } from "@/services/inventory/stockService";
import { Ingredient, InventoryTransaction } from "@/services/inventory/types";
import { InventoryTransactionList } from "@/components/inventory/InventoryTransactionList";

interface InventoryHistoryDialogProps {
  item: Ingredient | null;
  onClose: () => void;
}

export const InventoryHistoryDialog: React.FC<InventoryHistoryDialogProps> = ({
  item,
  onClose,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);

  useEffect(() => {
    if (item) {
      loadTransactionHistory();
    }
  }, [item]);

  const loadTransactionHistory = async () => {
    if (!item) return;
    
    setIsLoading(true);
    try {
      const history = await getStockHistory(item.id);
      setTransactions(history);
    } catch (error) {
      console.error("Error loading transaction history:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load transaction history"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={!!item} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            <T text="Inventory History" />: {item.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-md">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                <T text="Current Stock" />
              </div>
              <div className="text-lg font-semibold">
                {item.stock_quantity} {item.unit}
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                <T text="Reorder Level" />
              </div>
              <div className="text-lg font-semibold">
                {item.reorder_level} {item.unit}
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                <T text="Unit Cost" />
              </div>
              <div className="text-lg font-semibold">
                {item.cost ? `£${item.cost.toFixed(2)}` : "—"}
              </div>
            </div>
          </div>
          
          <div className="rounded-md border">
            <InventoryTransactionList 
              transactions={transactions} 
              isLoading={isLoading} 
            />
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>
              <T text="Close" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
