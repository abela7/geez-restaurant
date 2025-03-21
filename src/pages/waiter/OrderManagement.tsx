import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useTables } from "@/hooks/useTables";
import { useOrderManagement } from "@/hooks/useOrderManagement";
import { QuickOrder } from "@/hooks/useQuickOrders";
import { useIsMobile } from "@/hooks/use-mobile";
import { StepOrderFlow } from "@/components/waiter/orders/StepOrderFlow";
import { OrderTypeStep } from "@/components/waiter/orders/steps/OrderTypeStep";
import { TableSelectionStep } from "@/components/waiter/orders/steps/TableSelectionStep";
import { CustomerInfoStep } from "@/components/waiter/orders/steps/CustomerInfoStep";
import { MenuSelectionStep } from "@/components/waiter/orders/steps/MenuSelectionStep";
import { OrderReviewStep } from "@/components/waiter/orders/steps/OrderReviewStep";
import { OrderStep } from "@/types/order";

interface OrderManagementProps {
  newOrder?: boolean;
  search?: boolean;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ newOrder, search }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { menuItems, categories, isLoading: isLoadingMenu } = useMenuItems();
  const { tables, isLoading: isLoadingTables } = useTables();
  
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
    currentStep,
    goToNextStep,
    goToPreviousStep,
    handleAddToOrder,
    handleQuantityChange,
    handleRemoveItem,
    calculateTotal,
    handleSubmitOrder
  } = useOrderManagement();

  const submitOrder = async () => {
    const orderId = await handleSubmitOrder();
    if (orderId) {
      navigate("/waiter/orders");
    }
  };

  const handleQuickOrderAdd = (quickOrder: QuickOrder) => {
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

  const isLoading = isLoadingMenu || isLoadingTables;

  const renderStepContent = () => {
    switch(currentStep) {
      case "order-type":
        return (
          <OrderTypeStep
            orderType={orderType}
            setOrderType={setOrderType}
            goToNextStep={goToNextStep}
          />
        );
      case "table-selection":
        return (
          <TableSelectionStep
            tables={tables}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            goToNextStep={goToNextStep}
          />
        );
      case "customer-info":
        return (
          <CustomerInfoStep
            orderType={orderType}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerCount={customerCount}
            setCustomerCount={setCustomerCount}
            goToNextStep={goToNextStep}
          />
        );
      case "menu-selection":
        return (
          <MenuSelectionStep
            menuItems={menuItems}
            categories={categories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            orderItems={orderItems}
            handleAddToOrder={handleAddToOrder}
            handleQuantityChange={handleQuantityChange}
            handleQuickOrderAdd={handleQuickOrderAdd}
          />
        );
      case "order-review":
        return (
          <OrderReviewStep
            orderItems={orderItems}
            handleQuantityChange={handleQuantityChange}
            handleRemoveItem={handleRemoveItem}
            orderType={orderType}
            selectedTable={selectedTable}
            tables={tables}
            customerName={customerName}
            customerCount={customerCount}
            specialInstructions={specialInstructions}
            setSpecialInstructions={setSpecialInstructions}
            calculateTotal={calculateTotal}
            handleSubmitOrder={submitOrder}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout interface="waiter" contentOnly={true}>
      <div className="container mx-auto p-3 pb-24 max-w-3xl">
        <PageHeader
          title={<T text={newOrder ? "New Order" : search ? "Search Orders" : "Order Management"} />}
          description={<T text={newOrder ? "Create a new customer order" : search ? "Search for existing orders" : "Manage customer orders"} />}
          className="mb-4"
        />

        <div className={`space-y-4 ${isMobile ? 'pb-24' : ''}`}>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              {renderStepContent()}
              
              {currentStep !== "order-review" && (
                <div className="mt-6">
                  <StepOrderFlow
                    currentStep={currentStep}
                    goToNextStep={goToNextStep}
                    goToPreviousStep={goToPreviousStep}
                    isSubmitting={isSubmitting}
                    canProceed={
                      (currentStep !== "table-selection" || selectedTable) &&
                      (currentStep !== "menu-selection" || orderItems.length > 0)
                    }
                    isLastStep={currentStep === "order-review"}
                    onSubmit={submitOrder}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderManagement;
