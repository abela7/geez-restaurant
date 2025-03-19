
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, Clock, Utensils, Printer, Bookmark, Check } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample recipe categories
const recipeCategories = ["Main Dishes", "Vegetarian", "Appetizers", "Side Dishes", "Beverages", "Desserts"];

// Sample recipe data
const recipes = [
  {
    id: 1,
    name: "Doro Wat",
    category: "Main Dishes",
    prepTime: "25 mins",
    cookTime: "60 mins",
    image: "/placeholder.svg",
    description: "Spicy chicken stew with berbere sauce and hard-boiled eggs. One of the most popular dishes in Ethiopian cuisine.",
    ingredients: [
      "2 kg chicken, cut into pieces",
      "4 large onions, finely chopped",
      "1 cup vegetable oil",
      "1/4 cup Ethiopian butter (niter kibbeh)",
      "3 tbsp berbere spice mix",
      "6 cloves garlic, minced",
      "2 tbsp ginger, minced",
      "6 hard-boiled eggs",
      "1 lemon, juiced",
      "Salt to taste"
    ],
    instructions: [
      "Clean chicken pieces with lemon juice and water, then pat dry.",
      "In a large pot, cook onions over medium heat until softened, about 10 minutes (no oil yet).",
      "Add vegetable oil and continue cooking onions until deeply caramelized, about 30 minutes, stirring regularly.",
      "Add berbere spice, garlic, and ginger. Stir well and cook for 5 minutes.",
      "Add chicken pieces and niter kibbeh, stir to coat chicken with the sauce.",
      "Cover and simmer on low heat for 40 minutes, stirring occasionally.",
      "Add water if needed to maintain a thick stew consistency.",
      "Add hard-boiled eggs 10 minutes before finishing.",
      "Adjust salt to taste.",
      "Serve hot with injera bread."
    ],
    notes: "For an authentic taste, use Ethiopian berbere and niter kibbeh. The key to good Doro Wat is properly caramelized onions, which form the base of the sauce.",
    allergies: ["Eggs"],
    dietary: ["Gluten-Free"]
  },
  {
    id: 2,
    name: "Kitfo",
    category: "Main Dishes",
    prepTime: "15 mins",
    cookTime: "5 mins",
    image: "/placeholder.svg",
    description: "A traditional Ethiopian dish of minced raw beef seasoned with mitmita and niter kibbeh.",
    ingredients: [
      "1 kg lean beef tenderloin, freshly ground",
      "4 tbsp niter kibbeh (Ethiopian spiced butter)",
      "2 tbsp mitmita spice blend",
      "1 tbsp ground korarima (Ethiopian cardamom)",
      "Salt to taste",
      "Fresh cheese (ayib) for serving",
      "Collard greens (gomen) for serving",
      "Injera bread for serving"
    ],
    instructions: [
      "Trim all fat from the beef and mince it very finely or ask your butcher to freshly grind it.",
      "Warm the niter kibbeh until just melted but not hot.",
      "In a bowl, combine the minced beef with melted niter kibbeh.",
      "Add mitmita, korarima, and salt to taste. Mix thoroughly.",
      "For traditional kitfo, serve immediately at room temperature.",
      "For kitfo leb leb (slightly warmed), gently heat the mixture.",
      "For kitfo yebesele (well done), cook the mixture until fully cooked.",
      "Serve with ayib cheese, cooked collard greens, and injera bread on the side."
    ],
    notes: "Kitfo is traditionally served raw or rare. Always use the freshest quality beef possible. The dish can be adjusted to the customer's preferred doneness.",
    allergies: ["Dairy"],
    dietary: ["High Protein", "Gluten-Free"]
  }
];

const RecipeViewer = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Recipe Viewer" 
        description="Access and reference detailed recipes for all menu items"
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search recipes..."
            className="pl-9 w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            <T text="Filter" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-medium mb-4"><T text="Recipe Categories" /></h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <T text="All Recipes" />
              </Button>
              {recipeCategories.map((category) => (
                <Button key={category} variant="ghost" className="w-full justify-start">
                  <T text={category} />
                </Button>
              ))}
            </div>
            
            <h3 className="font-medium mt-6 mb-4"><T text="Quick Access" /></h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Bookmark className="mr-2 h-4 w-4 text-primary" />
                <T text="Bookmarked Recipes" />
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Check className="mr-2 h-4 w-4 text-green-600" />
                <T text="Recently Viewed" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-0 overflow-hidden">
            <Tabs defaultValue="recipe1">
              <div className="border-b">
                <ScrollArea className="whitespace-nowrap">
                  <TabsList className="w-full justify-start h-12 bg-background px-4">
                    {recipes.map((recipe) => (
                      <TabsTrigger key={recipe.id} value={`recipe${recipe.id}`} className="h-10">
                        {recipe.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollArea>
              </div>
              
              {recipes.map((recipe) => (
                <TabsContent key={recipe.id} value={`recipe${recipe.id}`} className="m-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                      <div className="w-full md:w-1/2">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-2xl font-bold">{recipe.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{recipe.category}</Badge>
                              <div className="flex items-center text-muted-foreground text-sm">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{recipe.prepTime} prep | {recipe.cookTime} cook</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4 mr-2" />
                            <T text="Print" />
                          </Button>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{recipe.description}</p>
                        
                        <div className="mb-4">
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <Utensils className="h-5 w-5 mr-2 text-muted-foreground" />
                            <T text="Ingredients" />
                          </h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {recipe.ingredients.map((ingredient, index) => (
                              <li key={index}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {(recipe.allergies.length > 0 || recipe.dietary.length > 0) && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {recipe.allergies.map((allergy, index) => (
                              <Badge key={index} variant="destructive">
                                {allergy}
                              </Badge>
                            ))}
                            {recipe.dietary.map((diet, index) => (
                              <Badge key={index}>
                                {diet}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md mb-4">
                          <img 
                            src={recipe.image} 
                            alt={recipe.name} 
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2"><T text="Instructions" /></h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        {recipe.instructions.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    {recipe.notes && (
                      <div className="mt-6 p-4 bg-muted rounded-md">
                        <h3 className="font-medium mb-2"><T text="Chef's Notes" /></h3>
                        <p>{recipe.notes}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecipeViewer;
