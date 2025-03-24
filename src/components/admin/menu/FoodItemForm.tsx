
import React from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { MenuCategory, FoodItem } from "@/types/menu";
import FoodItemModifiersForm from "./FoodItemModifiersForm";

interface FoodItemFormProps {
  formData: Partial<FoodItem>;
  categories: MenuCategory[];
  isLoading: boolean;
  editMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
  onSelectChange: (name: string, value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  onModifiersChange?: (selectedModifiers: string[]) => void;
}

const FoodItemForm: React.FC<FoodItemFormProps> = ({
  formData,
  categories,
  isLoading,
  editMode,
  onInputChange,
  onSwitchChange,
  onSelectChange,
  onCancel,
  onSubmit,
  onModifiersChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="required">
              <T text="Food Item Name" />
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={onInputChange}
              placeholder={t("Enter food item name")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="required">
              <T text="Price (£)" />
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ""}
              onChange={onInputChange}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            <T text="Description" />
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={onInputChange}
            placeholder={t("Enter food item description")}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            <T text="Category" />
          </Label>
          <Select
            value={formData.category_id || ""}
            onValueChange={(value) => onSelectChange("category_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select a category")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preparation_time">
            <T text="Preparation Time (minutes)" />
          </Label>
          <Input
            id="preparation_time"
            name="preparation_time"
            type="number"
            min="0"
            value={formData.preparation_time || ""}
            onChange={onInputChange}
            placeholder={t("Enter preparation time in minutes")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image_url">
            <T text="Image URL" />
          </Label>
          <Input
            id="image_url"
            name="image_url"
            value={formData.image_url || ""}
            onChange={onInputChange}
            placeholder={t("Enter image URL")}
          />
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={formData.available === undefined ? true : formData.available}
              onCheckedChange={(checked) => onSwitchChange("available", checked)}
            />
            <Label htmlFor="available">
              <T text="Available" />
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_vegetarian"
              checked={formData.is_vegetarian || false}
              onCheckedChange={(checked) => onSwitchChange("is_vegetarian", checked)}
            />
            <Label htmlFor="is_vegetarian">
              <T text="Vegetarian" />
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_vegan"
              checked={formData.is_vegan || false}
              onCheckedChange={(checked) => onSwitchChange("is_vegan", checked)}
            />
            <Label htmlFor="is_vegan">
              <T text="Vegan" />
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_gluten_free"
              checked={formData.is_gluten_free || false}
              onCheckedChange={(checked) => onSwitchChange("is_gluten_free", checked)}
            />
            <Label htmlFor="is_gluten_free">
              <T text="Gluten Free" />
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_spicy"
              checked={formData.is_spicy || false}
              onCheckedChange={(checked) => onSwitchChange("is_spicy", checked)}
            />
            <Label htmlFor="is_spicy">
              <T text="Spicy" />
            </Label>
          </div>
        </div>
      </div>

      {/* Add Modifiers section for both add and edit modes */}
      <div className="mt-6">
        <FoodItemModifiersForm 
          foodItemId={formData.id} 
          onModifiersChange={onModifiersChange}
          mode={editMode ? "edit" : "create"}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          <T text="Cancel" />
        </Button>
        <Button onClick={onSubmit} disabled={isLoading || !formData.name || !formData.price}>
          {editMode ? <T text="Update Food Item" /> : <T text="Add Food Item" />}
        </Button>
      </div>
    </div>
  );
};

export default FoodItemForm;
