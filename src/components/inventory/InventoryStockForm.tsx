
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { addStockItem, updateStockItem } from "@/services/inventory/stockService";
import { Ingredient } from "@/services/inventory/types";

interface InventoryStockFormProps {
  item?: Ingredient | null;
  onSave: () => void;
  onCancel: () => void;
}

const categories = [
  "Grain",
  "Protein",
  "Vegetable",
  "Fruit",
  "Spice",
  "Dairy",
  "Legume",
  "Oil",
  "Sauce",
  "Beverage",
  "Other"
];

const units = ["kg", "g", "L", "ml", "piece", "bundle", "bag", "box", "can", "bottle", "pack"];

const types = ["Dry", "Fresh", "Refrigerated", "Frozen"];

const stockFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  stock_quantity: z.coerce.number().min(0, "Quantity must be 0 or greater"),
  reorder_level: z.coerce.number().min(0, "Reorder level must be 0 or greater"),
  unit: z.string().min(1, "Please select a unit"),
  cost: z.coerce.number().min(0, "Cost must be 0 or greater").optional(),
  supplier: z.string().optional(),
  origin: z.string().optional(),
  type: z.string().min(1, "Please select a type"),
  allergens: z.array(z.string()).optional(),
  dietary: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type StockFormValues = z.infer<typeof stockFormSchema>;

export const InventoryStockForm: React.FC<InventoryStockFormProps> = ({
  item,
  onSave,
  onCancel
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasAllergens, setHasAllergens] = useState(false);
  const [allergenInput, setAllergenInput] = useState("");
  const [allergensList, setAllergensList] = useState<string[]>([]);
  const [hasDietary, setHasDietary] = useState(false);
  const [dietaryInput, setDietaryInput] = useState("");
  const [dietaryList, setDietaryList] = useState<string[]>([]);

  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      name: item?.name || "",
      category: item?.category || "",
      stock_quantity: item?.stock_quantity || 0,
      reorder_level: item?.reorder_level || 0,
      unit: item?.unit || "",
      cost: item?.cost || 0,
      supplier: item?.supplier || "",
      origin: item?.origin || "",
      type: item?.type || "Dry",
      allergens: [],
      dietary: [],
      notes: "",
    },
  });

  useEffect(() => {
    if (item) {
      // Set allergens
      if (item.allergens && item.allergens.length > 0) {
        setHasAllergens(true);
        setAllergensList(item.allergens);
      }
      
      // Set dietary
      if (item.dietary && item.dietary.length > 0) {
        setHasDietary(true);
        setDietaryList(item.dietary);
      }
      
      // Reset form with item values
      form.reset({
        name: item.name,
        category: item.category || "",
        stock_quantity: item.stock_quantity || 0,
        reorder_level: item.reorder_level || 0,
        unit: item.unit,
        cost: item.cost || 0,
        supplier: item.supplier || "",
        origin: item.origin || "",
        type: item.type || "Dry",
        allergens: item.allergens || [],
        dietary: item.dietary || [],
        notes: "",
      });
    }
  }, [item, form]);

  const onSubmit = async (values: StockFormValues) => {
    setIsLoading(true);
    
    try {
      // Add allergens and dietary info
      const dataToSubmit = {
        ...values,
        allergens: hasAllergens ? allergensList : [],
        dietary: hasDietary ? dietaryList : [],
      };
      
      if (item) {
        await updateStockItem(item.id, dataToSubmit);
        toast({
          title: t("Success"),
          description: t("Item updated successfully"),
        });
      } else {
        await addStockItem(dataToSubmit);
        toast({
          title: t("Success"),
          description: t("Item added successfully"),
        });
      }
      
      onSave();
    } catch (error) {
      console.error("Error saving inventory item:", error);
      toast({
        title: t("Error"),
        description: t("Failed to save item"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAllergen = () => {
    if (allergenInput.trim()) {
      setAllergensList([...allergensList, allergenInput.trim()]);
      setAllergenInput("");
    }
  };

  const removeAllergen = (index: number) => {
    setAllergensList(allergensList.filter((_, i) => i !== index));
  };

  const addDietary = () => {
    if (dietaryInput.trim()) {
      setDietaryList([...dietaryList, dietaryInput.trim()]);
      setDietaryInput("");
    }
  };

  const removeDietary = (index: number) => {
    setDietaryList(dietaryList.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Name" /></FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <Select value={field.value} onValueChange={field.onChange}>
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
                <FormLabel><T text="Stock Quantity" /></FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
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
                  <Input type="number" min="0" step="0.01" {...field} />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select unit")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
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
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Cost per Unit (£)" /></FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Type" /></FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select type")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Origin" /></FormLabel>
              <Select 
                value={field.value || ""} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select origin")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Local">Local</SelectItem>
                  <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                  <SelectItem value="Eritrea">Eritrea</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="Imported">Imported</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={hasAllergens}
              onCheckedChange={setHasAllergens}
              id="allergens-mode"
            />
            <label
              htmlFor="allergens-mode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <T text="Contains Allergens" />
            </label>
          </div>
          
          {hasAllergens && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={allergenInput}
                  onChange={(e) => setAllergenInput(e.target.value)}
                  placeholder={t("Add allergen...")}
                  className="flex-1"
                />
                <Button type="button" onClick={addAllergen}>
                  <T text="Add" />
                </Button>
              </div>
              
              {allergensList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {allergensList.map((allergen, index) => (
                    <Badge key={index} variant="secondary" className="py-1">
                      {allergen}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeAllergen(index)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={hasDietary}
              onCheckedChange={setHasDietary}
              id="dietary-mode"
            />
            <label
              htmlFor="dietary-mode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <T text="Dietary Information" />
            </label>
          </div>
          
          {hasDietary && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={dietaryInput}
                  onChange={(e) => setDietaryInput(e.target.value)}
                  placeholder={t("Add dietary info...")}
                  className="flex-1"
                />
                <Button type="button" onClick={addDietary}>
                  <T text="Add" />
                </Button>
              </div>
              
              {dietaryList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {dietaryList.map((dietary, index) => (
                    <Badge key={index} variant="outline" className="py-1">
                      {dietary}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeDietary(index)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Notes" /></FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormDescription>
                <T text="Any additional information about this item" />
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            <T text="Cancel" />
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 
              <T text="Saving..." /> : 
              item ? <T text="Update Item" /> : <T text="Add Item" />
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};
