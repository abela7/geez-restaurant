// Only updating the specific line causing the type error
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from '@/contexts/CartContext';
import { OrderType, OrderStep, OrderItem, Order } from '@/types/order';
import { FoodItem } from '@/types/menu';
import { Table as TableType } from '@/types/table';
import { Customer } from '@/types/customer';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Circle, Loader2, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const OrderManagement = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { cart, clearCart, calculateTotalPrice } = useCart();

  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [customerInfo, setCustomerInfo] = useState<Customer | null>(null);
  const [currentStep, setCurrentStep] = useState<OrderStep>("order-type");
  const [availableTables, setAvailableTables] = useState<TableType[]>([]);
	const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Form for customer information
  const customerForm = useForm<z.infer<typeof customerInfoSchema>>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
    },
  })

  useEffect(() => {
    // Fetch available tables on component mount
    fetchAvailableTables();
  }, []);

  const fetchAvailableTables = async () => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('is_available', true);

      if (error) {
        console.error('Error fetching available tables:', error);
        toast.error(t("Failed to fetch available tables"));
        return;
      }

      setAvailableTables(data as TableType[]);
    } catch (error) {
      console.error('Unexpected error fetching available tables:', error);
      toast.error(t("An unexpected error occurred"));
    }
  };

  const handleSelectOrderType = (type: OrderType) => {
    setOrderType(type);
    if (type === 'dine-in') {
      setCurrentStep('table-selection');
			setIsTableDialogOpen(true);
    } else {
      setCurrentStep('customer-info');
    }
  };

  const handleSelectTable = (table: TableType) => {
    setSelectedTable(table);
		setIsTableDialogOpen(false);
    setCurrentStep('customer-info');
  };

  const handleCustomerInfoSubmit = (values: z.infer<typeof customerInfoSchema>) => {
    setCustomerInfo({
      name: values.customerName,
      phone: values.customerPhone,
      email: values.customerEmail,
    });
    setCurrentStep('menu-selection');
  };

  const handleReviewOrder = () => {
    setCurrentStep('order-review');
  };

  const handlePlaceOrder = async () => {
    if (!orderType) {
      toast.error(t("Please select an order type"));
      return;
    }

    if (orderType === 'dine-in' && !selectedTable) {
      toast.error(t("Please select a table"));
      return;
    }

    if (!customerInfo) {
      toast.error(t("Please enter customer information"));
      return;
    }

    if (cart.length === 0) {
      toast.error(t("Your cart is empty"));
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_type: orderType,
          table_id: selectedTable?.id || null,
          customer_name: customerInfo.name,
          total_amount: calculateTotalPrice(),
          status: 'pending',
          notes: orderNotes,
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error(t("Failed to create order"));
        return;
      }

      const orderId = orderData.id;

      // 2. Create order items
      const orderItemsToInsert = cart.map(item => ({
        order_id: orderId,
        food_item_id: item.foodItem.id,
        quantity: item.quantity,
        unit_price: item.foodItem.price,
        total_price: item.foodItem.price * item.quantity,
        special_instructions: item.special_instructions,
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (orderItemsError) {
        console.error('Error creating order items:', orderItemsError);
        toast.error(t("Failed to create order items"));

        // Optionally, delete the created order if items fail to create
        await supabase
          .from('orders')
          .delete()
          .eq('id', orderId);

        return;
      }

      // 3. Update table availability if it's a dine-in order
      if (selectedTable) {
        const { error: tableError } = await supabase
          .from('tables')
          .update({ is_available: false })
          .eq('id', selectedTable.id);

        if (tableError) {
          console.error('Error updating table availability:', tableError);
          toast.error(t("Failed to update table availability"));
        }
      }

      // If everything is successful
      toast.success(t("Order placed successfully"));
      clearCart();
      navigate('/kitchen/orders'); // Redirect to order management page
    } catch (error) {
      console.error('Unexpected error placing order:', error);
      toast.error(t("An unexpected error occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4"><T text="New Order" /></h1>

      {/* Order Type Selection */}
      {currentStep === 'order-type' && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle><T text="Select Order Type" /></CardTitle>
            <CardDescription><T text="Choose how the customer will receive their order." /></CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleSelectOrderType('dine-in')}>
              <T text="Dine-in" />
            </Button>
            <Button variant="outline" onClick={() => handleSelectOrderType('takeout')}>
              <T text="Takeout" />
            </Button>
            <Button variant="outline" onClick={() => handleSelectOrderType('delivery')}>
              <T text="Delivery" />
            </Button>
          </CardContent>
        </Card>
      )}

			{/* Table Selection Dialog */}
			<Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle><T text="Select Table" /></DialogTitle>
						<DialogDescription><T text="Choose an available table for the dine-in order." /></DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						{availableTables.length > 0 ? (
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{availableTables.map(table => (
									<Button 
										key={table.id} 
										variant="outline" 
										onClick={() => handleSelectTable(table)}
									>
										<T text={`Table ${table.table_number}`} />
									</Button>
								))}
							</div>
						) : (
							<p className="text-muted-foreground"><T text="No tables available at the moment." /></p>
						)}
					</div>
				</DialogContent>
			</Dialog>

      {/* Customer Information Form */}
      {currentStep === 'customer-info' && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle><T text="Customer Information" /></CardTitle>
            <CardDescription><T text="Enter the customer's details for the order." /></CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...customerForm}>
              <form onSubmit={customerForm.handleSubmit(handleCustomerInfoSubmit)} className="space-y-4">
                <FormField
                  control={customerForm.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Customer Name" /></FormLabel>
                      <FormControl>
                        <Input placeholder={t("Customer name")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={customerForm.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Phone Number" /> (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder={t("Phone number")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={customerForm.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Email Address" /> (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder={t("Email address")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit"><T text="Continue to Menu" /></Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Menu Selection - Display Cart Items */}
      {currentStep === 'menu-selection' && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle><T text="Menu Selection" /></CardTitle>
            <CardDescription><T text="Review the items in the cart and add any special instructions." /></CardDescription>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-muted-foreground"><T text="No items in cart." /></p>
            ) : (
              <ScrollArea className="h-[400px] mb-4">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
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
                      <div>
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
              className="mb-4"
            />
            <Button onClick={handleReviewOrder} disabled={cart.length === 0}><T text="Review Order" /></Button>
          </CardContent>
        </Card>
      )}

      {/* Order Review */}
      {currentStep === 'order-review' as OrderStep && (
        <Card>
          <CardHeader>
            <CardTitle><T text="Order Review" /></CardTitle>
            <CardDescription><T text="Confirm the order details before placing the order." /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2"><T text="Order Details" /></h2>
              <p><T text="Type" />: {t(orderType)}</p>
              {selectedTable && <p><T text="Table" />: {selectedTable.table_number}</p>}
              <p><T text="Customer" />: {customerInfo?.name}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2"><T text="Items" /></h2>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
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
                  <div>
                    £{(item.foodItem.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold"><T text="Total" />: £{totalPrice.toFixed(2)}</h2>
            </div>
            <Button onClick={handlePlaceOrder} disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> <T text="Placing Order..." /></>
              ) : (
                <T text="Place Order" />
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderManagement;
