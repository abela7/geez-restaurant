
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StepOrderFlow } from "@/components/waiter/orders/StepOrderFlow";
import { OrderTypeStep } from "@/components/waiter/orders/steps/OrderTypeStep";
import { TableSelectionStep } from "@/components/waiter/orders/steps/TableSelectionStep";
import { CustomerInfoStep } from "@/components/waiter/orders/steps/CustomerInfoStep";
import { MenuSelectionStep } from "@/components/waiter/orders/steps/MenuSelectionStep";
import { OrderReviewStep } from "@/components/waiter/orders/steps/OrderReviewStep";
import { useOrderManagement } from "@/hooks/useOrderManagement";
import { useTables } from "@/hooks/useTables";
import { OrderItem } from "@/types/order";
import { FoodItem } from "@/types/menu";

interface OrderManagementProps {
  newOrder?: boolean;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ newOrder = false }) => {
  const { t } = useLanguage();
  const { tables, isLoading: isTablesLoading } = useTables();
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
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    resetOrder,
    handleAddToOrder,
    handleQuantityChange,
    handleRemoveItem,
    calculateTotal,
    handleSubmitOrder
  } = useOrderManagement();

  // Start a new order flow if newOrder is true
  useEffect(() => {
    if (newOrder) {
      resetOrder();
    }
  }, [newOrder]);

  const handleSelectOrderType = (type: 'dine-in' | 'takeout' | 'delivery') => {
    setOrderType(type);
    
    // Auto-advance to the next step
    setTimeout(() => {
      goToNextStep();
    }, 300);
  };

  const handleSelectTable = (tableId: string) => {
    setSelectedTable(tableId);
    
    // Auto-advance to the next step
    setTimeout(() => {
      goToNextStep();
    }, 300);
  };

  const handleAddFoodToOrder = (food: FoodItem) => {
    handleAddToOrder(food);
  };

  const handlePlaceOrder = async () => {
    const orderId = await handleSubmitOrder();
    
    if (orderId) {
      toast.success(t("Order placed successfully!"));
      // Reset and navigate back to dashboard or another view
    }
  };

  // Determine if order can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 'order-type':
        return !!orderType;
      case 'table-selection':
        return orderType !== 'dine-in' || !!selectedTable;
      case 'customer-info':
        return true; // Customer name is optional for most order types
      case 'menu-selection':
        return orderItems.length > 0;
      case 'order-review':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="border shadow-sm">
        <CardContent className="p-4 md:p-6">
          {currentStep === 'order-type' && (
            <OrderTypeStep onSelectOrderType={handleSelectOrderType} />
          )}
          
          {currentStep === 'table-selection' && (
            <TableSelectionStep 
              tables={tables} 
              isLoading={isTablesLoading}
              onSelectTable={handleSelectTable} 
            />
          )}
          
          {currentStep === 'customer-info' && (
            <CustomerInfoStep 
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerCount={customerCount}
              setCustomerCount={setCustomerCount}
              specialInstructions={specialInstructions}
              setSpecialInstructions={setSpecialInstructions}
              orderType={orderType}
            />
          )}
          
          {currentStep === 'menu-selection' && (
            <MenuSelectionStep 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onAddItem={handleAddFoodToOrder}
              orderItems={orderItems}
              onUpdateQuantity={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
            />
          )}
          
          {currentStep === 'order-review' && (
            <OrderReviewStep 
              orderItems={orderItems}
              orderType={orderType}
              tableId={selectedTable}
              customerName={customerName}
              customerCount={customerCount}
              specialInstructions={specialInstructions}
              setSpecialInstructions={setSpecialInstructions}
              onUpdateQuantity={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              total={calculateTotal()}
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={isSubmitting}
              onGoBack={goToPreviousStep}
            />
          )}
          
          {/* Order Flow Navigation */}
          {currentStep !== 'order-review' && (
            <StepOrderFlow
              currentStep={currentStep}
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              isSubmitting={isSubmitting}
              canProceed={canProceed()}
              isLastStep={currentStep === 'menu-selection'}
              onSubmit={currentStep === 'menu-selection' ? () => setCurrentStep('order-review') : undefined}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
