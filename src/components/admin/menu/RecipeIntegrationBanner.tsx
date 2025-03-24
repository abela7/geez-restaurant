
import React from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Clipboard, Utensils, BarChart4, DollarSign, ChevronRight } from "lucide-react";

const RecipeIntegrationBanner: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-amber-600" />
          <T text="Recipe & Cost Integration" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          <T text="Recipes are now fully integrated with the dish cost management system:" />
        </p>
        <ul className="space-y-2 ml-4">
          <li className="flex items-start">
            <Clipboard className="h-4 w-4 mr-2 mt-1 text-amber-600" />
            <span><T text="Recipe ingredients are automatically reflected in dish costs" /></span>
          </li>
          <li className="flex items-start">
            <Utensils className="h-4 w-4 mr-2 mt-1 text-amber-600" />
            <span><T text="Stock levels are tracked when orders are processed" /></span>
          </li>
          <li className="flex items-start">
            <BarChart4 className="h-4 w-4 mr-2 mt-1 text-amber-600" />
            <span><T text="Cost calculations are synchronized across the system" /></span>
          </li>
          <li className="flex items-start">
            <DollarSign className="h-4 w-4 mr-2 mt-1 text-amber-600" />
            <span><T text="Food item prices are automatically suggested based on costs and profit margins" /></span>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/admin/menu/dish-cost">
            <T text="Manage Dish Costs" />
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/admin/inventory/ingredients">
            <T text="Manage Ingredients" />
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeIntegrationBanner;
