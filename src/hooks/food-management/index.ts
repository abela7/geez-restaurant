
import { useState } from "react";
import { useFoodDataFetching } from "./useFoodDataFetching";
import { useFoodFormState } from "./useFoodFormState";
import { useFoodItemCrud } from "./useFoodItemCrud";

export const useFoodManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const {
    isLoading: dataLoading,
    foodItems,
    categories,
    loadData,
    filterFoodItems
  } = useFoodDataFetching();
  
  const {
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
  } = useFoodFormState();
  
  const {
    isLoading: crudLoading,
    addFoodItem: addItem,
    updateFoodItem: updateItem,
    deleteFoodItem: deleteItem,
    toggleAvailability: toggleItemAvailability
  } = useFoodItemCrud(loadData);
  
  // Combine loading states
  const isLoading = dataLoading || crudLoading;
  
  // Wrapper functions to pass the correct parameters
  const addFoodItem = async () => {
    const result = await addItem(formData, selectedModifiers);
    if (result) handleCloseDialog();
  };
  
  const updateFoodItem = async () => {
    const result = await updateItem(formData, selectedModifiers);
    if (result) handleCloseDialog();
  };
  
  // Filter food items based on search query
  const filteredFoodItems = filterFoodItems(foodItems, searchQuery);

  return {
    isLoading,
    foodItems: filteredFoodItems,
    categories,
    searchQuery,
    setSearchQuery,
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
    handleModifiersChange,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem: deleteItem,
    toggleAvailability: toggleItemAvailability,
  };
};

// Re-export all components for easy imports
export * from "./types";
export * from "./useFoodDataFetching";
export * from "./useFoodFormState";
export * from "./useFoodItemCrud";
