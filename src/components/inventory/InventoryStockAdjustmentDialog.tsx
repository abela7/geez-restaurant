
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Ingredient } from "@/services/inventory/types";

interface InventoryStockAdjustmentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItem: Ingredient | null;
  onAdjustStock: (
    type: "add" | "subtract",
    quantity: number,
    note: string
  ) => Promise<void>;
}

const InventoryStockAdjustmentDialog: React.FC<InventoryStockAdjustmentDialogProps> = ({
  open,
  setOpen,
  selectedItem,
  onAdjustStock
}) => {
  const { t } = useLanguage();
  const [adjustType, setAdjustType] = useState<"add" | "subtract">("add");
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0);
  const [adjustNote, setAdjustNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedItem || adjustQuantity <= 0) return;
    
    setIsSubmitting(true);
    try {
      await onAdjustStock(adjustType, adjustQuantity, adjustNote);
      setOpen(false);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setAdjustType("add");
    setAdjustQuantity(0);
    setAdjustNote("");
  };

  const onClose = () => {
    setOpen(false);
    reset();
  };

  if (!selectedItem) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle><T text="Adjust Stock Quantity" /></DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{selectedItem.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedItem.category}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold">{selectedItem.stock_quantity || 0} {selectedItem.unit}</div>
                <div className="text-xs text-muted-foreground"><T text="Current stock" /></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label><T text="Operation" /></Label>
              <Select value={adjustType} onValueChange={(value) => setAdjustType(value as "add" | "subtract")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">
                    <div className="flex items-center">
                      <Plus className="mr-2 h-4 w-4 text-green-500" />
                      <T text="Add Stock" />
                    </div>
                  </SelectItem>
                  <SelectItem value="subtract">
                    <div className="flex items-center">
                      <Minus className="mr-2 h-4 w-4 text-red-500" />
                      <T text="Subtract Stock" />
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label><T text="Quantity" /></Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={adjustQuantity || ""}
                onChange={(e) => setAdjustQuantity(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label><T text="Note (optional)" /></Label>
            <Input
              placeholder={t("Reason for adjustment")}
              value={adjustNote}
              onChange={(e) => setAdjustNote(e.target.value)}
            />
          </div>
          
          <div className="pt-2">
            {adjustType === "add" ? (
              <div className="text-sm">
                <T text="New stock level will be" />: <span className="font-medium">{(selectedItem.stock_quantity || 0) + adjustQuantity} {selectedItem.unit}</span>
              </div>
            ) : (
              <div className="text-sm">
                <T text="New stock level will be" />: <span className="font-medium">{Math.max(0, (selectedItem.stock_quantity || 0) - adjustQuantity)} {selectedItem.unit}</span>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <T text="Cancel" />
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedItem || adjustQuantity <= 0 || isSubmitting}
          >
            {isSubmitting ? <T text="Updating..." /> : <T text="Update Stock" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryStockAdjustmentDialog;
