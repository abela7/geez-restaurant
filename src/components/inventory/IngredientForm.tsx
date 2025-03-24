
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { PlusCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Ingredient } from "@/services/inventory/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface IngredientFormProps {
  initialData?: Ingredient;
  onSubmit: (data: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  categories?: string[];
  onAddCategory?: (category: string) => Promise<void>;
}

// Predefined category options (as fallback)
const CATEGORIES = ["Meat", "Vegetables", "Fruits", "Dairy", "Spices", "Dry Goods", "Bread", "Beverages"];

export const IngredientForm: React.FC<IngredientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  categories = CATEGORIES,
  onAddCategory
}) => {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [unitOptions, setUnitOptions] = useState<{name: string, abbreviation: string}[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
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

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error(t("Category name cannot be empty"));
      return;
    }

    if (categories.some(c => c.toLowerCase() === newCategory.trim().toLowerCase())) {
      toast.error(t("Category already exists"));
      return;
    }

    setIsAddingCategory(true);
    try {
      if (onAddCategory) {
        await onAddCategory(newCategory.trim());
        // Update form with the new category
        form.setValue('category', newCategory.trim());
        setNewCategory("");
        setPopoverOpen(false);
        toast.success(t("Category added successfully"));
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(t("Failed to add category"));
    } finally {
      setIsAddingCategory(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                <div className="flex items-center justify-between mb-2">
                  <FormLabel className="mb-0"><T text="Category" /></FormLabel>
                  {onAddCategory && (
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <PlusCircle className="h-4 w-4 mr-1" />
                          <T text="Add New" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" side="bottom" align="end">
                        <div className="space-y-4">
                          <h4 className="font-medium"><T text="Add New Category" /></h4>
                          <div className="space-y-2">
                            <Label htmlFor="new-category"><T text="Category Name" /></Label>
                            <div className="flex gap-2">
                              <Input 
                                id="new-category"
                                value={newCategory} 
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder={t("Enter category name")}
                              />
                              <Button 
                                onClick={handleAddCategory}
                                disabled={isAddingCategory || !newCategory.trim()}
                              >
                                {isAddingCategory ? 
                                  <T text="Adding..." /> : 
                                  <T text="Add" />
                                }
                              </Button>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
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
