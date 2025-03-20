
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  RadioGroup,
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Ingredient } from "@/services/inventory/types";
import { ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";

interface StockAdjustmentFormProps {
  ingredient: Ingredient;
  onSubmit: (type: 'adjustment' | 'waste', quantity: number, notes: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({
  ingredient,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [transactionType, setTransactionType] = useState<'adjustment' | 'waste'>('adjustment');
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    defaultValues: {
      quantity: 0,
      notes: ''
    }
  });

  const handleSubmit = async (values: { quantity: number; notes: string }) => {
    setIsSaving(true);
    try {
      const finalQuantity = adjustmentType === 'add' ? values.quantity : -values.quantity;
      await onSubmit(transactionType, finalQuantity, values.notes);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4">
          <div className="px-4 py-3 border rounded-md bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="font-medium">{ingredient.name}</h3>
              <p className="text-sm text-muted-foreground">
                <T text="Current Stock" />: {ingredient.stock_quantity || 0} {ingredient.unit}
              </p>
            </div>
            <div className="text-sm">
              <span className="font-medium"><T text="Reorder Level" /></span>: {ingredient.reorder_level || 0} {ingredient.unit}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <RadioGroup 
              defaultValue="add" 
              className="grid grid-cols-2 gap-4"
              onValueChange={(value) => setAdjustmentType(value as 'add' | 'remove')}
            >
              <div>
                <RadioGroupItem 
                  value="add" 
                  id="add" 
                  className="peer sr-only" 
                  disabled={isLoading || isSaving}
                />
                <label
                  htmlFor="add"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <ArrowUp className="mb-2 h-4 w-4" />
                  <span className="text-sm font-medium"><T text="Add Stock" /></span>
                </label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="remove" 
                  id="remove" 
                  className="peer sr-only" 
                  disabled={isLoading || isSaving}
                />
                <label
                  htmlFor="remove"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <ArrowDown className="mb-2 h-4 w-4" />
                  <span className="text-sm font-medium"><T text="Remove Stock" /></span>
                </label>
              </div>
            </RadioGroup>

            {adjustmentType === 'remove' && (
              <RadioGroup 
                defaultValue="adjustment" 
                className="grid grid-cols-2 gap-4"
                onValueChange={(value) => setTransactionType(value as 'adjustment' | 'waste')}
              >
                <div>
                  <RadioGroupItem 
                    value="adjustment" 
                    id="adjustment" 
                    className="peer sr-only" 
                    disabled={isLoading || isSaving}
                  />
                  <label
                    htmlFor="adjustment"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-sm font-medium"><T text="General Adjustment" /></span>
                  </label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="waste" 
                    id="waste" 
                    className="peer sr-only" 
                    disabled={isLoading || isSaving}
                  />
                  <label
                    htmlFor="waste"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-sm font-medium"><T text="Record as Waste" /></span>
                  </label>
                </div>
              </RadioGroup>
            )}

            <FormField
              control={form.control}
              name="quantity"
              rules={{ required: true, min: 0.01 }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <T text="Quantity" /> ({ingredient.unit})
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0.01"
                      {...field} 
                      onChange={e => field.onChange(Number(e.target.value))}
                      disabled={isLoading || isSaving}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><T text="Adjustment Notes" /></FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder={t("Enter reason for adjustment...")}
                      disabled={isLoading || isSaving}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {adjustmentType === 'remove' && (ingredient.stock_quantity || 0) <= form.getValues().quantity && (
            <div className="flex items-start gap-2 p-3 rounded-md border border-yellow-500 bg-yellow-500/10">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium"><T text="Warning" /></p>
                <p><T text="This will reduce the stock below the current quantity. Please verify this is correct." /></p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading || isSaving}
              type="button"
            >
              <T text="Cancel" />
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || isSaving || form.getValues().quantity <= 0}
            >
              {isLoading || isSaving ? 
                <T text="Saving..." /> : 
                <T text="Save Adjustment" />
              }
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
