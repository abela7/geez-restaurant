
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, Search, Loader2, TrendingUp, History } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { usePriceManagement, PriceHistory } from "@/hooks/usePriceManagement";
import { toast } from "sonner";
import { format } from "date-fns";

const Pricing = () => {
  const { t } = useLanguage();
  const {
    isLoading,
    foodItems,
    priceChanges,
    categories,
    searchQuery,
    setSearchQuery,
    showEditDialog,
    setShowEditDialog,
    currentItem,
    newPrice,
    setNewPrice,
    priceChangeReason,
    setPriceChangeReason,
    activeTab,
    setActiveTab,
    filterCategory,
    setFilterCategory,
    openEditDialog,
    handlePriceUpdate
  } = usePriceManagement();

  const formatPrice = (price: number) => {
    return `£${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Pricing Management" />}
        description={<T text="Manage food item prices and track price history" />}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/menu">
              <ChevronLeft className="mr-2 h-4 w-4" />
              <T text="Back to Menu" />
            </Link>
          </Button>
        }
      />

      <MenuNav />

      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="current">
            <TrendingUp className="mr-2 h-4 w-4" />
            <T text="Current Prices" />
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            <T text="Price History" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("Search food items...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <div className="md:w-64">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Filter by category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T text="All Categories" /></SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.categoryName}</p>
                      </div>
                      <div>
                        <span className="text-xl font-bold text-primary">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="text-sm"><T text="Cost" />: {formatPrice(item.cost || 0)}</p>
                        {item.profit_margin !== null && (
                          <p className="text-sm">
                            <T text="Profit Margin" />: {item.profit_margin}%
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <T text="Update Price" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search price history...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left"><T text="Item" /></th>
                    <th className="p-2 text-right"><T text="Old Price" /></th>
                    <th className="p-2 text-right"><T text="New Price" /></th>
                    <th className="p-2 text-right"><T text="Change" /></th>
                    <th className="p-2 text-left"><T text="Date" /></th>
                    <th className="p-2 text-left"><T text="Reason" /></th>
                  </tr>
                </thead>
                <tbody>
                  {priceChanges.map((change: PriceHistory) => (
                    <tr key={change.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-2">{change.foodName}</td>
                      <td className="p-2 text-right">{formatPrice(change.old_price)}</td>
                      <td className="p-2 text-right">{formatPrice(change.new_price)}</td>
                      <td className="p-2 text-right">
                        <span className={change.new_price > change.old_price ? "text-green-600" : "text-red-600"}>
                          {change.new_price > change.old_price ? "+" : ""}
                          {((change.new_price - change.old_price) / change.old_price * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-2">{formatDate(change.change_date)}</td>
                      <td className="p-2">{change.reason || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Update Price" /></DialogTitle>
          </DialogHeader>
          
          {currentItem && (
            <>
              <div className="space-y-4 py-4">
                <div className="flex justify-between">
                  <span className="font-medium">{currentItem.name}</span>
                  <span className="text-muted-foreground">{t("Current Price")}: {formatPrice(currentItem.price)}</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="new-price">
                    <T text="New Price (£)" />
                  </label>
                  <Input
                    id="new-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="0.00"
                    className="col-span-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="price-reason">
                    <T text="Reason for Change (Optional)" />
                  </label>
                  <Input
                    id="price-reason"
                    value={priceChangeReason}
                    onChange={(e) => setPriceChangeReason(e.target.value)}
                    placeholder={t("e.g., Seasonal adjustment, Cost increase")}
                  />
                </div>
                
                {currentItem.cost > 0 && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <T text="New Profit Margin" />:
                      {" "}
                      {newPrice && !isNaN(parseFloat(newPrice)) && parseFloat(newPrice) > 0
                        ? Math.round(((parseFloat(newPrice) - currentItem.cost) / parseFloat(newPrice)) * 100)
                        : "0"}%
                    </p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  <T text="Cancel" />
                </Button>
                <Button onClick={handlePriceUpdate}>
                  <T text="Update Price" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
