
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, ChevronLeft, Edit, Calculator, Loader2, Calendar, PercentIcon } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuNav } from "@/components/menu/MenuNav";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FoodItem {
  id: string;
  name: string;
  price: number;
  cost: number | null;
  profit_margin: number | null;
  category_id: string | null;
  categoryName?: string;
}

interface PriceChange {
  id: string;
  food_item_id: string;
  old_price: number;
  new_price: number;
  change_date: string;
  reason: string;
  foodName?: string;
}

const Pricing = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [priceChangeReason, setPriceChangeReason] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadFoodItems(),
        loadPriceHistory(),
        loadCategories()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFoodItems = async () => {
    const { data, error } = await supabase
      .from('food_items')
      .select(`
        *,
        menu_categories(id, name)
      `);
    
    if (error) {
      throw error;
    }
    
    const formattedItems = data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      cost: item.cost,
      profit_margin: item.profit_margin,
      category_id: item.category_id,
      categoryName: item.menu_categories ? item.menu_categories.name : "Uncategorized"
    }));
    
    setFoodItems(formattedItems);
  };

  const loadPriceHistory = async () => {
    const { data, error } = await supabase
      .from('price_history')
      .select(`
        *,
        food_items(name)
      `)
      .order('change_date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    const formattedHistory = data.map(item => ({
      id: item.id,
      food_item_id: item.food_item_id,
      old_price: item.old_price,
      new_price: item.new_price,
      change_date: item.change_date,
      reason: item.reason,
      foodName: item.food_items ? item.food_items.name : "Unknown Item"
    }));
    
    setPriceChanges(formattedHistory);
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('id, name')
      .eq('active', true);
    
    if (error) {
      throw error;
    }
    
    setCategories(data);
  };

  const handlePriceUpdate = async () => {
    if (!currentItem) return;
    
    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // First record the price change in history
      const { error: historyError } = await supabase
        .from('price_history')
        .insert({
          food_item_id: currentItem.id,
          old_price: currentItem.price,
          new_price: priceValue,
          change_date: new Date().toISOString(),
          reason: priceChangeReason
        });
      
      if (historyError) throw historyError;
      
      // Calculate new profit margin
      let newProfitMargin = null;
      if (currentItem.cost && currentItem.cost > 0) {
        newProfitMargin = Math.round(((priceValue - currentItem.cost) / priceValue) * 100);
      }
      
      // Then update the food item price
      const { error: updateError } = await supabase
        .from('food_items')
        .update({ 
          price: priceValue,
          profit_margin: newProfitMargin
        })
        .eq('id', currentItem.id);
      
      if (updateError) throw updateError;
      
      // Refresh data
      await Promise.all([
        loadFoodItems(),
        loadPriceHistory()
      ]);
      
      toast.success("Price updated successfully");
      setShowEditDialog(false);
      
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Failed to update price");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (item: FoodItem) => {
    setCurrentItem(item);
    setNewPrice(item.price.toString());
    setPriceChangeReason("");
    setShowEditDialog(true);
  };

  const filteredFoodItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || item.category_id === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const calculateProfitClass = (margin: number | null) => {
    if (margin === null) return "";
    if (margin < 30) return "text-red-600";
    if (margin < 50) return "text-amber-600";
    return "text-green-600";
  };

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Menu Pricing" />}
          description={<T text="Manage prices, profit margins, and price history" />}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link to="/admin/menu">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <T text="Back to Menu" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/menu/food">
                  <Calculator className="mr-2 h-4 w-4" />
                  <T text="Food Management" />
                </Link>
              </Button>
            </>
          }
        />

        <MenuNav />

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search food items...")}
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("Filter by category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Categories")}</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button 
              variant={activeTab === "current" ? "default" : "outline"}
              onClick={() => setActiveTab("current")}
            >
              <T text="Current Prices" />
            </Button>
            <Button 
              variant={activeTab === "history" ? "default" : "outline"}
              onClick={() => setActiveTab("history")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <T text="Price History" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activeTab === "current" ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Food Item" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead><T text="Current Price" /></TableHead>
                  <TableHead><T text="Cost" /></TableHead>
                  <TableHead><T text="Profit Margin" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFoodItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchQuery ? (
                        <T text="No food items found matching your search" />
                      ) : (
                        <T text="No food items found" />
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFoodItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell><Badge variant="outline">{item.categoryName}</Badge></TableCell>
                      <TableCell className="font-bold">£{item.price.toFixed(2)}</TableCell>
                      <TableCell>£{item.cost ? item.cost.toFixed(2) : '-'}</TableCell>
                      <TableCell>
                        <span className={calculateProfitClass(item.profit_margin)}>
                          {item.profit_margin !== null ? `${item.profit_margin}%` : '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          <T text="Update Price" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Food Item" /></TableHead>
                  <TableHead><T text="Old Price" /></TableHead>
                  <TableHead><T text="New Price" /></TableHead>
                  <TableHead><T text="Change" /></TableHead>
                  <TableHead><T text="Date" /></TableHead>
                  <TableHead><T text="Reason" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceChanges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <T text="No price change history found" />
                    </TableCell>
                  </TableRow>
                ) : (
                  priceChanges.map((change) => {
                    const priceChange = change.new_price - change.old_price;
                    const percentChange = ((priceChange / change.old_price) * 100).toFixed(1);
                    const isIncrease = priceChange > 0;
                    
                    return (
                      <TableRow key={change.id}>
                        <TableCell className="font-medium">{change.foodName}</TableCell>
                        <TableCell>£{change.old_price.toFixed(2)}</TableCell>
                        <TableCell>£{change.new_price.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={isIncrease ? "text-red-600" : "text-green-600"}>
                            {isIncrease ? "+" : ""}{priceChange.toFixed(2)} ({isIncrease ? "+" : ""}{percentChange}%)
                          </span>
                        </TableCell>
                        <TableCell>{new Date(change.change_date).toLocaleDateString()}</TableCell>
                        <TableCell>{change.reason || "-"}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        )}

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle><T text="Update Price" /></DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {currentItem && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{currentItem.name}</h3>
                        <p className="text-sm text-muted-foreground">{currentItem.categoryName}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium"><T text="Current Price" />: £{currentItem.price.toFixed(2)}</div>
                        {currentItem.cost && (
                          <div className="text-sm text-muted-foreground">
                            <T text="Cost" />: £{currentItem.cost.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPrice"><T text="New Price (£)" /></Label>
                    <Input 
                      id="newPrice" 
                      type="number" 
                      step="0.01"
                      min="0"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                    
                    {currentItem.cost && parseFloat(newPrice) > 0 && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium"><T text="New Profit Margin" /></span>
                          <span className={calculateProfitClass(
                            Math.round(((parseFloat(newPrice) - currentItem.cost) / parseFloat(newPrice)) * 100)
                          )}>
                            <PercentIcon className="h-4 w-4 inline mr-1" />
                            {Math.round(((parseFloat(newPrice) - currentItem.cost) / parseFloat(newPrice)) * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reason"><T text="Reason for Change" /></Label>
                    <Input 
                      id="reason" 
                      value={priceChangeReason}
                      onChange={(e) => setPriceChangeReason(e.target.value)}
                      placeholder={t("e.g. Seasonal adjustment, Ingredient cost increase")}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                <T text="Cancel" />
              </Button>
              <Button onClick={handlePriceUpdate} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                <T text="Update Price" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Pricing;
