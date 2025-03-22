
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from '@/contexts/CartContext';
import { OrderType, OrderStep } from '@/types/order';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from 'lucide-react';
import { StepOrderFlow } from '@/components/waiter/orders/StepOrderFlow';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { useTables } from '@/hooks/useTables';

// Steps components
import { OrderTypeStep } from '@/components/waiter/orders/steps/OrderTypeStep';
import { TableSelectionStep } from '@/components/waiter/orders/steps/TableSelectionStep';
import { CustomerInfoStep } from '@/components/waiter/orders/steps/CustomerInfoStep';
import { MenuSelectionStep } from '@/components/waiter/orders/steps/MenuSelectionStep';
import { OrderReviewStep } from '@/components/waiter/orders/steps/OrderReviewStep';

// Define Zod schema for customer info form
const customerInfoSchema = z.object({
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email({
    message: "Invalid email address.",
  }).optional(),
})

type OrderManagementProps = {
  newOrder?: boolean;
  search?: boolean;
};

const OrderManagement: React.FC<OrderManagementProps> = ({ newOrder, search }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { cart, clearCart, calculateTotalPrice } = useCart();
  const { 
    orderItems,
    orderType, setOrderType,
    currentStep, setCurrentStep,
    goToNextStep, goToPreviousStep,
    selectedTable, setSelectedTable,
    customerName, setCustomerName,
    customerCount, setCustomerCount,
    specialInstructions, setSpecialInstructions,
    isSubmitting, handleSubmitOrder,
    resetOrder,
    handleAddToOrder,
    handleQuantityChange,
    handleRemoveItem,
    calculateTotal
  } = useOrderManagement();
  const { tables, isLoading: tablesLoading } = useTables();

  const [orderNotes, setOrderNotes] = useState<string>('');

  // Form for customer information
  const customerForm = useForm<z.infer<typeof customerInfoSchema>>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
    },
  });

  // If newOrder prop is true, start in order-type step
  useEffect(() => {
    if (newOrder) {
      setCurrentStep('order-type');
    }
  }, [newOrder, setCurrentStep]);

  const handleCustomerInfoSubmit = (values: z.infer<typeof customerInfoSchema>) => {
    setCustomerName(values.customerName);
    setCurrentStep('menu-selection');
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error(t("Your cart is empty"));
      return;
    }
    
    setSpecialInstructions(orderNotes);
    const orderId = await handleSubmitOrder();
    
    if (orderId) {
      toast.success(t("Order placed successfully"));
      clearCart();
      resetOrder();
      navigate('/waiter/orders');
    }
  };

  // Handle errors gracefully
  if (!cart && currentStep === 'menu-selection') {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2"><T text="Loading cart data..." /></h2>
            <p className="text-muted-foreground"><T text="Please wait while we load your cart." /></p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4"><T text="New Order" /></h1>

      {/* Step Order Flow component for the order steps */}
      <StepOrderFlow 
        currentStep={currentStep}
        goToNextStep={goToNextStep}
        goToPreviousStep={goToPreviousStep}
        isSubmitting={isSubmitting}
        canProceed={
          (currentStep === 'menu-selection' && cart && cart.length > 0) ||
          (currentStep !== 'menu-selection')
        }
        isLastStep={currentStep === 'order-review'}
        onSubmit={handlePlaceOrder}
      />

      {/* Order Type Selection Step */}
      {currentStep === 'order-type' && (
        <OrderTypeStep 
          onSelectOrderType={(type: OrderType) => {
            setOrderType(type);
            if (type === 'dine-in') {
              setCurrentStep('table-selection');
            } else {
              setCurrentStep('customer-info');
            }
          }}
        />
      )}

      {/* Table Selection Step */}
      {currentStep === 'table-selection' && (
        <TableSelectionStep 
          tables={tables.filter(table => table.status === 'available')}
          isLoading={tablesLoading}
          onSelectTable={(tableId) => {
            setSelectedTable(tableId);
            setCurrentStep('customer-info');
          }}
        />
      )}

      {/* Customer Information Step */}
      {currentStep === 'customer-info' && (
        <CustomerInfoStep 
          form={customerForm}
          onSubmit={handleCustomerInfoSubmit}
        />
      )}

      {/* Menu Selection Step */}
      {currentStep === 'menu-selection' && (
        <MenuSelectionStep 
          cart={cart}
          orderNotes={orderNotes}
          setOrderNotes={setOrderNotes}
          onReviewOrder={() => setCurrentStep('order-review')}
          totalPrice={calculateTotalPrice()}
        />
      )}

      {/* Order Review Step */}
      {currentStep === 'order-review' && (
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
          handleSubmitOrder={handlePlaceOrder}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default OrderManagement;
