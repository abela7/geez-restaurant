
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Search, ChevronLeft, Loader2, Filter, Clock, Tag, Circle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMenuItems } from "@/hooks/useMenuItems";
import { FoodItem } from "@/types/menu";

interface FilterOptions {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  spicy: boolean;
  priceRange: [number, number] | null;
  prepTimeRange: [number, number] | null;
}

const Dishes = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { menuItems, categories, isLoading, error } = useMenuItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filters, setFilters] = useState<FilterOptions>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    spicy: false,
    priceRange: null,
    prepTimeRange: null,
  });
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get the min/max price and prep time for range filters
  const getMinMaxValues = () => {
    let minPrice = Infinity;
    let maxPrice = 0;
    let minPrepTime = Infinity;
    let maxPrepTime = 0;

    menuItems.forEach((item) => {
      if (item.price < minPrice) minPrice = item.price;
      if (item.price > maxPrice) maxPrice = item.price;
      
      if (item.preparation_time) {
        if (item.preparation_time < minPrepTime) minPrepTime = item.preparation_time;
        if (item.preparation_time > maxPrepTime) maxPrepTime = item.preparation_time;
      }
    });

    return {
      priceRange: minPrice !== Infinity ? [minPrice, maxPrice] : [0, 100],
      prepTimeRange: minPrepTime !== Infinity ? [minPrepTime, maxPrepTime] : [0, 60],
    };
  };

  const { priceRange, prepTimeRange } = getMinMaxValues();

  const viewDishDetails = (id: string) => {
    navigate(`/admin/menu/dishes/${id}`);
  };

  const getFilteredDishes = () => {
    let filtered = [...menuItems];

    if (searchQuery) {
      filtered = filtered.filter(dish => 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(dish => dish.categoryName === selectedCategory);
    }

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
    
    if (filters.priceRange) {
      filtered = filtered.filter(dish => 
        dish.price >= filters.priceRange![0] && dish.price <= filters.priceRange![1]
      );
    }

    if (filters.prepTimeRange) {
      filtered = filtered.filter(dish => 
        dish.preparation_time !== null && 
        dish.preparation_time >= filters.prepTimeRange![0] && 
        dish.preparation_time <= filters.prepTimeRange![1]
      );
    }

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
        case "prep-asc":
          return (a.preparation_time || 0) - (b.preparation_time || 0);
        case "prep-desc":
          return (b.preparation_time || 0) - (a.preparation_time || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredDishes = getFilteredDishes();
  const categories_list = ["all", ...Array.from(new Set(menuItems.map(item => item.categoryName))).filter(Boolean)] as string[];

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <PageHeader 
        title={<T text="Dishes" />}
        description={<T text="Browse and manage all dishes for your restaurant" />}
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
              <PopoverContent className="w-80">
                <div className="space-y-4">
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
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm"><T text="Price Range" /></h4>
                    <div className="flex items-center space-x-3">
                      <Input 
                        type="number" 
                        placeholder={t("Min")}
                        className="w-24"
                        value={filters.priceRange ? filters.priceRange[0] : priceRange[0]}
                        onChange={(e) => {
                          const min = Number(e.target.value);
                          const max = filters.priceRange ? filters.priceRange[1] : priceRange[1];
                          setFilters({...filters, priceRange: [min, max]});
                        }}
                      />
                      <span>-</span>
                      <Input 
                        type="number" 
                        placeholder={t("Max")}
                        className="w-24"
                        value={filters.priceRange ? filters.priceRange[1] : priceRange[1]}
                        onChange={(e) => {
                          const max = Number(e.target.value);
                          const min = filters.priceRange ? filters.priceRange[0] : priceRange[0];
                          setFilters({...filters, priceRange: [min, max]});
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm"><T text="Preparation Time (min)" /></h4>
                    <div className="flex items-center space-x-3">
                      <Input 
                        type="number" 
                        placeholder={t("Min")}
                        className="w-24"
                        value={filters.prepTimeRange ? filters.prepTimeRange[0] : prepTimeRange[0]}
                        onChange={(e) => {
                          const min = Number(e.target.value);
                          const max = filters.prepTimeRange ? filters.prepTimeRange[1] : prepTimeRange[1];
                          setFilters({...filters, prepTimeRange: [min, max]});
                        }}
                      />
                      <span>-</span>
                      <Input 
                        type="number" 
                        placeholder={t("Max")}
                        className="w-24"
                        value={filters.prepTimeRange ? filters.prepTimeRange[1] : prepTimeRange[1]}
                        onChange={(e) => {
                          const max = Number(e.target.value);
                          const min = filters.prepTimeRange ? filters.prepTimeRange[0] : prepTimeRange[0];
                          setFilters({...filters, prepTimeRange: [min, max]});
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setFilters({
                        vegetarian: false,
                        vegan: false,
                        glutenFree: false,
                        spicy: false,
                        priceRange: null,
                        prepTimeRange: null
                      })}
                    >
                      <T text="Reset" />
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        document.body.click(); // Close popover
                      }}
                    >
                      <T text="Apply" />
                    </Button>
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
                <SelectItem value="prep-asc"><T text="Prep Time (Fastest)" /></SelectItem>
                <SelectItem value="prep-desc"><T text="Prep Time (Longest)" /></SelectItem>
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
                <Card 
                  key={dish.id} 
                  className="overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 group cursor-pointer"
                  onClick={() => viewDishDetails(dish.id)}
                >
                  <AspectRatio ratio={4 / 3} className="relative">
                    <img 
                      src={dish.image_url || "/placeholder.svg"} 
                      alt={dish.name} 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end max-w-[80%]">
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
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {dish.preparation_time} <T text="min" />
                        </div>
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
  );
};

export default Dishes;
