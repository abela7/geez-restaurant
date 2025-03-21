
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, ArrowUpFromLine } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";

// Import the refactored components
import InventoryFilterBar from "@/components/inventory/InventoryFilterBar";
import InventoryAlert from "@/components/inventory/InventoryAlert";
import InventoryItemCard from "@/components/inventory/InventoryItemCard";
import InventoryItemRow from "@/components/inventory/InventoryItemRow";
import EmptyInventory from "@/components/inventory/EmptyInventory";
import InventoryStockAdjustmentDialog from "@/components/inventory/InventoryStockAdjustmentDialog";

const InventoryCheck = () => {
  const { t } = useLanguage();
  const {
    filteredInventory,
    categories,
    lowStockItems,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    viewMode,
    setViewMode,
    stockFilter,
    setStockFilter,
    adjustDialogOpen,
    setAdjustDialogOpen,
    selectedItem,
    getStockStatus,
    reportToAdmin,
    handleAdjustStock,
    openAdjustDialog,
    refetch,
    requestNewItem
  } = useInventoryManagement();

  if (isLoading) {
    return (
      <Layout interface="kitchen">
        <div className="p-4 flex justify-center items-center h-[70vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout interface="kitchen">
      <div className="p-4">
        <InventoryFilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={refetch}
          onRequestItem={requestNewItem}
        />

        <InventoryAlert count={lowStockItems.length} />

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4 overflow-auto flex w-full justify-start px-0 py-1">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="capitalize px-3 py-1.5 text-xs sm:text-sm"
              >
                <T text={category === "all" ? "All Items" : category} />
              </TabsTrigger>
            ))}
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-260px)]">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredInventory.length === 0 ? (
                  <EmptyInventory />
                ) : (
                  filteredInventory.map((item) => (
                    <InventoryItemCard
                      key={item.id}
                      item={item}
                      status={getStockStatus(item)}
                      onAdjust={openAdjustDialog}
                      onReport={reportToAdmin}
                    />
                  ))
                )}
              </div>
            ) : (
              // List view
              <div className="space-y-2">
                {filteredInventory.length === 0 ? (
                  <EmptyInventory />
                ) : (
                  filteredInventory.map((item) => (
                    <InventoryItemRow
                      key={item.id}
                      item={item}
                      status={getStockStatus(item)}
                      onAdjust={openAdjustDialog}
                      onReport={reportToAdmin}
                    />
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </div>

      <InventoryStockAdjustmentDialog
        open={adjustDialogOpen}
        setOpen={setAdjustDialogOpen}
        selectedItem={selectedItem}
        onAdjustStock={handleAdjustStock}
      />
    </Layout>
  );
};

export default InventoryCheck;
