
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MenuCategory } from "@/types/menu";

export const useCategoryManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<MenuCategory | null>(null);
  const [formData, setFormData] = useState<Partial<MenuCategory>>({
    name: "",
    description: "",
    active: true,
    image_url: null
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      
      // First, fetch all categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*');
      
      if (categoriesError) throw categoriesError;
      
      // Then, get count of food items for each category
      const { data: foodItemsData, error: foodItemsError } = await supabase
        .from('food_items')
        .select('category_id');
      
      if (foodItemsError) throw foodItemsError;
      
      // Count items per category
      const categoryItemCount = foodItemsData.reduce((acc, item) => {
        if (item.category_id) {
          acc[item.category_id] = (acc[item.category_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      
      // Combine data
      const categoriesWithCount = categoriesData.map(category => ({
        ...category,
        itemCount: categoryItemCount[category.id] || 0
      }));
      
      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      active: true,
      image_url: null
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, active: checked }));
  };

  const handleAddCategory = async () => {
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('menu_categories')
        .insert({
          name: formData.name,
          description: formData.description || null,
          active: formData.active,
          image_url: formData.image_url
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Category added successfully');
      
      // Add the new category with itemCount of 0
      const newCategory: MenuCategory = {
        ...data,
        itemCount: 0
      };
      
      setCategories([...categories, newCategory]);
      
      resetForm();
      setShowAddDialog(false);
      
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditCategory = (category: MenuCategory) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      active: category.active,
      image_url: category.image_url
    });
    setShowEditDialog(true);
  };

  const handleDeleteCategory = (category: MenuCategory) => {
    setCurrentCategory(category);
    setShowDeleteDialog(true);
  };

  const confirmEditCategory = async () => {
    if (!currentCategory || !formData.name) {
      toast.error('Category name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('menu_categories')
        .update({
          name: formData.name,
          description: formData.description || null,
          active: formData.active,
          image_url: formData.image_url
        })
        .eq('id', currentCategory.id);
      
      if (error) throw error;
      
      toast.success('Category updated successfully');
      
      setCategories(prev => 
        prev.map(category => 
          category.id === currentCategory.id 
            ? { 
                ...category, 
                name: formData.name || "", 
                description: formData.description || null,
                active: formData.active || false,
                image_url: formData.image_url 
              } 
            : category
        )
      );
      
      resetForm();
      setShowEditDialog(false);
      setCurrentCategory(null);
      
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!currentCategory) return;
    
    try {
      setIsLoading(true);
      
      // Check if category has food items
      if ((currentCategory.itemCount || 0) > 0) {
        toast.error('Cannot delete category with associated food items');
        setShowDeleteDialog(false);
        setCurrentCategory(null);
        return;
      }
      
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', currentCategory.id);
      
      if (error) throw error;
      
      toast.success('Category deleted successfully');
      
      setCategories(prev => prev.filter(category => category.id !== currentCategory.id));
      
      setShowDeleteDialog(false);
      setCurrentCategory(null);
      
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('menu_categories')
        .update({ active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setCategories(prev => 
        prev.map(category => 
          category.id === id ? { ...category, active: !currentStatus } : category
        )
      );
      
      toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'}`);
      
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    isLoading,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    currentCategory,
    formData,
    resetForm,
    handleInputChange,
    handleSwitchChange,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    confirmEditCategory,
    confirmDeleteCategory,
    handleToggleStatus
  };
};
