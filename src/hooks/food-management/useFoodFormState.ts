
import { useState, useCallback } from "react";
import { FoodItem } from "@/types/menu";

export const useFoodFormState = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<FoodItem>>({});
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);

  const handleOpenDialog = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      image_url: "",
      category_id: "",
      available: true,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_spicy: false,
      preparation_time: undefined
    });
    setSelectedModifiers([]);
    setEditMode(false);
    setOpenDialog(true);
  }, []);

  const handleEditFoodItem = useCallback((item: FoodItem) => {
    setFormData(item);
    setEditMode(true);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : Number(value)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const handleSwitchChange = useCallback((name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleModifiersChange = useCallback((modifiers: string[]) => {
    setSelectedModifiers(modifiers);
  }, []);

  return {
    openDialog,
    setOpenDialog,
    editMode,
    formData,
    selectedModifiers,
    handleOpenDialog,
    handleEditFoodItem,
    handleCloseDialog,
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    handleModifiersChange
  };
};
