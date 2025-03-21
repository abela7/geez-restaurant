
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Check, Loader2, Minus, Plus, Trash2, UserRound } from "lucide-react";

interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: string;
  location?: string;
}

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  categoryName?: string;
}

interface OrderItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  special_instructions?: string;
}

interface OrderDetailsSectionProps {
  orderItems: OrderItem[];
  handleQuantityChange: (itemId: string, newQuantity: number) => void;
  handleRemoveItem: (itemId: string) => void;
  orderType: string;
  setOrderType: (type: string) => void;
  selectedTable: string;
  setSelectedTable: (tableId: string) => void;
  tables: Table[];
  customerName: string;
  setCustomerName: (name: string) => void;
  customerCount: string;
  setCustomerCount: (count: string) => void;
  specialInstructions: string;
  setSpecialInstructions: (instructions: string) => void;
  calculateTotal: () => number;
  handleSubmitOrder: () => void;
  isSubmitting: boolean;
}

export const OrderDetailsSection: React.FC<OrderDetailsSectionProps> = ({
  orderItems,
  handleQuantityChange,
  handleRemoveItem,
  orderType,
  setOrderType,
  selectedTable,
  setSelectedTable,
  tables,
  customerName,
  setCustomerName,
  customerCount,
  setCustomerCount,
  specialInstructions,
  setSpecialInstructions,
  calculateTotal,
  handleSubmitOrder,
  isSubmitting
}) => {
  const { t } = useLanguage();
  
  return (
    <Card className="sticky top-20">
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-3 flex items-center">
          <T text="Order Summary" />
          <Badge variant="outline" className="ml-2">{orderItems.length}</Badge>
        </h3>
        
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium mb-1 block">
                <T text="Order Type" />
              </label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Select order type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dine-in"><T text="Dine In" /></SelectItem>
                  <SelectItem value="takeout"><T text="Takeout" /></SelectItem>
                  <SelectItem value="delivery"><T text="Delivery" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {orderType === "dine-in" && (
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm font-medium mb-1 block">
                  <T text="Table" />
                </label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select table")} />
                  </SelectTrigger>
                  <SelectContent>
                    {tables
                      .sort((a, b) => a.table_number - b.table_number)
                      .map((table) => (
                        <SelectItem key={table.id} value={table.id}>
                          Table {table.table_number} ({table.capacity} seats)
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium mb-1 block">
                <T text="Customer Name" /> <span className="text-muted-foreground">(<T text="optional" />)</span>
              </label>
              <div className="relative">
                <UserRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t("Enter customer name")} 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            {orderType === "dine-in" && (
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm font-medium mb-1 block">
                  <T text="Number of Guests" />
                </label>
                <Select value={customerCount} onValueChange={setCustomerCount}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select guest count")} />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              <T text="Special Instructions" /> <span className="text-muted-foreground">(<T text="optional" />)</span>
            </label>
            <Textarea 
              placeholder={t("Enter any special instructions or requests")}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        
        <div className="border-t pt-3 mb-3">
          <h4 className="font-medium mb-2"><T text="Items" /> ({orderItems.length})</h4>
          
          {orderItems.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground border border-dashed rounded-md">
              <T text="No items added yet" />
            </div>
          ) : (
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border-b pb-3">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.foodItem.name}</span>
                        <span className="font-bold">${(item.foodItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-auto text-destructive"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between font-bold text-lg mb-4">
            <span><T text="Total" /></span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          
          <Button 
            className="w-full" 
            size="lg"
            disabled={orderItems.length === 0 || isSubmitting}
            onClick={handleSubmitOrder}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            <T text="Place Order" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
