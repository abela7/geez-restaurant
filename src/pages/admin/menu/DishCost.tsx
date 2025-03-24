
import React, { useState } from "react";
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
  DollarSign
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SideModal } from "@/components/ui/side-modal";

// Define unit types for ingredients
interface UnitType {
  id: string;
  name: string;
  abbreviation: string;
}

// Define ingredient with cost information
interface Ingredient {
  id: string;
  name: string;
  unitType: string;
  unitCost: number;
  category: string;
}

// Define a dish with its cost breakdown
interface DishCost {
  id: string;
  dishName: string;
  totalCost: number;
  ingredients: {
    id: string;
    ingredientId: string;
    ingredientName: string;
    quantity: number;
    unitType: string;
    unitCost: number;
    totalCost: number;
  }[];
  otherCosts: {
    id: string;
    category: string;
    description: string;
    cost: number;
  }[];
  profitMargin: number;
  suggestedPrice: number;
}

const DishCost = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("units");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showDishCostModal, setShowDishCostModal] = useState(false);
  
  // Sample data for unit types
  const unitTypes: UnitType[] = [
    { id: "1", name: "Kilogram", abbreviation: "kg" },
    { id: "2", name: "Gram", abbreviation: "g" },
    { id: "3", name: "Liter", abbreviation: "L" },
    { id: "4", name: "Milliliter", abbreviation: "mL" },
    { id: "5", name: "Count", abbreviation: "pcs" },
    { id: "6", name: "Package", abbreviation: "pkg" },
    { id: "7", name: "Dozen", abbreviation: "doz" },
    { id: "8", name: "Tablespoon", abbreviation: "tbsp" },
    { id: "9", name: "Teaspoon", abbreviation: "tsp" },
  ];
  
  // Sample data for ingredients
  const ingredients: Ingredient[] = [
    { id: "1", name: "Beef", unitType: "kg", unitCost: 10, category: "Meat" },
    { id: "2", name: "Chicken", unitType: "kg", unitCost: 7, category: "Meat" },
    { id: "3", name: "Onion", unitType: "kg", unitCost: 1.2, category: "Vegetable" },
    { id: "4", name: "Garlic", unitType: "kg", unitCost: 3.5, category: "Vegetable" },
    { id: "5", name: "Berbere Spice", unitType: "g", unitCost: 0.03, category: "Spice" },
    { id: "6", name: "Niter Kibbeh", unitType: "g", unitCost: 0.02, category: "Fat" },
    { id: "7", name: "Rice", unitType: "kg", unitCost: 1.8, category: "Grain" },
    { id: "8", name: "Injera", unitType: "pcs", unitCost: 1.2, category: "Bread" },
  ];
  
  // Sample data for dishes with costs
  const dishCosts: DishCost[] = [
    {
      id: "1",
      dishName: "Beef Tibs",
      totalCost: 8.95,
      ingredients: [
        { id: "1", ingredientId: "1", ingredientName: "Beef", quantity: 0.5, unitType: "kg", unitCost: 10, totalCost: 5 },
        { id: "2", ingredientId: "3", ingredientName: "Onion", quantity: 0.2, unitType: "kg", unitCost: 1.2, totalCost: 0.24 },
        { id: "3", ingredientId: "5", ingredientName: "Berbere Spice", quantity: 15, unitType: "g", unitCost: 0.03, totalCost: 0.45 },
        { id: "4", ingredientId: "6", ingredientName: "Niter Kibbeh", quantity: 30, unitType: "g", unitCost: 0.02, totalCost: 0.6 },
      ],
      otherCosts: [
        { id: "1", category: "Labor", description: "Chef time", cost: 1.50 },
        { id: "2", category: "Utilities", description: "Gas consumption", cost: 0.45 },
        { id: "3", category: "Overhead", description: "General overhead", cost: 0.71 },
      ],
      profitMargin: 70,
      suggestedPrice: 15.22
    },
    {
      id: "2",
      dishName: "Doro Wat",
      totalCost: 7.65,
      ingredients: [
        { id: "1", ingredientId: "2", ingredientName: "Chicken", quantity: 0.6, unitType: "kg", unitCost: 7, totalCost: 4.2 },
        { id: "2", ingredientId: "3", ingredientName: "Onion", quantity: 0.3, unitType: "kg", unitCost: 1.2, totalCost: 0.36 },
        { id: "3", ingredientId: "5", ingredientName: "Berbere Spice", quantity: 25, unitType: "g", unitCost: 0.03, totalCost: 0.75 },
        { id: "4", ingredientId: "6", ingredientName: "Niter Kibbeh", quantity: 40, unitType: "g", unitCost: 0.02, totalCost: 0.8 },
      ],
      otherCosts: [
        { id: "1", category: "Labor", description: "Chef time", cost: 0.90 },
        { id: "2", category: "Utilities", description: "Gas consumption", cost: 0.35 },
        { id: "3", category: "Overhead", description: "General overhead", cost: 0.29 },
      ],
      profitMargin: 80,
      suggestedPrice: 13.77
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6">
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
          
          {/* Dish Costs Tab */}
          <TabsContent value="dishCosts">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
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
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{dish.dishName}</CardTitle>
                              <div className="flex mt-1 space-x-3">
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                                  <T text="Cost" />: £{dish.totalCost.toFixed(2)}
                                </Badge>
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                                  <T text="Price" />: £{dish.suggestedPrice.toFixed(2)}
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
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                            <div className="flex items-center text-sm">
                              <Utensils className="h-4 w-4 mr-2 text-amber-500" />
                              <span><T text="Ingredients" />: {dish.ingredients.length}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Wallet className="h-4 w-4 mr-2 text-amber-500" />
                              <span><T text="Overhead Costs" />: {dish.otherCosts.length}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                              <span><T text="Profit" />: £{(dish.suggestedPrice - dish.totalCost).toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="text-sm font-medium mb-1"><T text="Cost Breakdown" /></div>
                            <div className="space-y-1">
                              <div className="flex items-center text-xs">
                                <Utensils className="h-3 w-3 mr-1 text-amber-500" />
                                <div className="flex-1">
                                  <T text="Ingredients" />
                                </div>
                                <div className="text-right">
                                  £{dish.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0).toFixed(2)}
                                </div>
                              </div>
                              <div className="flex items-center text-xs">
                                <Flame className="h-3 w-3 mr-1 text-amber-500" />
                                <div className="flex-1">
                                  <T text="Utilities" />
                                </div>
                                <div className="text-right">
                                  £{dish.otherCosts.filter(c => c.category === "Utilities").reduce((sum, c) => sum + c.cost, 0).toFixed(2)}
                                </div>
                              </div>
                              <div className="flex items-center text-xs">
                                <Clock className="h-3 w-3 mr-1 text-amber-500" />
                                <div className="flex-1">
                                  <T text="Labor" />
                                </div>
                                <div className="text-right">
                                  £{dish.otherCosts.filter(c => c.category === "Labor").reduce((sum, c) => sum + c.cost, 0).toFixed(2)}
                                </div>
                              </div>
                              <div className="flex items-center text-xs">
                                <Percent className="h-3 w-3 mr-1 text-amber-500" />
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
          
          {/* Ingredients Tab */}
          <TabsContent value="ingredients">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
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
              <CardContent>
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
          
          {/* Units Tab */}
          <TabsContent value="units">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
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
              <CardContent>
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
      
      {/* Unit Type Modal */}
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
      
      {/* Ingredient Modal */}
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
      
      {/* Dish Cost Modal */}
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
                    <div className="col-span-4">
                      <label className="text-xs text-muted-foreground"><T text="Ingredient" /></label>
                      <select className="w-full p-1.5 border rounded text-sm">
                        {ingredients.map(ing => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="text-xs text-muted-foreground"><T text="Quantity" /></label>
                      <Input type="number" step="0.01" className="text-sm" defaultValue="0.5" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground"><T text="Unit" /></label>
                      <div className="p-1.5 border rounded text-sm bg-muted">kg</div>
                    </div>
                    <div className="col-span-3">
                      <label className="text-xs text-muted-foreground"><T text="Cost" /></label>
                      <div className="p-1.5 border rounded text-sm text-right bg-muted">£5.00</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <label className="text-xs text-muted-foreground"><T text="Ingredient" /></label>
                      <select className="w-full p-1.5 border rounded text-sm">
                        {ingredients.map(ing => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="text-xs text-muted-foreground"><T text="Quantity" /></label>
                      <Input type="number" step="0.01" className="text-sm" defaultValue="0.2" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground"><T text="Unit" /></label>
                      <div className="p-1.5 border rounded text-sm bg-muted">kg</div>
                    </div>
                    <div className="col-span-3">
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
                    <div className="col-span-4">
                      <label className="text-xs text-muted-foreground"><T text="Category" /></label>
                      <select className="w-full p-1.5 border rounded text-sm">
                        <option value="Labor">Labor</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Overhead">Overhead</option>
                      </select>
                    </div>
                    <div className="col-span-5">
                      <label className="text-xs text-muted-foreground"><T text="Description" /></label>
                      <Input className="text-sm" defaultValue="Chef time" />
                    </div>
                    <div className="col-span-3">
                      <label className="text-xs text-muted-foreground"><T text="Cost (£)" /></label>
                      <Input type="number" step="0.01" className="text-sm" defaultValue="1.50" />
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <label className="text-xs text-muted-foreground"><T text="Category" /></label>
                      <select className="w-full p-1.5 border rounded text-sm">
                        <option value="Labor">Labor</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Overhead">Overhead</option>
                      </select>
                    </div>
                    <div className="col-span-5">
                      <label className="text-xs text-muted-foreground"><T text="Description" /></label>
                      <Input className="text-sm" defaultValue="Gas consumption" />
                    </div>
                    <div className="col-span-3">
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
            <div className="grid grid-cols-2 gap-4">
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

export default DishCost;
