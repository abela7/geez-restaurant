import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { deductIngredientsFromStock } from "@/services/menu/recipeService";

export interface OrderItem {
  id?: string;
  order_id?: string;
  food_item_id: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  special_instructions?: string;
  status?: string;
}

export interface Order {
  id?: string;
  table_id?: string;
  customer_id?: string;
  server_id?: string;
  status?: string;
  order_type?: string;
  total_amount?: number;
  tax_amount?: number;
  discount_amount?: number;
  tip_amount?: number;
  final_amount?: number;
  payment_method?: string;
  payment_status?: string;
  notes?: string;
  customer_name?: string;
  items?: OrderItem[];
}

// Create a new order with items
export const createOrder = async (order: Order): Promise<Order | null> => {
  try {
    // First, create the order
    const { data: newOrder, error } = await supabase
      .from("orders")
      .insert({
        table_id: order.table_id,
        customer_id: order.customer_id,
        server_id: order.server_id,
        status: order.status || "pending",
        order_type: order.order_type || "dine-in",
        total_amount: order.total_amount || 0,
        tax_amount: order.tax_amount || 0,
        discount_amount: order.discount_amount || 0,
        tip_amount: order.tip_amount || 0,
        final_amount: order.final_amount || 0,
        payment_method: order.payment_method,
        payment_status: order.payment_status || "unpaid",
        notes: order.notes,
        customer_name: order.customer_name
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
      return null;
    }

    // Then add the order items if provided
    if (order.items && order.items.length > 0 && newOrder.id) {
      const orderItems = order.items.map((item) => ({
        order_id: newOrder.id,
        food_item_id: item.food_item_id,
        unit_price: item.unit_price,
        quantity: item.quantity,
        total_price: item.total_price,
        special_instructions: item.special_instructions,
        status: item.status || "pending"
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Error adding order items:", itemsError);
        toast.error("Order created but failed to add items");
      } else {
        // Now deduct ingredients from stock for each food item
        for (const item of order.items) {
          // First try to deduct based on dish cost recipe
          const deducted = await deductIngredientsByDishCost(item.food_item_id, item.quantity);
          
          // If no dish cost recipe found, fall back to standard recipe
          if (!deducted) {
            await deductIngredientsFromStock(item.food_item_id, item.quantity);
          }
        }
      }
    }

    toast.success("Order created successfully");
    return newOrder;
  } catch (error) {
    console.error("Unexpected error creating order:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};

// Function to deduct ingredients based on dish cost entries
export const deductIngredientsByDishCost = async (foodItemId: string, quantity: number): Promise<boolean> => {
  try {
    // First, find the dish cost entry for this food item
    const { data: dishCost, error: dishCostError } = await supabase
      .from("dish_costs")
      .select(`
        id, 
        dish_ingredients(*)
      `)
      .eq("food_item_id", foodItemId)
      .single();
    
    if (dishCostError || !dishCost || !dishCost.dish_ingredients || dishCost.dish_ingredients.length === 0) {
      console.log(`No dish cost recipe found for food item ${foodItemId}`);
      return false;
    }
    
    // Process each ingredient from the dish cost recipe
    for (const ingredient of dishCost.dish_ingredients) {
      if (!ingredient.ingredient_id) {
        console.log(`Missing ingredient_id for ingredient in dish ${dishCost.id}`);
        continue;
      }
      
      // Calculate total quantity to deduct
      const deductQuantity = ingredient.quantity * quantity;
      
      // Get current stock level
      const { data: currentStock, error: stockError } = await supabase
        .from("ingredients")
        .select("stock_quantity, unit")
        .eq("id", ingredient.ingredient_id)
        .single();
      
      if (stockError) {
        console.error(`Error fetching stock for ingredient ${ingredient.ingredient_id}:`, stockError);
        continue;
      }
      
      // Calculate new stock level (never go below 0)
      const newStockLevel = Math.max(0, (currentStock.stock_quantity || 0) - deductQuantity);
      
      // Update the stock
      const { error: updateError } = await supabase
        .from("ingredients")
        .update({ stock_quantity: newStockLevel })
        .eq("id", ingredient.ingredient_id);
      
      if (updateError) {
        console.error(`Error updating stock for ingredient ${ingredient.ingredient_id}:`, updateError);
        continue;
      }
      
      // Log transaction
      await supabase.from("inventory_transactions").insert({
        ingredient_id: ingredient.ingredient_id,
        transaction_type: "consumption",
        quantity: -deductQuantity,
        previous_quantity: currentStock.stock_quantity || 0,
        new_quantity: newStockLevel,
        unit: currentStock.unit || ingredient.unit_type,
        notes: `Used in order for dish: ${foodItemId}`,
        reference_id: foodItemId,
        reference_type: "food_item",
        created_by: "order-system"
      });
      
      console.log(`Deducted ${deductQuantity} ${currentStock.unit} of ingredient ${ingredient.ingredient_id} for food item ${foodItemId}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error deducting ingredients from dish cost:", error);
    return false;
  }
};

// Fetch orders
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*");

    if (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching orders:", error);
    toast.error("An unexpected error occurred");
    return [];
  }
};

// Fetch order by ID
export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to fetch order");
      return null;
    }

    return data || null;
  } catch (error) {
    console.error("Unexpected error fetching order:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};

// Update order
export const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
      return null;
    }

    return data || null;
  } catch (error) {
    console.error("Unexpected error updating order:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};

// Delete order
export const deleteOrder = async (orderId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
      return false;
    }

    toast.success("Order deleted successfully");
    return true;
  } catch (error) {
    console.error("Unexpected error deleting order:", error);
    toast.error("An unexpected error occurred");
    return false;
  }
};
