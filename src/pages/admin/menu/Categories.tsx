
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, Loader2, LayoutGrid, List, RefreshCw, AlertCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { CategoryCard } from "@/components/menu/CategoryCard";
import { CategorySideModal } from "@/components/menu/CategorySideModal";
import { DeleteCategorySideModal } from "@/components/menu/DeleteCategorySideModal";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Categories = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isRetrying, setIsRetrying] = useState(false);
  
  const {
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
  } = useCategoryManagement();

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await loadCategories();
    } catch (error) {
      console.error("Manual retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  };

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
            {!error && (
              <Button onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                <T text="Add Category" />
              </Button>
            )}
            {error && (
              <Button 
                variant="outline" 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="text-amber-600 border-amber-600 hover:bg-amber-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                <T text={isRetrying ? "Refreshing..." : "Refresh Data"} />
              </Button>
            )}
          </>
        }
      />

      <MenuNav />

      {error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle><T text="Error Loading Categories" /></AlertTitle>
          <AlertDescription className="space-y-4">
            <p><T text="There was a problem loading the menu categories. This might be due to connection issues with the database." /></p>
            <div className="flex gap-3">
              <Button 
                onClick={handleRetry} 
                variant="outline" 
                disabled={isRetrying}
                className="bg-white hover:bg-gray-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                <T text={isRetrying ? "Retrying..." : "Retry"} />
              </Button>
              <Button asChild variant="outline" className="bg-white hover:bg-gray-50">
                <Link to="/admin/menu">
                  <T text="Back to Menu" />
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <>
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
            <Card>
              <CardContent className="flex justify-center items-center p-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">
                    <T text="Loading categories..." />
                  </p>
                </div>
              </CardContent>
            </Card>
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
