import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { 
  Calculator, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ChevronsUpDown,
  Utensils,
  Wallet,
  Flame,
  Percent,
  Clock,
  DollarSign,
  BadgePoundSterling,
  PencilLine,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SideModal } from "@/components/ui/side-modal";
import { useIsMobile } from "@/hooks/use-mobile";
import { Checkbox } from "@/components/ui/checkbox";
import { useDishCosts } from "@/hooks/useDishCosts";
import { 
  DishCost as DishCostType, 
  Ingredient, 
  MeasurementUnit, 
  NewDishIngredient, 
  NewDishOverheadCost,
  NewDishCost
} from "@/types/dishCost";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMenuItems } from "@/hooks/useMenuItems";

const DishCostPage = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { foodItems } = useMenuItems();
  const {
    dishCosts,
    costHistory,
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
  const [editDishCostId, setEditDishCostId] = useState<string | null>(null);
  
  const [newUnit, setNewUnit] = useState({
    name: "",
    abbreviation: "",
    description: "",
    type: "weight"
  });
  
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    category: "",
    unit: "kg",
    cost: 0
  });
  
  const [newDishCost, setNewDishCost] = useState<NewDishCost>({
    dish_name: "",
    food_item_id: null,
    profit_margin: 70,
    use_manual_price: false,
    manual_price: null,
    ingredients: [],
    overhead_costs: []
  });

  const initNewDishCost = (dishCost?: DishCostType) => {
    if (dishCost) {
      setNewDishCost({
        dish_name: dishCost.dish_name,
        food_item_id: dishCost.food_item_id,
        profit_margin: dishCost.profit_margin,
        use_manual_price: dishCost.use_manual_price,
        manual_price: dishCost.manual_price,
        ingredients: dishCost.dish_ingredients?.map(ing => ({
          ingredient_id: ing.ingredient_id,
          ingredient_name: ing.ingredient_name,
          quantity: ing.quantity,
          unit_type: ing.unit_type,
          unit_cost: ing.unit_cost,
          total_cost: ing.total_cost
        })) || [],
        overhead_costs: dishCost.dish_overhead_costs?.map(cost => ({
          category: cost.category,
          description: cost.description,
          cost: cost.cost
        })) || []
      });
    } else {
      setNewDishCost({
        dish_name: "",
        food_item_id: null,
        profit_margin: 70,
        use_manual_price: false,
        manual_price: null,
        ingredients: [],
        overhead_costs: [{
          category: "Labor",
          description: "Chef time",
          cost: 1.50
        }]
      });
    }
  };

  const openDishCostModal = (dishCost?: DishCostType) => {
    if (dishCost) {
      setEditDishCostId(dishCost.id);
      initNewDishCost(dishCost);
    } else {
      setEditDishCostId(null);
      initNewDishCost();
    }
    setShowDishCostModal(true);
  };

  const addIngredientToDish = () => {
    const defaultIngredient = ingredients[0];
    if (!defaultIngredient) return;
    
    const newIngredientItem: NewDishIngredient = {
      ingredient_id: defaultIngredient.id,
      ingredient_name: defaultIngredient.name,
      quantity: 0.5,
      unit_type: defaultIngredient.unit,
      unit_cost: defaultIngredient.cost,
      total_cost: 0.5 * defaultIngredient.cost
    };
    
    setNewDishCost(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredientItem]
    }));
  };

  const updateIngredientInDish = (index: number, field: keyof NewDishIngredient, value: any) => {
    setNewDishCost(prev => {
      const updatedIngredients = [...prev.ingredients];
      const updatedIngredient = { ...updatedIngredients[index], [field]: value };
      
      if (field === 'ingredient_id') {
        const selectedIngredient = ingredients.find(i => i.id === value);
        if (selectedIngredient) {
          updatedIngredient.ingredient_name = selectedIngredient.name;
          updatedIngredient.unit_type = selectedIngredient.unit;
          updatedIngredient.unit_cost = selectedIngredient.cost;
          updatedIngredient.total_cost = updatedIngredient.quantity * selectedIngredient.cost;
        }
      }
      
      if (field === 'quantity') {
        updatedIngredient.total_cost = Number(value) * updatedIngredient.unit_cost;
      }
      
      if (field === 'unit_cost') {
        updatedIngredient.total_cost = updatedIngredient.quantity * Number(value);
      }
      
      updatedIngredients[index] = updatedIngredient;
      return { ...prev, ingredients: updatedIngredients };
    });
  };

  const removeIngredientFromDish = (index: number) => {
    setNewDishCost(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addOverheadCostToDish = () => {
    const newCost: NewDishOverheadCost = {
      category: "Utilities",
      description: "Gas consumption",
      cost: 0.45
    };
    
    setNewDishCost(prev => ({
      ...prev,
      overhead_costs: [...prev.overhead_costs, newCost]
    }));
  };

  const updateOverheadCostInDish = (index: number, field: keyof NewDishOverheadCost, value: any) => {
    setNewDishCost(prev => {
      const updatedCosts = [...prev.overhead_costs];
      updatedCosts[index] = { ...updatedCosts[index], [field]: value };
      return { ...prev, overhead_costs: updatedCosts };
    });
  };

  const removeOverheadCostFromDish = (index: number) => {
    setNewDishCost(prev => ({
      ...prev,
      overhead_costs: prev.overhead_costs.filter((_, i) => i !== index)
    }));
  };

  const calculateDishCostTotals = () => {
    const totalIngredientCost = newDishCost.ingredients.reduce((sum, ing) => sum + ing.total_cost, 0);
    const totalOverheadCost = newDishCost.overhead_costs.reduce((sum, cost) => sum + cost.cost, 0);
    const totalCost = totalIngredientCost + totalOverheadCost;
    const suggestedPrice = totalCost > 0 ? totalCost / (1 - (newDishCost.profit_margin / 100)) : 0;
    return {
      totalIngredientCost,
      totalOverheadCost,
      totalCost,
      suggestedPrice
    };
  };

  const handleDishCostSubmit = async () => {
    try {
      if (editDishCostId) {
        await updateDishCost(editDishCostId, newDishCost);
      } else {
        await createDishCost(newDishCost);
      }
      setShowDishCostModal(false);
    } catch (error) {
      console.error("Error submitting dish cost:", error);
    }
  };

  const handleUnitSubmit = async () => {
    try {
      await createUnit(newUnit);
      setShowUnitModal(false);
      setNewUnit({
        name: "",
        abbreviation: "",
        description: "",
        type: "weight"
      });
    } catch (error) {
      console.error("Error submitting unit:", error);
    }
  };

  const handleIngredientSubmit = async () => {
    try {
      await createIngredient(newIngredient);
      setShowIngredientModal(false);
      setNewIngredient({
        name: "",
        category: "",
        unit: "kg",
        cost: 0
      });
    } catch (error) {
      console.error("Error submitting ingredient:", error);
    }
  };

  const filteredDishCosts = dishCosts.filter(dish => 
    dish.dish_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIngredients = ingredients.filter(ingredient => 
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ingredient.category && ingredient.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <CardTitle><T text="Dish Cost Analysis" /></CardTitle>
                  <Button onClick={() => setShowDishCostModal(true)}>
                    <Plus className="mr-1 h-4 w-4" />
                    <T text="Add Dish Cost" />
                  </Button>
                </div>
                <CardDescription><T text="Track the costs of ingredients and overhead for each dish" /></CardDescription>
                <div className="mt-2">
                  <InputWithIcon
                    placeholder={t("Search dishes...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                    icon={<Search className="h-4 w-4" />}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {dishCosts.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <T text="No dish costs have been added yet. Click 'Add Dish Cost' to get started." />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dishCosts.map(dish => (
                      <Card key={dish.id} className="shadow-sm hover:shadow transition-shadow">
                        <CardHeader className="pb-2 pt-4">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <CardTitle className="text-lg">{dish.dishName}</CardTitle>
                              <div className="flex mt-1 flex-wrap gap-2">
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                                  <T text="Cost" />: £{dish.totalCost.toFixed(2)}
                                </Badge>
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                                  {dish.useManualPrice && dish.manualPrice ? (
                                    <span><T text="Manual Price" />: £{dish.manualPrice.toFixed(2)}</span>
                                  ) : (
                                    <span><T text="Suggested Price" />: £{dish.suggestedPrice.toFixed(2)}</span>
                                  )}
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                  <T text="Margin" />: {dish.profitMargin}%
                                </Badge>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                            <div className="flex items-center text-sm">
                              <Utensils className="h-4 w-4 mr-2 text-amber-500" />
                              <span><T text="Ingredients" />: {dish.ingredients.length}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Wallet className="h-4 w-4 mr-2 text-amber-500" />
                              <span><T text="Overhead Costs" />: {dish.otherCosts.length}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <BadgePoundSterling className="h-4 w-4 mr-2 text-green-600" />
                              <span><T text="Profit" />: £{((dish.useManualPrice && dish.manualPrice ? dish.manualPrice : dish.suggestedPrice) - dish.totalCost).toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="text-sm font-medium mb-1"><T text="Cost Breakdown" /></div>
                            <div className="space-y-1">
                              <div className="flex items-center text-xs">
                                <Utensils className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0" />
                                <div className="flex-1">
                                  <T text="Ingredients" />
                                </div>
                                <div className="text-right">
                                  £{dish.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0).toFixed(2)}
                                </div>
                              </div>
                              <div className="flex items-center text-xs">
                                <Flame className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0" />
                                <div className="flex-1">
                                  <T text="Utilities" />
                                </div>
                                <div className="text-right">
                                  £{dish.otherCosts.filter(c => c.category === "Utilities").reduce((sum, c) => sum + c.cost, 0).toFixed(2)}
                                </div>
                              </div>
                              <div className="flex items-center text-xs">
                                <Clock className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0" />
                                <div className="flex-1">
                                  <T text="Labor" />
                                </div>
                                <div className="text-right">
                                  £{dish.otherCosts.filter(c => c.category === "Labor").reduce((sum, c) => sum + c.cost, 0).toFixed(2)}
                                </div>
                              </div>
                              <div className="flex items-center text-xs">
                                <Percent className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0" />
                                <div className="flex-1">
                                  <T text="Other Overhead" />
                                </div>
                                <div className="text-right">
                                  £{dish.otherCosts.filter(c => c.category === "Overhead").reduce((sum, c) => sum + c.cost, 0).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ingredients">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <CardTitle><T text="Ingredients with Costs" /></CardTitle>
                  <Button onClick={() => setShowIngredientModal(true)}>
                    <Plus className="mr-1 h-4 w-4" />
                    <T text="Add Ingredient" />
                  </Button>
                </div>
                <CardDescription><T text="Manage ingredients and their costs for dish calculations" /></CardDescription>
                <div className="mt-2">
                  <InputWithIcon
                    placeholder={t("Search ingredients...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                    icon={<Search className="h-4 w-4" />}
                  />
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Name" /></TableHead>
                      <TableHead><T text="Category" /></TableHead>
                      <TableHead><T text="Unit" /></TableHead>
                      <TableHead><T text="Cost per Unit" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingredients.map((ingredient) => (
                      <TableRow key={ingredient.id}>
                        <TableCell className="font-medium">{ingredient.name}</TableCell>
                        <TableCell>{ingredient.category}</TableCell>
                        <TableCell>{ingredient.unitType}</TableCell>
                        <TableCell>£{ingredient.unitCost.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="units">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <CardTitle><T text="Unit Types" /></CardTitle>
                  <Button onClick={() => setShowUnitModal(true)}>
                    <Plus className="mr-1 h-4 w-4" />
                    <T text="Add Unit Type" />
                  </Button>
                </div>
                <CardDescription><T text="Manage measurement units for ingredients" /></CardDescription>
                <div className="mt-2">
                  <InputWithIcon
                    placeholder={t("Search unit types...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                    icon={<Search className="h-4 w-4" />}
                  />
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Name" /></TableHead>
                      <TableHead><T text="Abbreviation" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unitTypes.map((unit) => (
                      <TableRow key={unit.id}>
                        <TableCell className="font-medium">{unit.name}</TableCell>
                        <TableCell>{unit.abbreviation}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <SideModal
        open={showUnitModal}
        onOpenChange={setShowUnitModal}
        title={<T text="Add Unit Type" />}
        description={<T text="Create a new measurement unit for ingredients" />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Unit Name" /></label>
            <Input placeholder={t("e.g., Kilogram, Liter")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Abbreviation" /></label>
            <Input placeholder={t("e.g., kg, L")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Description (Optional)" /></label>
            <Input placeholder={t("Brief description of the unit")} />
          </div>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowUnitModal(false)}>
              <T text="Cancel" />
            </Button>
            <Button>
              <T text="Save Unit" />
            </Button>
          </div>
        </div>
      </SideModal>
      
      <SideModal
        open={showIngredientModal}
        onOpenChange={setShowIngredientModal}
        title={<T text="Add Ingredient" />}
        description={<T text="Create a new ingredient with cost information" />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Ingredient Name" /></label>
            <Input placeholder={t("e.g., Beef, Onion")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Category" /></label>
            <Input placeholder={t("e.g., Meat, Vegetable")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Unit Type" /></label>
            <select className="w-full p-2 border rounded">
              {unitTypes.map(unit => (
                <option key={unit.id} value={unit.abbreviation}>
                  {unit.name} ({unit.abbreviation})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Cost per Unit (£)" /></label>
            <Input type="number" step="0.01" placeholder="0.00" />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowIngredientModal(false)}>
              <T text="Cancel" />
            </Button>
            <Button>
              <T text="Save Ingredient" />
            </Button>
          </div>
        </div>
      </SideModal>
      
      <SideModal
        open={showDishCostModal}
        onOpenChange={setShowDishCostModal}
        title={<T text="Add Dish Cost" />}
        description={<T text="Calculate the cost of a dish including ingredients and overhead" />}
        width="lg"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium"><T text="Dish Name" /></label>
              <Input placeholder={t("e.g., Beef Tibs, Doro Wat")} />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2"><T text="Ingredients" /></h3>
              <div className="space-y-3 mb-2">
                <div className="p-3 border rounded-md">
                  <div className="grid grid-cols-12 gap-2">
                    <div className={isMobile ? "col-span-12" : "col-span-4"}>
                      <label className="text-xs text-muted-foreground"><T text="Ingredient" /></label>
                      <select className="w-full p-1.5 border rounded text-sm">
                        {ingredients.map(ing => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={isMobile ? "col-span-6" : "col-span-3"}>
                      <label className="text-xs text-muted-foreground"><T text="Quantity" /></label>
                      <Input type="number" step="0.01" className="text-sm" defaultValue="0.5" />
                    </div>
                    <div className={isMobile ? "col-span-6" : "col-span-2"}>
                      <label className="text-xs text-muted-foreground"><T text="Unit" /></label>
                      <div className="p-1.5 border rounded text-sm bg-muted">kg</div>
                    </div>
                    <div className={isMobile ? "col-span-12" : "col-span-3"}>
                      <label className="text-xs text-muted-foreground"><T text="Cost" /></label>
                      <div className="p-1.5 border rounded text-sm text-right bg-muted">£5.00</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="grid grid-cols-12 gap-2">
                    <div className={isMobile ? "col-span-12" : "col-span-4"}>
                      <label className="text-xs text-muted-foreground"><T text="Ingredient" /></label>
                      <select className="w-full p-1.5 border rounded text-sm">
                        {ingredients.map(ing => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={isMobile ? "col-span-6" : "col-span-3"}>
                      <label className="text-xs text-muted-foreground"><T text="Quantity" /></label>
                      <Input type="number" step="0.01" className="text-sm" defaultValue="0.2" />
                    </div>
                    <div className={isMobile ? "col-span-6" : "col-span-2"}>
                      <label className="text-xs text-muted-foreground"><T text="Unit" /></label>
                      <div className="p-1.5 border rounded text-sm bg-muted">kg</div>
                    </div>
                    <div className={isMobile ? "col-span-12" : "col-span-3"}>
                      <label className="text-xs text-muted-foreground"><T text="Cost" /></label>
                      <div className="p-1.5 border rounded text-sm text-right bg-muted">£0.24</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Plus className="h-3 w-3 mr-1" />
                <T text="Add Ingredient" />
              </Button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2"><T text="Other Costs" /></h3>
              <div className="space-y-3 mb-2">
                <div className="p-3 border rounded-md">
                  <div className="grid grid-cols-12 gap-2">
                    <div className={isMobile ? "col-span-12" : "col-span-4"}>
                      <label className="text-xs text-muted-foreground"><T text="Category" /></label>
                      <select className="w-full p-1.5 border rounded text-sm">
                        <option value="Labor">Labor</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Overhead">Overhead</option>
                      </select>
                    </div>
                    <div className={isMobile ? "col-span-12" : "col-span-5"}>
                      <label className="text-xs text-muted-foreground"><T text="Description" /></label>
                      <Input className="text-sm" defaultValue="Chef time" />
                    </div>
                    <div className={isMobile ? "col-span-12" : "col-span-3"}>
                      <label className="text-xs text-muted-foreground"><T text="Cost (£)" /></label>
                      <Input type="number" step="0.01" className="text-sm" defaultValue="1.50" />
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="grid grid-cols-12 gap-2">
                    <div className={isMobile ? "col-span-12" : "col-span-4"}>
                      <label className="text-xs text-muted-foreground"><T text="Category" /></label>
                      <select className="w-full p-1.5 border rounded text-sm">
                        <option value="Labor">Labor</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Overhead">Overhead</option>
                      </select>
                    </div>
                    <div className={isMobile ? "col-span-12" : "col-span-5"}>
                      <label className="text-xs text-muted-foreground"><T text="Description" /></label>
                      <Input className="text-sm" defaultValue="Gas consumption" />
                    </div>
                    <div className={isMobile ? "col-span-12" : "col-span-3"}>
                      <label className="text-xs text-muted-foreground"><T text="Cost (£)" /></label>
                      <Input type="number" step="0.01" className="text-sm" defaultValue="0.45" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Plus className="h-3 w-3 mr-1" />
                <T text="Add Other Cost" />
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-3"><T text="Cost Summary" /></h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span><T text="Ingredient Costs" /></span>
                    <span className="font-medium">£6.29</span>
                  </div>
                  <div className="flex justify-between">
                    <span><T text="Other Costs" /></span>
                    <span className="font-medium">£2.66</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 font-medium">
                    <span><T text="Total Cost" /></span>
                    <span className="text-amber-600">£8.95</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3"><T text="Pricing" /></h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm"><T text="Profit Margin (%)" /></label>
                    <Input type="number" defaultValue="70" />
                  </div>
                  <div className="pt-1 flex justify-between text-sm">
                    <span><T text="Suggested Price" /></span>
                    <span className="font-medium text-green-600">£15.22</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <input 
                        type="checkbox" 
                        id="useManualPrice" 
                        checked={useManualPrice}
                        onChange={(e) => setUseManualPrice(e.target.checked)}
                        className="h-4 w-4 rounded text-primary border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="useManualPrice" className="text-sm font-medium cursor-pointer">
                        <T text="Use Manual Price" />
                      </label>
                    </div>
                    
                    {useManualPrice && (
                      <div className="space-y-2">
                        <label className="text-sm"><T text="Manual Price (£)" /></label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            value={manualPrice}
                            onChange={(e) => setManualPrice(e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            £
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDishCostModal(false)}>
              <T text="Cancel" />
            </Button>
            <Button>
              <T text="Save Dish Cost" />
            </Button>
          </div>
        </div>
      </SideModal>
    </div>
  );
};

export default DishCostPage;

