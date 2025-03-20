
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Search, ChevronLeft, Loader2, Star, Filter } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  available: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  categoryName?: string;
  preparation_time?: number | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

const Dishes = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [dishes, setDishes] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    spicy: false
  });
  const [sortBy, setSortBy] = useState<string>("name-asc");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadDishes(),
          loadCategories()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data from the database");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const loadDishes = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select(`
          *,
          menu_categories(id, name)
        `)
        .eq('available', true);
      
      if (error) throw error;
      
      const formattedItems = data.map(item => ({
        ...item,
        categoryName: item.menu_categories ? item.menu_categories.name : "Uncategorized"
      }));
      
      setDishes(formattedItems);
    } catch (error) {
      console.error("Error fetching dishes:", error);
      throw error;
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  const getFilteredDishes = () => {
    let filtered = dishes;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(dish => 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(dish => dish.categoryName === selectedCategory);
    }

    // Apply dietary filters
    if (filters.vegetarian) {
      filtered = filtered.filter(dish => dish.is_vegetarian);
    }
    if (filters.vegan) {
      filtered = filtered.filter(dish => dish.is_vegan);
    }
    if (filters.glutenFree) {
      filtered = filtered.filter(dish => dish.is_gluten_free);
    }
    if (filters.spicy) {
      filtered = filtered.filter(dish => dish.is_spicy);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredDishes = getFilteredDishes();
  const categories_list = ["all", ...Array.from(new Set(dishes.map(item => item.categoryName))).filter(Boolean)] as string[];

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <PageHeader 
          title={<T text="Dishes" />}
          description={<T text="Browse all available dishes for customers and waiters" />}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link to="/admin/menu/food">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <T text="Back to Food Management" />
                </Link>
              </Button>
            </>
          }
        />

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("Search dishes...")}
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <T text="Filters" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm"><T text="Dietary Preferences" /></h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="vegetarian" checked={filters.vegetarian} onCheckedChange={(checked) => setFilters({...filters, vegetarian: checked as boolean})} />
                        <Label htmlFor="vegetarian"><T text="Vegetarian" /></Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="vegan" checked={filters.vegan} onCheckedChange={(checked) => setFilters({...filters, vegan: checked as boolean})} />
                        <Label htmlFor="vegan"><T text="Vegan" /></Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="glutenFree" checked={filters.glutenFree} onCheckedChange={(checked) => setFilters({...filters, glutenFree: checked as boolean})} />
                        <Label htmlFor="glutenFree"><T text="Gluten Free" /></Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="spicy" checked={filters.spicy} onCheckedChange={(checked) => setFilters({...filters, spicy: checked as boolean})} />
                        <Label htmlFor="spicy"><T text="Spicy" /></Label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("Sort by...")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc"><T text="Name (A-Z)" /></SelectItem>
                  <SelectItem value="name-desc"><T text="Name (Z-A)" /></SelectItem>
                  <SelectItem value="price-asc"><T text="Price (Low-High)" /></SelectItem>
                  <SelectItem value="price-desc"><T text="Price (High-Low)" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {categories_list.map((category) => (
              <Button 
                key={category} 
                variant={selectedCategory === category ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-amber-500 hover:bg-amber-600" : ""}
              >
                {category === "all" ? t("All Categories") : category}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12 bg-white rounded-lg shadow">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <>
            {filteredDishes.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-lg shadow">
                <p className="text-muted-foreground">
                  <T text="No dishes found matching your criteria" />
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDishes.map(dish => (
                  <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 group">
                    <AspectRatio ratio={4 / 3} className="relative">
                      <img 
                        src={dish.image_url || "/placeholder.svg"} 
                        alt={dish.name} 
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {dish.is_vegetarian && <Badge className="bg-green-500 text-white"><T text="Vegetarian" /></Badge>}
                        {dish.is_vegan && <Badge className="bg-green-600 text-white"><T text="Vegan" /></Badge>}
                        {dish.is_gluten_free && <Badge className="bg-blue-500 text-white"><T text="GF" /></Badge>}
                        {dish.is_spicy && <Badge className="bg-red-500 text-white"><T text="Spicy" /></Badge>}
                      </div>
                    </AspectRatio>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-medium group-hover:text-amber-600 transition-colors">{dish.name}</h3>
                        <Badge variant="outline" className="bg-amber-50">{dish.categoryName}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{dish.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-2xl font-bold text-amber-600">£{dish.price.toFixed(2)}</span>
                        {dish.preparation_time && (
                          <span className="text-sm text-gray-500">
                            <T text="Prep time" />: {dish.preparation_time} <T text="min" />
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dishes;
