
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SampleIngredientsButton = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const sampleIngredients = [
    {
      name: "Beef",
      category: "Meat",
      unit: "kg",
      stock_quantity: 10,
      reorder_level: 2,
      cost: 15.99
    },
    {
      name: "Chicken",
      category: "Meat",
      unit: "kg",
      stock_quantity: 15,
      reorder_level: 3,
      cost: 12.50
    },
    {
      name: "Berbere Spice",
      category: "Spices",
      unit: "g",
      stock_quantity: 500,
      reorder_level: 100,
      cost: 0.05
    },
    {
      name: "Teff Flour",
      category: "Grains",
      unit: "kg",
      stock_quantity: 25,
      reorder_level: 5,
      cost: 8.75
    },
    {
      name: "Onions",
      category: "Vegetables",
      unit: "kg",
      stock_quantity: 8,
      reorder_level: 2,
      cost: 3.25
    },
    {
      name: "Tomatoes",
      category: "Vegetables",
      unit: "kg",
      stock_quantity: 7,
      reorder_level: 2,
      cost: 4.50
    },
    {
      name: "Red Lentils",
      category: "Legumes",
      unit: "kg",
      stock_quantity: 15,
      reorder_level: 3,
      cost: 5.85
    },
    {
      name: "Garlic",
      category: "Vegetables",
      unit: "kg",
      stock_quantity: 2,
      reorder_level: 0.5,
      cost: 7.20
    },
    {
      name: "Butter",
      category: "Dairy",
      unit: "kg",
      stock_quantity: 5,
      reorder_level: 1,
      cost: 10.50
    },
    {
      name: "Vegetable Oil",
      category: "Pantry",
      unit: "L",
      stock_quantity: 10,
      reorder_level: 2,
      cost: 6.75
    }
  ];

  const addSampleIngredients = async () => {
    setIsLoading(true);
    try {
      // Check if ingredients already exist to avoid duplicates
      const { data: existingIngredients, error: checkError } = await supabase
        .from("ingredients")
        .select("name");
      
      if (checkError) {
        console.error("Error checking existing ingredients:", checkError);
        toast.error("Failed to check existing ingredients");
        return;
      }
      
      const existingNames = new Set(existingIngredients.map((ing: any) => ing.name.toLowerCase()));
      
      // Filter out ingredients that already exist
      const newIngredients = sampleIngredients.filter(
        ing => !existingNames.has(ing.name.toLowerCase())
      );
      
      if (newIngredients.length === 0) {
        toast.info("All sample ingredients are already in your inventory");
        return;
      }
      
      // Add new ingredients
      const { error } = await supabase
        .from("ingredients")
        .insert(newIngredients);
      
      if (error) {
        console.error("Error adding sample ingredients:", error);
        toast.error("Failed to add sample ingredients");
        return;
      }
      
      toast.success(`Added ${newIngredients.length} sample ingredients to inventory`);
      
      // Refresh the page to show the new ingredients
      window.location.reload();
    } catch (error) {
      console.error("Unexpected error adding sample ingredients:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={addSampleIngredients} 
      disabled={isLoading}
      className="flex items-center gap-1"
    >
      <Database className="h-4 w-4" />
      {isLoading ? <T text="Adding..." /> : <T text="Add Sample Ingredients" />}
    </Button>
  );
};
