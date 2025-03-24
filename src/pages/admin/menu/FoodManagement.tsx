
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ChevronLeft, Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { DialogContent, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog";
import { MenuNav } from "@/components/menu/MenuNav";
import { useFoodManagement } from "@/hooks/useFoodManagement";
import FoodItemCard from "@/components/admin/menu/FoodItemCard";
import FoodItemForm from "@/components/admin/menu/FoodItemForm";

const FoodManagement = () => {
  const { t } = useLanguage();
  const {
    isLoading,
    foodItems,
    categories,
    searchQuery,
    setSearchQuery,
    openDialog,
    setOpenDialog,
    editMode,
    formData,
    handleOpenDialog,
    handleEditFoodItem,
    handleCloseDialog,
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    toggleAvailability,
  } = useFoodManagement();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Food Management" />}
        description={<T text="Manage your restaurant's food items" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <ChevronLeft className="mr-2 h-4 w-4" />
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button onClick={handleOpenDialog}>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Add Food Item" />
            </Button>
          </>
        }
      />

      <MenuNav />

      <div className="mb-4">
        <Input
          type="search"
          placeholder={t("Search food items...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.map((item) => (
            <FoodItemCard
              key={item.id}
              item={item}
              onEdit={handleEditFoodItem}
              onDelete={deleteFoodItem}
              onToggleAvailability={toggleAvailability}
            />
          ))}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editMode ? <T text="Edit Food Item" /> : <T text="Add Food Item" />}
            </DialogTitle>
          </DialogHeader>
          <FoodItemForm
            formData={formData}
            categories={categories}
            isLoading={isLoading}
            editMode={editMode}
            onInputChange={handleInputChange}
            onSwitchChange={handleSwitchChange}
            onSelectChange={handleSelectChange}
            onCancel={handleCloseDialog}
            onSubmit={editMode ? updateFoodItem : addFoodItem}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodManagement;
