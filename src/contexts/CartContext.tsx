
import React, { createContext, useContext, useState } from 'react';
import { FoodItem } from '@/types/menu';

export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  special_instructions?: string;
  modifiers?: any[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: FoodItem, instructions?: string, modifiers?: any[]) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (foodItem: FoodItem, instructions = '', modifiers = []) => {
    const existingItem = cart.find(
      (item) => 
        item.foodItem.id === foodItem.id && 
        item.special_instructions === instructions &&
        JSON.stringify(item.modifiers || []) === JSON.stringify(modifiers)
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: crypto.randomUUID(),
          foodItem,
          quantity: 1,
          special_instructions: instructions || undefined,
          modifiers: modifiers.length > 0 ? modifiers : undefined,
        },
      ]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      let itemTotal = item.foodItem.price * item.quantity;
      
      if (item.modifiers && item.modifiers.length > 0) {
        const modifierTotal = item.modifiers.reduce((sum, mod) => sum + (mod.price || 0), 0);
        itemTotal += modifierTotal * item.quantity;
      }
      
      return total + itemTotal;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
