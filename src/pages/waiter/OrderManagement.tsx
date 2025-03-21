
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useTables } from "@/hooks/useTables";
import { useOrderManagement } from "@/hooks/useOrderManagement";
import { MenuSearchSection } from "@/components/waiter/orders/MenuSearchSection";
import { OrderDetailsSection } from "@/components/waiter/orders/OrderDetailsSection";
import { QuickOrder } from "@/hooks/useQuickOrders";

interface OrderManagementProps {
  newOrder?: boolean;
  search?: boolean;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ newOrder, search }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Load menu items and categories
  const { menuItems, categories, isLoading: isLoadingMenu } = useMenuItems();
  
  // Load tables
  const { tables, isLoading: isLoadingTables } = useTables();
  
  // Order management state and functions
  const {
    orderItems,
    orderType,
    setOrderType,
    selectedTable,
    setSelectedTable,
    customerName,
    setCustomerName,
    customerCount,
    setCustomerCount,
    specialInstructions,
    setSpecialInstructions,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    handleAddToOrder,
    handleQuantityChange,
    handleRemoveItem,
    calculateTotal,
    handleSubmitOrder
  } = useOrderManagement();

  // Handle form submission
  const submitOrder = async () => {
    const orderId = await handleSubmitOrder();
    if (orderId) {
      navigate("/waiter/orders");
    }
  };

  // Handle adding from quick orders component
  const handleQuickOrderAdd = (quickOrder: QuickOrder) => {
    // Create a food item from quick order
    const foodItem = {
      id: quickOrder.id,
      name: quickOrder.name,
      description: quickOrder.description,
      price: quickOrder.price,
      category_id: null,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_spicy: false,
      categoryName: quickOrder.category
    };
    
    handleAddToOrder(foodItem);
  };

  // Filter menu items based on search and category
  const getFilteredMenuItems = () => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || item.categoryName === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Organize items by category for display
  const itemsByCategory = React.useMemo(() => {
    const filteredItems = getFilteredMenuItems();
    return filteredItems.reduce((acc, item) => {
      const category = item.categoryName || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, typeof menuItems>);
  }, [menuItems, searchQuery, selectedCategory]);

  const isLoading = isLoadingMenu || isLoadingTables;

  return (
    <Layout interface="waiter" contentOnly={true}>
      <div className="container mx-auto p-4 pb-24">
        <PageHeader
          title={<T text={newOrder ? "New Order" : search ? "Search Orders" : "Order Management"} />}
          description={<T text={newOrder ? "Create a new customer order" : search ? "Search for existing orders" : "Manage customer orders"} />}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MenuSearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              itemsByCategory={itemsByCategory}
              isLoading={isLoading}
              handleAddToOrder={handleAddToOrder}
              handleQuickOrderAdd={handleQuickOrderAdd}
            />
          </div>
          
          <div className="lg:col-span-1">
            <OrderDetailsSection
              orderItems={orderItems}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
              orderType={orderType}
              setOrderType={setOrderType}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              tables={tables}
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerCount={customerCount}
              setCustomerCount={setCustomerCount}
              specialInstructions={specialInstructions}
              setSpecialInstructions={setSpecialInstructions}
              calculateTotal={calculateTotal}
              handleSubmitOrder={submitOrder}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderManagement;
