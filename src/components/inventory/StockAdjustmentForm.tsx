
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
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Ingredient } from "@/services/inventory/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface StockAdjustmentFormProps {
  ingredient: Ingredient;
  onSubmit: (type: 'adjustment' | 'waste', quantity: number, notes: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const adjustmentSchema = z.object({
  type: z.enum(['adjustment', 'waste']),
  adjustmentType: z.enum(['add', 'remove']),
  quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
  notes: z.string().optional(),
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

export const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({
  ingredient,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      type: 'adjustment',
      adjustmentType: 'add',
      quantity: 1,
      notes: '',
    },
  });
  
  const handleSubmit = async (values: AdjustmentFormValues) => {
    setIsSaving(true);
    try {
      const finalQuantity = values.adjustmentType === 'add' ? values.quantity : -values.quantity;
      await onSubmit(values.type, finalQuantity, values.notes || '');
      form.reset();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-muted rounded-md">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium"><T text="Current Stock" /></span>
              <span className="text-sm font-semibold">
                {ingredient.stock_quantity || 0} {ingredient.unit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium"><T text="Reorder Level" /></span>
              <span className="text-sm font-semibold">
                {ingredient.reorder_level || 0} {ingredient.unit}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Transaction Type" /></FormLabel>
                <Select 
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading || isSaving}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select type")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="adjustment"><T text="Stock Adjustment" /></SelectItem>
                    <SelectItem value="waste"><T text="Waste" /></SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="adjustmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Adjustment Type" /></FormLabel>
                <Select 
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading || isSaving}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select adjustment")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="add"><T text="Add Stock" /></SelectItem>
                    <SelectItem value="remove"><T text="Remove Stock" /></SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Quantity" /></FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    {...field} 
                    onChange={e => field.onChange(Number(e.target.value))}
                    disabled={isLoading || isSaving}
                  />
                </FormControl>
                <span className="text-sm">{ingredient.unit}</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Notes" /></FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder={t("Reason for adjustment")}
                  disabled={isLoading || isSaving}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
            disabled={isLoading || isSaving}
          >
            {isLoading || isSaving ? <T text="Saving..." /> : <T text="Update Stock" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};
