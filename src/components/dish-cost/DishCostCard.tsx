
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Utensils, Wallet, Flame, Percent, Clock, BadgePoundSterling, Home, Wrench } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { DishCost, DishIngredient, DishOverheadCost } from "@/types/dishCost";

interface DishCostCardProps {
  dish: DishCost;
  onEdit: (dish: DishCost) => void;
  onDelete: (id: string) => void;
}

const DishCostCard: React.FC<DishCostCardProps> = ({ dish, onEdit, onDelete }) => {
  const { t } = useLanguage();

  // Helper function to calculate the profit
  const calculateProfit = () => {
    const finalPrice = dish.use_manual_price && dish.manual_price 
      ? dish.manual_price 
      : dish.suggested_price;
    return (finalPrice - dish.total_cost).toFixed(2);
  };

  // Helper function to get overhead costs by category
  const getOverheadCostsByCategory = (category: string) => {
    return dish.dish_overhead_costs
      ? dish.dish_overhead_costs
          .filter(c => c.category === category)
          .reduce((sum, c) => sum + c.cost, 0)
          .toFixed(2)
      : "0.00";
  };

  // Get a list of all unique overhead categories used in this dish
  const getOverheadCategories = () => {
    if (!dish.dish_overhead_costs || dish.dish_overhead_costs.length === 0) {
      return [];
    }
    return [...new Set(dish.dish_overhead_costs.map(cost => cost.category))];
  };

  // Helper function to get icon for a category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Labor":
        return <Clock className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0" />;
      case "Utilities":
        return <Flame className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0" />;
      case "Rent":
        return <Home className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0" />;
      case "Maintenance":
        return <Wrench className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0" />;
      default:
        return <Percent className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0" />;
    }
  };

  const overheadCategories = getOverheadCategories();

  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <CardTitle className="text-lg">{dish.dish_name}</CardTitle>
            <div className="flex mt-1 flex-wrap gap-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                <T text="Cost" />: £{dish.total_cost.toFixed(2)}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                {dish.use_manual_price && dish.manual_price ? (
                  <span><T text="Manual Price" />: £{dish.manual_price.toFixed(2)}</span>
                ) : (
                  <span><T text="Suggested Price" />: £{dish.suggested_price.toFixed(2)}</span>
                )}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                <T text="Margin" />: {dish.profit_margin}%
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(dish)}>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(dish.id)}>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-3">
          <div className="flex items-center text-sm">
            <Utensils className="h-4 w-4 mr-2 text-amber-500" />
            <span><T text="Ingredients" />: {dish.dish_ingredients?.length || 0}</span>
          </div>
          <div className="flex items-center text-sm">
            <Wallet className="h-4 w-4 mr-2 text-amber-500" />
            <span><T text="Overhead Costs" />: {dish.dish_overhead_costs?.length || 0}</span>
          </div>
          <div className="flex items-center text-sm">
            <BadgePoundSterling className="h-4 w-4 mr-2 text-green-600" />
            <span><T text="Profit" />: £{calculateProfit()}</span>
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
                £{dish.total_ingredient_cost.toFixed(2)}
              </div>
            </div>
            
            {overheadCategories.map(category => (
              <div key={category} className="flex items-center text-xs">
                {getCategoryIcon(category)}
                <div className="flex-1">
                  <T text={category} />
                </div>
                <div className="text-right">
                  £{getOverheadCostsByCategory(category)}
                </div>
              </div>
            ))}
            
            {overheadCategories.length === 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Percent className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0" />
                <div className="flex-1">
                  <T text="No overhead costs added" />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DishCostCard;
