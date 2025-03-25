
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Search, ShoppingCart, CreditCard } from "lucide-react";
import { OrderItem } from '@/types/order';
import { QuickOrdersSection } from '@/components/waiter/QuickOrdersSection';

interface MenuSelectionStepProps {
  cart: any[];
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  onReviewOrder: () => void;
  totalPrice: number;
}

export const MenuSelectionStep: React.FC<MenuSelectionStepProps> = ({ 
  cart,
  orderNotes,
  setOrderNotes,
  onReviewOrder,
  totalPrice
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold"><T text="Select Menu Items" /></h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t("Search menu items...")}
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="p-4">
                  <QuickOrdersSection compact={true} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  <T text="Your Order" />
                </h3>
                <Badge>{cart.length}</Badge>
              </div>
              
              {cart.length === 0 ? (
                <div className="bg-muted/50 p-6 rounded-md text-center text-muted-foreground">
                  <T text="Your cart is empty" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-500px)] mb-4">
                  <div className="space-y-3">
                    {cart.map((item: any) => (
                      <div key={item.id} className="flex justify-between pb-3 border-b last:border-b-0 last:pb-0">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="flex text-sm text-muted-foreground">
                            {item.quantity} × £{item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="font-medium">
                          £{(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              <Label htmlFor="order-notes"><T text="Special Instructions" /></Label>
              <Textarea
                id="order-notes"
                placeholder={t("Enter any special instructions for the kitchen")}
                className="min-h-[100px] mb-4 mt-1"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
              
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span><T text="Total" /></span>
                  <span>£{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                disabled={cart.length === 0}
                onClick={onReviewOrder}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                <T text="Review Order" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
