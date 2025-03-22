
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { OrderItem } from "@/types/order";

interface MenuSelectionStepProps {
  cart: OrderItem[];
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
  
  return (
    <Card className="mb-4 mt-4 border border-accent">
      <CardHeader>
        <CardTitle><T text="Menu Selection" /></CardTitle>
        <CardDescription><T text="Review the items in the cart and add any special instructions." /></CardDescription>
      </CardHeader>
      <CardContent>
        {!cart || cart.length === 0 ? (
          <p className="text-muted-foreground p-8 text-center border border-dashed rounded-md">
            <T text="No items in cart. Please add items to continue." />
          </p>
        ) : (
          <ScrollArea className="h-[400px] mb-4">
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border-b border-border">
                  <div>
                    <h3 className="font-medium">{item.foodItem.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity} x £{item.foodItem.price.toFixed(2)}
                    </div>
                    {item.special_instructions && (
                      <div className="text-sm text-muted-foreground italic">
                        <T text="Note" />: {item.special_instructions}
                      </div>
                    )}
                  </div>
                  <div className="font-semibold">
                    £{(item.foodItem.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold"><T text="Total" />:</h2>
          <div className="text-xl font-semibold">£{totalPrice.toFixed(2)}</div>
        </div>
        
        <Textarea 
          placeholder={t("Add order notes...")} 
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          className="mb-4 border-input focus-visible:ring-primary"
        />
        
        <Button 
          onClick={onReviewOrder} 
          disabled={!cart || cart.length === 0}
          className="w-full"
        >
          <T text="Review Order" />
        </Button>
      </CardContent>
    </Card>
  );
};
