
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, Loader2, LayoutGrid, List } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { CategoryCard } from "@/components/menu/CategoryCard";
import { CategorySideModal } from "@/components/menu/CategorySideModal";
import { DeleteCategorySideModal } from "@/components/menu/DeleteCategorySideModal";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Categories = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
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

      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-lg font-medium"><T text="All Categories" /></h2>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <div className="space-y-3">
              {categories.length === 0 ? (
                <Card className="p-6 text-center">
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
                    viewMode="list"
                  />
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    viewMode="grid"
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
        </>
      )}

      {/* Side modals replacing dialogs */}
      <CategorySideModal
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        formData={formData}
        onChange={handleInputChange}
        onSwitchChange={handleSwitchChange}
        onSubmit={handleAddCategory}
        isLoading={isLoading}
        mode="add"
      />
      
      <CategorySideModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        formData={formData}
        onChange={handleInputChange}
        onSwitchChange={handleSwitchChange}
        onSubmit={confirmEditCategory}
        isLoading={isLoading}
        mode="edit"
      />
      
      <DeleteCategorySideModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        category={currentCategory}
        onSubmit={confirmDeleteCategory}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Categories;
