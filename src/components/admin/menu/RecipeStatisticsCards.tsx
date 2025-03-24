
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface RecipeStatisticsCardsProps {
  recipesCount: number;
  foodItemsCount: number;
  missingRecipesCount: number;
}

const RecipeStatisticsCards: React.FC<RecipeStatisticsCardsProps> = ({
  recipesCount,
  foodItemsCount,
  missingRecipesCount
}) => {
  const { t } = useLanguage();
  
  // Calculate the completion percentage
  const completionPercentage = Math.round((recipesCount / Math.max(foodItemsCount, 1)) * 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg"><T text="Total Recipes" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600">{recipesCount}</div>
          <p className="text-sm text-muted-foreground">
            <span>{t("of {total} food items", { total: foodItemsCount })}</span>
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg"><T text="Missing Recipes" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600">{missingRecipesCount}</div>
          <p className="text-sm text-muted-foreground">
            <T text="food items without recipes" />
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg"><T text="Recipe Development Status" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600">
            {completionPercentage}%
          </div>
          <p className="text-sm text-muted-foreground">
            <T text="completion rate" />
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeStatisticsCards;
