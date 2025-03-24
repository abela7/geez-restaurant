
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { FoodItem, MenuCategory } from "@/types/menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FoodItemFormProps {
  formData: Omit<FoodItem, "id">;
  categories: MenuCategory[];
  isLoading: boolean;
  editMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (name: string) => (checked: boolean) => void;
  onSelectChange: (name: string, value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
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
}) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            <T text="Name" />
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder={t("Enter food item name")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">
            <T text="Price" />
          </Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={onInputChange}
            placeholder={t("Enter price")}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">
            <T text="Description" />
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={onInputChange}
            placeholder={t("Enter description")}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category_id">
            <T text="Category" />
          </Label>
          <Select
            onValueChange={(value) => onSelectChange("category_id", value)}
            defaultValue={formData.category_id || ""}
          >
            <SelectTrigger className="w-full">
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
        <div className="space-y-2">
          <Label htmlFor="preparation_time">
            <T text="Preparation Time (minutes)" />
          </Label>
          <Input
            type="number"
            id="preparation_time"
            name="preparation_time"
            value={formData.preparation_time || ""}
            onChange={onInputChange}
            placeholder={t("Enter preparation time")}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="available"
            checked={formData.available}
            onCheckedChange={onSwitchChange("available")}
          />
          <Label htmlFor="available">
            <T text="Available" />
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_vegetarian"
            checked={formData.is_vegetarian}
            onCheckedChange={onSwitchChange("is_vegetarian")}
          />
          <Label htmlFor="is_vegetarian">
            <T text="Vegetarian" />
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_vegan"
            checked={formData.is_vegan}
            onCheckedChange={onSwitchChange("is_vegan")}
          />
          <Label htmlFor="is_vegan">
            <T text="Vegan" />
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_gluten_free"
            checked={formData.is_gluten_free}
            onCheckedChange={onSwitchChange("is_gluten_free")}
          />
          <Label htmlFor="is_gluten_free">
            <T text="Gluten Free" />
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_spicy"
            checked={formData.is_spicy}
            onCheckedChange={onSwitchChange("is_spicy")}
          />
          <Label htmlFor="is_spicy">
            <T text="Spicy" />
          </Label>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          <T text="Cancel" />
        </Button>
        <Button type="button" onClick={onSubmit} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editMode ? <T text="Update Food Item" /> : <T text="Add Food Item" />}
        </Button>
      </div>
    </>
  );
};

export default FoodItemForm;
