
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FoodItem } from "./useMenuItems";
import { toast } from "sonner";

export interface OrderItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  special_instructions?: string;
}

export type OrderStep = 
  | "order-type" 
  | "table-selection" 
  | "customer-info" 
  | "menu-selection" 
  | "order-review" 
  | "confirmation";

export const useOrderManagement = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<"dine-in" | "takeout" | "delivery">("dine-in");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerCount, setCustomerCount] = useState<string>("1");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Step-by-step flow
  const [currentStep, setCurrentStep] = useState<OrderStep>("order-type");

  const goToNextStep = () => {
    switch (currentStep) {
      case "order-type":
        if (orderType === "dine-in") {
          setCurrentStep("table-selection");
        } else {
          setCurrentStep("customer-info");
        }
        break;
      case "table-selection":
        if (!selectedTable) {
          toast.error("Please select a table");
          return;
        }
        setCurrentStep("customer-info");
        break;
      case "customer-info":
        setCurrentStep("menu-selection");
        break;
      case "menu-selection":
        if (orderItems.length === 0) {
          toast.error("Please add items to the order");
          return;
        }
        setCurrentStep("order-review");
        break;
      case "order-review":
        setCurrentStep("confirmation");
        break;
      default:
        break;
    }
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case "table-selection":
        setCurrentStep("order-type");
        break;
      case "customer-info":
        if (orderType === "dine-in") {
          setCurrentStep("table-selection");
        } else {
          setCurrentStep("order-type");
        }
        break;
      case "menu-selection":
        setCurrentStep("customer-info");
        break;
      case "order-review":
        setCurrentStep("menu-selection");
        break;
      case "confirmation":
        setCurrentStep("order-review");
        break;
      default:
        break;
    }
  };

  const resetOrder = () => {
    setOrderItems([]);
    setSelectedTable("");
    setCustomerName("");
    setCustomerCount("1");
    setSpecialInstructions("");
    setCurrentStep("order-type");
  };

  const handleAddToOrder = (foodItem: FoodItem) => {
    const existingItem = orderItems.find(item => item.foodItem.id === foodItem.id);
    
    if (existingItem) {
      setOrderItems(prevItems => 
        prevItems.map(item => 
          item.id === existingItem.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setOrderItems(prevItems => [
        ...prevItems, 
        { 
          id: crypto.randomUUID(), 
          foodItem, 
          quantity: 1 
        }
      ]);
    }
    
    toast.success(`${foodItem.name} added to order`);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
      return;
    }

    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.foodItem.price * item.quantity);
    }, 0);
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Please add items to the order");
      return;
    }

    if (orderType === "dine-in" && !selectedTable) {
      toast.error("Please select a table");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderTotal = calculateTotal();
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          table_id: orderType === "dine-in" ? selectedTable : null,
          customer_name: customerName || null,
          order_type: orderType,
          status: 'pending',
          total_amount: orderTotal,
          notes: specialInstructions || null
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      const orderItemsToInsert = orderItems.map(item => ({
        order_id: order.id,
        food_item_id: item.foodItem.id,
        quantity: item.quantity,
        unit_price: item.foodItem.price,
        total_price: item.foodItem.price * item.quantity,
        special_instructions: item.special_instructions || null
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);
      
      if (itemsError) throw itemsError;
      
      if (orderType === "dine-in" && selectedTable) {
        const { error: tableError } = await supabase
          .from('restaurant_tables')
          .update({ status: 'occupied' })
          .eq('id', selectedTable);
        
        if (tableError) throw tableError;
        
        const { error: guestsError } = await supabase
          .from('table_guests')
          .insert({
            table_id: selectedTable,
            guest_count: parseInt(customerCount),
            notes: specialInstructions || null
          });
        
        if (guestsError) throw guestsError;
      }
      
      toast.success("Order created successfully!");
      resetOrder();
      return order.id;
      
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to create order. Please try again.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Order state
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
    
    // Search state
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    
    // Step management
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    resetOrder,
    
    // Order actions
    handleAddToOrder,
    handleQuantityChange,
    handleRemoveItem,
    calculateTotal,
    handleSubmitOrder
  };
};
