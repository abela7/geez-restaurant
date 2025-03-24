
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import Layout from "@/components/Layout";
import { CategoryCard } from "@/components/menu/CategoryCard";
import { AddCategoryDialog } from "@/components/menu/AddCategoryDialog";
import { EditCategoryDialog } from "@/components/menu/EditCategoryDialog";
import { DeleteCategoryDialog } from "@/components/menu/DeleteCategoryDialog";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";

const Categories = () => {
  const { t } = useLanguage();
  
  const {
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
  } = useCategoryManagement();

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
              <Button onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                <T text="Add Category" />
              </Button>
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
                <CategoryCard 
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  onToggleStatus={handleToggleStatus}
                />
              ))
            )}
            <Card className="p-4 border-dashed flex justify-center items-center h-32">
              <Button variant="ghost" onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}>
                <Plus className="h-5 w-5 mr-2" />
                <T text="Add Category" />
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddCategoryDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        formData={formData}
        onChange={handleInputChange}
        onSwitchChange={handleSwitchChange}
        onSubmit={handleAddCategory}
        isLoading={isLoading}
      />
      
      <EditCategoryDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        formData={formData}
        onChange={handleInputChange}
        onSwitchChange={handleSwitchChange}
        onSubmit={confirmEditCategory}
        isLoading={isLoading}
      />
      
      <DeleteCategoryDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        category={currentCategory}
        onSubmit={confirmDeleteCategory}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default Categories;
