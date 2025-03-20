
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Edit, ChevronLeft, Trash2, Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MenuNav } from "@/components/menu/MenuNav";
import { Switch } from "@/components/ui/switch";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  image_url: string | null;
  itemCount?: number;
}

const Categories = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewCategory(prev => ({ ...prev, active: checked }));
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast.error('Category name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('menu_categories')
        .insert({
          name: newCategory.name,
          description: newCategory.description || null,
          active: newCategory.active,
          image_url: newCategory.image_url
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Category added successfully');
      
      setCategories([...categories, { ...data, itemCount: 0 }]);
      
      setNewCategory({
        name: "",
        description: "",
        active: true,
        image_url: null
      });
      setShowAddDialog(false);
      
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
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

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Menu Categories" />}
          description={<T text="Organize your menu with categories for easier navigation" />}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link to="/admin/menu">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <T text="Back to Menu" />
                </Link>
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    <T text="Add Category" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle><T text="Add New Category" /></DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name"><T text="Category Name" /></Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={newCategory.name}
                        onChange={handleInputChange}
                        placeholder={t("Enter category name")} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description"><T text="Description" /></Label>
                      <Textarea 
                        id="description" 
                        name="description"
                        value={newCategory.description || ""}
                        onChange={handleInputChange}
                        placeholder={t("Enter category description")}
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="active"
                        checked={newCategory.active}
                        onCheckedChange={handleSwitchChange}
                      />
                      <Label htmlFor="active"><T text="Active" /></Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddCategory} disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      <T text="Add Category" />
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          }
        />

        <MenuNav />

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {categories.length === 0 ? (
              <Card className="p-6 col-span-full text-center">
                <p className="text-muted-foreground"><T text="No categories found. Create your first category!" /></p>
              </Card>
            ) : (
              categories.map((category) => (
                <Card key={category.id} className={`overflow-hidden ${!category.active ? 'opacity-60' : ''}`}>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.itemCount} <T text="items" />
                          {!category.active && (
                            <span className="ml-2 text-red-500">(<T text="Inactive" />)</span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(category.id, category.active)}>
                          {category.active ? <T text="Deactivate" /> : <T text="Activate" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-sm mt-2">{category.description}</p>
                    )}
                  </div>
                </Card>
              ))
            )}
            <Card className="p-4 border-dashed flex justify-center items-center h-32">
              <Button variant="ghost" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-5 w-5 mr-2" />
                <T text="Add Category" />
              </Button>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
