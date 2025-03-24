
import { FoodItem, MenuCategory } from "@/types/menu";

export interface FoodManagementState {
  isLoading: boolean;
  foodItems: FoodItem[];
  categories: MenuCategory[];
  searchQuery: string;
  openDialog: boolean;
  editMode: boolean;
  formData: Partial<FoodItem>;
  selectedModifiers: string[];
}
