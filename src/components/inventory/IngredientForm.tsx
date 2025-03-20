
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

interface IngredientFormProps {
  initialData?: Ingredient;
  onSubmit: (data: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Predefined options
const UNITS = ["kg", "g", "l", "ml", "pcs", "box", "bag", "bottle", "can", "jar"];
const CATEGORIES = ["Meat", "Vegetables", "Fruits", "Dairy", "Spices", "Dry Goods", "Bread", "Beverages"];

export const IngredientForm: React.FC<IngredientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>>({
    defaultValues: initialData ? {
      name: initialData.name,
      category: initialData.category || '',
      stock_quantity: initialData.stock_quantity || 0,
      reorder_level: initialData.reorder_level || 0,
      unit: initialData.unit,
      cost: initialData.cost || 0,
      supplier: initialData.supplier || '',
      origin: initialData.origin || '',
      allergens: initialData.allergens || [],
      dietary: initialData.dietary || [],
      type: initialData.type || ''
    } : {
      name: '',
      category: '',
      stock_quantity: 0,
      reorder_level: 0,
      unit: 'kg',
      cost: 0,
      supplier: '',
      origin: '',
      allergens: [],
      dietary: [],
      type: ''
    }
  });
  
  const handleSubmit = async (values: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSaving(true);
    try {
      await onSubmit(values);
      form.reset(); // Reset form after successful submission
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Ingredient Name" /></FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading || isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Category" /></FormLabel>
                <Select 
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading || isSaving}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select category")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="stock_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Current Stock" /></FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
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
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Unit" /></FormLabel>
                <Select 
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading || isSaving}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select unit")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {UNITS.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="reorder_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Reorder Level" /></FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(Number(e.target.value))}
                    disabled={isLoading || isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Cost per Unit ($)" /></FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
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
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Supplier" /></FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading || isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Origin" /></FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading || isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
            {isLoading || isSaving ? <T text="Saving..." /> : 
              initialData ? <T text="Update Ingredient" /> : <T text="Add Ingredient" />
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};
