import { useState, useEffect, useCallback } from "react";
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
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [formData, setFormData] = useState<Partial<MenuCategory>>({
    name: "",
    description: "",
    active: true,
    image_url: null
  });

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading categories, attempt:', retryCount + 1);
      
      // First, fetch all categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*');
      
      if (categoriesError) {
        console.error('Supabase error loading categories:', categoriesError);
        throw categoriesError;
      }
      
      // Then, get count of food items for each category
      const { data: foodItemsData, error: foodItemsError } = await supabase
        .from('food_items')
        .select('category_id');
      
      if (foodItemsError) {
        console.error('Supabase error loading food items:', foodItemsError);
        throw foodItemsError;
      }
      
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
      
      // If there are no categories in the database, add the initial categories
      if (categoriesData.length === 0) {
        await seedInitialCategories();
        return loadCategories(); // Reload after seeding
      }
      
      setCategories(categoriesWithCount);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Error loading categories:', error);
      
      // Only show toast on final retry attempt
      if (retryCount >= 2) {
        toast.error('Failed to load categories');
        setError(error instanceof Error ? error : new Error('Unknown error loading categories'));
      } else {
        // Auto retry after a delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000); // 2 second delay before retry
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  
  const seedInitialCategories = async () => {
    const initialCategories = [
      { name: "Breakfast Dishes", description: "Traditional Ethiopian breakfast options", active: true },
      { name: "Vegan & Vegetarian Dishes", description: "Plant-based Ethiopian specialties", active: true },
      { name: "Beef Dishes", description: "Authentic beef preparations with Ethiopian spices", active: true },
      { name: "Lamb Dishes", description: "Traditional lamb dishes with rich flavors", active: true },
      { name: "Combination Platters", description: "Mixed selections of Ethiopian favorites", active: true },
      { name: "Injera-Based Dishes", description: "Specialties served with traditional injera bread", active: true },
      { name: "Traditional Coffee Service", description: "Ethiopian coffee ceremony and traditional coffee", active: true },
      { name: "Hot Drinks", description: "Warming beverages including teas and spiced drinks", active: true },
      { name: "Cold Drinks", description: "Refreshing cold beverages and traditional coolers", active: true },
      { name: "Specialty Dishes", description: "Chef's special preparations and house favorites", active: true },
      { name: "Side Dishes", description: "Accompaniments and smaller portions", active: true },
      { name: "Spicy Selections", description: "Dishes with an extra kick of heat", active: true },
      { name: "House Specials", description: "Signature dishes of our restaurant", active: true }
    ];
    
    try {
      console.log('Adding initial categories...');
      const { error } = await supabase
        .from('menu_categories')
        .insert(initialCategories);
      
      if (error) throw error;
      toast.success('Initial menu categories have been created');
    } catch (error) {
      console.error('Error seeding initial categories:', error);
      toast.error('Failed to create initial categories');
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
    error,
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
    handleToggleStatus,
    loadCategories
  };
};
