
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface IngredientFormProps {
  initialData?: Ingredient;
  onSubmit: (data: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  categories?: string[];
}

// Predefined category options
const CATEGORIES = ["Meat", "Vegetables", "Fruits", "Dairy", "Spices", "Dry Goods", "Bread", "Beverages"];

export const IngredientForm: React.FC<IngredientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  categories = CATEGORIES
}) => {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [unitOptions, setUnitOptions] = useState<{name: string, abbreviation: string}[]>([]);
  
  useEffect(() => {
    // Fetch unit types from measurement_units table
    const fetchUnitTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('measurement_units')
          .select('name, abbreviation')
          .order('name');
          
        if (error) {
          console.error("Error fetching unit types:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setUnitOptions(data);
        } else {
          // Fallback to predefined units if none exist in database
          setUnitOptions([
            { name: "Kilogram", abbreviation: "kg" },
            { name: "Gram", abbreviation: "g" }, 
            { name: "Liter", abbreviation: "l" }, 
            { name: "Milliliter", abbreviation: "ml" }, 
            { name: "Piece", abbreviation: "pcs" },
            { name: "Box", abbreviation: "box" },
            { name: "Bag", abbreviation: "bag" },
            { name: "Bottle", abbreviation: "bottle" },
            { name: "Can", abbreviation: "can" },
            { name: "Jar", abbreviation: "jar" }
          ]);
        }
      } catch (err) {
        console.error("Error fetching unit types:", err);
      }
    };
    
    fetchUnitTypes();
  }, []);
  
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
      unit: '',
      cost: 0,
      supplier: '',
      origin: '',
      allergens: [],
      dietary: [],
      type: ''
    }
  });
  
  useEffect(() => {
    // Set default unit if none is selected and options are loaded
    const currentUnit = form.getValues('unit');
    if ((!currentUnit || currentUnit === '') && unitOptions.length > 0) {
      form.setValue('unit', unitOptions[0].abbreviation);
    }
  }, [unitOptions]);
  
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
                    {categories.map(category => (
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
                    {unitOptions.map(unit => (
                      <SelectItem key={unit.abbreviation} value={unit.abbreviation}>
                        {unit.name} ({unit.abbreviation})
                      </SelectItem>
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
                <FormLabel><T text="Cost per Unit (£)" /></FormLabel>
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
