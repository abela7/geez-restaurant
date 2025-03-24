
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { Calculator, ChevronsUpDown, Utensils } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDishCosts } from "@/hooks/useDishCosts";
import { DishCost, Ingredient, MeasurementUnit } from "@/types/dishCost";
import { useMenuItems } from "@/hooks/useMenuItems";
import DishCostList from "@/components/dish-cost/DishCostList";
import IngredientsTable from "@/components/dish-cost/IngredientsTable";
import UnitsTable from "@/components/dish-cost/UnitsTable";
import AddUnitModal from "@/components/dish-cost/AddUnitModal";
import AddIngredientModal from "@/components/dish-cost/AddIngredientModal";
import DishCostModal from "@/components/dish-cost/DishCostModal";
import { toast } from "sonner";

const DishCostPage: React.FC = () => {
  const { t } = useLanguage();
  const { menuItems } = useMenuItems();
  const {
    dishCosts,
    ingredients,
    units,
    isLoading,
    error,
    createDishCost,
    updateDishCost,
    deleteDishCost,
    createUnit,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    updateUnit,
    deleteUnit,
    loadInitialData
  } = useDishCosts();

  const [activeTab, setActiveTab] = useState("dishCosts");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showDishCostModal, setShowDishCostModal] = useState(false);
  const [editDishCost, setEditDishCost] = useState<DishCost | undefined>(undefined);
  const [editIngredient, setEditIngredient] = useState<Ingredient | undefined>(undefined);
  const [editUnit, setEditUnit] = useState<MeasurementUnit | undefined>(undefined);

  // Reload data when component mounts
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle opening the dish cost modal for editing or creating
  const handleOpenDishCostModal = (dish?: DishCost) => {
    setEditDishCost(dish);
    setShowDishCostModal(true);
  };

  // Handle opening the ingredient modal for editing or creating
  const handleOpenIngredientModal = (ingredient?: Ingredient) => {
    setEditIngredient(ingredient);
    setShowIngredientModal(true);
  };

  // Handle opening the unit modal for editing or creating
  const handleOpenUnitModal = (unit?: MeasurementUnit) => {
    setEditUnit(unit);
    setShowUnitModal(true);
  };

  // Handle dish cost submission (create or update)
  const handleDishCostSubmit = async (formData: any) => {
    try {
      if (editDishCost) {
        await updateDishCost(editDishCost.id, formData);
        toast.success(t("Dish cost updated successfully"));
      } else {
        await createDishCost(formData);
        toast.success(t("Dish cost created successfully"));
      }
      setShowDishCostModal(false);
      setEditDishCost(undefined);
    } catch (error) {
      console.error("Error submitting dish cost:", error);
      toast.error(t("Error saving dish cost"));
    }
  };

  // Handle ingredient submission (create or update)
  const handleIngredientSubmit = async (formData: any) => {
    try {
      if (editIngredient) {
        await updateIngredient(editIngredient.id, formData);
        toast.success(t("Ingredient updated successfully"));
      } else {
        await createIngredient(formData);
        toast.success(t("Ingredient created successfully"));
      }
      setShowIngredientModal(false);
      setEditIngredient(undefined);
    } catch (error) {
      console.error("Error submitting ingredient:", error);
      toast.error(t("Error saving ingredient"));
    }
  };

  // Handle unit submission (create or update)
  const handleUnitSubmit = async (formData: any) => {
    try {
      if (editUnit) {
        await updateUnit(editUnit.id, formData);
        toast.success(t("Unit updated successfully"));
      } else {
        await createUnit(formData);
        toast.success(t("Unit created successfully"));
      }
      setShowUnitModal(false);
      setEditUnit(undefined);
    } catch (error) {
      console.error("Error submitting unit:", error);
      toast.error(t("Error saving unit"));
    }
  };

  // Handle deletion of a dish cost
  const handleDeleteDishCost = async (id: string) => {
    if (window.confirm(t("Are you sure you want to delete this dish cost?"))) {
      try {
        await deleteDishCost(id);
        toast.success(t("Dish cost deleted successfully"));
      } catch (error) {
        console.error("Error deleting dish cost:", error);
        toast.error(t("Error deleting dish cost"));
      }
    }
  };

  // Handle deletion of an ingredient
  const handleDeleteIngredient = async (id: string) => {
    try {
      await deleteIngredient(id);
      toast.success(t("Ingredient deleted successfully"));
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      toast.error(t("Error deleting ingredient"));
    }
  };

  // Handle deletion of a unit
  const handleDeleteUnit = async (id: string) => {
    try {
      await deleteUnit(id);
      toast.success(t("Unit deleted successfully"));
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast.error(t("Error deleting unit"));
    }
  };

  // Reset search query when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-3 md:p-6">
        <PageHeader 
          title={<T text="Dish Cost Management" />}
          description={<T text="Track and manage ingredient costs and pricing for dishes" />}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link to="/admin/menu">
                  <T text="Back to Menu" />
                </Link>
              </Button>
            </>
          }
        />
        <MenuNav />
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-3 md:p-6">
        <PageHeader 
          title={<T text="Dish Cost Management" />}
          description={<T text="Track and manage ingredient costs and pricing for dishes" />}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link to="/admin/menu">
                  <T text="Back to Menu" />
                </Link>
              </Button>
            </>
          }
        />
        <MenuNav />
        <div className="p-6 bg-red-50 text-red-600 rounded-lg">
          <T text="Error loading data. Please try again later." />
          <Button variant="outline" className="mt-4" onClick={loadInitialData}>
            <T text="Retry" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 md:p-6">
      <PageHeader 
        title={<T text="Dish Cost Management" />}
        description={<T text="Track and manage ingredient costs and pricing for dishes" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <T text="Back to Menu" />
              </Link>
            </Button>
          </>
        }
      />

      <MenuNav />
      
      <div className="mb-6">
        <Tabs defaultValue="dishCosts" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="dishCosts">
              <Calculator className="h-4 w-4 mr-2" />
              <T text="Dish Costs" />
            </TabsTrigger>
            <TabsTrigger value="ingredients">
              <Utensils className="h-4 w-4 mr-2" />
              <T text="Ingredients" />
            </TabsTrigger>
            <TabsTrigger value="units">
              <ChevronsUpDown className="h-4 w-4 mr-2" />
              <T text="Unit Types" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dishCosts">
            <DishCostList 
              dishCosts={dishCosts}
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              onAddDishCost={() => handleOpenDishCostModal()}
              onEditDishCost={handleOpenDishCostModal}
              onDeleteDishCost={handleDeleteDishCost}
            />
          </TabsContent>
          
          <TabsContent value="ingredients">
            <IngredientsTable 
              ingredients={ingredients}
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              onAddIngredient={() => handleOpenIngredientModal()}
              onEditIngredient={handleOpenIngredientModal}
              onDeleteIngredient={handleDeleteIngredient}
            />
          </TabsContent>
          
          <TabsContent value="units">
            <UnitsTable 
              units={units}
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              onAddUnit={() => handleOpenUnitModal()}
              onEditUnit={handleOpenUnitModal}
              onDeleteUnit={handleDeleteUnit}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modals */}
      <AddUnitModal 
        open={showUnitModal}
        onOpenChange={setShowUnitModal}
        onSubmit={handleUnitSubmit}
        unit={editUnit}
      />
      
      <AddIngredientModal 
        open={showIngredientModal}
        onOpenChange={setShowIngredientModal}
        onSubmit={handleIngredientSubmit}
        units={units}
        ingredient={editIngredient}
      />
      
      <DishCostModal 
        open={showDishCostModal}
        onOpenChange={setShowDishCostModal}
        onSubmit={handleDishCostSubmit}
        dishCost={editDishCost}
        ingredients={ingredients}
        foodItems={menuItems}
      />
    </div>
  );
};

export default DishCostPage;
