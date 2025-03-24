
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { Calculator, ChevronsUpDown, Utensils } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDishCosts } from "@/hooks/useDishCosts";
import { DishCost } from "@/types/dishCost";
import { useMenuItems } from "@/hooks/useMenuItems";
import DishCostList from "@/components/dish-cost/DishCostList";
import IngredientsTable from "@/components/dish-cost/IngredientsTable";
import UnitsTable from "@/components/dish-cost/UnitsTable";
import AddUnitModal from "@/components/dish-cost/AddUnitModal";
import AddIngredientModal from "@/components/dish-cost/AddIngredientModal";
import DishCostModal from "@/components/dish-cost/DishCostModal";

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
    createIngredient
  } = useDishCosts();

  const [activeTab, setActiveTab] = useState("dishCosts");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showDishCostModal, setShowDishCostModal] = useState(false);
  const [editDishCost, setEditDishCost] = useState<DishCost | undefined>(undefined);

  // Handle opening the dish cost modal for editing or creating
  const handleOpenDishCostModal = (dish?: DishCost) => {
    setEditDishCost(dish);
    setShowDishCostModal(true);
  };

  // Handle dish cost submission (create or update)
  const handleDishCostSubmit = async (formData: any) => {
    if (editDishCost) {
      await updateDishCost(editDishCost.id, formData);
    } else {
      await createDishCost(formData);
    }
    setShowDishCostModal(false);
    setEditDishCost(undefined);
  };

  // Handle deletion of a dish cost
  const handleDeleteDishCost = async (id: string) => {
    if (window.confirm(t("Are you sure you want to delete this dish cost?"))) {
      await deleteDishCost(id);
    }
  };

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
        <Tabs defaultValue="dishCosts" className="w-full" onValueChange={setActiveTab}>
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
              onAddIngredient={() => setShowIngredientModal(true)}
            />
          </TabsContent>
          
          <TabsContent value="units">
            <UnitsTable 
              units={units}
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              onAddUnit={() => setShowUnitModal(true)}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modals */}
      <AddUnitModal 
        open={showUnitModal}
        onOpenChange={setShowUnitModal}
        onSubmit={createUnit}
      />
      
      <AddIngredientModal 
        open={showIngredientModal}
        onOpenChange={setShowIngredientModal}
        onSubmit={createIngredient}
        units={units}
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
